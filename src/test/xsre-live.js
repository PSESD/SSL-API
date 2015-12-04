/**
 * Created by zaenal on 28/08/15.
 */
'use strict';
var xSre = require(__dirname+'/../lib/xsre');

var fs = require('fs');
var xmlFile = __dirname + '/data/xsre.xml';
var parseString = require('xml2js').parseString;
fs.readFile(xmlFile, function(err, data) {
      if(err) {
            return console.log(err);
      }

      parseString(data, {
            normalize: true,
            explicitArray: false,
            parseBooleans: true,
            parseNumbers: true,
            stripPrefix: true,
            firstCharLowerCase: true,
            ignoreAttrs: true
      }, function (err, result) {

            if(err) {
                  return console.log(err);
            }
            //console.log(require('prettyjson').render(new xSre(result).getTranscript().getTranscript()));
            //console.log(require('prettyjson').render(new xSre(result).getAttendanceBehavior().getAttendances()));
            console.log(require('prettyjson').render(new xSre(result).getTranscript().getTranscript()));
            //new xSre(result).getAttendanceBehavior().getAttendances();
      });

});
