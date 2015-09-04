/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var StudentProgram = require('../models/StudentProgram');
var Organization = require('../models/Organization');
var Program = require('../models/Program');
var User = require('../models/User');
var Tag = require('../models/Tag');
var BaseController = require('./BaseController');
var _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;
var natural = require('natural'),
    tokenizer = new natural.WordTokenizer();

var xmlParser = require('js2xmlparser');
var moment = require('moment');
var config = require('config'), xsreConfig = config.get('hzb').xsre;


var StudentProgramController = new BaseController(StudentProgram).crud();


/**
 * Get all student programs by studentId in System
 * @param req
 * @param res
 * @returns {*}
 */
StudentProgramController.getByStudentId = function (req, res) {

    var orgId = req.params.organizationId;

    var stdId = req.params.studentId;

    Student.protect(req.user.role, { value: stdId }, req.user).findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

        if(err) return res.errJson(err);

        if(!student) return res.errJson('Data not found');

        res.okJson(null, student.programs);
    });

};
/**
 *
 * @param req
 * @param res
 */
StudentProgramController.getByStudentIdXsre = function(req, res){

    var orgId = req.params.organizationId;

    var stdId = req.params.studentId;

    Organization.findOne({ _id: ObjectId(orgId) }, function(err, organization) {

        if (err) return res.errJson(err);

        if (!organization) return res.errJson('Data not found');

        Student.protect(req.user.role, {value: stdId}, req.user).findOne({
            _id: ObjectId(stdId),
            organization: ObjectId(orgId)
        }, function (err, student) {

            if (err) return res.errJson(err);

            if (!student) return res.errJson('Data not found');

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

            var programsId = {};

            var programId = [];

            _.each(student.programs, function(program){

                if(Object.keys(programsId).indexOf(program.program.toString()) === -1) programsId[program.program.toString()] = [];

                programsId[program.program.toString()].push(program.toObject());

                programId.push(program.program);

                CBOStudent.programs.activities.activity.push({
                    studentActivityRefId: program.program.toString(),
                    startDate: moment(new Date(program.participation_start_date)).format('MM/DD/YYYY'),
                    endDate:moment(new Date(program.participation_end_date)).format('MM/DD/YYYY'),
                    active: program.active,
                    tags: {
                        tag: program.cohort
                    }

                });

            });

            if(!_.isEmpty(programsId)){

                Program.find({ _id: { $in: programId } }, function(err, programs){

                    if(err) return res.errJson(err);

                    _.each(programs, function(program){

                        if(program._id.toString() in programsId){

                            programsId[program._id.toString()].forEach(function(prgm){

                                CBOStudent.studentActivity.push({
                                    '@': {
                                        refId: program._id.toString()
                                    },
                                    title: program.name
                                });

                            });

                        }

                    });

                    res.set('Content-Type', 'text/xml');

                    res.send(xmlParser('CBOStudent', CBOStudent, {
                        declaration: {
                            encoding: 'utf-16'
                        }
                    }));

                });


            } else {

                res.set('Content-Type', 'text/xml');

                res.send(xmlParser('CBOStudent', CBOStudent, {
                    declaration: {
                        encoding: 'utf-16'
                    }
                }));
            }

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentProgramController.addByStudentId = function (req, res) {

    var orgId = req.params.organizationId;

    var stdId = req.params.studentId;

    var studentProgram = {};

    if(req.body.programId) studentProgram.program = ObjectId(req.body.programId);

    if(req.body.cohort) studentProgram.cohort = _.isArray(req.body.cohort) ? req.body.cohort : tokenizer.tokenize(req.body.cohort);

    if(req.body.active) studentProgram.active = (req.body.active === 'true');

    if(req.body.participation_start_date) studentProgram.participation_start_date = new Date(Date.parse(req.body.participation_start_date));

    if(req.body.participation_end_date) studentProgram.participation_end_date = new Date(Date.parse(req.body.participation_end_date));

    studentProgram.created = new Date();

    studentProgram.creator = req.user.userId;

    studentProgram.last_updated = new Date();

    studentProgram.last_updated_by = req.user.userId;

    if(_.isEmpty(studentProgram)) {

        return res.errJson('POST parameter is empty!');

    }

    Student.protect(req.user.role, { value: stdId }, req.user).findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

        if(err) return res.errJson(err);

        if(!student) return res.errJson('Data not found');

        student.programs.push(studentProgram);

        // set update time and update by user
        student.last_updated = new Date();

        student.last_updated_by = req.user.userId;

        student.save(function(err){

            if(err) return res.errJson(err);

            Tag.addTag(ObjectId(orgId), studentProgram.cohort);

            res.okJson('Student Program successfully add', student);

        });

    });

};
/**
 * Get all list the students that is enrolled in this program.
 * @param req
 * @param res
 */
StudentProgramController.getByProgramId = function (req, res) {

    var orgId = req.params.organizationId;

    var proId = req.params.programId;

    Student.protect(req.user.role, { onlyAssign: true }, req.user).find({ organization: ObjectId(orgId), programs: { $elemMatch: { program: ObjectId(proId) } } }, function(err, students){

        if(err) return res.errJson(err);

        if(!students) return res.errJson('Data not found');

        res.okJson(null, students);

    });

};
/**
 * Add new student to program
 * @param req
 * @param res
 */
StudentProgramController.addByProgramId = function(req, res){

    var orgId = req.params.organizationId;

    var proId = req.params.programId;

    var stdId = req.body.studentId;

    var studentProgram = {};

    if(proId) studentProgram.program = ObjectId(proId);

    if(req.body.cohort) studentProgram.cohort = _.isArray(req.body.cohort) ? req.body.cohort : tokenizer.tokenize(req.body.cohort);

    if(req.body.active) studentProgram.active = (req.body.active === 'true');

    if(req.body.participation_start_date) studentProgram.participation_start_date = new Date(Date.parse(req.body.participation_start_date));

    if(req.body.participation_end_date) studentProgram.participation_end_date = new Date(Date.parse(req.body.participation_end_date));

    studentProgram.created = new Date();

    studentProgram.creator = req.user.userId;

    studentProgram.last_updated = new Date();

    studentProgram.last_updated_by = req.user.userId;

    if(!stdId || _.isEmpty(studentProgram)) {

        return res.errJson('POST parameter is empty!');

    }

    Student.protect(req.user.role, { value: stdId }, req.user).findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

        if(err) return res.errJson(err);

        if(!student) return res.errJson('Data not found');

        student.programs.push(studentProgram);

        // set update time and update by user
        student.last_updated = new Date();

        student.last_updated_by = req.user.userId;

        student.save(function(err){

            if(err) return res.errJson(err);

            Tag.addTag(ObjectId(orgId), studentProgram.cohort);

            res.okJson('Student Program successfully add', student);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentProgramController.getStudentById = function(req, res){

    var orgId = req.params.organizationId;

    var proId = req.params.programId;

    var stdId = req.params.studentId;

    var crit  = {
        organization: ObjectId(orgId),
        programs: { $elemMatch: { program: ObjectId(proId) } },
        _id: ObjectId(stdId)
    };

    Student.protect(req.user.role, { students: stdId }, req.user).findOne(crit, function (err, student) {

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
StudentProgramController.putStudentById = function(req, res){

    var orgId = req.params.organizationId;

    var proId = req.params.programId;

    var stdId = req.params.studentId;

    var crit  = {
        organization: ObjectId(orgId),
        programs: { $elemMatch: { program: ObjectId(proId) } },
        _id: ObjectId(stdId)
    };

    Student.protect(req.user.role, { students: stdId }, req.user).findOne(crit, function(err, student){

        if(err) return res.errJson(err);

        if(!student) return res.errJson('Data not found');


        var programs = [];

        var studentProgram = {};

        for (var i = 0; i < student.programs.length; i++) {

            if (proId !== (student.programs[i].program + '')) {

                programs.push(student.programs[i]);

            } else {

                studentProgram = student.programs[i];

                if (proId) studentProgram.program = ObjectId(proId);

                if (req.body.cohort) studentProgram.cohort = _.isArray(req.body.cohort) ? req.body.cohort : tokenizer.tokenize(req.body.cohort);

                if (req.body.active) studentProgram.active = (req.body.active === 'true');

                if (req.body.participation_start_date) studentProgram.participation_start_date = new Date(Date.parse(req.body.participation_start_date));

                if (req.body.participation_end_date) studentProgram.participation_end_date = new Date(Date.parse(req.body.participation_end_date));

                studentProgram.last_updated = new Date();

                studentProgram.last_updated_by = req.user.userId;

                programs.push(studentProgram);

            }
        }

        if (_.isEmpty(studentProgram)) {

            return res.errJson('POST parameter is empty!');

        }

        Student.where({_id: student._id}).update({$set: { programs: programs}, last_updated: new Date(), last_updated_by: req.user.userId }, function (err, updated) {

            if (err) return res.errJson(err);

            res.okJson('Update success');

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentProgramController.deleteStudentById = function(req, res){

    var orgId = req.params.organizationId;

    var proId = req.params.programId;

    var stdId = req.params.studentId;

    var crit  = {
        organization: ObjectId(orgId),
        programs: { $elemMatch: { program: ObjectId(proId) } },
        _id: ObjectId(stdId)
    };

    Student.protect(req.user.role, { students: stdId }, req.user).findOne(crit, function(err, student){

        if(err) return res.errJson(err);

        if(!student) return res.errJson('Data not found');

        var programs = [];

        for (var i = 0; i < student.programs.length; i++) {

            if (proId !== (student.programs[i].program + '')) {

                programs.push(student.programs[i]);

            }
        }

        Student.where({_id: student._id}).update({$set: { programs: programs}, last_updated: new Date(), last_updated_by: req.user.userId }, function (err, updated) {

            if (err) return res.errJson(err);

            res.okJson('Delete success');

        });

    });

};

/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentProgramController;