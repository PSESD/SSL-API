/**
 * Created by zaenal on 21/08/15.
 */
var Attendance = require(__dirname+'/../lib/attendance');

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
                "calendarEventDate": "11/16/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297"
            },{
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

console.log(require('prettyjson').render(new Attendance(data).getBehaviors()));