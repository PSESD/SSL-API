/**
 * Created by zaenal on 14/01/16.
 */
var mysql = require('mysql');
var config = require('config').db.mysql;

module.exports = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});
