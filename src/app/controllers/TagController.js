/**
 * Created by zaenal on 03/06/15.
 */
var mongoose = require('mongoose');
var Tag = require('../models/Tag');
var User = require('../models/User');
var Organization = require('../models/Organization');
var BaseController = require('./BaseController');
var _ = require('underscore');
var Request = require('../../lib/broker/Request');
var parseString = require('xml2js').parseString;
var utils = require('../../lib/utils'), cache = utils.cache();
var ObjectId = mongoose.Types.ObjectId;
var TagController = new BaseController(Tag).crud();

/**
 * Get all tag in organization
 * @param req
 * @param res
 */
TagController.getTags = function (req, res) {

    var cb = function() {

        var orgId = ObjectId(req.params.organizationId);

        Tag.find({organization: orgId}, function (err, tags) {

            if (err) return res.errJson(err);

            res.okJson(null, tags);

        });
    };

    TagController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
TagController.createByOrgId = function (req, res) {

    var cb = function() {

        var obj = new Tag(req.body);

        obj.organization = mongoose.Types.ObjectId(req.params.organizationId);

        // set update time and update by user
        obj.created = new Date();

        obj.creator = req.user.userId;

        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        obj.save(function (err) {

            if (err)  return res.errJson(err);

            res.okJson('Successfully Added', obj);

        });

    };

    TagController.grant(req, res, cb);
};
/**
 * Get tag organization by id
 * @param req
 * @param res
 */
TagController.getTagById = function (req, res) {

    var cb = function() {

        var orgId = req.params.organizationId;

        var tagId = ObjectId(req.params.tagId);

        Tag.findOne({ organization: ObjectId(orgId), _id: tagId }, function (err, tag) {

            if (err) return res.errJson(err);
            /**
             * If tag is empty from database
             */
            if (!tag) return res.errJson('The tag not found in database');

            res.okJson(tag);

        });
    };

    TagController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
TagController.deleteTagById = function (req, res) {

    var cb = function() {

        var orgId = req.params.organizationId;

        var tagId = ObjectId(req.params.tagId);

        Tag.remove({ organization: ObjectId(orgId), _id: tagId }, function (err, tag) {

            if (err) return res.errJson(err);

            res.okJson('Successfully deleted');

        });
    };

    TagController.grant(req, res, cb);
};
/**
 *
 * @param req
 * @param res
 */
TagController.putTagById = function(req, res){

    var cb = function () {

        var tagId = ObjectId(req.params.tagId);



        Tag.findOne({ _id: tagId, organization: ObjectId(req.params.organizationId) }, function (err, obj) {

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

                res.okJson('Successfully updated!', obj);

            });

        });

    };

    TagController.grant(req, res, cb);
};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = TagController;