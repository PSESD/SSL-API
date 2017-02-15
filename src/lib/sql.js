/**
 * Created by zaenal on 23/02/16.
 */
var mysql = require('mysql');
var config = require('../lib/config').config();

//console.log('CONFIG MYSQL: ', dbConfig);
//console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
//console.log('NODE_APP_INSTANCE: ' + config.util.getEnv('NODE_APP_INSTANCE'));
//console.log('ALLOW_CONFIG_MUTATIONS: ' + config.util.getEnv('ALLOW_CONFIG_MUTATIONS'));
/*
module.exports = mysql.createConnection({
    host     : config.get('MYSQL_HOST'),
    user     : config.get('MYSQL_USER'),
    password : config.get('MYSQL_PASSWORD'),
    database : config.get('MYSQL_DATABASE')
});
*/