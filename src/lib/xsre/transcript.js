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

        //console.log(require('prettyjson').render(me.transcriptTermOther));return;

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

    _.each(me.course, function(course){

        var courseTranscripts = {};

        me.history.push({ schoolName: course.schoolName, schoolYear: course.schoolYear });

        if(_.isObject(course.transcripts)) {

            _.each(me.subject, function (subject) {

                if (Object.keys(course.transcripts).indexOf(subject) === -1) {

                    courseTranscripts[subject] = null;

                } else {

                    courseTranscripts[subject] = course.transcripts[subject];

                }

            });

        }

        course.transcripts = courseTranscripts;

    });

    return {
        history: _.sortBy(me.history, 'schoolYear').reverse(),
        details: me.course,
        credits: me.credits,
        totalCreditsEarned: parseInt(me.totalCreditsEarned),
        totalCreditsAttempted: parseInt(me.totalCreditsAttempted),
        gradeLevel: me.gradeLevel
    };
};
/**
 *
 * @param transcript
 */
Transcript.prototype.processTranscript = function(transcript){

    var me = this;

    //console.log(require('prettyjson').render(transcript));return;

    var key = transcript.schoolYear + ' ' + transcript.session.sessionType, info = {

        gradeLevel : null,
        schoolYear : transcript.schoolYear,
        schoolName : transcript.school.schoolName,
        session: transcript.session.sessionType,
        transcripts: {}
    };

    if(typeof transcript.school.gradeLevels === 'object'){

        info.gradeLevel = transcript.school.gradeLevels.gradeLevel;

    } else {
        info.gradeLevel = me.notAvailable;
    }

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

                if(!course.applicableEducationLevels){

                    course.applicableEducationLevels = { applicableEducationLevel: me.notAvailable };

                }

                me.course[key].transcripts[uniqueStr].push({
                    cdesId: uniqueId,
                    courseId: course.leaCourseId,
                    title: course.courseTitle,
                    grade: course.finalMarkValue,
                    gradeLevel: course.applicableEducationLevels.applicableEducationLevel,
                    creditsEarned: course.creditsEarned,
                    creditsAttempted: course.creditsAttempted
                });

            }

        });

    }

};



module.exports = Transcript;