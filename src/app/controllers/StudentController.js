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
        var zoneId = req.body.zoneId || 'federalway';
        var brokerRequest = new Request();
        brokerRequest.addHeader( 'districtStudentId', studentId );
        var request = brokerRequest.create('/validation-sre/' + studentId + ';zoneId='+zoneId+';contextId=CBO', 'GET', function (error, response, body) {
            if(response.statusCode == '200'){
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
    }
});

module.exports = StudentController;