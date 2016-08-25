/**
 * Created by zaenal on 25/08/16.
 */
'use strict';

var mongoose = require('mongoose');
require('./db');
var async = require('async');
var utils = require('./../utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5, benchmark = utils.benchmark();
var indexing = [
    {
        name: 'User',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ email: 1, is_super_admin: 1 }, { name: 'email_1_is_super_admin_1_role_1', background: true }],
            [{ pending: 1}, { name: 'pending', background: true }],
            [{ hashedPassword: 'hashed'}, { name: 'hashedPassword_1', background: true }],
            [{ hashedAuthCode: 1, salt: 1, hashedForgotPassword: 1, hashedForgotPasswordExpire: 1 }, { name: 'hashed_1', background: true }],
            [{
                "permissions.permissions.model": 1,
                "permissions.permissions.allow": 1,
                "permissions.permissions.operation": 1
            }, { name: 'ppm_ppa_ppo_1', background: true }],
            [{
                "permissions.organization": 1,
                "permissions.activate": 1,
                "permissions.role": 1
            }, { name: 'po_pa_pr_1', background: true }]
        ]
    },
    {
        name: 'Token',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ token: 1, ip: 1, clientId: 1, userId: 1, scope: 1, expired: 1 }, { name: 'token', background: true }]
        ]
    },
    {
        name: 'Token',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ token: 1 }, { name: 'token_1', background: true, unique: true }],
            [{ token: 1, ip: 1, clientId: 1, userId: 1, scope: 1, expired: 1 }, { name: 'ctoken_1', background: true }]
        ]
    }
];

module.exports = {
    /**
     *
     * @param done
     */
    reIndex: function(done){


        var map = function (cname, cb) {
            var Model = require('../../app/models/'+cname.name);
            Model.collection.dropIndexes(function (err) {
                if(err){
                    return cb(err);
                }
                console.log(' ---------------------------------------------------------------------------');
                console.log(' DROP INDEX ----> ' + cname.name);
                console.log(' ---------------------------------------------------------------------------');
                async.each(cname.index, function(index, cb2){
                    console.log(' //----> ', JSON.stringify(index[0]));
                    Model.collection.createIndex(index[0], index[1], function (err) {
                        if(err){
                            console.log('ERROR index: ', index);
                            return cb2(err);
                        }
                        cb2(null, index);
                    });
                }, cb);

            });

        };
        async.each(indexing, map, done);
    }
};