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
var l = require('lodash');
var xmlParser = require('js2xmlparser');
var moment = require('moment');
var config = require('config'), xsreConfig = config.get('hzb').xsre;

var Request = require(libPath+'/broker/request');
var request = require('./request');
var con = require('./mysql');
var parseString = require('xml2js').parseString;
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
//function dumpDataDistrictId(done){
//    readline.createInterface({
//        input: fs.createReadStream(filename),
//        terminal: false
//    }).on('line', function(line) {
//        return;
//        Student.findOne({first_name: "Student " + line, last_name: "Test"}, function(err, student){
//            console.log('MASUP');
//            if(err){
//                return console.log(err);
//            }
//            if(!student){
//                student = new Student();
//                student.district_student_id = line;
//                student.emergency1_phone = "";
//                student.emergency2_phone = "";
//                student.first_name = "Student " + line;
//                student.last_name = "Test";
//                student.organization =  mongoose.Types.ObjectId("55913fc817aac10c2bbfe1e8");
//                student.phone = "";
//                student.school_district = "seattle";
//                student.save(function(){
//                    console.log('Add student: ', line, ' => ', student._id);
//                });
//            } else {
//                console.log('GET ', line);
//            }
//
//        });
//    });
//}
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
            console.log('PUSH STUDENTS: ' + collections.length);
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
 *
 * @param force
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

function queue(done){
    new request().clearParam().queue('d9979ac0-a36a-4f71-8fc4-331153d92e57', done);
}
/**
 *
 * @param done
 */
