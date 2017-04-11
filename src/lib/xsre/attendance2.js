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
    var disciplineIncidents = xsre.json.disciplineIncidents || null;
    var generate_year = [];
    var otherTranscriptTerms = l.get(xsre, 'json.otherTranscriptTerms.transcriptTerm', null);
    var currentTranscriptTerm = l.get(xsre, 'json.transcriptTerm', null);
    var currentSchoolYear = parseInt(currentTranscriptTerm.schoolYear - 1) + "-" + currentTranscriptTerm.schoolYear;
    var transcriptCombine = [];
    var generate_calendar = [];
    var generate_calendar_week = [];
    var allAttendanceData = get_all_attendance_data(this.attendances.events.event);
    var list_data = allAttendanceData.temp_list_data;
    var dailyAttendanceRecords = allAttendanceData.dailyAttendanceRecords;
    var list_discipline_incident_data = get_all_discipline_incident_data(disciplineIncidents);

 
    transcriptCombine = set_sort_and_end_date(otherTranscriptTerms, currentTranscriptTerm);

    if(transcriptCombine.length > 0)
    {
        generate_year = get_list_year(transcriptCombine);
        var temp = get_calendar_year_month(transcriptCombine, generate_year, list_data, list_discipline_incident_data);
        generate_calendar = temp.generate_calendar;
        var get_all_date = temp.get_all_date;
        var get_list_course = get_list_course_data(transcriptCombine);
        generate_calendar_week = get_calendar_week(list_data, get_list_course, get_all_date, list_discipline_incident_data);

    }
    this.generate_table = transcriptCombine;
    this.generate_year = generate_year.reverse();
    this.generate_calendar_week = generate_calendar_week;
    this.list_years = this.getGenerateYear();
    this.list_weeks = this.getGenerateCalendarWeek();
    
    var currentTermSummary = _.find(xsre.json.attendance.summaries.summary, function(summary){return summary.endDate == undefined});

    var summaries = generateYearSummaries(generate_calendar_week, generate_year, dailyAttendanceRecords, xsre.json.attendance.summaries.summary);
    
    summaries.forEach(function(yearSummary) {
        generate_calendar.forEach(function(schoolYearCalendar) {
            if (yearSummary.schoolYear == schoolYearCalendar.years) {
                schoolYearCalendar.summary = yearSummary.summary;
            }
        })
    })

    this.generate_calendar = generate_calendar;
    this.calendars = this.getGenerateCalendar();
    this.summary = calculateSummary(this.calendars, currentSchoolYear, currentTermSummary);
}

function calculateSummary(cals, currentSchoolYear, currentTermSummary) {

    //if this month is 4, last month is 3, which is what you get if you ask for moment('2017-04-01').month().
    //Moment is zero-indexed on months but we're using the normal recknoning of 1-12.
    var lastMonth = moment().month();
    if (lastMonth == 0) {
        lastMonth = 12;
    }

    var currentCalendar = _.find(cals, function(cal){ return cal.years == currentSchoolYear});

    var attendanceCount = [];
    var behaviorCount = [];

    attendanceCount.push({
        type: "currentAcademicYear",
        flag: "not in use",
        count: currentTermSummary.daysAbsent
    });

    behaviorCount.push({
        type: "currentAcademicYear",
        flag: "not in use",
        count: currentCalendar.summary.behaviorIncident
    });

    var lastMonthAttendanceCount = 0;
    var lastMonthBehaviorCount = 0;
    for (var event in currentCalendar.list_events) {
        if (moment(event.date).month() + 1 == lastMonth) {
            for (var i in event.event) {
                if (event.event[i] == "missed_day") {
                    lastMonthAttendanceCount++;
                } else if (event.event[i] == behavior_incident) {
                    console.log("behavior event on " + event.date);
                    lastMonthBehaviorCount++;
                }
            }
        } 
    }
    
    attendanceCount.push({
        type: "lastMonth",
        flag: "not in use",
        count: lastMonthAttendanceCount
    });
    behaviorCount.push({
        type: "lastMonth",
        flag: "not in use",
        count: lastMonthBehaviorCount
    });
    
    return {
        attendanceCount: attendanceCount,
        behaviorCount: behaviorCount
    }
}

