
# Secure Data Portal for community-based organizations (CBO's)

## Overview
The authorization sequence begins when your application redirects a browser to a CBO api URL; the URL includes query parameters that indicate the type of access being requested. As in other scenarios, CBO api server handles user authentication, session selection, and user consent. The result is an authorization code, which api returns to your application in a query string.

After receiving the authorization code, your application can exchange the code (along with a client ID and client secret) for an access token and, in some cases, a refresh token.

Node.js client library for [Oauth2](http://oauth.net/2/).

The URL used when authenticating a user is`http://<domain>:<port>/api/oauth2/authorize`.

## Requirements

You need to have installed Node.js and MongoDB

## Installation


To install dependencies enter project folder and run following command:

    $ npm install

Install the client library using git:

    $ git clone https://github.com/PSESD/CBO-Portal-API.git
    $ cd CBO-Portal-API
    $ npm install


## Getting started

The following examples configuration in JSON format.

**Install in your app `src` directory, and add/edit the default config file.**

    $ mkdir src/config
    $ vi src/config/development.json

    {
      "host": "<domain>",
      "token": {
        "expires_in": 3600
      },
      "db": {
    	"mongo": {
    	  "host": "<mongodb host>",
    	  "name": "<mongodb name>"
    	}
      },
      "session": {
    	"secret" : "<secret>",
    	"saveUninitialized": true,
    	"resave": true
      },
      /**
       * Cross Domain Setting
       */
      "cross": {
    	"enable": true,
    	"allow_origin" : null, // default: "*",
    	"allow_headers" : null// default: Origin, X-Requested-With, Content-Type, Accept
      },
      "salt": "<salt>",
      /**
       * Logger
       */
      "rollbar": {
    	"access_token" : "<rollbar token>"
      }
    }

**Edit config overrides for production deployment:**

    $ vi src/config/production.json

    {
          "host": "<domain>",
          "token": {
            "expires_in": 3600
          },
          "db": {
        	"mongo": {
        	  "host": "<mongodb host>",
        	  "name": "<mongodb name>"
        	}
          },
          "session": {
        	"secret" : "<secret>",
        	"saveUninitialized": true,
        	"resave": true
          },
          /**
           * Cross Domain Setting
           */
          "cross": {
        	"enable": true,
        	"allow_origin" : null, // default: "*",
        	"allow_headers" : null// default: Origin, X-Requested-With, Content-Type, Accept
          },
          "salt": "<salt>",
          /**
           * Logger
           */
          "rollbar": {
        	"access_token" : "<rollbar token>"
          }
        }

**Use configs in your code:**

    var config = require('config');
    ...
    var dbConfig = config.get('db.mongo.host');
    db.connect(dbConfig, ...);

    if (config.has('salt')) {
      var salt = config.get('salt');
      ...
    }

`config.get()` will throw an exception for undefined keys to help catch typos and missing values.
Use `config.has()` to test if a configuration value is defined.


**Start your app server:**

Run server:

    $ cd src && npm start

Run server with environment `test`:

    $ cd src && npm test

Run Unit Test:

    $ cd src && mocha




### Configurations

CBO OAuth2 accepts an object with the following valid params.

* `client_id` - Required registered Client ID.
* `client_secret` - Required registered Client secret.
* `redirect_uri` - One of the redirect URIs.
* `grant_type` - Defined in the OAuth 2.0 specification, this field must contain a value of `authorization_code`.



## Contributing

Fork the repo on github and send a pull requests with topic branches. Do not forget to
provide specs to your contribution.


### Running specs

* Fork and clone the repository (`dev` branch).
* Run `npm install` for dependencies.
* Run `npm start` to start server.
* Run `npm test` to start server with env `test`.

## Tools used

[httpie](https://github.com/jkbr/httpie) - command line HTTP client

## Make Requests


## Coding guidelines

Follow [github](https://github.com/styleguide/) guidelines.


## Feedback

Use the [issue tracker](https://github.com/PSESD/CBO-Portal-API/issues) for bugs.
[Mail](mailto:support@upwardstech.com) us
for any idea that can improve the project.


## Links

* [GIT Repository](https://github.com/PSESD/CBO-Portal-API)
* [Documentation](https://github.com/PSESD/CBO-Portal-API)


## Authors

--- 


## Contributors

Special thanks to the following people for submitting patches.


## Changelog

See [CHANGELOG](https://github.com/PSESD/CBO-Portal-API/master/CHANGELOG.md)


## Copyright

Copyright (c) 2015

This project is released under the [MIT License](http://opensource.org/licenses/MIT).
