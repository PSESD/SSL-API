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

data = {"_links":{"self":{"href":"/55913fc817aac10c2bbfe1e8/students/55d24c418c55b9ea0068abfc/xsre"}},"_embedded":{"users":[{"_links":{"self":{"href":"/55913fc817aac10c2bbfe1e8/users/55913fc806d86a0c0077fbc2"}},"id":"55913fc806d86a0c0077fbc2","email":"abraham@upwardstech.com","fullname":""},{"_links":{"self":{"href":"/55913fc817aac10c2bbfe1e8/users/55913fc906d86a0c0077fbc6"}},"id":"55913fc906d86a0c0077fbc6","email":"demo@upwardstech.com","fullname":"User CBO Demo"}],"programs":[]},"name":{"familyName":"Richards","givenName":"Reed","middleName":""},"localId":"Sample1","otherIds":{"otherId":{"type":"State","id":"1234567890"}},"demographics":{"races":{"race":{"race":"HispanicLatino"}},"sex":"Male","birthDate":"1998-11-21"},"reportDate":"2015-08-03","assessments":{"assessment":[{"name":"SBA","actualStartDateTime":"2015-03-10T00:00:00","studentGradeLevel":"11"},{"name":"ALG ","actualStartDateTime":"2015-01-02T00:00:00","studentGradeLevel":"10"},{"name":"ALG ","actualStartDateTime":"2014-03-10T00:00:00","studentGradeLevel":"09"},{"name":"MSP ","actualStartDateTime":"2013-03-12T00:00:00","studentGradeLevel":"08"},{"name":"MSP ","actualStartDateTime":"2013-03-12T00:00:00","studentGradeLevel":"08"},{"name":"MSP ","actualStartDateTime":"2013-03-12T00:00:00","studentGradeLevel":"08"},{"name":"MSP ","actualStartDateTime":"2012-03-13T00:00:00","studentGradeLevel":"07"},{"name":"MSP ","actualStartDateTime":"2012-03-13T00:00:00","studentGradeLevel":"07"},{"name":"MSP ","actualStartDateTime":"2012-03-13T00:00:00","studentGradeLevel":"07"},{"name":"MSP ","actualStartDateTime":"2011-03-17T00:00:00","studentGradeLevel":"06"},{"name":"MSP ","actualStartDateTime":"2011-03-17T00:00:00","studentGradeLevel":"06"},{"name":"MSP ","actualStartDateTime":"2010-03-16T00:00:00","studentGradeLevel":"05"},{"name":"MSP ","actualStartDateTime":"2010-03-16T00:00:00","studentGradeLevel":"05"},{"name":"MSP ","actualStartDateTime":"2010-03-16T00:00:00","studentGradeLevel":"05"},{"name":"WASL","actualStartDateTime":"2009-03-16T00:00:00","studentGradeLevel":"04"},{"name":"WASL","actualStartDateTime":"2009-03-16T00:00:00","studentGradeLevel":"04"},{"name":"WASL","actualStartDateTime":"2009-03-16T00:00:00","studentGradeLevel":"04"},{"name":"WASL","actualStartDateTime":"2008-03-10T00:00:00","studentGradeLevel":"03"},{"name":"WASL","actualStartDateTime":"2008-03-10T00:00:00","studentGradeLevel":"03"}]},"attendance":{"summaries":{"summary":{"startDate":{"_":"10/1/2014","$":{"xsi:type":"xsd:string"}},"daysInAttendance":"43.00","daysAbsent":"40"}},"events":{"event":[{"calendarEventDate":"09-05-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1409875200000,"calendarEventDateString":"9/5/2014"},{"calendarEventDate":"09-11-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1410393600000,"calendarEventDateString":"9/11/2014"},{"calendarEventDate":"09-15-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1410739200000,"calendarEventDateString":"9/15/2014"},{"calendarEventDate":"09-16-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1410825600000,"calendarEventDateString":"9/16/2014"},{"calendarEventDate":"09-17-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1410912000000,"calendarEventDateString":"9/17/2014"},{"calendarEventDate":"09-19-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1411084800000,"calendarEventDateString":"9/19/2014"},{"calendarEventDate":"09-23-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1411430400000,"calendarEventDateString":"9/23/2014"},{"calendarEventDate":"09-25-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1411603200000,"calendarEventDateString":"9/25/2014"},{"calendarEventDate":"09-26-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1411689600000,"calendarEventDateString":"9/26/2014"},{"calendarEventDate":"09-29-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1411948800000,"calendarEventDateString":"9/29/2014"},{"calendarEventDate":"09-30-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412035200000,"calendarEventDateString":"9/30/2014"},{"calendarEventDate":"10-01-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412121600000,"calendarEventDateString":"10/1/2014"},{"calendarEventDate":"10-02-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412208000000,"calendarEventDateString":"10/2/2014"},{"calendarEventDate":"10-03-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412294400000,"calendarEventDateString":"10/3/2014"},{"calendarEventDate":"10-06-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412553600000,"calendarEventDateString":"10/6/2014"},{"calendarEventDate":"10-07-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412640000000,"calendarEventDateString":"10/7/2014"},{"calendarEventDate":"10-08-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1412726400000,"calendarEventDateString":"10/8/2014"},{"calendarEventDate":"10-13-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413158400000,"calendarEventDateString":"10/13/2014"},{"calendarEventDate":"10-14-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413244800000,"calendarEventDateString":"10/14/2014"},{"calendarEventDate":"10-16-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413417600000,"calendarEventDateString":"10/16/2014"},{"calendarEventDate":"10-17-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413504000000,"calendarEventDateString":"10/17/2014"},{"calendarEventDate":"10-20-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413763200000,"calendarEventDateString":"10/20/2014"},{"calendarEventDate":"10-22-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1413936000000,"calendarEventDateString":"10/22/2014"},{"calendarEventDate":"10-23-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414022400000,"calendarEventDateString":"10/23/2014"},{"calendarEventDate":"10-24-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414108800000,"calendarEventDateString":"10/24/2014"},{"calendarEventDate":"10-27-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414368000000,"calendarEventDateString":"10/27/2014"},{"calendarEventDate":"10-29-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414540800000,"calendarEventDateString":"10/29/2014"},{"calendarEventDate":"10-30-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414627200000,"calendarEventDateString":"10/30/2014"},{"calendarEventDate":"10-31-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1414713600000,"calendarEventDateString":"10/31/2014"},{"calendarEventDate":"11-06-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1415232000000,"calendarEventDateString":"11/6/2014"},{"calendarEventDate":"11-10-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1415577600000,"calendarEventDateString":"11/10/2014"},{"calendarEventDate":"11-13-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1415836800000,"calendarEventDateString":"11/13/2014"},{"calendarEventDate":"11-14-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1415923200000,"calendarEventDateString":"11/14/2014"},{"calendarEventDate":"11-17-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416182400000,"calendarEventDateString":"11/17/2014"},{"calendarEventDate":"11-18-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416268800000,"calendarEventDateString":"11/18/2014"},{"calendarEventDate":"11-19-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416355200000,"calendarEventDateString":"11/19/2014"},{"calendarEventDate":"11-20-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416441600000,"calendarEventDateString":"11/20/2014"},{"calendarEventDate":"11-21-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416528000000,"calendarEventDateString":"11/21/2014"},{"calendarEventDate":"11-24-2014","dailyAttendanceStatus":"UnexcusedAbsence","attendanceEventType":"ClassSectionAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416787200000,"calendarEventDateString":"11/24/2014"},{"calendarEventDate":"11-25-2014","dailyAttendanceStatus":"ExcusedAbsence","attendanceEventType":"DailyAttendance","absentAttendanceCategory":"13297","calendarEventDateTime":1416873600000,"calendarEventDateString":"11/25/2014"}]}},"disciplineIncidents":{"disciplineIncident":[{"incidentCategory":"04704","description":"All other behavior which resulted in a short-term suspension, long-term suspension, expulsion, or interim alternative education setting.","incidentDate":"10-03-2014","incidentDateTime":1412294400000}]},"transcriptTerm":{"school":{"stateProvinceId":"17408","otherIds":{"otherId":{"type":"NCES","id":"00032"}},"schoolName":"Auburn Senior High School","phoneNumber":{"phoneNumberType":"Work","number":"253.931.4880","primaryIndicator":"true"}},"schoolYear":"2015","session":{"sessionType":"Other","startDate":"0001-01-01"},"courses":{"course":[{"leaCourseId":"CTE351","otherIds":{"otherId":[{"type":"State","id":"Jewelry 05166"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"JEWELRY METAL SCULPTURE 1","subject":"Communications and Audio/Visual Technology"},{"leaCourseId":"CTE421","otherIds":{"otherId":[{"type":"State","id":"Small Engine Mechanics 20110"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"SMALL GAS ENGINE 1","subject":"Transportation, Distribution and Logistics"},{"leaCourseId":"CTE422","otherIds":{"otherId":[{"type":"State","id":"Small Engine Mechanics 20110"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"SMALL GAS ENGINE 2","subject":"Transportation, Distribution and Logistics"},{"leaCourseId":"ELL120","otherIds":{"otherId":[{"type":"State","id":"Study Skills 22003"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL STUDY SKILLS 1","subject":"Miscellaneous"},{"leaCourseId":"ELL121","otherIds":{"otherId":[{"type":"State","id":"Study Skills 22003"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL STUDY SKILLS 2","subject":"Miscellaneous"},{"leaCourseId":"ELL301","otherIds":{"otherId":[{"type":"State","id":"English as a Second Language 01008"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL LAN ART 3A","subject":"English Language Arts"},{"leaCourseId":"ELL302","otherIds":{"otherId":[{"type":"State","id":"English as a Second Language 01008"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL LAN ART 3B","subject":"English Language Arts"},{"leaCourseId":"MAT120","otherIds":{"otherId":[{"type":"State","id":"Algebra I 02052"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ALGEBRA 1","subject":"Math"},{"leaCourseId":"MAT120","otherIds":{"otherId":[{"type":"State","id":"Algebra I 02052"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ALGEBRA 1","subject":"Math"},{"leaCourseId":"MAT121","otherIds":{"otherId":[{"type":"State","id":"Algebra I 02052"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ALGEBRA 2","subject":"Math"},{"leaCourseId":"SCI202","otherIds":{"otherId":[{"type":"State","id":"Biology 03051"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"BIOLOGY 1","subject":"Science"},{"leaCourseId":"SCI203","otherIds":{"otherId":[{"type":"State","id":"Biology 03051"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"BIOLOGY 2","subject":"Science"},{"leaCourseId":"SOC400","otherIds":{"otherId":[{"type":"State","id":"World Area Studies 04061"},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"GLOBAL ISSUES","subject":"Civics and Government"}]}},"otherTranscriptTerms":{"transcriptTerm":[{"school":"","schoolYear":"2013","session":{"sessionType":"Other","startDate":"0001-01-01"},"courses":{"course":[{"leaCourseId":"FORCMP","otherIds":{"otherId":[{"type":"State","id":"06861 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"MARSHALLESE 1-2","subject":"","finalMarkValue":"P"},{"leaCourseId":"FORCMP","otherIds":{"otherId":[{"type":"State","id":"06862 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"MARSHALLESE 3-4","subject":"","finalMarkValue":"P"},{"leaCourseId":"FORCMP","otherIds":{"otherId":[{"type":"State","id":"06863 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"MARSHALLESE 5-6","subject":"","finalMarkValue":"P"},{"leaCourseId":"FORCMP","otherIds":{"otherId":[{"type":"State","id":"06864 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"MARSHALLESE 7-8","subject":"","finalMarkValue":"P"}]}},{"school":{"stateProvinceId":"17408","otherIds":{"otherId":{"type":"NCES","id":"00032"}},"schoolName":"Auburn Senior High School","phoneNumber":{"phoneNumberType":"Work","number":"253.931.4880","primaryIndicator":"true"}},"schoolYear":"2014","session":{"sessionType":"Other","startDate":"0001-01-01"},"courses":{"course":[{"leaCourseId":"CTE303","otherIds":{"otherId":[{"type":"State","id":"22249 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"HEALTH CTE","subject":"","finalMarkValue":"D"},{"leaCourseId":"ELL120","otherIds":{"otherId":[{"type":"State","id":"22003 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL STDY SKILL1","subject":"","finalMarkValue":"D"},{"leaCourseId":"ELL201","otherIds":{"otherId":[{"type":"State","id":"01008 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL LAN ART 2A","subject":"","finalMarkValue":"C"},{"leaCourseId":"GEN101","otherIds":{"otherId":[{"type":"State","id":"22102 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ORIENTATION","subject":"","finalMarkValue":"F"},{"leaCourseId":"MAT120","otherIds":{"otherId":[{"type":"State","id":"02052 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ALGEBRA 1","subject":"","finalMarkValue":"F"},{"leaCourseId":"PHY101","otherIds":{"otherId":[{"type":"State","id":"08001 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"INTRO PE","subject":"","finalMarkValue":"B-"}]}},{"school":{"stateProvinceId":"17408","otherIds":{"otherId":{"type":"NCES","id":"00032"}},"schoolName":"Auburn Senior High School","phoneNumber":{"phoneNumberType":"Work","number":"253.931.4880","primaryIndicator":"true"}},"schoolYear":"2014","session":{"sessionType":"Other","startDate":"0001-01-01"},"courses":{"course":[{"leaCourseId":"CTE455","otherIds":{"otherId":[{"type":"State","id":"13054 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"WOODWRK DESGN 1","subject":"","finalMarkValue":"D"},{"leaCourseId":"ELL121","otherIds":{"otherId":[{"type":"State","id":"22003 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL STDY SKILL2","subject":"","finalMarkValue":"F"},{"leaCourseId":"ELL202","otherIds":{"otherId":[{"type":"State","id":"01008 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ELL LAN ART 2B","subject":"","finalMarkValue":"F"},{"leaCourseId":"MAT121","otherIds":{"otherId":[{"type":"State","id":"02052 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"ALGEBRA 2","subject":"","finalMarkValue":"F"},{"leaCourseId":"SCI101","otherIds":{"otherId":[{"type":"State","id":"03159 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"SCIENCE LINKS","subject":"","finalMarkValue":"F"},{"leaCourseId":"SOC101","otherIds":{"otherId":[{"type":"State","id":"04052 "},{"type":"Other","id":""},{"type":"Other","id":""}]},"courseTitle":"WORLD STUDIES","subject":"","finalMarkValue":"F"}]}}]},"programs":{"lep":{"lepStatus":"Yes","entryDate":"2014-09-03"},"homeless":"No"},"attendanceBehaviors":[{"11/24/2014 - 11/30/2014":{"weekDate":"11/24/2014 - 11/30/2014","summary":{"title":"11/17/2014 - 11/23/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["11/24/2014 - 11/30/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["11/24/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["11/25/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"11/25/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"W":["11/26/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["11/27/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["11/28/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"11/24/2014 - 11/30/2014","M":"11/24/2014","T":"11/25/2014","W":"11/26/2014","TH":"11/27/2014","F":"11/28/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"ExcusedAbsence","event":{"calendarEventDate":"11/25/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["11/24/2014 - 11/30/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"11/17/2014 - 11/23/2014":{"weekDate":"11/17/2014 - 11/23/2014","summary":{"title":"11/10/2014 - 11/16/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["11/17/2014 - 11/23/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["11/17/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["11/18/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["11/19/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["11/20/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/20/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"F":["11/21/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/21/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"11/17/2014 - 11/23/2014","M":"11/17/2014","T":"11/18/2014","W":"11/19/2014","TH":"11/20/2014","F":"11/21/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/20/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"F":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/21/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"}],"periods":["11/17/2014 - 11/23/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"11/10/2014 - 11/16/2014":{"weekDate":"11/10/2014 - 11/16/2014","summary":{"title":"11/03/2014 - 11/09/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["11/10/2014 - 11/16/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["11/10/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/10/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"T":["11/11/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["11/12/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["11/13/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["11/14/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"11/10/2014 - 11/16/2014","M":"11/10/2014","T":"11/11/2014","W":"11/12/2014","TH":"11/13/2014","F":"11/14/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"11/10/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["11/10/2014 - 11/16/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"11/03/2014 - 11/09/2014":{"weekDate":"11/03/2014 - 11/09/2014","summary":{"title":"10/27/2014 - 11/02/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["11/03/2014 - 11/09/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["11/03/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["11/04/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["11/05/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["11/06/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["11/07/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"11/03/2014 - 11/09/2014","M":"11/03/2014","T":"11/04/2014","W":"11/05/2014","TH":"11/06/2014","F":"11/07/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["11/03/2014 - 11/09/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"10/27/2014 - 11/02/2014":{"weekDate":"10/27/2014 - 11/02/2014","summary":{"title":"10/20/2014 - 10/26/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["10/27/2014 - 11/02/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["10/27/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["10/28/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["10/29/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["10/30/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["10/31/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/31/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"10/27/2014 - 11/02/2014","M":"10/27/2014","T":"10/28/2014","W":"10/29/2014","TH":"10/30/2014","F":"10/31/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/31/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"}],"periods":["10/27/2014 - 11/02/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"10/20/2014 - 10/26/2014":{"weekDate":"10/20/2014 - 10/26/2014","summary":{"title":"10/13/2014 - 10/19/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["10/20/2014 - 10/26/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["10/20/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["10/21/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["10/22/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"10/22/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"TH":["10/23/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["10/24/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"10/24/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"10/20/2014 - 10/26/2014","M":"10/20/2014","T":"10/21/2014","W":"10/22/2014","TH":"10/23/2014","F":"10/24/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"10/22/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"10/24/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"}],"periods":["10/20/2014 - 10/26/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"10/13/2014 - 10/19/2014":{"weekDate":"10/13/2014 - 10/19/2014","summary":{"title":"10/06/2014 - 10/12/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["10/13/2014 - 10/19/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["10/13/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/13/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"T":["10/14/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["10/15/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["10/16/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["10/17/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"10/13/2014 - 10/19/2014","M":"10/13/2014","T":"10/14/2014","W":"10/15/2014","TH":"10/16/2014","F":"10/17/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/13/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["10/13/2014 - 10/19/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"10/06/2014 - 10/12/2014":{"weekDate":"10/06/2014 - 10/12/2014","summary":{"title":"09/29/2014 - 10/05/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["10/06/2014 - 10/12/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["10/06/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/6/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"T":["10/07/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/7/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"W":["10/08/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["10/09/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["10/10/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"10/06/2014 - 10/12/2014","M":"10/06/2014","T":"10/07/2014","W":"10/08/2014","TH":"10/09/2014","F":"10/10/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/6/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"T":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/7/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":"N/A","T":"N/A","W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["10/06/2014 - 10/12/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"09/29/2014 - 10/05/2014":{"weekDate":"09/29/2014 - 10/05/2014","summary":{"title":"09/22/2014 - 09/28/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["09/29/2014 - 10/05/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["09/29/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"9/29/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"T":["09/30/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["10/01/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/1/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"TH":["10/02/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["10/03/2014",{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/3/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"N/A","N/A","N/A","N/A","N/A"],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"09/29/2014 - 10/05/2014","M":"09/29/2014","T":"09/30/2014","W":"10/01/2014","TH":"10/02/2014","F":"10/03/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"ExcusedAbsence","event":{"calendarEventDate":"9/29/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/1/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"ExcusedAbsence","event":{"calendarEventDate":"10/3/2014","attendanceStatus":"ExcusedAbsence","attendanceStatusTitle":"Not present but is temporarily excused from attendance because the person is: 1) is ill and attendance would endanger his or her health or the health of others; 2) has an immediate family member who is seriously ill or has died; 3) is observing a recognized religious holiday of his or her faith; or 4) is otherwise excused in accordance with policies.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"excused"}},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"},{"title":"N/A","M":"N/A","T":{"value":"N/A","event":null,"slug":""},"W":"N/A","TH":{"value":"N/A","event":null,"slug":""},"F":"N/A"}],"periods":["09/29/2014 - 10/05/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[{"incidentDate":"2014-10-03","description":"All other behavior which resulted in a short-term suspension, long-term suspension, expulsion, or interim alternative education setting.","incidentCategory":4704,"incidentCategoryTitle":""}]},"weeklyChange":"0.00%"}},{"09/22/2014 - 09/28/2014":{"weekDate":"09/22/2014 - 09/28/2014","summary":{"title":"09/15/2014 - 09/21/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["09/22/2014 - 09/28/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["09/22/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["09/23/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["09/24/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["09/25/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"9/25/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"F":["09/26/2014",{"value":"UnexcusedAbsence","event":{"calendarEventDate":"9/26/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"N/A","N/A","N/A","N/A","N/A"],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"09/22/2014 - 09/28/2014","M":"09/22/2014","T":"09/23/2014","W":"09/24/2014","TH":"09/25/2014","F":"09/26/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"9/25/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"},"F":{"value":"UnexcusedAbsence","event":{"calendarEventDate":"9/26/2014","attendanceStatus":"UnexcusedAbsence","attendanceStatusTitle":"Not present without acceptable cause or authorization.","attendanceEventType":"DailyAttendance","attendanceEventTypeTitle":"Daily attendance","absentAttendanceCategory":13297,"absentAttendanceCategoryTitle":"Disciplinary action, not receiving instruction","presentAttendanceCategory":null,"presentAttendanceCategoryTitle":null,"timeTablePeriod":null},"slug":"unexcused"}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":"N/A","F":"N/A"}],"periods":["09/22/2014 - 09/28/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"09/15/2014 - 09/21/2014":{"weekDate":"09/15/2014 - 09/21/2014","summary":{"title":"09/08/2014 - 09/14/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["09/15/2014 - 09/21/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["09/15/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["09/16/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["09/17/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["09/18/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["09/19/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"09/15/2014 - 09/21/2014","M":"09/15/2014","T":"09/16/2014","W":"09/17/2014","TH":"09/18/2014","F":"09/19/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["09/15/2014 - 09/21/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"09/08/2014 - 09/14/2014":{"weekDate":"09/08/2014 - 09/14/2014","summary":{"title":"09/01/2014 - 09/07/2014","M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["09/08/2014 - 09/14/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["09/08/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["09/09/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["09/10/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["09/11/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["09/12/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"09/08/2014 - 09/14/2014","M":"09/08/2014","T":"09/09/2014","W":"09/10/2014","TH":"09/11/2014","F":"09/12/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["09/08/2014 - 09/14/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}},{"09/01/2014 - 09/07/2014":{"weekDate":"09/01/2014 - 09/07/2014","summary":{"M":"0.00%","T":"0.00%","W":"0.00%","TH":"0.00%","F":"0.00%","weeklyChange":"0.00%"},"detailColumns":{"periods":["09/01/2014 - 09/07/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"M":["09/01/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"T":["09/02/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"W":["09/03/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"TH":["09/04/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"F":["09/05/2014",{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""},{"value":"N/A","event":null,"slug":""}],"weeklyChange":["N/A",null,null,null,null,null,null]},"details":[{"title":"09/01/2014 - 09/07/2014","M":"09/01/2014","T":"09/02/2014","W":"09/03/2014","TH":"09/04/2014","F":"09/05/2014","weeklyChange":"N/A"},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}},{"title":"N/A","M":{"value":"N/A","event":null,"slug":""},"T":{"value":"N/A","event":null,"slug":""},"W":{"value":"N/A","event":null,"slug":""},"TH":{"value":"N/A","event":null,"slug":""},"F":{"value":"N/A","event":null,"slug":""}}],"periods":["09/01/2014 - 09/07/2014","N/A","N/A","N/A","N/A","N/A","N/A"],"behaviors":{"M":[],"T":[],"W":[],"TH":[],"F":[]},"weeklyChange":"0.00%"}}],"lastUpdated":"08/27/2015 10:23:02"};
//console.log(require('prettyjson').render(new Attendance(data).getAttendances()));
new Attendance(data).getAttendances();