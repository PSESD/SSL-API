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
function Transcript(xsre){

    var me = this;

    me.config = xsre.config;

    me.transcriptTerm = null;

    me.transcriptTermOther = null;

    me.enrollments = xsre.json.enrollment ? [xsre.json.enrollment] : [];

    me.transcriptFilterMark = [];

    if(xsre.json.otherEnrollments && _.isArray(xsre.json.otherEnrollments.enrollment)){

        _.each(xsre.json.otherEnrollments.enrollment, function(enrollment){

            me.enrollments.push(enrollment);

        });
    }

    if(xsre.json) {

        if(xsre.json.transcriptTerm) {
            me.transcriptTerm = xsre.json.transcriptTerm;
        }

        if(xsre.json.otherTranscriptTerms && xsre.json.otherTranscriptTerms.transcriptTerm) {
            me.transcriptTermOther = xsre.json.otherTranscriptTerms.transcriptTerm;
        }

    }

    me.extractRawSource = xsre.extractRawSource;

    me.subject = [];

    me.history = [];

    me.course = {};

    //me.notAvailable = 'N/A';
    me.notAvailable = '';

    me.currentGPA = 0;

    me.academicSummary = {
        totalCreditsEarned: 0,
        totalCreditsAttempted: 0,
        termWeightedGpa: 0,
        cumulativeGpa: 0,
        termCreditsEarned: 0,
        termCreditsAttempted: 0,
        classRank: 0,
        gpaScale: 0
    };

    me.facets = xsre.facets;

    var scedId = {};

    var scedSort = [];

    for(var k = 1; k <= 23; k++){

        var nk = k < 10 ? '0'+k : ''+k;

        scedId[nk] = xsre.config.scedCourseSubjectAreaCode[nk].definition;

        scedSort.push(xsre.config.scedCourseSubjectAreaCode[nk].definition);

    }

    me.scedId = scedId;

    me.scedSort = scedSort;

    me.scedNotFound = {};

    me.totalCreditsEarned = 0;

    me.totalCreditsAttempted = 0;

    me.gradeLevel = me.notAvailable;

    me.credits = 1;

    me.totalCreditsAttempted = 0;

    me.info = { totalEarned: 0, totalAttempted: 0, gradeLevel: 0 };

}
/**
 *
 * @returns {Array}
 */
Transcript.prototype.getHistory = function(){

    var me = this;

    if(me.enrollments.length > 0){

        var schools = [];

        var histories = [];

        _.each(me.enrollments, function(enrollment){

            var school = enrollment.school;

            var schoolName = l.get(school, 'schoolName');

            var schoolYear = enrollment.schoolYear || me.notAvailable;

            if(schoolName && schools.indexOf(schoolName) === -1){

                schools.push(schoolName);

            }

            var his = { leaRefId: enrollment.leaRefId, schoolRefId: enrollment.schoolRefId, schoolName: schoolName, schoolYear: schoolYear };

            var status = null;

            var description = null;

            if('enrollmentStatus' in enrollment){

                status = enrollment.enrollmentStatus || me.notAvailable;

            } else if('psesd:enrollmentStatus' in enrollment){

                status = enrollment['psesd:enrollmentStatus'] || me.notAvailable;

            }

            if(status && 'EnrollmentStatus' in me.config && status in me.config.EnrollmentStatus){

                description = l.get(me.config.EnrollmentStatus[status], 'description') || me.notAvailable;

            } else {

                description = me.notAvailable;

            }

            if(description === me.notAvailable){

                if('raw:source' in enrollment && enrollment['raw:source']){

                    _.each(enrollment['raw:source'], function(value, key){

                        var ikey = (key+'').substring(4);

                        if('enrollmentStatusDescription' === ikey){

                            description = value;

                        }

                    });

                }

            }

            his.schoolName = l.get(enrollment, 'school.schoolName') || me.notAvailable;
            his.projectedGraduationYear = l.get(enrollment, 'projectedGraduationYear') || me.notAvailable;
            his.gradeLevel = l.get(enrollment, 'gradeLevel') || me.notAvailable;
            his.entryDate = l.get(enrollment, 'entryDate') || me.notAvailable;
            his.exitDate = l.get(enrollment, 'exitDate') || me.notAvailable;
            his.membershipType = l.get(enrollment, 'membershipType') || me.notAvailable;
            his.enrollmentStatus = status || me.notAvailable;
            his.enrollmentStatusDescription = description || me.notAvailable;
            var entryDate = moment(his.entryDate);

            var exitDate = moment(his.exitDate);


            /**
             * Check Non-promotional changes
             */
            me.history.push(his);

        });



    }

    var historiesPromotionChanges = _.sortBy(me.history, 'exitDateTime');
    var currentSchoolId = null;
    historiesPromotionChanges = _.map(historiesPromotionChanges, function(history){
        history.nonPromotionalChange = false;
        if(currentSchoolId === null){
            currentSchoolId = history.schoolId;
        }

        if(history.schoolId !== currentSchoolId){
            history.nonPromotionalChange = true;
        }

        currentSchoolId = history.schoolId;
        return history;
    });

    return historiesPromotionChanges;
};
/**
 *
 * @returns {Array}
 */
