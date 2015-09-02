/**
 * Created by zaenal on 03/06/15.
 */
'use strict';
var config = require('config');
var request = require('request');
var qs = require('querystring');
var moment = require('moment');
var uuid = require('node-uuid');
var CryptoJS = require("crypto-js");
/**
 *
 * @param options
 * @param env
 * @constructor
 */
function Request(options, env) {

    if(!config.has('hzb')){

        throw new Error("config HZ not found!");

    }

    this.options = options || {};

    this.config = config.get('hzb');

    this.env = env || 'dev';

    this.headers = {};

}

Request.prototype = {

    constructor: Request,

    /**
     *
     * @param params
     */
    setQueryParameter: function (params) {

        this.queryParameter = params;

    },

    /**
     *
     * @param param
     * @param val
     */
    addQueryParameter: function (param, val) {

        this.queryParameter[param] = val;

    },

    /**
     *
     * @returns {{contextId: string}|*}
     */
    getQueryParameter: function () {

        return this.queryParameter;

    },

    /**
     *
     * @param headers
     */
    setHeaders: function (headers) {

        this.headers = headers;

    },

    /**
     *
     * @param key
     * @param val
     */
    addHeader: function (key, val) {

        this.headers[key] = val;

    },
    /**
     *
     * @returns {{}|*}
     */
    getHeaders: function () {

        return this.headers;

    },

    /**
     *
     * @param what
     * @param url
     * @param method
     * @param callback
     * @returns {*}
     */
    create: function (what, url, method, callback) {

        var config = this.config[what];

        if('Authorization' in this.headers){

            //skip

        } else {

            var timestamp = this.headers.timestamp = this.getTimezone();

            var token = '';

            switch ( what ){

                case 'sre':

                    token = this.generateSREAuthToken(timestamp);
                    break;

                case 'xsre':

                    token = this.generateXSREAuthToken(timestamp);
                    break;

                case 'prs':

                    token = this.generatePRSAuthToken(timestamp);
                    break;

                default:

                    throw new Error('Unable to generate token');

            }
            this.headers.Authorization = 'SIF_HMACSHA256 ' + token;
        }

        var self = this;

        if('headers' in config) {

            for (var name in config.headers) {

                self.addHeader(name, config.headers[name]);

            }
        }

        var options = {
            url: config.url + url,
            method: method || 'GET',
            headers: this.getHeaders(),
            qsParseOptions: { sep: ';'},
            strictSSL: false
        };

        console.dir(options);

        return request.get(options, callback || function (error, response, body) {

            if(error){

                console.log('error: ', error);

            } else {

                if (response && response.statusCode == 201) {

                    console.log(body)

                } else {

                    console.log('RESPONSE: ', response);

                    console.log(body);

                }

            }

        });

    },

    /**
     *
     * @param districtStudentId
     * @param zoneId
     * @param callback
     * @returns {*|request}
     */
    createSre: function(districtStudentId, zoneId, callback){

        if(this.options.personnelId) {

            this.headers.personnelId = this.options.personnelId;

        }

        if(this.options.authorizedEntityId) {

            this.headers.authorizedEntityId = this.options.authorizedEntityId;

        }

        if(this.options.externalServiceId) {

            this.headers.externalServiceId = this.options.externalServiceId;

        }

        if(!districtStudentId){

            if(!callback) return;

            return callback('District student id was not set', null, null);

        }

        var config = this.config.sre;

        var url = '/requestProvider/' + config.service +'/'+districtStudentId+';zoneId='+zoneId+';contextId='+ config.contextId;

        this.addHeader( 'districtStudentId', districtStudentId );

        this.addHeader('messageId', this.generateUUID());

        return this.create('sre', url, 'GET', callback);

    },
    /**
     *
     * @param districtStudentId
     * @param zoneId
     * @param callback
     * @returns {*|request}
     */
    createXsre: function(districtStudentId, zoneId, callback){

        if(this.options.personnelId) {

            this.headers.personnelId = this.options.personnelId;

        }

        if(this.options.authorizedEntityId) {

            this.headers.authorizedEntityId = this.options.authorizedEntityId;

        }

        if(this.options.externalServiceId) {

            this.headers.externalServiceId = this.options.externalServiceId;

        }

        if(!districtStudentId){

            if(!callback) return;

            return callback('District student id was not set', null, null);

        }

        var config = this.config.xsre;

        var url = '/requestProvider/' + config.service +'/'+districtStudentId+';zoneId='+zoneId+';contextId='+ config.contextId;

        this.addHeader( 'districtStudentId', districtStudentId );

        this.addHeader('messageId', this.generateUUID());

        return this.create('xsre', url, 'GET', callback);

    },

    /**
     *
     * @param uri
     * @param callback
     * @returns {*|request}
     */
    createPsr: function(uri, callback){

        var url = '/' + uri;

        return this.create('prs', url, 'GET', callback);

    },

    /**
     *
     * @returns {*|ServerResponse}
     */
    getTimezone: function(){

        return moment().utc().format("YYYY-MM-DDThh:mm:ss.SSSZZ");

    },

    /**
     *
     * @returns {*}
     */
    generateUUID: function(){

        return uuid.v1();

    },

    /**
     *
     * @param timestamp
     * @param sessionToken
     * @param secret
     * @returns {*|string}
     * @private
     */
    _generateAuthToken: function(timestamp, sessionToken, secret){

        var valToHash = sessionToken + ":" + timestamp;

        var hash = CryptoJS.HmacSHA256(valToHash, secret).toString(CryptoJS.enc.Base64);

        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(sessionToken + ":" + hash));

    },

    /**
     *
     * @param timestamp
     * @returns {*|string}
     */
    generateSREAuthToken: function(timestamp){

        var sessionToken = this.config.sre.sessionToken;

        var secret = this.config.sre.sharedSecret;

        return this._generateAuthToken(timestamp, sessionToken, secret);

    },

    /**
     *
     * @param timestamp
     * @returns {*|string}
     */
    generateXSREAuthToken: function(timestamp){

        var sessionToken = this.config.xsre.sessionToken;

        var secret = this.config.xsre.sharedSecret;

        return this._generateAuthToken(timestamp, sessionToken, secret);

    },

    /**
     *
     * @param timestamp
     * @returns {*|string}
     */
    generatePRSAuthToken: function(timestamp){

        var sessionToken = this.config.prs.sessionToken;

        var secret = this.config.prs.sharedSecret;

        return this._generateAuthToken(timestamp, sessionToken, secret);

    }

};

/**
 *
 * @type {Request}
 */
module.exports = Request;
