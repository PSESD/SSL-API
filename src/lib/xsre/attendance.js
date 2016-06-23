'use strict';
/**
 * Created by zaenal on 21/08/15.
 */
var moment = require('moment');
var _ = require('underscore');
var l = require('lodash');

moment.fn.isISO = true;
/**
 *
 * @returns {number}
 */
moment.fn.dayISO = function () {
    var self = this.clone();
    return self.day() === 0 ? 6 : self.day()-1;
};
/**
 *
 * @returns {*}
 */
moment.fn.weekISO = function () {
    var self = this.clone();
    return self.day() === 0 ? self.format('w')-1 : self.format('w');
};
/**
 *
 * @returns {{begin: *, end: *}}
 */
moment.fn.week = function () {
    var self = this.clone(),
        day = self.isISO ? self.dayISO() : self.day();
    return {
        begin: self.subtract(day, 'days').clone(),
        end:   self.add(6, 'days').clone()
    };
};
/**
 *
 * @param format
 * @returns {{toObject: Function, toString: Function}}
 */
moment.fn.daysOfWeek = function (format) {
    var self = this.clone(),
        day = self.isISO ? self.dayISO() : self.day(),
        days = [], daysObject = [];

    format = format || 'MM/DD/YYYY';
    var s = self.subtract(day, 'days');
    for(var i = 0; i <= 6; i++){

        if(i > 0){
            s = s.clone().add(1, 'days');
        }
        days.push(s.format(format));
        daysObject.push(s);
    }

    return { toObject: function(){ return daysObject; }, toString: function(){ return days; } };
};
/**
 *
 * @returns {Array}
 */
moment.fn.monthWeeks = function () {
    var self = this.clone(),
        first = self.startOf('month');
    first = self.isISO ? self.dayISO() : self.day();

    var day = 7-first,
        last = self.daysInMonth(),
        count = (last-day)/7;

    var weeks = [];
    weeks.push({
        begin: 1,
        end: day
    });
    for (var i=0; i < count; i++) {
        weeks.push({
            begin: day+1,
            end: Math.min(day+=7, last)
        });
    }
    return weeks;
};
/**
 *
 * @param target
 * @param formatString
 * @returns {Array}
 */
moment.fn.weeksTo = function (target, formatString) {
    var self = this.clone(),
        end = target.clone();
    formatString = formatString || 'MM/DD/YYYY';
    var day, from, to;
    day  = self.isISO ? self.dayISO() : self.day();
    from = self.subtract(day, 'days');
    day  = end.isISO ? end.dayISO() : end.day();
    to   = end.subtract(day, 'days');

    var result = [];

    function _weekFormat(dt){
        var end = dt.clone().add(1, 'weeks').subtract(1, 'days');
        var daysOfWeek = dt.daysOfWeek();
        return {
            startString: dt.format(formatString),
            endString: end.format(formatString),
            daysOfWeekString: daysOfWeek.toString(),
            daysOfWeek: daysOfWeek.toObject()
        };
    }
    result.push(_weekFormat(from));
    while (from.diff(to, 'weeks')) {
        result.push(_weekFormat(from.add(1, 'weeks')));
    }
    return result;
};

var OK = 'OK';
var DANGER = 'DANGER';
var WARNING = 'WARNING';
var SUCCESS = 'SUCCESS';
/**
 *
 * @param xsre
 * @constructor
 */
