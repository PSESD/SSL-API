/**
 * Created by zaenal on 21/08/15.
 */
var _ = require('underscore');
var phpjs = require('phpjs');
var moment = require('moment');

var data = {
    "_links": {"self": {"href": "/55913fc817aac10c2bbfe1e8/students/55d3e759d099940e006d7206/xsre"}},
    "_embedded": {
        "users": [{
            "_links": {"self": {"href": "/55913fc817aac10c2bbfe1e8/users/55913fc906d86a0c0077fbc6"}},
            "id": "55913fc906d86a0c0077fbc6",
            "email": "demo@upwardstech.com",
            "fullname": "User CBO Demo"
        }],
        "programs": [{
            "program": "5592d25c23ab6a4800d0e94f",
            "participation_start_date": "2015-08-20T00:00:00.000Z",
            "participation_end_date": "2015-08-21T00:00:00.000Z",
            "creator": "55913fc906d86a0c0077fbc6",
            "last_updated_by": "55913fc906d86a0c0077fbc6",
            "_id": "55d5aca39529100d00a39565",
            "last_updated": "2015-08-20T10:32:03.029Z",
            "created": "2015-08-20T10:32:03.029Z",
            "cohort": [],
            "active": true,
            "program_name": "After-school Tutoring"
        }]
    },
    "name": {"familyName": "Marvin", "givenName": "Peyton"},
    "localId": "Sample6",
    "demographics": {"races": {"race": {"race": "HispanicLatino"}}, "sex": "Female", "birthDate": "1998-01-30"},
    "attendance": {
        "summaries": {
            "summary": [{
                "startDate": {"_": "10/27/2014", "$": {"xsi:type": "xsd:string"}},
                "daysInAttendance": "53.00",
                "daysAbsent": "9"
            }]
        },
        "events": {
            "event": [{
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "9/5/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "9/26/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "10/6/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "10/9/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "10/27/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "10/29/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "10/30/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/20/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "absentAttendanceCategory": "13297"
            }, {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/21/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "absentAttendanceCategory": "13297"
            }]
        }
    },
    "attendanceBehaviors": [{
        "weekStart": "10/27/2014",
        "weekEnd": "11/05/2014",
        "havePeriods": false,
        "deltaChange": "0%",
        "weekData": [{"date": "9/5/2014", "attendance": "0%", "periods": [], "behaviors": []}, {
            "date": "9/26/2014",
            "attendance": "0%",
            "periods": [],
            "behaviors": []
        }, {"date": "10/6/2014", "attendance": "0%", "periods": [], "behaviors": []}, {
            "date": "10/9/2014",
            "attendance": "0%",
            "periods": [],
            "behaviors": []
        }, {"date": "10/27/2014", "attendance": "0%", "periods": [], "behaviors": []}, {
            "date": "10/29/2014",
            "attendance": "0%",
            "periods": [],
            "behaviors": []
        }, {"date": "10/30/2014", "attendance": "0%", "periods": [], "behaviors": []}, {
            "date": "11/20/2014",
            "attendance": "0%",
            "periods": [],
            "behaviors": []
        }, {"date": "11/21/2014", "attendance": "0%", "periods": [], "behaviors": []}]
    }]
};
moment.fn.isISO = true;

moment.fn.dayISO = function () {
    var self = this.clone();
    return self.day() == 0 ? 6 : self.day()-1;
};

moment.fn.weekISO = function () {
    var self = this.clone();
    return self.day() == 0 ? self.format('w')-1 : self.format('w');
};

moment.fn.week = function () {
    var self = this.clone(),
        day = self.isISO ? self.dayISO() : self.day();
    return {
        begin: self.subtract(day, 'days').clone(),
        end:   self.add(6, 'days').clone()
    }
};

moment.fn.daysOfWeek = function (format) {
    var self = this.clone(),
        day = self.isISO ? self.dayISO() : self.day(),
        days = [], daysObject = [];

    format = format || 'MM/DD/YYYY';
    var s = self.subtract(day, 'days');
    for(var i = 0; i <= 6; i++){
        if(i > 0){
            s = s.add(1, 'days');
        }
        days.push(s.format(format));
        daysObject.push(s);
    }

    return { toObject: function(){ return daysObject; }, toString: function(){ return days; } };
};

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
var allEvents = [];
var minDateCalendar = 0;
var maxDateCalendar = 0;
/**
 *
 * @param results
 * @returns {Array}
 */
