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
var Request = require('../../lib/broker/Request');
var parseString = require('xml2js').parseString;
var utils = require('../../lib/utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5;
var ObjectId = mongoose.Types.ObjectId;
var StudentController = new BaseController(Student).crud();
var hal = require('hal');
var php = require('phpjs');
var Attendance = require('../../lib/attendance');

/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
StudentController.getStudentsBackpack = function (req, res) {

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);


    Student.protect(req.user.role, { value: studentId }, req.user).findOne({_id: studentId, organization: orgId}, function (err, student) {

        if (err) return res.errJson(err);
        /**
         * If student is empty from database
         */
        if (!student) return res.errJson('The student not found in database');

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district].join('_'));

        /**
         *
         * @param results
         * @param isFromCache
         */
        function embeds(results, isFromCache){

            res.header('X-Cached-Sre' , isFromCache ? 1 : 0 );

            var crit = {
                permissions: {
                    $elemMatch: {
                        organization: orgId,
                        students: studentId
                    }
                }
            };

            User.find(crit, function(err, users){

                if(err) return res.errJson(err);

                if(!users) users = [];

                var resource = new hal.Resource(results, req.originalUrl);

                var embedsUsers = [];

                var embedsPrograms = [];

                _.each(users, function(user){

                    var fullname = [];

                    if(user.first_name) fullname.push(user.first_name);
                    if(user.middle_name) fullname.push(user.middle_name);
                    if(user.last_name) fullname.push(user.last_name);

                    embedsUsers.push(new hal.Resource({
                        id: user._id.toString(),
                        email: user.email,
                        fullname: fullname.join(' ')
                    }, '/'+orgId+'/users/'+user._id));

                });

                var programsId = {};

                var programId = [];

                _.each(student.programs, function(program){

                    programsId[program.program.toString()] = program.toObject();

                    programId.push(program.program);

                });

                if(!_.isEmpty(programsId)){

                    Program.find({ _id: { $in: programId } }, function(err, programs){

                        if(err) return res.errJson(err);

                        _.each(programs, function(program){

                            if(program._id.toString() in programsId){

                                programsId[program._id.toString()].program_name = program.name;

                                embedsPrograms.push(new hal.Resource(programsId[program._id.toString()]));

                            }


                        });

                        resource.embed('users', embedsUsers);

                        resource.embed('programs', embedsPrograms);

                        res.json(resource.toJSON());

                    });


                } else {

                    resource.embed('users', embedsUsers);

                    resource.embed('programs', embedsPrograms);

                    res.json(resource.toJSON());
                }

            });
        }

        Organization.findOne({ _id: orgId }, function(err, organization){

            if (err) return res.errJson(err);
            /**
             * If organization is empty from database
             */
            if (!organization) return res.errJson('The organization not found in database');

            var brokerRequest = new Request({
                externalServiceId: organization.externalServiceId,
                personnelId: organization.personnelId,
                authorizedEntityId: organization.authorizedEntityId
            });

            cache.get(key, function(err, result){

                if(err) log(err);

                if(!result){

                    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                        if (error)  return res.errJson(error);

                        if (!body) {

                            res.statusCode = response.statusCode || 404;

                            return res.errJson('Data not found in database xsre');

                        }

                        if (response && response.statusCode === 200) {

                            parseString(body, { explicitArray: false }, function (err, result) {

                                if(err) return res.errJson(err);

                                var json = result.xSre;

                                delete json['$'];

                                //if(!_.isArray(json.attendance.summaries.summary)){
                                //
                                //    json.attendance.summaries.summary = [ json.attendance.summaries.summary ];
                                //
                                //}

                                json.attendanceBehaviors = new Attendance(json).getAttendances();

                                json.lastUpdated = require('moment')().format('MM/DD/YYYY HH:mm:ss');
                                /**
                                 * Set to cache
                                 */
                                cache.set(key, json, function(err){

                                    log(err);

                                    embeds(json);

                                });

                            });

                        } else {

                            parseString(body, { explicitArray: false }, function (err, result) {

                                var json = (result && 'error' in result) ? result.error.message : 'Error not response';

                                res.errJson(json);

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

        if (err) return res.errJson(err);
        /**
         * If student is empty from database
         */
        if (!student) return res.errJson('The student not found in database');

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district].join('_'));

        Organization.findOne({ _id: orgId }, function(err, organization){

            if (err) return res.errJson(err);
            /**
             * If organization is empty from database
             */
            if (!organization) return res.errJson('The organization not found in database');

            cache.del(key, function(err, result){

                if (err){

                    log(err, 'error');

                    return res.errJson('Delete cache error');

                }

                res.okJson('Delete cache successfully');

            });
        });

    });
};
/**
 * Get all student in organization
 * @param req
 * @param res
 */
StudentController.getStudents = function (req, res) {

    var orgId = ObjectId(req.params.organizationId);

    var crit = Student.crit(req.query, ['organization']);

    crit.organization = orgId;

    Student.protect(req.user.role, null, req.user).find(crit, function (err, students) {

        if (err) return res.errJson(err);

        res.okJson(null, students);

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

                    //if (permission.role === 'case-worker' && permission.is_special_case_worker === false) {

                        showEmpty = false;

                        permission.students.forEach(function (student) {

                            if (students.indexOf(student) === -1) students.push(student);

                        });

                    //}

                }

            });

        });

        if(showEmpty === true){

            return res.okJson(null, []);

        }

        if(students.length > 0) crit._id = { $nin: students };

        Student.find(crit, function (err, students) {

            if (err) return res.errJson(err);

            res.okJson(null, students);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.createByOrgId = function (req, res) {

    var obj = new Student(req.body);

    obj.organization = ObjectId(req.params.organizationId);

    // set update time and update by user
    obj.created = new Date();

    obj.creator = req.user.userId;

    obj.last_updated = new Date();

    obj.last_updated_by = req.user.userId;

    User.findOne({ _id: req.user._id }, function(err, user){

        if(err) return res.errJson(err);

        if(!user) return res.errJson('User not update successfully');

        obj.protect(req.user.role, null, req.user).save(function (err) {

            if (err)  return res.errJson(err);

            _.each(user.permissions, function(permission, key){

                if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                    user.permissions[key].students.push(obj._id);

                }

            });

            user.save(function(err){

                if (err)  return res.errJson(err);

                res.okJson('Successfully Added', obj);

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

    var orgId = req.params.organizationId;

    var studentId = ObjectId(req.params.studentId);

    var crit = Student.crit(req.query, ['_id', 'organization']);

    crit.organization = ObjectId(orgId);

    crit._id = studentId;

    Student.protect(req.user.role, { students: studentId }, req.user).findOne(crit, function (err, student) {

        if (err) return res.errJson(err);
        /**
         * If student is empty from database
         */
        if (!student) return res.errJson('The student not found in database');

        res.okJson(student);

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

    Student.protect(req.user.role, { students: studentId }, req.user).remove({organization: ObjectId(orgId), _id: ObjectId(req.params.studentId)}, function (err, student) {

        if (err) return res.errJson(err);

        User.findOne({ _id: req.user._id }, function(err, user){

            if(err) return res.errJson(err);

            if(!user) return res.errJson('User not update successfully');

            _.each(user.permissions, function(permission, key){

                var indexOf = permission.students.indexOf(ObjectId(req.params.studentId));

                if(permission.organization.toString() === orgId && indexOf !== -1){

                    delete user.permissions[key].students[indexOf];

                }

            });

            user.save(function(err){

                if (err)  return res.errJson(err);

                res.okJson('Successfully deleted');

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

    var studentId = ObjectId(req.params.studentId);

    Student.protect(req.user.role, { students: studentId }, req.user).findOne({_id: studentId, organization: ObjectId(req.params.organizationId)}, function (err, obj) {

        if (err)  return res.errJson(err);

        if (!obj) return res.errJson('Data not found');

        for (var prop in req.body) {

            if(prop in obj) {

                obj[prop] = req.body[prop];

            }

        }
        // set update time and update by user
        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        obj.protect(req.user.role, null, req.user).save(function (err) {

            if (err) return res.errJson(err);

            res.okJson('Successfully updated!', obj);

        });

    });

};



/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentController;