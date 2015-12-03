
# Secure Data Portal for community-based organizations (CBO's) [![Code Climate](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/gpa.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/feed) [![Test Coverage](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/coverage.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/coverage) [![Issue Count](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/issue_count.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/feed)

## Overview
The authorization sequence begins when your application redirects a browser to a CBO api URL; the URL includes query parameters that indicate the type of access being requested. As in other scenarios, CBO api server handles user authentication, session selection, and user consent. The result is an authorization code, which api returns to your application in a query string.

After receiving the authorization code, your application can exchange the code (along with a client ID and client secret) for an access token and, in some cases, a refresh token.

Node.js client library for [Oauth2](http://oauth.net/2/).

The URL used when authenticating a user is`http://<domain>:<port>/api/oauth2/authorize`.

## Requirements

You need to have installed Node.js and MongoDB

Another Tools:
#####- Mandrill [link](https://mandrillapp.com) 
Email  service for send mail. Below example in config file: 

    
      "mandrill": {
            "api_key": "<api_key>"
        }

#####- Rollbar [link](https://rollbar.com) 
Logger service. The application need token. Below example in config file: 
   
      "rollbar": {
            "access_token": "<rollbar_token>"
        }

#####- Redis [link](http://redis.io) 
Cache adapter. Below example in config file: 
   
      "cache": {
            "adapter": "memory",
            "backup": "redis",
            "redis": {
                "host": "localhost",
                "port": "6379",
                "db": 0,
                "ttl": 86400
            },
            "memory": {
                "max": 100,
                "ttl": 60
            }
        }



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
        "host": "<host_name>",
        "api": {
            "url": "https://api.***.com"
        },
        "auth": {
            "url": "https://auth.***.com"
        },
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
            "secret": "<secret>",
            "saveUninitialized": true,
            "resave": true
        },
    
        "mandrill": {
            "api_key": "<api_key>"
        },
        "hzb": {
            "default": "xsre",
            "sre": {
                 "url": "<api end point>",
                "sessionToken": "<session token>",
                "sharedSecret": "<secret>",
                "object": "sres",
                "service": "sres",
                "contextId": "CBO",
                "headers": {
                    "serviceType": "OBJECT",
                    "requestType": "IMMEDIATE",
                    "requestAction": "QUERY",
                    "messageType": "REQUEST",
                    "objectType": "sre",
                    "Accept": "application/xml",
                    "Content-Type": "application/xml"
                },
                "validation-url": "",
                "validation-service": ""
            },
            "xsre": {
                 "url": "<api end point>",
                "sessionToken": "<session token>",
                "sharedSecret": "<secret>",
                "object": "sres",
                "service": "sres",
                "contextId": "DEFAULT",
                "headers": {
                    "serviceType": "OBJECT",
                    "requestType": "IMMEDIATE",
                    "requestAction": "QUERY",
                    "messageType": "REQUEST",
                    "objectType": "xsre",
                    "Accept": "application/xml",
                    "Content-Type": "application/xml"
                },
                "validation-url": "",
                "validation-service": ""
            },
            "prs": {
                "url": "<api end point>",
                "sessionToken": "<session token>",
                "sharedSecret": "<secret>",
                "headers": {
                    "Accept": "application/xml"
                },
                "validation-url": "",
                "validation-service": ""
            }
        },
        "cross": {
            "enable": true,
            /** default: "*" */
            "allow_origin": "*",
            "allow_headers": "Authorization, Origin, X-Requested-With, Content-Type, Accept",
            "allow_method": "POST, GET, PUT, OPTIONS, DELETE"
        },
        "salt": "1f3f365ffdf4eb0777899420f0aca20a_test",
        "rollbar": {
            "access_token": "<rollbar_token>"
        },
        "aws": {
            "aws_access_key_id":"",
            "aws_secret_access_key":""
        },
        "cache": {
            "adapter": "memory",
            "backup": "redis",
            "redis": {
                "host": "localhost",
                "port": "6379",
                "db": 0,
                "ttl": 86400
            },
            "memory": {
                "max": 100,
                "ttl": 60
            }
        }
    }

**Edit config overrides for production deployment:**

    $ vi src/config/production.json

    {
            "host": "<host_name>",
            "api": {
                "url": "https://api.***.com"
            },
            "auth": {
                "url": "https://auth.***.com"
            },
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
                "secret": "<secret>",
                "saveUninitialized": true,
                "resave": true
            },
        
            "mandrill": {
                "api_key": "<api_key>"
            },
            "hz": {
                "hzUri": "<hzUri>",
                "hzSessionToken": "<hzSessionToken>",
                "hzSharedSecret": "<hzSharedSecret>",
                "object": "<object>",
                "service": "<service>",
                "contextId": "CBO",
                "validation-url": "<validation-url>",
                "validation-service": "<validation-service?",
                "serviceType": "OBJECT",
                "requestType": "IMMEDIATE",
                "requestAction": "QUERY",
                "messageType": "REQUEST",
                "objectType": "<objectType>",
                "prsBaseUri": "<prsBaseUri>",
                "prsSessionToken": "<prsSessionToken>",
                "prsSharedSecret": "<prsSharedSecret>"
            },
            "cross": {
                "enable": true,
                /** default: "*" */
                "allow_origin": "*",
                "allow_headers": "Authorization, Origin, X-Requested-With, Content-Type, Accept",
                "allow_method": "POST, GET, PUT, OPTIONS, DELETE"
            },
            "salt": "1f3f365ffdf4eb0777899420f0aca20a_test",
            "rollbar": {
                "access_token": "<rollbar_token>"
            },
            "aws": {
                "aws_access_key_id":"",
                "aws_secret_access_key":""
            },
            "cache": {
                "adapter": "memory",
                "backup": "redis",
                "redis": {
                    "host": "localhost",
                    "port": "6379",
                    "db": 0,
                    "ttl": 86400
                },
                "memory": {
                    "max": 100,
                    "ttl": 60
                }
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