function Attendance(xsre){
    this.attendances = xsre.json.attendance || null;
    this.disciplineIncidents = xsre.json.disciplineIncidents || { disciplineIncident: [] };
    this.allEvents = {};
    this.allDisciplines = {};
    this.minDateCalendar = 0;
    this.maxDateCalendar = 0;
    this.attendanceBehaviors = [];
    this.allDates = [];
    this.weeks = [];
    this.availableYear = [moment().year()];
    this.filterYear = xsre.params.year || null;
    this.xsre = xsre;

    if(this.filterYear){
        if(this.filterYear.indexOf('/') !== -1){
            var split = this.filterYear.split('/');
            this.academicStart = moment(new Date(split[0], 8, 1, 0, 0, 0));
            this.academicEnd = moment(new Date(split[1], 7, 31, 0, 0, 0));
        } else {
            var y1 = parseInt(this.filterYear);
            var y2 = y1 - 1;
            this.academicStart = moment(new Date(y2, 8, 1, 0, 0, 0));
            this.academicEnd = moment(new Date(y1, 7, 31, 0, 0, 0));
        }
    } else {
        /**
         * Try get from current year
         * @type {null}
         */
        var today = new Date();
        if(today.getMonth() <= 7){
            this.academicStart = moment(new Date(today.getFullYear() - 1, 8, 1, 0, 0, 0));
            this.academicEnd = moment(new Date(today.getFullYear(), 7, 31, 0, 0, 0));
        } else {
            this.academicStart = moment(new Date(today.getFullYear(), 8, 1, 0, 0, 0));
            this.academicEnd = moment(new Date(today.getFullYear() + 1, 7, 31, 0, 0, 0));
        }
    }

    this.notAvailable = 'N/A';
    //this.notAvailable = '';

    this.currentSummary = null;

    this.facets = xsre.facets;
    this.legend = {};
    this.legend.present = this.facets.Present;
    this.legend.excused = this.facets.ExcusedAbsence;
    this.legend.unexcused = this.facets.UnexcusedAbsence;
    this.legend.tardy = this.facets.Tardy;
    this.legend.other = this.facets.EarlyDeparture;
    this.legend.unknown = this.facets.Unknown;
    this.extractRawSource = xsre.extractRawSource;
    this.maxEventDate = null;

}
/**
 *
 * @returns {behavior.legend|{present, excused, tardy, other, unexcused}|htmltag.legend|{parent}|{present: Array, excused: Array, tardy: Array, other: Array, unexcused: Array}|*}
 */
Attendance.prototype.getLegend = function(){
    return this.legend;
};
/**
 *
 * @returns {Array}
 */
Attendance.prototype.getAvailableYears = function(){

    if(!this.availableYear){
        return [];
    }

    var years = [];

    this.availableYear.sort(function(a, b){
        return b - a;
    }).forEach(function(year){

        if(year){
            years.push((year - 1) + '/' + year);
        }

    });

    return years;

};
/**
 *
 * @returns {*}
 */