function generateYearSummaries(calendarMonths, schoolYears, dailyAttendanceRecords, xsreAttendanceSummaries) {
    var schoolYearSummaries = [];
    var schoolYearMonths = {};

    for (var i in schoolYears) {
        var years = schoolYears[i].value.split("-");
        var keyYear = years[1];

        if (!schoolYearMonths[keyYear]) {
           schoolYearMonths[keyYear] = {
               September: {},
               October: {},
               November: {},
               December: {},
               January: {},
               February: {},
               March: {},
               April: {},
               May: {},
               June: {},
               July: {},
               August: {}
           }
        }

    }
    
    for (var i in calendarMonths) {
        var yearMonth = {
            year: parseInt(calendarMonths[i].month.split("-")[0]),
            month: moment.months()[parseInt(calendarMonths[i].month.split("-")[1]) - 1],  //returns full month name
        }

        var keyYear = parseInt(getSchoolYear(calendarMonths[i].month));

        
        //Not sure it's possible to have 2 intances of a given month in the data -
        //say a student changes schools - but if so, this should at least preserve all data.
        if (schoolYearMonths[keyYear][yearMonth.month].detail) {
            schoolYearMonths[keyYear][yearMonth.month].detail = _.union(schoolYearMonths[keyYear][yearMonth.month].detail, calendarMonths[i].detail)
        }
        else {
            schoolYearMonths[keyYear][yearMonth.month] = calendarMonths[i];
        }
    }

    schoolYears.forEach(function(schoolYear) {
        var years = schoolYear.value.split("-");
        var keyYear = years[1];

        var daysInSchoolYear = 0;
        
        var lateToClass = 0;
        var missedDay = 0;
        var missedClass = 0;
        var behaviorIncident = 0;

        if (schoolYearMonths[keyYear]) {
           for (var month in schoolYearMonths[keyYear]) { 
               var m = schoolYearMonths[keyYear][month];   

               var weeks = m.detail;
               if (weeks) {
                    weeks.forEach(function(week) {
                        lateToClass += week.total_late_to_class;
                        missedDay += week.total_missed_day;
                        missedClass += week.total_missed_class;
                        behaviorIncident += week.total_behaviour_incidents;
                    });
               }

            }
        }

        var currentTermSummary = _.find(xsreAttendanceSummaries, function(summary){
            //grabs the whole-term summary, rather than the per-month summary
            return moment(summary.startDate).year() == keyYear - 1 && summary.school == undefined
        });

        var totalDaysInTerm = currentTermSummary ? parseFloat(currentTermSummary.daysAbsent) + parseFloat(currentTermSummary.daysInAttendance)
        : calculateSchoolTotalDaysForStudent(dailyAttendanceRecords, years);

        var summaryAttendanceRate = currentTermSummary ? parseFloat(currentTermSummary.studentAttendanceRate) : 
            totalDaysInTerm ? ((totalDaysInTerm - missedDay) / totalDaysInTerm) : 0;

        var schoolYearSummary = {
            schoolYear: schoolYear.value,
            summary: {
                totalDays: totalDaysInTerm,
                lateToClass: lateToClass,
                missedDay: missedDay,
                missedClass: missedClass,
                behaviorIncident: behaviorIncident,
                attendanceRate: summaryAttendanceRate
            }
        };

        schoolYearSummaries.push(schoolYearSummary);
    })

    return schoolYearSummaries;
}

function calculateSchoolTotalDaysForStudent(dailyAttendanceRecords, years) {
        var totalSchoolDaysForStudent = 0;
        for (var i in dailyAttendanceRecords) {
            if (dailyAttendanceRecords[i].attendanceEventType === "DailyAttendance") {
                var yearMonthDay = dailyAttendanceRecords[i].calendarEventDate.split("-");
                if ((years[0] == yearMonthDay[0] && parseInt(yearMonthDay[1]) > 7) || (years[1] == yearMonthDay[0] && parseInt(yearMonthDay[1]) < 7)) {
                    totalSchoolDaysForStudent += 1;
                }
            }
        }
        return totalSchoolDaysForStudent;
}