Transcript.prototype.getTranscript = function(){

    var me = this;

    if(null !== me.transcriptTerm) {

        me.processTranscript(me.transcriptTerm, true);

    }


    if(null !== me.transcriptTermOther) {

        _.each(me.transcriptTermOther, function (transcript) {

            me.processTranscript(transcript, false);

        });

    }

    /**
     * Verify the data
     */

    var subjectModified = [];

    var subjectObject = {};

    _.each(me.scedSort, function(scedId){

        if(me.subject.indexOf(scedId) !== -1){

            subjectModified.push(scedId);

            subjectObject[scedId] = 0;

        }

    });
    /**
     * Add sort when scedAreaCode not in map config
     * @see src/lib/xsre/config.js
     *
     */
    if(Object.keys(me.scedNotFound).length > 0){

        _.each(_.sortBy(Object.keys(me.scedNotFound)), function(scedId){

            if(me.subject.indexOf(scedId) !== -1){

                subjectModified.push(scedId);

                subjectObject[scedId] = 0;

            }

        });

    }

    me.subject = subjectModified;

    //console.log(me.subject);

    me.course = _.sortBy(me.course, function(o){
        return o.startDateTime * -1;
    });



    //console.log(me.history);

    _.each(me.course, function(course){

        var courseTranscripts = {};

        //me.history.push({ schoolName: course.schoolName, schoolYear: course.schoolYear });

        if(_.isObject(course.transcripts)) {

            _.each(me.subject, function (subject, i) {

                if (Object.keys(course.transcripts).indexOf(subject) === -1) {

                    courseTranscripts[subject] = null;

                } else {

                    courseTranscripts[subject] = course.transcripts[subject];

                    courseTranscripts[subject].index = i;

                    courseTranscripts[subject].forEach(function(c){

                        subjectObject[subject] += c.creditsEarned;

                        me.info.totalAttempted += c.creditsAttempted;

                        me.info.totalEarned += c.creditsEarned;

                        c.index = i;

                    });

                }

            });

        }

        course.transcripts = courseTranscripts;

    });

    var subjectValues = [];

    _.each(subjectModified, function(s){

        subjectValues.push({ name: s, value: parseFloat(subjectObject[s]).toFixed(1) });

    });

    me.info.totalAttempted = parseFloat(me.info.totalAttempted).toFixed(1);
    me.info.totalEarned = parseFloat(me.info.totalEarned).toFixed(1);

    if(me.academicSummary.termCreditsAttempted === 0 && me.academicSummary.totalCreditsEarned === 0){

        me.totalCreditsAttempted = me.info.totalAttempted;

        me.totalCreditsEarned = me.info.totalEarned;

    }

    if(me.gradeLevel === me.notAvailable){

        me.gradeLevel = me.info.gradeLevel;

    }

    return {
        //history: me.getHistory().reverse(), // handle in general/personal
        details: me.course,
        credits: me.credits,
        subject: subjectModified,
        subjectValues: subjectValues,
        currentGPA: me.currentGPA,
        totalCreditsEarned: isNaN(me.totalCreditsEarned) ? 0 : parseFloat(me.totalCreditsEarned).toFixed(1),
        totalCreditsAttempted: isNaN(me.totalCreditsAttempted) ? 0 : parseFloat(me.totalCreditsAttempted).toFixed(1),
        totalCumulativeGpa: me.academicSummary.cumulativeGpa.toFixed(1),
        gradeLevel: me.gradeLevel,
        academicSummary: me.academicSummary,
        transcriptTerm: { courses: l.get(me.transcriptTerm, 'courses.course', []), school: l.get(me.transcriptTerm, 'school'), schoolYear: l.get(me.transcriptTerm, 'schoolYear', []), session: l.get(me.transcriptTerm, 'session', "") },
        info: me.info
    };
};
/**
 *
 * @param transcript
 * @param current
 */
