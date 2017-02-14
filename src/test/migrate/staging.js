/**
 * Created by zaenal on 05/08/15.
 */
'use strict';

process.env.NODE_ENV = 'staging';
var expect = require('chai').expect;
var request = require('supertest');
var cheerio = require('cheerio');
var querystring = require('querystring');
var _ = require('underscore');
var urlLive = 'https://auth.sslstaging.studentsuccesslink.upward.st';
var url = 'http://localhost:3000';
var urlApiLive = 'https://api.sslstaging.studentsuccesslink.upward.st';
var urlApi = 'http://localhost:4000';
var config = require('config');
var dbUri = 'mongodb://' + config.get('db.mongo.host') + '/' + config.get('db.mongo.name');
console.log(dbUri);
var mongoose = require('mongoose'), clearDB = require('mocha-mongoose')(dbUri, {noClear: true});

var assert = require('assert');
/**
 *
 * @param post
 * @param uri
 * @param token
 */
function http_build_query(post, uri, token) {
    console.log(uri + ' ' + token +' %j', _funct.http_build_query(post));
}
describe('Migrate Staging', function () {

    var agent1 = request.agent(url);
    /**
     * Store transaction Id to use in post request
     */
    var transactionId;
    /**
     * Store accessCode to be used to retrive access token
     */
    var accessCode;
    var token;
    var refreshToken;
    var tokenType;
    var secretCode;
    var grantToken;

    var organizationId = null;

    var orgData = {
        "name": "Helping Hand",
        "addresses": [
            {
                "country": "US",
                "zip": "98002",
                "state": "WA",
                "city": "Federal Way",
                "address_line": "30611 16th Ave S2",
                "venue": "",
                "address_type": "Mailing",
                "location": {
                    "accuracy": "Approximate",
                    "longitude": -0.4185710000000000,
                    "latitude": 0.0950210000000000
                }
            }
        ],
        "description": null,
        "website": "sslstaging.studentsuccesslink.upward.st",
        "url": "helpinghand.sslstaging.studentsuccesslink.upward.st",
        "externalServiceId": 5,
        "personnelId": 1,
        "authorizedEntityId": 2
    };

    var userId;

    var newUser = {
        email: 'demo@upwardstech.com',
        password: 'demo',
        last_name: 'Demo',
        first_name: 'User',
        is_super_admin: true
    };


    var email = newUser.email, password = newUser.password;

    before(function (done) {
        if (mongoose.connection.db) {
            return done();
        }
        mongoose.connect(dbUri, done);
    });

    before(function (done) {
        clearDB(done);
    });

    describe('Oauth2', function () {
        it('should create a new user', function (done) {
            request(url).post('/api/users')
                .send('email=' + email)
                .send('password=' + password)
                .send('last_name='+newUser.last_name)
                .send('first_name='+newUser.first_name)
                .send('role=superadmin')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.email, email);
                    userId = res.body.id;
                    assert.ok(userId);
                })
                .end(done);

        });

        it('user should add a new client', function (done) {
            request(url).post('/api/clients')
                .auth(email, password)
                .type('urlencoded')
                .send({
                    client_id: 'sslstaging.studentsuccesslink.upward.st',
                    name: 'sslstaging.studentsuccesslink.upward.st',
                    redirect_uri: '\\*\\.sslstaging\\.studentsuccesslink\\.upward\\.st'
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {

                    secretCode = res.body.client_secret;

                    assert.equal('sslstaging.studentsuccesslink.upward.st', res.body.client_id);
                    assert.equal('sslstaging.studentsuccesslink.upward.st', res.body.name);
                    assert.equal('\\*\\.sslstaging\\.studentsuccesslink\\.upward\\.st', res.body.redirect_uri);
                    assert.ok(secretCode);
                })
                .end(done);

        });

        it('user should be able to list clients', function (done) {
            request(url).get('/api/clients')
                .auth(email, password)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    var o = res.body[0];
                    assert.equal('sslstaging.studentsuccesslink.upward.st', o.client_id);
                    assert.equal('sslstaging.studentsuccesslink.upward.st', o.name);
                    assert.equal('\\*\\.sslstaging\\.studentsuccesslink\\.upward\\.st', o.redirect_uri);
                })
                .end(done);

        });

        it('get a token', function (done) {
            http_build_query({
                username: newUser.email,
                grant_type: 'password',
                password: newUser.password,
                scope: 'offline_access'
            }, url + '/api/oauth2/token');
            request(url).post('/api/oauth2/token')
                .auth('sslstaging.studentsuccesslink.upward.st', secretCode)
                .expect('Content-Type', /json/)
                .type('form')
                .send({
                    username: newUser.email,
                    grant_type: 'password',
                    password: newUser.password,
                    scope: 'offline_access'
                })
                .type('urlencoded')
                .expect(200)
                .expect(function (res) {
                    token = res.body.access_token;
                    refreshToken = res.body.refresh_token;
                    tokenType = res.body.token_type;
                    grantToken = tokenType + ' ' + token;
                    assert.ok(token);
                    assert.ok(refreshToken);
                    assert.ok(tokenType);
                })
                .end(done);

        });
    });

    describe('API-User', function () {

        it('POST /organizations', function (done) {
            http_build_query(orgData, urlApi + '/organizations', grantToken);
            request(urlApi)
                .post('/organizations')
                .set('authorization', grantToken)
                .set('x-cbo-client-url', 'https://helpinghand.sslstaging.studentsuccesslink.upward.st')
                .send(orgData)
                .expect(function (res) {
                    if (!res.body.success) {
                        console.log('%j', res.body);
                    }
                    assert.equal(true, res.body.success);
                    assert.equal(orgData.name, res.body.info.name);
                    organizationId = res.body.info._id;
                })
                .expect(200)
                .end(done);

        });

        it('GET /user', function (done) {
            http_build_query({}, urlApi + '/user', grantToken);
            request(urlApi)
                .get('/user')
                .set('authorization', grantToken)
                .set('x-cbo-client-url', 'https://helpinghand.sslstaging.studentsuccesslink.upward.st')
                .expect(function (res) {
                    console.log(res.body);
                    assert.equal(email, res.body.email);
                })
                .expect(200)
                .end(done);

        });

        it('PUT /user/role/:userId', function (done) {
            http_build_query({ role: 'admin' }, urlApi + '/user/role/'+userId, grantToken);
            request(urlApi)
                .put('/user/role/'+userId)
                .set('authorization', grantToken)
                .set('x-cbo-client-url', 'https://helpinghand.sslstaging.studentsuccesslink.upward.st')
                .send({ role: 'admin' })
                .expect(function (res) {
                    if (!res.body.success) {
                        console.log('%j', res.body);
                    }
                    assert.equal(true, res.body.success);
                })
                .expect(200)
                .end(done);

        });

        var permissionsData = {
            organization: organizationId,
            userId: userId,
            students: [],
            role: "admin",
            permissions: [{
                model: 'Student',
                operation: '*',
                allow: 'all'
            }]
        };
        var permissionId = '';
        /**
         * Test for admin User
         */
        it('POST /:organizationId/users', function (done) {
            permissionsData.organization = organizationId;
            permissionsData.userId = userId;
            http_build_query(permissionsData, urlApi+'/' + organizationId + '/users', grantToken);
            request(urlApi)
                .post('/' + organizationId + '/users')
                .set('authorization', grantToken)
                .send(permissionsData)
                .expect(function (res) {
                    if (!res.body.success) {
                        console.log('%j', res.body);
                    }
                    assert.equal(true, res.body.success);
                    var permit = res.body.info.permissions[0];
                    console.log(permit);
                    assert.equal(organizationId, permit.organization);
                    assert.equal('admin', permit.role);
                    assert.ok(_.isArray(permit.students), 'Student must array');
                    assert.ok(_.isArray(permit.permissions), 'Permission must array');
                    permissionId = permit._id;
                    assert.ok(permissionId);
                })
                .expect(200)
                .end(done);
        });

    });


    after(function (done) {
        done();
    });

});