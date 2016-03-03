'use strict';
/**
 * Created by zaenal on 21/08/15.
 */
var moment = require('moment');
var _ = require('underscore');

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
            { name: 'F', value: me.notAvailable, date: me.notAvailable, periods: [] }
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
                F: []
            },
            legend: {
                present: [],
                excused: [],
                tardy: [],
                other: [],
                unexcused: []
            },
            weeklyChange: me.notAvailable,
            raw: {}
        };

        var calendar = {
            title: behavior.weekDate,
            M: me.notAvailable,
            T: me.notAvailable,
            W: me.notAvailable,
            TH: me.notAvailable,
            F: me.notAvailable,
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
                'F'
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

            //if(s.periods.length > 0) {
            //
            //    s.periods.forEach(function(p){
            //
            //        if(p.period !== me.notAvailable && periodsColumns.indexOf(p.period) === -1){
            //
            //            periodsColumns.push(p.period);
            //
            //        }
            //
            //    });
            //
            //}

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
                F: { value: me.notAvailable, event: null, slug: '' }
            }, title = null;


            ['M', 'T', 'W', 'TH', 'F'].forEach(function(column){

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
            weeklyChange: []
        };

        for(var c = 0; c < columns.length; c++){

            //if(columns[c].M.value === me.notAvailable && !columns[c].M.event && columns[c].T.value === me.notAvailable && !columns[c].T.event && columns[c].W.value === me.notAvailable && !columns[c].W.event && columns[c].TH.value === me.notAvailable && !columns[c].TH.event && columns[c].F.value === me.notAvailable && !columns[c].F.event){
            //    continue;
            //}

            behavior.periods.push(columns[c].title);
            behavior.detailColumns.periods.push(columns[c].title);
            behavior.detailColumns.M.push(columns[c].M);
            behavior.detailColumns.T.push(columns[c].T);
            behavior.detailColumns.W.push(columns[c].W);
            behavior.detailColumns.TH.push(columns[c].TH);
            behavior.detailColumns.F.push(columns[c].F);
            behavior.detailColumns.weeklyChange.push(columns[c].weeklyChange);

        }


        behavior.raw.weeklyChange = weeklyChange;

        behavior.raw.lastWeeklyChange = lastWeeklyChange;

        if(lastWeeklyChange !== me.notAvailable && lastWeeklyChange > 0 && !isNaN(weeklyChange)){

            behavior.weeklyChange = weeklyChange - lastWeeklyChange;

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

    return this.calculateSummary().attendance;

};
/**
 *
 * @returns {number}
 */
Attendance.prototype.getCurrentTotalBehavior = function(){

    return this.calculateSummary().behavior;

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

    var attendance = 0;

    var lastMonthAttendance = 0;

    me.currentSummary = {
        attendance: {
            flag: OK,
            absents: {
                attendanceAcademicYear: 0,
                lastMontAttendance: 0
            },
            notes: {
                title: "",
                items: []
            }
        },
        behavior: 0
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

        lastMonth = maxDate.month();

        //console.log('LAST MONTH: ', lastMonth);

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

                            attendance++;

                            if(mm.month() === lastMonth){

                                //console.log('2- CURR MONTH: ', mm.month());
                                lastMonthAttendance++;

                            }

                        }



                    }

                }

            }

        });

    }
    //console.log((function(s){var t={};Object.keys(s).sort().reverse().forEach(function(k){t[k]=s[k]});return t;})(c));
    //console.log(me.academicStart.format('YYYY-MM-DD'), me.academicEnd.format('YYYY-MM-DD'), c);

    if(_.isObject(me.disciplineIncidents) && !_.isUndefined(me.disciplineIncidents.disciplineIncident)){

        var n = [];

        if(!_.isArray(me.disciplineIncidents.disciplineIncident)){

            me.disciplineIncidents.disciplineIncident = [me.disciplineIncidents.disciplineIncident];

        }

        me.disciplineIncidents.disciplineIncident.forEach(function(discipline){

            mm = moment(new Date(discipline.incidentDate));

            discipline.incidentDateTime = mm.valueOf();

            var passed = true;

            if(me.academicStart && me.academicEnd){

                passed = (discipline.incidentDateTime >= me.academicStart && discipline.incidentDateTime <= me.academicEnd);

            }

            if(passed && mm.isValid()){

                var m = mm.format('YYYY-MM-DD');

                if(n.indexOf(m) === -1){

                    n.push(m);

                    me.currentSummary.behavior++;

                }

            }

        });

    }

    /**
     * Calculate Rules
     */

    me.currentSummary.attendance.absents.attendanceAcademicYear = attendance;
    me.currentSummary.attendance.absents.lastMontAttendance = lastMonthAttendance;

    return me._thresholdAcademic();

};
/**
 *
 * @returns {Attendance}
 * @private
 * @todo Rules:
 *
 * OR RULES
 *
 * 1st Threshold:
 * · WARNING: 2 - 4 Missed days within the last month of the most latest date we have the student data on XSRE
 * . DANGER: More than 4 missed days within the last month of the most latest date we have the student data on XSRE

 * 2nd Threshold:
 * . WARNING: In the current academic year have 6–19 missed days
 * . DANGER: In the current academic year have more than 19 missed days.

 * SAMPLE CASE 1:
 * - Student missed 6 days in the last month
 * - Student missed 6 days in the current academic year
 * Flag: DANGER

 * SAMPLE CASE 2:
 * - Student missed 0 days in the last month
 * - Student missed 7 days in the current academic year
 * flag: WARNING

 * SAMPLE CASE 3:
 * - Student missed 0 days in the last month
 * - Student missed 0 days in the current academic year
 * flag: OK
 */
