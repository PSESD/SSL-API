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
        generate_calendar_week = get_calendar_week(list_data, get_list_course, get_all_date);

    }

    this.generate_table = transcriptCombine;
    this.generate_year = generate_year.reverse();
    this.generate_calendar = generate_calendar;
    this.generate_calendar_week = generate_calendar_week;

}

function get_calendar_week(list_event, list_course, all_date) {

    var generate_list_week = [];

    all_date.forEach(function (item) {

        var date = moment(item, "YYYY-MM");

        generate_list_week.push({
            name: date.format('MMMM YYYY'),
            month: date.format('YYYY-MM'),
            detail: get_week_detail(item, list_event, list_course)
        })

    });

    return generate_list_week;

}

function get_week_detail(year_month, list_event, list_course) {

    var generate_week_detail = [];
    var week_name, i, count_day, get_course, get_days, first;


    var date_year_month = moment(year_month, "YYYY-MM");
    var get_total_day_in_one_month = date_year_month.daysInMonth();
    // var get_start_week = moment(new Date(year_month + '-01')).isoWeek();
    // var get_end_week = moment(new Date(year_month + '-' + get_total_day_in_one_month)).isoWeek();

    var get_start_week_day_start = moment(new Date(year_month + '-01')).startOf('Week').isoWeekday(7);
    var get_end_week_day_end = moment(new Date(year_month + '-' + get_total_day_in_one_month)).endOf('Week').isoWeekday(7);
    var start_date = moment(new Date(get_start_week_day_start.format('YYYY-MM-DD')));
    var end_date_last_week = moment(new Date(get_end_week_day_end.format('YYYY-MM-DD'))).clone().subtract(7, 'days').format('x');
    var end_date = moment(new Date(get_end_week_day_end.format('YYYY-MM-DD')));
    var count_date = start_date.clone().format('x');
    var temp_date = start_date;

    count_day = 0;

    while (count_date < end_date_last_week) {

        first = 0;
        for(i=0; i<7; i++)
        {
            var get_date = temp_date.clone().add( i, 'days').format('YYYY-MM-DD');
            count_date = temp_date.clone().add( i, 'days').format('x');
            if(first == 0)
            {
                week_name = get_date;
                first = 1;
            }

            end_date = get_date;
            count_day++;

        }

        get_course = set_course_data(week_name, end_date, list_course);
        get_days = set_day_data(week_name, end_date, list_event, get_course);
        var list_days = get_days.list_days;
        var total_missed_day = get_days.total_missed_day;
        var total_late_to_class = get_days.total_late_to_class;
        var total_missed_class = get_days.total_missed_class;

        generate_week_detail.push({
            'week_name': moment(new Date(week_name)).format('MMM DD YYYY') + ' - ' + moment(new Date(end_date)).format('MMM DD YYYY'),
            'total_late_to_class': total_late_to_class,
            'total_missed_class': total_missed_class,
            'total_missed_day': total_missed_day,
            'total_behaviour_incidents': 0,
            'events': {
                late_to_class: total_late_to_class > 0 ? 1 : 0,
                missed_class: total_missed_class > 0 ? 1 : 0,
                missed_day: total_missed_day > 0 ? 1 : 0,
                incident: 0
            },
            'courses': get_course,
            'days': list_days
        });

        count_date = temp_date.clone().format('x');
        temp_date = temp_date.clone().add( 7, 'days');

    }

    return generate_week_detail;

}