function pullStudent(done){
    var masterTable = '`students`';
    var backupTable = '`students__`';
    var t1 = '`student_programs`';
    var t2 = '`student_programs__`';

    con.query('create table ' + backupTable + ' like ' + masterTable, function(err, results){
        con.query('create table ' + t2 + ' like ' + t1, function(err, results){
            /**
             *
             * @param organization
             * @param callback
             */
            function pullMap(organization, callback){

                new request().clearParam().get(function(err, res, body){
                    if(err){
                        callback(null, organization);
                        return;
                    }
                    var result;
                    //console.log(body);
                    try{
                        result = JSON.parse(body);
                    } catch(e){
                        callback(null, organization);
                        return;
                    }
                    //var result = JSON.parse(fs.readFileSync(rootPath + '/data/response.json', 'utf8'));
                    //require('fs').writeFile(rootPath + '/data/' + organization.name + '.json', body, function(err){});

                    var studentList = null;

                    if(result){
                        studentList = result;
                    }

                    if(studentList !== null){
                        console.log(organization.name, ' >>> STUDENT LIST: ', studentList.length);
                        async.each(studentList, function(student, cb){
                            var xSre = l.get(student, 'xSre');
                            var students = {
                                id: student.organization.refId,
                                org_name: student.organization.organizationName,
                                student_id: student.id,
                                school_district: (student.organization.zoneId + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
                                    return $1.toUpperCase();
                                }),
                                school: "",
                                first_name: "",
                                last_name: "",
                                grade_level: "",
                                ethnicity: "",
                                gender: ""
                            };

                            if(xSre){
                                students.gender = l.get(xSre, 'demographics.sex');
                                students.school = l.get(xSre, 'enrollment.school.schoolName');
                                students.first_name = l.get(xSre, 'name.givenName');
                                students.last_name = l.get(xSre, 'name.familyName');
                                students.grade_level = l.get(xSre, 'enrollment.gradeLevel');
                                students.ethnicity = l.get(xSre, 'demographics.races.race.race');
                            }

                            var studentPrograms = {};
                            var studentProgramData = [];

                            if(student.studentActivity){
                                if(_.isObject(student.studentActivity)){
                                    _.values(student.studentActivity).forEach(function(programs){
                                        if(programs.title){
                                            studentPrograms[programs.refId] = programs.title;
                                        }
                                    });
                                }
                            }

                            if(student.programs && student.programs.activities && student.programs.activities.activity){
                                if(_.isObject(student.programs.activities.activity)){
                                    _.values(student.programs.activities.activity).forEach(function(activity){
                                        if(activity.studentActivityRefId in studentPrograms){
                                            var tags = [];
                                            if(activity.tags){
                                                if(!_.isArray(activity.tags.tag)){
                                                    tags.push(activity.tags.tag);
                                                } else if(_.isObject(activity.tags.tag)){
                                                    tags = _.values(activity.tags.tag);
                                                } else{
                                                    tags = activity.tags.tag;
                                                }
                                            }
                                            studentProgramData.push({
                                                program_id: activity.studentActivityRefId,
                                                student_id: students.student_id,
                                                program_name: studentPrograms[activity.studentActivityRefId],
                                                cohorts: tags.join(",")
                                            });
                                        }
                                    });
                                }
                            }
                            //console.log(students);
                            con.query('INSERT INTO ' + backupTable + ' SET ?', students, function(err, result){
                                if(err){
                                    console.log('INSERT ERROR: ', err);
                                }
                                if(studentProgramData.length > 0){
                                    con.query('INSERT INTO ' + t2 + ' SET ?', studentProgramData, function(err, result){
                                        cb(null, result);
                                    });
                                } else{
                                    cb(null, result);
                                }
                            });
                        }, function(err, data){
                            callback(null, organization);
                        });
                    } else{
                        callback(null, organization);
                    }

                }, 2, "(organization/organizationName='" + organization.name + "')");
            }


            Organization.find({}, function(err, organizations){
                var sql = 'TRUNCATE TABLE ' + backupTable;
                con.query(sql, function(err, results){
                    async.each(organizations, pullMap, function(err, data){
                        if(err){
                            benchmark.info(err);
                        }

                        benchmark.info(
                            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DONE'
                        );
                        var sql = 'DROP TABLE ' + masterTable;
                        con.query(sql, function(err, results){
                            if(err){
                                console.log(err);
                            }
                            sql = 'RENAME TABLE ' + backupTable + ' TO ' + masterTable;
                            con.query(sql, function(err, results){
                                if(err){
                                    console.log(err);
                                }
                                var sql = 'DROP TABLE ' + t1;
                                con.query(sql, function(err, results){
                                    if(err){
                                        console.log(err);
                                    }
                                    sql = 'RENAME TABLE ' + t2 + ' TO ' + t1;
                                    con.query(sql, function(err, results){
                                        if(err){
                                            console.log(err);
                                        }
                                        con.end(function(err){
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
/**
 *
 * @param error
 * @param ok
 */
function pullStudentAsync(error, ok){
    var masterTable = '`students`';
    var backupTable = '`students__`';
    var t1 = '`student_programs`';
    var t2 = '`student_programs__`';

    /**
     *
     * @param err
     */
    function done(err){
        if(err){
            con.end(function(e){
                if(e){
                    ok(e);
                } else{
                    ok(err);
                }
            });
        } else{
            con.end(function(err){
                ok(err);
            });
        }
    }
    con.query('create table ' + backupTable + ' like ' + masterTable, function(err, results){
        con.query('create table ' + t2 + ' like ' + t1, function(err, results){
            /**
             *
             * @param organization
             * @param callback
             */
            function pullMap(organization, callback){

                new request().clearParam().get(function(err, res, body){
                    if(err){
                        callback(null, organization);
                        return;
                    }

                    var result = JSON.parse(body);
                    //var result = JSON.parse(fs.readFileSync(rootPath + '/data/response.json', 'utf8'));
                    //require('fs').writeFile(rootPath + '/data/' + organization.name + '.json', body, function(err){});

                    var studentList = null;

                    if(result){
                        studentList = result;
                    }
                    if(studentList !== null){
                        console.log(organization.name, ' >>> STUDENT LIST: ', studentList.length);
                        async.each(studentList, function(student, cb){
                            var xSre = l.get(student, 'xSre');
                            var students = {
                                id: student.organization.refId,
                                org_name: student.organization.organizationName,
                                student_id: student.id,
                                school_district: (student.organization.zoneId + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
                                    return $1.toUpperCase();
                                }),
                                school: "",
                                first_name: "",
                                last_name: "",
                                grade_level: "",
                                ethnicity: "",
                                gender: ""
                            };

                            if(xSre){
                                students.gender = l.get(xSre, 'demographics.sex');
                                students.school = l.get(xSre, 'enrollment.school.schoolName');
                                students.first_name = l.get(xSre, 'name.givenName');
                                students.last_name = l.get(xSre, 'name.familyName');
                                students.grade_level = l.get(xSre, 'enrollment.gradeLevel');
                                students.ethnicity = l.get(xSre, 'demographics.races.race.race');
                            }

                            var studentPrograms = {};
                            var studentProgramData = [];

                            if(student.studentActivity){
                                if(!_.isArray(student.studentActivity)){
                                    student.studentActivity = [student.studentActivity];
                                }
                                student.studentActivity.forEach(function(programs){
                                    if(programs.title){
                                        studentPrograms[programs.refId] = programs.title;
                                    }
                                });
                            }

                            if(student.programs && student.programs.activities && student.programs.activities.activity){
                                if(!_.isArray(student.programs.activities.activity)){
                                    student.programs.activities.activity = [student.programs.activities.activity];
                                }
                                student.programs.activities.activity.forEach(function(activity){
                                    if(activity.studentActivityRefId in studentPrograms){
                                        var tags = [];
                                        if(activity.tags){
                                            if(!_.isArray(activity.tags.tag)){
                                                tags.push(activity.tags.tag);
                                            } else{
                                                tags = activity.tags.tag;
                                            }
                                        }
                                        studentProgramData.push({
                                            program_id: activity.studentActivityRefId,
                                            student_id: students.student_id,
                                            program_name: studentPrograms[activity.studentActivityRefId],
                                            cohorts: tags.join(",")
                                        });
                                    }
                                });
                            }
                            //console.log(students);
                            con.query('INSERT INTO ' + backupTable + ' SET ?', students, function(err, result){
                                if(err){
                                    console.log('INSERT ERROR: ', err);
                                }
                                if(studentProgramData.length > 0){
                                    con.query('INSERT INTO ' + t2 + ' SET ?', studentProgramData, function(err, result){
                                        cb(null, result);
                                    });
                                } else{
                                    cb(null, result);
                                }
                            });
                        }, function(err, data){
                            callback(null, organization);
                        });
                    } else{
                        callback(null, organization);
                    }

                }, 2, "(organization/organizationName='" + organization.name + "')");
            }


            Organization.find({}, function(err, organizations){
                var sql = 'TRUNCATE TABLE ' + backupTable;
                con.query(sql, function(err, results){
                    async.each(organizations, pullMap, function(err, data){
                        if(err){
                            benchmark.info(err);
                        }

                        benchmark.info(
                            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DONE'
                        );
                        var sql = 'DROP TABLE ' + masterTable;
                        con.query(sql, function(err, results){
                            if(err){
                                return done(err);
                            }
                            sql = 'RENAME TABLE ' + backupTable + ' TO ' + masterTable;
                            con.query(sql, function(err, results){
                                if(err){
                                    return done(err);
                                }
                                var sql = 'DROP TABLE ' + t1;
                                con.query(sql, function(err, results){
                                    if(err){
                                        return done(err);
                                    }
                                    sql = 'RENAME TABLE ' + t2 + ' TO ' + t1;
                                    con.query(sql, function(err, results){
                                        if(err){
                                            return done(err);
                                        }
                                        con.end(function(err){
                                            done(err);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    collect: collectDataStudents,
    cache: collectCacheStudents,
    cacheList: collectCacheListStudentsAsync,
    cacheDebug: cacheDebug,
    queue: queue,
    //dumpDataDistrictId: dumpDataDistrictId,
    pullStudent: pullStudent,
    pullStudentAsync: pullStudentAsync
};