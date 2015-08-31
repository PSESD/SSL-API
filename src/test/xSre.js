/**
 * Created by zaenal on 21/08/15.
 */
var Attendance = require(__dirname+'/../lib/xsre/attendance');

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
    "disciplineIncidents": {
        "disciplineIncident": [
            {
                "incidentCategory": 04645,
                "description": "Mutual participation in an incident involving physical violence, where there is no injury to any person requiring professional medical attention.",
                "incidentDate": "2014-11-11",
                "actions": []
            },
            {
                "incidentCategory": 04651,
                "description": "Mutual participation in an incident involving physical violence, where there is no injury to any person requiring professional medical attention.",
                "incidentDate": "2014-11-11",
                "actions": []
            }
        ]
    },
    "attendance": {
        "summaries": {
            "summary": [{
                "startDate": {"_": "10/27/2014", "$": {"xsi:type": "xsd:string"}},
                "daysInAttendance": "53.00",
                "daysAbsent": "9"
            }]
        },
        "events": {
            "event": [
             {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/11/2014",
                "dailyAttendanceStatus": "UnexcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.1,
                "timeTablePeriod": 1
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/11/2014",
                "dailyAttendanceStatus": "Present",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.2,
                "timeTablePeriod": 2
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/11/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.3,
                "timeTablePeriod": 3
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/11/2014",
                "dailyAttendanceStatus": "Tardy",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.4
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/11/2014",
                "dailyAttendanceStatus": "EarlyDeparture",
                "attendanceEventType": "ClassSectionAttendance",
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.5
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {"otherId": {"type": "NCES", "id": "02693"}},
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {"phoneNumberType": "Work", "number": "3606766471", "primaryIndicator": "true"}
                },
                "calendarEventDate": "11/20/2014",
                "dailyAttendanceStatus": "ExcusedAbsence",
                "attendanceEventType": "DailyAttendance",
                "presentAttendanceCategory": "13290",
                "attendanceValue": 0.5
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
                "absentAttendanceCategory": "13297",
                "attendanceValue": 0.9
            }
            ]
        }
    }
};

