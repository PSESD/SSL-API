'use strict';
/**
 * Created by zaenal on 22/09/15.
 */
var mongoose = require('mongoose');
var rootPath = __dirname + '/../../';
var appPath = rootPath + 'app';
var libPath = rootPath + 'lib';
require('./db');
var Student = require(appPath+'/models/Student');
var StudentProgram = require(appPath+'/models/StudentProgram');
var Organization = require(appPath+'/models/Organization');
var Program = require(appPath+'/models/Program');
var User = require(appPath+'/models/User');
var Tag = require(appPath+'/models/Tag');
var _ = require('underscore');
var xmlParser = require('js2xmlparser');
var moment = require('moment');
var config = require('config'), xsreConfig = config.get('hzb').xsre;

var Request = require(libPath+'/broker/request');
var utils = require(libPath+'/utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5, benchmark = utils.benchmark();
var xSre = require(libPath+'/xsre');
var async = require('async');
var districtFile = rootPath + '/test/data/districts';
var fs = require('fs');
var readline = require('readline');
var filename = districtFile;
var prefixListStudent = '_xsre_list_students_';

function cacheDebug(done){
    var key = prefixListStudent + '*';
    cache.get(key, function(err, data){
        benchmark.info(key, ' >>>>>>>>>>>>>>> DATA >>>>>>>>>>>>>>', data);
        done();
    });
}
/**
 *
 */
function dumpDataDistrictId(done){
    readline.createInterface({
        input: fs.createReadStream(filename),
        terminal: false
    }).on('line', function(line) {
        return;
        Student.findOne({first_name: "Student " + line, last_name: "Test"}, function(err, student){
            console.log('MASUP');
            if(err){
                return console.log(err);
            }
            if(!student){
                student = new Student();
                student.district_student_id = line;
                student.emergency1_phone = "";
                student.emergency2_phone = "";
                student.first_name = "Student " + line;
                student.last_name = "Test";
                student.organization =  mongoose.Types.ObjectId("55913fc817aac10c2bbfe1e8");
                student.phone = "";
                student.school_district = "seattle";
                student.save(function(){
                    console.log('Add student: ', line, ' => ', student._id);
                });
            } else {
                console.log('GET ', line);
            }

        });
    });
}
/**
 *
 * @param callback
 */
function collectDataStudents(callback) {
    var collections = [];

    /**
     *
     * @param organization
     * @param done
     */
    function processStudent(organization, done) {

        Student.find({organization: organization._id}, function (err, students) {

            if (err) {
                return done(err);
            }

            if (!students) {
                return done('Data students not found');
            }

            async.each(students, function (student, cb) {
                var CBOStudent = {
                    '@': {
                        id: student._id.toString()
                    },
                    organization: {
                        '@': {
                            refId: student.organization.toString()
                        },
                        organizationName: organization.name,
                        externalServiceId: organization.externalServiceId,
                        personnelId: organization.personnelId,
                        authorizedEntityId: organization.authorizedEntityId,
                        districtStudentId: student.district_student_id,
                        zoneId: student.school_district,
                        contextId: xsreConfig.contextId
                    },

                    studentActivity: [],

                    programs: {
                        activities: {
                            activity: []
                        }
                    }

                };

                //var orgName = organization.name;
                //var website = organization.website;
                //var url = organization.url;
                //var studentId = student._id.toString();

                var programsId = {};

                var programId = [];

                _.each(student.programs, function (program) {

                    if (Object.keys(programsId).indexOf(program.program.toString()) === -1) {
                        programsId[program.program.toString()] = [];
                    }

                    programsId[program.program.toString()].push(program.toObject());

                    programId.push(program.program);

                    CBOStudent.programs.activities.activity.push({
                        studentActivityRefId: program.program.toString(),
                        startDate: moment(new Date(program.participation_start_date)).format('MM/DD/YYYY'),
                        endDate: moment(new Date(program.participation_end_date)).format('MM/DD/YYYY'),
                        active: program.active,
                        tags: {
                            tag: program.cohort
                        }

                    });

                });

                if (!_.isEmpty(programsId)) {

                    Program.find({_id: {$in: programId}}, function (err, programs) {

                        if (err) {
                            return cb(err);
                        }

                        _.each(programs, function (program) {

                            if (program._id.toString() in programsId) {

                                programsId[program._id.toString()].forEach(function (prgm) {

                                    CBOStudent.studentActivity.push({
                                        '@': {
                                            refId: program._id.toString()
                                        },
                                        title: program.name
                                    });

                                });

                            }

                        });

                        collections.push(CBOStudent);

                        cb();

                    });

                } else {

                    collections.push(CBOStudent);

                    cb();

                }

            }, done);

        });
    }

    Organization.find({}, function (err, organizations) {

        if (err) {
            throw new Error(err);
        }

        if (!organizations) {
            throw new Error('Data organizations not found');
        }


        async.each(organizations, processStudent, function (err) {

            callback(xmlParser('CBOStudents', {CBOStudent: collections}, {
                declaration: {
                    encoding: 'utf-8'
                }
            }));

        });

    });
}
/**
 * [collectCacheStudents description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function collectCacheStudents(done) {

    benchmark.info('CACHE-STUDENT: START');
    Organization.find({}, function (err, organizations) {

        if (err) {
            return benchmark.info(err);
        }

        var exit = false;
        var i = 0;
        benchmark.info("CACHE-STUDENT\tORG FOUND: " + organizations.length);
        _.each(organizations, function (organization) {

            if(++i >= organizations.length){
                exit = true;
            }

            Student.find({
                organization: organization._id
            }, function (err, students) {

                benchmark.info('CACHE-STUDENT: GET STUDENT LIST COUNT => ' + students.length);
                async.each(students, function (student, callback) {

                    var orgId = organization._id;

                    var studentId = student._id;

                    if (err) {
                        benchmark.info(err);
                        return callback(err);
                    }
                    /**
                     * If student is empty from database
                     */
                    if (!student) {
                        return benchmark.info('The student not found in database');
                    }

                    var brokerRequest = new Request({
                        externalServiceId: organization.externalServiceId,
                        personnelId: organization.personnelId,
                        authorizedEntityId: organization.authorizedEntityId
                    });
                    /**
                     * Request can handle store into cache, so we use force to store or update the data
                     */
                    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                        if (error) {
                            benchmark.info(error);
                            return callback(error);
                        }

                        if (!body) {
                            benchmark.info('Data not found in database xsre');
                            return callback('Data not found in database xsre');

                        }

                        callback(null, body);

                    }, true);

                }, function () {
                    done();
                });
            });
        });

    });
}
/**
 * [getStudentDetail description]
 * @param  {[type]}   brokerRequest [description]
 * @param  {[type]}   student       [description]
 * @param  {[type]}   orgId         [description]
 * @param  {Function} callback      [description]
 * @return {[type]}                 [description]
 */