Attendance.prototype.getAttendances = function(){

    var me = this;

    if(!_.isObject(me.attendances)) {
        return me.attendanceBehaviors;
    }

    if(!_.isObject(me.attendances.events)) {
        return me.attendanceBehaviors;
    }

    if(_.isUndefined(me.attendances.events.event)) {
        return me.attendanceBehaviors;
    }

    var mm = null;

    if(!_.isArray(me.attendances.events.event)){

        me.attendances.events.event = [ me.attendances.events.event ];

    }

    me.attendances.events.event.forEach(function(event){

        //event = me.injectRawSource(event);

        mm = moment(new Date(event.calendarEventDate));

        if(me.availableYear.indexOf(mm.year()) === -1){

            me.availableYear.push(mm.year());

        }

        event.calendarEventDateTime = mm.valueOf();

        var passed = true;

        if(me.filterYear && me.academicStart && me.academicEnd){

            passed = (event.calendarEventDateTime >= me.academicStart && event.calendarEventDateTime <= me.academicEnd);

        }

        if(passed && mm.isValid()){



            var obj = {
                calendarEventDate: event.calendarEventDate,
                attendanceValue: event.attendanceValue,
                attendanceStatus: null,
                attendanceStatusTitle: null,
                attendanceEventType: null,
                attendanceEventTypeTitle: null,
                absentAttendanceCategory: null,
                absentAttendanceCategoryTitle: null,
                presentAttendanceCategory: null,
                presentAttendanceCategoryTitle: null,
                timeTablePeriod: null
            };

            event.calendarEventDateString = event.calendarEventDate;

            if('absentAttendanceCategory' in event){

                obj.absentAttendanceCategory = parseInt(event.absentAttendanceCategory);

                obj.absentAttendanceCategoryTitle = (''+obj.absentAttendanceCategory) in me.facets ? me.facets[''+obj.absentAttendanceCategory] : '';

            }

            if('timeTablePeriod' in event){

                obj.timeTablePeriod = parseInt(event.timeTablePeriod);

            }

            if('presentAttendanceCategory' in event){

                obj.presentAttendanceCategory = parseInt(event.presentAttendanceCategory);

                obj.presentAttendanceCategoryTitle = (''+obj.presentAttendanceCategory) in me.facets ? me.facets[''+obj.presentAttendanceCategory] : '';

            }

            if('attendanceEventType' in event){

                obj.attendanceEventType = event.attendanceEventType;

                obj.attendanceEventTypeTitle = (''+event.attendanceEventType) in me.facets ? me.facets[''+event.attendanceEventType] : '';
            }

            if('dailyAttendanceStatus' in event){

                obj.attendanceStatus = event.dailyAttendanceStatus;

                obj.attendanceStatusTitle = (''+event.dailyAttendanceStatus) in me.facets ? me.facets[''+event.dailyAttendanceStatus] : '';

            }

            if('attendanceStatus' in event){

                obj.attendanceStatus = event.attendanceStatus;

                obj.attendanceStatusTitle = (''+event.attendanceStatus) in me.facets ? me.facets[''+event.attendanceStatus] : '';

            }

            if('absentReasonDescription' in event){

                obj.absentReasonDescription = event.absentReasonDescription;

            } else if('psesd:absentReasonDescription' in event){

                obj.absentReasonDescription = event['psesd:absentReasonDescription'];

            }

            /**
             * Add filter for other and Authenticate
             */

            switch (obj.attendanceStatus){
                case 'Present':
                    obj.attendanceStatus = 'Present';
                    break;
                case 'Tardy':
                case 'Late':
                    obj.attendanceStatus = 'Tardy';
                    break;
                case 'ExcusedAbsence':
                case 'Excused':
                    obj.attendanceStatus = 'Excused';
                    break;
                case 'UnexcusedAbsence':
                case 'Unexcused':
                    obj.attendanceStatus = 'Unexcused';
                    break;
                case 'EarlyDeparture':
                case 'Authorized':
                    obj.attendanceStatus = 'Other';
                    break;
                default :
                    obj.attendanceStatus = 'Unknown';
                    break;

            }

            event.calendarEventDate = mm.format('MM-DD-YYYY');

            delete event.school;

            if(me.allDates.indexOf(event.calendarEventDateTime) === -1) {
                me.allDates.push(event.calendarEventDateTime);
            }

            if(Object.keys(me.allEvents).indexOf(event.calendarEventDate) === -1) {
                me.allEvents[event.calendarEventDate] = [];
            }

            me.allEvents[event.calendarEventDate].push(obj);

        }

    });

    if(_.isObject(me.disciplineIncidents) && !_.isUndefined(me.disciplineIncidents.disciplineIncident)){

        if(!_.isArray(me.disciplineIncidents.disciplineIncident)){

            me.disciplineIncidents.disciplineIncident = [me.disciplineIncidents.disciplineIncident];

        }

        me.disciplineIncidents.disciplineIncident.forEach(function(discipline){

            mm = moment(new Date(discipline.incidentDate));

            discipline.incidentDateTime = mm.valueOf();

            var passed = true;

            if(me.filterYear && me.academicStart && me.academicEnd){

                passed = (discipline.incidentDateTime >= me.academicStart && discipline.incidentDateTime <= me.academicEnd);

            }

            if(passed && mm.isValid()){

                delete discipline.actions;

                var obj = {
                    incidentDate: discipline.incidentDate,
                    description: discipline.description,
                    incidentCategory: null,
                    incidentCategoryTitle: null
                };

                if('incidentCategory' in discipline){

                    obj.incidentCategory = parseInt(discipline.incidentCategory);

                    obj.incidentCategoryTitle = (''+obj.incidentCategory) in me.facets ? me.facets[''+obj.incidentCategory] : '';

                } else {

                    obj.incidentCategory = '';

                    obj.incidentCategoryTitle = '';

                }

                discipline.incidentDate = mm.format('MM-DD-YYYY');

                if(Object.keys(me.allDisciplines).indexOf(discipline.incidentDate) === -1){
                    me.allDisciplines[discipline.incidentDate] = [];
                }

                me.allDisciplines[discipline.incidentDate].push(obj);

            }

        });

    }

    me.minDateCalendar = _.min(me.allDates);

    me.maxDateCalendar = _.max(me.allDates);

    me.weeks = moment(me.minDateCalendar).weeksTo(moment(me.maxDateCalendar), 'MM/DD/YYYY');


    var behavior = {};

    var summary = {};

    var maxDay = [];

    var lastWeeklyChange = me.notAvailable;

    var weeklyChange = 0;

    me.weeks.forEach(function(week){

        var ikey = week.startString + ' - ' + week.endString;

        maxDay = [];

        weeklyChange = null;

        summary = [
            { name: 'M', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'T', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'W', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'TH', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'F', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'SA', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'S', value: me.notAvailable, date: me.notAvailable, periods: [] }
        ];

        var legend = {
            present: [],
            excused: [],
            tardy: [],
            other: [],
            unexcused: []
        };

        behavior = {
            weekDate: ikey,
            summary: {
                title: ikey,
                M: me.notAvailable,
                T: me.notAvailable,
                W: me.notAvailable,
                TH: me.notAvailable,
                F: me.notAvailable,
                SA: me.notAvailable,
                S: me.notAvailable,
                weeklyChange: me.notAvailable
            },
            detailColumns: [],
            details: [],
            periods: [],
            behaviors: {
                M: [],
                T: [],
                W: [],
                TH: [],
                F: [],
                SA: [],
                S: []
            },
            legend: {
                present: [],
                excused: [],
                tardy: [],
                other: [],
                unexcused: []
            },
            weeklyChange: me.notAvailable,
            weeklyStatus: null,
            raw: {}
        };

        var calendar = {
            title: behavior.weekDate,
            M: me.notAvailable,
            T: me.notAvailable,
            W: me.notAvailable,
            TH: me.notAvailable,
            F: me.notAvailable,
            SA: me.notAvailable,
            S: me.notAvailable,
            weeklyChange: me.notAvailable
        };

        _.each(week.daysOfWeek, function(day){

            var dayString = day.format('MM/DD/YYYY');

            var otherFormat = day.format('MM-DD-YYYY');

            var nday = day.isISO ? day.dayISO() : day.day();

            var ndays = [
                'M',
                'T',
                'W',
                'TH',
                'F',
                'SA',
                'S'
            ];

            if(summary[nday] === undefined) {
                return;
            }

            summary[nday].date = dayString;

            calendar[summary[nday].name] = dayString;

            var allEvents = otherFormat in me.allEvents ? me.allEvents[otherFormat] : [];

            if(otherFormat in me.allDisciplines) {

                behavior.behaviors[ndays[nday]] = me.allDisciplines[otherFormat];

            }


            var dailyEvent = [];

            var classSectionEvent = [];

            allEvents.forEach(function(e){

                if(e.attendanceEventType === 'DailyAttendance') {

                    dailyEvent.push(e);

                } else if(e.attendanceEventType === 'ClassSectionAttendance') {

                    classSectionEvent.push(e);

                }

            });


            if(dailyEvent.length > 0){

                me.calculateDailyAttendance(behavior, dailyEvent, nday, day, summary, legend);

            }

            if(classSectionEvent.length > 0){

                me.calculateClassSectionAttendance(behavior, classSectionEvent, nday, day, summary, legend);

            }

        });

        //behavior.legend = legend;

        var columns = [];

        var collects = {};

        var periodsColumns = [1, 2, 3, 4, 5, 6];

        var total = 0;

        summary.forEach(function(s){

            collects[s.name] = s;

            if(s.name in behavior.summary && !isNaN(s.value)){

                var svalue = parseInt(s.value) === 0 ? 0 : parseFloat(s.value);

                behavior.summary[s.name] = svalue.toFixed(1) + '%';

                total += svalue;

                maxDay.push(svalue);

            }

        });

        if(maxDay.length > 0){

            weeklyChange = (total / maxDay.length);

        } else {

            weeklyChange = null;

        }

        behavior.summary.weeklyChange = weeklyChange;

        behavior.raw.collects = collects;

        columns.push(calendar);

        periodsColumns.forEach(function(p){

            var b = {
                title: p,
                M: { value: me.notAvailable, event: null, slug: '' },
                T: { value: me.notAvailable, event: null, slug: '' },
                W: { value: me.notAvailable, event: null, slug: '' },
                TH: { value: me.notAvailable, event: null, slug: '' },
                F: { value: me.notAvailable, event: null, slug: '' },
                SA: { value: me.notAvailable, event: null, slug: '' },
                S: { value: me.notAvailable, event: null, slug: '' }
            }, title = null;


            ['M', 'T', 'W', 'TH', 'F', 'SA', 'S'].forEach(function(column){

                if((column in collects) && !_.isEmpty(collects[column].periods)){

                    collects[column].periods.forEach(function(period){

                        if(p === period.period) {

                            b[column] = {value: period.value, event: period.event, slug: period.slug};

                            if (period.period !== me.notAvailable) {

                                title = period.period;

                            }

                        }

                    });

                }


            });

            b.title = 'Period ' + b.title;

            columns.push(b);

        });

        behavior.details = columns;

        behavior.detailColumns = {
            periods: [],
            M: [],
            T: [],
            W: [],
            TH: [],
            F: [],
            SA: [],
            S: [],
            weeklyChange: []
        };

        for(var c = 0; c < columns.length; c++){

            behavior.periods.push(columns[c].title);
            behavior.detailColumns.periods.push(columns[c].title);
            behavior.detailColumns.M.push(columns[c].M);
            behavior.detailColumns.T.push(columns[c].T);
            behavior.detailColumns.W.push(columns[c].W);
            behavior.detailColumns.TH.push(columns[c].TH);
            behavior.detailColumns.F.push(columns[c].F);
            behavior.detailColumns.SA.push(columns[c].SA);
            behavior.detailColumns.S.push(columns[c].S);
            behavior.detailColumns.weeklyChange.push(columns[c].weeklyChange);

        }


        behavior.raw.weeklyChange = weeklyChange;

        behavior.raw.lastWeeklyChange = lastWeeklyChange;


        if(lastWeeklyChange !== me.notAvailable && lastWeeklyChange > 0 && !isNaN(weeklyChange)){

            behavior.weeklyChange = weeklyChange - lastWeeklyChange;

            if(lastWeeklyChange < weeklyChange){

                behavior.weeklyStatus = 'increase';

            } else {

                behavior.weeklyStatus = 'decrease';

            }

        } else {

            behavior.weeklyChange = '0.00%';

        }

        if(behavior.weeklyChange === null) {
            behavior.weeklyChange = me.notAvailable;
        }

        lastWeeklyChange = weeklyChange;

        if(!isNaN(behavior.weeklyChange)){

            behavior.weeklyChange = parseFloat(behavior.weeklyChange).toFixed(2) + '%';

        }

        behavior.summary.weeklyChange = behavior.weeklyChange;

        delete behavior.raw;

        var behaviors = {};

        behaviors[ikey] = behavior;

        me.attendanceBehaviors.push(behaviors);

    });

    me.attendanceBehaviors.reverse();

    return me.attendanceBehaviors;

};

