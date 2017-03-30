'use strict';

/*
*
* Created by Kristy Overton on 3/27/17.
*
*/

//includes
var rootPath = __dirname + '/../../';
var appPath = rootPath + 'app';
var libPath = rootPath + 'lib';
var utils = require(libPath+'/utils');
var cache = utils.cache();
var benchmark = utils.benchmark();
var xSre = require(libPath+'/xsre');
var moment = require('moment');
var md5 = utils.md5;

//class variables
var latestDateAvailable = {};
var prefixListStudent = 'student_summary_';
var prefixListStudentDate = 'organization_last_updated_';
var redisOptions = {ttl: 86400};


var cacheService = {
    get: function(key) {
        return new Promise(function(resolve, reject){
            cache.get(key, function(err, result){
                if (err) {
                    reject(err);
                } else {
                    resolve (result);
                }
            })
        })
    },
    getKeyForJsonXsre: function(student) {
        return md5([student.district_student_id, student.organization].join('_'));
    },
    getKeyForOrganizationSummary: function(orgIdString) {
        return prefixListStudentDate+orgIdString;
    },
    getKeyForStudentSummary: function(studentId, orgIdString) {
        return prefixListStudent + orgIdString + '_' + studentId;
    },
    getKeyForXmlXrse: function(student) {
        return self.getKeyForJsonXsre(student) + "_raw";
    },
    isValid: function(record) {
        return record && record.body && !record.body.startsWith("<error") && record.body != {};
    },
    setLatestDateAvailable : function(orgIdString, schoolDistrict) {
        if(!(orgIdString in latestDateAvailable)){
                    latestDateAvailable[orgIdString] = {};
                }

                if(Object.keys(latestDateAvailable[orgIdString]).indexOf(schoolDistrict) === -1){
                    latestDateAvailable[orgIdString][schoolDistrict] = 0;
                }
    },
    writeInvalidStudentToCache: function(student, orgIdString) {
        return new Promise(function(resolve, reject){

            var record = {
                isUnavailable: true
            }

            var key = self.getKeyForStudentSummary(student._id, orgIdString);
            console.log(key);
            self.writeXsreJsonToCache(key, record)
            .then(function(){
                resolve(record);
            }, function(err){
                reject(err);
            });
        });
    },
    writeOrganizationTimestampToCache : function(err, organization) {
        return new Promise(function (resolve, reject) {  
            var orgIdString = organization._id.toString();  
            if(err){
                benchmark.info('ERROR: ', err);
                reject(err);
            }

            var latestDateMap = [];

            for(var district in latestDateAvailable[orgIdString]) {
                var mm = moment(latestDateAvailable[orgIdString][district]);
                latestDateMap.push({
                    schoolDistrict: district,
                    latestDateTime: latestDateAvailable[orgIdString][district] || "",
                    latestDate: mm.isValid() ? mm : ""
                }); 
            }
            cache.set(self.getKeyForOrganizationSummary(orgIdString), latestDateMap, redisOptions, function () {
                benchmark.info('Cache student summary date from org: ', orgIdString);
                resolve(organization);
            });
        });
    },
    //this is not currently being used, but I am not positive the API has no use for it, so I'm leaving it in. - KO 3/29/17
    writeRawXmlToCache: function(key, xml) {
        return new Promise(function(resolve, reject) {
            benchmark.info("writing xml to cache: ", key);
            cache.set(key, xml, redisOptions, function(error){
                if (error) {
                    reject(error);
                } else {
                    resolve(xml);
                }
            });
        });
    },
    writeStudentSummaryFromJsToCache: function(studentXsre, studentId, schoolDistrict, orgIdString) {
        return new Promise(function(resolve, reject) {
            var studentSummary = studentXsre.getStudentSummary();

                if (studentSummary.latestDateTime && latestDateAvailable[orgIdString] && latestDateAvailable[orgIdString][schoolDistrict] ) {
                    if (latestDateAvailable[orgIdString][schoolDistrict] < studentSummary.latestDateTime) {
                        latestDateAvailable[orgIdString][schoolDistrict] = studentSummary.latestDateTime;
                    }
                }
                
                var key = self.getKeyForStudentSummary(studentId, orgIdString);
                benchmark.info("writing student summary to cache: ", key);

                cache.set(key, studentSummary, redisOptions, function () {
                    resolve(studentSummary);
                });
        });
    },
    writeStudentSummaryFromXmlToCache: function(studentXsre, organizationId, studentId) {
        return new Promise (function (resolve, reject){
            var key = self.getKeyForStudentSummary(studentId, organizationId);

            utils.xml2js(studentXsre, function(err, result){

                if(err){
                    reject(err);
                }

                var updatedStudentSummary = new xSre(studentXsre, result).getStudentSummary();            

                cache.set(key, updatedStudentSummary, redisOptions, function(err){
                    if (err) {
                        reject (err);
                    }else {
                        resolve(updatedStudentSummary);
                    }
                });

            });
        });
    },
    writeStudentToCache: function(student, body, orgIdString) {
        return new Promise(function(resolve, reject) {
            utils.xml2js(body, function (err, result) {

                if (err || (result && 'rror' in result)) {
                    benchmark.info(err);
                    log(err, 'error');
                    reject(err || result.error.message || result.error || result.Error.message || result.Error);
                }

                var studentXsre = new xSre(student, result);

                var key = self.getKeyForJsonXsre(student);
                self.writeStudentSummaryFromJsToCache(studentXsre, student._id, student.school_district, orgIdString)
                .then(function(studentSummary) {
                    self.writeXsreJsonToCache(key, studentXsre)
                }).then(function() {
                    resolve(studentXsre)
                },
                function(err) {
                    reject (err);
                });
            });
        });
    },
    writeXsreJsonToCache: function(key, xsre) {
        return new Promise(function(resolve, reject) {
            benchmark.info("writing full xsre json to cache: " + key);
            cache.set(key, xsre, redisOptions, function(err){
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}



var self = module.exports = cacheService;