data = {
    "_links": {
        "self": {
            "href": "/55913fc817aac10c2bbfe1e8/students/55d3e759d099940e006d7206/xsre"
        }
    },
    "_embedded": {
        "users": [
            {
                "_links": {
                    "self": {
                        "href": "/55913fc817aac10c2bbfe1e8/users/55913fc906d86a0c0077fbc6"
                    }
                },
                "id": "55913fc906d86a0c0077fbc6",
                "email": "demo@upwardstech.com",
                "fullname": "User CBO Demo"
            }
        ],
        "programs": [
            {
                "program": "5592d25c23ab6a4800d0e94f",
                "participation_start_date": "2015-08-20T00:00:00.000Z",
                "participation_end_date": "2015-08-21T00:00:00.000Z",
                "creator": "55913fc906d86a0c0077fbc6",
                "last_updated_by": "55913fc906d86a0c0077fbc6",
                "_id": "55d5aca39529100d00a39565",
                "last_updated": "2015-08-21T04:27:41.154Z",
                "created": "2015-08-20T10:32:03.029Z",
                "cohort": [
                    "2015",
                    "testing"
                ],
                "active": true,
                "program_name": "After-school Tutoring"
            },
            {
                "program": "55946d30db82d427002df84a",
                "participation_start_date": "2014-12-01T00:00:00.000Z",
                "participation_end_date": "2014-12-08T00:00:00.000Z",
                "creator": "55913fc906d86a0c0077fbc6",
                "last_updated_by": "55913fc906d86a0c0077fbc6",
                "_id": "55d6ac1d9529100d00a39566",
                "last_updated": "2015-08-21T04:42:05.795Z",
                "created": "2015-08-21T04:42:05.795Z",
                "cohort": [
                    "2014",
                    "Sports"
                ],
                "active": false,
                "program_name": "After-school Sports"
            },
            {
                "program": "55ad83b5eb731c66004c85ad",
                "participation_start_date": "2015-09-01T00:00:00.000Z",
                "participation_end_date": "2015-08-31T00:00:00.000Z",
                "creator": "55913fc906d86a0c0077fbc6",
                "last_updated_by": "55913fc906d86a0c0077fbc6",
                "_id": "55d6c6789529100d00a39567",
                "last_updated": "2015-08-21T06:34:31.951Z",
                "created": "2015-08-21T06:34:31.951Z",
                "cohort": [
                    "Basket"
                ],
                "active": true,
                "program_name": "Basketball"
            }
        ]
    },
    "name": {
        "familyName": "Marvin",
        "givenName": "Peyton"
    },
    "localId": "Sample6",
    "otherIds": {
        "otherId": {
            "type": "State",
            "id": "Sample6StateId"
        }
    },
    "demographics": {
        "races": {
            "race": {
                "race": "HispanicLatino"
            }
        },
        "sex": "Female",
        "birthDate": "1998-01-30"
    },
    "reportDate": "2015-08-03",
    "assessments": {
        "assessment": [
            {
                "name": "SBA",
                "actualStartDateTime": "2015-03-10T00:00:00",
                "studentGradeLevel": "11"
            },
            {
                "name": "ALG ",
                "actualStartDateTime": "2015-01-02T00:00:00",
                "studentGradeLevel": "10"
            },
            {
                "name": "ALG ",
                "actualStartDateTime": "2014-03-10T00:00:00",
                "studentGradeLevel": "09"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2013-03-12T00:00:00",
                "studentGradeLevel": "08"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2013-03-12T00:00:00",
                "studentGradeLevel": "08"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2013-03-12T00:00:00",
                "studentGradeLevel": "08"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2012-03-13T00:00:00",
                "studentGradeLevel": "07"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2012-03-13T00:00:00",
                "studentGradeLevel": "07"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2012-03-13T00:00:00",
                "studentGradeLevel": "07"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2011-03-17T00:00:00",
                "studentGradeLevel": "06"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2011-03-17T00:00:00",
                "studentGradeLevel": "06"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2010-03-16T00:00:00",
                "studentGradeLevel": "05"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2010-03-16T00:00:00",
                "studentGradeLevel": "05"
            },
            {
                "name": "MSP ",
                "actualStartDateTime": "2010-03-16T00:00:00",
                "studentGradeLevel": "05"
            },
            {
                "name": "WASL",
                "actualStartDateTime": "2009-03-16T00:00:00",
                "studentGradeLevel": "04"
            },
            {
                "name": "WASL",
                "actualStartDateTime": "2009-03-16T00:00:00",
                "studentGradeLevel": "04"
            },
            {
                "name": "WASL",
                "actualStartDateTime": "2009-03-16T00:00:00",
                "studentGradeLevel": "04"
            },
            {
                "name": "WASL",
                "actualStartDateTime": "2008-03-10T00:00:00",
                "studentGradeLevel": "03"
            },
            {
                "name": "WASL",
                "actualStartDateTime": "2008-03-10T00:00:00",
                "studentGradeLevel": "03"
            }
        ]
    },
    "attendance": {
        "summaries": {
            "summary": {
                "startDate": {
                    "_": "10/27/2014",
                    "$": {
                        "xsi:type": "xsd:string"
                    }
                },
                "daysInAttendance": "53.00",
                "daysAbsent": "9"
            }
        },
        "events": {
            "event": [
                //{
                //    "calendarEventDate": "09-05-2014",
                //    "dailyAttendanceStatus": "UnexcusedAbsence",
                //    "attendanceEventType": "ClassSectionAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1409875200000,
                //    "calendarEventDateString": "9/5/2014"
                //},
                //{
                //    "calendarEventDate": "09-26-2014",
                //    "dailyAttendanceStatus": "UnexcusedAbsence",
                //    "attendanceEventType": "DailyAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1411689600000,
                //    "calendarEventDateString": "9/26/2014"
                //},
                //{
                //    "calendarEventDate": "10-06-2014",
                //    "dailyAttendanceStatus": "UnexcusedAbsence",
                //    "attendanceEventType": "ClassSectionAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1412553600000,
                //    "calendarEventDateString": "10/6/2014"
                //},
                //{
                //    "calendarEventDate": "10-09-2014",
                //    "dailyAttendanceStatus": "UnexcusedAbsence",
                //    "attendanceEventType": "ClassSectionAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1412812800000,
                //    "calendarEventDateString": "10/9/2014"
                //},
                //{
                //    "calendarEventDate": "10-27-2014",
                //    "dailyAttendanceStatus": "ExcusedAbsence",
                //    "attendanceEventType": "ClassSectionAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1414368000000,
                //    "calendarEventDateString": "10/27/2014"
                //},
                //{
                //    "calendarEventDate": "10-29-2014",
                //    "dailyAttendanceStatus": "ExcusedAbsence",
                //    "attendanceEventType": "DailyAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1414540800000,
                //    "calendarEventDateString": "10/29/2014"
                //},
                //{
                //    "calendarEventDate": "10-30-2014",
                //    "dailyAttendanceStatus": "ExcusedAbsence",
                //    "attendanceEventType": "DailyAttendance",
                //    "absentAttendanceCategory": "13297",
                //    "calendarEventDateTime": 1414627200000,
                //    "calendarEventDateString": "10/30/2014"
                //},
                {
                    "calendarEventDate": "11-20-2014",
                    "dailyAttendanceStatus": "ExcusedAbsence",
                    "attendanceEventType": "DailyAttendance",
                    "absentAttendanceCategory": "13297",
                    "calendarEventDateTime": 1416441600000,
                    "calendarEventDateString": "11/20/2014"
                },
                {
                    "calendarEventDate": "11-21-2014",
                    "dailyAttendanceStatus": "ExcusedAbsence",
                    "attendanceEventType": "DailyAttendance",
                    "absentAttendanceCategory": "13297",
                    "calendarEventDateTime": 1416528000000,
                    "calendarEventDateString": "11/21/2014"
                }
            ]
        }
    },
    "disciplineIncidents": {
        "disciplineIncident": [
            {
                "incidentCategory": "04645",
                "description": "Mutual participation in an incident involving physical violence, where there is no injury to any person requiring professional medical attention.",
                "incidentDate": "11-20-2014",
                "incidentDateTime": 1414540800000
            }
        ]
    },
    "transcriptTerm": {
        "school": {
            "stateProvinceId": "37501",
            "otherIds": {
                "otherId": {
                    "type": "NCES",
                    "id": "02693"
                }
            },
            "schoolName": "Squalicum High School",
            "phoneNumber": {
                "phoneNumberType": "Work",
                "number": "3606766471",
                "primaryIndicator": "true"
            }
        },
        "schoolYear": "2015",
        "session": {
            "sessionType": "Other",
            "startDate": "0001-01-01"
        },
        "courses": {
            "course": [
                {
                    "leaCourseId": "HIS125",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Psychology 04254"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Psychology I",
                    "subject": "History"
                },
                {
                    "leaCourseId": "MAT213",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Algebra I 02052"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Algebra I",
                    "subject": "Math"
                },
                {
                    "leaCourseId": "MAT214",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Algebra I 02052"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Algebra I",
                    "subject": "Math"
                },
                {
                    "leaCourseId": "MAT321",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Mathematics Proficiency Development 02994"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Math Fundamentals",
                    "subject": "Math"
                },
                {
                    "leaCourseId": "MAT322",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Mathematics Proficiency Development 02994"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Math Fundamentals",
                    "subject": "Math"
                },
                {
                    "leaCourseId": "PED114",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Fitness/Conditioning Activities 08005"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Strength & Conditioning",
                    "subject": "Physical, Health and Safety Education"
                },
                {
                    "leaCourseId": "SCI136",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Conceptual Physics 03161"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Physics Applied",
                    "subject": "Science"
                },
                {
                    "leaCourseId": "SCI137",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "Conceptual Physics 03161"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "Physics Applied",
                    "subject": "Science"
                },
                {
                    "leaCourseId": "SPE104",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "English Language and Literature-Other 01999"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "English Skills",
                    "subject": "English Language Arts"
                },
                {
                    "leaCourseId": "SPE204",
                    "otherIds": {
                        "otherId": [
                            {
                                "type": "State",
                                "id": "English Language and Literature-Other 01999"
                            },
                            {
                                "type": "Other",
                                "id": ""
                            },
                            {
                                "type": "Other",
                                "id": ""
                            }
                        ]
                    },
                    "courseTitle": "English Skills",
                    "subject": "English Language Arts"
                }
            ]
        }
    },
    "otherTranscriptTerms": {
        "transcriptTerm": [
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {
                        "otherId": {
                            "type": "NCES",
                            "id": "02693"
                        }
                    },
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {
                        "phoneNumberType": "Work",
                        "number": "3606766471",
                        "primaryIndicator": "true"
                    }
                },
                "schoolYear": "2013",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": [
                        {
                            "leaCourseId": "ENG801",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01008 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English 9th ELL",
                            "subject": "",
                            "finalMarkValue": "B+"
                        },
                        {
                            "leaCourseId": "HIS301",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "04051 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Hist, World",
                            "subject": "",
                            "finalMarkValue": "C+"
                        },
                        {
                            "leaCourseId": "MAT213",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "02052 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Algebra 1",
                            "subject": "",
                            "finalMarkValue": "F"
                        },
                        {
                            "leaCourseId": "MAT321",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "02994 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Math Fundamenta",
                            "subject": "",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "SCI201",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "03051 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Biology",
                            "subject": "",
                            "finalMarkValue": "F"
                        },
                        {
                            "leaCourseId": "WLS201",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "06106 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Spanish for Nat",
                            "subject": "",
                            "finalMarkValue": "F"
                        }
                    ]
                }
            },
            {
                "school": "",
                "schoolYear": "2013",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": {
                        "leaCourseId": "THO101",
                        "otherIds": {
                            "otherId": [
                                {
                                    "type": "State",
                                    "id": "22999 "
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                }
                            ]
                        },
                        "courseTitle": "THOR",
                        "subject": "",
                        "finalMarkValue": "P"
                    }
                }
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {
                        "otherId": {
                            "type": "NCES",
                            "id": "02693"
                        }
                    },
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {
                        "phoneNumberType": "Work",
                        "number": "3606766471",
                        "primaryIndicator": "true"
                    }
                },
                "schoolYear": "2013",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": [
                        {
                            "leaCourseId": "CTF201",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "19055 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Psych of Childr",
                            "subject": "",
                            "finalMarkValue": "D+"
                        },
                        {
                            "leaCourseId": "ENG151",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01203 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English Support",
                            "subject": "",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "ENG802",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01008 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English 9th ELL",
                            "subject": "",
                            "finalMarkValue": "C+"
                        },
                        {
                            "leaCourseId": "HIS302",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "04051 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Hist, World",
                            "subject": "",
                            "finalMarkValue": "B-"
                        },
                        {
                            "leaCourseId": "MUS231",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "05110 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Choir Mixed",
                            "subject": "",
                            "finalMarkValue": "C"
                        },
                        {
                            "leaCourseId": "SPE202",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "02999 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Math Skills",
                            "subject": "",
                            "finalMarkValue": "B+"
                        }
                    ]
                }
            },
            {
                "school": "",
                "schoolYear": "2013",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": {
                        "leaCourseId": "THO102",
                        "otherIds": {
                            "otherId": [
                                {
                                    "type": "State",
                                    "id": "22999 "
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                }
                            ]
                        },
                        "courseTitle": "THOR",
                        "subject": "",
                        "finalMarkValue": "P"
                    }
                }
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {
                        "otherId": {
                            "type": "NCES",
                            "id": "02693"
                        }
                    },
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {
                        "phoneNumberType": "Work",
                        "number": "3606766471",
                        "primaryIndicator": "true"
                    }
                },
                "schoolYear": "2014",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": [
                        {
                            "leaCourseId": "PED132",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "08002 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Team Sports",
                            "subject": "108",
                            "finalMarkValue": "A"
                        },
                        {
                            "leaCourseId": "SCI202",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "03051 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Biology",
                            "subject": "5",
                            "finalMarkValue": "D+"
                        },
                        {
                            "leaCourseId": "SPE202",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "02999 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Math Skills",
                            "subject": "4",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "SPE204",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01999 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English Skills",
                            "subject": "2",
                            "finalMarkValue": "D"
                        },
                        {
                            "leaCourseId": "ENG151",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01203 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English Support",
                            "subject": "2",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "HIS202",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "04101 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Hist, US",
                            "subject": "7",
                            "finalMarkValue": "C"
                        }
                    ]
                }
            },
            {
                "school": "",
                "schoolYear": "2014",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": {
                        "leaCourseId": "THO102",
                        "otherIds": {
                            "otherId": [
                                {
                                    "type": "State",
                                    "id": "22999 "
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                },
                                {
                                    "type": "Other",
                                    "id": ""
                                }
                            ]
                        },
                        "courseTitle": "THOR",
                        "subject": "122",
                        "finalMarkValue": "P"
                    }
                }
            },
            {
                "school": {
                    "stateProvinceId": "37501",
                    "otherIds": {
                        "otherId": {
                            "type": "NCES",
                            "id": "02693"
                        }
                    },
                    "schoolName": "Squalicum High School",
                    "phoneNumber": {
                        "phoneNumberType": "Work",
                        "number": "3606766471",
                        "primaryIndicator": "true"
                    }
                },
                "schoolYear": "2014",
                "session": {
                    "sessionType": "Other",
                    "startDate": "0001-01-01"
                },
                "courses": {
                    "course": [
                        {
                            "leaCourseId": "ENG150",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01203 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English Support",
                            "subject": "2",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "HIS201",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "04101 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Hist, US",
                            "subject": "7",
                            "finalMarkValue": "D"
                        },
                        {
                            "leaCourseId": "PED133",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "08004 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Yoga",
                            "subject": "108",
                            "finalMarkValue": "B"
                        },
                        {
                            "leaCourseId": "SCI201",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "03051 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Biology",
                            "subject": "5",
                            "finalMarkValue": "F"
                        },
                        {
                            "leaCourseId": "SPE102",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "02999 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "Math Skills",
                            "subject": "4",
                            "finalMarkValue": "P"
                        },
                        {
                            "leaCourseId": "SPE104",
                            "otherIds": {
                                "otherId": [
                                    {
                                        "type": "State",
                                        "id": "01999 "
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    },
                                    {
                                        "type": "Other",
                                        "id": ""
                                    }
                                ]
                            },
                            "courseTitle": "English Skills",
                            "subject": "2",
                            "finalMarkValue": "C"
                        }
                    ]
                }
            }
        ]
    },
    "programs": {
        "lep": {
            "lepStatus": "Yes",
            "entryDate": "2014-09-02"
        },
        "homeless": "No"
    },
    "lastUpdated": "08/27/2015 09:05:40"
};


console.log(require('prettyjson').render(new Attendance(data).getAttendances()));
//new Attendance(data).getAttendances();