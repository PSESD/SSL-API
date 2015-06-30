'use strict';

process.env.NODE_ENV = 'test';
var expect = require('chai').expect;
var request = require('supertest');
var cheerio = require('cheerio');
var querystring = require('querystring');
var php = require('phpjs');
var _ = require('underscore');
var url = 'http://localhost:3000';

//var url = 'https://auth.cbo.upward.st';
var api_endpoint = 'http://localhost:4000';
var config = require('config');
var dbUri = 'mongodb://' + config.get('db.mongo.host') + '/' + config.get('db.mongo.name');
console.log(dbUri);
var mongoose = require('mongoose')
    , clearDB = require('mocha-mongoose')(dbUri, {noClear: true});

var assert = require('assert');
/**
 *
 * @param post
 */
function http_build_query(post) {
    console.log('%j', php.http_build_query(post));
}
describe('All-Test', function () {

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


    var profileData = {};

    var organizationId = null;

    var orgData = {
        "name": "FC CBO",
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
            },
            {
                "country": "US",
                "zip": "98005",
                "state": "WA",
                "city": "Renton",
                "address_line": "30611 16th Ave S5",
                "venue": "",
                "address_type": "Mailing",
                "location": {
                    "accuracy": "Approximate",
                    "longitude": -0.8049260000000000,
                    "latitude": 0.4436020000000000
                }
            },
            {
                "country": "US",
                "zip": "98006",
                "state": "WA",
                "city": "Seattle",
                "address_line": "30611 16th Ave S6",
                "venue": "",
                "address_type": "Mailing",
                "location": {
                    "accuracy": "Approximate",
                    "longitude": -0.6203090000000000,
                    "latitude": 0.3607280000000000
                }
            }
        ],
        "description": null,
        "website": "fc.org",
        "url": "fc.cbo.upward.st",
        "externalServiceId": 2,
        "personnelId": 3,
        "authorizedEntityId": 1
    };

    var studentData = {
        "first_name": "Abraham",
        "last_name": "Tester",
        "district_student_id": "9999999999",
        "school_district": "highline",
        "programs": [],
        "addresses": []
    };

    var userId, userId2, userId3, userId4, studentId, studentProgramId, studentProgramData = {
        programId: null,
        active: true, // Whether the student is currently active in the program or not.
        participation_start_date: new Date(Date.parse('May 8, 2015')).toString(),
        participation_end_date: new Date(Date.parse('Jul 8, 2015')).toString(),
        cohort: 'Test'
    };

    var newUser = {
        email: 'support@upwardstech.com',
        password: 'demo',
        last_name: 'Upwardstech'
    };

    var newUser2 = {
        email: 'support2@upwardstech.com',
        password: 'demo',
        last_name: 'Upwardstech2'
    };

    var newUser3 = {
        email: 'support3@upwardstech.com',
        password: 'demo',
        last_name: 'Upwardstech3'
    };

    var newUser4 = {
        email: 'support4@upwardstech.com',
        password: 'demo',
        last_name: 'Upwardstech4'
    };


    var email = 'test@test.com', password = 'test';

    before(function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbUri, done);
    });

    before(function (done) {
        clearDB(done);
    });

    //describe('Cleanup', function() {

    //it('clean up all data test', function(done){
    //    request(api_endpoint).get('/users/cleanup')
    //        .send('email=' + newUser.email)
    //        .expect(200)
    //        .expect(function (res) {
    //            console.dir(res.body);
    //        })
    //        .end(done);
    //
    //});

    //});
    describe('Oauth2', function () {
        it('should create a new user', function (done) {
            request(url).post('/api/users')
                .send('email=' + email)
                .send('password=' + password)
                .send('last_name=test')
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
                    client_id: 'client',
                    name: 'client',
                    redirect_uri: '^localhost:4000$'
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {

                    secretCode = res.body.client_secret;

                    assert.equal('client', res.body.client_id);
                    assert.equal('client', res.body.name);
                    assert.equal('^localhost:4000$', res.body.redirect_uri);
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
                    assert.equal('client', o.client_id);
                    assert.equal('client', o.name);
                    assert.equal('^localhost:4000$', o.redirect_uri);
                })
                .end(done);

        });

        it('user should be able get authorised page', function (done) {
            var target = '/api/oauth2/authorize?client_id=client&response_type=code&redirect_uri=' + api_endpoint;
            agent1.get(target)
                .auth(email, password)
                .set('Accept', 'application/json')
                .set('Accept', 'text/html')
                .type('urlencoded')
                .expect(function (res) {
                    var html = cheerio.load(res.text);
                    transactionId = html('input[type="hidden"]').val();
                    assert.ok(transactionId);
                })
                .expect(200)
                .end(done);

        });

        it('user should be able to authorise an access code', function (done) {
            agent1.post('/api/oauth2/authorize')
                .auth(email, password)
                .type('form')
                .send({
                    transaction_id: transactionId
                })
                .expect(302)
                .expect(function (res) {
                    accessCode = res.text.split('code=')[1];
                    assert.ok(accessCode);
                })
                .end(done);

        });

        it('use access code to get a token', function (done) {
            request(url).post('/api/oauth2/token')
                .auth('client', secretCode)
                .expect('Content-Type', /json/).type('form')
                .send({
                    code: accessCode,
                    grant_type: 'authorization_code',
                    redirect_uri: api_endpoint
                })
                .type('urlencoded')
                .expect(200)
                .expect(function (res) {

                    token = res.body.access_token;
                    refreshToken = res.body.refresh_token;
                    tokenType = res.body.token_type;
                    assert.ok(token);
                    assert.ok(refreshToken);
                    assert.ok(tokenType);
                })
                .end(done);

        });


    });

    describe('API-User', function () {


        it('GET /user', function (done) {
            request(api_endpoint)
                .get('/user')
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    assert.equal(email, res.body.email);
                })
                .expect(200)
                .end(done);

        });

        it('DELETE /user', function (done) {
            request(api_endpoint)
                .delete('/user')
                .set('authorization', tokenType + ' ' + token)
                .send({email: newUser.email})
                .expect(function (res) {
                    //assert.equal(res, { success: true });
                })
                .expect(200)
                .end(done);

        });

        it('POST /user 1', function (done) {
            request(api_endpoint)
                .post('/user')
                .set('authorization', tokenType + ' ' + token)
                .send(newUser)
                .expect(function (res) {
                    assert.equal(true, res.body.success);
                    assert.equal(newUser.email, res.body.info.email);
                    assert.equal(newUser.last_name, res.body.info.last_name);
                })
                .expect(200)
                .end(done);

        });

        it('POST /user 2', function (done) {
            request(api_endpoint)
                .post('/user')
                .set('authorization', tokenType + ' ' + token)
                .send(newUser2)
                .expect(function (res) {
                    assert.equal(true, res.body.success);
                    assert.equal(newUser2.email, res.body.info.email);
                    assert.equal(newUser2.last_name, res.body.info.last_name);
                    userId2 = res.body.info._id;
                    assert.ok(userId2);
                })
                .expect(200)
                .end(done);

        });

        it('POST /user 3', function (done) {
            request(api_endpoint)
                .post('/user')
                .set('authorization', tokenType + ' ' + token)
                .send(newUser3)
                .expect(function (res) {
                    assert.equal(true, res.body.success);
                    assert.equal(newUser3.email, res.body.info.email);
                    assert.equal(newUser3.last_name, res.body.info.last_name);
                    userId3 = res.body.info._id;
                    assert.ok(userId3);
                })
                .expect(200)
                .end(done);

        });

        it('POST /user 4', function (done) {
            request(api_endpoint)
                .post('/user')
                .set('authorization', tokenType + ' ' + token)
                .send(newUser4)
                .expect(function (res) {
                    assert.equal(true, res.body.success);
                    assert.equal(newUser4.email, res.body.info.email);
                    assert.equal(newUser4.last_name, res.body.info.last_name);
                    userId4 = res.body.info._id;
                    assert.ok(userId4);
                })
                .expect(200)
                .end(done);

        });

        newUser.first_name = 'CV.';

        it('PUT /user', function (done) {
            request(api_endpoint)
                .put('/user')
                .set('authorization', tokenType + ' ' + token)
                .send(newUser)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(newUser.email, res.body.info.email);
                    assert.equal(newUser.last_name, res.body.info.last_name);
                    assert.equal(newUser.first_name, res.body.info.first_name);
                })
                .expect(200)
                .end(done);

        });
    });

    describe('API-Organizations', function () {

        it('POST /organizations', function (done) {
            http_build_query(orgData);
            request(api_endpoint)
                .post('/organizations')
                .set('authorization', tokenType + ' ' + token)
                .send(orgData)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(orgData.name, res.body.info.name);
                    organizationId = res.body.info._id;
                })
                .expect(200)
                .end(done);

        });

        var permissionsData = {
            organization: organizationId,
            userId: userId,
            students: [],
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
            http_build_query(permissionsData);
            request(api_endpoint)
                .post('/' + organizationId + '/users')
                .set('authorization', tokenType + ' ' + token)
                .send(permissionsData)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    var permit = res.body.info.permissions[0];
                    assert.equal(organizationId, permit.organization);
                    assert.ok(_.isArray(permit.students), 'Student must array');
                    assert.ok(_.isArray(permit.permissions), 'Permission must array');
                    permissionId = permit._id;
                    assert.ok(permissionId);
                })
                .expect(200)
                .end(done);
        });

        var permissions = {};


        /**
         * Test for admin User
         */
        it('POST /:organizationId/users', function (done) {
            [userId2, userId3, userId4].forEach(function (userID) {
                var allow = 'all';
                if (userID == userId3) {
                    allow = 'own';
                }
                if (userID == userId4) {
                    allow = 'none';
                }
                permissions[userID] = {
                    organization: organizationId,
                    userId: userID,
                    students: [],
                    permissions: [{
                        model: 'Student',
                        operation: 'read',
                        allow: allow
                    }, {
                        model: 'Student',
                        operation: 'create',
                        allow: allow
                    }, {
                        model: 'Student',
                        operation: 'update',
                        allow: allow
                    }, {
                        model: 'Student',
                        operation: 'delete',
                        allow: allow
                    }]
                };
                permissions[userID].organization = organizationId;
                permissions[userID].userId = userID;
                permissions[userID].students = [];
                http_build_query(permissions[userID]);
                var req = request(api_endpoint)
                    .post('/' + organizationId + '/users')
                    .set('authorization', tokenType + ' ' + token)
                    .send(permissions[userID])
                    .expect(function (res) {
                        if (!res.body.success) console.log('%j', res.body);
                        assert.equal(true, res.body.success);
                        var permit = res.body.info.permissions[0];
                        assert.equal(organizationId, permit.organization);
                        assert.ok(_.isArray(permit.students), 'Student must array');
                        assert.ok(_.isArray(permit.permissions), 'Permission must array');
                        permissions[userID].id = permit._id;
                        assert.ok(permissions[userID].id);
                    })
                    .expect(200);

                if (userID == userId4) {
                    req.end(done);
                } else {
                    req.end(function(){});
                }
            });
        });

        it('GET /:organizationId/users', function (done) {
            request(api_endpoint)
                .get('/' + organizationId)
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    assert.equal(orgData.name, res.body.name);
                    assert.equal(organizationId, res.body._id);
                })
                .expect(200)
                .end(done);
        });

        it('GET /organizations', function (done) {
            request(api_endpoint)
                .get('/organizations')
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(1, res.body.total);
                    assert.equal(orgData.name, res.body.data[0].name);
                })
                .expect(200)
                .end(done);
        });

        it('GET /:organizationId', function (done) {
            request(api_endpoint)
                .get('/' + organizationId)
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    assert.equal(orgData.name, res.body.name);
                    assert.equal(organizationId, res.body._id);
                })
                .expect(200)
                .end(done);
        });

        it('GET /:organizationId/profile', function (done) {
            request(api_endpoint)
                .get('/' + organizationId + '/profile')
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    profileData = res.body;
                    assert.equal(orgData.name, profileData.name);
                })
                .expect(200)
                .end(done);
        });

        it('PUT /:organizationId/profile', function (done) {
            request(api_endpoint)
                .put('/' + organizationId + '/profile')
                .set('authorization', tokenType + ' ' + token)
                .send({
                    description: 'There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...'
                })
                .expect(function (res) {
                    profileData = res.body.info;
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(orgData.name, profileData.name);
                    assert.equal('There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...', profileData.description);
                })
                .expect(200)
                .end(done);
        });

        var programsName = 'Information Technologies 1';
        var programsName2 = 'Information Technologies 2';
        var programId = '';
        var programId2 = '';


        it('POST /:organizationId/programs 1', function (done) {
            http_build_query({
                name: programsName,
                organizationId: organizationId
            });
            request(api_endpoint)
                .post('/' + organizationId + '/programs')
                .set('authorization', tokenType + ' ' + token)
                .send({
                    name: programsName,
                    organizationId: organizationId
                })
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(programsName, res.body.info.name);
                    assert.equal(organizationId, res.body.info.organization);
                    studentProgramData.programId = programId = res.body.info._id;
                })
                .expect(200)
                .end(done);
        });

        it('POST /:organizationId/programs 2', function (done) {
            request(api_endpoint)
                .post('/' + organizationId + '/programs')
                .set('authorization', tokenType + ' ' + token)
                .send({
                    name: programsName2,
                    organizationId: organizationId
                })
                .expect(function (res) {
                    assert.equal(true, res.body.success);
                    assert.equal(programsName2, res.body.info.name);
                    assert.equal(organizationId, res.body.info.organization);
                    programId2 = res.body.info._id;
                })
                .expect(200)
                .end(done);
        });


        it('PUT /:organizationId/programs/:programId', function (done) {
            request(api_endpoint)
                .put('/' + organizationId + '/programs/' + programId)
                .set('authorization', tokenType + ' ' + token)
                .send({
                    name: 'Information Technologies 1 US'
                })
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal('Information Technologies 1 US', res.body.info.name);
                    assert.equal(organizationId, res.body.info.organization);
                })
                .expect(200)
                .end(done);

        });

        it('POST /:organizationId/students', function (done) {
            console.log(api_endpoint, '/' + organizationId + '/students', ' ', tokenType + ' ' + token);
            http_build_query(studentData);
            request(api_endpoint)
                .post('/' + organizationId + '/students')
                .set('authorization', tokenType + ' ' + token)
                .send(studentData)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(studentData.district_student_id, res.body.info.district_student_id);
                    assert.equal(organizationId, res.body.info.organization);
                    studentId = res.body.info._id;
                })
                .expect(200)
                .end(done);

        });

        it('PUT /:organizationId/students/:studentId', function (done) {
            http_build_query({
                last_name: 'Godong'
            });
            console.log('/' + organizationId + '/students/' + studentId);
            request(api_endpoint)
                .put('/' + organizationId + '/students/' + studentId)
                .set('authorization', tokenType + ' ' + token)
                .send({
                    last_name: 'Godong'
                })
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal('Godong', res.body.info.last_name);
                    assert.equal(organizationId, res.body.info.organization);
                })
                .expect(200)
                .end(done);

        });


        it('GET /:organizationId/students/:studentId/backpack', function (done) {
           console.log(api_endpoint+'/'+organizationId+'/students/'+studentId+'/backpack', ' ', tokenType + ' ' + token);
           request(api_endpoint)
               .get('/'+organizationId+'/students/'+studentId+'/backpack')
               .set('authorization', tokenType + ' ' + token)
               .expect(function (res) {
                   console.log(res.body);
               })
               .expect(200)
               .end(done);
        });

        it('POST /:organizationId/students/:studentId/programs', function (done) {
            http_build_query(studentProgramData);
            request(api_endpoint)
                .post('/' + organizationId + '/students/' + studentId + '/programs')
                .set('authorization', tokenType + ' ' + token)
                .send(studentProgramData)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(studentData.district_student_id, res.body.info.district_student_id);
                    assert.equal(organizationId, res.body.info.organization);
                    studentProgramId = res.body.info.programs[0]._id;
                    assert.ok(studentProgramId);
                })
                .expect(200)
                .end(done);

        });

        it('GET /:organizationId/students/:studentId/programs', function (done) {
            request(api_endpoint)
                .get('/' + organizationId + '/students/' + studentId + '/programs')
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    //console.log('%j', res.body);
                    assert.equal(studentProgramData.cohort, res.body.data[0].cohort);
                    assert.equal(studentProgramId, res.body.data[0]._id);
                })
                .expect(200)
                .end(done);
        });

        it('POST /:organizationId/programs/:programId/students', function (done) {
            studentProgramData.studentId = studentId;
            delete studentProgramData.programId;
            studentProgramData.cohort = 'Test 2';
            http_build_query(studentProgramData);
            request(api_endpoint)
                .post('/' + organizationId + '/programs/' + programId2 + '/students')
                .set('authorization', tokenType + ' ' + token)
                .send(studentProgramData)
                .expect(function (res) {
                    if (!res.body.success) console.log('%j', res.body);
                    assert.equal(true, res.body.success);
                    assert.equal(studentData.district_student_id, res.body.info.district_student_id);
                    assert.equal(organizationId, res.body.info.organization);
                    studentProgramId = res.body.info.programs[0]._id;
                    assert.ok(studentProgramId);
                })
                .expect(200)
                .end(done);
        });

        it('GET /:organizationId/programs/:programId/students', function (done) {
            request(api_endpoint)
                .get('/' + organizationId + '/programs/' + programId2 + '/students')
                .set('authorization', tokenType + ' ' + token)
                .expect(function (res) {
                    res.body.data.forEach(function (data, i) {
                        if (data._id === studentProgramId) {
                            assert.equal(studentProgramData.cohort, data.cohort);
                            assert.equal(studentProgramId, data._id);
                        }
                    });

                })
                .expect(200)
                .end(done);
        });

        /**
         * Delete All Data Test Here
         */
        //it('DELETE /:organizationId/students/:studentId', function (done) {
        //    request(api_endpoint)
        //        .delete('/'+organizationId+'/students/'+studentId)
        //        .set('authorization', tokenType + ' ' + token)
        //        .expect(function (res) {
        //            if(!res.body.success) console.log('%j', res.body);
        //            assert.equal(true, res.body.success);
        //        })
        //        .expect(200)
        //        .end(done);
        //
        //});
        //
        //it('DELETE /:organizationId/programs/:programId', function (done) {
        //    request(api_endpoint)
        //        .delete('/'+organizationId+'/programs/'+programId)
        //        .set('authorization', tokenType + ' ' + token)
        //        .expect(function (res) {
        //            if(!res.body.success) console.log('%j', res.body);
        //            assert.equal(true, res.body.success);
        //        })
        //        .expect(200)
        //        .end(done);
        //
        //});

    });


    after(function (done) {
        done();
    })

});