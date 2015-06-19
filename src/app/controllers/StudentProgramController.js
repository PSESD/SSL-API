/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var StudentProgram = require('../models/StudentProgram');
var StudentProgramSchema = require('../models/schema/StudentProgram');
var Program = require('../models/Program');
var User = require('../models/User');
var BaseController = require('./BaseController');
var _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;


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

    var cb = function(){

        Student.findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

            if(err) return res.errJson(err);

            if(!student) return res.errJson('Data not found');

            res.okJson(null, student.programs);
        });
    };

    StudentProgramController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
StudentProgramController.addByStudentId = function (req, res) {

    var orgId = req.params.organizationId;
    var stdId = req.params.studentId;

    var cb = function(){
        var studentProgram = {};

        if(req.body.programId) studentProgram.program = ObjectId(req.body.programId);
        if(req.body.cohort) studentProgram.cohort = req.body.cohort;
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

        Student.findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

            if(err) return res.errJson(err);

            if(!student) return res.errJson('Data not found');

            student.programs.push(studentProgram);


            //var subdoc = student.programs[0];
            //
            //if(!subdoc.isNew){
            //    return res.errJson('Student program failed to add because is duplicate or error');
            //}
            // set update time and update by user
            student.last_updated = new Date();
            student.last_updated_by = req.user.userId;

            student.save(function(err){

                if(err) return res.errJson(err);


                res.okJson('Student Program successfully add', student);
            });

        });
    };

    StudentProgramController.grant(req, res, cb);
};
/**
 * Get all list the students that is enrolled in this program.
 * @param req
 * @param res
 */
StudentProgramController.getByProgramId = function (req, res) {
    var orgId = req.params.organizationId;
    var proId = req.params.programId;

    var cb = function(){

        Student.find({ organization: ObjectId(orgId), programs: { $elemMatch: { program: ObjectId(proId) } } }, function(err, students){

            if(err) return res.errJson(err);

            if(!students) return res.errJson('Data not found');

            res.okJson(null, students);
        });
    };

    StudentProgramController.grant(req, res, cb);
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

    var cb = function(){
        var studentProgram = {};
        if(proId) studentProgram.program = ObjectId(proId);
        if(req.body.cohort) studentProgram.cohort = req.body.cohort;
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

        Student.findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, function(err, student){

            if(err) return res.errJson(err);

            if(!student) return res.errJson('Data not found');

            student.programs.push(studentProgram);


            //var subdoc = student.programs[0];

            //if(!subdoc.isNew){
            //    return res.errJson('Student program failed to add because is duplicate or error');
            //}
            // set update time and update by user
            student.last_updated = new Date();
            student.last_updated_by = req.user.userId;

            student.save(function(err){

                if(err) return res.errJson(err);


                res.okJson('Student Program successfully add', student);
            });

        });
    };

    StudentProgramController.grant(req, res, cb);
};

/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentProgramController;