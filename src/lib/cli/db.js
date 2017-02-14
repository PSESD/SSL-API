/**
 * Created by zaenal on 22/09/15.
 */
var mongoose = require('mongoose');
var utils = require('../utils'), config = utils.config();
var _ = require('underscore');

function db() {

    this.mongo = mongoose;

    this.dbUri = process.env.DB_HOST + '/' + process.env.DB_NAME;

    this.mongoOptions =  process.env.DB_MONGO_OPTIONS || {};

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