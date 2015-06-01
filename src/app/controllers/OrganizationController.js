/**
 * Created by zaenal on 21/05/15.
 */
var model = require('../models/Organization');
var Model = require('../../lib/model');
var extend = require('util')._extend;
var self = new Model(model);
var OrganizationController = extend(self.crud(), {
    get: function(req, res){
        var crit = req.query.url ? { url: req.query.url } : {};
        var user = req.user;
        if(user.permissions.length > 0){
            var _id = [];
            user.permissions.forEach(function(organization){
                _id.push(organization.organization);
            });
            crit._id = { $in: _id };
        }
        console.log('CRIT: ', crit);
        self.model.find(crit, function(err, objs) {
            if (err) {
                return res.send(err);
            }
            res.json(objs);
        });
    },

    profile: function(req, res){

    },
    allUsers: function(req, res){

    },
    getUser: function(req, res){

    },
    allProgram: function(req, res){

    },

    getProgram: function(req, res){

    }
});

module.exports = OrganizationController;