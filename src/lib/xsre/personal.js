'use strict';
/**
 * Created by zaenal on 28/08/15.
 */
var moment = require('moment');
var _ = require('underscore');
var l = require('lodash');
/**
 *
 * @param xsre
 * @constructor
 */
function Personal(xsre){

    var me = this;

    me.xSre = xsre.json;

    me.config = xsre.config;

    me.personal = {};

    //me.notAvailable = 'N/A';
    me.notAvailable = '';

    me.histories = xsre.getTranscript().getHistory().reverse();


}
/**
 *
 * @returns {Array}
 */
Personal.prototype.getPersonal = function(){

    var me = this;

    me.personal.districtID = l.get(me.xSre, 'localId') || me.notAvailable;
    me.personal.birthday = l.get(me.xSre, 'demographics.birthDate') || me.notAvailable;
    me.personal.race = l.get(me.xSre, 'demographics.races.race.race') || me.notAvailable;
    me.personal.gender = l.get(me.xSre, 'demographics.sex') || me.notAvailable;
    me.personal.collegeBound = null;
    me.personal.phone = null;
    me.personal.email = null;
    me.personal.address = null;
    me.personal.firstName = null;
    me.personal.lastName = null;
    me.personal.middleName = null;
    me.personal.schoolDistrict = null;
    me.personal.emergency1 = {
        name: null,
        relationship: null,
        email: null,
        phone: null,
        mentor: null
    };
    me.personal.emergency2 = {
        name: null,
        relationship: null,
        email: null,
        phone: null,
        mentor: null
    };

    me.personal.enrollment = {
        currentSchool: null,
        expectedGraduationYear: null,
        gradeLevel: null,
        entryDate: null,
        exitDate: null
    };
    me.personal.languages = [];
    me.personal.enrollment.schoolYear = l.get(me.xSre, 'enrollment.schoolYear') || me.notAvailable;
    me.personal.enrollment.currentSchool = l.get(me.xSre, 'enrollment.school.schoolName') || me.notAvailable;
    me.personal.enrollment.expectedGraduationYear = l.get(me.xSre, 'enrollment.projectedGraduationYear') || me.notAvailable;
    me.personal.enrollment.gradeLevel = l.get(me.xSre, 'enrollment.gradeLevel') || me.notAvailable;
    me.personal.enrollment.entryDate = l.get(me.xSre, 'enrollment.entryDate') || me.notAvailable;
    me.personal.enrollment.exitDate = l.get(me.xSre, 'enrollment.exitDate') || me.notAvailable;
    me.personal.enrollment.status = me.notAvailable;
    me.personal.enrollment.description = me.notAvailable;
    me.personal.enrollmentHistories = me.histories;
    var enrollment = l.get(me.xSre, 'enrollment') || [];
    var status = null;
    var description = null;

    if('enrollmentStatus' in enrollment){
        status = enrollment.enrollmentStatus;
    } else if('psesd:enrollmentStatus' in enrollment){
        status = enrollment['psesd:enrollmentStatus'];
    }

    if(status && 'EnrollmentStatus' in me.config && status in me.config.EnrollmentStatus){
        description = l.get(me.config.EnrollmentStatus[status], 'description') || null;
    }

    if(status !== null){
        me.personal.enrollment.status = status;
    }

    if(description !== null){
        me.personal.enrollment.description = description;
    }
    /**
     *
     */
    me.personal.daysInAttendance = l.get(me.xSre, 'attendance.summaries.summary.daysInAttendance') || me.notAvailable;
    me.personal.daysAbsent = l.get(me.xSre, 'attendance.summaries.summary.daysAbsent') || me.notAvailable;
    me.personal.section504Status = l.get(me.xSre, 'programs.specialEducation.section504Status') || me.notAvailable;
    me.personal.eligibilityStatus = l.get(me.xSre, 'programs.foodService.eligibilityStatus') || me.notAvailable;
    me.personal.enrollmentStatus = l.get(me.xSre, 'programs.foodService.enrollmentStatus') || me.notAvailable;
    var specialEducationServices = l.get(me.xSre, 'programs.specialEducation.services');

    if(_.isArray(specialEducationServices)){
        specialEducationServices = specialEducationServices[0];
    }
    me.personal.ideaIndicator = l.get(specialEducationServices, 'service.ideaIndicator') || me.notAvailable;
    var languages = l.get(me.xSre, 'languages.language');

    if(_.isArray(languages) && languages.length > 1){

        languages.forEach(function(language){
            var newLang = { type: language.type, code: language.code, description: "" };
            var code = l.find(me.config.languageCode, function(o){
                return o.value === language.code;
            });
            if(code && code.description){
                newLang.description = code.description;
            }

            me.personal.languages.push(newLang);
        });

    }

    return me.personal;
};


/**
 *
 * @type {Personal}
 */
module.exports = Personal;