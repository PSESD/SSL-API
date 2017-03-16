
# Secure Data Portal for community-based organizations (CBO's) [![Code Climate](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/gpa.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/feed) [![Test Coverage](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/coverage.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/coverage) [![Issue Count](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/badges/7f33b5f9c16306a725fd/issue_count.svg)](https://codeclimate.com/repos/565eb21ba7512d6fbb002873/feed)

## Authorization
### (This happens in srx-services-ssl-auth)
The authorization sequence begins when your application redirects a browser to a CBO api URL; the URL includes query parameters that indicate the type of access being requested. As in other scenarios, CBO api server handles user authentication, session selection, and user consent. The result is an authorization code, which api returns to your application in a query string.

After receiving the authorization code, your application can exchange the code (along with a client ID and client secret) for an access token and, in some cases, a refresh token.

Node.js client library for [Oauth2](http://oauth.net/2/).

The URL used when authenticating a user is`http://<domain>:<port>/api/oauth2/authorize`.

## Requirements

You need to have installed Node.js and MongoDB.

Other Tools:
##### Mandrill [link](https://mandrillapp.com) 
Not being used currently?

##### Rollbar [link](https://rollbar.com) 
Logger service used in application.

##### Redis [link](http://redis.io) 
Cache where xSres are stored after being retrieved from PRS. You will need to configure your server to refresh the cache every day, as the data in it expires after `REDIS_TTL` seconds.

You can trigger a manual cache refresh (make sure your .env file points to the right MongoDB and Redis instances!) by running the following from the command prompt, in the src directory:

```node cli.js cache-list```

## Installation


To install dependencies enter project folder and run following command:

    $ npm install

Install the client library using git:

    $ git clone https://github.com/PSESD/SSL-API.git
    $ cd CBO-Portal-API
    $ npm install


## Getting started

### Setting up environment variables
Create a file in `/src` named `.env`, with the following values:

      DB_HOST=dbname:dbpassword@dburl.com:port/dbname //this is the format that works with heroku
      DB_NAME=dbname
      HOST=url-of-srx-apps-ssl.com
      MYSQL_DATABASE=mysqlDbName //not sure this is currently in use
      MYSQL_HOST=
      MYSQL_USER=
      MYSQL_PASSWORD=
      PRS_SESSION_TOKEN=
      PRS_SHARED_SECRET=
      PRS_URL=
      REDIS_URL=redis://[:password@]host[:port][/db-number][?ttl=value]
      ROLLBAR_ACCESS_TOKEN=token-for-account-on-rollbar.com
      SALT=salt-for-test-user-in-mongo-db
      SESSION_SECRET=session-secret
      SRE_SESSION_TOKEN=
      SRE_SHARED_SECRET=
      SRE_URL=
      XSRE_SESSION_TOKEN=get-these-values-from-hostedZone
      XSRE_SHARED_SECRET=get-these-values-from-hostedZone
      XSRE_URL=hostedZone-root-url //ie https://whatever.hostedzone.com/svcs/dev


**Before you run the app, be sure to set the NODE_ENV.** 

In Windows, from the command prompt in the `/src` directory:

    dir>set NODE_ENV=local-env


**Start your app server:**

Run server:

    $ cd src && npm start

Run server with environment `test`:

    $ cd src && npm test

Run Unit Test:

    $ cd src && mocha

## Cron Job

Docker crontab available on file: "cronjob/files/etc/ssl-cron"

Cronjob using crontab:

    0 0 * * * root NODE_CONFIG_DIR=/config /usr/bin/node /src/cli.js cache-list true >> /var/log/cron.log 2>&1
    0 */2 * * * root NODE_CONFIG_DIR=/config /usr/bin/node /src/cli.js cache-list >> /var/log/cron.log 2>&1
    0 0 * * * root NODE_CONFIG_DIR=/config /usr/bin/node /src/cli.js push-cedarlabs >> /var/log/cron.log 2>&1
    0 */3 * * * root NODE_CONFIG_DIR=/config /usr/bin/node /src/cli.js pull-cedarlabs >> /var/log/cron.log 2>&1
    
Cronjob run manually:
    
    /usr/bin/node /src/cli.js cache-list true
    /usr/bin/node /src/cli.js push-cedarlabs
    /usr/bin/node /src/cli.js pull-cedarlabs


## Table schema for reporting

Table student:

    CREATE TABLE `students` (
      `id` varchar(100) NOT NULL,
      `org_name` varchar(100) DEFAULT NULL,
      `student_id` varchar(50) DEFAULT NULL,
      `school_district` varchar(50) DEFAULT NULL,
      `school` varchar(100) DEFAULT NULL,
      `first_name` varchar(100) DEFAULT NULL,
      `last_name` varchar(100) DEFAULT NULL,
      `grade_level` int(11) DEFAULT NULL,
      `ethnicity` varchar(100) DEFAULT NULL,
      `gender` enum('Male','Female') DEFAULT NULL,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY `id` (`id`,`student_id`,`school_district`,`gender`,`grade_level`,`ethnicity`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1

Table student program:

    CREATE TABLE `student_programs` (
      `program_id` varchar(50) NOT NULL,
      `student_id` varchar(50) NOT NULL,
      `program_name` varchar(100) NOT NULL,
      `cohorts` varchar(300) DEFAULT NULL,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`program_id`,`student_id`,`program_name`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1

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