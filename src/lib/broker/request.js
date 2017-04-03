'use strict';
/**
 * Created by zaenal on 03/06/15.
 */
//var request = require('request');
var retryRequest = require('retry-request');
var moment = require('moment');
var uuid = require('node-uuid');
var CryptoJS = require("crypto-js");
var utils = require('../utils');
var config = require('../config').config();
var hzb = config.get("hzb");
var cache = cache = utils.cache();
var log = utils.log;
var md5 = utils.md5;
var benchmark  = utils.benchmark();
var rootPath = __dirname + '/../../';
var appPath = rootPath + 'app';
var cacheService = require(appPath+'/services/cacheService');

/**
 *
 * @param options
 * @param env
 * @constructor
 */
function RequestXSRE(options, env) {

    if(!config.has('hzb')){

        throw new Error("config HZ not found!");

    }
    this.hzb = hzb;

    this.options = options || {};

    this.env = env || 'dev';

    this.headers = {};

}

RequestXSRE.prototype = {

    constructor: RequestXSRE,

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
    makeRequest: function (what, url, method, callback) {

        var domain = ""

        if(!('Authorization' in this.headers)){

            var timestamp = this.headers.timestamp = this.getTimezone();

            var token = '';

            switch ( what ){

                case 'sre':

                    token = this.generateSREAuthToken(timestamp);
                    domain = config.get("SRE_URL");
                    break;

                case 'xsre':

                    token = this.generateXSREAuthToken(timestamp);
                    domain = config.get("XSRE_URL");
                    break;

                case 'prs':

                    token = this.generatePRSAuthToken(timestamp);
                    domain = config.get("PRS_URL");
                    break;

                default:

                    throw new Error('Unable to generate token');

            }

            this.headers.Authorization = 'SIF_HMACSHA256 ' + token;
            
        }

        if (!domain) {
            switch (what) {
                case 'sre': 
                domain = config.get("SRE_URL");
                break;
                case 'xsre':
                domain = config.get("XSRE_URL");
                break;
                case 'prs':
                domain = config.get("PRS_URL");
                break;
            }
        }
        var record = this.hzb[what];

        var self = this;

        if('headers' in record) {

            for (var name in record.headers) {

                if(name !== undefined) {
                    self.addHeader(name, record.headers[name]);
                }

            }
        }

        var options = {
            url: domain + url,
            method: method || 'GET',
            headers: this.getHeaders(),
            qsParseOptions: { sep: ';'},
            strictSSL: false,
            timeout: 60000 // timeout 1 minute
        };

        var opts = {
            retries: 3,
            /**
             *
             * @param incomingHttpMessage
             * @returns {boolean}
             */
            shouldRetryFn: function (incomingHttpMessage) {
                return incomingHttpMessage.statusCode !== 200;
            }
        };


        //return request.get(options, callback || function (error, response, body) {
        return retryRequest(options, opts, callback || function (error, response, body) {
            console.log("retry request callback: ", options.url, options.headers, response.statusCode);
            if(error){

                console.log('error: ', error);

            } else {

                if (response && response.statusCode === 201) {

                    console.log(body);

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

            if(!callback) {
                return;
            }

            return callback('District student id was not set', null, null);

        }

        var sre = this.hzb.sre;

        var url = '/requestProvider/' + sre.service +'/'+districtStudentId+';zoneId='+zoneId+';contextId='+ sre.contextId;

        this.addHeader( 'districtStudentId', districtStudentId );

        this.addHeader('messageId', this.generateUUID());

        return this.makeRequest('sre', url, 'GET', callback);

    },
    /*
     *
     * Retrieves xsre as xml.
     * From cache, or from hostedZone if not in cache.
     * 
     */
    getXsre: function(districtStudentId, zoneId, organizationId, callback, forceStore, ignoreCache){
        this.headers = {};

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

            if(!callback) {
                return;
            }

            return callback('District student id was not set', null, null);

        }

        var xsre = this.hzb.xsre;

        var url = '/requestProvider/' + xsre.service +'/'+districtStudentId+';zoneId='+zoneId+';contextId='+ xsre.contextId;

        this.addHeader( 'districtStudentId', districtStudentId );

        this.addHeader('messageId', this.generateUUID());

        this.addHeader('generatorId', 'srx-services-ssl');

        var key = cacheService.getKeyForJsonXsre({
            district_student_id: districtStudentId, 
            organization: organizationId
            });

        if(typeof callback !== 'function'){

            callback = function(error, response, body){
              console.log('ERROR: ', error);
              console.log('RESPONSE: ', response);
              console.log('BODY: ', body);
            };

        }

        var me = this;

        if (districtStudentId != this.headers['districtStudentId']) {
            url = '/requestProvider/' + xsre.service +'/'+this.headers['districtStudentId'] +';zoneId='+zoneId+';contextId='+ xsre.contextId;
        }
        benchmark.info('START ' + districtStudentId);

        if (ignoreCache) {
            benchmark.info("retrieving from hostedzone: " + url);
            //this is what makes the actual http request
                me.makeRequest('xsre', url, 'GET', function (error, response, body) {
                   return callback(error, response, body);
                });
        }

        else {

            console.log("checking cache for key: " + key);

            cacheService.get(key)
            .then(function(result){
                var xmlBody = result;

                if (!cacheService.isValid(result)) { 
                    benchmark.info("retrieving from hostedzone: " + url);

                    //this is what makes the actual http request
                    me.makeRequest('xsre', url, 'GET', function (error, response, body) {
                        callback(error, response, body);
                    });

                } else {
                    callback(null, result, result);
                }
                
            }, function (err) {

            });
        }

    },
    /**
     *
     * @param districtStudentId
     * @param zoneId
     * @param organization
     * @returns {*}
     */
    clearCacheXsreKey: function(districtStudentId, zoneId, organization){

        var xsre = this.hzb.xsre;

        var url = '/requestProvider/' + xsre.service +'/'+districtStudentId+';zoneId='+zoneId+';contextId='+ xsre.contextId;

        return md5([url, organization.personnelId, organization.authorizedEntityId, organization.externalServiceId].join('_'));

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

        return moment().utc().format("YYYY-MM-DDThh:mm:ss.SSSSSS");
        // return moment().utc().toISOString();

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

        var sessionToken = config.get('SRE_SESSION_TOKEN');

        var secret = config.get('SRE_SHARED_SECRET');

        return this._generateAuthToken(timestamp, sessionToken, secret);

    },

    /**
     *
     * @param timestamp
     * @returns {*|string}
     */
    generateXSREAuthToken: function(timestamp){

        var sessionToken = config.get('XSRE_SESSION_TOKEN');

        var secret = config.get('XSRE_SHARED_SECRET');

        return this._generateAuthToken(timestamp, sessionToken, secret);

    },

    /**
     *
     * @param timestamp
     * @returns {*|string}
     */
    generatePRSAuthToken: function(timestamp){

        var sessionToken = config.get('PRS_SESSION_TOKEN');

        var secret = config.get('_PRS_SHARED_SECRET');

        return this._generateAuthToken(timestamp, sessionToken, secret);

    }

};

/**
 *
 * @type {Request}
 */
module.exports = RequestXSRE;