function set_course_data(start_date, end_date, list_course)
{
    var get_course = [];
    var temp_get_course = [];
    var first = 0;
    var temp_first = {};
    var temp_final = {};
    var temp_progress = {};
    var date_start = moment(new Date(start_date)).format("x");
    var date_end = moment(new Date(end_date)).format("x");
    var course_start, course_end, session_type_number, last_table_period, flag_final, flag_progress;
    list_course.forEach(function(item) {

        course_start = moment(new Date(item.start_date)).format("x");
        course_end = moment(new Date(item.end_date)).format("x");

        if(course_end >= date_start && course_start <= date_end)
        {
            if(typeof item.course.length === 'undefined')
            {
                if(typeof item.course.timeTablePeriod === 'undefined') {
                    item.course.timeTablePeriod = 0;
                }

                if(typeof item.session !== 'undefined')
                {
                    switch (item.course.sessionType)
                    {
                        case 'FullSchoolYear': session_type_number = 1; break;
                        case 'Semester': session_type_number = 2; break;
                        case 'Quarter': session_type_number = 3; break;
                        default: session_type_number = 4; break;
                    }

                    item.course.session_type = item.course.sessionType;
                    item.course.session_type_number = session_type_number;
                    item.course.session_code = item.course.sessionCode;
                    item.course.date_start = item.course.startDate;
                    item.course.date_end = item.course.endDate;
                }

                temp_get_course.push(item.course);
            }
            else {
                item.course.forEach(function(course) {

                    if(typeof course.timeTablePeriod === 'undefined') {
                        course.timeTablePeriod = 0;
                    }

                    if(typeof item.session !== 'undefined')
                    {
                        switch (item.course.sessionType)
                        {
                            case 'FullSchoolYear': session_type_number = 1; break;
                            case 'Semester': session_type_number = 2; break;
                            case 'Quarter': session_type_number = 3; break;
                            default: session_type_number = 4; break;
                        }
                        course.session_type = item.course.sessionType;
                        course.session_type_number = session_type_number;
                        course.session_code = item.course.sessionCode;
                        course.date_start = item.course.startDate;
                        course.date_end = item.course.endDate;
                    }

                    temp_get_course.push(course);

                });
            }
        }

    });

    temp_get_course.sort(function(a, b) {
        var key1 = parseInt(a.timeTablePeriod);
        var key2 = parseInt(b.timeTablePeriod);

        var n = key1 - key2;
        if (n != 0) {
            return n;
        }

        var key3 = parseInt(a.session_type_number);
        var key4 = parseInt(b.session_type_number);

        var n1 = key3 - key4;
        if (n1 != 0) {
            return n;
        }

        var key5 = parseInt(a.session_code);
        var key6 = parseInt(b.session_code);

        return key6 - key5;

    });

    last_table_period = '';
    flag_final = 0;
    flag_progress = 0;
    first = 0;
    temp_first = {};
    temp_final = {};
    temp_progress = {};
    temp_get_course.forEach(function(course) {

        var course_title = typeof course.courseTitle !== 'undefined' ? course.courseTitle : '';
        var temp_teacher_name = typeof course['psesd:teacherNames'] !== 'undefined' ? course['psesd:teacherNames'] : null;
        var table_period = typeof course.timeTablePeriod !== 'undefined' ? parseInt(course.timeTablePeriod) : 0;
        var teacher_name = '';

        if(temp_teacher_name !== null)
        {
            if(temp_teacher_name.length > 0)
            {
                teacher_name = temp_teacher_name;
            }
        }

        if(last_table_period === '')
        {
            last_table_period = table_period;
        }

        if(last_table_period !== table_period)
        {
            last_table_period = table_period;

            if(flag_final == 1) {
                get_course.push(temp_final);
            }
            else if(flag_progress == 1) {
                get_course.push(temp_progress);
            }
            else {
                get_course.push(temp_first);
            }
            flag_final = 0;
            flag_progress = 0;
            first = 0;
        }

        if(typeof course.finalMarkValue !== 'undefined')
        {
            if(flag_final == 0)
            {
                flag_final = 1;
                temp_final = {
                    course_title: course_title,
                    teacher_name: teacher_name,
                    table_period: table_period
                }
            }
        }
        else if(typeof course.progressMark !== 'undefined')
        {
            if(flag_progress == 0)
            {
                flag_progress = 1;
                temp_progress = {
                    course_title: course_title,
                    teacher_name: teacher_name,
                    table_period: table_period
                }
            }
        }
        else {
            if(first == 0)
            {
                first = 1;
                temp_first = {
                    course_title: course_title,
                    teacher_name: teacher_name,
                    table_period: table_period
                }
            }
        }

    });

    return get_course;
}

