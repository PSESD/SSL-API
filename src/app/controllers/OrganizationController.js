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
    var orgs = user.organizationId;

    if(orgs.length > 0){
        crit._id = { $in: user.organizationId };
    }
    Organization.find(crit, function (err, orgs) {
        if (err) return res.errJson(err);
        res.okJson(null, orgs);
    });

};

OrganizationController.find = function (req, res) {
    var user = req.user;
    var crit = req.query.url ? {url: req.query.url} : {};
    crit._id = req.params.organizationId;


    OrganizationController.grant(req, res, function(){
        Organization.findOne(crit, function (err, org) {
            if (err) return res.errJson(err);
            res.okJson(org);
        });
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
    OrganizationController.grant(req, res, function() {
        User.find({
            $or: [
                {permissions: {$elemMatch: {organization: mongoose.Types.ObjectId(req.params.organizationId)}}},
                {permissions: []}
            ]
        }, function (err, users) {
            if (err) return res.errJson(err);
            res.okJson(null, users);
        });
    });
};
/**
 * Find organization by user id
 * @param req
 * @param res
 */
OrganizationController.getUser = function (req, res) {
    if(!req.params.organizationId || !req.params.userId) return res.errJson('Data not found!');
    OrganizationController.grant(req, res, function() {
        User.findOne({
            _id: mongoose.Types.ObjectId(req.params.userId),
            $or: [
                {permissions: {$elemMatch: {organization: mongoose.Types.ObjectId(req.params.organizationId)}}},
                {permissions: []}
            ]
        }, function (err, user) {
            if (err) return res.errJson(err);
            res.okJson(user);
        });
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
/**
 *
 * @param req
 * @param res
 */
OrganizationController.deleteUser = function (req, res) {

    OrganizationController.grant(req, res, function(){
        User.findOne({_id: mongoose.Types.ObjectId(req.params.userId)}, function(err, user){
            if(err) return res.errJson(err);

            if(!user) return res.errJson("User not found");

            var allpermission = [];

            for(var i = 0; i < user.permissions.length; i++){
                if(req.params.organizationId != (user.permissions[i].organization+'')){
                    allpermission.push(user.permissions[i]);
                }
            }

            User.where({_id: user._id}).update({ $set: { permissions: allpermission }}, function(err, updated){
                if(err) return res.errJson(err);

                res.okJson('Delete success');
            });
        });
    });
};
/**
 *
 * @param user
 * @returns {Array}
 */
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
/**
 *
 * @param req
 * @param res
 */
OrganizationController.postProgram =  function(req, res){
    OrganizationController.grant(req, res, function() {

    });
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.putProgram =  function(req, res){
    OrganizationController.grant(req, res, function() {

    });
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.deleteProgram =  function(req, res){
    OrganizationController.grant(req, res, function() {

    });
};

module.exports = OrganizationController;