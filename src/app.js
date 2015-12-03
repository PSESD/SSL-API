'use strict';
var express = require("express");
var i18n = require("i18n");
var mongoose = require('mongoose');
var bodyParser  = require("body-parser");
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

var app  = express();
var session = require('express-session');
var passport = require('passport');
var rollbar = require('rollbar');
var _ = require('underscore');
var methodOverride = require('method-override');
var port = process.env.PORT || 4000;
var config = require('config');
var hal = require('hal');
var xmlmodel = require('./lib/xmlmodel');
var utils = require('./lib/utils');
var rollbarAccessToken = config.get('rollbar.access_token');

if (rollbarAccessToken) {

    // Use the rollbar error handler to send exceptions to your rollbar account
    app.use(rollbar.errorHandler(rollbarAccessToken, {handler: 'inline'}));

    rollbar.handleUncaughtExceptions(rollbarAccessToken, { exitOnUncaughtException: true });

}

/**
 *
 * @constructor
 */
function Api() {

    var self = this;

    self.baseDir = __dirname;

    self.controllerDir = self.baseDir + '/app/controllers';

    self.modelDir = self.baseDir + '/app/models';

    self.routeDir = self.baseDir + '/app/routes';

    self.libDir = self.baseDir + '/lib';

    self.config = config;

    self.mongo = mongoose;

    self.env = app.get('env');

    self.connectDb();

}
/**
 *
 * @param type
 * @param message
 * @param cb
 * send message to rollbar
 * @link https://rollbar.com
 */
Api.prototype.sendMessage = function (type, message, cb) {

    if (!rollbarAccessToken) {
        return;
    }

    rollbar.reportMessage(message, type || 'debug', function (rollbarErr) {

        if (cb) {
            cb(rollbarErr);
        }

    });

};
/**
 * load controller
 */
Api.prototype.controller = function (name, newInstance) {

    var self = this;

    var obj = require(self.controllerDir + '/' + name);

    if (newInstance) {

        return new obj();

    }

    return obj;

};
/**
 * load controller
 */
Api.prototype.model = function (name) {

    return require(this.modelDir + '/' + name);

};

Api.prototype.lib = function (name) {

    return require(this.libDir + '/' + name);

};
/**
 * load router
 */
Api.prototype.route = function (name) {

    return require(this.routeDir + '/' + name);

};
/**
 * Scan route and register
 */
Api.prototype.registerRoute = function (cb) {

    var router = express.Router();

    var self = this;

    var fs = require('fs');

    var path = require('path');

    var routers = fs.readdirSync(self.routeDir);

    routers.forEach(function (file) {

        var basename = path.basename(file, '.js');

        var rest = self.route(basename);

        if (basename === 'rest') {

            basename = '';

        }

        app.use('/' + basename, router);

        var rest_router = new rest(router, self);

    });

    if (cb) {
        cb();
    }
};
/**
 * Connect to database
 */
Api.prototype.connectDb = function () {


    var dbUri = 'mongodb://' + this.config.get('db.mongo.host') + '/' + this.config.get('db.mongo.name');

    this.mongo.connect(dbUri);

    this.mongo.connection.once('open', function (callback) {

        console.log("[%s] DB URI: " + dbUri, app.get('env'));

    });

    //this.mongo.set('debug', app.get('env') === 'test');

    this.configureExpress(this.db);

};
Api.prototype.migrate = function () {

    //if (app.get('env') === 'test') {

        /**
         * Run Process to migrate data
         */
        //var populateCbo = require('./scripts/populate-cbo');
        //populateCbo.run();

    //}

};
/**
 * Config Express and Register Route
 * @param db
 */
