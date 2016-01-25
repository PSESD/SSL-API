/**
 * Created by zaenal on 13/11/15.
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
function Request(options, env){

    if(!config.has('hzb')){

        throw new Error("config HZ not found!");

    }

    this.options = options || {};

    this.config = config.get('hzb');

    this.env = env || 'dev';

    this.headers = {};

    this.lastPage = 0;

    this.body = [];

}

Request.prototype = {

    constructor: Request,

    /**
     *
     * @param params
     */
    setQueryParameter: function(params){

        this.queryParameter = params;

    },

    /**
     *
     * @param param
     * @param val
     */
    addQueryParameter: function(param, val){

        this.queryParameter[param] = val;

    },

    /**
     *
     * @returns {{contextId: string}|*}
     */
    getQueryParameter: function(){

        return this.queryParameter;

    },

    /**
     *
     * @param headers
     */
    setHeaders: function(headers){

        this.headers = headers;

    },

    /**
     *
     * @param key
     * @param val
     */
    addHeader: function(key, val){

        this.headers[key] = val;

    },
    /**
     *
     * @returns {{}|*}
     */
    getHeaders: function(){

        return this.headers;

    },
    /**
     *
     * @param data
     * @param callback
     * @param zoneId
     * @returns {*}
     */
    push: function(data, callback, zoneId){

        var config = this.config.CBOStudent.push;

        var self = this;

        zoneId = zoneId || config.zoneId;

        var url = '/requestProvider/' + config.service1 + ';zoneId=' + zoneId + ';contextId=' + config.contextId;

        if('headers' in config){

            for(var name in config.headers){

                self.addHeader(name, config.headers[name]);

            }
        }

        self.addHeader('queueId', uuid.v4());
        self.addHeader('requestId', uuid.v1());

        self.create(config.url + url, 'POST', data, callback);
    },
    /**
     *
     * @returns {Request}
     */
    clearParam: function(){
      this.body = [];
      this.lastPage = 0;
      return this;
    },
    /**
     *
     * @param callback
     * @param serviceNumber
     * @param where
     * @param zoneId
     */
    get: function(callback, serviceNumber, where, zoneId){

        var config = this.config.CBOStudent.get;

        var serviceName = serviceNumber === 1 ? config.service1 : config.service2;

        var self = this;

        zoneId = zoneId || config.zoneId;

        var url = '/requestProvider/' + serviceName + ';zoneId=' + zoneId + ';contextId=' + config.contextId;

        if(where){
            url += '?where='+where;
        }

        this.headers.navigationpage = self.lastPage;
        this.headers.navigationpagesize = 500;


        if('headers' in config){

            for(var name in config.headers){

                self.addHeader(name, config.headers[name]);

            }
        }
        self.create(config.url + url, 'GET', null, callback);
        //self.create(config.url + url, 'GET', null, function(error, response, body){
        //
        //    if(!error && !('navigationlastpage' in response.headers)){
        //        self.lastPage++;
        //        self.body.push(body);
        //        self.get(callback, serviceNumber, where, zoneId);
        //    } else {
        //        self.body.push(body);
        //        callback(error, response, self.body.join(''));
        //    }
        //});

    },
    /**
     *
     * @param url
     * @param method
     * @param data
     * @param callback
     */
    create: function(url, method, data, callback){

        this.addHeader('messageId', this.generateUUID());

        var timestamp = this.headers.timestamp = this.getTimezone();

        var token = this.generateXSREAuthToken(timestamp);

        this.headers.Authorization = 'SIF_HMACSHA256 ' + token;

        var options = {
            method: method || 'GET',
            preambleCRLF: true,
            postambleCRLF: true,
            uri: url,
            headers: this.getHeaders()
        };

        console.log(options);


        if(data){
            options.multipart = {
                chunked: true,
                    data: [
                    {
                        'content-type': 'text/xml',
                        body: data
                    }
                ]
            };
        }


        request(options,
            function(error, response, body){
                console.log(response.headers);
                if(error){
                    callback(error, response, body);
                    return console.error('upload failed:', error);
                }
                //console.log('Upload successful!  Server responded with:', body);
                callback(error, response, body);
            });
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