function set_day_data(start_date, end_date, list_event, list_course)
{
    var list_days = [];
    var get_list_event = [];
    var event, missed_day, late_to_class, missed_class;
    var date_start = moment(new Date(start_date));
    var total_late_to_class = 0;
    var total_missed_class = 0;
    var total_missed_day = 0;

    for(var i=0; i<7; i++)
    {
        get_list_event = [];
        var set_day = date_start.clone().add( i, 'days');
        var check_have = list_event.filter(function(key){
            return key.full_date === set_day.format('YYYY-MM-DD');
        });

        missed_day = 0;
        late_to_class = 0;
        missed_class = 0;
        var temp = [];
        var table_period;
        var global_missed_day = 0;

        if(check_have.length > 0)
        {
            // if(start_date == '2015-10-12')
            // {
            //     console.log(check_have, check_have[0].attendance);
            // }
            event = check_have[0];
            if(event.missed_day == 1) {
                missed_day = event.missed_day;
                late_to_class = 0;
                missed_class = 0;

                total_missed_day++;
            }
            else {
                late_to_class = event.late_to_class;
                missed_class = event.missed_class;

                total_late_to_class += late_to_class;
                total_missed_class += missed_class;
            }

            list_course.forEach(function(course) {

                temp = [];
                table_period = course.table_period;
                global_missed_day = 0;

                event.attendance.forEach(function(attendance) {

                    var time_period = typeof attendance.time_table_period !== 'undefined' ? attendance.time_table_period : 0;
                    if(missed_day == 1) {
                        global_missed_day = 1;
                    }

                    if(table_period == time_period)
                    {
                        var title = typeof attendance['psesd:absentReasonDescription '] !== 'undefined' ? attendance['psesd:absentReasonDescription '] : '';
                        var status_data = typeof attendance.attendance_event_type !== 'undefined' ? attendance.attendance_event_type : '';
                        var status = typeof attendance.attendance_status !== 'undefined' ? attendance.attendance_status : '';
                        var type = '';
                        if(missed_day == 1) {
                            type = 'missed_day';
                        }
                        else if(late_to_class == 1) {
                            type = 'late_to_class';
                        }
                        else if(missed_class == 1) {
                            type = 'missed_class';
                        }

                        temp = {
                            title: title,
                            type: type,
                            status: status,
                            status_data: status_data,
                            description: title
                        }
                    }

                });

                if(global_missed_day == 1) {
                    get_list_event.push({
                        title: 'Missed Day',
                        type: 'missed_day',
                        status: 'UnexcusedAbsence',
                        status_data: 'ClassSectionAttendance',
                        description: 'Missed Day'
                    });
                }
                else {
                    get_list_event.push(temp);
                }

            });

        }
        else {
            list_course.forEach(function(course) {
                get_list_event.push({

                });
            });
        }

        list_days.push({
            day: set_day.format('dddd'),
            date: set_day.format('DD'),
            late_to_class: late_to_class > 0 ? 1 : 0,
            missed_class: missed_class > 0 ? 1 : 0,
            missed_day: missed_day > 0 ? 1 : 0,
            incident_status: 0,
            incident_detail: [{
                title: '',
                description: ''
            }],
            events: get_list_event
        });
    }

    return {
        list_days: list_days,
        total_missed_day: total_missed_day,
        total_late_to_class: total_late_to_class,
        total_missed_class: total_missed_class
    };
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
                years: item.value,
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
                        year: item,
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
                        year: item,
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
                school_name: typeof event.school.schoolName !== 'undefined' ? event.school.schoolName : '',
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
                start_week: get_start_date.isoWeek(),
                // start_week_start: moment(new Date(get_start_date.format("YYYY") + '-01-01')).isoWeek(),
                // start_week_end: moment(new Date(get_start_date.format("YYYY") + '-12-31')).isoWeek(),
                start_day: get_end_date.format("DD"),
                end_date: get_end_date.format("YYYY-MM-DD"),
                end_year: get_end_date.format("YYYY"),
                end_month: get_end_date.format("MM"),
                end_week: get_end_date.isoWeek(),
                // end_week_start: moment(new Date(get_end_date.format("YYYY") + '-01-01')).isoWeek(),
                // end_week_end: moment(new Date(get_end_date.format("YYYY") + '-12-31')).isoWeek(),
                end_day: get_end_date.format("DD")
            });

        }

    });

    // console.log(list_course);

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