var getStudentDetail = function (brokerRequest, student, orgId, callback) {

    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

        var studentId = student._id.toString();

        var data = {};

        data[studentId] = null;

        if (error) {
            benchmark.info('Body was empty');
            return callback(null, data);
        }

        if (!body) {
            benchmark.info(error);
            return callback(null, data);

        }

        if (response && response.statusCode === 200) {

            utils.xml2js(body, function (err, result) {

                if (err) {
                    benchmark.info(error);
                    return callback(null, data);
                }

                data[studentId] = new xSre(result).getStudentSummary();

                callback(null, data);

            });

        }
    });

};
/**
 *
 * @param done
 */
function collectCacheListStudentsAsync(force, done) {

    benchmark.info("CACHE-LIST-STUDENT\tSTART");
    Organization.find({}, function (err, organizations) {

        if (err) {
            return benchmark.info(err);
        }
        var prefix = "";
        benchmark.info("CACHE-LIST-STUDENT\tORG FOUND: " + organizations.length);

        /**
         *
         * @param organization
         * @param callback
         */
        var map = function(organization, callback){
            var orgId = organization._id;
            benchmark.info('ORGID: ' + orgId);
            prefix = "CACHE-LIST-STUDENT";
            var brokerRequest = new Request({
                externalServiceId: organization.externalServiceId,
                personnelId: organization.personnelId,
                authorizedEntityId: organization.authorizedEntityId
            });

            /**
             *
             * @param student
             * @param cb
             */
            var mapStudent = function(student, cb){

                var studentId = student._id.toString();

                var data = {};

                data[studentId] = null;
                /**
                 * If student is empty from database
                 */
                if (!student) {
                    benchmark.info('The student not found in database');
                    return cb(null, data);
                }

                brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                    if (error) {
                        benchmark.info(error);
                        return cb(null, data);
                    }

                    if (!body) {
                        benchmark.info(error);
                        return cb(null, data);

                    }

                    if (response && response.statusCode === 200) {

                        utils.xml2js(body, function (err, result) {

                            if (err) {
                                benchmark.info(err);
                                return cb(null, data);
                            }
                            var msg;

                            if(result && 'error' in result){

                                msg = result.error.message ? result.error.message : result.error;
                                console.log('X1:', result);
                                if(!msg){
                                    msg = 'Data not found!';
                                }
                                benchmark.info('XSRE - ERROR BODY: ' + msg);
                                return cb(null, data);

                            }

                            if(result && 'Error' in result){

                                msg = result.Error.Message ? result.Error.Message : result.Error;
                                if(!msg){
                                    msg = 'Data not found!';
                                }
                                benchmark.info('XSRE - ERROR BODY: ' + msg);
                                return cb(null, data);

                            }

                            benchmark.info('XSRE - CREATE AND MANIPULATE XSRE OBJECT');

                            data[studentId] = new xSre(result).getStudentSummary();

                            cb(null, data);

                        });

                    } else {
                        cb(null, data);
                    }
                }, force);

            };

            Student.find({
                organization: organization._id
            }, function (err, students) {

                if(err){
                    benchmark.warn(err);
                    return callback(null, organization);
                }

                benchmark.info(prefix + "\tBEFORE-STUDENTS: " + students.length + "\tORGID: " + organization._id + "\tORG: " + organization.name);

                var key = prefixListStudent + organization._id;

                var studentAsync = [];

                students.forEach(function(student){
                    studentAsync.push(function(pop){
                        mapStudent(student, pop);
                    });
                });

                async.series(studentAsync, function(err, stds){
                    if(err){
                        benchmark.info('ERROR: ', err);
                    }
                    if(!stds){
                        benchmark.info(
                            'FAILED POPULATE THE DATA'
                        );
                    }
                    benchmark.info('Store student into the cache: ', stds.length);
                    /**
                     * Filter stds
                     */
                    var datas = {};
                    stds.forEach(function(std){
                        for(var sk in std){
                            datas[sk] = std[sk];
                        }
                    });

                    benchmark.info('Store student into the cache after filter: ', Object.keys(datas).length);
                    cache.set(key, datas, {ttl: 86400}, function () {
                        benchmark.info('Cache student from org: ', organization.name);
                        callback(null, organization);
                    });
                });

            });
        };

        async.each(organizations, map, function (err, data) {
            if(err){
                benchmark.info(err);
            }

            benchmark.info(
              '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DONE'
            );
            done(err, data);
        });

    });
}

module.exports = {
    collect: collectDataStudents,
    cache: collectCacheStudents,
    cacheList: collectCacheListStudentsAsync,
    cacheDebug: cacheDebug,
    dumpDataDistrictId: dumpDataDistrictId
};