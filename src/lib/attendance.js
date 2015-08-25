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
    return self.day() == 0 ? 6 : self.day()-1;
};
/**
 *
 * @returns {*}
 */
moment.fn.weekISO = function () {
    var self = this.clone();
    return self.day() == 0 ? self.format('w')-1 : self.format('w');
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
    }
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
            daysOfWeek: daysOfWeek.toObject(),
            //start: dt,
            //end: end
        };
    }
    result.push(_weekFormat(from));
    while (from.diff(to, 'weeks')) {
        result.push(_weekFormat(from.add(1, 'weeks')));
    }
    return result;
};
/**
 *
 * @param results
 * @constructor
 */
function Attendance(results){
    this.attendances = results.attendance || null;
    this.allEvents = {};
    this.minDateCalendar = 0;
    this.maxDateCalendar = 0;
    this.attendanceBehaviors = [];
    this.allDates = [];
    this.weeks = [];

    this.notAvailable = 'N/A';

    this.facets = {
        13297: 'Disciplinary action, not receiving instruction',
        13299: 'Family activity',
        13296: 'Family emergency or bereavement',
        13295: 'Illness, injury, health treatment, or examination',
        13298: 'Legal or judicial requirement',
        13293: 'Noninstructional activity recognized by state or school',
        13294: 'Religious observation',
        13303: 'Situation unknown',
        13300: 'Student employment',
        13302: 'Student is skipping school',
        13301: 'Transportation not available',

        /**
         * Present
         */
        13290: 'Disciplinary action, receiving instruction',
        13288: 'In school, regular instructional program',
        13289: 'Nontraditional school setting, regular instructional program',
        13291: 'Out of school, regular instructional program activity',
        13292: 'Out of school, school-approved extracurricular or cocurricular activity',

        /**
         * DailyAttendance
         */
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
}
/**
 *
 * @returns {*}
 */
Attendance.prototype.getBehaviors = function(){

    var me = this;

    if(!me.attendances) return attendanceBehaviors;

    var mm = null;

    me.attendances.events.event.forEach(function(event){

        mm = moment(new Date(event.calendarEventDate));

        if(mm.isValid()) {

            event.calendarEventDateTime = mm.valueOf();

            var obj = {};

           obj = {
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

            if('absentAttendanceCategory' in event) {

               obj.absentAttendanceCategory = parseInt(event.absentAttendanceCategory);

               obj.absentAttendanceCategoryTitle =obj.absentAttendanceCategory in me.facets ? me.facets[obj.absentAttendanceCategory] : '';

            }

            if('timeTablePeriod' in event) {

                obj.timeTablePeriod = parseInt(event.timeTablePeriod);

            }

            if('presentAttendanceCategory' in event) {

               obj.presentAttendanceCategory = parseInt(event.presentAttendanceCategory);

               obj.presentAttendanceCategoryTitle =obj.presentAttendanceCategory in me.facets ? me.facets[obj.presentAttendanceCategory] : '';

            }

            if('attendanceEventType' in event) {

               obj.attendanceEventType = event.attendanceEventType;

               obj.attendanceEventTypeTitle = event.attendanceEventType in me.facets ? me.facets[event.attendanceEventType] : '';
            }

            if('dailyAttendanceStatus' in event) {

               obj.attendanceStatus = event.dailyAttendanceStatus;

               obj.attendanceStatusTitle = event.dailyAttendanceStatus in me.facets ? me.facets[event.dailyAttendanceStatus] : '';

            }

            event.calendarEventDate = mm.format('MM-DD-YYYY');

            delete event.school;

            if(me.allDates.indexOf(event.calendarEventDate) === -1) me.allDates.push(event.calendarEventDateTime);

            if(Object.keys(me.allEvents).indexOf(event.calendarEventDate) === -1) me.allEvents[event.calendarEventDate] = [];

            me.allEvents[event.calendarEventDate].push(obj);

        }

    });

    me.minDateCalendar = _.min(me.allDates);

    me.maxDateCalendar = _.max(me.allDates);

    me.weeks = moment(me.minDateCalendar).weeksTo(moment(me.maxDateCalendar), 'MM/DD/YYYY');


    var behavior = {};

    var summary = {};

    var maxDay = 5;

    var lastWeeklyChange = 100;

    var weeklyChange = 0;

    me.weeks.forEach(function(week){

        var ikey = week.startString + ' - ' + week.endString;

        weeklyChange = 0;

        var maxPeriod = 1;

        summary = [
            { name: 'M', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'T', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'W', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'TH', value: me.notAvailable, date: me.notAvailable, periods: [] },
            { name: 'F', value: me.notAvailable, date: me.notAvailable, periods: [] }
        ];

        behavior = {
            weekDate: ikey,
            summary: {
                title: behavior.weekDate,
                M: me.notAvailable,
                T: me.notAvailable,
                W: me.notAvailable,
                TH: me.notAvailable,
                F: me.notAvailable,
                weeklyChange: me.notAvailable
            },
            details: [],
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

            //console.log(dayString, nday, behavior.summary[nday], behavior.summary[nday] === undefined); return;

            if(summary[nday] === undefined) return;

            summary[nday].date = dayString;

            calendar[summary[nday].name] = dayString;

            var allEvents = otherFormat in me.allEvents ? me.allEvents[otherFormat] : [];

            var isDailySet = false;

            allEvents.forEach(function(e){
                if(e.attendanceEventType === 'DailyAttendance' && !isDailySet) {
                    isDailySet = true;
                }
            });

            if(isDailySet){

                me.calculateDailyAttendance(behavior, allEvents, nday, day, summary);

            } else {

                me.calculateClassSectionAttendance(behavior, allEvents, nday, day, summary);

            }

        });

        var columns = [];


        var collects = {};

        summary.forEach(function(s){

            collects[s.name] = s;

            if(s.name in behavior.summary && !isNaN(s.value)){

                behavior.summary[s.name] = s.value + '%';

            }

            if(maxPeriod < s.periods.length) {

                maxPeriod = s.periods.length;

            }

            if(s.value !== me.notAvailable){

                weeklyChange += parseFloat(s.value);

            }

        });

        behavior.raw.collects = collects;

        columns.push(calendar);

        for(var p = 0; p < maxPeriod; p++){

            var b = {
                title: me.notAvailable,
                M: me.notAvailable,
                T: me.notAvailable,
                W: me.notAvailable,
                TH: me.notAvailable,
                F: me.notAvailable
            }, title = null;


            ['M', 'T', 'W', 'TH', 'F'].forEach(function(column){

                var period = {};

                if((column in collects) && !_.isEmpty(collects[column].periods[p])){

                    period = collects[column].periods[p];

                    b[column] = { value: period.value, event: period.event };

                    if(period.period !== me.notAvailable) title = period.period;

                }


            });

            if(b.title === me.notAvailable && title){

                b.title = 'Period ' + title;

            }

            columns.push(b);

        }

        behavior.details = columns;

        behavior.raw.weeklyChange = weeklyChange;

        if(weeklyChange === null) weeklyChange = me.notAvailable;

        if(!isNaN(weeklyChange)) {

            weeklyChange = ((weeklyChange / maxDay) * 100).toFixed(2);

        }

        behavior.raw.lastWeeklyChange = lastWeeklyChange;

        if(lastWeeklyChange !== me.notAvailable && lastWeeklyChange > 0 && !isNaN(weeklyChange)){

            behavior.weeklyChange = (weeklyChange / lastWeeklyChange);

        } else {

            behavior.weeklyChange = weeklyChange;

        }

        if(behavior.weeklyChange === null) behavior.weeklyChange = me.notAvailable;

        lastWeeklyChange = behavior.weeklyChange;

        behavior.summary.weeklyChange = lastWeeklyChange;

        delete behavior.raw;

        var behaviors = {};

        behaviors[ikey] = behavior;

        me.attendanceBehaviors.push(behaviors);

    });

    me.attendanceBehaviors.reverse();

    return me.attendanceBehaviors;

};
Attendance.prototype.calculateDailyAttendance = function(behavior, events, n, day, summary){
    var me = this;
    var e = events[0];
    if(e.attendanceStatus.toLowerCase() === 'present'){
        summary[n].value = parseFloat(e.attendanceValue).toFixed(2);
    } else {
        summary[n].value = ((1 - parseFloat(e.attendanceValue)) * 100).toFixed(2);
    }
    summary[n].periods.push({
        period: e.timeTablePeriod ? e.timeTablePeriod : me.notAvailable, value: e.attendanceStatus, event: e
    });

};

Attendance.prototype.calculateClassSectionAttendance = function(behavior, events, n, day, summary){
    var me = this;
    var value = 0;
    events.forEach(function(e){
        if('timeTablePeriod' in e && e.timeTablePeriod){
            summary[n].periods.push({
                period: e.timeTablePeriod, value: e.attendanceStatus, event: e
            });
            value += parseFloat(e.attendanceValue);
        }
    });

    if(summary[n].periods.length < 6){
        for(var i = summary[n].periods.length; i <= 6; i++){
            summary[n].periods.push({
                period: me.notAvailable, value: me.notAvailable, event: null
            })
        }
    }
    if(summary[n].periods.length > 0){
        summary[n].value = value.toFixed(2);
    }

};
/**
 *
 * @param message
 */
Attendance.prototype.print = function(message){
    console.log(require('prettyjson').render(message));
}

/**
 *
 * @type {Attendance}
 */
module.exports = Attendance;