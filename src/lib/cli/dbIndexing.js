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
                "permissions.activateStatus": 1,
                "permissions.role": 1
            }, { name: 'po_pa_pr_1', background: true }]
        ]
    },
    {
        name: 'Token',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ token: 1 }, { name: 'token_1', background: true, unique: true }],
            [{ token: 1, ip: 1, clientId: 1, userId: 1, scope: 1, expired: 1 }, { name: 'ctoken_1', background: true }]
        ]
    },
    {
        name: 'RefreshToken',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ refreshToken: 1 }, { name: 'refresh_token_1', background: true, unique: true }],
            [{ refreshToken: 1, clientId: 1, userId: 1 }, { name: 'refresh_token_client_user_1', background: true }]
        ]
    },
    {
        name: 'Tag',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ slug: 1 }, { name: 'slug_organization_1', background: true }]
        ]
    },
    {
        name: 'Client',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{
                name: 1,
                id: 1,
                secret: 1,
                userId: 1,
                redirectUri: 1
            }, { name: 'client_1', background: true }]
        ]
    },
    {
        name: 'Invite',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ authCode: 1, organization: 1, role: 1, is_special_case_worker: 1 }, { name: 'invite_1', background: true }]
        ]
    },
    {
        name: 'Permission',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ model: 1, allow: 1, operation: 1 }, { name: 'permission_1', background: true }]
        ]
    },
    {
        name: 'Organization',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ name: 1, website: 1, url: 1, externalServiceId: 1, personnelId: 1, authorizedEntityId: 1 }, { name: 'organization_1', background: true }]
        ]
    },
    {
        name: 'Program',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{ name: 1 }, { name: 'program_1', background: true }]
        ]
    },
    {
        name: 'Code',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{
                code: 1,
                redirectUri: 1,
                userId: 1,
                clientId: 1

            }, { name: 'code_1', background: true }]
        ]
    },
    {
        name: 'Student',
        index: [
            [{ _id: 1}, { name: '_id_' }],
            [{
                'programs.program': 1,
                'programs.active': 1,
                'programs.participation_start_date': 1,
                'programs.participation_end_date': 1,
                'programs.cohort': 1
            }, { name: 'student_program_id_1' }],
            [{ organization: 1, creator: 1, district_student_id: 1, school_district: 1, college_bound: 1 }, { name: 'student_1', background: true }]
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
                    console.log(err);
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