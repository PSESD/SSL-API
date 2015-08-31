/**
 * Created by zaenal on 28/08/15.
 */

var xSre = require(__dirname+'/../lib/xsre');

var fs = require('fs');
var xmlFile = __dirname + '/transcript.xml';
var parseString = require('xml2js').parseString;
fs.readFile(xmlFile, function(err, data) {
    if(err) return console.log(err);

    parseString(data, { explicitArray: false }, function (err, result) {

        if(err) return console.log(err);

        console.log(require('prettyjson').render(new xSre(result).getTranscript().getTranscript()));
    });
});

//new Transcript(obj).getTranscript();
//console.log(require('prettyjson').render(new xSre(obj).getTranscript().getTranscript()));