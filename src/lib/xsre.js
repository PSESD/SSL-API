'use strict';
/**
 * Created by zaenal on 31/08/15.
 */
var moment = require('moment');
var Transcript = require(__dirname + '/xsre/transcript');
var Attendance = require(__dirname + '/xsre/attendance');
var Assessment = require(__dirname + '/xsre/assessment');
var CodeSet = require(__dirname + '/xsre/codeset');
var _ = require('lodash');
var pd = require('pretty-data').pd;
/**
 * @constructor
 * @param result
 * @param raw
 */
function xSre(result, raw){

    this.config = new CodeSet().get();

    if(result.payload && result.payload.response){

        this.json = result.payload.response.xSre;

    } else {

        this.json = result.xSre;

    }

    this.raw = raw;


    this.facets = {
        '13297': 'Disciplinary action, not receiving instruction',
        '13299': 'Family activity',
        '13296': 'Family emergency or bereavement',
        '13295': 'Illness, injury, health treatment, or examination',
        '13298': 'Legal or judicial requirement',
        '13293': 'Noninstructional activity recognized by state or school',
        '13294': 'Religious observation',
        '13303': 'Situation unknown',
        '13300': 'Student employment',
        '13302': 'Student is skipping school',
        '13301': 'Transportation not available',

        /**
         * Present
         */
        '13290': 'Disciplinary action, receiving instruction',
        '13288': 'In school, regular instructional program',
        '13289': 'Nontraditional school setting, regular instructional program',
        '13291': 'Out of school, regular instructional program activity',
        '13292': 'Out of school, school-approved extracurricular or cocurricular activity',
        /**
         * disciplineIncidents
         */
        '04618': 'Alcohol',
        '04625': 'Arson',
        '04626': 'Attendance Policy Violation',
        '04632': 'Battery',
        '04633': 'Burglary/Breaking and Entering',
        '04634': 'Disorderly Conduct',
        '04635': 'Drugs Excluding Alcohol and Tobacco',
        '04645': 'Fighting',
        '13354': 'Harassment or bullying on the basis of disability',
        '13355': 'Harassment or bullying on the basis of race, color, or national origin',
        '13356': 'Harassment or bullying on the basis of sex',
        '04646': 'Harassment, Nonsexual',
        '04650': 'Harassment, Sexual',
        '04651': 'Homicide',
        '04652': 'Inappropriate Use of Medication',
        '04659': 'Insubordination',
        '04660': 'Kidnapping',
        '04661': 'Obscene Behavior',
        '04669': 'Physical Altercation, Minor',
        '04670': 'Robbery',
        '04671': 'School Threat',
        '04677': 'Sexual Battery (sexual assault)',
        '04678': 'Sexual Offenses, Other (lewd behavior, indecent exposure)',
        '04682': 'Theft',
        '04686': 'Threat/Intimidation',
        '04692': 'Tobacco Possession or Use',
        '04699': 'Trespassing',
        '04700': 'Vandalism',
        '04704': 'Violation of School Rules',
        '04705': 'Weapons Possession',
        'DailyAttendance': 'Daily attendance',
        'ClassSectionAttendance': 'Class/section attendance',
        'ProgramAttendance': 'Program attendance',
        'ExtracurricularAttendance': 'Extracurricular attendance',

        'Present': 'Present',
        'ExcusedAbsence': 'Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.',
        'UnexcusedAbsence': 'Not present without acceptable cause or authorization.',
        'Tardy': 'Is absent at the time a given schedule when attendance begins but is present before the close of that time period.',
        'EarlyDeparture': 'Leaves before the official close of the daily session. Reasons may include a special activity for curricular enrichment, doctor\'s appointment, and family emergency. State, local, and school regulations may distinguish excused and unexcused early departures. When officially approved on a regular basis, early departures immediately prior to the close of the session are considered to be released time.'
    };

    if('$' in this.json) {

        delete this.json['$'];

    }

}
/**
 *
 * @returns {*}
 */
xSre.prototype.getTranscript= function(){

    return new Transcript(this);
    
};
/**
 *
 * @returns {*}
 */
xSre.prototype.getJson = function(){

    return this.json;

};

xSre.prototype.getStudentSummary = function(){

    var summary = {
        gradeLevel: null,
        schoolYear: null,
        schoolName: null,
        attendance: null,
        behavior: null,
        onTrackToGraduate: null
    };

    var json = this.getJson();

    summary.gradeLevel = _.get(json, 'enrollment.gradeLevel');
    summary.schoolYear = _.get(json,'enrollment.schoolYear');
    summary.schoolName = _.get(json,'enrollment.school.schoolName');

    var attendance = this.getAttendanceBehavior();

    summary.attendance = attendance.getCurrentTotalAttendance();
    summary.behavior = attendance.getCurrentTotalBehavior();
    summary.onTrackToGraduate = _.get(json, 'transcriptTerm.academicSummary.onTrackToGraduate');

    return summary;

};
/**
 *
 * @returns {*}
 */
xSre.prototype.getAttendanceBehavior = function(){

    return new Attendance(this);

};

xSre.prototype.getAssessment = function(){

    return new Assessment(this);

};
/**
 *
 * @param object
 * @returns {*}
 */
xSre.prototype.extractRawSource = function(object){

    if('raw:source' in object && object['raw:source']){

        _.each(object['raw:source'], function(value, key){

            var ikey = (key+'').substring(4);

            object[ikey] = value;

        });

        delete object['raw:source'];

    }

    return object;

};
/**
 *
 * @returns {*}
 */
xSre.prototype.toObject = function(){

    var json = this.json;

    json.attendanceBehaviors = this.getAttendanceBehavior().getAttendances();

    json.transcripts = this.getTranscript().getTranscript();

    json.assessments = this.getAssessment().getAssessment();

    json.lastUpdated = moment().format('MM/DD/YYYY HH:mm:ss');

    json.raw = pd.xml(this.raw);

    /**
     * Delete unnecessary the data
     */
    if(json.attendance) {
        delete json.attendance;
    }

    if(json.disciplineIncidents) {
        delete json.disciplineIncidents;
    }

    return json;

};


/**
 *
 * @type {xSre}
 */
module.exports = xSre;