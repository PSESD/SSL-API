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

    if(!me.transcriptTerm) return me.transcipts;

    _.each(me.transcriptTerm, function(transcript){
        console.log(transcript);
    });

};

module.exports = Transcript;