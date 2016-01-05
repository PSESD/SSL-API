'use strict';
/**
 * Created by zaenal on 20/05/15.
 */
var IndexController = {

    index: function(req, res){

        res.json({ "test": "Welcome To API SSL :)"});

    }

};
/**
 *
 * @type {{index: Function}}
 */
module.exports = IndexController;