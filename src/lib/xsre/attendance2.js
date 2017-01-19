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
 * @param xsre
 * @constructor
 */
function Attendance(xsre){
    this.attendances = xsre.json.attendance || null;
    var generate_year = [];
    var transcriptTerm = null;
    var transcriptCombine = [];
    var generate_calendar = [];
    var generate_calendar_week = [];
    var list_data = get_all_attendance_data(this.attendances.events.event);

    if(xsre.json) {

        if(xsre.json.otherTranscriptTerms && xsre.json.otherTranscriptTerms.transcriptTerm) {
            if(xsre.json.transcriptTerm)
                transcriptTerm = xsre.json.transcriptTerm;

            transcriptCombine = set_sort_and_end_date(xsre.json.otherTranscriptTerms.transcriptTerm, transcriptTerm);
        }

    }

    if(transcriptCombine.length > 0)
    {
        generate_year = get_list_year(transcriptCombine);
        var temp = get_calendar_year_month(transcriptCombine, generate_year, list_data);
        generate_calendar = temp.generate_calendar;
        var get_all_date = temp.get_all_date;
        var get_list_course = get_list_course_data(transcriptCombine);
        generate_calendar_week = get_calendar_week(transcriptCombine, generate_year, list_data);

    }

    this.generate_table = transcriptCombine;
    this.generate_year = generate_year.reverse();
    this.generate_calendar = generate_calendar;
    this.generate_calendar_week = generate_calendar_week;

}

function get_calendar_week(transcriptCombine, generate_year, list_event) {

    var generate_list_week = [];

    transcriptCombine.forEach(function(item, i) {



    });

    return generate_list_week;

}


function get_list_year(transcriptCombine) {
    var generate_year = [];

    transcriptCombine.forEach(function(item, i) {

        var show_year = parseInt(item.schoolYear) - 1;
        var print_show_year = show_year + '-' + item.schoolYear;

        var check_have = generate_year.filter(function(key){
            return parseInt(key.label) === parseInt(print_show_year)
        });
        if(check_have.length <= 0)
        {
            generate_year.push({
                label: print_show_year,
                value: print_show_year
            })
        }
    });

    generate_year.sort(function(a, b) {
        var key1 = a.year;
        var key2 = b.year;

        return key1 - key2;
    });

    return generate_year;
}


function get_calendar_year_month(transcriptCombine, generate_year, list_event) {
    var generate_calendar = [];
    var get_all_date = [];
    var set_date_month, check_have, i;

    transcriptCombine.forEach(function(item, i) {
        if(typeof item.session !== 'undefined') {
            var get_start_date = moment(new Date(item.session.startDate));
            var get_end_date = moment(new Date(item.session.endDate));

            var start_year = parseInt(get_start_date.format('YYYY'));
            var start_month = parseInt(get_start_date.format('MM'));

            var end_year = parseInt(get_end_date.format('YYYY'));
            var end_month = parseInt(get_end_date.format('MM'));

            if(start_year === end_year)
            {
                for(i=start_month; i<=end_month; i++)
                {
                    set_date_month = start_year + '-' + pad(i);
                    check_have = get_all_date.filter(function(key){
                        return key === set_date_month
                    });

                    if(check_have.length <= 0)
                    {
                        get_all_date.push(set_date_month);
                    }
                }
            }
            else {
                for(i=start_month; i<=12; i++)
                {
                    set_date_month = start_year + '-' + pad(i);
                    check_have = get_all_date.filter(function(key){
                        return key === set_date_month
                    });

                    if(check_have.length <= 0)
                    {
                        get_all_date.push(set_date_month);
                    }
                }
                for(i=1; i<=end_month; i++)
                {
                    set_date_month = end_year + '-' + pad(i);
                    check_have = get_all_date.filter(function(key){
                        return key === set_date_month
                    });

                    if(check_have.length <= 0)
                    {
                        get_all_date.push(set_date_month);
                    }
                }
            }

        }
    });

    if(get_all_date.length > 0)
        get_all_date.sort();

    if(generate_year.length > 0)
    {
        generate_year.forEach(function(item) {

            var get_2year = item.value;
            var year_arr = get_2year.split("-");

            generate_calendar.push({
                year: item.value,
                list_months: get_calendar_month(year_arr, get_all_date),
                list_events: get_event_one_year(year_arr, list_event)
            });

        });
    }

    return {
        'generate_calendar': generate_calendar,
        'get_all_date': get_all_date
    };
}

