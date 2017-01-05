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
/*
    var total = 0;
    var total_not_present = 0;
    var start_date = '';
    var end_date = '';
    var list_data = [];
    var list_year = [];

    this.attendances.events.event.forEach(function(event){

        if(event.attendanceStatus !== "Present")
        {
            total_not_present++;

            var matchingYears = list_year.filter(function(key){ return key.year === new_date.getFullYear() });
            if(matchingYears.length <= 0)
            {
                var year = {
                    year: new_date.getFullYear(),
                    data: {
                        semester: [],
                        quarter: [],
                        term: [],
                        unknown: []
                    }
                };
                list_year.push(year);
            }

            var matchingMonths = list_data.filter(function(key){ return key.month === new_date.getMonth()+1 });
            if(matchingMonths.length <= 0)
            {
                var temp_data = {
                    schoolName: event.school.schoolName,
                    courseTitle: '',
                    teacherName: [],
                    creditsAttempted: '',
                    creditsEarned: '',
                    gradeLevel: '',
                    leaCourseId: '',
                    scedCourseSubjectAreaCode: '',
                    scedCourseSubjectAreaDescription: '',
                    timeTablePeriod: event.timeTablePeriod || 0,
                    attendanceEventType: event.attendanceEventType,
                    attendanceStatus: event.attendanceStatus,
                    attendanceValue: event.attendanceValue,
                    attendanceCategory: event.absentAttendanceCategory,
                    show: 1
                };

                var get_date = moment(new_date);

                var temp_list = {
                    fullDate: get_date.format('YYYY-MM-DD'),
                    year: new_date.getFullYear(),
                    month: new_date.getMonth()+1,
                    day: new_date.getDate(),
                    day2: new_date.getDay(),
                    week: get_date.format('W'),
                    data: temp_data,
                    raw: event
                };
                list_data.push(temp_list);
            }

        }

        total++;

    });

    list_year.sort(function(a, b) {
        return a.year - b.year;
    });

    list_data.sort(function(a, b) {
        var key1 = new Date(a.fullDate);
        var key2 = new Date(b.fullDate);

        if (key1 < key2) {
            return -1;
        } else if (key1 == key2) {
            return 0;
        } else {
            return 1;
        }
    });*/


    // console.log(total);
    // console.log(total_not_present);
    // console.log(start_date);
    // console.log(end_date);
    // console.log(list_data);
    //console.log(list_year);



    var transcriptTerm = null;
    var transcriptTermOther = null;
    var transcriptCombine = [];
    var list_year = [];

    if(xsre.json) {
        if(xsre.json.otherTranscriptTerms && xsre.json.otherTranscriptTerms.transcriptTerm) {
            transcriptTermOther = xsre.json.otherTranscriptTerms.transcriptTerm;

            transcriptTermOther.sort(function(a, b) {
                if (typeof a.session === 'undefined' || typeof b.session === 'undefined') {
                    return 0;
                }
                var key1 = new Date(a.session.startDate);
                var key2 = new Date(b.session.startDate);

                if (key1 < key2) {
                    return -1;
                } else if (key1 == key2) {
                    return 0;
                } else {
                    return 1;
                }
            });

            transcriptTermOther.forEach(function(item, i) {
                transcriptCombine.push(item);
            });
        }

        // if(xsre.json.transcriptTerm) {
        //     transcriptTerm = xsre.json.transcriptTerm;
        //     transcriptCombine.push(transcriptTerm);
        // }
    }

    var year_now = '';
    transcriptCombine.forEach(function(item) {
        if(typeof item.session !== 'undefined')
        {
            var get_date_item = moment(new Date(item.session.startDate));
            var get_year_item = get_date_item.format('YYYY');
            var get_month_item = get_date_item.format('MM');
            var get_day_item = get_date_item.format('DD');
            if(year_now !== get_year_item)
            {
                year_now = get_year_item;
                list_year.push({
                    year: get_year_item,
                    month: get_month_item,
                    day: get_day_item
                });
            }
        }
    });

    var first = true;
    var first_year = 0;
    var first_month = 0;
    var last_year = 0;
    var last_month = 0;
    list_year.forEach(function(item) {
        if(first)
        {
            first = false;
            first_year = item.year;
            first_month = item.month;
        }
        last_year = item.year;
        last_month = item.month;
    });

    var generate_year = [];
    var generate_month = [];

    for(var i=first_year; i<=last_year; i++)
    {
        if(i == first_year) {
            generate_month = set_generate_month(i, first_month, 12);
        }
        else if (i == last_year) {
            generate_month = set_generate_month(i, 1, last_month);
        }
        else {
            generate_month = set_generate_month(i, 1, 12);
        }

        generate_year.push({
            year: parseInt(i),
            month: generate_month,
            data: []
        })

    }


    this.disciplineIncidents = xsre.json.disciplineIncidents || { disciplineIncident: [] };

    this.abcd = generate_year;
    this.xsre = xsre;

    this.notAvailable = 'N/A';
    //this.notAvailable = '';
}