Attendance.prototype._threshold = function(){

    var error1 = OK;
    var error2 = OK;
    var absents = this.currentSummary.attendance.absents;
    var totalAlerts = 0;

    if(absents.lastMontAttendance >= 2 && absents.lastMontAttendance <= 6){
        error1 = WARNING;
        totalAlerts++;
    } else if(absents.lastMontAttendance >= 4){
        error1 = DANGER;
        totalAlerts++;
    }

    if(absents.attendanceAcademicYear >= 6 && absents.attendanceAcademicYear <= 19){
        error2 = WARNING;
        totalAlerts++;
    } else if(absents.attendanceAcademicYear >= 19){
        error2 = DANGER;
        totalAlerts++;
    }

    if(error1 === WARNING && error2 === WARNING){
        this.currentSummary.attendance.flag = WARNING;
    } else if(error1 === DANGER || error2 === DANGER){
        this.currentSummary.attendance.flag = DANGER;
    }

    if(this.currentSummary.attendance.flag !== OK && totalAlerts > 0){
        this.currentSummary.attendance.notes.title = 'This student has ' + totalAlerts + ' attendance alert' + (totalAlerts > 1 ? 's' : '') + ' because:';
        if(error1 !== OK){
            this.currentSummary.attendance.notes.items.push('Student has missed more than 2 days in the latest month of which we have data.');
        }
        if(error2 !== OK){
            this.currentSummary.attendance.notes.items.push('Student has missed more than 30 days in the current academic year.');
        }
    }

    return this.currentSummary;
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

    var error1 = SUCCESS;
    var error2 = SUCCESS;
    var absents = this.currentSummary.attendance.absents;
    var totalAlerts = 0;

    if(absents.lastMontAttendance >= 2 && absents.lastMontAttendance <= 6){
        error1 = WARNING;
        totalAlerts++;
    } else if(absents.lastMontAttendance >= 4){
        error1 = DANGER;
        totalAlerts++;
    }

    if(absents.attendanceAcademicYear >= 6 && absents.attendanceAcademicYear <= 19){
        error2 = WARNING;
        totalAlerts++;
    } else if(absents.attendanceAcademicYear >= 19){
        error2 = DANGER;
        totalAlerts++;
    }

    this.currentSummary.attendance.flag = error2;

    this.currentSummary.attendance.notes.title = null;
    var days = '';
    if(error1 !== SUCCESS){
        days = 'day';
        if(absents.lastMontAttendance > 1){
            days += 's';
        }
        this.currentSummary.attendance.notes.items.push('Student has missed '+absents.lastMontAttendance+' '+ days +' in the latest month of which we have data.');
    }
    if(error2 !== SUCCESS){
        days = 'day';
        if(absents.attendanceAcademicYear > 1){
            days += 's';
        }
        this.currentSummary.attendance.notes.items.push('Student has missed '+absents.attendanceAcademicYear+' '+ days +' in the current academic year.');
    }

    return this.currentSummary;
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
 * @type {Attendance}
 */
module.exports = Attendance;