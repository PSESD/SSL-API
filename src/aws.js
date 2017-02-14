/**
 * Created by zaenal on 20/06/16.
 */
'use strict';

/**
 * AWSTrigger
 *
 * @email help@AWS.com
 */
var fs = require("fs")
    , path = require("path")
    , configuration = path.resolve(process.env.HOME, ".aws")
    ;
var ini = require('iniparser');
var cfg = ini.parseSync(configuration + "/credentials");

console.log(cfg);
var fmt = require('fmt');
var awsPromised = require('aws-promised');
var ecs = awsPromised.ecs({
    accessKeyId     : cfg.default.aws_access_key_id,
    secretAccessKey : cfg.default.aws_secret_access_key,
    region: 'us-west-2'
});

var params = {
    containerInstances: [ /* required */
        '8d20ee00-4dc0-4f09-919a-1974b7b15bd4',
        /* more items */
    ],
    taskDefinition: 'arn:aws:ecs:us-west-2:976229134916:task-definition/SSLStaging-cbo-api:8', /* required */
    cluster: 'SSLStaging',
};
// ecs.startTask(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
// });

var params = {
    cluster: 'SSLStaging',
    containerInstance: '8d20ee00-4dc0-4f09-919a-1974b7b15bd4',
    // desiredStatus: 'RUNNING | PENDING | STOPPED',
    family: 'SSLStaging-cbo-api',
    // maxResults: 0,
    // nextToken: 'STRING_VALUE',
    // serviceName: 'STRING_VALUE',
    // startedBy: 'STRING_VALUE'
};
// ecs.listTasks(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response

    // data.taskArns.forEach(function (task) {
    //     var taskParams = {
    //         task: task.split('/').slice(-1).pop(), /* required */
    //         cluster: params.cluster,
    //         // reason: 'STRING_VALUE'
    //     };
    //     console.log(taskParams);
    //     ecs.stopTask(taskParams, function(err, data) {
    //         if (err) {
    //             return console.log(err, err.stack);
    //         } // an error occurred
    //
    //         if(task.desiredStatus === 'STOP'){
    //             var params = {
    //                 taskDefinition: task.taskDefinitionArn, /* required */
    //                 cluster: params.cluster,
    //                 // count: 0,
    //                 // overrides: {
    //                 //     containerOverrides: [
    //                 //         {
    //                 //             command: [
    //                 //                 'STRING_VALUE',
    //                 //                 /* more items */
    //                 //             ],
    //                 //             environment: [
    //                 //                 {
    //                 //                     name: 'STRING_VALUE',
    //                 //                     value: 'STRING_VALUE'
    //                 //                 },
    //                 //                 /* more items */
    //                 //             ],
    //                 //             name: 'STRING_VALUE'
    //                 //         },
    //                 //         /* more items */
    //                 //     ]
    //                 // },
    //                 // startedBy: 'STRING_VALUE'
    //             };
    //             ecs.runTask(params, function(err, data) {
    //                 if (err) {
    //                     return console.log(err, err.stack);
    //                 }
    //                 var params = {
    //                     tasks: [ /* required */
    //                         'STRING_VALUE',
    //                         /* more items */
    //                     ],
    //                 };
    //             });
    //         }
    //     });
    // });
// });
