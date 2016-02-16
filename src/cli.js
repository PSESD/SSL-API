/**
 * Created by zaenal on 08/01/16.
 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//process.env.NODE_ENV = 'test';
var bs = require('nodestalker'),
    tube = 'test_tube',
    what = process.argv.slice(2)[0],
    client = bs.Client('127.0.0.1:11300');
var config = require('config');
var studentCollector = require('./lib/cli/studentCollector');
var tokenCleaner = require('./lib/cli/tokenCleaner');
var request = require('./lib/cli/request');
var utils = require('./lib/utils');
var con = require('./lib/cli/mysql');
var codeSet = require('./lib/xsre/codeset');
var parseString = require('xml2js').parseString;
var rollbar = require('rollbar');
var rollbarEnv = config.util.getEnv('NODE_ENV');

var rollbarAccessToken = config.get('rollbar.access_token');
rollbar.init(rollbarAccessToken, {
    environment: rollbarEnv
});
// Configure the library to send errors to api.rollbar.com
rollbar.handleUncaughtExceptions(rollbarAccessToken, { exitOnUncaughtException: true });

function processJob(job, callback){
    // doing something really expensive
    console.log('processing...');
    setTimeout(function(){
        var objectData = JSON.parse(job.data);
        console.log('PUSH DATA: ', objectData);
         //request.push(objectData.content, callback);
    }, 1000);
}

process.on('uncaughtException', function (err) {

    utils.log(err, 'error');

});
/**
 *
 */
function resJob(){
    client.watch(tube).onSuccess(function(data){
        client.reserve().onSuccess(function(job){
            console.log('received job:', job);

            processJob(job, function(){
                client.deleteJob(job.id).onSuccess(function(del_msg){
                    console.log('deleted', job);
                    console.log(del_msg);
                    //client.disconnect();
                });
                console.log('processed', job);
            });
        });
    });
}

function pullJob(){
    console.log('PULL CALL HERE');
    client.use(tube).onSuccess(function(data){

        studentCollector.collect(function(bulkStudent){
            //console.log(student);
            client.put(bulkStudent).onSuccess(function(job_id){
                console.log('DATA: ', job_id);
            });
        });

    });
}

switch(what){
    case 'test':
        console.log('HALLO');
        break;
    case 'pull':
        pullJob();
        break;
    case 'dump-districtid':
        studentCollector.dumpDataDistrictId(function(){
            process.exit();
        });
        break;
    case 'cache-debug':
        studentCollector.cacheDebug(function(){
            process.exit();
        });
        break;
    case 'generate-xml':
        studentCollector.collect(function(bulkStudent){
            require('fs').writeFile(__dirname + '/data/CBOStudents-data.xml', bulkStudent, function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
                process.exit();
            });
        });
        break;
    case 'push-cedarlabs':
        studentCollector.collect(function(bulkStudent){
                require('fs').writeFile(__dirname + '/data/REQUEST-CBOStudents.xml', bulkStudent, function (err) {
                });
                (new request()).push(bulkStudent, function(error, response, body){
                    require('fs').writeFile(__dirname + '/data/RESPONSE-CBOStudents.xml', body, function (err) {
                        if (err) {
                            throw err;
                        }
                        process.exit();
                    });
                });

        });
        break;
    case 'pull-cedarlabs':
        studentCollector.pullStudentAsync(function(err){
            if(err){
                utils.log(err, 'error');
            } else {
                utils.log('Pull all Done !', 'info');
            }
            process.exit();
        });
        break;
    case 'codeset':
        (new request()).codeSet(function(err, res, body){
            if(err){
                utils.log(err, 'error');
                process.exit();
            } else {
                new codeSet(JSON.parse(body)).parse(function(){
                    utils.log('Pull all Done !', 'info');
                    process.exit();
                });
            }
        });
        break;
    case 'queue-cedarlabs':
        studentCollector.queue(function(){
            console.log('Queue done');
            process.exit();
        });
        break;
    case 'cache-list':
        var args = process.argv.slice(3)[0] ? true : false;
        studentCollector.cacheList(args, function(data){
            console.log('Cache list done');
            process.exit();
        });
        break;
    case 'token-cleaner':
        tokenCleaner.clean(function(err){
            if(err){
                console.log('Remove expire token fails: ', err);
            } else{
                console.log('Remove expire token done');
            }
            process.exit();
        });
        break;
    default:
        throw 'Not valid command';
        resJob();
        break;
}