Transcript.prototype.processTranscript = function(transcript, current){

    var me = this;

    if(!_.isObject(transcript.courses)){

        return;

    }


    var tSchoolYear = l.get(transcript, 'schoolYear');
    var tSession = l.get(transcript, 'session.description');
    var tSchoolName = l.get(transcript, 'school.schoolName');


    if(_.isUndefined(transcript.courses.course)){

        return ;

    }

    if(!_.isArray(transcript.courses.course)){

        transcript.courses.course = [ transcript.courses.course ];

    }

    if(current) {

        _.each(transcript.courses.course, function (course) {

            if (!course) {
                return;
            }

            if (!course.leaCourseId) {
                return;
            }

            //if(course.courseTitle){
            //
            //    me.transcriptTerm.courses.push({ courseTitle: course.courseTitle, timeTablePeriod: course.timeTablePeriod });
            //
            //}

        });

    }

    var academicSummary = {
        totalCreditsEarned: 0,
        totalCreditsAttempted: 0,
        termWeightedGpa: 0,
        cumulativeGpa: 0,
        termCreditsAttempted: 0,
        termCreditsEarned: 0,
        classRank: 0,
        gpaScale: 0
    };

    if(typeof transcript.academicSummary === 'object'){

        //transcript.academicSummary = me.extractRawSource(transcript.academicSummary);

        if(!_.isEmpty(transcript.academicSummary.totalCreditsEarned) && !isNaN(transcript.academicSummary.totalCreditsEarned)) {
            academicSummary.totalCreditsEarned = parseFloat(transcript.academicSummary.totalCreditsEarned);
        }
        if(!_.isEmpty(transcript.academicSummary.totalCreditsAttempted) && !isNaN(transcript.academicSummary.totalCreditsAttempted)) {
            academicSummary.totalCreditsAttempted = parseFloat(transcript.academicSummary.totalCreditsAttempted);
        }
        if(!_.isEmpty(transcript.academicSummary.termWeightedGpa) && !isNaN(transcript.academicSummary.termWeightedGpa)) {
            academicSummary.termWeightedGpa = parseFloat(transcript.academicSummary.termWeightedGpa);
        }
        if(!_.isEmpty(transcript.academicSummary.cumulativeGpa) && !isNaN(transcript.academicSummary.cumulativeGpa)) {
            academicSummary.cumulativeGpa = parseFloat(transcript.academicSummary.cumulativeGpa);
        }
        if(!_.isEmpty(transcript.academicSummary.termCreditsEarned) && !isNaN(transcript.academicSummary.termCreditsEarned)) {
            academicSummary.termCreditsEarned = parseFloat(transcript.academicSummary.termCreditsEarned);
        }
        if(!_.isEmpty(transcript.academicSummary.termCreditsAttempted) && !isNaN(transcript.academicSummary.termCreditsAttempted)) {
            academicSummary.termCreditsAttempted = parseFloat(transcript.academicSummary.termCreditsAttempted);
        }
        if(!_.isEmpty(transcript.academicSummary.classRank) && !isNaN(transcript.academicSummary.classRank)) {
            academicSummary.classRank = parseFloat(transcript.academicSummary.classRank);
        }
        if(!_.isEmpty(transcript.academicSummary.gpaScale) && !isNaN(transcript.academicSummary.gpaScale)) {
            academicSummary.gpaScale = parseFloat(transcript.academicSummary.gpaScale);
        }

        me.academicSummary.totalCreditsEarned += academicSummary.totalCreditsEarned;
        me.academicSummary.totalCreditsAttempted += academicSummary.totalCreditsAttempted;
        me.academicSummary.termWeightedGpa += academicSummary.termWeightedGpa;
        me.academicSummary.cumulativeGpa += academicSummary.cumulativeGpa;
        me.academicSummary.termCreditsAttempted += academicSummary.termCreditsAttempted;
        me.academicSummary.termCreditsEarned += academicSummary.termCreditsEarned;
        me.academicSummary.classRank += academicSummary.classRank;
        me.academicSummary.gpaScale += academicSummary.gpaScale;

    }

    //transcript = me.extractRawSource(transcript);

    //console.log(transcript);

    if(!tSchoolName || !tSession || !tSchoolYear){

        return;

    }

    var key = (tSchoolYear + ':' + tSession + ':' + tSchoolName).trim(), info = {
        gradeLevel : transcript.gradeLevel,
        schoolYear : tSchoolYear,
        schoolName : tSchoolName,
        startDate: l.get(transcript, 'session.startDate', ""),
        endDate: l.get(transcript, 'session.endDate', ""),
        startDateTime: 0,
        session: tSession,
        transcripts: {},
        academicSummary: academicSummary
    };

    if(info.startDate){
        info.startDateTime = new Date(info.startDate).getTime();
    } else {
        info.startDate = info.tSchoolYear;
        info.startDateTime = new Date(info.startDate).getTime();
    }

    if(parseInt(me.info.gradeLevel) < parseInt(info.gradeLevel)){

        me.info.gradeLevel = info.gradeLevel;

    }

    if(Object.keys(me.course).indexOf(key) === -1) {
        me.course[key] = info;
    }

    _.each(transcript.courses.course, function (course) {

        if(!course) {
            return;
        }

        if(!course.leaCourseId) {
            return;
        }

        var uniqueId = course.scedCourseSubjectAreaCode;

        if(uniqueId in me.scedId) {

            me.transcriptWithSCED(uniqueId, key, course, info, current);

        } else {

            me.transcriptWithNoSCED(uniqueId, key, course, info, current);

        }

    });


};
/**
 *
 * @param scedAreaCode
 * @param key
 * @param course
 * @param info
 * @param current
 */
