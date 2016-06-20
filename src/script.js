/**
 * Created by zaenal on 31/05/16.
 */
'use strict';
/**
 *
 */
var SSH = require('simple-ssh');
var SSH_USERNAME = process.env.DEV_SSH_USERNAME;
var SSH_PASSWORD = process.env.DEV_SSH_PASSWORD;
var SSH_HOST = process.env.DEV_SSH_HOST;
var DOCKER_EMAIL = process.env.DEV_DOCKER_EMAIL;
var DOCKER_USER = process.env.DEV_DOCKER_USER;
var DOCKER_PASS = process.env.DEV_DOCKER_PASS;
var ssh;
var branch = process.env.CIRCLE_BRANCH;
var dockerName = 'api';
// Require EC2.
var fs = require("fs")
    , path = require("path")
    , configuration = path.resolve(process.env.HOME, ".aws")
    ;

// Read in the configuration above.
configuration = JSON.parse(fs.readFileSync(configuration, "utf8"));
var starterAws = require('starter-aws');

if(branch === 'staging'){

    ssh = new SSH({
        host: SSH_HOST,
        user: SSH_USERNAME,
        pass: SSH_PASSWORD
    });
    ssh
        .exec('cd /home/cbo/docker_'+branch+'/'+dockerName, {
            out: console.log.bind(console)
        })
        .exec('git pull origin '+branch+'', {
            out: console.log.bind(console)
        })
        .exec('docker build -t psesd/ssl-'+dockerName+':'+branch+' .', {
            out: console.log.bind(console)
        })
        .exec('docker login -e "'+DOCKER_EMAIL+'" -u "'+DOCKER_USER+'" -p "'+DOCKER_PASS+'"', {
            out: console.log.bind(console)
        })
        .exec('docker push psesd/ssl-'+dockerName+':'+branch+'', {
            out: console.log.bind(console)
        })
        .exec('echo "DONE"', {
            exit: function(code) {
                process.exit(0);
            }
        })
        .start();



} else if(branch === 'develop'){
    
    ssh = new SSH({
        host: SSH_HOST,
        user: SSH_USERNAME,
        pass: SSH_PASSWORD
    });
    ssh
        .exec('cd /home/cbo/docker/api', {
            out: console.log.bind(console)
        })
        .exec('git pull origin develop', {
            out: console.log.bind(console)
        })
        .exec('docker rm -f api', {
            out: console.log.bind(console)
        })
        .exec('docker build -t psesd/ssl-api:develop .', {
            out: console.log.bind(console)
        })
        .exec('docker run -d --name api --link redis:redis -p 104.192.103.12:443:443 -e NODE_ENV=development -e NODE_CONFIG_DIR=/config -v /config:/config psesd/ssl-api:develop', {
            out: console.log.bind(console)
        })
        .exec('docker login -e "'+DOCKER_EMAIL+'" -u "'+DOCKER_USER+'" -p "'+DOCKER_PASS+'"', {
            out: console.log.bind(console)
        })
        .exec('docker push psesd/ssl-api:develop', {
            out: console.log.bind(console)
        })
        .exec('echo "DONE"', {
            exit: function(code) {
                process.exit(0);
            }
        })
        .start();

} else {
    throw 'Not valid environment';
}