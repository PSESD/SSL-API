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
       * @param data
       * @param callback
       * @param zoneId
       * @returns {*}
       */
      push: function(data, callback, zoneId){

            var config = this.config.CBOStudent.push;

            var self = this;

            zoneId = zoneId || config.zoneId;

            var url = '/requestProvider/' + config.service +';zoneId='+zoneId+';contextId='+ config.contextId;

            this.addHeader('messageId', this.generateUUID());

            this.addHeader('Content-Length', Buffer.byteLength(data));

            var timestamp = this.headers.timestamp = this.getTimezone();

            var token = this.generateXSREAuthToken(timestamp);

            this.headers.Authorization = 'SIF_HMACSHA256 ' + token;

            if('headers' in config) {

                  for (var name in config.headers) {

                        self.addHeader(name, config.headers[name]);

                  }
            }

            var options = {
                  url: config.url + url,
                  headers: this.getHeaders(),
                  strictSSL: false,
                  timeout: 60000 // timeout 1 minute
            };

            options.body = data;

            console.log(options);

            request({
                  method: 'PUT',
                  preambleCRLF: true,
                  postambleCRLF: true,
                  uri: options.url,
                  headers: options.headers,
                  // alternatively pass an object containing additional options
                  multipart: {
                        chunked: false,
                        data: [
                              {
                                    'content-type': 'application/xml',
                                    body: data
                              }
                        ]
                  }
            },
            function(error, response, body){
                  if(error){
                        return console.error('upload failed:', error);
                  }
                  console.log('Upload successful!  Server responded with:', body);
                  callback();
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
