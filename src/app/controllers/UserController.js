/**
 * Created by zaenal on 21/05/15.
 */
var model = require('../models/User');
var Model = require('../../lib/model');
var extend = require('util')._extend;
var self = new Model(model);
var UserController = extend(self.crud(), {
    /**
     *
     * @param req
     * @param res
     */
    deleteByEmail: function(req, res){
        var cb = function(userId, req, res){

            self.model.remove({
                _id: userId
            }, function(err, obj) {
                if (err) {
                    return res.send(err);
                }

                Client.remove({ userId: userId  }, function(err){
                    if (err) {
                        return res.send(err);
                    }
                    Code.remove({ userId: userId  }, function(err) {
                        if (err) {
                            return res.send(err);
                        }
                    });
                });

                res.json({ message: 'Successfully deleted' });
            });
        };

        self.model.findOne();

    },
    get: function(req, res){

        self.model.findOne({ email: req.user.email}, function(err, obj) {
            if (err) {
                return res.send(err);
            }
            res.json(obj);
        });
    },
    /**
     *
     * @param req
     * @param res
     */
    save: function(req, res){
        self.model.findOne({ _id: req.user._id }, function(err, obj) {
            if (err) {
                return res.send(err);
            }

            for (prop in req.body) {
                obj[prop] = req.body[prop];
            }

            // save the movie
            obj.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({message: 'Successfully updated!'});
            });
        });
    }
});

module.exports = UserController;