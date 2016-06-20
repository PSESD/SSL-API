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
var amazonEc2 = require('awssum-amazon-ec2');
// var ec2 = new amazonEc2.Ec2({
//     'accessKeyId'     : cfg.default.aws_access_key_id,
//     'secretAccessKey' : cfg.default.aws_secret_access_key,
//     'region'          : amazonEc2.US_WEST_2,
//     'instancesId' : 'i-8ae85843'
// });
// ec2.DescribeInstances(function(err, data) {
//     fmt.dump(err, 'err');
//     fmt.dump(data, 'data');
// });

var starterAws = require('starter-aws');

// API INIT CREDENTIALS
starterAws.initCredentials({
    'accessKeyId'     : cfg.default.aws_access_key_id,
    'secretAccessKey' : cfg.default.aws_secret_access_key,
    'region'          : 'us-west-2',
    'instancesId' : 'i-8ae85843'
});

starterAws.stop(function(err, status) {
    fmt.dump(err, 'err');
    fmt.dump(status, 'status');
// status my return:
    /*[ { InstanceId: 'i-53613f18',
     ImageId: 'ami-c37474b7',
     InstanceType: 't1.micro',
     State: 'stopped' },
     { InstanceId: 'i-98f372d2',
     ImageId: 'ami-3c5f5748',
     InstanceType: 't1.micro',
     State: 'stopped' } ]
     */
});