function get_calendar_week(list_event, list_course, all_date, list_discipline_incident_data) {
    var generate_list_week = [];

    all_date.forEach(function (item) {

        var date = moment(item, "YYYY-MM");

        generate_list_week.push({
            name: date.format('MMMM YYYY'),
            month: date.format('YYYY-MM'),
            detail: get_week_detail(item, list_event, list_course, list_discipline_incident_data)
        })

    });

    return generate_list_week;

}

function get_week_detail(year_month, list_event, list_course, list_discipline_incident_data) {

    var generate_week_detail = [];
    var week_name, i, count_day, get_course, get_days, first;


    var date_month_begins = moment(year_month, "YYYY-MM");
    var get_total_day_in_one_month = moment(date_month_begins).daysInMonth();

    var get_start_week_day_start = moment(date_month_begins).startOf('Week');
    var get_end_week_day_end = moment(year_month + '-' + get_total_day_in_one_month).endOf('Week');
    var start_date = moment(get_start_week_day_start.format('YYYY-MM-DD'));

    var end_date_last_week = moment(get_end_week_day_end.format('YYYY-MM-DD')).clone().subtract(7, 'days').format('x');
    var end_date = moment(get_end_week_day_end.format('YYYY-MM-DD'));
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
        get_days = set_day_data(week_name, end_date, list_event, get_course, list_discipline_incident_data, year_month);
        var list_days = get_days.list_days;
        var total_missed_day = get_days.total_missed_day;
        var total_late_to_class = get_days.total_late_to_class;
        var total_missed_class = get_days.total_missed_class;
        var total_incident = get_days.total_incident;

        generate_week_detail.push({
            'week_name': week_name + ' - ' + end_date,
            'total_late_to_class': total_late_to_class,
            'total_missed_class': total_missed_class,
            'total_missed_day': total_missed_day,
            'total_behaviour_incidents': total_incident,
            'events': {
                late_to_class: total_late_to_class > 0 ? 1 : 0,
                missed_class: total_missed_class > 0 ? 1 : 0,
                missed_day: total_missed_day > 0 ? 1 : 0,
                incident: total_incident > 0 ? 1 : 0
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
    var course_start, course_end, session_type_number, last_table_period, flag_final, flag_progress, table_period;
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
    table_period = '';
    flag_final = 0;
    flag_progress = 0;
    first = 0;
    temp_first = {};
    temp_final = {};
    temp_progress = {};
    temp_get_course.forEach(function(course) {

        var course_title = typeof course.courseTitle !== 'undefined' ? course.courseTitle : '';
        var temp_teacher_name = typeof course['psesd:teacherNames'] !== 'undefined' ? course['psesd:teacherNames'] : null;
        table_period = typeof course.timeTablePeriod !== 'undefined' ? parseInt(course.timeTablePeriod) : 0;
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
    if (get_course.length < last_table_period) {
      if (flag_final == 1) {
        get_course.push(temp_final);
      }
      else if (flag_progress == 1) {
        get_course.push(temp_progress);
      }
      else {
        get_course.push(temp_first);
      }
    }

    return get_course;
}

function set_day_data(start_date, end_date, list_event, list_course, list_discipline_incident_data, year_month)
{
    var list_days = [];
    var get_list_event = [];
    var event, missed_day, late_to_class, missed_class;
    var date_start = moment(new Date(start_date));
    var total_late_to_class = 0;
    var total_missed_class = 0;
    var total_missed_day = 0;
    var total_all_incident = 0;
    var incident_total = 0;
    var incident_detail = [];

    var month = moment(year_month).month() + 1;

    for(var i=0; i<7; i++)
    {
        get_list_event = [];
        var set_day = date_start.utc().clone().add( i, 'days');
        var check_have = list_event.filter(function(key){
            return key.full_date === set_day.format('YYYY-MM-DD');
        });
        var check_have2 = list_discipline_incident_data.filter(function(key){
            return key.full_date === set_day.format('YYYY-MM-DD');
        });

        missed_day = 0;
        late_to_class = 0;
        missed_class = 0;
        var temp = [];
        var table_period;
        var global_missed_day = 0;

        if(check_have.length > 0 && isInMonth(check_have[0], month))
        {
            event = check_have[0];
            if(event.missed_day > 0) {
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

                    var time_period = typeof attendance.time_table_period !== 'undefined' ? parseInt(attendance.time_table_period) : 0;
                    var title = typeof attendance['psesd:absentReasonDescription '] !== 'undefined' ? attendance['psesd:absentReasonDescription '] : '';
                    var status_data = typeof attendance.attendance_event_type !== 'undefined' ? attendance.attendance_event_type : '';
                    var status = typeof attendance.attendance_status !== 'undefined' ? attendance.attendance_status : '';
                    var type = '';
                    if(missed_day == 1) {
                        global_missed_day = 1;
                    }

                    if(table_period == time_period)
                    {
                        if(status_data === 'DailyAttendance') {
                            type = 'missed_day';
                        }
                        else if(status === 'Tardy') {
                            type = 'late_to_class';
                        }
                        else {
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

        incident_total = 0;
        incident_detail = [];
        if(check_have2.length > 0 && isInMonth(check_have2[0], month))
        {
            check_have2.forEach(function(incident) {
                incident.action.forEach(function(action) {
                    total_all_incident++;
                    incident_total++;
                    incident_detail.push({
                        title: action.school_name,
                        description: action.action
                    });
                });
            });
        }

        list_days.push({
            day: set_day.format('dddd'),
            date: set_day.format('DD'),
            late_to_class: late_to_class > 0 ? 1 : 0,
            missed_class: missed_class > 0 ? 1 : 0,
            missed_day: missed_day > 0 ? 1 : 0,
            incident_status: incident_total > 0 ? 1 : 0,
            incident_detail: incident_detail,
            events: get_list_event
        });
    }

    return {
        list_days: list_days,
        total_missed_day: total_missed_day,
        total_late_to_class: total_late_to_class,
        total_missed_class: total_missed_class,
        total_incident: total_all_incident
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


function get_calendar_year_month(transcriptCombine, generate_year, list_event, list_discipline_incident_data) {
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
                list_events: get_event_one_year(year_arr, list_event, list_discipline_incident_data)
            });

        });
    }

    return {
        'generate_calendar': generate_calendar,
        'get_all_date': get_all_date
    };
}

function get_event_one_year(year, list_event, list_discipline_incident_data) {

    var print_list_event = [];
    var list_raw_event, j;
    year.forEach(function (item, i) {

        if(i == 0)
        {
            for(j=9; j<=12; j++)
            {
                list_raw_event = get_all_list_event_one_year(item, j, list_event, list_discipline_incident_data);
                if(list_raw_event.length > 0)
                {
                    list_raw_event.forEach(function(item2) {
                        print_list_event.push(item2);
                    });
                }
            }
        }
        else {
            for(j=1; j<=8; j++)
            {
                list_raw_event = get_all_list_event_one_year(item, j, list_event, list_discipline_incident_data);
                if(list_raw_event.length > 0)
                {
                    list_raw_event.forEach(function(item2) {
                        print_list_event.push(item2);
                    });
                }
            }
        }

    });

    return print_list_event;

}

function get_all_list_event_one_year(item, j, list_event, list_discipline_incident_data) {

    var list_raw_event = [];
    var get_event, check_duplicate, check_duplicate_event, check_duplicate_event1, get_incident, have_incident, temp_event_day, temp, full_date, total_incident;
    var count_incident = 0;

    get_event = list_event.filter(function(key){ return parseInt(key.year) === parseInt(item) && parseInt(key.month) === parseInt(j) });
    get_incident = list_discipline_incident_data.filter(function(key){ return parseInt(key.year) === parseInt(item) && parseInt(key.month) === parseInt(j) });
    total_incident = get_incident.length;

    
    if(get_event.length > 0)
    {
        get_event.forEach(function(item2) {
            temp_event_day = [];
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

            if(get_incident.length > 0)
            {
                have_incident = 0;
                get_incident.forEach(function(incident) {
                    if(item2.full_date === incident.full_date)
                    {
                        incident.action.forEach(function(action) {
                            if(have_incident !== 1)
                            {
                                have_incident = 1;
                                temp_event_day.push('behavior_incident');
                                count_incident++;
                            }
                        });
                    }

                });
            }

            temp = {
                date: item2.full_date,
                event: temp_event_day,
                total: temp_event_day.length
            };

            // Check same day
            check_duplicate = list_raw_event.filter(function(key){ return key.date === item2.full_date });
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
                            check_duplicate_event = item3.event.filter(function(key){ return key === 'missed_day' });
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

        if(count_incident < total_incident)
        {
            temp_event_day = [];
            have_incident = 0;
            full_date = '';
            var find = 0;
            get_incident.forEach(function(incident) {
                full_date = incident.full_date;
                find = 0;
                list_raw_event.forEach(function(raw_event) {
                    if(raw_event.date === full_date)
                    {
                        find = 1;
                    }
                });

                if(find === 0)
                {
                    incident.action.forEach(function(action) {
                        if(have_incident !== 1)
                        {
                            have_incident = 1;
                            temp_event_day.push('behavior_incident');
                        }
                    });

                    temp = {
                        date: full_date,
                        event: temp_event_day,
                        total: temp_event_day.length
                    };

                    list_raw_event.push(temp);
                }

            });

        }

    }
    else {
        if(get_incident.length > 0)
        {
            temp_event_day = [];
            have_incident = 0;
            full_date = '';
            get_incident.forEach(function(incident) {
                full_date = incident.full_date;
                incident.action.forEach(function(action) {
                    if(have_incident !== 1)
                    {
                        have_incident = 1;
                        temp_event_day.push('behavior_incident');
                    }
                });

                temp = {
                    date: full_date,
                    event: temp_event_day,
                    total: temp_event_day.length
                };

                list_raw_event.push(temp);

            });

        }
    }

    if(list_raw_event.length > 0)
    {
        list_raw_event.sort(function(a, b) {

            var key1 = moment(new Date(a.date)).format('X');
            var key2 = moment(new Date(b.date)).format('X');

            var n = key1 - key2;
            if (n != 0) {
                return n;
            }
        });
    }

    return list_raw_event;

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
                if(list_month.indexOf(check_month) >= 0) {
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
                if(list_month.indexOf(check_month) >= 0) {
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
    var session, new_start_date;

    if (transcriptTermOther) {
        if(transcriptTermOther.length > 1) {
            sortTranscriptTermsByDate(transcriptTermOther);
        }
        if (!Array.isArray(transcriptTermOther)){
            transcriptTermOther = [transcriptTermOther];
        }

        transcriptTermOther.forEach(function(item, i) {
            get_grade_level = parseInt(item.gradeLevel);
            get_session_type = typeof item.session !== 'undefined' ? item.session.sessionType : '';
            get_session_code = typeof item.session !== 'undefined' ? parseInt(item.session.sessionCode) : 0;
            get_start_date = typeof item.session !== 'undefined' ? item.session.startDate : new Date();
            session = get_range_school(get_session_type, get_session_code, parseInt(item.schoolYear), item);
            item.session.endDate = session.endDate;
            transcriptCombine.push(item);
        });
    }

    if(transcriptTerm) {
        new_start_date = parseInt(transcriptTerm.schoolYear) - 1;

        if (!transcriptTerm.session) {
            transcriptTerm.session = {
                sessionType: 'FullSchoolYear',
                sessionCode: '1',
                startDate: new_start_date + '-09-01',
                endDate: transcriptTerm.schoolYear + '-08-31'
            }
        }

        transcriptCombine.push(transcriptTerm);
    }

    return transcriptCombine;
}


function get_range_school(session_type, session_code, year, item) {

    var set_session_type = session_type;
    var set_session_code = parseInt(session_code);
    var set_year = parseInt(year);
    var new_date;
    var get_many_day;
    var end_date;
    var last_year;

    return {
        sessionType: set_session_type,
        sessionCode: session_code,
        startDate: moment(item.session.startDate).format('YYYY-MM-DD'),
        endDate: moment(item.session.endDate).format('YYYY-MM-DD')
    }

}


function get_all_attendance_data(events) {

    var list_data = [];
    var dailyAttendanceRecords = [];
    if(typeof events === 'undefined')
    {
        return list_data;
    }

    events.forEach(function(event){

        if (event.attendanceEventType === 'DailyAttendance') {
            dailyAttendanceRecords.push(event);
        }

        if(event.attendanceStatus !== "Present")
        {
            var event_date = moment(event.calendarEventDate);

            var attendance_status = event.attendanceStatus;
            var attendance_event_type = event.attendanceEventType;
            var attendance_value = event.attendanceValue;
            var missed_day = 0;
            var late_to_class = 0;
            var missed_class = 0;
            if(attendance_event_type === 'DailyAttendance')
            {
                //Missed Day
                if(attendance_value == 0) {
                    missed_day = 1;
                }
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
                time_table_period: typeof event.timeTablePeriod !== 'undefined' ? parseInt(event.timeTablePeriod) : 0,
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

    return { temp_list_data: temp_list_data, dailyAttendanceRecords: dailyAttendanceRecords };

}

function get_all_discipline_incident_data(discipline_incidents) {

    var list_data = [];
    if(typeof discipline_incidents === 'undefined' || discipline_incidents === null || discipline_incidents.length <= 0)
    {
        return list_data;
    }

    if(discipline_incidents.disciplineIncident.length  > 0)
    {
        discipline_incidents.disciplineIncident.forEach(function(incident) {
            list_data.push(passing_incident(incident));
        });
    }
    else {
        list_data.push(passing_incident(discipline_incidents.disciplineIncident));
    }

    return list_data;

}

function isInMonth(date, month) {
    return moment(date.full_date).month() + 1 == month;
}

function passing_incident(incident) {

    var list_action = [];
    if(incident.actions.length > 0)
    {
        incident.actions.forEach(function(action) {
            list_action.push(passing_action(action));
        });
    }
    else
    {
        list_action.push(passing_action(incident.actions.action));
    }

    var date = moment(new Date(incident.incidentDate));

    return {
        full_date: date.format('YYYY-MM-DD'),
        year: date.format('YYYY'),
        month: date.format('MM'),
        day: date.format('DD'),
        total: list_action.length,
        action: list_action
    }
}

function passing_action(action) {
    return {
        school_name: typeof action.reportingSchool.schoolName !== 'undefined' ? action.reportingSchool.schoolName : '',
        action: typeof action['raw:source'] !== 'undefined' ? action['raw:source']['raw:code'] : ''
    }
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

    return list_course;

}

function sortTranscriptTermsByDate(transcriptTerms) {
    {
        transcriptTerms.sort(function(a, b) {
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

        
    }
}

function generateSummaryData(xsre) {
    var summaries = {};
    summaries[xsre.json.enrollment.schoolYear] = {
        late_to_class : 0,
        missed_class: 0,
        missed_day: 0,
        start_date : xsre.json.enrollment.entryDate,
        end_date : xsre.json.enrollment.exitDate || ""
    };

    var enrollments = _.isArray(xsre.json.otherEnrollments.enrollment) ? xsre.json.otherEnrollments.enrollment : [xsre.json.otherEnrollments.enrollment];

    enrollments.forEach(function(enrollment){
        if (!summaries[enrollment.schoolYear]) {
            summaries[enrollment.schoolYear] = {
                late_to_class : 0,
                missed_class: 0,
                missed_day: 0,
                start_date : xsre.json.enrollment.entryDate,
                end_date : xsre.json.enrollment.exitDate || ""
            };
        }
    });

    xsre.json.attendance.events.event.forEach(function(event){
        if (event.attendanceStatus != "Present") {
            var schoolYear = getSchoolYear(event.calendarEventDate);
            switch (event.attendanceStatus) {
                case "ExcusedAbscence":
                    if (attendanceValue == 0) {
                        summaries[schoolYear].missed_day++;
                    }
                    break;
            }
        }
    });

}

function getSchoolYear(d) {

    if (moment(d).month() >= 8) {
        return moment(d).year() + 1;
    }
    return moment(d).year();
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
