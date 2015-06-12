/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
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

            res.okJson(student.programs);
        });
    };
    StudentProgramController.grant(req, res, cb);
};

StudentProgramController.createByStudentId = function (req, res) {
    var orgId = req.params.organizationId;
    var stdId = req.params.studentId;
    var cb = function(){
        var studentProgram = new StudentProgramSchema(req.body);

        Student.findOne({ _id: ObjectId(stdId), organization: ObjectId(orgId) }, { $push: studentProgram }, function(err, student){

            if(err) return res.errJson(err);

            if(!student) return res.errJson('Data not found');

            student.programs.push(studentProgram);

            var subdoc = student.programs[0];

            if(!subdoc.isNew){
                return res.errJson('Student program failed to add');
            }

            student.save(function(err){

                if(err) return res.errJson(err);


                res.okJson('Student Program successfully add', student);
            });

        });
    };

    StudentProgramController.grant(req, res, cb);
};


module.exports = StudentProgramController;