/**
 *
 * @param behavior
 * @param events
 * @param n
 * @param day
 * @param summary
 * @param legend
 */
Attendance.prototype.calculateDailyAttendance = function(behavior, events, n, day, summary, legend){

    var me = this;

    var e = events[0];

    if(e.attendanceStatus && ((''+e.attendanceStatus).toLowerCase() === 'present' || (''+e.attendanceStatus).toLowerCase() === 'tardy')){

        summary[n].value = parseFloat(isNaN(e.attendanceValue) ? 0 : parseFloat(e.attendanceValue) * 100);

    } else {

        //summary[n].value = ((1 - (isNaN(e.attendanceValue) ? 0 : parseFloat(e.attendanceValue))) * 100);
        summary[n].value = isNaN(e.attendanceValue) ? 0 : (parseFloat(e.attendanceValue) * 100);

    }

    if(parseInt(summary[n].value) === 0) {

        summary[n].value = 0;

    }

    //summary[n].periods.push({
    //    period: e.timeTablePeriod ? e.timeTablePeriod : me.notAvailable, value: e.attendanceStatus, event: e, slug: me.slug(e.attendanceStatus)
    //});

};
/**
 *
 * @param value
 * @returns {*}
 */
Attendance.prototype.slug = function(value){

    if(!value) {
        return '';
    }

    return (value+'').toLowerCase().replace('absence', '');
};

