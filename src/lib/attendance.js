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
            s = s.add(1, 'days');
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
    this.allEvents = [];
    this.minDateCalendar = 0;
    this.maxDateCalendar = 0;
    this.attendanceBehaviors = [];
    this.allDates = [];
    this.weeks = [];

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

    var _this = this;

    if(!_this.attendances) return attendanceBehaviors;

    var mm = null;

    _this.attendances.events.event.forEach(function(event){

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

                obj[event.calendarEventDate].absentAttendanceCategoryTitle = obj[event.calendarEventDate].absentAttendanceCategory in _this.facets ? _this.facets[obj[event.calendarEventDate].absentAttendanceCategory] : '';

            }

            if('presentAttendanceCategory' in event) {

                obj[event.calendarEventDate].presentAttendanceCategory = parseInt(event.presentAttendanceCategory);

                obj[event.calendarEventDate].presentAttendanceCategoryTitle = obj[event.calendarEventDate].presentAttendanceCategory in _this.facets ? _this.facets[obj[event.calendarEventDate].presentAttendanceCategory] : '';

            }

            if('attendanceEventType' in event) {

                obj[event.calendarEventDate].attendanceEventType = event.attendanceEventType;

                obj[event.calendarEventDate].attendanceEventTypeTitle = event.attendanceEventType in _this.facets ? _this.facets[event.attendanceEventType] : '';
            }

            if('dailyAttendanceStatus' in event) {

                obj[event.calendarEventDate].attendanceStatus = event.dailyAttendanceStatus;

                obj[event.calendarEventDate].attendanceStatusTitle = event.dailyAttendanceStatus in _this.facets ? _this.facets[event.dailyAttendanceStatus] : '';

            }

            event.calendarEventDate = mm.format('MM-DD-YYYY');

            delete event.school;

            _this.allDates.push(event.calendarEventDateTime);



            _this.allEvents.push(obj);

        }

    });

    _this.minDateCalendar = _.min(_this.allDates);

    _this.maxDateCalendar = _.max(_this.allDates);

    _this.weeks = moment(_this.minDateCalendar).weeksTo(moment(_this.maxDateCalendar), 'MM/DD/YYYY');


    var behavior = {};

    _this.weeks.forEach(function(week){

        var ikey = week.startString + ' - ' + week.endString;

        var e = week.startString in _this.allEvents ? _this.allEvents[week.startString] : null;

        behavior = {
            weekDate: ikey,
            m: 'N/A',
            t: 'N/A',
            w: 'N/A',
            th: 'N/A',
            f: 'N/A',
            weeklyChange: 'N/A',
            periods : [],
            event: e
        };

        if(e !== null){

            if(behavior.attendanceStatus === 'DailyAttendance'){

                switch (behavior.attendanceEventType.toLowerCase()){

                    case 'present':

                        break;

                    case 'absence':

                        break;

                }

            }


        }

        var behaviors = {};

        behaviors[ikey] = behavior;

        _this.attendanceBehaviors.push(behaviors);

    });

    _this.attendanceBehaviors.reverse();

    return _this.attendanceBehaviors;

};

/**
 *
 * @type {Attendance}
 */
module.exports = Attendance;