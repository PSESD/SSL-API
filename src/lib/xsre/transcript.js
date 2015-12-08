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

    this.transcriptTerm = null;

    this.transcriptTermOther = null;

    this.enrollments = xsre.json.enrollment ? [xsre.json.enrollment] : [];

    var me = this;

    if(xsre.json.otherEnrollments && _.isArray(xsre.json.otherEnrollments.enrollment)){

        _.each(xsre.json.otherEnrollments.enrollment, function(enrollment){

            me.enrollments.push(enrollment);

        });
    }

    if(xsre.json) {

        if(xsre.json.transcriptTerm) {
            this.transcriptTerm = xsre.json.transcriptTerm;
        }

        if(xsre.json.otherTranscriptTerms && xsre.json.otherTranscriptTerms.transcriptTerm) {
            this.transcriptTermOther = xsre.json.otherTranscriptTerms.transcriptTerm;
        }

    }

    this.extractRawSource = xsre.extractRawSource;

    this.subject = [];

    this.history = [];

    this.course = {};

    this.notAvailable = 'N/A';

    this.summary = {
        totalCreditsEarned: 0,
        termWeightedGpa: 0,
        cumulativeGpa: 0,
        termCreditsAttempted: 0,
        classRank: 0,
        gpaScale: 0
    };

    this.facets = xsre.facets;

    var scedId = {};

    var scedSort = [];

    for(var k = 1; k <= 23; k++){

        var nk = k < 10 ? '0'+k : ''+k;

        scedId[nk] = xsre.config.scedCourseSubjectAreaCode[nk].definition;

        scedSort.push(xsre.config.scedCourseSubjectAreaCode[nk].definition);

    }

    this.scedId = scedId;

    this.scedSort = scedSort;

    this.scedNotFound = {};

    this.totalCreditsEarned = 0;

    this.gradeLevel = this.notAvailable;

    this.credits = 1;

    this.totalCreditsAttempted = 0;

    this.info = { totalEarned: 0, totalAttempted: 0, gradeLevel: 0, currentSchoolYear: null, courseTitle: [] };

}
/**
 *
 * @returns {Array}
 */