function get_event_one_year(year, list_event) {

    var print_list_event = [];
    var get_event, list_raw_event, check_duplicate_event1, j;

    year.forEach(function (item, i) {

        if(i == 0)
        {
            for(j=9; j<=12; j++)
            {
                get_event = list_event.filter(function(key){ return parseInt(key.year) === parseInt(item) && parseInt(key.month) === parseInt(j) });
                if(get_event.length > 0)
                {
                    list_raw_event = [];
                    get_event.forEach(function(item2) {
                        var temp_event_day = [];
                        if(item2.late_to_class > 0)
                        {
                            temp_event_day.push('late_to_class');
                        }
                        if(item2.missed_class > 0)
                        {
                            temp_event_day.push('missed_class');
                        }
                        if(item2.missed_day > 0)
                        {
                            temp_event_day = [];
                            temp_event_day.push('missed_day');
                        }

                        var temp = {
                            date: item2.full_date,
                            event: temp_event_day,
                            total: temp_event_day.length
                        };

                        // Check same day
                        var check_duplicate = list_raw_event.filter(function(key){ return key.date === item2.full_date });

                        if(check_duplicate.length > 0)
                        {
                            list_raw_event.forEach(function (item3) {
                                if(item3.date === item2.full_date)
                                {
                                    if(item2.missed_day > 0)
                                    {
                                        item3.event = [];
                                        item3.event.push('missed_day');
                                        item3.total = 1;
                                    }
                                    else
                                    {
                                        var check_duplicate_event = item3.event.filter(function(key){ return key === 'missed_day' });
                                        if(check_duplicate_event.length <= 0)
                                        {
                                            if(item2.late_to_class > 0)
                                            {
                                                check_duplicate_event1 = item3.event.filter(function(key){ return key === 'late_to_class' });
                                                if(check_duplicate_event1.length <= 0)
                                                {
                                                    item3.event.push('late_to_class');
                                                    item3.total = item3.event.length;
                                                }
                                            }
                                            if(item2.missed_class > 0)
                                            {
                                                check_duplicate_event1 = item3.event.filter(function(key){ return key === 'missed_class' });
                                                if(check_duplicate_event1.length <= 0)
                                                {
                                                    item3.event.push('missed_class');
                                                    item3.total = item3.event.length;
                                                }
                                            }
                                        }

                                    }
                                }
                            });
                        }
                        else
                        {
                            list_raw_event.push(temp);
                        }

                    });

                    list_raw_event.forEach(function(item2) {
                        print_list_event.push(item2);
                    });

                }
            }
        }
        else {
            for(j=1; j<=8; j++)
            {
                get_event = list_event.filter(function(key){ return parseInt(key.year) === parseInt(item) && parseInt(key.month) === parseInt(j) });
                if(get_event.length > 0)
                {
                    list_raw_event = [];
                    get_event.forEach(function(item2) {
                        var temp_event_day = [];
                        if(item2.late_to_class == 1)
                        {
                            temp_event_day.push('late_to_class');
                        }
                        if(item2.missed_class == 1)
                        {
                            temp_event_day.push('missed_class');
                        }
                        if(item2.missed_day == 1)
                        {
                            temp_event_day = [];
                            temp_event_day.push('missed_day');
                        }

                        var temp = {
                            date: item2.full_date,
                            event: temp_event_day,
                            total: temp_event_day.length
                        };

                        // Check same day
                        var check_duplicate = list_raw_event.filter(function(key){ return key.date === item2.full_date });

                        if(check_duplicate.length > 0)
                        {
                            list_raw_event.forEach(function (item3) {
                                if(item3.date === item2.full_date)
                                {
                                    if(item2.missed_day == 1)
                                    {
                                        item3.event = [];
                                        item3.event.push('missed_day');
                                        item3.total = 1;
                                    }
                                    else
                                    {
                                        var check_duplicate_event = item3.event.filter(function(key){ return key === 'missed_day' });
                                        if(check_duplicate_event.length <= 0)
                                        {
                                            if(item2.late_to_class == 1)
                                            {
                                                check_duplicate_event1 = item3.event.filter(function(key){ return key === 'late_to_class' });
                                                if(check_duplicate_event1.length <= 0)
                                                {
                                                    item3.event.push('late_to_class');
                                                    item3.total = item3.event.length;
                                                }
                                            }
                                            if(item2.missed_class == 1)
                                            {
                                                check_duplicate_event1 = item3.event.filter(function(key){ return key === 'missed_class' });
                                                if(check_duplicate_event1.length <= 0)
                                                {
                                                    item3.event.push('missed_class');
                                                    item3.total = item3.event.length;
                                                }
                                            }
                                        }

                                    }
                                }
                            });
                        }
                        else
                        {
                            list_raw_event.push(temp);
                        }

                    });

                    list_raw_event.forEach(function(item2) {
                        print_list_event.push(item2);
                    });

                }
            }
        }

    });

    return print_list_event;

}

