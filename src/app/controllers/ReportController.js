/**
 * Created by zaenal on 19/01/16.
 */
'use strict';
/**
 * Created by zaenal on 21/05/15.
 */
var con = require('../../lib/cli/mysql');
var _ = require('underscore');
var ReportController = {};
/**
 * Get the list of all organizations that this user have access to in our system.
 * @param req
 * @param res
 * @returns {*}
 */
ReportController.getStudentBy = function (req, res) {
    var by = req.params.by;
    var orgId = req.params.organizationId;
    con.connect(function(err){
        if(err){
            return res.sendError(err);
        }
        var sql = '';
        switch(by){
            case 'school_district':
                sql = 'SELECT school as schoolName, school_district as schoolDistrict, COUNT(student_id) as total ';
                sql += 'FROM students WHERE id = ? GROUP BY schoolName,  schoolDistrict';
                console.log(con.format(sql,[ orgId ]));
                con.query(sql,[ orgId ], function(err, results){
                    if(err){
                        return res.sendError(err);
                    }
                    res.sendSuccess(results);
                });
                break;
            case 'grade':
                sql = 'SELECT grade_year as gradeYear, COUNT(student_id) as total ';
                sql += 'FROM students WHERE id = ? GROUP BY gradeYear';
                console.log(con.format(sql,[ orgId ]));
                con.query(sql,[ orgId ], function(err, results){
                    if(err){
                        return res.sendError(err);
                    }
                    res.sendSuccess(results);
                });
                break;
            case 'gender':
                sql = 'SELECT gender, COUNT(student_id) as total ';
                sql += 'FROM students WHERE id = ? GROUP BY gender';
                console.log(con.format(sql,[ orgId ]));
                con.query(sql,[ orgId ], function(err, results){
                    if(err){
                        return res.sendError(err);
                    }
                    res.sendSuccess(results);
                });
                break;
            case 'race':
                sql = 'SELECT ethnicity, COUNT(student_id) as total ';
                sql += 'FROM students WHERE id = ? GROUP BY ethnicity';
                console.log(con.format(sql,[ orgId ]));
                con.query(sql,[ orgId ], function(err, results){
                    if(err){
                        return res.sendError(err);
                    }
                    res.sendSuccess(results);
                });
                break;
            default:
                res.sendError('Request not valid!');
                break;
        }
    });

};

/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = ReportController;