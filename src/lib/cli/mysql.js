/**
 * Created by zaenal on 14/01/16.
 */
var mysql = require('mysql');
process.env.NODE_CONFIG_DIR = '/config';
var config = require('config');

module.exports = mysql.createConnection({
    host     : config.get('db.mysql.host'),
    user     : config.get('db.mysql.user'),
    password : config.get('db.mysql.password'),
    database : config.get('db.mysql.database')
});