Api.prototype.configureExpress = function (db) {

    var self = this;

    app.set('api', self);

    app.set('log', require('./lib/utils').log);

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use(i18n.init);

    app.use(bodyParser.json());

    app.use(methodOverride());

    // Use the passport package in our application
    app.use(passport.initialize());


    // Use express session support since OAuth2orize requires it
    app.use(session({
        secret: self.config.get('session.secret'),
        saveUninitialized: self.config.get('session.saveUninitialized'),
        resave: self.config.get('session.resave')
    }));

    app.use(function (req, res, next) {


        var resource = null;
        /**
         *
         * @param rstatus
         */
        res.errUnauthorized = function(rstatus){

            res.statusCode = rstatus || 403;

            return res.end('Unauthorized');

        };
        /**
         *
         * @param req
         * @param res
         * @param data
         * @returns {*}
         */
        function sendFormat(req, res, data){

            var format = req.params.format;

            switch( format ){

                case 'json':

                    return res.json(data);

                case 'xml':
                    //if(res.bigXml){
                    //    return res.send(utils.js2xml(data, res.xmlOptions));
                    //}

                    return res.send(xmlmodel(data, res.xmlOptions || 'response'));


            }

            return res.send(data);

        }

        res.sendFormat = sendFormat;


        res.sendSuccess = function (message, data, key, collection) {

            if(!req.params.format) {
                req.params.format = 'json';
            }

            var format = req.params.format;

            if(format === 'xml' && res.xmlKey && !key){

                key = res.xmlKey;

            }

            /**
             * If message is object will direct return
             */
            //console.log('CLASS: ', message.constructor.name);

            if (_.isObject(message)) {

                if (typeof message.toJSON === 'function') {

                    message = message.toJSON();

                }

                resource = new hal.Resource(message, req.originalUrl);

                return sendFormat(req, res, resource.toJSON());

            }

            /**
             * populate response
             * @type {{success: boolean}}
             */
            var response = { success: true };

            if (message) {

                response.message = message;

            }

            if (data) {

                if (_.isArray(data)) {

                    response.total = data.length;

                    if (key) {

                        response[key] = data;

                    } else {

                        response.data = data;

                    }

                } else {

                    if (key) {

                        response[key] = data;

                    } else {

                        response.info = data;

                    }

                }

            }

            resource = new hal.Resource(response, req.originalUrl);

            if (typeof collection === 'function') {

                resource = collection(resource);

            }

            return sendFormat(req, res, resource.toJSON());

        };

        res.sendError = function (err) {

            if(!req.params.format) {
                req.params.format = 'json';
            }

            if(err === 'Access Denied' || err === 'Permission Denied') {
                return res.errUnauthorized();
            }

            var response = { success: false, error: err };

            resource = new hal.Resource(response, req.originalUrl);

            return sendFormat(req, res, resource.toJSON());

        };

        next();

    });

    var cross = self.config.get('cross');

    if (cross.enable) {

        /**
         * Enable Cross Domain
         */
        app.use(function (req, res, next) {

            res.header("Access-Control-Allow-Origin", cross.allow_origin || "*");

            res.header("Access-Control-Allow-Headers", cross.allow_headers || "Origin, X-Requested-With, Content-Type, Accept");

            res.header("Access-Control-Allow-Methods", cross.allow_method || "POST, GET, PUT, OPTIONS, DELETE");

            next();

        });

    }

    /**
     * Call migration
     */
    self.migrate();

    /**
     * Register Route
     */
    self.registerRoute();

    /**
     * Start Server
     */
    self.startServer();

    //self.forkingStart();

};
/**
 * Start Server
 */
Api.prototype.startServer = function () {

    var me = this;

    app.listen(port, function () {

        console.log("All right ! I am alive at Port " + port + ".");

    });

};
/**
 * Forking server
 */
Api.prototype.forkingStart = function(){

    var me = this;

    var cluster = require('cluster');

    var workers = process.env.WORKERS || require('os').cpus().length;

    if (cluster.isMaster) {

        console.log('start cluster with %s workers', workers);

        for (var i = 0; i < workers; ++i) {

            var worker = cluster.fork().process;

            console.log('worker %s started.', worker.pid);

        }

        cluster.on('exit', function(worker) {

            console.log('worker %s died. restart...', worker.process.pid);

            cluster.fork();

        });

    } else {

        me.startServer();

    }

    process.on('uncaughtException', function (err) {

        console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);

        me.stop(err);

    });
};
/**
 * Stop Server
 * @param err
 */
Api.prototype.stop = function (err) {

    console.log("ERROR \n" + err.stack);

    if (rollbarAccessToken) {
        rollbar.reportMessage("ERROR \n" + err);
    }

    process.exit(1);

};
/**
 *
 * @param ex
 */
Api.errorStack = function (ex) {

    if (rollbarAccessToken) {

        rollbar.handleError(ex);

    }

};

new Api();
