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

      me.personal = {};

      me.notAvailable = 'N/A';


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
      me.personal.collageBound = null;
      me.personal.phone = null;
      me.personal.email = null;
      me.personal.address = null;
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
      me.personal.enrollment.schoolYear = l.get(me.xSre, 'enrollment.schoolYear') || me.notAvailable;
      me.personal.enrollment.currentSchool = l.get(me.xSre, 'enrollment.school.schoolName') || me.notAvailable;
      me.personal.enrollment.expectedGraduationYear = l.get(me.xSre, 'enrollment.projectedGraduationYear') || me.notAvailable;
      me.personal.enrollment.gradeLevel = l.get(me.xSre, 'enrollment.gradeLevel') || me.notAvailable;
      me.personal.enrollment.entryDate = l.get(me.xSre, 'enrollment.entryDate') || me.notAvailable;
      me.personal.enrollment.exitDate = l.get(me.xSre, 'enrollment.exitDate') || me.notAvailable;
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
      me.personal.languageHome =  me.notAvailable;
      if(_.isArray(languages) && languages.length > 1){
            me.personal.languageHome = l.get(languages[1], 'code') || me.notAvailable;
      }

      return me.personal;
};


/**
 *
 * @type {Personal}
 */
module.exports = Personal;