Transcript.prototype.transcriptWithSCED = function(scedAreaCode, key, course, info, current){

    var me = this;

    var uniqueStr = me.scedId[scedAreaCode];
    var teacherNames = [];
    if('psesd:teacherNames' in course){
        teacherNames = course['psesd:teacherNames'].split(', ');
    } else if('teacherNames' in course) {
        teacherNames = course['teacherNames'].split(', ');
    }
    if (Object.keys(me.course[key].transcripts).indexOf(uniqueStr) === -1) {
        me.course[key].transcripts[uniqueStr] = [];
    }

    if(me.subject.indexOf(uniqueStr) === -1) {
        me.subject.push(uniqueStr);
    }

    var mark = null;
    var progressMarkSessionDescription = null;
    var interim = null;

    if('progressMarkSessionDescription' in course){
        progressMarkSessionDescription = course.progressMarkSessionDescription;
    } else if('psesd:progressMarkSessionDescription' in course){
        progressMarkSessionDescription = course['psesd:progressMarkSessionDescription'];
    }

    mark = course.finalMarkValue || course.progressMark;

    if (progressMarkSessionDescription && progressMarkSessionDescription.toLowerCase().indexOf('semester') !== -1) {
        interim = 'final';
    } else {
        interim = 'interim';
    }

    if(!mark) {

        mark = '';

    }

    var icheck = key + '+' + uniqueStr + '+' + (course.courseTitle || me.notAvailable);

    if(me.transcriptFilterMark.indexOf(icheck) !== -1){

        return;

    }

    me.transcriptFilterMark.push(icheck);

    if(me.course[key].academicSummary){

        if(!('totalCreditsEarned' in me.course[key].academicSummary)){
            me.course[key].academicSummary.totalCreditsEarned = 0;
        }
        if(!('totalCreditsAttempted' in me.course[key].academicSummary)){
            me.course[key].academicSummary.totalCreditsAttempted = 0;
        }
        if(!('termCreditsEarned' in me.course[key].academicSummary)){
            me.course[key].academicSummary.termCreditsEarned = 0;
        }
        if(!('termCreditsAttempted' in me.course[key].academicSummary)){
            me.course[key].academicSummary.termCreditsAttempted = 0;
        }

        if(mark) {
            me.course[key].academicSummary.totalCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
            me.course[key].academicSummary.totalCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);

            me.course[key].academicSummary.termCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
            me.course[key].academicSummary.termCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);
        }

    }

    me.course[key].transcripts[uniqueStr].push({
        index: null,
        n: me.course[key].transcripts[uniqueStr].length + 1,
        scedCourseSubjectAreaCode: scedAreaCode,
        leaCourseId: course.leaCourseId,
        courseTitle: course.courseTitle || me.notAvailable,
        timeTablePeriod: course.timeTablePeriod || me.notAvailable,
        mark: mark,
        gradeLevel: info.gradeLevel || me.notAvailable,
        creditsEarned: isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned),
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted),
        progressMarkSessionDescription: progressMarkSessionDescription,
        interim: interim,
        teacherNames: teacherNames
    });

};
/**
 *
 * @param scedAreaCode
 * @param key
 * @param course
 * @param info
 * @param current
 */
