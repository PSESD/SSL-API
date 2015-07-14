/**
 * Created by zaenal on 07/07/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var User = require('../models/User');
var Organization = require('../models/Organization');
var BaseController = require('./BaseController');
var _ = require('underscore');
var Request = require('../../lib/broker/Request');
var parseString = require('xml2js').parseString;
var utils = require('../../lib/utils'), cache = utils.cache();
var ObjectId = mongoose.Types.ObjectId;
var PRSController = new BaseController(null).crud();

/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
PRSController.getDistricts = function (req, res) {

    var cb = function() {

        var brokerRequest = new Request();

        var key = ['getDistricts', req.params.organizationId].join('_');

        cache.get(key, function(err, result){

            if(err) utils.log(err);

            if(!result){

                console.log("GET FROM SERVER");

                brokerRequest.createPsr('districts', function (error, response, body) {

                    if (error)  return res.errJson(error);

                    if (!body) return res.errJson('Data not found');

                    if (response && response.statusCode == '200') {

                        parseString(body, { explicitArray: false }, function (err, result) {

                            var json = result.ArrayOfDistrictSummary;

                            delete json['$'];

                            cache.set(key, json, function(err){

                                utils.log(err);

                                res.okJson(json);

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

                console.log("GET FROM CACHE");

                res.okJson(result);

            }

        });

    };

    PRSController.grant(req, res, cb, {
        onCheck: function(isMatch){

            return true;
        }
    });

};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = PRSController;