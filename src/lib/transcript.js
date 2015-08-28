/**
 * Created by zaenal on 28/08/15.
 */
var moment = require('moment');
var _ = require('underscore');
/**
 *
 * @param results
 * @constructor
 */
function Transcript(results){
    this.transcriptTerm = results.transcriptTerm || null;
    this.transcriptTermOther = results.otherTranscriptTerms.transcriptTerm || null;
    this.transcipts = [];
    this.subject = {};

    this.notAvailable = 'N/A';

    this.facets = {

    };
}
/**
 *
 * @returns {Array}
 */
Transcript.prototype.getTranscript = function(){

    var me = this;

    if(null !== me.transcriptTerm) {

        _.each(me.transcriptTerm, function (transcript) {

            me.processTranscript(transcript);

        });

    }

    if(null !== me.transcriptTermOther) {

        _.each(me.transcriptTermOther, function (transcriptOther) {


            _.each(transcriptOther, function(transcript){

                me.processTranscript(transcript);

            });


        });

    }

    /**
     * Verify the data
     */


    //console.log(me.transcriptTermOther);
    console.log(me.subject);


};
/**
 *
 * @param transcript
 */
Transcript.prototype.processTranscript = function(transcript){

    var me = this;

    if (!_.isEmpty(transcript.course)) {

        _.each(transcript.course, function (course) {


            if(!course) return;

            if(!course.leaCourseId) return;

            var uniqueId = course.leaCourseId.toString().substr(0,3);
            var idNumber = course.leaCourseId.toString().substr(3);

            if (Object.keys(me.subject).indexOf(uniqueId) === -1) me.subject[uniqueId] = [];

            me.subject[uniqueId].push({
                group: uniqueId,
                id: parseInt(idNumber),
                courseId: course.leaCourseId,
                title: course.courseTitle,
                subject: course.subject
            });

        });

    }

};

module.exports = Transcript;