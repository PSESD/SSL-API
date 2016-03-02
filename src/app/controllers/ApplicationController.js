/**
 * Created by zaenal on 01/03/16.
 */
'use strict';
/**
 * Created by zaenal on 03/06/15.
 */
var mongoose = require('mongoose');
var Token = require('../models/Token');
var async = require('async');
var moment = require('moment');
var crypto = require('crypto');
var User = require('../models/User');
var Organization = require('../models/Organization');
var BaseController = require('./BaseController');
var _ = require('underscore');
var php = require('phpjs');
var Request = require('../../lib/broker/request');
var parseString = require('xml2js').parseString;
var utils = require('../../lib/utils'), cache = utils.cache();
var ObjectId = mongoose.Types.ObjectId;
var slug = require('slug');
var ApplicationController = new BaseController(Token).crud();

/**
 * Get all application in organization
 * @param req
 * @param res
 */
ApplicationController.get = function (req, res) {

    res.xmlKey = 'applications';

    var orgId = req.params.organizationId;

    Token.find({app_name: { $exists: true }, clientId: new RegExp("/^" + orgId + "\_/") }, function (err, tokens) {

        if (err)  { return res.sendError(err); }

        async.map(tokens, function(token, cb){

            User.findOne({ _id: ObjectId(token.userId) }, function(e, u){

                cb(null, {
                    _id: token._id,
                    app_name: token.app_name,
                    created_by: token.created_by,
                    created: token.created,
                    email: u.email
                });

            });


        }, function(err, results){

            if(err){
                return res.sendError(err);
            }

            res.sendSuccess(null, results);
        });

    });

};
/**
 *
 * @param text
 * @returns {string}
 */
function slugify(text)
{
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
/**
 *
 * @param text
 * @param key
 * @returns {*}
 */
function encrypt(text, key){
    var cipher = crypto.createCipher('aes256', slugify(key));
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}
/**
 *
 * @param text
 * @param key
 * @returns {*}
 */
function decrypt(text, key){
    var decipher = crypto.createDecipher('aes256', slugify(key));
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
}

/**
 *
 * @param req
 * @param res
 */
ApplicationController.post = function (req, res) {

    res.xmlOptions = 'application';

    var orgId = req.params.organizationId;

    var token = utils.uid(256);

    var tokenHash = utils.tokenHash(token);

    var expired = new Date(moment().add(100, 'years').valueOf()); // set 100th from now

    var clientId = orgId + '_' + slugify(req.body.app_name);

    var userId = req.body.user_id;

    var secret = utils.tokenHash(utils.uid(16));

    var clientUrl = req.headers.origin;

    var hackUrl = 'x-cbo-client-url';

    var redirectUri = '';

    if(hackUrl in req.headers){

        clientUrl = req.headers[hackUrl];

    }

    var parse_url = php.parse_url(clientUrl);

    if (parse_url.host) {

        redirectUri = parse_url.host;

    } else {

        redirectUri = parse_url.path;

    }

    var client = new Client({
        id: clientId,
        userId: userId,
        secret: secret,
        redirectUri: redirectUri
    });

    client.save(function (err) {

        if(err){
            return res.sendError(err);
        }

        // Create a new access token
        var tokenModel = new Token({
            token: tokenHash,
            //clientId: req.authInfo.token.clientId,
            clientId: clientId,
            app_name: req.body.app_name,
            userId: userId,
            created_by: req.user.userId,
            expired: expired
        });

        tokenModel.save(function (err) {

            if (err)  {
                return res.sendError(err);
            }

            res.sendSuccess(res.__('data_added'), {
                token: token,
                clientId: tokenModel.clientId,
                secretKey: client.secret,
                redirectUri: client.redirectUri,
                appName: tokenModel.app_name,
                userId: tokenModel.userId,
                dateCreated: tokenModel.created
            });

        });

    })


};
/**
 *
 * @param req
 * @param res
 */
ApplicationController.delete = function (req, res) {

    var applicationId = ObjectId(req.params.applicationId);

    Token.remove({ _id: applicationId }, function (err) {

        if (err)  { return res.sendError(err); }

        res.sendSuccess(res.__('data_deleted'));

    });

};
/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = ApplicationController;