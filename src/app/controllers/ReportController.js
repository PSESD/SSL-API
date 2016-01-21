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
    var filters = {
        program: req.query.program,
        district: req.query.district,
        cohort: req.query.cohort,
        caseload: req.query.caseload
    };
    var sql = '';
    var params = [ orgId ];

    switch(by){
        case 'school_district':
            sql = 'SELECT s.school as schoolName, s.school_district as schoolDistrict, COUNT(s.student_id) as total ';
            sql += 'FROM students s ';
            sql += 'LEFT JOIN student_programs sp ON s.student_id = sp.student_id ';
            sql += 'WHERE s.id = ? ';
            if(filters.program){
                sql += ' AND sp.program_name = ?';
                params.push(filters.program);
            }
            if(filters.district){
                sql += ' AND s.school_district = ?';
                params.push(filters.district);
            }
            if(filters.cohort){
                sql += ' AND FIND_IN_SET(?, sp.cohorts)';
                params.push(filters.cohort);
            }
            if(filters.caseload){
                //sql += ' AND sp.caseload = ?';
                //params.push(filters.caseload);
            }
            sql += 'GROUP BY schoolName, schoolDistrict';
            console.log(con.format(sql,params));
            con.query(sql,params, function(err, results){
                if(err){
                    return res.sendError(err);
                }
                res.sendSuccess(results);
            });
            break;
        case 'grade':
            sql = 'SELECT s.grade_year as gradeYear, COUNT(s.student_id) as total ';
            sql += 'FROM students s ';
            sql += 'LEFT JOIN student_programs sp ON s.student_id = sp.student_id ';
            sql += 'WHERE s.id = ? ';
            if(filters.program){
                sql += ' AND sp.program_name = ?';
                params.push(filters.program);
            }
            if(filters.district){
                sql += ' AND s.school_district = ?';
                params.push(filters.district);
            }
            if(filters.cohort){
                sql += ' AND FIND_IN_SET(?, sp.cohorts)';
                params.push(filters.cohort);
            }
            if(filters.caseload){
                //sql += ' AND sp.caseload = ?';
                //params.push(filters.caseload);
            }
            sql += 'GROUP BY gradeYear';
            console.log(con.format(sql,params));
            con.query(sql,params, function(err, results){
                if(err){
                    return res.sendError(err);
                }
                res.sendSuccess(results);
            });
            break;
        case 'gender':
            sql = 'SELECT s.gender, COUNT(s.student_id) as total ';
            sql += 'FROM students s ';
            sql += 'LEFT JOIN student_programs sp ON s.student_id = sp.student_id ';
            sql += 'WHERE s.id = ? ';
            if(filters.program){
                sql += ' AND sp.program_name = ?';
                params.push(filters.program);
            }
            if(filters.district){
                sql += ' AND s.school_district = ?';
                params.push(filters.district);
            }
            if(filters.cohort){
                sql += ' AND FIND_IN_SET(?, sp.cohorts)';
                params.push(filters.cohort);
            }
            if(filters.caseload){
                //sql += ' AND sp.caseload = ?';
                //params.push(filters.caseload);
            }
            sql += 'GROUP BY gender';
            console.log(con.format(sql,params));
            con.query(sql,params, function(err, results){
                if(err){
                    return res.sendError(err);
                }
                res.sendSuccess(results);
            });
            break;
        case 'race':
            sql = 'SELECT s.ethnicity, COUNT(s.student_id) as total ';
            sql += 'FROM students s ';
            sql += 'LEFT JOIN student_programs sp ON s.student_id = sp.student_id ';
            sql += 'WHERE s.id = ? ';
            if(filters.program){
                sql += ' AND sp.program_name = ?';
                params.push(filters.program);
            }
            if(filters.district){
                sql += ' AND s.school_district = ?';
                params.push(filters.district);
            }
            if(filters.cohort){
                sql += ' AND FIND_IN_SET(?, sp.cohorts)';
                params.push(filters.cohort);
            }
            if(filters.caseload){
                //sql += ' AND sp.caseload = ?';
                //params.push(filters.caseload);
            }
            sql += 'GROUP BY ethnicity';
            console.log(con.format(sql,params));
            con.query(sql,params, function(err, results){
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

};

ReportController.getFilters = function(req, res){
    var orgId = req.params.organizationId;
    var sql = 'SELECT * ';
    sql += 'FROM students s ';
    sql += 'LEFT JOIN student_programs sp ON s.student_id = sp.student_id ';
    sql += 'WHERE s.id = ? ';
    con.query(sql, [ orgId ], function(err, rows){

        var rowsets = {
          programs: [],
          districts: [],
          cohorts: [],
          caseload: []
        };

        if(err){
            return res.sendError(err);
        }

        rows.forEach(function(row){
            if(row.program_name && rowsets.programs.indexOf(row.program_name) === -1){
                rowsets.programs.push(row.program_name);
            }
            if(row.cohorts){
                row.cohorts.split(',').forEach(function(cohort){
                    rowsets.cohorts.push(cohort);
                    if(cohort && rowsets.cohorts.indexOf(cohort) === -1){
                        rowsets.cohorts.push((''+cohort).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
                            return $1.toUpperCase();
                        }));
                    }
                });
            }
            if(row.school_district && rowsets.districts.indexOf(row.school_district) === -1){
                rowsets.districts.push(row.school_district);
            }
        });

        res.sendSuccess(rowsets);

    });
};

/**
 *
 * @type {{_checkPermission, grant, create, save, get, all, delete}|{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
module.exports = ReportController;