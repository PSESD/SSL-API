/**
 * Created by zaenal on 20/05/15.
 */
var IndexController = {

    index: function(req, res){

        res.json({ "test": "Welcome To API"});

    }

};
/**
 *
 * @type {{index: Function}}
 */
module.exports = IndexController;