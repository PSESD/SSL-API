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
    } else {
        return res.okJson(null, []);
    }
    //console.log('ORG CRIT: %j', crit);
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
/**
 * General information and setup of an organization.
 * Get organization item
 * @param req
 * @param res
 */
OrganizationController.profile = function (req, res) {
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
/**
 * General information and setup of an organization.
 * @param req
 * @param res
 */
OrganizationController.updateProfile = function(req, res){
    var cb = function () {
        Organization.findOne({_id: ObjectId(req.params.organizationId)}, function (err, obj) {

            if (err)  return res.errJson(err);

            if (!obj) return res.errJson('Data not found');

            for (var prop in req.body) {
                if (prop in obj) {
                    obj[prop] = req.body[prop];
                }
            }
            // set update time and update by user
            obj.last_updated = new Date();
            obj.last_updated_by = req.user.userId;
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
 * Find all users by org id
 * @param req
 * @param res
 */
OrganizationController.allUsers = function (req, res) {

    var cb = function () {

        User.find({permissions: {$elemMatch: {organization: ObjectId(req.params.organizationId)}}}, function (err, users) {

            if (err) return res.errJson(err);

            res.okJson(null, users);

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
OrganizationController.postUser = function (req, res) {

    var cb = function() {
        var orgId = req.params.organizationId;
        var userId = req.body.userId;

        var permissions = {};

        if (req.body.organization) permissions.organization = ObjectId(req.body.organization);
        permissions.students = req.body.students || [];
        permissions.permissions = req.body.permissions || [];

        permissions.created = new Date();
        permissions.creator = req.user.userId;
        permissions.last_updated = new Date();
        permissions.last_updated_by = req.user.userId;

        if (_.isEmpty(permissions)) {
            return res.errJson('POST parameter is empty!');
        }

        User.findOne({_id: ObjectId(userId)}, function (err, user) {

            if (err) return res.errJson(err);

            if (!user) return res.errJson('User data not found');

            user.permissions.push(permissions);


            // set update time and update by user
            user.last_updated = new Date();
            user.last_updated_by = req.user.userId;

            user.save(function (err) {

                if (err) return res.errJson(err);


                res.okJson('Organization successfully add to User', user);
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
OrganizationController.putUser = function (req, res) {
    var cb = function () {

        User.findOne({_id: ObjectId(req.params.userId)}, function (err, obj) {

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
OrganizationController.allProgram = function (req, res) {

    var cb = function () {

            Program.find({organization: ObjectId(req.params.organizationId)}, function (err, objs) {

                if (err)  return res.errJson(err);

                res.okJson(null, objs);
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
            User.where({_id: user._id}).update({$set: {permissions: allpermission}, last_updated: Date.now, last_updated_by: req.user.userId }, function (err, updated) {

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

        Program.findOne({_id: ObjectId(req.params.programId), organization: ObjectId(req.params.organizationId)}, function (err, obj) {

            if (err)  return res.errJson(err);

            if (!obj) return res.errJson('Data not found');

            res.okJson(obj);

        });

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

        obj.organization = mongoose.Types.ObjectId(req.params.organizationId);
        // set update time and update by user
        obj.created = new Date();
        obj.creator = req.user.userId;
        obj.last_updated = new Date();
        obj.last_updated_by = req.user.userId;

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

        Program.findOne({_id: ObjectId(req.params.programId), organization: ObjectId(req.params.organizationId)}, function (err, obj) {

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
            _id: ObjectId(req.params.programId),
            organization: ObjectId(req.params.organizationId)
        }, function (err, obj) {

            if (err) {

                return res.errJson(err);

            }

            res.okJson('Successfully deleted');

        });

    };

    OrganizationController.grant(req, res, cb);
};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = OrganizationController;