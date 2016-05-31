/**
 * Created by zaenal on 31/05/16.
 */
'use strict';
/**
 *
 */
if(process.env.CIRCLE_BRANCH === 'develop'){
    var SSH_USERNAME = process.env.SSH_USERNAME;
    var SSH_PASSWORD = process.env.SSH_PASSWORD;
    var SSH_HOST = process.env.SSH_HOST;
    var SSH = require('simple-ssh');
    var ssh = new SSH({
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
        .exec('echo "DONE"', {
            exit: function(code) {
                process.exit(0);
            }
        })
        .start();

} else {
    throw 'Not valid environment';
}