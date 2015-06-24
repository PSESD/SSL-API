/**
 * Created by zaenal on 23/06/15.
 */
'use strict'

var rules = {};
var mongoose = require('mongoose');
var _ = require('underscore');
var collection;
var context;
var currentRole;
var protectFilter;

var _permissions;
var _acl;

module.exports = function protector(schema, options) {
    /**
     *
     * @param user
     * @param collection
     */
    function setUser(user, collection) {
        _permissions = [];
        _acl = [];
        var _collectionName = collection;
        user.permissions.forEach(function (permission) {
            _permissions.push(permission);
            if(permission.permissions.length > 0) {
                permission.permissions.forEach(function(perm){
                    if (perm.model && _collectionName.indexOf(perm.model.toLowerCase()) !== -1) {
                        _acl.push(perm);
                    }
                    console.log(_collectionName, perm.model.toLowerCase());
                });
            }
        });

        console.log('Permissions: ', _acl);
    }

    /**
     *
     * @param req
     * @returns {{save: Function}}
     */
    schema.methods.protect = function protect(req) {

        currentRole = req;
        collection = this.collection.name;


        var caller = this;

        /**
         *  FYI, THE FOLLOWING SECTION WAS A QUICK HACK TO GET SOMETHING WORKING
         *  I'LL MAKE THIS NICE AND PRETTY AND REFACTORED SHORTLY.
         *
         */
        return {
            /**
             *
             * @param args
             */
            save: function (args) {
                var gotRules = null, inRules = null, role = null, localRules = null;
                // this is a new document, does the user have create permission?
                if (caller.isNew) {

                    gotRules = getRules(collection);
                    inRules = (typeof gotRules !== "undefined") ? gotRules : [];

                    role = (typeof currentRole !== "undefined") ? currentRole : "";

                    localRules = getRulesForRoleForMethod(inRules, role, 'create');

                    if (localRules) {

                        caller.save(args);

                    } else {
                        if ("function" == typeof args) {
                            args("Unauthorized");
                        } else {
                            throw new mongoose.Error("Unauthorized");
                        }
                    }

                }
                // this document is being updated, does the user have update permission?
                else {

                    gotRules = getRules(collection);
                    inRules = (typeof gotRules !== "undefined") ? gotRules : [];

                    role = (typeof currentRole !== "undefined") ? currentRole : "";

                    localRules = getRulesForRoleForMethod(inRules, role, 'update');

                    if (localRules) {

                        caller.save(args);

                    } else {

                        if ("function" == typeof args) {
                            args("Unauthorized");
                        } else {
                            _denied();
                        }

                    }

                }

            }
        }

    };


    /**
     *
     * @param req
     * @param _protectFilter
     * @param user
     * @returns {{find: Function, findOne: Function, save: Function}}
     */
    schema.statics.protect = function (req, _protectFilter, user) {

        context = this;
        currentRole = req;
        collection = this.collection.name;
        protectFilter = _protectFilter || {};
        setUser(user, collection);

        return {

            find: function (args, callback) {

                return _find(args, callback);

            },
            findOne: function (args, callback) {

                return _findOne(args, callback);

            },
            save: function (fn) {
                console.log('here');
                return true;
            },
            remove: function (args, callback) {
                return _delete(args, callback);
            }

        };

    };

    /**
     *
     * @param r
     */
    schema.statics.setRules = function (r) {

        rules[this.collection.name] = r;

    };
    /**
     *
     * @param collection
     */
    function getRules(collection) {

        return JSON.parse(JSON.stringify(rules[collection]));

    }

    /**
     *
     * @param val
     * @returns {*}
     */
    function checkDynamic(val) {

        if (typeof val === "string") {
            var spli = val.split('.');

            if (spli[0] === "$dynamic") {
                return [spli[1]];

            }
        }

        return false;

    }

    /**
     *
     * @param callback
     * @private
     */
    var _save = function (callback) {


    };
    /**
     *
     * @param crit
     * @param allowName
     * @returns {*}
     * @private
     */
    var _buildCrit = function (crit, allowName) {

        var gotRules = getRules(collection);

        allowName = allowName || 'read';

        var inRules = (typeof gotRules !== "undefined") ? gotRules : [];

        var role = (typeof currentRole !== "undefined") ? currentRole : "";

        var localRules = getRulesForRoleForMethod(inRules, role, allowName);

        var acl = checkAcl(allowName);

        if(acl.denied) return _denied();

        if (!localRules) {
            return false;
        }

        if (typeof localRules.where !== "undefined") {

            switch (acl.allow){
                case 'all':

                    break;
                case 'own':

                    if(_permissions.indexOf(collection) != -1){
                        if(_permissions[collection].indexOf(protectFilter.value) === -1){
                            _denied();
                        }
                    }
                    break;

                case 'none':
                default:
                    _denied();
                    break;
            }

            for (var attrn in localRules.where) {

                if (localRules.where[attrn].hasOwnProperty('$in')) {
                    var inArray = localRules.where[attrn]['$in'];
                    var projectionArray = [];
                    inArray.forEach(function (val) {


                        var theKey = checkDynamic(val);
                        if (theKey && protectFilter.hasOwnProperty(theKey)) {
                            projectionArray.push(protectFilter[theKey]);
                        }


                    });

                    if (projectionArray.length > 0) {
                        localRules.where[attrn]['$in'] = projectionArray;
                    }
                } else {

                    var key = checkDynamic(localRules.where[attrn]);
                    if (key && protectFilter.hasOwnProperty(key)) {
                        localRules.where[attrn] = protectFilter[key];

                    }


                }

                crit[attrn] = localRules.where[attrn];


            }
        }
        if (localRules.properties.hasOwnProperty('*')) {
            localRules.properties = {};
        }
        return {fields: localRules.properties, crit: crit};
    };

    /**
     *
     * @param args
     * @param callback
     * @returns {*}
     * @private
     */
    var _find = function (args, callback) {

        var localRules = _buildCrit(args);

        if (localRules !== false) {

            if (typeof callback === "function") {

                context.find(localRules.crit, localRules.fields).where().exec(callback);

            } else {

                return context.find(localRules.crit, localRules.fields);

            }

        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    populate: function (args) {
                        return {
                            exec: function (callback) {
                                callback('Unauthorized');
                            }
                        }
                    },
                    exec: function (callback) {

                        callback('Unauthorized');
                    }
                }

            }
        }

    };
    /**
     *
     * @param args
     * @param callback
     * @returns {*}
     * @private
     */
    var _findOne = function (args, callback) {


        var localRules = _buildCrit(args);

        if (localRules !== false) {

            if (typeof callback === "function") {

                context.findOne(localRules.crit, localRules.fields).where().exec(callback);

            } else {

                return context.findOne(localRules.crit, localRules.fields);

            }

        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    populate: function (args) {
                        return {
                            exec: function (callback) {
                                callback('Unauthorized');
                            }
                        }
                    },
                    exec: function (callback) {

                        callback('Unauthorized');
                    }
                }

            }
        }
    };
    /**
     * Delete or remove
     * @param args
     * @param callback
     * @returns {*}
     * @private
     */
    var _delete = function (args, callback) {


        var localRules = _buildCrit(args, 'delete');

        if (localRules !== false) {

            if (typeof callback === "function") {


                context.remove(args).where().exec(callback);
            }
            else {
                return context.remove(args);
            }
        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    exec: function (callback) {

                        callback('Unauthorized');
                    }
                }

            }
        }
    };

}; //end export
/**
 *
 * @private
 */
function _denied () {
    throw new mongoose.Error("Unauthorized");
}
/**
 *
 * @param method
 * @returns {{denied: boolean, permission: null}}
 */
function checkAcl(method){

    if(!_acl) return {
        denied: true,
        permission: null
    };


    var operation = [ '*', method ];

    _acl.forEach(function (acl) {

        if(operation.indexOf(acl.operation) !== false){

            return {
                denied: false,
                permission: acl
            };

        }
    });

    return {
        denied: true,
        permission: null
    };
}
/**
 *
 * @param rules
 * @param roleName
 * @param method
 * @returns {*}
 */
function getRulesForRoleForMethod(rules, roleName, method) {

    for (var i = 0; i < rules.length; i++) {

        if (rules[i].role.name == roleName) {

            if (typeof rules[i].role.allow !== "undefined") {

                if (rules[i].role.allow.hasOwnProperty("*")) {

                    return {properties: {}, where: {}};

                } else if (rules[i].role.allow.hasOwnProperty(method)) {

                    return rules[i].role.allow[method];

                }

            }

        }

    }

    return false;

}
