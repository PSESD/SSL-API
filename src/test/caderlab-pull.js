/**
 * Created by zaenal on 28/08/15.
 */
'use strict';
var fs = require('fs');
var xmlFile = __dirname + '/data/Helping Hand CBO.xml';
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
        ignoreAttrs: false
    }, function (err, result) {

        if(err) {
            return console.log(err);
        }

        console.log(require('prettyjson').render(result));
    });

});