Transcript.prototype.getTranscript = function(){

    var me = this;

    if(null !== me.transcriptTerm) {

        me.info.currentSchoolYear = me.transcriptTerm.schoolYear;

        me.processTranscript(me.transcriptTerm);

    }


    if(null !== me.transcriptTermOther) {

        _.each(me.transcriptTermOther, function (transcript) {

            me.processTranscript(transcript);

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

    me.course = _.sortBy(me.course);

    if(me.enrollments.length > 0){

        var schools = [];

        _.each(me.enrollments, function(enrollment){

            var school = enrollment.school;

            if(school.schoolName && schools.indexOf(school.schoolName) === -1){

                me.history.push({ schoolName: school.schoolName, schoolYear: school.schoolYear || me.notAvailable });

                schools.push(school.schoolName);

            }

        });

    }

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

                        subjectObject[subject] += c.creditsAttempted;

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

        subjectValues.push({ name: s, value: subjectObject[s] });

    });

    return {
        history: _.sortBy(me.history, 'schoolYear').reverse(),
        details: me.course,
        credits: me.credits,
        subject: subjectModified,
        subjectValues: subjectValues,
        totalCreditsEarned: isNaN(me.totalCreditsEarned) ? 0 : parseFloat(me.totalCreditsEarned),
        totalCreditsAttempted: isNaN(me.totalCreditsAttempted) ? 0 : parseFloat(me.totalCreditsAttempted),
        gradeLevel: me.gradeLevel,
        summary: me.summary,
        info: me.info
    };
};
/**
 *
 * @param transcript
 */
Transcript.prototype.processTranscript = function(transcript){

    var me = this;

    if(!_.isObject(transcript.courses)){

        return;

    }

    if(_.isUndefined(transcript.courses.course)){

        return ;

    }

    if(!_.isArray(transcript.courses.course)){

        transcript.courses.course = [ transcript.courses.course ];

    }

    var summary = {
        totalCreditsEarned: 0,
        termWeightedGpa: 0,
        cumulativeGpa: 0,
        termCreditsAttempted: 0,
        classRank: 0,
        gpaScale: 0
    };

    if(typeof transcript.academicSummary === 'object'){

        //transcript.academicSummary = me.extractRawSource(transcript.academicSummary);

        if(!_.isEmpty(transcript.academicSummary.totalCreditsEarned) && !isNaN(transcript.academicSummary.totalCreditsEarned)) {
            summary.totalCreditsEarned = parseFloat(transcript.academicSummary.totalCreditsEarned);
        }
        if(!_.isEmpty(transcript.academicSummary.termWeightedGpa) && !isNaN(transcript.academicSummary.termWeightedGpa)) {
            summary.termWeightedGpa = parseFloat(transcript.academicSummary.termWeightedGpa);
        }
        if(!_.isEmpty(transcript.academicSummary.cumulativeGpa) && !isNaN(transcript.academicSummary.cumulativeGpa)) {
            summary.cumulativeGpa = parseFloat(transcript.academicSummary.cumulativeGpa);
        }
        if(!_.isEmpty(transcript.academicSummary.termCreditsAttempted) && !isNaN(transcript.academicSummary.termCreditsAttempted)) {
            summary.termCreditsAttempted = parseFloat(transcript.academicSummary.termCreditsAttempted);
        }
        if(!_.isEmpty(transcript.academicSummary.classRank) && !isNaN(transcript.academicSummary.classRank)) {
            summary.classRank = parseFloat(transcript.academicSummary.classRank);
        }
        if(!_.isEmpty(transcript.academicSummary.gpaScale) && !isNaN(transcript.academicSummary.gpaScale)) {
            summary.gpaScale = parseFloat(transcript.academicSummary.gpaScale);
        }

        me.summary.totalCreditsEarned += summary.totalCreditsEarned;
        me.summary.termWeightedGpa += summary.termWeightedGpa;
        me.summary.cumulativeGpa += summary.cumulativeGpa;
        me.summary.termCreditsAttempted += summary.termCreditsAttempted;
        me.summary.classRank += summary.classRank;
        me.summary.gpaScale += summary.gpaScale;

    }

    //transcript = me.extractRawSource(transcript);

    //console.log(transcript);

    var key = (transcript.schoolYear + ':' + l.get(transcript, 'session.description') + ':' + transcript.schoolName).trim(), info = {
        gradeLevel : transcript.gradeLevel,
        schoolYear : transcript.schoolYear,
        schoolName : l.get(transcript, 'school.schoolName'),
        session: l.get(transcript, 'session.description'),
        transcripts: {},
        summary: summary
    };

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

            me.transcriptWithSCED(uniqueId, key, course, info);

        } else {

            me.transcriptWithNoSCED(uniqueId, key, course, info);

        }

    });


};
/**
 *
 * @param scedAreaCode
 * @param key
 * @param course
 * @param info
 */
Transcript.prototype.transcriptWithSCED = function(scedAreaCode, key, course, info){

    var me = this;

    var uniqueStr = me.scedId[scedAreaCode];

    if (Object.keys(me.course[key].transcripts).indexOf(uniqueStr) === -1) {
        me.course[key].transcripts[uniqueStr] = [];
    }

    if(me.subject.indexOf(uniqueStr) === -1) {
        me.subject.push(uniqueStr);
    }

    var mark = course.progressMark || course.finalMarkValue;

    me.course[key].summary.totalCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);

    me.course[key].summary.termCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);

    if(course.courseTitle && me.info.courseTitle.indexOf(course.courseTitle) === -1){
        me.info.courseTitle.push(course.courseTitle);
    }

    me.course[key].transcripts[uniqueStr].push({
        index: null,
        n: me.course[key].transcripts[uniqueStr].length + 1,
        cdesId: scedAreaCode,
        courseId: course.leaCourseId,
        title: course.courseTitle || me.notAvailable,
        mark: mark,
        gradeLevel: info.gradeLevel || me.notAvailable,
        creditsEarned: isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned),
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted)
    });

};
/**
 *
 * @param scedAreaCode
 * @param key
 * @param course
 * @param info
 */
Transcript.prototype.transcriptWithNoSCED = function(scedAreaCode, key, course, info){

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

    var mark = course.progressMark || course.finalMarkValue;

    me.course[key].summary.totalCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);

    me.course[key].summary.termCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);

    if(course.courseTitle && me.info.courseTitle.indexOf(course.courseTitle) === -1){
        me.info.courseTitle.push(course.courseTitle);
    }

    me.course[key].transcripts[uniqueStr].push({
        index: null,
        n: me.course[key].transcripts[uniqueStr].length + 1,
        cdesId: scedAreaCode,
        courseId: course.leaCourseId,
        title: course.courseTitle || me.notAvailable,
        mark: mark,
        gradeLevel: info.gradeLevel || me.notAvailable,
        creditsEarned: isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned),
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted)
    });

};



module.exports = Transcript;