Transcript.prototype.transcriptWithNoSCED = function(scedAreaCode, key, course, info, current){

    var me = this;

    var uniqueStr = scedAreaCode;

    if(Object.keys(me.scedNotFound).indexOf(scedAreaCode) === -1){
        me.scedNotFound[scedAreaCode] = [];
    }

    if (Object.keys(me.course[key].transcripts).indexOf(uniqueStr) === -1) {
        me.course[key].transcripts[uniqueStr] = [];
    }

    if(me.subject.indexOf(uniqueStr) === -1) {
        me.subject.push(uniqueStr);
    }

    var mark = null;
    var progressMarkSessionDescription = null;
    var interim = null;

    if('progressMarkSessionDescription' in course){
        progressMarkSessionDescription = course.progressMarkSessionDescription;
    } else if('psesd:progressMarkSessionDescription' in course){
        progressMarkSessionDescription = course['psesd:progressMarkSessionDescription'];
    }

    mark = course.finalMarkValue || course.progressMark;

    switch (progressMarkSessionDescription){
        case 'Semester 1':
        case 'Semester 2':
            interim = 'final grade';
            // mark = course.finalMarkValue;
            break;
        default:
            // mark = course.progressMark;
            interim = 'interim grade';
            if(mark){
                interim = 'mid-course grade';
            }
            break;

    }

    if(!mark) {

        mark = '';

    }

    if(me.course[key].academicSummary){

        if(!('totalCreditsEarned' in me.course[key].academicSummary)){
            me.course[key].academicSummary.totalCreditsEarned = 0;
        }
        if(!('totalCreditsAttempted' in me.course[key].academicSummary)){
            me.course[key].academicSummary.totalCreditsAttempted = 0;
        }
        if(!('termCreditsEarned' in me.course[key].academicSummary)){
            me.course[key].academicSummary.termCreditsEarned = 0;
        }
        if(!('termCreditsAttempted' in me.course[key].academicSummary)){
            me.course[key].academicSummary.termCreditsAttempted = 0;
        }

        if(mark) {
            me.course[key].academicSummary.totalCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
            me.course[key].academicSummary.totalCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);

            me.course[key].academicSummary.termCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
            me.course[key].academicSummary.termCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);
        }

    }

    me.course[key].transcripts[uniqueStr].push({
        index: null,
        n: me.course[key].transcripts[uniqueStr].length + 1,
        scedCourseSubjectAreaCode: scedAreaCode,
        leaCourseId: course.leaCourseId,
        courseTitle: course.courseTitle || me.notAvailable,
        timeTablePeriod: course.timeTablePeriod || me.notAvailable,
        mark: mark,
        gradeLevel: info.gradeLevel || me.notAvailable,
        creditsEarned: isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned),
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted),
        progressMarkSessionDescription: progressMarkSessionDescription,
        interim: interim
    });

};



module.exports = Transcript;