'use strict';
/**
 * Created by zaenal on 03/06/15.
 */
var mongoose = require('mongoose');
var Student = require('../models/Student');
var Program = require('../models/Program');
var User = require('../models/User');
var Organization = require('../models/Organization');
var BaseController = require('./BaseController');
var _ = require('underscore');
var __ = require('lodash');
var Request = require('../../lib/broker/request');
var utils = require('../../lib/utils'), cache = utils.cache(), log = utils.log, md5 = utils.md5, benchmark = utils.benchmark();
var ObjectId = mongoose.Types.ObjectId;
var StudentController = new BaseController(Student).crud();
var hal = require('hal');
var xSre = require('../../lib/xsre');
var async = require('async');
var prefixListStudent = 'student_summary_';
var crypto = require('crypto');
var algorithm = 'aes-256-ctr',
    password = 'ssl-encrypted-827192';
var rootPath = __dirname + '/../../';
var appPath = rootPath + 'app';
var cacheService = require(appPath+'/services/cacheService');


/**
 * Get all details for a student.
 * @param req
 * @param res
 * @returns {*}
 */
StudentController.getStudentsBackpack = function(req, res){

    if('raw' in req.query && (parseInt(req.query.raw) > 0 || req.query.raw === 'true')) {
        res.header('Content-Type', 'text/xml');
        res.xmlOptions = res.xmlKey = 'CBOStudentDetail';
        res.bigXml = true;
        return res.sendSuccess(null, results.raw);
    }

    getStudentXsre(req, res).then(function(xsre){
        var resource = new hal.Resource(xsre, req.originalUrl);
        embedProgramsAndUsers(req, resource)
        .then(function(results){

            delete results.facets;
            delete results.config;
            delete results.justlog;
            delete results.params;
            delete results.separate;

            results.attendance = {
                calendars: results.attendance.calendars,
                list_years: results.attendance.list_years,
                list_weeks: results.attendance.list_weeks
            }

            return res.sendSuccess(null, results);  

        }, function(err){
            return res.sendError(err);
        });
    }, function (err){
        return res.sendStatus(404);
    });
};

/*
*
* Preserving deprecated functionality of previous version of getStudentsBackpack.
* Use the new getStudentsBackpack if possible.
*
*/
StudentController.getPortionOfStudentData = function(req, res) {

    var portionToRetrieve = req.params.separate;

    if('raw' in req.query && (parseInt(req.query.raw) > 0 || req.query.raw === 'true')) {
        res.header('Content-Type', 'text/xml');
        res.xmlOptions = res.xmlKey = 'CBOStudentDetail';
        res.bigXml = true;
        return res.sendSuccess(null, results.raw);
    }
    
    getStudentXsre(req, res).then(function(xsre) {
        switch (portionToRetrieve) {
            case "assessment": 
                var assessment = createPaginatedResource(xsre.assessment, req.originalUrl);
                return res.sendSuccess(null, assessment);
            case "attendance": 
                var attendance = createPaginatedResource(xsre.attendance, req.originalUrl);
                return res.sendSuccess(null, attendance);
                break;    
            case "transcript":
                var resource = createPaginatedResource(xsre.transcript, req.originalUrl);
                return res.sendSuccess(null, resource);
                break;
            case "report":
                formatReport(req, req.params.studentId).then(function(result){
                    return res.sendSuccess(null, createPaginatedResource(result, req.originalUrl))
                }, function (err){
                    return res.sendError(err);
                });
                break;
            case "general":
            case "xsre":
                var resource = new hal.Resource(xsre, req.originalUrl);
                embedProgramsAndUsers(req, resource)
                .then(function(results){
                    return res.sendSuccess(null, xsre);
                }, function(err){
                    return res.sendError(err);
                });
                break;
            default:
               return res.sendError("How did you get here? This should be unreachable.");
        }
    }, function(err) {
        return res.sendError(err);
    });
};
/**
 *
 * @param req
 * @param res
 */
