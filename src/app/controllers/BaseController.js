/**
 * Created by zaenal on 05/06/15.
 */
function BaseController(model){
    this.model = model;
    this.crud();
};
/**
 *
 * @returns {{create: Function, save: Function, get: Function, all: Function, delete: Function}}
 */
BaseController.prototype.crud = function() {
    var self = this;
    return {
        /**
         *
         * @param req
         * @param res
         */
        create: function (req, res) {

            var newModel = self.model;
            var obj = new newModel(req.body);
            obj.save(function (err) {
                if (err) {
                    return res.errJson(err);
                }

                res.okJson('Successfully Added');
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        save: function (req, res) {
            self.model.findOne({_id: req.params.id}, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }

                for (var prop in req.body) {
                    obj[prop] = req.body[prop];
                }

                // save the movie
                obj.save(function (err) {
                    if (err) {
                        return res.errJson(err);
                    }

                    res.okJson('Successfully updated!');
                });
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        get: function (req, res) {
            self.model.findOne({_id: req.params.id}, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }
                res.json(obj);
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        all: function (req, res) {
            self.model.find(function (err, objs) {
                if (err) {
                    return res.errJson(err);
                }
                res.json(objs);
            });
        },
        /**
         *
         * @param req
         * @param res
         */
        delete: function (req, res) {
            self.model.remove({
                _id: req.params.id
            }, function (err, obj) {
                if (err) {
                    return res.errJson(err);
                }

                res.okJson('Successfully deleted');
            });
        }
    }
};

module.exports = BaseController;