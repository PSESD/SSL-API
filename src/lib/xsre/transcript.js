/**
 * Created by zaenal on 28/08/15.
 */
var moment = require('moment');
var _ = require('underscore');
/**
 *
 * @param xsre
 * @constructor
 */
function Transcript(xsre){

    this.transcriptTerm = xsre.json.transcriptTerm || null;

    this.transcriptTermOther = xsre.json.otherTranscriptTerms.transcriptTerm || null;

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

    this.csedId = xsre.cedsId;

    this.totalCreditsEarned = 0;

    this.gradeLevel = this.notAvailable;

    this.credits = 1;

    this.totalCreditsAttempted = 0;

}
/**
 *
 * @returns {Array}
 */
Transcript.prototype.getTranscript = function(){

    var me = this;

    if(null !== me.transcriptTerm) {

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

    me.subject = _.sortBy(me.subject);

    me.course = _.sortBy(me.course);

    var subjectObject = {};

    _.each(me.subject, function(s){

        subjectObject[s] = 0;

    });

    _.each(me.course, function(course){

        var courseTranscripts = {};

        me.history.push({ schoolName: course.schoolName, schoolYear: course.schoolYear });

        if(_.isObject(course.transcripts)) {

            _.each(me.subject, function (subject, i) {

                if (Object.keys(course.transcripts).indexOf(subject) === -1) {

                    courseTranscripts[subject] = null;

                } else {

                    courseTranscripts[subject] = course.transcripts[subject];

                    courseTranscripts[subject].index = i;

                    courseTranscripts[subject].forEach(function(c){

                        subjectObject[subject] += c.creditsAttempted;

                        c.index = i;

                    });

                }

            });

        }

        course.transcripts = courseTranscripts;

    });

    return {
        history: _.sortBy(me.history, 'schoolYear').reverse(),
        details: me.course,
        credits: me.credits,
        subject: subjectObject,
        totalCreditsEarned: parseInt(me.totalCreditsEarned),
        totalCreditsAttempted: parseInt(me.totalCreditsAttempted),
        gradeLevel: me.gradeLevel,
        summary: me.summary
    };
};
/**
 *
 * @param transcript
 */
Transcript.prototype.processTranscript = function(transcript){

    var me = this;

    var summary = {
        totalCreditsEarned: 0,
        termWeightedGpa: 0,
        cumulativeGpa: 0,
        termCreditsAttempted: 0,
        classRank: 0,
        gpaScale: 0
    };

    if(typeof transcript.academicSummary === 'object'){

        if(!_.isEmpty(transcript.academicSummary.totalCreditsEarned)) summary.totalCreditsEarned = parseFloat(transcript.academicSummary.totalCreditsEarned);
        if(!_.isEmpty(transcript.academicSummary.termWeightedGpa)) summary.termWeightedGpa = parseFloat(transcript.academicSummary.termWeightedGpa);
        if(!_.isEmpty(transcript.academicSummary.cumulativeGpa)) summary.cumulativeGpa = parseFloat(transcript.academicSummary.cumulativeGpa);
        if(!_.isEmpty(transcript.academicSummary.termCreditsAttempted)) summary.termCreditsAttempted = parseFloat(transcript.academicSummary.termCreditsAttempted);
        if(!_.isEmpty(transcript.academicSummary.classRank)) summary.classRank = parseFloat(transcript.academicSummary.classRank);
        if(!_.isEmpty(transcript.academicSummary.gpaScale)) summary.gpaScale = parseFloat(transcript.academicSummary.gpaScale);

        me.summary.totalCreditsEarned += summary.totalCreditsEarned;
        me.summary.termWeightedGpa += summary.termWeightedGpa;
        me.summary.cumulativeGpa += summary.cumulativeGpa;
        me.summary.termCreditsAttempted += summary.termCreditsAttempted;
        me.summary.classRank += summary.classRank;
        me.summary.gpaScale += summary.gpaScale;

    }

    var key = (transcript.schoolYear + ' ' + transcript.session.description).trim(), info = {
        gradeLevel : transcript.gradeLevel,
        schoolYear : transcript.schoolYear,
        schoolName : transcript.school.schoolName,
        session: transcript.session.description,
        transcripts: {},
        summary: summary
    };

    if(Object.keys(me.course).indexOf(key) === -1) me.course[key] = info;

    if (!_.isEmpty(transcript.courses)) {

        _.each(transcript.courses.course, function (course) {

            if(!course) return;

            if(!course.leaCourseId) return;

            var uniqueId = course.scedCourseSubjectAreaCode;

            if(uniqueId in me.csedId) {

                var uniqueStr = me.csedId[uniqueId];

                if (Object.keys(me.course[key].transcripts).indexOf(uniqueStr) === -1) me.course[key].transcripts[uniqueStr] = [];

                if(me.subject.indexOf(uniqueStr) === -1) me.subject.push(uniqueStr);

                var mark = course.progressMark || course.finalMarkValue;

                me.course[key].transcripts[uniqueStr].push({
                    index: null,
                    n: me.course[key].transcripts[uniqueStr].length + 1,
                    cdesId: uniqueId,
                    courseId: course.leaCourseId,
                    title: course.courseTitle || me.notAvailable,
                    mark: mark,
                    gradeLevel: info.gradeLevel || me.notAvailable,
                    creditsEarned: parseFloat(course.creditsEarned),
                    creditsAttempted: parseFloat(course.creditsAttempted)
                });

            }

        });

    }

};



module.exports = Transcript;