'use strict';
/**
 * Created by zaenal on 21/05/15.
 */
var Address = require('../app/models/Address');
var Client = require('../app/models/Client');
var Code = require('../app/models/Code');
var Organization = require('../app/models/Organization');
var Permission = require('../app/models/Permission');
var Program = require('../app/models/Program');
var RefreshToken = require('../app/models/RefreshToken');
var Student = require('../app/models/Student');
var StudentProgram = require('../app/models/StudentProgram');
var Token = require('../app/models/Token');
var User = require('../app/models/User');
var UserPermission = require('../app/models/UserPermission');
var secretHash = require('../lib/utils').secretHash;


var fs = require('fs');
var csv = require('fast-csv');
var filecsv = __dirname + '/populate.csv';

var async = require('async');
var _ = require('underscore');

var Request = require('../lib/broker/request');
var parseString = require('xml2js').parseString;


var dummyUser = ['demo@upwardstech.com', 'abraham@upwardstech.com', 'ben@upwardstech.com', 'bintang@upwardstech.com', 'hendra@upwardstech.com', 'zaenal@upwardstech.com'];

var mongoose = mongoose || require('mongoose');
var permissionValue = {operation: '*', allow: true};
var populateCbo = {

    dropCollections: function (callback) {
        var collections = _.keys(mongoose.connection.collections);
        async.forEach(collections, function (collectionName, done) {
            var collection = mongoose.connection.collections[collectionName];
            collection.drop(function (err) {
                if (err && err.message !== 'ns not found') {
                    done(err);
                }
                done(null);
            });
        }, callback);
    },

    city: function (name) {
        var address = {
            address_type: "Mailing",
            venue: "", // Optional venue name at the address, useful for names of buildings. (ex: Smith Hall)
            address_line: "",
            city: "",
            state: "",
            zip: "",
            country: "US", // The country code according to ISO 3166-1 Alpha-2.
            location: {
                latitude: Math.random(),
                longitude: -1 * Math.random(),
                accuracy: "Approximate"//{type: String, enum: ["Rooftop", "Approximate"] }
            } //An object hash representing the geocoded location information for the address.
        };
        switch (name) {
            case 'Aurburn':
                address.city = "Aurburn";
                address.address_line = "30611 16th Ave S1";
                address.state = "WA";
                address.zip = "98001";
                break;

            case 'Federal Way':
                address.city = "Federal Way";
                address.address_line = "30611 16th Ave S2";
                address.state = "WA";
                address.zip = "98002";
                break;

            case 'Highline':
                address.city = "Highline";
                address.address_line = "30611 16th Ave S3";
                address.state = "WA";
                address.zip = "98003";
                break;

            case 'Kent':
                address.city = "Kent";
                address.address_line = "30611 16th Ave S4";
                address.state = "WA";
                address.zip = "98004";
                break;

            case 'Renton':
                address.city = "Renton";
                address.address_line = "30611 16th Ave S5";
                address.state = "WA";
                address.zip = "98005";
                break;

            case 'Seattle':
                address.city = "Seattle";
                address.address_line = "30611 16th Ave S6";
                address.state = "WA";
                address.zip = "98006";
                break;

            case 'Tukwila':
                address.city = "Tukwila";
                address.address_line = "30611 16th Ave S7";
                address.state = "WA";
                address.zip = "98007";
                break;

            default:
                return null;
        }
        return address;
    },

    fakeStudentData: function(){

    },

    run: function () {
        var self = this;
        var config = require('../lib/config').config();

        /**
         *
         * @param organization
         * @param programs
         */
        function addStudents(organization, programs){
            if(organization.name !== 'Helping Hand CBO') {
                return;
            }
            var orgId = organization._id;
            var studentId = '1111111111';
            var zoneId = 'federalway';
            var brokerRequest = new Request();
            brokerRequest.addHeader( 'districtStudentId', studentId );
            var request = brokerRequest.makeRequest('/validation-sre/' + studentId + ';zoneId='+zoneId+';contextId=CBO', 'GET', function (error, response, body) {
                if(response.statusCode === '200'){
                    parseString(body, function (err, result) {
                        var json = result.sre;
                        delete json.$;
                        if(json.programs){
                            _.each(json.programs, function(program){

                            });
                        }
                        var addrs = self.city('Federal Way');
                        var set = {
                            organization: organization._id,
                            first_name: json.firstName[0],
                            last_name: json.lastOrSurname[0],
                            middle_name: json.middleName[0],
                            district_student_id: studentId,
                            addresses: [ addrs ],
                            school_district: zoneId,
                            programs: [ {
                                program: programs._id,
                                active: true, // Whether the student is currently active in the program or not.
                                //participation_start_date: ,
                                //participation_end_date: { type: Date },
                                //cohort: { type: String },
                                //created: { type: Date, required: true, default: Date.now },
                                //creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                //last_updated: { type: Date, required: true, default: Date.now },
                                //last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
                            } ],
                            last_updated_by: organization.userId
                        };
                        Student.findOneAndUpdate({organization: organization._id}, { $set: set }, {safe: true, upsert: true}, function (err, student) {
                            if(err) {
                                return console.dir(err, set);
                            }
                            console.log('Add student success');
                        });
                    });
                }
            });

        }
        var done = function (organization) {
            dummyUser.forEach(function (userEmail) {
                var baseName = userEmail.split('@')[0];
                var newUser = {
                    email: userEmail,
                    first_name: '',
                    middle_name: '',
                    last_name: baseName,
                    password: 'demo'
                };

                var user = new User(newUser);

                user.save(function (err) {
                    if (err){
                        (err.code && err.code === 11000) ? console.log({
                            code: err.code,
                            message: 'User already exists'
                        }) : console.log(err);
                    }

                    if (!user) {
                        return console.log('User not found!');
                    }

                    var client = new Client();
                    client.name = 'App ' + user.email;
                    client.id = user.email;
                    client.userId = user.userId;
                    client.redirectUri = '([\\w.-]+)?cbo\\.upward\\.st';
                    client.save(function (err) {
                        if (err){
                            return (err.code && err.code === 11000) ? console.log({
                                code: err.code,
                                message: 'Client already exists'
                            }) : console.log(err);
                        }
                        Client.findByIdAndUpdate(client._id, {$set: {secret: secretHash('' + client._id)}}, function (err, newClient) {
                            if (err){
                                return (err.code && err.code === 11000) ? console.log({
                                    code: err.code,
                                    message: 'Client already exists'
                                }) : console.log(err);
                            }
                            // console.log({code: 0, message: 'Client added to the locker!', data: newClient});
                        });

                    });
                });
            });
            self.fakeStudentData();
        };
        self.dropCollections(function () {
            var stream = fs.createReadStream(filecsv);
            var psl = require('psl');
            Permission.create(permissionValue, function (err, permission) {
                var csvStream = csv
                    .fromStream(stream, {ignoreEmpty: true})
                    .on("data", function (row) {
                        if (row[0] === 'CBO') {
                            return;
                        }
                        var rs = {
                            organization: row[0],
                            website: row[1],
                            services: row[2],
                            grade: row[3],
                            aurburn: row[4] === 'x' ? 'Aurburn' : null,
                            federal_way: row[5] === 'x' ? 'Federal Way' : null,
                            highline: row[6] === 'x' ? 'Highline' : null,
                            kent: row[7] === 'x' ? 'Kent' : null,
                            renton: row[8] === 'x' ? 'Renton' : null,
                            seattle: row[9] === 'x' ? 'Seattle' : null,
                            tukwila: row[10] === 'x' ? 'Tukwila' : null,
                            platforms: row[11],
                            contact: row[12],
                            email: row[13],
                            confirmed: row[14],
                            notes: row[15]
                        };

                        var parsed = psl.parse(rs.website);
                        rs.url = parsed.sld;
                        rs.username = rs.url;

                        if (!rs.url || !rs.email) {
                            return;
                        }
                        var createOrg = function (err, user, permission) {
                            if (err) {
                                return console.log('Error: ' + err);
                            }
                            if (!user) {
                                return console.log('User empty');
                            }
                            var newOrg = {
                                name: rs.organization,
                                url: rs.url + '.' + config.get('HOST'),
                                website: rs.website,
                                description: rs.notes,
                                addresses: []
                            };
                            var addrs = null;
                            var addresses = [];
                            if (rs.aurburn && (addrs = self.city(rs.aurburn))) {
                                addresses.push(addrs);
                            }
                            if (rs.federal_way && (addrs = self.city(rs.federal_way))) {
                                addresses.push(addrs);
                            }
                            if (rs.kent && (addrs = self.city(rs.kent))) {
                                addresses.push(addrs);
                            }
                            if (rs.renton && (addrs = self.city(rs.renton))) {
                                addresses.push(addrs);
                            }
                            if (rs.seattle && (addrs = self.city(rs.seattle))) {
                                addresses.push(addrs);
                            }
                            if (rs.tukwila && (addrs = self.city(rs.tukwila))) {
                                addresses.push(addrs);
                            }

                            /**
                             * Start insert new record
                             */
                            newOrg.addresses = addresses;
                            Organization.findOneAndUpdate({name: newOrg.name}, {$set: newOrg}, {
                                safe: true,
                                upsert: true,
                                new: true
                            }, function (err, org) {
                                if (err) {
                                    return console.log(err);
                                }
                                if (org) {

                                    var userPermission = {
                                        organization: org._id,
                                        permissions: [ { model: 'Student', operation: '*', allow: 'all'} ],
                                        students: []
                                    };
                                    if (err) {
                                        return console.log(err);
                                    }
                                    var newProgram = {
                                        name: org.name
                                    };

                                    Program.findOneAndUpdate({name: newOrg.name}, {$set: newProgram}, {
                                        safe: true,
                                        upsert: true,
                                        new: true
                                    }, function (err, program) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                        if (userPermission) {
                                            addStudents(org, newProgram);
                                            User.findOneAndUpdate({email: user.email}, { $push: { permissions: userPermission }}, {safe: true, upsert: true}, function (err, usr) {
                                               if (err) {
                                                   return console.log(err);
                                               }
                                               done(org);
                                            });
                                        }
                                    });
                                }
                            });
                        };

                        var name = rs.contact.split(" ");

                        var newUser = {
                            email: rs.email,
                            first_name: '',
                            middle_name: '',
                            last_name: '',
                            password: 'demo',
                            username: rs.username
                        };

                        if (name.length > 2) {
                            newUser.first_name = name[0];
                            newUser.middle_name = name[1];
                            var lastNames = [];
                            for (var n = 2; n < name.length; n++) {
                                lastNames.push(name[n]);
                            }
                            newUser.last_name = lastNames.join(" ");
                        } else {
                            newUser.first_name = name[0];
                            newUser.last_name = name[1];
                        }

                        //User.findOneAndUpdate({email: rs.email}, { $set: newUser }, { upsert: true, new: true },  function (err, user) {
                        //    if (err) return console.log(err);
                        //    //if(user) return console.log('User was empty => ', user, ' => ', newUser);
                        //    createOrg(err, user, permission);
                        //});
                        var user = new User(newUser);
                        user.save(function (err) {
                            if (err) {
                                 console.log((err.code && err.code === 11000) ? {
                                     code: err.code,
                                     message: 'User already exists'
                                 } : err );

                            } else {
                                console.log({code: 0, message: 'New users added!'});
                            }
                            createOrg(false, user, permission);
                        });
                    })
                    .on("end", function () {
                        //console.log("ENDING");
                    });

                stream.pipe(csvStream);
            });
        });
    }
};

module.exports = populateCbo;