function set_generate_month(year, start_month, end_month) {
    var generate_month = [];
    for(var i=start_month; i<=end_month; i++) {
        generate_month.push({
            month: parseInt(i),
            week: set_generate_week(year, i),
            data: []
        });
    }

    return generate_month;

}

function set_generate_week(year, month) {
    var generate_week = [];
    var get_many_day = moment(year+'-'+month, "YYYY-MM").daysInMonth();
    var get_moment = 0;
    var get_week_number = 0;
    var check_last_day_number = moment(year+'-'+month+'-'+get_many_day, "YYYY-MM-DD");
    var start_date = 0;
    var end_date = 0;
    for(var i=1; i<=get_many_day; i++)
    {
        get_moment = moment(year+'-'+month+'-'+i, "YYYY-MM-DD");
        get_week_number = get_moment.isoWeek();
        start_date = get_moment.startOf('isoWeek').format("YYYY-MM-DD");
        end_date = get_moment.endOf('isoWeek').format("YYYY-MM-DD");
        generate_week.push({
            week: parseInt(get_week_number),
            day: set_generate_day(start_date, end_date),
            data: []
        });

        i += 6;
    }

    if(check_last_day_number.isoWeek() > get_week_number)
    {
        start_date = check_last_day_number.startOf('isoWeek').format("YYYY-MM-DD");
        end_date = check_last_day_number.endOf('isoWeek').format("YYYY-MM-DD");
        generate_week.push({
            week: parseInt(check_last_day_number.isoWeek()),
            day: set_generate_day(start_date, end_date),
            data: []
        });
    }


    return generate_week;

}

