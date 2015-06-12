var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
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
         * @returns {*}
         */
        _checkPermission: function(req){

            if(!req.user) return false;

            if(typeof req.params.organizationId === undefined) return false;

            if(!req.params.organizationId) return false;

            var orgid = req.user.organizationId;

            if(orgid.length === 0){
                return true;
            }

            return orgid.indexOf(req.params.organizationId);
        },
        /**
         *
         * @param req
         * @param res
         * @param callback
         */
        grant: function(req, res, callback){
            if(this._checkPermission(req)){
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
            obj.save(function (err) {
                if (err) {
                    return res.errJson(err);
                }

                res.okJson('Successfully Added', obj);
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        save: function (req, res) {

            self.model.findOne({ _id: ObjectId(req.params[id]) }, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }

                if(!obj) return res.errJson('Data not found');

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
        },
        /**
         *
         * @param req
         * @param res
         */
        get: function (req, res) {
            self.model.findOne({ _id: ObjectId(req.params[id]) }, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }
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
                if (err) {
                    return res.errJson(err);
                }
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
                if (err) {
                    return res.errJson(err);
                }

                res.okJson('Successfully deleted');
            });
        }
    }
};

module.exports = BaseController;