/**
 * Created by zaenal on 18/02/16.
 */
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
function Report(xsre){

    var me = this;

    me.xSre = xsre.json;

    me.config = xsre.config;

    me.personal = {};

    me.notAvailable = 'N/A';


}
/**
 *
 * @returns {Array}
 */
Report.prototype.getAttendance = function(){

    var me = this;

    return me;
};

Report.prototype.getStudentProgram = function(){

    var me = this;

    return me;
};

Report.prototype.serialize = function(){
    return {
        attendance: this.getAttendance(),
        programs: this.getStudentProgram()
    };
};


/**
 *
 * @type {Report}
 */
module.exports = Report;