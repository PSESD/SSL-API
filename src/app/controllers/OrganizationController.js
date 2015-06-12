/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var Organization = require('../models/Organization');
var Program = require('../models/Program');
var User = require('../models/User');
var BaseController = require('./BaseController');
var _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;

var OrganizationController = new BaseController(Organization).crud('organizationId');
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

    if (orgs.length > 0) {
        crit._id = {$in: orgs};
    }

    Organization.find(crit, function (err, orgs) {
        if (err) return res.errJson(err);
        res.okJson(null, orgs);
    });

};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.find = function (req, res) {

    var crit = req.query.url ? {url: req.query.url} : {};

    crit._id = req.params.organizationId;

    var cb = function () {
        Organization.findOne(crit, function (err, org) {
            if (err) return res.errJson(err);
            res.okJson(org);
        });
    };

    OrganizationController.grant(req, res, cb);

};

OrganizationController.profile = function (req, res) {

};
/**
 * Find all users by org id
 * @param req
 * @param res
 */
OrganizationController.allUsers = function (req, res) {

    var cb = function () {

        OrganizationController.grant(req, res, function () {

            User.find({permissions: {$elemMatch: {organization: ObjectId(req.params.organizationId)}}}, function (err, users) {

                if (err) return res.errJson(err);

                res.okJson(null, users);

            });

        });
    };

    OrganizationController.grant(req, res, cb);
};
/**
 * Find organization by user id
 * @param req
 * @param res
 */
OrganizationController.getUser = function (req, res) {

    var cb = function () {

        User.findOne({

            _id: ObjectId(req.params.userId),

            permissions: {$elemMatch: {organization: ObjectId(req.params.organizationId)}}

        }, function (err, user) {

            if (err) return res.errJson(err);

            res.okJson(user);

        });

    };

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.allProgram = function (req, res) {

    var cb = function () {

        var crit = {_id: req.params.organizationId};

        Organization.findOne(crit, function (err, org) {

            if (err) return res.errJson(err);

            Program.find({name: org.name}, function (err, obj) {

                if (err) {

                    return res.errJson(err);

                }

                res.okJson(obj);

            });

        });

    };

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.deleteUser = function (req, res) {

    var cb = function () {

        User.findOne({_id: ObjectId(req.params.userId)}, function (err, user) {

            if (err) return res.errJson(err);


            if (!user) return res.errJson("User not found");

            var allpermission = [];

            for (var i = 0; i < user.permissions.length; i++) {

                if (req.params.organizationId != (user.permissions[i].organization + '')) {

                    allpermission.push(user.permissions[i]);

                }
            }

            User.where({_id: user._id}).update({$set: {permissions: allpermission}}, function (err, updated) {

                if (err) return res.errJson(err);

                res.okJson('Delete success');

            });
        });
    };

    OrganizationController.grant(req, res, cb);
};

/**
 *
 * @param req
 * @param res
 */
OrganizationController.getProgram = function (req, res) {

    var cb = function () {
        if (req.params.programId) {

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

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.postProgram = function (req, res) {

    var cb = function () {

        var obj = new Program(req.body);

        obj.save(function (err) {

            if (err) {

                return res.errJson(err);

            }

            res.okJson('Successfully Added', obj);

        });

    };

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.putProgram = function (req, res) {
    var cb = function () {

        Program.findOne({_id: ObjectId(req.params.programId)}, function (err, obj) {

            if (err) {

                return res.errJson(err);

            }

            for (var prop in req.body) {

                if(prop in obj) {

                    obj[prop] = req.body[prop];

                }

            }

            // save the movie
            obj.save(function (err) {

                if (err) {

                    return res.errJson(err);
                }

                res.okJson('Successfully updated!', obj);

            });

        });

    };

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
OrganizationController.deleteProgram = function (req, res) {

    var cb = function () {

        Program.remove({

            _id: ObjectId(req.params.programId)

        }, function (err, obj) {

            if (err) {

                return res.errJson(err);

            }

            res.okJson('Successfully deleted');

        });

    };

    OrganizationController.grant(req, res, cb);
};

module.exports = OrganizationController;