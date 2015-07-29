/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/User');
var Student = require('../models/Student');
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
UserController.myAccount = function (req, res) {

    var crit = { _id: req.user._id };

    User.findOne(crit, function (err, obj) {

        if (err) return res.errJson(err);

        res.okJson(obj);

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
        if(req.user._id.toString() === obj._id.toString() && req.user.isAdmin()){

            role = req.body.role;

            if(role === 'case-worker') return res.errJson("Admin never be able to downgrade itself to a case worker");

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

        /**
         * Filter if user downgrade here role
         */
        if(req.user._id.toString() === obj._id.toString() && req.user.isAdmin()){

            if(role === 'case-worker') return res.errJson("Admin never be able to downgrade itself to a case worker");

        }


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
 * ----------------------- USER STUDENT ------------------------------------
 */
UserController.getByUserId = function(req, res){

    var currentUserId   = req.params.userId;

    var organizationId  = req.params.organizationId;

    User.findOne({ _id: ObjectId(currentUserId)}, function(err, currUser){

        if(err) return res.errJson(err);

        if(!currUser) return res.errJson('User not found!');

        currUser.getCurrentPermission(organizationId);

        Student.protect(currUser.role, null, currUser).find({ organization: ObjectId(organizationId) }, function (err, students) {

            if (err) return res.errJson(err);

            res.okJson(null, students);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
UserController.postByUserId = function(req, res){

    var currentUserId   = req.params.userId;

    var organizationId  = req.params.organizationId;

    var user            = req.user;

    User.findOne({ _id: ObjectId(currentUserId) }, function(err, currUser){

        if(err) return res.errJson(err);

        if(!currUser) return res.errJson('User not found!');

        var obj = new Student(req.body);

        obj.organization = ObjectId(organizationId);

        // set update time and update by user
        obj.created = new Date();

        obj.creator = req.user.userId;

        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        obj.save(function (err) {

            if (err)  return res.errJson(err);

            _.each(currUser.permissions, function(permission, key){

                if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                    currUser.permissions[key].students.push(obj._id);

                }

            });

            currUser.save(function(err){

                if (err)  return res.errJson(err);

                res.okJson('Successfully Added', obj);
            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
UserController.getStudentUserById = function(req, res){

    var currentUserId   = req.params.userId;

    var organizationId  = req.params.organizationId;

    var studentId       = req.params.studentId;

    User.findOne({ _id: ObjectId(currentUserId) }, function(err, currUser){

        if(err) return res.errJson(err);

        if(!currUser) return res.errJson('User not found!');

        currUser.getCurrentPermission(organizationId);

        Student.protect(currUser.role, { students: ObjectId(studentId) }, currUser).findOne({ _id: studentId, organization: ObjectId(organizationId) }, function (err, students) {

            if (err) return res.errJson(err);

            res.okJson(null, students);

        });

    });

};


/**
 *
 * @param req
 * @param res
 */
UserController.putStudentUserById = function(req, res){

    var currentUserId   = req.params.userId;

    var organizationId  = req.params.organizationId;

    var studentId       = ObjectId(req.params.studentId);

    User.findOne({ _id: ObjectId(currentUserId) }, function(err, currUser){

        if(err) return res.errJson(err);

        if(!currUser) return res.errJson('User not found!');

        Student.findOne({ _id: studentId, organization: ObjectId(organizationId) }, function (err, obj) {

            if (err)  return res.errJson(err);

            if (!obj) return res.errJson('Data not found');

            for (var prop in req.body) {

                if(prop in obj) {

                    obj[prop] = req.body[prop];

                }

            }
            // set update time and update by user
            obj.last_updated = new Date();

            obj.last_updated_by = req.user.userId;

            obj.save(function (err) {

                if (err) return res.errJson(err);

                _.each(currUser.permissions, function(permission, key){

                    if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                        currUser.permissions[key].students.push(obj._id);

                    }

                });

                currUser.save(function(err){

                    if (err)  return res.errJson(err);

                    res.okJson('Successfully Updated!', obj);

                });


            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
UserController.deleteStudentUserById = function(req, res){

    var currentUserId   = req.params.userId;

    var organizationId  = req.params.organizationId;

    var user            = req.user;

    var studentId       = req.params.studentId;

    User.findOne({ _id: ObjectId(currentUserId) }, function(err, currUser){

        if(err) return res.errJson(err);

        if(!currUser) return res.errJson('User not found!');

        Student.findOne({ _id: studentId, organization: ObjectId(organizationId) }, function (err, student) {

            if (err) return res.errJson(err);

            if(!student) return res.errJson('Student not found!');

            var allpermission = [];

            for (var i = 0; i < currUser.permissions.length; i++) {

                if (student.organization.toString() === (currUser.permissions[i].organization + '')) {

                    var permissionStudents = [];

                    _.each(currUser.permissions[i].students, function(std, key){

                        if(std.toString() !== student._id.toString()){

                            permissionStudents.push(std);

                        }

                    });

                    currUser.permissions[i].students = permissionStudents;

                }

                allpermission.push(currUser.permissions[i]);

            }

            User.where({_id: currUser._id}).update({$set: {permissions: allpermission}, last_updated: new Date(), last_updated_by: req.user.userId }, function (err, updated) {

                if (err) return res.errJson(err);

                res.okJson('Successfully Deleted!', student);

            });

        });

    });

};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = UserController;