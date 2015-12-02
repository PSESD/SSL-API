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
var utils = require('../../lib/utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5;
var ObjectId = mongoose.Types.ObjectId;
var StudentController = new BaseController(Student).crud();
var hal = require('hal');
var xSre = require('../../lib/xsre');
var async = require('async');


/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
StudentController.getStudentsBackpack = function (req, res) {

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var showRaw = false;

    if('raw' in req.query && (parseInt(req.query.raw) > 0 || req.query.raw === 'true')) {
        showRaw = true;
    }

    Student.protect(req.user.role, { value: studentId }, req.user).findOne({_id: studentId, organization: orgId}, function (err, student) {

        if (err)  { return res.sendError(err); }
        /**
         * If student is empty from database
         */
        if (!student) {
            return res.sendError('The student not found in database');
        }

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district, req.params.format].join('_'));
        //key = new Date().getTime();
        /**
         *
         * @param results
         * @param isFromCache
         */
        function embeds(results, isFromCache){

            res.header('X-Cached-Sre' , isFromCache ? 1 : 0 );

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

                        res.sendSuccess(null, resource.toJSON());

                    });


                } else {

                    resource.embed('users', embedsUsers);

                    resource.embed('programs', embedsPrograms);

                    res.sendSuccess(null, resource.toJSON());

                }

            });
        }

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

                    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                        if (error)  {
                            return res.sendError(error);
                        }

                        if (!body) {

                            res.statusCode = response.statusCode || 404;

                            return res.sendError('Data not found in database xsre');

                        }

                        if (response && response.statusCode === 200) {

                            utils.xml2js(body, function (err, result) {

                                if (err)  { return res.sendError(err); }

                                var object = new xSre(result, body).toObject();
                                /**
                                 * Set to cache
                                 */
                                cache.set(key, object, function(err){

                                    log(err);

                                    embeds(object);

                                });

                            });

                        } else {

                            utils.xml2js(body, function (err, result) {

                                var json = (result && 'error' in result) ? result.error.message : 'Error not response';

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

    Student.protect(req.user.role, { value: studentId }, req.user).findOne({_id: studentId, organization: orgId}, function (err, student) {

        if (err)  { return res.sendError(err); }
        /**
         * If student is empty from database
         */
        if (!student) {
            return res.sendError('The student not found in database');
        }

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district, req.params.format].join('_'));

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

                    res.sendSuccess('Delete cache successfully');

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
                        cache.set(key, newObject, {ttl: 3600}, function(){

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

        var brokerRequest = new Request({
            externalServiceId: organization.externalServiceId,
            personnelId: organization.personnelId,
            authorizedEntityId: organization.authorizedEntityId
        });

        Student.protect(req.user.role, null, req.user).find(crit, function (err, students) {

            if (err)  { return res.sendError(err); }

            if(withXsre) {

                var studentsAsync = [];

                students.forEach(function (student) {

                    studentsAsync.push(function (callback) {

                        StudentController.getStudentDetail(brokerRequest, student, orgId, callback);

                    });

                });

                async.series(studentsAsync, function(err, students, isCache){

                    res.header('X-Cached-Sre' , isCache ? 1 : 0 );

                    res.sendSuccess(null, students);

                });

            } else {

                res.sendSuccess(null, students);

            }

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

    var obj = new Student(req.body);

    obj.organization = ObjectId(req.params.organizationId);

    // set update time and update by user
    obj.created = new Date();

    obj.creator = req.user.userId;

    obj.last_updated = new Date();

    obj.last_updated_by = req.user.userId;

    User.findOne({ _id: req.user._id }, function(err, user){

        if (err)  { return res.sendError(err); }

        if(!user) {
            return res.sendError('User not update successfully');
        }

        obj.protect(req.user.role, null, req.user).save(function (err) {

            if (err) { return res.sendError(err); }

            _.each(user.permissions, function(permission, key){

                if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                    user.permissions[key].students.push(obj._id);

                }

            });

            user.save(function(err){

                if (err) { return res.sendError(err); }

                res.sendSuccess('Successfully Added', obj);

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

                if (err) { return res.sendError(err); }

                res.sendSuccess('Successfully deleted');

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

    Student.protect(req.user.role, { students: studentId }, req.user).findOne({_id: studentId, organization: ObjectId(req.params.organizationId)}, function (err, obj) {

        if (err) { return res.sendError(err); }

        if (!obj) {
            return res.sendError('Data not found');
        }

        for (var prop in req.body) {

            if(prop in obj) {

                obj[prop] = req.body[prop];

            }

        }
        // set update time and update by user
        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        obj.protect(req.user.role, null, req.user).save(function (err) {

            if (err)  { return res.sendError(err); }

            res.sendSuccess('Successfully updated!', obj);

        });

    });

};



/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentController;