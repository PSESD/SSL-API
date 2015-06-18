/**
 * Created by zaenal on 21/05/15.
 */
var User = require('../models/User');
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
    User.findOne({email: req.user.email}, function (err, obj) {
        if (err) {
            return res.errJson(err);
        }
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
            if (err) {
                return res.errJson(err);
            }

            Client.remove({userId: userId}, function (err) {
                if (err) {
                    return res.errJson(err);
                }
                Code.remove({userId: userId}, function (err) {
                    if (err) {
                        return res.errJson(err);
                    }
                });
            });

            res.okJson('Successfully deleted');
        });
    };

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
UserController.save = function (req, res) {
    var crit = {_id: req.user._id};
    if(req.body.email){
        crit = { email: req.body.email };
    }
    req.app.get('log')(crit);
    User.findOne(crit, function (err, obj) {
        if (err) {
            return res.errJson(err);
        }

        for (var prop in req.body) {
            obj[prop] = req.body[prop];
        }

        // set update time and update by user
        obj.last_updated = new Date();
        obj.last_updated_by = req.user.userId;

        obj.save(function (err) {
            if (err) {
                return res.errJson(err);
            }

            res.okJson('Successfully updated!', obj);
        });
    });
};
/**
 *
 * @param req
 * @param res
 */
UserController.cleanAll = function(req, res){
    var email = req.body.email || req.query.email;
    var emails = [ 'test@test.com', 'support@upwardstech.com'];
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