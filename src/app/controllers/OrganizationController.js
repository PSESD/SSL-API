/**
 * Created by zaenal on 21/05/15.
 */
var model = require('../models/Organization');
var Program = require('../models/Program');
var Model = require('../../lib/model');
var extend = require('util')._extend;
var _ = require('underscore');
var self = new Model(model);

var OrganizationController = extend(self.crud(), {

    /**
     * Get the list of all organizations that this user have access to in our system.
     * @param req
     * @param res
     * @returns {*}
     */
    get: function(req, res){
        var user = req.user;
        var crit = req.query.url ? { url: req.query.url } : {};
        var orgs = [];
        var orgIds = _.pluck(req.user.permissions, 'organization');
        crit._id = { $in: orgIds };
        self.model.find( crit, function (err, orgs) {
            if (err) return res.json({ error: err.message });
            res.json(orgs);
        });
    },

    profile: function(req, res){

    },
    allUsers: function(req, res){

    },
    getUser: function(req, res){

    },
    /**
     *
     * @param req
     * @param res
     */
    allProgram: function(req, res){
        var user = req.user;
        var orgId = self.orgId(user);
        var cb = self.cb(res);
        if(orgId.length === 0 || orgId.indexOf(req.params.organizationId) >= 0) {
            var crit = {_id: req.params.organizationId};
            self.model.findOne(crit, function (err, org) {
                if(err) return cb(err, null);
                //console.log({name: org.name });
                Program.find({name: org.name }, function (err, obj) {
                    if (err) {
                        return res.json({ error: err.message});
                    }
                    res.json(obj);
                });
            });
        }
    },
    /**
     *
     * @param req
     * @param res
     */
    getProgram: function(req, res){
        var user = req.user;
        var orgId = self.orgId(user);
        var cb = self.cb(res);
        if(orgId.length === 0 || orgId.indexOf(req.params.organizationId) >= 0 && req.params.programId) {
            var crit = {_id: req.params.organizationId};
            self.model.findOne(crit, function (err, org) {
                if(err) return cb(err, null);
                Program.find({ name: org.name, _id: req.params.programId }, function (err, obj) {
                    if (err) {
                        return res.json({ error: err.message});
                    }
                    res.json(obj);
                });
            });
        }
    }
});

module.exports = OrganizationController;