function getAttendanceBehaviors(results){

    var attendanceBehaviors = [];

    var weeks = [];

    var attendance = results.attendance;

    var allEvents = [];
    var minDateCalendar = 0;
    var maxDateCalendar = 0;

    var allDates = [];

    var facets = {
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

    var mm = null;

    attendance.events.event.forEach(function(event){

        mm = moment(new Date(event.calendarEventDate));

        if(mm.isValid()) {

            event.calendarEventDateTime = mm.valueOf();

            var obj = {};

            obj[event.calendarEventDate] = {
                calendarEventDate: event.calendarEventDate,
                attendanceValue: event.attendanceValue,
                attendanceStatus: null,
                attendanceStatusTitle: null,
                attendanceEventType: null,
                attendanceEventTypeTitle: null,
                absentAttendanceCategory: null,
                absentAttendanceCategoryTitle: null,
                presentAttendanceCategory: null,
                presentAttendanceCategoryTitle: null
            };

            event.calendarEventDateString = event.calendarEventDate;

            if('absentAttendanceCategory' in event) {

                obj[event.calendarEventDate].absentAttendanceCategory = parseInt(event.absentAttendanceCategory);

                obj[event.calendarEventDate].absentAttendanceCategoryTitle = obj[event.calendarEventDate].absentAttendanceCategory in facets ? facets[obj[event.calendarEventDate].absentAttendanceCategory] : '';

            }

            if('presentAttendanceCategory' in event) {

                obj[event.calendarEventDate].presentAttendanceCategory = parseInt(event.presentAttendanceCategory);

                obj[event.calendarEventDate].presentAttendanceCategoryTitle = obj[event.calendarEventDate].presentAttendanceCategory in facets ? facets[obj[event.calendarEventDate].presentAttendanceCategory] : '';

            }

            if('attendanceEventType' in event) {

                obj[event.calendarEventDate].attendanceEventType = event.attendanceEventType;

                obj[event.calendarEventDate].attendanceEventTypeTitle = event.attendanceEventType in facets ? facets[event.attendanceEventType] : '';
            }

            if('dailyAttendanceStatus' in event) {

                obj[event.calendarEventDate].attendanceStatus = event.dailyAttendanceStatus;

                obj[event.calendarEventDate].attendanceStatusTitle = event.dailyAttendanceStatus in facets ? facets[event.dailyAttendanceStatus] : '';

            }

            event.calendarEventDate = mm.format('MM-DD-YYYY');

            delete event.school;

            allDates.push(event.calendarEventDateTime);



            allEvents.push(obj);

        }

    });

    minDateCalendar = _.min(allDates);

    maxDateCalendar = _.max(allDates);

    weeks = moment(minDateCalendar).weeksTo(moment(maxDateCalendar), 'MM/DD/YYYY');

    //console.log(weeks, allEvents);

    var maxDay = 5;

    weeks.forEach(function(week){
        var behavior = {};
        var ikey = week.startString + ' - ' + week.endString;

        behavior = {
            weekDate: ikey,
            summary: [
                { value: 'N/A', event: null },
                { value: 'N/A', event: null },
                { value: 'N/A', event: null },
                { value: 'N/A', event: null },
                { value: 'N/A', event: null },
            ],
            weeklyChange: 'N/A',
            periods : []
        };

        week.daysOfWeek.forEach(function(day){

            var dayString = day.format('MM/DD/YYYY');

            var nday = day.day();

            if(nday > maxDay) return;

            var e = dayString in allEvents ? allEvents[dayString] : null;

            behavior.summary[nday].event = e;

            if(e !== null){

                if(e.attendanceStatus === 'DailyAttendance'){

                    if (e.attendanceEventType.toLowerCase() === 'present') {

                            behavior.summary[nday].value = parseInt(e.attendanceValue);

                    } else if(e.attendanceEventType.toLowerCase().indexOf('absence')){

                        behavior.summary[nday].value = (1 - parseInt(e.attendanceValue)) * 100;

                    }

                }

            }

        });


        var behaviors = {};
        behaviors[ikey] = behavior;

        attendanceBehaviors.push(behaviors);

    });

    attendanceBehaviors.reverse();

    return attendanceBehaviors;

}

console.log(getAttendanceBehaviors(data));