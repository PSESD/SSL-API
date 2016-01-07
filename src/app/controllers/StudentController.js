'use strict';
/**
 * Created by zaenal on 03/06/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var Program = require('../models/Program');
var User = require('../models/User');
var Organization = require('../models/Organization');
var BaseController = require('./BaseController');
var _ = require('underscore');
var Request = require('../../lib/broker/request');
var utils = require('../../lib/utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5, benchmark  = utils.benchmark();
var ObjectId = mongoose.Types.ObjectId;
var StudentController = new BaseController(Student).crud();
var hal = require('hal');
var xSre = require('../../lib/xsre');
var async = require('async');
var prefixListStudent = '_xsre_list_students_';

/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
StudentController.getStudentsBackpack = function (req, res) {

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var separate = req.params.separate;

    var usePagination = false;

    if(!separate) {

        separate = 'xsre';

    }

    if(separate !== 'general' && separate !== 'xsre'){

        usePagination = true;

    }

    benchmark.info('XSRE - START GET STUDENT BACKPACK');

    var showRaw = false;

    if('raw' in req.query && (parseInt(req.query.raw) > 0 || req.query.raw === 'true')) {
        showRaw = true;
    }
    benchmark.info('XSRE - GET STUDENT');

    Student.protect(req.user.role, { value: studentId }, req.user).findOne({_id: studentId, organization: orgId}, function (err, student) {

        if (err)  { return res.sendError(err); }
        /**
         * If student is empty from database
         */
        if (!student) {
            return res.sendError('The student not found in database');
        }

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district, req.params.format, separate].join('_'));
        //key = new Date().getTime();
        /**
         *
         * @param results
         * @param isFromCache
         */
        function embeds(results, isFromCache){

            res.header('X-Cached-Sre' , isFromCache ? 1 : 0 );

            benchmark.info('XSRE - EMBED RESULTS => ' + (isFromCache ? ' FROM CACHE' : ' FROM SERVER'));

            /**
             * Defined paging here
             */
            if(usePagination !== false){

                benchmark.info('XSRE - USING PAGINATION ON( ' + separate + ')');

                benchmark.info('XSRE - FINISH');

                if(results.raw) {

                    delete results.raw;

                }

                var paginate = {
                    total: 0,
                    pageSize: 10,
                    pageCount: 0,
                    currentPage: 1,
                    data: [],
                    source: {}
                };

                var arrayList = [];

                if(separate === 'transcript'){

                    paginate.source = _.clone(results);

                    delete paginate.source.details;

                    results = results.details;

                }

                paginate.total = results.length;

                if (typeof req.query.page !== 'undefined') {

                    paginate.currentPage = +req.query.page;

                }

                if (typeof req.query.pageSize !== 'undefined') {

                    if(req.query.pageSize !== 'all'){

                        paginate.pageSize = paginate.total;

                    } else {

                        paginate.pageSize = +req.query.pageSize;

                    }
                }


                //split list into groups
                while (results.length > 0) {

                    arrayList.push(results.splice(0, paginate.pageSize));

                }

                paginate.data = arrayList[+paginate.currentPage - 1];

                paginate.pageCount = Math.ceil(paginate.total/paginate.pageSize);

                var resource = new hal.Resource(paginate, req.originalUrl);

                if(paginate.currentPage + 1 <= paginate.pageCount) {
                    var nextUrl = req.originalUrl;
                    if(nextUrl.indexOf('?') === -1){
                        nextUrl += '?';
                    } else {
                        nextUrl += '&';
                    }
                    resource.link(new hal.Link('nextUrl', nextUrl + 'page=' + (+paginate.currentPage + 1)));
                }

                return res.sendSuccess(null, resource.toJSON());

            }

            results.personal.collageBound = student.collage_bound;
            results.personal.phone = student.phone;
            results.personal.email = student.email;
            results.personal.firstName = student.first_name;
            results.personal.lastName = student.last_name;
            results.personal.middleName = student.middle_name;
            results.personal.schoolDistrict = student.school_district;
            results.personal.address = student.addresses;

            results.personal.emergency1 = {
                name: student.emergency1_name,
                relationship: student.emergency1_relationship,
                email: student.emergency1_email,
                phone: student.emergency1_phone,
                mentor: student.mentor1_name
            };

            results.personal.emergency2 = {
                name: student.emergency2_name,
                relationship: student.emergency2_relationship,
                email: student.emergency2_email,
                phone: student.emergency2_phone,
                mentor: student.mentor2_name
            };


            if(showRaw){

                res.header('Content-Type', 'text/xml');

                return res.send(results.raw);

            }

            if(results.raw) {
                delete results.raw;
            }

            res.xmlOptions = res.xmlKey = 'CBOStudentDetail';

            res.bigXml = true;

            var crit = {
                permissions: {
                    $elemMatch: {
                        organization: orgId,
                        students: studentId
                    }
                }
            };
            benchmark.info('XSRE - EMBED USER');
            User.find(crit, function(err, users){

                if (err)  { return res.sendError(err); }

                if(!users) {
                    users = [];
                }

                var resource = new hal.Resource(results, req.originalUrl);

                var embedsUsers = [];

                var embedsPrograms = [];

                _.each(users, function(user){

                    var fullname = [];

                    if(user.first_name) {
                        fullname.push(user.first_name);
                    }
                    if(user.middle_name) {
                        fullname.push(user.middle_name);
                    }
                    if(user.last_name) {
                        fullname.push(user.last_name);
                    }

                    embedsUsers.push(new hal.Resource({
                        id: user._id.toString(),
                        email: user.email,
                        fullname: fullname.join(' ')
                    }, '/'+orgId+'/users/'+user._id));

                });

                var programsId = {};

                var programId = [];

                _.each(student.programs, function(program){

                    if(Object.keys(programsId).indexOf(program.program.toString()) === -1) {
                        programsId[program.program.toString()] = [];
                    }

                    programsId[program.program.toString()].push(program.toObject());

                    programId.push(program.program);

                });

                if(!_.isEmpty(programsId)){
                    benchmark.info('XSRE - EMBED PROGRAM');
                    Program.find({ _id: { $in: programId } }, function(err, programs){

                        if (err)  { return res.sendError(err); }

                        _.each(programs, function(program){

                            if(program._id.toString() in programsId){

                                programsId[program._id.toString()].forEach(function(prgm){

                                    prgm.program_name = program.name;

                                    embedsPrograms.push(new hal.Resource(prgm));

                                });

                            }

                        });

                        resource.embed('users', embedsUsers);

                        resource.embed('programs', embedsPrograms);

                        benchmark.info('XSRE - FINISH');

                        res.sendSuccess(null, resource.toJSON());

                    });


                } else {

                    resource.embed('users', embedsUsers);

                    resource.embed('programs', embedsPrograms);

                    benchmark.info('XSRE - FINISH');

                    res.sendSuccess(null, resource.toJSON());

                }

            });
        }
        benchmark.info('XSRE - GET ORGANIZATION');

        Organization.findOne({ _id: orgId }, function(err, organization){

            if (err)  { return res.sendError(err); }
            /**
             * If organization is empty from database
             */
            if (!organization) {
                return res.sendError('The organization not found in database');
            }

            var brokerRequest = new Request({
                externalServiceId: organization.externalServiceId,
                personnelId: organization.personnelId,
                authorizedEntityId: organization.authorizedEntityId
            });

            cache.get(key, function(err, result){

                if(err) {
                    log(err);
                }

                if(!result){
                    benchmark.info('XSRE - REQUEST XSRE');
                    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {
                        benchmark.info('XSRE - GET RESPONSE');
                        if (error)  {
                            return res.sendError(error);
                        }

                        if (!body) {

                            res.statusCode = response.statusCode || 404;

                            return res.sendError('Data not found in database xsre');

                        }

                        if (response && response.statusCode === 200) {
                            benchmark.info('XSRE - PARSING DATA FROM XML TO JS');
                            utils.xml2js(body, function (err, result) {

                                if (err)  { return res.sendError(err); }
                                benchmark.info('XSRE - CREATE AND MANIPULATE XSRE OBJECT');

                                var object = null;

                                var xsre = new xSre(result, body, separate).setLogger(benchmark);

                                if(usePagination === false){

                                    object = xsre.toObject();

                                } else {


                                    switch (separate){

                                        case 'attendance':
                                            object = xsre.getAttendanceBehavior().getAttendances();
                                            break;
                                        case 'transcript':
                                            object = xsre.getTranscript().getTranscript();
                                            break;
                                        case 'assessment':
                                            object = xsre.getAssessment().getAssessment();
                                            break;

                                    }

                                }

                                /**
                                 * Set to cache
                                 */
                                benchmark.info('XSRE - SET TO CACHE');
                                cache.set(key, object, function(err){

                                    log(err);

                                    embeds(object);

                                });

                            });

                        } else {
                            benchmark.info('XSRE - PARSING DATA ERROR FROM XML TO JS');
                            utils.xml2js(body, function (err, result) {

                                var json = (result && 'error' in result) ? result.error.message : 'Error not response';
                                benchmark.info('XSRE - FINISH');
                                res.sendError(json);

                            });
                        }
                    });

                } else {

                    embeds(result, 1);

                }

            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.deleteCacheStudentsBackpack = function(req, res){

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var separate = req.query.separate || 'xsre';

    if(!separate) {

        separate = 'xsre';

    }

    Student.protect(req.user.role, { value: studentId }, req.user).findOne({_id: studentId, organization: orgId}, function (err, student) {

        if (err)  { return res.sendError(err); }
        /**
         * If student is empty from database
         */
        if (!student) {
            return res.sendError('The student not found in database');
        }

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district, req.params.format, separate].join('_'));

        Organization.findOne({ _id: orgId }, function(err, organization){

            if (err)  { return res.sendError(err); }
            /**
             * If organization is empty from database
             */
            if (!organization) {
                return res.sendError('The organization not found in database');
            }

            cache.del(key, function(err){

                if (err){

                    log(err, 'error');

                    return res.sendError('Delete cache error');

                }

                key = md5(['_xSre_', orgId.toString(), student._id.toString(), student.district_student_id, student.school_district].join('_'));

                cache.del(key, function(){

                    if(separate === 'xsre'){

                        key = new Request().clearCacheXsreKey(student.district_student_id, student.school_district, organization);

                        cache.del(key, function(){

                            res.sendSuccess('Delete cache successfully');

                        });

                    } else{

                        res.sendSuccess('Delete cache successfully');

                    }

                });

            });
        });

    });
};
/**
 *
 * @param brokerRequest
 * @param student
 * @param orgId
 * @param callback
 */
StudentController.getStudentDetail = function(brokerRequest, student, orgId, callback){

    var key = md5(['_xSre_', orgId.toString(), student._id.toString(), student.district_student_id, student.school_district].join('_'));

    cache.get(key, function(err, result){

        if(err)  {
            return callback(null, student, false);
        }

        if(!result){

            brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                if (error)  {
                    return callback(null, student, false);
                }

                if (!body) {

                    return callback(null, student, false);

                }

                if (response && response.statusCode === 200) {

                    utils.xml2js(body, function (err, result) {

                        if (err)  { return callback(null, student, false); }

                        var object = new xSre(result).getStudentSummary();

                        var newObject = student.toObject();

                        newObject.xsre = object;

                        /**
                         * Set to cache
                         */
                        cache.set(key, newObject, {ttl: 86400}, function(){

                            callback(null, newObject, false);

                        });

                    });

                }
            });

        } else {


            callback(null, result, true);

        }

    });
};
/**
 *
 * @param brokerRequest
 * @param student
 * @param orgId
 * @param callback
 */
