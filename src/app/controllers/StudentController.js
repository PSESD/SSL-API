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
var utils = require('../../lib/utils'), cache = utils.cache();
var ObjectId = mongoose.Types.ObjectId;
var StudentController = new BaseController(Student).crud();
var hal = require('hal');
var php = require('phpjs');

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
        /**
         *
         * @param results
         * @returns {Array}
         */
        function getAttendanceBehaviors(results){

            var attendanceBehaviors = [];

            var behaviorDefault = {
                weekStart: "",
                weekEnd: "",
                havePeriods: false,
                deltaChange: "0%", //Calculated from total this week (attendance - last week attendance) / last week attendance
                weekData: []
            };

            var attendance = results.attendance;

            var totalLastWeekAttendance = 0;

            for(var i = 0; i < attendance.summaries.summary.length; i++){

                var summary = attendance.summaries.summary[i];

                var behavior = behaviorDefault, totalAttandance = 0;

                behavior.weekStart = summary.startDate._;

                behavior.weekEnd = php.date('m/d/Y', php.strtotime('+'+summary.daysAbsent+' days', php.strtotime(behavior.weekStart)));

                attendance.events.event.forEach(function(event){

                    var weekDate = {
                        date: "",
                        attendance: "0%", //Calculated from total non present/total period
                        periods: [],
                        behaviors: []
                    };

                    weekDate.date = event.calendarEventDate;

                    var total = 0;

                    if('timeTablePeriod' in event && _.isArray(event.timeTablePeriod)){

                        behavior.havePeriods = true;

                        for(var j = 0; j < event.timeTablePeriod.length; j++){

                            var period = {
                                name: 'Period ' + timeTablePeriod[j]
                            };

                            period.status = event.attendanceStatus[j];

                            if(period.status === 'P'){

                                total++;

                            }

                            weekDate.periods.push(period);

                        }

                    }

                    var percent = total === 0 ? 0 : (Math.round(total / weekDate.periods.length) * 100);

                    weekDate.attendance = percent + '%';

                    totalAttandance += percent;

                    behavior.weekData.push(weekDate);

                });

                if(attendanceBehaviors.length === 0){

                    totalLastWeekAttendance = totalAttandance;

                } else {

                    totalLastWeekAttendance = parseInt(attendanceBehaviors[attendanceBehaviors.length -1].deltaChange);

                }

                var deltaChange = totalAttandance === 0 ? 0 : (Math.round(totalAttandance / totalLastWeekAttendance) * 100);

                behavior.deltaChange = deltaChange + '%';

                totalAttandance = 0;

                attendanceBehaviors.push(behavior);

            }

            return attendanceBehaviors;

        }
        /**
         *
         * @param results
         */
        function embeds(results){

            if(!_.isArray(results.attendance.summaries.summary)){

                results.attendance.summaries.summary = [ results.attendance.summaries.summary ];

            }

            results.attendanceBehaviors = getAttendanceBehaviors(results);

            var crit = {
                $or: [
                    {
                        permissions: {
                            $elemMatch: {
                                organization: orgId,
                                students: studentId,
                                role: 'case-worker',
                                is_special_case_worker: false
                            }
                        }
                    },
                    {
                        permissions: {
                            $elemMatch: {
                                organization: orgId,
                                role: 'case-worker',
                                is_special_case_worker: true
                            }
                        }
                    }
                ]
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
             * If student is empty from database
             */
            if (!student) return res.errJson('The organization not found in database');

            var brokerRequest = new Request({
                externalServiceId: organization.externalServiceId,
                personnelId: organization.personnelId,
                authorizedEntityId: organization.authorizedEntityId
            });


            var key = [student.district_student_id, student.school_district, organization.externalServiceId, organization.personnelId, organization.authorizedEntityId].join('_');

            cache.get(key, function(err, result){

                if(err) utils.log(err);

                if(!result){

                    //console.log("GET FROM SERVER");

                    brokerRequest.createXsre(student.district_student_id, student.school_district, function (error, response, body) {

                        if (error)  return res.errJson(error);

                        if (!body) return res.errJson('Data not found');

                        if (response && response.statusCode == '200') {

                            parseString(body, { explicitArray: false }, function (err, result) {

                                var json = result.xSre;

                                delete json['$'];

                                cache.set(key, json, function(err){

                                    utils.log(err);

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

                    //console.log("GET FROM CACHE");

                    embeds(result);

                }

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

                    if (permission.role === 'case-worker' && permission.is_special_case_worker === false) {

                        showEmpty = false;

                        permission.students.forEach(function (student) {

                            if (students.indexOf(student) === -1) students.push(student);

                        });

                    }

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