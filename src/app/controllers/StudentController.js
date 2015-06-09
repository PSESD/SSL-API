/**
 * Created by zaenal on 03/06/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var BaseController = require('./BaseController');
var _ = require('underscore');
var Request = require('../../lib/broker/Request');
var parseString = require('xml2js').parseString;
var brokerRequest = new Request();


var StudentController = new BaseController(Student).crud();
/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
StudentController.getStudentsBackpack = function (req, res) {
    var orgId = req.params.organizationId;
    var studentId = req.params.studentId;

    Student.findOne({_id: '' + studentId, organization: '' + orgId}, function (err, student) {

        if (err) return res.errJson(err);
        /**
         * If student is empty from database
         */
        if (!student) return res.errJson('The student not found in database');

        var request = brokerRequest.createRequestProvider(student.district_student_id, student.school_district, function (error, response, body) {

            if(error){
                return res.errJson(error);
            }
            if (!body) {
                return res.errJson('Data not found');
            }
            if (response && response.statusCode == '200') {
                parseString(body, function (err, result) {
                    var json = result.sre;
                    delete json['$'];
                    res.okJson(json);
                });
            } else {
                parseString(body, function (err, result) {
                    var json = result.Error;
                    res.errJson(json);
                });
            }
        });
    });
};
/**
 * Get all student in organization
 * @param req
 * @param res
 */
StudentController.getStudents = function (req, res) {
    var orgId = req.params.organizationId;
    Student.find({organization: orgId}, function (err, students) {
        if (err) return res.errJson(err);
        res.okJson(null, students);
    });
};
/**
 *
 * @param req
 * @param res
 */
StudentController.createByOrgId = function (req, res) {

    var obj = new Student(req.body);
    obj.organization = mongoose.Types.ObjectId(req.params.organizationId);
    obj.save(function (err) {
        if (err) {
            return res.errJson(err);
        }

        res.okJson('Successfully Added');
    });
};
/**
 * Get student organization by id
 * @param req
 * @param res
 */
StudentController.getStudentById = function (req, res) {
    var orgId = req.params.organizationId;
    Student.findOne({organization: orgId, _id: req.params.studentId}, function (err, student) {
        if (err) return res.errJson(err);
        res.okJson(student);
    });
};
StudentController.deleteStudentById = function (req, res) {
    var orgId = req.params.organizationId;
    Student.remove({organization: orgId, _id: req.params.studentId}, function (err, student) {
        if (err) return res.errJson(err);
        res.okJson('Successfully deleted');
    });
};

module.exports = StudentController;