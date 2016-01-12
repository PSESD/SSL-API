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

function processJob(job, callback){
    // doing something really expensive
    console.log('processing...');
    setTimeout(function(){
        var objectData = JSON.parse(job.data);
        console.log('PUSH DATA: ', objectData);
        // request.push(objectData.content, callback);
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
    case 'cache-debug':
        studentCollector.cacheDebug(function(){
            process.exit();
        });
        break;
    case 'cache':
        //studentCollector.cache(function(exit){
        //      if(exit) {
        //            console.log('Cache done');
        //            process.exit();
        //      }
        //});
        console.log('Deprecated: use "cache-list"');
        process.exit();
        break;
    case 'cache-list':
        studentCollector.cacheList(function(data){
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
        resJob();
        break;
}