/**
 *
 * @param behavior
 * @param events
 * @param n
 * @param day
 * @param summary
 * @param legend
 */
Attendance.prototype.calculateClassSectionAttendance = function(behavior, events, n, day, summary, legend){

    var me = this;

    var value = 0;

    events.forEach(function(e){

        if('timeTablePeriod' in e && e.timeTablePeriod){

            summary[n].periods.push({
                period: e.timeTablePeriod, value: e.attendanceStatus, event: e, slug: me.slug(e.attendanceStatus)
            });

            //value += isNaN(e.attendanceValue) ? 0 : parseFloat(e.attendanceValue).toFixed(2);

            if(e.attendanceStatus){
                legend[e.attendanceStatus.toLowerCase()].push(e);
            }

        }

    });

    if(summary[n].periods.length < 6){

        for(var i = summary[n].periods.length; i <= 6; i++){

            summary[n].periods.push({
                period: me.notAvailable, value: me.notAvailable, event: null, slug: ''
            });

        }

    }

    //if(summary[n].periods.length > 0){
    //
    //    summary[n].value = value.toFixed(2);
    //
    //}
    //
    //if(parseInt(summary[n].value) === 0) {
    //
    //    summary[n].value = 0;
    //
    //}

};
/**
 *
 * @returns {number}
 */