StudentController.deleteCacheStudentsBackpack = function(req, res){

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var separate = req.query.separate || 'xsre';

    if(!separate){

        separate = 'xsre';

    }

    Student.protect(req.user.role, { students: studentId, value: studentId }, req.user).findOne({
        _id: studentId,
        organization: orgId
    }, function(err, student){

        if(err){
            return res.sendError(err);
        }
        /**
         * If student is empty from database
         */
        if(!student){
            return res.sendError('The student not found in database');
        }

        var key = md5([orgId.toString(), studentId.toString(), student.district_student_id, student.school_district, req.params.format, separate].join('_'));

        Organization.findOne({ _id: orgId }, function(err, organization){

            if(err){
                return res.sendError(err);
            }
            /**
             * If organization is empty from database
             */
            if(!organization){
                return res.sendError('The organization not found in database');
            }
            var key2 = key + '_attendance';
            cache.del(key2, function(err){

            });
            var key3 = key + '_transcript';
            cache.del(key3, function(err){

            });
            var key4 = key + '_assessment';
            cache.del(key4, function(err){

            });
            var key5 = key + '_report';
            cache.del(key5, function(err){

            });
            cache.del(key, function(err){

                if(err){

                    log(err, 'error');

                    return res.sendError('Delete cache error');

                }

                key = md5(['_xSre_', orgId.toString(), student._id.toString(), student.district_student_id, student.school_district].join('_'));

                cache.del(key, function(){

                    if(separate === 'xsre'){

                        key = new Request().clearCacheXsreKey(student.district_student_id, student.school_district, organization);

                        cache.del(key, function(){

                            res.sendSuccess('Delete cache successfully');

                        });

                    } else{

                        res.sendSuccess('Delete cache successfully');

                    }

                });

            });
        });

    });
};
/**
 *
 * @param brokerRequest
 * @param student
 * @param orgId
 * @param callback
 */
StudentController.getStudentDetail = function(brokerRequest, student, orgId, callback){

    var key = cacheService.getKeyForJsonXsre(student);

    cache.get(key, function(err, result){

        if(err){
            return callback(null, student, false);
        }

        if(!result){

            brokerRequest.getXsre(student.district_student_id, student.school_district, orgId.toString(), function(error, response, body){

                if(error){
                    return callback(null, student, false);
                }

                if(!body){

                    return callback(null, student, false);

                }

                if(response && response.statusCode === 200){

                    utils.xml2js(body, function(err, result){

                        if(err){
                            return callback(null, student, false);
                        }

                        var object = new xSre(student, result).getStudentSummary();

                        var newObject = student.toObject();

                        newObject.xsre = object;

                        /**
                         * Set to cache
                         */
                        cache.set(key, newObject, { ttl: 86400 }, function(){

                            callback(null, newObject, false);

                        });

                    });

                }
            });

        } else{


            callback(null, result, true);

        }

    });
};
/**
 *
 * @param brokerRequest
 * @param student
 * @param orgId
 * @param callback
 */
StudentController.refreshStudentSummary = function(brokerRequest, student, orgId, callback){

    brokerRequest.getXsre(student.district_student_id, student.school_district, orgId.toString(), function(error, response, body){

        if(error){
            return callback(error);
        }

        if(!body){
            return callback('Empty response');
        }

        if (response.body.startsWith("<error")) {
            cacheService.writeInvalidStudentToCache(student, orgId)
            .then(function(record){
                return callback(record);
            }, function(err){
                return callback(err);
            });
        }

        if(response && response.statusCode === 200){
            cacheService.writeStudentSummaryFromXmlToCache(body, orgId, student._id.toString())
            .then(function(updatedSummary) {
                callback(updatedSummary)
            });
        } else{
            callback();
        }

    });

};
/**
 * Get all student in organization
 * @param req
 * @param res
 */
