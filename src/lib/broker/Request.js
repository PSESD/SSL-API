/**
 * Created by zaenal on 03/06/15.
 */
'use strict';
var config = require('config');
var request = require('request');
var qs = require('querystring');

function Request(env) {
    this.env = env || 'dev';
    this.headers = {};
    this.headers.serviceType = 'OBJECT';
    this.headers.requestType = 'IMMEDIATE';
    this.headers.timestamp = new Date().toDateString();
    this.headers.messageId = '89253c5c-dcd2-4460-a44b-64556a30c320';
    this.headers.externalServiceId = 1;
    this.headers.Accept = 'application/xml';
    this.headers.personnelId = 1;
    this.headers.districtStudentId = null;
    this.headers.authorizedEntityId = 'QUERY';
    this.headers.requestAction = 'QUERY';
    this.headers.messageType = 'REQUEST';
    this.headers.Authorization = 'SIF_HMACSHA256 YmU4NjBjNDctNmJkNS00OTUzLWFhYzAtY2Q4ZjFlYTZiYzM3OjdhWUpMczdYQ2Y3cXZKWGsxWHlqaEN6TnpZV2lmU3NLNWF0NFBrWXVyN3M9';
    this.headers.objectType = 'sre';
    this.queryParameter = { contextId: 'CBO' };
    this.url = 'http://p2cbo-dev-testsre.azurewebsites.net/api/v1';
    this.loadConfig();
}

Request.prototype = {
    constructor: Request,
    /**
     * Load config
     */
    loadConfig: function () {

    },

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

    setHeaders: function (headers) {
        this.headers = headers;
    },
    addHeader: function (key, val) {
        this.headers[key] = val;
    },
    getHeaders: function () {
        return this.headers;
    },
    /**
     *
     * @param url
     * @param method
     * @param callback
     * @returns request
     */
    create: function (url, method, callback) {
        var options = {
            url: url,
            baseUrl: this.url,
            method: method || 'GET',
            headers: this.getHeaders(),
            qsParseOptions: { sep: ';'}
        };
        return request.get(options, callback || function (error, response, body) {

            if(response.statusCode == 201){
                console.log(body)
            } else {
                console.log('error: '+ response.statusCode);
                console.log(body)
            }
        });
    }
};


module.exports = Request;