Attendance.prototype.getCurrentTotalAttendance = function(){

    return this.calculateSummary().attendanceCount;

};
/**
 *
 * @returns {number}
 */
Attendance.prototype.getCurrentTotalBehavior = function(){

    return this.calculateSummary().behaviorCount;

};
/**
 *
 * @returns {*}
 */
Attendance.prototype.getRiskFlag = function(){

    return this.calculateSummary().riskFlag;

};


/**
 *
 * @returns {{attendance: number, behavior: number}|*}
 */
Attendance.prototype.calculateSummary = function(){

    if(this.currentSummary !== null){

        return this.currentSummary;

    }

    var me = this;

    var mm = null;

    var lastMonth = null;

    var allDates = [];

    var attendanceCount = 0;

    var incidentCount = 0;

    var lastMonthAttendanceCount = 0;

    var lastMonthIncidentCount = 0;

    me._currentSummary = {
        date: {
            min: null,
            max: null,
            latest: null
        },
        attendances: {
            currentAcademicYear: {
                flag: SUCCESS,
                count: 0
            },
            lastMonth: {
                flag: SUCCESS,
                count: 0
            }
        },
        incidents: {
            currentAcademicYear: {
                flag: SUCCESS,
                count: 0
            },
            lastMonth: {
                flag: SUCCESS,
                count: 0
            }
        },
        riskFlag: []
    };

    if(_.isObject(me.attendances) && _.isObject(me.attendances.events) && !_.isUndefined(me.attendances.events.event)){

        if(!_.isArray(me.attendances.events.event)){

            me.attendances.events.event = [me.attendances.events.event];

        }

        me.attendances.events.event.forEach(function(event) {
            mm = moment(new Date(event.calendarEventDate));

            if (me.availableYear.indexOf(mm.year()) === -1) {

                me.availableYear.push(mm.year());

            }

            event.calendarEventDateTime = mm.valueOf();

            if(allDates.indexOf(event.calendarEventDateTime) === -1) {
                allDates.push(event.calendarEventDateTime);
            }

        });

        var maxDate = moment(_.max(allDates));
        var minDate = moment(_.min(allDates));

        me._currentSummary.date.latest = maxDate.format('MM/DD/YYYY');
        me._currentSummary.date.min = minDate.valueOf();
        me._currentSummary.date.max = maxDate.valueOf();

        lastMonth = maxDate.month();

        me.attendances.events.event.forEach(function(event){

            event = me.injectRawSource(event);

            mm = moment(new Date(event.calendarEventDate));

            event.calendarEventDateTime = mm.valueOf();

            var passed = false;

            if(me.academicStart && me.academicEnd){

                passed = (event.calendarEventDateTime >= me.academicStart && event.calendarEventDateTime <= me.academicEnd);

            }

            if(mm.isValid()){

                if('dailyAttendanceStatus' in event){

                    event.attendanceStatus = event.dailyAttendanceStatus;

                }

                if('attendanceEventType' in event && event.attendanceEventType === 'DailyAttendance'){

                    var attendanceStatus = me.slug(event.attendanceStatus);

                    if(attendanceStatus === 'excused' || attendanceStatus === 'unexcused'){

                        if(passed) {

                            attendanceCount++;

                            if(mm.month() === lastMonth){

                                //console.log('2- CURR MONTH: ', mm.month());
                                lastMonthAttendanceCount++;

                            }

                        }

                    }

                }

            }

        });

    }

    allDates = [];

    if(_.isObject(me.disciplineIncidents) && !_.isUndefined(me.disciplineIncidents.disciplineIncident)){

        var n = [];

        if(!_.isArray(me.disciplineIncidents.disciplineIncident)){

            me.disciplineIncidents.disciplineIncident = [me.disciplineIncidents.disciplineIncident];

        }

        me.disciplineIncidents.disciplineIncident.forEach(function(discipline) {

            mm = moment(new Date(discipline.incidentDate));

            discipline.incidentDateTime = mm.valueOf();

            if(allDates.indexOf(discipline.incidentDateTime) === -1) {
                allDates.push(discipline.incidentDateTime);
            }

        });

        var maxIncidentDate = moment(_.max(allDates));

        lastMonth = maxIncidentDate.month();

        me.disciplineIncidents.disciplineIncident.forEach(function(discipline){

            mm = moment(new Date(discipline.incidentDate));

            discipline.incidentDateTime = mm.valueOf();

            var passed = true;

            if(me.academicStart && me.academicEnd){

                passed = (discipline.incidentDateTime >= me.academicStart && discipline.incidentDateTime <= me.academicEnd);

            }

            if(passed && mm.isValid()){

                var m = mm.format('YY-MM-DD');

                if(n.indexOf(m) === -1){

                    n.push(m);

                    incidentCount++;

                    if(mm.month() === lastMonth){

                        lastMonthIncidentCount++;

                    }

                }

            }

        });

    }

    if(_.isObject(me.attendances) && _.isObject(me.attendances.summaries) && !_.isUndefined(me.attendances.summaries.summary)){

        if(!_.isArray(me.attendances.summaries.summary)){

            me.attendances.summaries.summary = [me.attendances.summaries.summary];

        }

        me.attendances.summaries.summary.forEach(function(summary) {

            if('daysAbsent' in summary){
                var riskLevel = l.get(summary, 'psesd:riskLevel', l.get(summary, 'riskLevel')) || null;
                if(null !== riskLevel){
                    me._currentSummary.riskFlag.push({
                        daysAbsent: summary.daysAbsent,
                        riskLevel: riskLevel,
                        trend: l.get(summary, 'psesd:trend', l.get(summary, 'trend')) || ""
                    });
                }

            }

        });

    }

    /**
     * Calculate Rules
     */

    me._currentSummary.attendances.currentAcademicYear.count = attendanceCount;
    me._currentSummary.attendances.lastMonth.count = lastMonthAttendanceCount;
    me._currentSummary.incidents.currentAcademicYear.count = incidentCount;
    me._currentSummary.incidents.lastMonth.count = lastMonthIncidentCount;

    return me._thresholdAcademic();

};
/**
 *
 * @returns {Attendance}
 * @private
 * @todo Flag Rules:
 *
 * The label would be determined based on two thresholds and would show the worse of the two:
 * . SUCCESS: In the current academic year have less than 6 missed days.
 * . WARNING: In the current academic year have 6–19 missed days.
 * . DANGER: In the current academic year have more than 19 missed days.
 */
