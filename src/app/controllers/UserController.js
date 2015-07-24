/**
 * Created by zaenal on 21/05/15.
 */
var User = require('../models/User');
var Client = require('../models/Client');
var Code = require('../models/Code');
var BaseController = require('./BaseController');
var util = require('util');
var extend = util._extend;
var _ = require('underscore');
var UserController = new BaseController(User).crud();
/**
 * Get Current User Login
 * @param req
 * @param res
 */
UserController.get = function (req, res) {

    var crit = User.crit(req.query, ['email']);

    crit.email = req.user.email;

    User.findOne(crit, function (err, obj) {

        if (err) return res.errJson(err);

        res.okJson(obj);

    });

};

/**
 * Delete by email
 * @param req
 * @param res
 */
UserController.deleteByEmail = function (req, res) {

    var model = User;

    var cb = function (userId, req) {

        model.remove({
            _id: userId
        }, function (err, obj) {

            if (err) return res.errJson(err);

            Client.remove({userId: userId}, function (err) {

                if (err) return res.errJson(err);

                Code.remove({userId: userId}, function (err) {

                    if (err) return res.errJson(err);

                });

            });

            res.okJson('Successfully deleted');

        });

    };

    if(req.body.email === req.user.email) return res.errUnauthorized();

    User.findOne({email: req.body.email}, function (err, user) {

        if (err) return res.errJson(err);

        if(!user) return res.errJson('User not found');

        cb(user._id, req);

    });

};
/**
 *
 * @param req
 * @param res
 */
UserController.updateAccount = function (req, res) {

    var crit = { _id: req.user._id };

    User.findOne(crit, function (err, obj) {

        if (err) return res.errJson(err);

        if(!obj) return res.errJson('User not found');

        ['role', 'is_special_case_worker', 'email'].forEach(function(name){
            if(name in req.body) delete req.body[name];
        });

        for (var prop in req.body) {

            obj[prop] = req.body[prop];

        }
        // set update time and update by user
        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        obj.save(function (err) {

            if (err) return res.errJson(err);

            res.okJson('Successfully updated!', obj);

        });

    });

};

/**
 *
 * @param req
 * @param res
 */
UserController.save = function (req, res) {

    var crit = {_id: req.user._id};

    if(req.body.email && req.user.isAdmin()){
        crit = { email: req.body.email };
        delete req.body.email;
    }

    User.findOne(crit, function (err, obj) {

        if (err) return res.errJson(err);

        if(!obj) return res.errJson('User not found');

        var role = null, is_special_case_worker = null;

        if(req.body.role) role = req.body.role;

        if(req.body.is_special_case_worker) is_special_case_worker = req.body.is_special_case_worker;
        /**
         * Filter if user downgrade here role
         */
        if(req.user._id === obj._id && req.user.isAdmin()){

            role = req.body.role;

            if(role === 'case-worker') return req.errJson("Admin never be able to downgrade itself to a case worker");

        }


        for (var prop in req.body) {

            if('email' === prop || 'role' === prop || 'is_special_case_worker' === prop) continue;

            obj[prop] = req.body[prop];

        }


        obj.saveWithRole(req.user, req.params.organizationId, role, is_special_case_worker, function (err) {

            if (err) return res.errJson(err);

            res.okJson('Successfully updated!', obj);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
UserController.setRole = function(req, res){

    var crit = { _id: req.params.userId };


    User.findOne(crit, function (err, obj) {

        if (err) return res.errJson(err);

        if(!obj) return res.errJson('User not found');

        var role = req.body.role;

        var is_special_case_worker = req.body.is_special_case_worker;

        if(is_special_case_worker === 'true') is_special_case_worker = true;

        else if(is_special_case_worker === 'false') is_special_case_worker = false;


        obj.saveWithRole(req.user, req.organization._id, role, is_special_case_worker, function (err) {

            if (err) return res.errJson(err);

            res.okJson('Successfully updated!', obj);

        });

    });

};



UserController.getRole = function(){

    return res.okJson(null, [
            { role: 'superadmin', description: 'Have access to all system in a CBO ' },
            { role: 'admin', description: 'Have access to all students in a CBO in their organization permission' },
            { role: 'case-worker', description: 'Some case workers only have access to the students in their permission list, some other have access to all students.' }
    ]);

};
/**
 *
 * @param req
 * @param res
 */
UserController.cleanAll = function(req, res){

    var email = req.body.email || req.query.email;

    var emails = [ 'test@test.com', 'support@upwardstech.com' ];

    if(!email || emails.indexOf(email) === -1) return res.errJson('Mandatory parameters was empty');

    User.findOne({ email: email }, function(err, user){

        if(err) return res.errJson(err);

        User.removeDeep(user._id, function(err){ console.log(err);});

        res.okJson('Done');

    });

};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = UserController;