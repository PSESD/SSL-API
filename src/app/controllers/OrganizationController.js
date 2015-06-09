/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var Organization = require('../models/Organization');
var Program = require('../models/Program');
var User = require('../models/User');
var BaseController = require('./BaseController');
var _ = require('underscore');


var OrganizationController = new BaseController(Organization).crud();
/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
OrganizationController.get = function (req, res) {
    var user = req.user;
    var crit = req.query.url ? {url: req.query.url} : {};
    var orgs = [];
    var orgIds = _.pluck(req.user.permissions, 'organization');
    crit._id = {$in: orgIds};
    Organization.find(crit, function (err, orgs) {
        if (err) return res.errJson(err);
        res.okJson(null, orgs);
    });
};

OrganizationController.profile = function (req, res) {

};
/**
 * Find all users by org id
 * @param req
 * @param res
 */
OrganizationController.allUsers = function (req, res) {
    if(!req.params.organizationId) return res.errJson('Data not found!');

    User.find({
        $or: [
            { permissions: { $elemMatch: { organization : mongoose.Types.ObjectId(req.params.organizationId) } } },
            { permissions: [] }
        ]
    }, function(err, users){
        if(err) return res.errJson(err);
        res.okJson(null, users);
    });
};
/**
 * Find organization by user id
 * @param req
 * @param res
 */
OrganizationController.getUser = function (req, res) {
    if(!req.params.organizationId || !req.params.userId) return res.errJson('Data not found!');

    User.findOne({ _id: mongoose.Types.ObjectId(req.params.userId),
        $or: [
            { permissions: { $elemMatch: { organization : mongoose.Types.ObjectId(req.params.organizationId) } } },
            { permissions: [] }
        ]
   }, function(err, user){
        if(err) return res.errJson(err);
        res.okJson(user);
    });
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.allProgram = function (req, res) {
    var user = req.user;
    var orgId = this.getOrgIdByUser(user);
    if (orgId.length === 0 || orgId.indexOf(req.params.organizationId) >= 0) {
        var crit = {_id: req.params.organizationId};
        Organization.findOne(crit, function (err, org) {
            if (err) return res.errJson(err);
            //console.log({name: org.name });
            Program.find({name: org.name}, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }
                res.okJson(obj);
            });
        });
    }
};

OrganizationController.getOrgIdByUser = function(user){
    var _id = [];
    if(user.permissions.length > 0){

        user.permissions.forEach(function(organization){
            _id.push(organization.organization);
        });
    }
    return _id;
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.getProgram = function (req, res) {
    var user = req.user;
    var orgId = self.orgId(user);
    if ((orgId.length === 0 || orgId.indexOf(req.params.organizationId) >= 0) && req.params.programId) {
        var crit = {_id: req.params.organizationId};
        Organization.findOne(crit, function (err, org) {
            if (err) return res.errJson(err);
            Program.find({name: org.name, _id: req.params.programId}, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }
                res.okJson(obj);
            });
        });
    }
};

module.exports = OrganizationController;