Attendance.prototype._thresholdAcademic = function(){

    var attendances = this._currentSummary.attendances;

    if(attendances.lastMonth.count >= 2 && attendances.lastMonth.count <= 6){
        this._currentSummary.attendances.lastMonth.flag = WARNING;
    } else if(attendances.lastMonth.count >= 4){
        this._currentSummary.attendances.lastMonth.flag = DANGER;
    }

    if(attendances.currentAcademicYear.count >= 6 && attendances.currentAcademicYear.count <= 19){
        this._currentSummary.attendances.currentAcademicYear.flag = WARNING;
    } else if(attendances.currentAcademicYear.count >= 19){
        this._currentSummary.attendances.currentAcademicYear.flag = DANGER;
    }

    return  this._thresholdBehavior()
                ._populateSummary()
                .currentSummary;
};
/**
 *
 * @returns {Attendance}
 * @private
 */
Attendance.prototype._populateSummary = function(){

    this.currentSummary = {
        date: this._currentSummary.date,
        attendanceCount: [
            {
                type: 'lastMonth',
                count: this._currentSummary.attendances.lastMonth.count,
                flag: this._currentSummary.attendances.lastMonth.flag
            },
            {
                type: 'currentAcademicYear',
                count: this._currentSummary.attendances.currentAcademicYear.count,
                flag: this._currentSummary.attendances.currentAcademicYear.flag
            }
        ],
        behaviorCount: [
            {
                type: 'lastMonth',
                count: this._currentSummary.incidents.lastMonth.count,
                flag: this._currentSummary.incidents.lastMonth.flag
            },
            {
                type: 'currentAcademicYear',
                count: this._currentSummary.incidents.currentAcademicYear.count,
                flag: this._currentSummary.incidents.currentAcademicYear.flag
            }
        ],
        riskFlag: this._currentSummary.riskFlag
    };

    return this;
};
/**
 *
 * @returns {Attendance}
 * @private
 */
Attendance.prototype._thresholdBehavior = function(){

    var incidents = this._currentSummary.incidents;

    if(incidents.lastMonth.count > 0){
        this._currentSummary.incidents.lastMonth.flag = DANGER;
    }

    if(incidents.currentAcademicYear.count > 0){
        this._currentSummary.incidents.currentAcademicYear.flag = DANGER;
    }

    return this;
};
/**
 *
 * @private
 */
