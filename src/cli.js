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

var studentCollector = require('./lib/cli/studentCollector');
var tokenCleaner = require('./lib/cli/tokenCleaner');
var request = require('./lib/cli/request');
var con = require('./lib/cli/mysql');
var parseString = require('xml2js').parseString;

function processJob(job, callback){
    // doing something really expensive
    console.log('processing...');
    setTimeout(function(){
        var objectData = JSON.parse(job.data);
        console.log('PUSH DATA: ', objectData);
         //request.push(objectData.content, callback);
    }, 1000);
}
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
    case 'push-xml-student':
    case 'push-caderlab':
        studentCollector.collect(function(bulkStudent){
                require('fs').writeFile(__dirname + '/data/REQUEST-CBOStudents.xml', bulkStudent, function (err) {
                });
                setTimeout(function(){
                    //console.log('PUSH DATA: ', bulkStudent);
                    (new request()).push(bulkStudent, function(error, response, body){
                        require('fs').writeFile(__dirname + '/data/RESPONSE-CBOStudents.xml', body, function (err) {
                            if (err) throw err;
                            process.exit();
                        });
                    });
                }, 1000);

        });
        break;
    case 'pull-caderlab':
    case 'pull-xml-student':
        studentCollector.pullStudent(function(err){
            console.error('error connecting: ' + err.stack);
            process.exit();
        }, function(){
            console.error('Done !');
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