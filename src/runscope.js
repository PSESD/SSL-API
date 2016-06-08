/**
 * Created by zaenal on 08/06/16.
 */
'use strict';

/**
 * RunscopeTrigger
 *
 * @email help@runscope.com
 */
const SCHEME = "https";
const API_HOST = "api.runscope.com";
const RUNSCOPE_HOST = "www.runscope.com";
const TEST_TRIGGER = "trigger";
const TEST_RESULTS = "results";
const TEST_RESULTS_PASS = "pass";
const TEST_RESULTS_WORKING = "working";
const TEST_RESULTS_QUEUED = "queued";
const TEST_RESULTS_FAIL = "fail";
var url;
var resp = null;
var request = require('request');
/**
 *
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
/**
 *
 * @param logger
 * @param url
 * @param accessToken
 * @constructor
 */
function RunscopeTrigger(logger, url, accessToken) {
    this.log = logger;
    this.url = url;
    this.accessToken = accessToken;
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

RunscopeTrigger.prototype.run = function( cb ) {
    var me = this;
    var resultsUrl = me.process(url, TEST_TRIGGER);
    me.log("Test Results URL:" + resultsUrl);

    /* TODO: If bucketId or test run detail URI gets added to trigger
     response, use those instead of regex */
    var apiResultsUrl = resultsUrl.replaceAll(RUNSCOPE_HOST + "\\/radar\\/([^\\/]+)\\/([^\\/]+)\\/results\\/([^\\/]+)", API_HOST + "/buckets/$1/radar/$2/results/$3");
    this.log("API URL:" + apiResultsUrl);

    setTimeout(function(){
        while (true) {
            resp = me.process(apiResultsUrl, TEST_RESULTS);
            me.log("Response received:" + resp);

            /* If test run is not complete, sleep 1s and try again. */
            if (TEST_RESULTS_WORKING === resp || TEST_RESULTS_QUEUED === resp) {
                var stop = new Date().getTime();
                while(new Date().getTime() < stop + 1000) {
                    ;
                }
            } else {
                break;
            }
        }
    }, 10000);

    return resp;
};

/**
 * Method for making HTTP call
 *
 * @param url
 * @param apiEndPoint
 * @return
 */
RunscopeTrigger.prototype.process = function(url, apiEndPoint) {
    var result = "";
    //try {
    //    httpclient.start();
    //
    //    final RequestConfig config = RequestConfig.custom()
    //        .setConnectTimeout(60 * 1000)
    //        .setConnectionRequestTimeout(60 * 1000)
    //        .setSocketTimeout(60 * 1000).build();
    //
    //    final HttpGet request = new HttpGet(url);
    //    request.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
    //    request.setHeader("User-Agent", "runscope-jenkins-plugin/1.47");
    //    request.setConfig(config);
    //    final Future<HttpResponse> future = httpclient.execute(request, null);
    //    final HttpResponse response = future.get();
    //
    //    final int statusCode = response.getStatusLine().getStatusCode();
    //    if (statusCode != 200 && statusCode != 201) {
    //        this.log(String.format("Error retrieving details from Runscope API, marking as failed: %s", statusCode));
    //        result = TEST_RESULTS_FAIL;
    //    } else {
    //        String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
    //        this.log("Data received: " + responseBody);
    //        result = parseJSON(responseBody, apiEndPoint);
    //    }
    //} catch (Exception e) {
    //    LOGGER.log(Level.SEVERE, "Exception: ", e);
    //    e.printStackTrace();
    //} finally {
    //    try {
    //        httpclient.close();
    //    } catch (IOException e) {
    //        LOGGER.log(Level.SEVERE, "Error closing connection: ", e);
    //        e.printStackTrace();
    //    }
    //}
    return result;
};


/**
 * @param data
 * @param apiEndPoint
 * @return test result
 */
//private String parseJSON(String data, String apiEndPoint) {
//
//    this.log("API EndPoint: " + apiEndPoint);
//
//    JSONObject jsonObject = JSONObject.fromObject(data);
//    JSONObject dataObject = (JSONObject) jsonObject.get("data");
//
//    if (TEST_TRIGGER.equals(apiEndPoint)) {
//        JSONArray runsArray = dataObject.getJSONArray("runs");
//        JSONObject runsObject = (JSONObject) runsArray.get(0);
//        return runsObject.get("url").toString();
//    }
//
//    String testResult = dataObject.get("result").toString();
//
//    if (TEST_RESULTS_PASS.equals(testResult)) {
//        this.log("Test run passed successfully");
//    } else if (TEST_RESULTS_FAIL.equals(testResult)) {
//        this.log("Test run failed, marking the build as failed");
//        LOGGER.log(Level.SEVERE, "Test run failed");
//    }
//    return testResult;
//}