function get_calendar_month(year, list_month) {

    var print_list_month = [];
    var check_month, j;

    year.forEach(function (item, i) {

        if(i == 0)
        {
            for(j=9; j<=12; j++)
            {
                check_month = item + '-' + pad(j);
                if(list_month.indexOf(check_month) > 0) {
                    print_list_month.push({
                        years: item,
                        month: pad(j)
                    })
                }
            }
        }
        else {
            for(j=1; j<=8; j++)
            {
                check_month = item + '-' + pad(j);
                if(list_month.indexOf(check_month) > 0) {
                    print_list_month.push({
                        years: item,
                        month: pad(j)
                    })
                }
            }
        }

    });

    return print_list_month;

}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function set_sort_and_end_date(transcriptTermOther, transcriptTerm) {

    var transcriptCombine = [];
    var get_grade_level = 0;
    var get_session_type = '';
    var get_session_code = 0;
    var get_start_date = new Date();

    transcriptTermOther.sort(function(a, b) {
        if (typeof a.session === 'undefined' || typeof b.session === 'undefined') {
            return 0;
        }

        var key1 = new Date(a.session.startDate);
        var key2 = new Date(b.session.startDate);

        var n = key1 - key2;
        if (n != 0) {
            return n;
        }

        var key3 = 0;
        var key4 = 0;

        switch (a.session.sessionType) {
            case 'FullSchoolYear': key3 = 1; break;
            case 'Semester': key3 = 2; break;
            case 'Quarter': key3 = 3; break;
            default: key3 = 4; break;
        }

        switch (b.session.sessionType) {
            case 'FullSchoolYear': key4 = 1; break;
            case 'Semester': key4 = 2; break;
            case 'Quarter': key4 = 3; break;
            default: key4 = 4; break;
        }

        var n1 = key3 - key4;
        if (n1 != 0) {
            return n1;
        }

        var key5 = parseInt(a.session.sessionCode);
        var key6 = parseInt(b.session.sessionCode);

        return key6 - key5;

    });

    transcriptTermOther.forEach(function(item, i) {
        get_grade_level = parseInt(item.gradeLevel);
        get_session_type = typeof item.session !== 'undefined' ? item.session.sessionType : '';
        get_session_code = typeof item.session !== 'undefined' ? parseInt(item.session.sessionCode) : 0;
        get_start_date = typeof item.session !== 'undefined' ? item.session.startDate : new Date();
        var session = get_range_school(get_session_type, get_session_code, parseInt(item.schoolYear));
        item.session.endDate = session.endDate;
        transcriptCombine.push(item);
    });

    if(transcriptTerm) {
        if(get_grade_level === parseInt(transcriptTerm.gradeLevel)) {

            var session = get_range_school(get_session_type, (get_session_code + 1), parseInt(transcriptTerm.schoolYear));

            transcriptTerm.session = {
                sessionType: get_session_type,
                sessionCode: get_session_code + 1,
                startDate: session.startDate,
                endDate: session.endDate
            }
        }
        else {

            var new_start_date = parseInt(transcriptTerm.schoolYear) - 1;

            transcriptTerm.session = {
                sessionType: 'FullSchoolYear',
                sessionCode: '1',
                startDate: new_start_date + '-09-01',
                endDate: new_start_date + '-08-01'
            }
        }
        transcriptCombine.push(transcriptTerm);
    }

    return transcriptCombine;
}