StudentController.getStudents = function(req, res){

    res.xmlKey = 'students';

    var orgId = ObjectId(req.params.organizationId);

    /**
     * Finding summary
     */
    if(req.query.summary){

        cache.get(cacheService.getKeyForOrganizationSummary(orgId), function(err, results){

            if(err){
                return res.sendError(err);
            }

            if(!_.isArray(results)){

                results = [];

            }

            return res.sendSuccess(null, results);

        });
        return;
    }

    var crit = Student.crit(req.query, ['organization']);

    var withNoXsre = parseInt(req.query.noxsre) > 0;

    var withNoProgram = parseInt(req.query.noprogram) > 0;

    var userId = 'userId' in req.query ? req.query.userId : null;

    crit.organization = orgId;

    var filter = null;

    if(req.query.assign){

        filter = {

            onlyAssign: true

        };

    }

    var sorter = function(st){
        return st ? [st.first_name, st.last_name]: [];
    };


    Organization.findOne({ _id: orgId }, function(err, organization){

        if(err){
            return res.sendError(err);
        }
        /**
         * If organization is empty from database
         */
        if(!organization){
            return res.sendError('The organization not found in database');
        }

        Student.protect(req.user.role, filter, req.user).find(crit, function(err, students){

            if(err){
                return res.sendError(err);
            }

            if(userId !== null){
                User.findOne({
                    _id: ObjectId(userId),
                    permissions: {$elemMatch: {organization: ObjectId(req.params.organizationId)}}
                }, function (err, user) {
                    var stdlist = [];
                    if(!err && user){
                        user.getCurrentPermission(req.params.organizationId);
                        var obj = user.toJSON();
                        stdlist = _.map(obj.allStudentsByOrganization, function(v, k){
                            return v + '';
                        });

                    }

                    return res.sendSuccess(null, _.sortBy(_.map(students, function(val, key){
                        var o = typeof val.toObject === "function" ? val.toObject() : val;
                        delete o.programs;
                        delete o.__v;
                        o.added = stdlist.indexOf(o._id + '') !== -1;
                        return o;
                    }), sorter));
                });
                return;
            }

            if(withNoProgram){
                return res.sendSuccess(null, _.sortBy(_.map(students, function(val, key){
                    var o = val.toObject();
                    delete o.programs;
                    delete o.__v;
                    return o;
                }), sorter));
            }

            if(withNoXsre){

                return res.sendSuccess(null, _.sortBy(students, sorter));
            }

            //attempt to retrieve student summaries from redis cache
            var key = cacheService.getKeyForOrganizationSummary(orgId);

            async.map(students, function(student, callback){

                var newObject = student.toObject();

                newObject.xsre = {
                    "gradeLevel": /*"N/A"*/"",
                    "schoolYear": /*"N/A"*/"",
                    "schoolName": /*"N/A"*/"",
                    "attendanceCount": [],
                    "behaviorCount": [],
                    "riskFlag": [],
                    "onTrackToGraduate": /*"N/A"*/"",
                    "latestDate": ""
                };

                var realKey = cacheService.getKeyForStudentSummary(student.get("_id"), orgId);

                cache.get(realKey, function(err, studentFromCache){
                    if(err){
                        return callback(null, newObject);
                    }

                    if (_.isUndefined(studentFromCache)){
                        //the student is in the mongoDB but not the Redis Cache; request the xSre from HostedZone and update the cache.
                        var brokerRequest = new Request({
                            externalServiceId: organization.externalServiceId,
                            personnelId: organization.personnelId,
                            authorizedEntityId: organization.authorizedEntityId
                        });

                        StudentController.refreshStudentSummary(brokerRequest, newObject, req.params.organizationId, function(refreshedStudent) {
                            if(!_.isUndefined(refreshedStudent) && !refreshedStudent.isUnavailable){
                                newObject.xsre = refreshedStudent;
                                //these students probably don't have names in the DB; if so we need to update them from the xsre data
                                if (!newObject.first_name && refreshedStudent.firstName || 
                                    !newObject.last_name && refreshedStudent.lastName) {
                                        newObject.first_name = newObject.first_name || refreshedStudent.firstName;
                                        newObject.last_name = newObject.last_name || refreshedStudent.lastName; 
                                        Student.findOneAndUpdate({_id: newObject._id}, newObject, {upsert: true}, function(err, results){
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                }
                                return callback(null, newObject);
                            }
                        });
                    } else if (studentFromCache.isUnavailable) {
                        return callback(null, undefined);
                    } else {
                        newObject.xsre = studentFromCache;
                        callback(null, newObject);
                    } 
                });
            }, function(err, results){
                res.sendSuccess(null, _.sortBy(_.omit(results, _.isUndefined), sorter));
            });
        });
    });
};
/**
 *
 * @param req
 * @param res
 */
StudentController.getStudentNotAssigns = function(req, res){

    var orgId = ObjectId(req.params.organizationId);

    var where = { permissions: { $elemMatch: { organization: orgId } } };

    if(req.body.userId){

        where._id = ObjectId(req.body.userId);

    }

    var query = User.find(where);

    var crit = Student.crit(req.query, ['organization', '_id']);

    crit.organization = orgId;

    query.exec(function(err, users){

        var students = [];

        var showEmpty = true;

        users.forEach(function(user){

            user.permissions.forEach(function(permission){

                if(permission.organization.toString() === orgId.toString()){

                    //if (permission.role === 'case-worker-restricted') {

                    showEmpty = false;

                    permission.students.forEach(function(student){

                        if(students.indexOf(student) === -1){
                            students.push(student);
                        }

                    });

                    //}

                }

            });

        });

        if(showEmpty === true){

            return res.sendSuccess(null, []);

        }

        if(students.length > 0){
            crit._id = { $nin: students };
        }

        Student.find(crit, function(err, students){

            if(err){
                return res.sendError(err);
            }

            res.sendSuccess(null, students);

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.createByOrgId = function(req, res){

    res.xmlKey = 'student';

    var orgId = ObjectId(req.params.organizationId);

    Organization.findOne({ _id: orgId }, function(err, organization){

        if(err){
            return res.sendError(err);
        }
        /**
         * If organization is empty from database
         */
        if(!organization){
            return res.sendError(res.__('data_not_found'));
        }

        var brokerRequest = new Request({
            externalServiceId: organization.externalServiceId,
            personnelId: organization.personnelId,
            authorizedEntityId: organization.authorizedEntityId
        });

        var obj = new Student(req.body);

        obj.organization = orgId;

        // set update time and update by user
        obj.created = new Date();

        obj.creator = req.user.userId;

        obj.last_updated = new Date();

        obj.last_updated_by = req.user.userId;

        User.findOne({ _id: req.user._id }, function(err, user){

            if(err){
                return res.sendError(err);
            }

            if(!user){
                return res.sendError(res.__('user_failed_to_update'));
            }

            obj.protect(req.user.role, null, req.user).save(function(err){

                if(err){

                    if(err.code && (err.code === 11000 || err.code === 11001)){

                        err = res.__('errors.duplicate_student', { districtId: (''+req.body.district_student_id).toUpperCase(), district: (''+req.body.school_district).toUpperCase() });

                    }

                    return res.sendError(err);
                }

                _.each(user.permissions, function(permission, key){

                    if(permission.organization.toString() === obj.organization.toString() && permission.students.indexOf(obj._id) === -1){

                        user.permissions[key].students.push(obj._id);

                    }

                });

                user.save(function(err){

                    if(err){
                        return res.sendError(err);
                    }

                    StudentController.refreshStudentSummary(brokerRequest, obj, orgId.toString(), function(updatedSummary){

                        res.sendSuccess(res.__('data_added'), updatedSummary);

                    });


                });

            });

        });

    });

};
/**
 * Get student organization by id
 * @param req
 * @param res
 */
StudentController.getStudentById = function(req, res){

    res.xmlOptions = 'student';

    var orgId = ObjectId(req.params.organizationId);

    var studentId = ObjectId(req.params.studentId);

    var crit = Student.crit(req.query, ['_id', 'organization']);

    var withXsre = parseInt(req.query.xsre) > 0;

    console.log('with XSRE: ', withXsre);

    crit.organization = orgId;

    crit._id = studentId;

    Organization.findOne({ _id: orgId }, function(err, organization){

        if(err){
            return res.sendError(err);
        }
        /**
         * If organization is empty from database
         */
        if(!organization){
            return res.sendError(res.__('record_not_found', 'Organization'));
        }

        var brokerRequest = new Request({
            externalServiceId: organization.externalServiceId,
            personnelId: organization.personnelId,
            authorizedEntityId: organization.authorizedEntityId
        });

        Student.protect(req.user.role, { students: studentId, value: studentId }, req.user).findOne(crit, function(err, student){

            if(err){
                return res.sendError(err);
            }
            /**
             * If student is empty from database
             */
            if(!student){
                return res.sendError(res.__('record_not_found', 'Student'));
            }

            if(withXsre){

                StudentController.getStudentDetail(brokerRequest, student, orgId, function(err, student, isCache){

                    res.header('X-Cached-Sre', isCache ? 1 : 0);

                    res.sendSuccess(student);

                });

            } else{

                res.sendSuccess(student);

            }

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.deleteStudentById = function(req, res){

    var orgId = req.params.organizationId;

    var studentId = ObjectId(req.params.studentId);

    Student.protect(req.user.role, { students: studentId }, req.user).remove({
        organization: ObjectId(orgId),
        _id: ObjectId(req.params.studentId)
    }, function(err){

        if(err){
            return res.sendError(err);
        }

        User.findOne({ _id: req.user._id }, function(err, user){

            if(err){
                return res.sendError(err);
            }

            if(!user){
                return res.sendError(res.__('data_updated_failed'));
            }

            _.each(user.permissions, function(permission, key){

                var indexOf = permission.students.indexOf(ObjectId(req.params.studentId));

                if(permission.organization.toString() === orgId && indexOf !== -1){

                    delete user.permissions[key].students[indexOf];

                }

            });

            user.save(function(err){

                if(err){
                    return res.sendError(err);
                }

                var key = cacheService.getKeyForStudentSummary(req.params.studentId, orgId);

                cache.get(key, function(err, xsre){

                    if(err || !xsre){

                        return res.sendSuccess(res.__('data_deleted'));

                    }

                    if(studentId.toString() in xsre){

                        delete xsre[studentId.toString()];
                        /**
                         * Restore cache again
                         */
                        cache.set(key, xsre, { ttl: 86400 }, function(){

                            res.sendSuccess(res.__('data_deleted'));

                        });

                    } else{

                        res.sendSuccess(res.__('data_deleted'));

                    }

                });


            });

        });

    });

};
/**
 *
 * @param req
 * @param res
 */
StudentController.putStudentById = function(req, res){

    res.xmlOptions = 'student';

    var studentId = ObjectId(req.params.studentId);

    var orgId = ObjectId(req.params.organizationId);

    Organization.findOne({ _id: orgId }, function(err, organization){

        if(err){
            return res.sendError(err);
        }
        /**
         * If organization is empty from database
         */
        if(!organization){
            return res.sendError(res.__('record_not_found', 'Organization'));
        }

        var brokerRequest = new Request({
            externalServiceId: organization.externalServiceId,
            personnelId: organization.personnelId,
            authorizedEntityId: organization.authorizedEntityId
        });

        Student.protect(req.user.role, { students: studentId }, req.user).findOne({
            _id: studentId,
            organization: orgId
        }, function(err, obj){

            if(err){
                return res.sendError(err);
            }

            if(!obj){
                return res.sendError(res.__('data_not_found'));
            }

            for(var prop in req.body){

                if(prop in obj){

                    obj[prop] = req.body[prop];

                }

            }

            if (!obj.creator || obj.creator == "") {
                obj.creator = req.user.userId;
            }

            // set update time and update by user
            obj.last_updated = new Date();

            obj.last_updated_by = req.user.userId;

            obj.protect(req.user.role, null, req.user).save(function(err){

                if(err){

                    if(err.code && (err.code === 11000 || err.code === 11001)){

                        err = res.__('errors.duplicate_student', { districtId: (''+req.body.district_student_id).toUpperCase(), district: (''+req.body.school_district).toUpperCase() });

                    }

                    return res.sendError(err);

                }

                StudentController.refreshStudentSummary(brokerRequest, obj, orgId.toString(), function(updatedSummary){

                    res.sendSuccess(res.__('data_updated'), updatedSummary);

                });

            });

        });
    });

};


function getStudentXsre(req, res) {
    return new Promise(function(resolve, reject){

        var orgId = ObjectId(req.params.organizationId);
        var studentId = ObjectId(req.params.studentId);

        //get the student from the database
        Student.protect(req.user.role, { students: studentId, value: studentId }, req.user).findOne({
                _id: studentId,
                organization: orgId
            }, function(err, student){
                if(err || !student){
                    reject(err || "student not found");
                } else {

                    //get the organization
                    Organization.findOne({ _id: orgId }, function(err, organization){

                        if(err){
                            reject(err);
                        }

                        if(!organization){
                            reject('The organization not found in database');
                        }

                        var brokerRequest = new Request({
                            externalServiceId: organization.externalServiceId,
                            personnelId: organization.personnelId,
                            authorizedEntityId: organization.authorizedEntityId
                        });

                        //look for the xsre in cache
                        var key = cacheService.getKeyForJsonXsre(student);
                        console.log("looking for key " + key);
                        cacheService.get(key)
                        .then(function(result) {
                            //request from hostedzone and save to cache if not found
                            if(!result){
                                benchmark.info("requesting from HostedZone...");
                                brokerRequest.getXsre(student.district_student_id, student.school_district, orgId.toString(), function(error, response, body){
                                    if(error){
                                        reject(error);
                                    }

                                    if(!body){
                                        res.statusCode = response.statusCode || 404;
                                        reject('Xsre could not be found');
                                    }
                                    if (response.body.startsWith("<error")) {
                                        benchmark.info("not found: " + student.district_student_id);
                                        cacheService.writeInvalidStudentToCache(student, orgId)
                                        .then(function(record){
                                            return callback(record);
                                        }, function(err){
                                            return callback(err);
                                        });
                                    }

                                    if(response && response.statusCode === 200){
                                        cacheService.writeStudentToCache(student, body, orgId.toString())
                                        .then(function(studentXsre){
                                            resolve(studentXsre);
                                        }, 
                                        function(err){
                                            reject(err);
                                        });
                                    } 
                                    else {
                                    reject("Something went wrong");
                                    }
                                });
                            
                            
                            //return record from cache if found
                            } else {
                            benchmark.info("retrieving from cache...");
                                resolve(result);
                            }
                        }, function(err){
                            reject(err);
                        });
                    });
                }
        });
    });
}

function createPaginatedResource(resource, url, pageSize) {
     var paginate = {
        total: resource.length,
        pageSize: pageSize || 10,
        pageCount: 0,
        currentPage: 1,
        data: [],
        source: resource
    };

    var arrayList = [];

     if (resource.details) {
        paginate.source = _.clone(resource);
        resource = resource.details;
    }

    for (var i = 0; i < resource.length + pageSize; i +=pageSize) {
        arrayList.push(resource.slice(i, i + pageSize));
    }                  

    paginate.data = arrayList[+paginate.currentPage - 1];

    if (!paginate.data) {
        paginate.data = resource;
    }

    paginate.pageCount = Math.ceil(paginate.total / paginate.pageSize);

   

    var result = new hal.Resource(paginate, url);

    if(paginate.currentPage + 1 <= paginate.pageCount){
        var nextUrl = req.originalUrl;
        if(nextUrl.indexOf('?') === -1){
            nextUrl += '?';
        } else{
            nextUrl += '&';
        }
        result.link(new hal.Link('nextUrl', nextUrl + 'page=' + (+paginate.currentPage + 1)));
    }

    return result.toJSON();
}

function embedProgramsAndUsers(req, resource) {
    return new Promise(function(resolve, reject){
        var studentId = req.params.studentId;
        var orgId = req.params.organizationId;
        var options = {
            permissions: {
                $elemMatch: {
                    organization: ObjectId(orgId),
                    students: ObjectId(studentId)
                }
            }
        };

        Student.protect(req.user.role, { students: ObjectId(studentId), value: ObjectId(studentId) }, req.user)
        .findOne({_id: studentId, organization: orgId}, function(err, student){
            if (err || !student) {
                reject(err || "student not found");
            }
            User.find(options, function(err, users){
                if(err){
                    reject(err);
                }
                if(!users){
                    users = [];
                }

                var embedsUsers = [];
                var embedsPrograms = [];
                
                _.each(users, function(user){
                    var fullname = [];
                    if(user.first_name){
                        fullname.push(user.first_name);
                    }
                    if(user.middle_name){
                        fullname.push(user.middle_name);
                    }
                    if(user.last_name){
                        fullname.push(user.last_name);
                    }

                    embedsUsers.push(new hal.Resource({
                        id: user._id.toString(),
                        email: user.email,
                        fullname: fullname.join(' ')
                    }, '/' + orgId + '/users/' + user._id));
                });

                var programsId = {};
                var programId = [];

                _.each(student.programs, function(program){
                    if(Object.keys(programsId).indexOf(program.program.toString()) === -1){
                        programsId[program.program.toString()] = [];
                    }
                    
                    programsId[program.program.toString()].push(program.toObject());
                    programId.push(program.program);
                });

                if(!_.isEmpty(programsId)){
                    benchmark.info('XSRE - EMBED PROGRAM');
                    Program.find({ _id: { $in: programId } }).sort({ participation_end_date: -1}).exec(function(err, programs){
                        if(err){
                            reject(err);
                        }

                        _.each(programs, function(program){
                            if(program._id.toString() in programsId){
                                programsId[program._id.toString()].forEach(function(prgm){
                                    prgm.program_name = program.name;
                                    embedsPrograms.push(new hal.Resource(prgm));
                                });
                            }
                        });

                        resource.embed('users', embedsUsers);
                        resource.embed('programs', embedsPrograms);
                        resolve(resource.toJSON());
                    });
                } else{
                    resource.embed('users', embedsUsers);
                    resource.embed('programs', embedsPrograms);
                    resolve(resource.toJSON());
                }
            });
        });
    });
}

function formatReport(req, studentId) {
    return new Promise(function(resolve, reject){
        Student.protect(req.user.role, { students: studentId, value: studentId }, req.user)
        .findOne({_id: studentId, organization: orgId}, function(err, student){
            if (err | !student) {
                reject(err || "student not found");
            }
            var programsId = {};
            var programId = [];

            _.each(student.programs, function(program){
                if(Object.keys(programsId).indexOf(program.program.toString()) === -1){
                    programsId[program.program.toString()] = [];
                }

                programsId[program.program.toString()].push(program.toObject());
                programId.push(program.program);
            });
            
            if(programId.length > 0){
                var options = { _id: { $in: programId } };
                if(req.query.from && req.query.to){
                    reportCrit.participation_start_date = { $gte : new Date(req.query.from )};
                    reportCrit.participation_end_date = { $lte : new Date(req.query.to )};
                }

                Program.find(options).sort({ participation_end_date: -1 }).exec(function(err, programs){
                    if(err){
                        reject(err);
                    }

                    _.each(programs, function(program){
                        if(program._id.toString() in programsId){
                            programsId[program._id.toString()].forEach(function(prgm){
                                results.programs.push({
                                    name: program.name,
                                    from: prgm.participation_start_date,
                                    to: prgm.participation_end_date
                                });
                            });
                        }
                    });

                    resolve(new hal.Resource(results, req.originalUrl).toJSON());
                });

            } else{
                resolve(new hal.Resource(results, req.originalUrl).toJSON());
            }
        });
    });
}

/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = StudentController;
