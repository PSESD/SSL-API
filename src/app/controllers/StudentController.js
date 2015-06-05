/**
 * Created by zaenal on 03/06/15.
 */
var model = require('../models/Student');
var Model = require('../../lib/model');
var extend = require('util')._extend;
var _ = require('underscore');
var self = new Model(model);
var Request = require('../../lib/broker/Request');
var parseString = require('xml2js').parseString;
var brokerRequest = new Request();

var StudentController = extend(self.crud(), {

    /**
     * Get the list of all organizations that this user have access to in our system.
     * @param req
     * @param res
     * @returns {*}
     */
    getStudentsBackpack: function(req, res){
        var orgId = req.params.organizationId;
        var studentId = req.params.studentId;
        self.model.findOne({ _id: ''+studentId, organization: ''+orgId }, function(err, student){

            if(err) return res.json(err);
            /**
             * If student is empty from database
             */
            if(!student) return res.json({error: true, message: 'The student not found in database'});

            var request = brokerRequest.createRequestProvider(student.district_student_id, student.school_district, function (error, response, body) {
                if(!body){
                    return res.json({error: true, message: 'Data not found'});
                }
                if(response && response.statusCode == '200'){
                    parseString(body, function (err, result) {
                        var json = result.sre;
                        delete json['$'];
                        res.json(json);
                    });
                } else {
                    parseString(body, function (err, result) {
                        var json = result.Error;
                        res.json(json);
                    });
                }
            });
        });

    },
    /**
     * Get all student in organization
     * @param req
     * @param res
     */
    getStudents: function(req, res){
        var orgId = req.params.organizationId;
        self.model.find({ organization: orgId }, function(err, students){
            if(err) return res.json(err);
            res.json(students);
        });
    },
    /**
     * Get student organization by id
     * @param req
     * @param res
     */
    getStudentById: function(req, res){
        var orgId = req.params.organizationId;
        self.model.findOne({ organization: orgId, _id: req.params.studentId }, function(err, student){
            if(err) return res.json(err);
            res.json(student);
        });
    }
});

module.exports = StudentController;