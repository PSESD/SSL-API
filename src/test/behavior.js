/**
 * Created by zaenal on 27/08/15.
 */
var Attendance = require(__dirname+'/../lib/attendance');
var xmlFile = __dirname + '/sample1.xml';
var fs = require('fs');
var parseString = require('xml2js').parseString;
fs.readFile(xmlFile, function(err, data) {
    if(err) return console.log(err);
    var cleanedString = data.toString().replace("\ufeff", "");
    console.log(cleanedString);
    parseString(cleanedString, { explicitArray: false }, function (err, result) {

        if(err) return console.log(err);

        var json = result.xSre;

        delete json['$'];

        //if(!_.isArray(json.attendance.summaries.summary)){
        //
        //    json.attendance.summaries.summary = [ json.attendance.summaries.summary ];
        //
        //}

        json.attendanceBehaviors = new Attendance(json).getAttendances();

        json.lastUpdated = require('moment')().format('MM/DD/YYYY HH:mm:ss');

        console.log(require('prettyjson').render(json));
    });
});

//parseString(body, { explicitArray: false }, function (err, result) {
//
//    if(err) return console.log(err);
//
//    var json = (result && 'error' in result) ? result.error.message : console.log(result);
//
//    console.log(err);
//});