function set_generate_day(start_date, end_date) {
    var generate_day = [];
    start_date = moment(start_date);
    end_date = moment(end_date);
    var get_first_month = start_date.format('MM');
    var get_last_month = end_date.format('MM');
    var i = 0;
    var get_start_day = parseInt(start_date.format("DD"));
    var get_end_day = parseInt(end_date.format("DD"));
    if(get_first_month == get_last_month)
    {
        for(i=get_start_day; i<=get_end_day; i++)
        {
            generate_day.push({
                day: parseInt(i),
                data: []
            });
        }
    }
    else {
        var get_many_day = start_date.daysInMonth();
        for(i=get_start_day; i<=get_many_day; i++)
        {
            generate_day.push({
                day: parseInt(i),
                data: []
            });
        }
        for(i=1; i<=get_end_day; i++)
        {
            generate_day.push({
                day: parseInt(i),
                data: []
            });
        }
    }

    return generate_day;
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
    return me.abcd;

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

    me._processCourseMerger();

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
            courses: [null, [], [], [], [], [], [], []],
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

            if(s.periods.length > 0){

                s.periods.forEach(function (p) {

                    if(_.isArray(behavior.courses[p.period])) {

                        p.courses.forEach(function(pc){

                            behavior.courses[p.period].push(pc);

                        });

                        behavior.listCourse = p.listCourse;

                    }

                });

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
                M: { value: me.notAvailable, event: null, slug: '', courses: [] },
                T: { value: me.notAvailable, event: null, slug: '', courses: [] },
                W: { value: me.notAvailable, event: null, slug: '', courses: [] },
                TH: { value: me.notAvailable, event: null, slug: '', courses: [] },
                F: { value: me.notAvailable, event: null, slug: '', courses: [] },
                SA: { value: me.notAvailable, event: null, slug: '', courses: [] },
                S: { value: me.notAvailable, event: null, slug: '', courses: [] }
            }, title = null;


            ['M', 'T', 'W', 'TH', 'F', 'SA', 'S'].forEach(function(column){

                if((column in collects) && !_.isEmpty(collects[column].periods)){

                    collects[column].periods.forEach(function(period){

                        if(p === period.period) {

                            b[column] = {value: period.value, event: period.event, slug: period.slug, courses: period.courses};

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

    events.forEach(function(e){

        if('timeTablePeriod' in e && e.timeTablePeriod){

            var mm = moment(e.calendarEventDate).valueOf();
            var courses = [];

            var course = [];
            for(var i = 0; i < me.course.length; i++){
                var c = me.course[i];
                if(mm >= c.startTime && mm <= c.endTime){
                    course.push(c.c);
                }
            }

            if(_.isArray(course)) {
                _.each(course, function (cr) {
                    _.each(cr.courses, function(c){
                        if(parseInt(c.timeTablePeriod) === parseInt(e.timeTablePeriod)){
                            courses.push(c);
                        }
                    });
                });
            }

            // if(courses.length >  0) {
            //     me.print('Attendance Date: ' + e.calendarEventDate);
            //     me.print(courses);
            // }

            var list_course = [];
            var temp_list_course = course;
            temp_list_course.forEach(function(item) {
                var temp = {
                    // gradeLevel: item.gradeLevel,
                    // schoolName: item.schoolName,
                    // schoolYear: item.schoolYear,
                    // session: item.session,
                    // sessionDate: item.sessionDate,
                    // startDate: item.startDate,
                    // startDateTime: item.startDateTime,
                    courses: item.courses
                };
                list_course.push(temp);
            });

            summary[n].periods.push({
                period: e.timeTablePeriod, value: e.attendanceStatus, event: e, slug: me.slug(e.attendanceStatus), courses: courses, listCourse: list_course
            });

            if(e.attendanceStatus){
                legend[e.attendanceStatus.toLowerCase()].push(e);
            }

        }

    });

    if(summary[n].periods.length < 6){

        for(var i = summary[n].periods.length; i <= 6; i++){

            summary[n].periods.push({
                period: me.notAvailable, value: me.notAvailable, event: null, slug: '', courses: [], listCourse: []
            });

        }

    }

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
    me.transcriptFilterMark = [];

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
    me.course = {};
    me.scedId = scedId;
    me.scedSort = scedSort;
    me.scedNotFound = {};
    if(null !== me.transcriptTerm) {
        me._processTranscript(me.transcriptTerm, true);
    }

    if(null !== me.transcriptTermOther) {
        _.each(me.transcriptTermOther, function (transcript) {
            me._processTranscript(transcript, false);
        });
    }

    me.course = _.sortBy(me.course, function(o){
        return o.startDateTime/* * -1*/;
    });

    var newTime = [];

    _.each(me.course, function (c, i) {
        var end = null;
        var start = moment(c.startDate);
        var addMonth = start.month() + 2;
        if(c.session.indexOf('Quarter') !== -1){
            end = start.clone().month(addMonth).endOf('month');
        } else if(c.session.indexOf('Semester') !== -1){
            addMonth = start.month() + 5;
            end = start.clone().month(addMonth).endOf('month');
        }
        newTime.push({
           session: c.session,
           start: start,
           startTime: start.valueOf(),
           end: end,
           endTime: end.valueOf(),
           c: c
        });
    });
    me.course = newTime;
};
/**
 *
 * @returns {Array}
 */
Attendance.prototype.getCourse = function(){
    return this._getCourseMerger();
};

/**
 *
 * @returns {Array}
 */
Attendance.prototype._getCourseMerger = function(){

    var me = this;
    me._processCourseMerger();
    return me.course;
};
/**
 *
 * @param transcript
 * @param current
 */
Attendance.prototype._processTranscript = function(transcript, current){

    var me = this;

    if(!_.isObject(transcript.courses)){
        return;
    }

    var tSchoolYear = l.get(transcript, 'schoolYear');
    var tSession = l.get(transcript, 'session.description');
    var tSchoolName = l.get(transcript, 'school.schoolName');
    var tSessionDate = l.get(transcript, 'session.startDate');

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

    if(!tSchoolName || !tSession || !tSchoolYear || !tSessionDate){
        return;
    }

    var key = (tSessionDate).trim(), info = {
        gradeLevel : transcript.gradeLevel,
        schoolYear : tSchoolYear,
        schoolName : tSchoolName,
        startDate: l.get(transcript, 'session.startDate'),
        startDateTime: 0,
        session: tSession,
        sessionDate: tSessionDate,
        courses: [],
        academicSummary: academicSummary
    };

    if(info.startDate){
        info.startDateTime = new Date(info.startDate).getTime();
    } else {
        info.startDate = info.tSchoolYear;
        info.startDateTime = new Date(info.startDate).getTime();
    }

    key = info.startDateTime;

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

        if(!course.timeTablePeriod){
            return;
        }

        var uniqueId = course.scedCourseSubjectAreaCode;
        if(uniqueId in me.scedId) {
            me._transcriptWithSCED(uniqueId, key, course, info, current);
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
Attendance.prototype._transcriptWithSCED = function(scedAreaCode, key, course, info, current){

    var me = this;
    var uniqueStr = me.scedId[scedAreaCode];
    var teacherNames = [];
    if('psesd:teacherNames' in course){
        teacherNames = course['psesd:teacherNames'].split(', ');
    } else if('teacherNames' in course) {
        teacherNames = course['teacherNames'].split(', ');
    }
    me.course[key].courses.push({
        scedCourseSubjectAreaCode: scedAreaCode,
        scedCourseSubjectAreaDescription: uniqueStr,
        leaCourseId: course.leaCourseId,
        courseTitle: course.courseTitle || me.notAvailable,
        timeTablePeriod: parseInt(course.timeTablePeriod) || me.notAvailable,
        gradeLevel: info.gradeLevel || me.notAvailable,
        creditsEarned: isNaN(course.creditsEarned) ? 0 : parseFloat(course.creditsEarned),
        creditsAttempted: isNaN(course.creditsAttempted) ? 0 : parseFloat(course.creditsAttempted),
        teacherNames: teacherNames
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