Attendance.prototype._processCourseMerger = function(){
    var me = this;
    me.transcriptTerm = null;
    me.transcriptTermOther = null;
    me.enrollments = me.xsre.json.enrollment ? [me.xsre.json.enrollment] : [];
    me.transcriptFilterMark = [];

    if(me.xsre.json.otherEnrollments && _.isArray(me.xsre.json.otherEnrollments.enrollment)){
        _.each(me.xsre.json.otherEnrollments.enrollment, function(enrollment){
            me.enrollments.push(enrollment);
        });
    }

    if(me.xsre.json) {
        if(me.xsre.json.transcriptTerm) {
            me.transcriptTerm = me.xsre.json.transcriptTerm;
        }

        if(me.xsre.json.otherTranscriptTerms && me.xsre.json.otherTranscriptTerms.transcriptTerm) {
            me.transcriptTermOther = me.xsre.json.otherTranscriptTerms.transcriptTerm;
        }
    }


    var scedId = {};
    var scedSort = [];

    for(var k = 1; k <= 23; k++){
        var nk = k < 10 ? '0'+k : ''+k;
        scedId[nk] = me.xsre.config.scedCourseSubjectAreaCode[nk].definition;
        scedSort.push(me.xsre.config.scedCourseSubjectAreaCode[nk].definition);
    }
    me.subject = [];
    me.history = [];
    me.course = {};
    me.scedId = scedId;
    me.scedSort = scedSort;
    me.scedNotFound = {};
    if(null !== me.transcriptTerm) {
        me.processTranscript(me.transcriptTerm, true);
    }

    if(null !== me.transcriptTermOther) {
        _.each(me.transcriptTermOther, function (transcript) {
            me.processTranscript(transcript, false);
        });

    }
};

/**
 *
 * @returns {Array}
 */
Attendance.prototype._getCourseMerger = function(){

    var me = this;

    me._processCourseMerger();

    _.each(me.course, function(course){

        var courseTranscripts = {};

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
        totalCreditsEarned: isNaN(me.totalCreditsEarned) ? 0 : parseFloat(me.totalCreditsEarned).toFixed(1),
        totalCreditsAttempted: isNaN(me.totalCreditsAttempted) ? 0 : parseFloat(me.totalCreditsAttempted).toFixed(1),
        totalCumulativeGpa: me.academicSummary.cumulativeGpa.toFixed(1),
        gradeLevel: me.gradeLevel,
        academicSummary: me.academicSummary,
        transcriptTerm: { courses: l.get(me.transcriptTerm, 'courses.course', []), school: l.get(me.transcriptTerm, 'school'), schoolYear: l.get(me.transcriptTerm, 'schoolYear', []) },
        info: me.info
    };
};
/**
 *
 * @param transcript
 * @param current
 */
Attendance.prototype.processTranscript = function(transcript, current){

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

    if(!tSchoolName || !tSession || !tSchoolYear){
        return;
    }

    var key = (tSchoolYear + ':' + tSession + ':' + tSchoolName).trim(), info = {
        gradeLevel : transcript.gradeLevel,
        schoolYear : tSchoolYear,
        schoolName : tSchoolName,
        startDate: l.get(transcript, 'session.startDate'),
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
Attendance.prototype.transcriptWithSCED = function(scedAreaCode, key, course, info, current){

    var me = this;

    var uniqueStr = me.scedId[scedAreaCode];

    if (Object.keys(me.course[key].transcripts).indexOf(uniqueStr) === -1) {
        me.course[key].transcripts[uniqueStr] = [];
    }

    if(me.subject.indexOf(uniqueStr) === -1) {
        me.subject.push(uniqueStr);
    }

    var mark = null;
    mark = course.progressMark || course.finalMarkValue;
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

        me.course[key].academicSummary.totalCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
        me.course[key].academicSummary.totalCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);
        me.course[key].academicSummary.termCreditsEarned += isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned);
        me.course[key].academicSummary.termCreditsAttempted += isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted);
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
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted)
    });

};

/**
 *
 * @param event
 * @returns {*}
 */
Attendance.prototype.injectRawSource = function(event){

    return this.extractRawSource(event);

};
/**
 *
 * @param message
 */
Attendance.prototype.print = function(message){

    console.log(require('prettyjson').render(message));

};
/**
 *
 * @returns {number|*}
 */
Attendance.prototype.getMaxDateCalendarTime = function(){
    return this.maxDateCalendar;
};
/**
 *
 * @returns {number|*}
 */
Attendance.prototype.getMinDateCalendarTime = function(){
    return this.minDateCalendar;
};



/**
 *
 * @type {Attendance}
 */
module.exports = Attendance;