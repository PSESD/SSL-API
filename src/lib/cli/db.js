/**
 * Created by zaenal on 22/09/15.
 */
var mongoose = require('mongoose');
var config = require('../config').config();
var _ = require('underscore');

function db() {

    this.mongo = mongoose;

    this.dbUri = config.get('DB_HOST') + '/' + config.get('DB_NAME');

    this.mongoOptions =  config.get('DB_MONGO_OPTIONS') || {};

    this.env = config.util.getEnv('NODE_ENV');

    this.connect();

}

db.prototype.connect = function(){

    var me = this;

    this.mongo.connect(me.dbUri, me.mongoOptions);

    this.mongo.connection.once('open', function (callback) {

        console.log("[%s] DB MongoDB", me.env);

    });
};

new db();