function get_range_school(session_type, session_code, year) {

    var set_session_type = session_type;
    var set_session_code = parseInt(session_code);
    var set_year = parseInt(year);
    var new_date;
    var get_many_day;
    var end_date;
    var last_year;

    switch(set_session_type) {
        case 'FullSchoolYear':
            last_year = set_year - 1;
            new_date = moment( last_year + '-09-01' );
            get_many_day = moment( set_year + '-08', "YYYY-MM" ).daysInMonth();
            end_date = moment( set_year + '-08-' + get_many_day );
            break;
        case 'Semester':
            if(set_session_code == 1)
            {
                last_year = set_year - 1;
                new_date = moment( last_year + '-09-01' );
                get_many_day = moment( set_year + '-03', "YYYY-MM" ).daysInMonth();
                end_date = moment( set_year + '-03-' + get_many_day );
            }
            else
            {
                new_date = moment( set_year + '-04-01' );
                get_many_day = moment( set_year + '-08', "YYYY-MM" ).daysInMonth();
                end_date = moment( set_year + '-08-' + get_many_day );
            }
            break;
        case 'Quarter':
            if(set_session_code == 1)
            {
                last_year = set_year - 1;
                new_date = moment( last_year + '-09-01' );
                get_many_day = moment( last_year + '-12', "YYYY-MM" ).daysInMonth();
                end_date = moment( last_year + '-12-' + get_many_day );
            }
            else if(set_session_code == 2)
            {
                new_date = moment( set_year + '-01-01' );
                get_many_day = moment( set_year + '-03', "YYYY-MM" ).daysInMonth();
                end_date = moment( set_year + '-03-' + get_many_day );
            }
            else if(set_session_code == 3)
            {
                new_date = moment( set_year + '-04-01' );
                get_many_day = moment( set_year + '-06', "YYYY-MM" ).daysInMonth();
                end_date = moment( set_year + '-06-' + get_many_day );
            }
            else
            {
                new_date = moment( set_year + '-07-01' );
                get_many_day = moment( set_year + '-08', "YYYY-MM" ).daysInMonth();
                end_date = moment( set_year + '-08-' + get_many_day );
            }
            break;
    }

    return {
        sessionType: set_session_type,
        sessionCode: session_code,
        startDate: new_date.format('YYYY-MM-DD'),
        endDate: end_date.format('YYYY-MM-DD')
    }

}


