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
var prefixListStudent = '_xsre_list_students_';
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
            return log(err);
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
                        return callback(err);
                    }
                    /**
                     * If student is empty from database
                     */
                    if (!student) {
                        return log('The student not found in database');
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
                            return callback(error);
                        }

                        if (!body) {

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
            return callback(null, data);
        }

        if (!body) {

            return callback(null, data);

        }

        if (response && response.statusCode === 200) {

            utils.xml2js(body, function (err, result) {

                if (err) {
                    return callback(null, data);
                }

                data[studentId] = new xSre(result).getStudentSummary();

                callback(null, data);

            });

        }
    });

};
/**
 * [collectCacheListStudents description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function collectCacheListStudents(done) {

    benchmark.info("CACHE-LIST-STUDENT\tSTART");
    Organization.find({}, function (err, organizations) {

        if (err) {
            return log(err);
        }
        var prefix = "";
        var exit = false;
        var i = 0;
        benchmark.info("CACHE-LIST-STUDENT\tORG FOUND: " + organizations.length);

        _.each(organizations, function (organization) {

            var orgId = organization._id;
            benchmark.info('ORGID: ' + orgId);
            prefix = "CACHE-LIST-STUDENT";
            if(++i >= organizations.length){
                exit = true;
            }
            //console.log(organization);
            var brokerRequest = new Request({
                externalServiceId: organization.externalServiceId,
                personnelId: organization.personnelId,
                authorizedEntityId: organization.authorizedEntityId
            });

            Student.find({
                organization: organization._id
            }, function (err, students) {

                if(err){

                    return benchmark.warn(err);

                }

                benchmark.info(prefix + "\tBEFORE-STUDENTS: " + students.length + "\tORGID: " + organization._id + "\tORG: " + organization.name);

                var studentsAsync = [];

                var studentIds = [];

                var key = prefixListStudent + organization._id;

                cache.del(key, function(err) {

                    students.forEach(function (student) {
                        /**
                         * If student is empty from database
                         */
                        if (!student) {
                            return log('The student not found in database');
                        }

                        //studentsAsync.push(function (callback) {
                        //
                        //    getStudentDetail(brokerRequest, student, organization._id, callback);
                        //
                        //});

                        getStudentDetail(brokerRequest, student, organization._id, function (err, std) {


                            cache.get(key, function (err, data) {

                                if (!data) {
                                    data = {};
                                }
                                /**
                                 * Append data
                                 */
                                for(var k in std){
                                    data[k] = std[k];
                                }

                                cache.set(key, data, {ttl: 86400}, function () {
                                    done();
                                });

                            });

                        });

                    });

                });

                //console.log('ORXXXXXXXXXXXXXXXXXXGID: ' + organization._id, studentsAsync);
                //
                //async.series(studentsAsync, function (err, students) {
                //    benchmark.info('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY: ' + organization._id);
                //    if(err){
                //
                //        return benchmark.warn(err);
                //
                //    }
                //
                //    var newStore = {};
                //
                //    students.forEach(function(st){
                //        for(var k in st){
                //            newStore[k] = st[k];
                //        }
                //    });
                //
                //    //console.log(newStore);
                //
                //    benchmark.info(prefix + "\tAFTER-STUDENTS: " + students.length + "\tORGID: " + organization._id + "\tORG: " + organization.name);
                //
                //    benchmark.info('KEYS: ' + prefixListStudent + organization._id);
                //
                //    cache.set(prefixListStudent + organization._id, newStore, {ttl: 86400}, function () {
                //
                //        done();
                //
                //    });
                //
                //});

            });
        });

    });
}

module.exports = {
    collect: collectDataStudents,
    cache: collectCacheStudents,
    cacheList: collectCacheListStudents
};