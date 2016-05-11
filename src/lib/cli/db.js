/**
 * Created by zaenal on 22/09/15.
 */
var mongoose = require('mongoose');
var utils = require('../utils'), config = utils.config();
var _ = require('underscore');

function db() {

    this.mongo = mongoose;

    this.dbUri = 'mongodb://' + config.get('db.mongo.host') + '/' + config.get('db.mongo.name');

    var configDbMonggo = config.get('db.mongo');

    if(_.isObject(configDbMonggo)){
        this.dbUri = 'mongodb://' + config.get('db.mongo.host') + '/' + config.get('db.mongo.name');
    } else if(_.isString(configDbMonggo)) {
        this.dbUri = 'mongodb://' + configDbMonggo;
    }

    this.mongoOptions = config.get('db.mongo_options') || {};

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