function get_all_attendance_data(events) {

    var list_data = [];

    events.forEach(function(event){

        if(event.attendanceStatus !== "Present")
        {
            var event_date = moment(new Date(event.calendarEventDate));

            var attendance_status = event.attendanceStatus;
            var attendance_event_type = event.attendanceEventType;
            var missed_day = 0;
            var late_to_class = 0;
            var missed_class = 0;
            if(attendance_event_type === 'DailyAttendance')
            {
                //Missed Day
                missed_day = 1;
            }
            else {
                if(attendance_status === 'Tardy')
                {
                    //Late To class
                    late_to_class = 1;
                }
                else {
                    //Missed Class
                    missed_class = 1;
                }
            }

            var temp = {
                full_date: event_date.format("YYYY-MM-DD"),
                year: parseInt(event_date.format("YYYY")),
                month: parseInt(event_date.format("MM")),
                week: parseInt(event_date.format("WW")),
                day: parseInt(event_date.format("DD")),
                school_name: event.school.schoolName,
                calendar_date: event.calendarEventDate,
                attendance_status: event.attendanceStatus,
                attendance_event_type: event.attendanceEventType,
                attendance_value: event.attendanceValue,
                time_table_period: typeof event.timeTablePeriod !== 'undefined' ? event.timeTablePeriod : 0,
                show: 1,
                missed_day: missed_day,
                late_to_class: late_to_class,
                missed_class: missed_class
            };
            list_data.push(temp);
        }

    });

    list_data.sort(function(a, b) {
        var key1 = moment(new Date(a.full_date)).format("X");
        var key2 = moment(new Date(b.full_date)).format("X");
        var key3 = parseInt(a.time_table_period);
        var key4 = parseInt(b.time_table_period);

        var n = key1 - key2;
        if (n != 0) {
            return n;
        }

        return key3 - key4;
    });

    var temp_list_data = [];
    var same_day = '';
    var temp = [];
    var missed_day = 0;
    var late_to_class = 0;
    var missed_class = 0;
    list_data.forEach(function(item) {
        if(same_day === '')
        {
            temp = [];
            same_day = item.full_date;
            temp.push(item);
            if(item.missed_day) {
                missed_day++;
            }
            else if(item.late_to_class) {
                late_to_class++;
            }
            else if(item.missed_class) {
                missed_class++;
            }
        }

        if(same_day === item.full_date)
        {
            temp.push(item);
            if(item.missed_day) {
                missed_day++;
            }
            else if(item.late_to_class) {
                late_to_class++;
            }
            else if(item.missed_class) {
                missed_class++;
            }
        }
        else {

            if(missed_day > 1) {
                missed_day = 1;
                late_to_class = 0;
                missed_class = 0;
            }

            var moment_date = moment(same_day);
            temp_list_data.push({
                attendance: temp,
                full_date: moment_date.format("YYYY-MM-DD"),
                year: parseInt(moment_date.format("YYYY")),
                month: parseInt(moment_date.format("MM")),
                week: parseInt(moment_date.format("WW")),
                day: parseInt(moment_date.format("DD")),
                missed_day: missed_day,
                late_to_class: late_to_class,
                missed_class: missed_class
            });
            same_day = item.full_date;
            temp = [];
            missed_day = 0;
            late_to_class = 0;
            missed_class = 0;
            temp.push(item);
            if(item.missed_day) {
                missed_day++;
            }
            else if(item.late_to_class) {
                late_to_class++;
            }
            else if(item.missed_class) {
                missed_class++;
            }
        }

    });

    if(temp.length > 0)
    {
        if(missed_day > 1) {
            missed_day = 1;
            late_to_class = 0;
            missed_class = 0;
        }

        var moment_date = moment(same_day);
        temp_list_data.push({
            attendance: temp,
            full_date: moment_date.format("YYYY-MM-DD"),
            year: parseInt(moment_date.format("YYYY")),
            month: parseInt(moment_date.format("MM")),
            week: parseInt(moment_date.format("WW")),
            day: parseInt(moment_date.format("DD")),
            missed_day: missed_day,
            late_to_class: late_to_class,
            missed_class: missed_class
        });
    }

    return temp_list_data;

}


function get_list_course_data(transcriptCombine) {

    var list_course = [];
    transcriptCombine.forEach(function(item) {
        if(typeof item.session !== 'undefined')
        {
            var get_start_date = moment(new Date(item.session.startDate));
            var get_end_date = moment(new Date(item.session.endDate));
            list_course.push({
                course: item.courses.course,
                start_date: get_start_date.format("YYYY-MM-DD"),
                start_year: get_start_date.format("YYYY"),
                start_month: get_start_date.format("MM"),
                // start_week: get_start_date.isoWeek(),
                // start_week_start: moment(new Date(get_start_date.format("YYYY") + '-01-01')).isoWeek(),
                // start_week_end: moment(new Date(get_start_date.format("YYYY") + '-12-31')).isoWeek(),
                start_day: get_end_date.format("DD"),
                end_date: get_end_date.format("YYYY-MM-DD"),
                end_year: get_end_date.format("YYYY"),
                end_month: get_end_date.format("MM"),
                // end_week: get_end_date.isoWeek(),
                // end_week_start: moment(new Date(get_end_date.format("YYYY") + '-01-01')).isoWeek(),
                // end_week_end: moment(new Date(get_end_date.format("YYYY") + '-12-31')).isoWeek(),
                end_day: get_end_date.format("DD")
            });

        }

    });

    console.log(list_course);

    return list_course;

}


/**
 *
 * @returns {*}
 */
Attendance.prototype.getAttendances = function() {

    var me = this;
    return me.generate_table;

};

Attendance.prototype.getGenerateCalendar = function() {
    return this.generate_calendar;
};

Attendance.prototype.getGenerateCalendarWeek = function() {
    return this.generate_calendar_week;
};

Attendance.prototype.getGenerateYear = function() {
    return this.generate_year;
};


/**
 *
 * @type {Attendance}
 */
module.exports = Attendance;