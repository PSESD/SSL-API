'use strict';
var fs = require('fs');
var util = require('util');

function CodeSet(){
    this.filename = __dirname + '/config.js';
}

/**
 *
 * @returns {*}
 */
CodeSet.prototype.get = function(){

    return require(this.filename);

};

/**
 *
 */
CodeSet.prototype.parse = function(){

    var file = require(__dirname + '/json-codeset.json');

    var codeSets = {};

    file.codeSet.forEach(function(codeSet, key){

        codeSets[codeSet.id] = {};

        codeSet.codeItems.codeItem.forEach(function(codeItem){

            delete codeItem.action;

            delete codeItem.timestamp;

            codeSets[codeSet.id][codeItem.code] = codeItem;

        });

    });

    var io = util.inspect(codeSets, false, null);

    fs.writeFile(this.filename, 'module.exports = ' + io + ';', function (err) {

        if (err) {
            throw err;
        }

        console.log('It\'s saved!');

        console.log(Object.keys(require(__dirname + '/config.js')));

    });

    console.log(io);

};




module.exports = CodeSet;