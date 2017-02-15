'use strict';

process.env.NODE_ENV = 'test';
var expect = require( 'chai' ).expect;
var request = require( 'supertest' );
var cheerio = require( 'cheerio' );
var User = require( '../app/models/User' );
var url = 'http://localhost:3000';
//var url = 'https://auth.cbo.upward.st';
var api_endpoint = 'http://localhost:4000';
var config = require("../lib/config").config();
var dbUri = 'mongodb://'+config.get('DB_HOST')+'/'+config.get('DB_NAME');
console.log(dbUri);
var mongoose = require( 'mongoose' );

describe( 'OAuth2', function () {

    var agent1 = request.agent( url );
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

    var email = 'support@upwardstech.com', password = 'test';

    before( function (done) {
        if (mongoose.connection.db) {
            return done();
        }
        mongoose.connect( dbUri, done );

    } );

    it( 'add and remove user permission', function (done) {

        var userPermission = {
            organization: mongoose.Types.ObjectId('556d00e517aac10c2bbcaa8d'),
            permission: [],
            student: []
        };
        var userPermission2 = {
            organization: mongoose.Types.ObjectId('556d00e517aac10c2bbcaa8e'),
            permission: [],
            student: []
        };

        var user = new User({ email: 'support@upwardstech.com'});
        user.deletePermission([ userPermission.organization, userPermission2.organization ], console.log);

        done();
    } );



    after( function (done) {
        done();
    } );

} );