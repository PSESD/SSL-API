var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/User');
var _ = require('underscore');
/**
 * Created by zaenal on 05/06/15.
 */
function BaseController(model){
    this.model = model;
    this.crud();
};
/**
 *
 * @returns {{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
BaseController.prototype.crud = function(idName) {
    var self = this;

    var id = idName || 'id';

    return {
        /**
         *
         * @param req
         * @param options
         * @returns {*}
         * @private
         */
        _checkPermission: function(req, options){

            var currentUser = req.user;

            if(!_.isObject(options)) options = {};

            if('user' in options && options.user instanceof User){

                currentUser = options.user;

            }

            if(!currentUser) return false;

            if(typeof req.params.organizationId === undefined) return false;

            var organizationId = req.params.organizationId;

            if('organizationId' in options && String.valueOf(options.organizationId).length > 0){

                organizationId = options.organizationId;

            }

            if(!organizationId) return false;

            var orgid = currentUser.organizationId;

            if('onCheck' in options && typeof options.onCheck === 'function'){

                return options.onCheck(orgid.indexOf(organizationId) !== -1);

            }

            return orgid.indexOf(organizationId);

        },
        /**
         *
         * @param req
         * @param res
         * @param callback
         * @param options
         */
        grant: function(req, res, callback, options){

            if(this._checkPermission(req, options)){

                callback();

            } else {

                res.errJson("Permission denied!");

            }
        },
        /**
         *
         * @param req
         * @param res
         */
        create: function (req, res) {

            var newModel = self.model;

            var obj = new newModel(req.body);

            // set update time and update by user
            if(!obj.created) obj.created = new Date();

            if(!obj.creator) obj.creator = req.user.userId;

            if(!obj.last_updated) obj.last_updated = new Date();

            if(!obj.last_updated_by) obj.last_updated_by = req.user.userId;

            obj.save(function (err) {

                if (err)  return res.errJson(err);

                return res.okJson('Successfully Added', obj);

            });
        },
        /**
         *
         * @param req
         * @param res
         */
        save: function (req, res) {

            self.model.findOne({ _id: ObjectId(req.params[id]) }, function (err, obj) {

                if (err)  return res.errJson(err);

                if(!obj) return res.errJson('Data not found');

                for (var prop in req.body) {

                    if(prop in obj) {

                        obj[prop] = req.body[prop];

                    }
                }

                if(!obj.last_updated) obj.last_updated = new Date();

                if(!obj.last_updated_by) obj.last_updated_by = req.user.userId;

                // save the movie
                obj.save(function (err) {

                    if (err)  return res.errJson(err);

                    res.okJson('Successfully updated!', obj);

                });
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        get: function (req, res) {

            self.model.findOne({ _id: ObjectId(req.params[id]) }, function (err, obj) {

                if (err)  return res.errJson(err);

                res.json(obj);

            });
        },
        /**
         *
         * @param req
         * @param res
         */
        all: function (req, res) {

            self.model.find(function (err, objs) {

                if (err)  return res.errJson(err);

                res.json(objs);

            });
        },
        /**
         *
         * @param req
         * @param res
         */
        delete: function (req, res) {
            self.model.remove({
                _id: ObjectId(req.params[id])
            }, function (err, obj) {

                if (err)  return res.errJson(err);

                res.okJson('Successfully deleted');

            });
        }
    }
};
/**
 *
 * @type {BaseController}
 */
module.exports = BaseController;