StudentController.refreshStudentSummary = function(brokerRequest, student, orgId, callback){

    var key = prefixListStudent+orgId;

    cache.get(key, function(err, result){

        if(err)  {
            return callback(err);
        }

        if(!(student._id.toString() in result)){

              result[student._id.toString()] = {};

        }

        brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

            if (error)  {
                  return callback(err);
            }

            if (!body) {
                  return callback('Empty response');
            }

            if (response && response.statusCode === 200) {

                  utils.xml2js(body, function (err, result) {

                      if (err)  { return callback(null, data, false); }

                        result[student._id.toString()] = new xSre(result).getStudentSummary();

                        cache.set(key, result, {ttl: 86400}, callback);

                  });

            } else {

                  callback();
            }

      }, true);

    });
};
/**
 * Get all student in organization
 * @param req
 * @param res
 */
StudentController.getStudents = function (req, res) {

    res.xmlKey = 'students';

    var orgId = ObjectId(req.params.organizationId);

    var crit = Student.crit(req.query, ['organization']);

    var withXsre = parseInt(req.query.xsre) > 0;

    crit.organization = orgId;


    Organization.findOne({ _id: orgId }, function(err, organization) {

        if (err)  { return res.sendError(err); }
        /**
         * If organization is empty from database
         */
        if (!organization) {
            return res.sendError('The organization not found in database');
        }

        //var brokerRequest = new Request({
        //    externalServiceId: organization.externalServiceId,
        //    personnelId: organization.personnelId,
        //    authorizedEntityId: organization.authorizedEntityId
        //});

        Student.protect(req.user.role, null, req.user).find(crit, function (err, students) {

            if (err)  { return res.sendError(err); }

            var key = prefixListStudent+orgId;

            cache.get(key, function(err, results){

                //console.log(key, ' DATA ', results);

                var studentsList = [];

                if(!_.isUndefined(results)){

                    students.forEach(function(student){

                        var newObject = student.toObject();

                        if(student._id.toString() in results){

                            newObject.xsre = results[student._id.toString()];

                        } else{

                            newObject.xsre = {
                                "gradeLevel": "N/A",
                                "schoolYear": "N/A",
                                "schoolName": "N/A",
                                "attendance": 0,
                                "behavior": 0,
                                "onTrackToGraduate": "N/A"
                            };

                        }

                        studentsList.push(newObject);

                    });
                }

                res.sendSuccess(null, studentsList);

            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.getStudentNotAssigns = function (req, res) {

    var orgId = ObjectId(req.params.organizationId);

    var where = { permissions: { $elemMatch: { organization: orgId } }};

    if(req.body.userId){

        where._id = ObjectId(req.body.userId);

    }

    var query = User.find(where);

    var crit = Student.crit(req.query, ['organization', '_id']);

    crit.organization = orgId;

    query.exec(function(err, users){

        var students = [];

        var showEmpty = true;

        users.forEach(function(user){

            user.permissions.forEach(function(permission){

                if(permission.organization.toString() === orgId.toString()) {

                    //if (permission.role === 'case-worker-restricted') {

                        showEmpty = false;

                        permission.students.forEach(function (student) {

                            if (students.indexOf(student) === -1) {
                                students.push(student);
                            }

                        });

                    //}

                }

            });

        });

        if(showEmpty === true){

            return res.sendSuccess(null, []);

        }

        if(students.length > 0) {
            crit._id = { $nin: students };
        }

        Student.find(crit, function (err, students) {

            if (err)  { return res.sendError(err); }

            res.sendSuccess(null, students);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.createByOrgId = function (req, res) {

      res.xmlKey = 'student';

      var orgId = ObjectId(req.params.organizationId);

      Organization.findOne({ _id: orgId }, function(err, organization){

            if(err){
                  return res.sendError(err);
            }
            /**
             * If organization is empty from database
             */
            if(!organization){
                  return res.sendError('The organization not found in database');
            }

            var brokerRequest = new Request({
                  externalServiceId: organization.externalServiceId,
                  personnelId: organization.personnelId,
                  authorizedEntityId: organization.authorizedEntityId
            });

            var obj = new Student(req.body);

            obj.organization = orgId;

            // set update time and update by user
            obj.created = new Date();

            obj.creator = req.user.userId;

            obj.last_updated = new Date();

            obj.last_updated_by = req.user.userId;

            User.findOne({ _id: req.user._id }, function(err, user){

                  if(err){
                        return res.sendError(err);
                  }

                  if(!user){
                        return res.sendError('User not update successfully');
                  }

                  obj.protect(req.user.role, null, req.user).save(function(err){

                        if(err){
                              return res.sendError(err);
                        }

                        _.each(user.permissions, function(permission, key){

                              if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                                    user.permissions[key].students.push(obj._id);

                              }

                        });

                        user.save(function(err){

                              if(err){
                                    return res.sendError(err);
                              }

                              StudentController.refreshStudentSummary(brokerRequest, obj, orgId.toString(), function(){

                                    res.sendSuccess('Successfully Added', obj);

                              });



                        });

                  });

            });

      });

};
/**
 * Get student organization by id
 * @param req
 * @param res
 */
StudentController.getStudentById = function (req, res) {

    res.xmlOptions = 'student';

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var crit = Student.crit(req.query, ['_id', 'organization']);

    var withXsre = parseInt(req.query.xsre) > 0;

    console.log('with XSRE: ', withXsre);

    crit.organization = orgId;

    crit._id = studentId;

    Organization.findOne({ _id: orgId }, function(err, organization) {

        if (err)  { return res.sendError(err); }
        /**
         * If organization is empty from database
         */
        if (!organization) {
            return res.sendError('The organization not found in database');
        }

        var brokerRequest = new Request({
            externalServiceId: organization.externalServiceId,
            personnelId: organization.personnelId,
            authorizedEntityId: organization.authorizedEntityId
        });

        Student.protect(req.user.role, { students: studentId }, req.user).findOne(crit, function (err, student) {

            if (err)  { return res.sendError(err); }
            /**
             * If student is empty from database
             */
            if (!student) {
                return res.sendError('The student not found in database');
            }

            if(withXsre) {

                StudentController.getStudentDetail(brokerRequest, student, orgId, function(err, student, isCache){

                    res.header('X-Cached-Sre' , isCache ? 1 : 0 );

                    res.sendSuccess(student);

                });

            } else {

                res.sendSuccess(student);

            }

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.deleteStudentById = function (req, res) {

    var orgId = req.params.organizationId;

    var studentId = ObjectId(req.params.studentId);

    Student.protect(req.user.role, { students: studentId }, req.user).remove({organization: ObjectId(orgId), _id: ObjectId(req.params.studentId)}, function (err) {

        if (err)  { return res.sendError(err); }

        User.findOne({ _id: req.user._id }, function(err, user){

            if (err)  { return res.sendError(err); }

            if(!user) {
                return res.sendError('User not update successfully');
            }

            _.each(user.permissions, function(permission, key){

                var indexOf = permission.students.indexOf(ObjectId(req.params.studentId));

                if(permission.organization.toString() === orgId && indexOf !== -1){

                    delete user.permissions[key].students[indexOf];

                }

            });

            user.save(function(err){

                if (err) {
                    return res.sendError(err);
                }

                cache.get(prefixListStudent+orgId, function(err, xsre){

                    if(err || !xsre) {

                        return res.sendSuccess('Successfully deleted');

                    }

                    if(studentId.toString() in xsre){

                        delete xsre[studentId.toString()];
                        /**
                         * Restore cache again
                         */
                        cache.set(prefixListStudent+orgId, xsre, {ttl: 86400}, function(){

                            res.sendSuccess('Successfully deleted');

                        });

                    } else {

                        res.sendSuccess('Successfully deleted');

                    }

                });


            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.putStudentById = function(req, res){

      res.xmlOptions = 'student';

      var studentId = ObjectId(req.params.studentId);

      var orgId = ObjectId(req.params.organizationId);

      Organization.findOne({ _id: orgId }, function(err, organization){

            if(err){
                  return res.sendError(err);
            }
            /**
             * If organization is empty from database
             */
            if(!organization){
                  return res.sendError('The organization not found in database');
            }

            var brokerRequest = new Request({
                  externalServiceId: organization.externalServiceId,
                  personnelId: organization.personnelId,
                  authorizedEntityId: organization.authorizedEntityId
            });

            Student.protect(req.user.role, { students: studentId }, req.user).findOne({
                  _id: studentId,
                  organization: orgId
            }, function(err, obj){

                  if(err){
                        return res.sendError(err);
                  }

                  if(!obj){
                        return res.sendError('Data not found');
                  }

                  for(var prop in req.body){

                        if(prop in obj){

                              obj[prop] = req.body[prop];

                        }

                  }
                  // set update time and update by user
                  obj.last_updated = new Date();

                  obj.last_updated_by = req.user.userId;

                  obj.protect(req.user.role, null, req.user).save(function(err){

                        if(err){

                              return res.sendError(err);

                        }

                        StudentController.refreshStudentSummary(brokerRequest, obj, orgId.toString(), function(){

                              res.sendSuccess('Successfully updated!', obj);

                        });

                  });

            });
      });

};



/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentController;