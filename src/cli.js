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
/**
 *
 * @param err
 * @param subject
 * @param done
 */
function withError(err, subject, done){
    utils.mailDev(err, subject, done);
}
/**
 *
 * @param success
 * @param subject
 * @param done
 */
function withSuccess(success, subject, done){
    utils.mailDev(success, subject, done);
}

switch(what){
    case 'env':
        console.log('Environment: ', config.util.getEnv('NODE_ENV'));
        process.exit();
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
                            withError(err, 'PUSH CEDARLABS', function (err) {
                                process.exit();
                            });
                        } else {
                            process.exit();
                        }
                    });
                });

        });
        break;
    case 'pull-cedarlabs':
        studentCollector.pullStudentAsync(function(err){
            if (err) {
                utils.log(err, 'error');
                withError(err, 'PULL CEDARLABS', function (err) {
                    process.exit();
                });
            } else {
                utils.log('Pull all Done !', 'info');
                withSuccess('Pull all from cedarlabs Done!', 'PUSH CEDARLABS', function (err) {
                    process.exit();
                });
            }
        });
        break;
    case 'codeset':
        (new request()).codeSet(function(err, res, body){
            if (err) {
                utils.log(err, 'error');
                withError(err, 'PULL CODE SET', function (err) {
                    process.exit();
                });
            } else {
                utils.log('Pull all Done !', 'info');
                withSuccess('Pull code set Done!', 'PULL CODE SET', function (err) {
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
        studentCollector.cacheList(args, function(err, data){
            if (err) {
                utils.log(err, 'error');
                withError(err, 'CACHE LIST OF STUDENTS', function (err) {
                    process.exit();
                });
            } else {
                utils.log('Pull all data and store into cache Done !', 'info');
                withSuccess('Pull all data and store into cache Done !', 'CACHE LIST OF STUDENTS', function (err) {
                    process.exit();
                });
            }
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