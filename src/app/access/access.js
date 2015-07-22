/**
 * Created by zaenal on 22/07/15.
 */
var User = require('./../models/User');

var instance = null;
/**
 *
 * @constructor
 */
function Access(){
    this.user = null;
    this.organizationId = null;
}
/**
 *
 * @param user
 */
Access.prototype.setUser = function(user){
  this.user = user;
};
/**
 *
 * @param organizationId
 */
Access.prototype.setOrganizationId = function(organizationId){
    this.organizationId = organizationId;
};
/**
 *
 * @param options
 * @returns {*}
 */
Access.prototype.grant = function(options){

    if(this._checkPermission(options)){

        if('onSuccess' in options && typeof options.onSuccess === 'function'){

            return options.onSuccess();

        }

    } else {

        if('onError' in options && typeof options.onError === 'function'){

            return options.onError();

        }

    }

};
/**
 *
 * @param options
 * @returns {*}
 * @private
 */
Access.prototype._checkPermission = function(options){

    var currentUser = this.user;

    if(!_.isObject(options)) options = {};

    if('user' in options && options.user instanceof User){

        currentUser = options.user;

    }

    if(!currentUser) return false;

    if(currentUser.isSuperAdmin()) return true;

    var organizationId = this.organizationId;

    if(!organizationId) return false;


    if('organizationId' in options && String.valueOf(options.organizationId).length > 0){

        organizationId = options.organizationId;

    }

    if(!organizationId) return false;

    var orgid = currentUser.organizationId;

    var isMatch = orgid.indexOf(organizationId + '') !== -1;

    console.log(
        'USER: ' + JSON.stringify(currentUser.email),
        'USER ORG: ' + JSON.stringify(orgid),
        'CURR ORG: ' + JSON.stringify(organizationId),
        'TYPEOF ORG: ' + (typeof organizationId),
        'MATCH: ' + isMatch

    );

    if('onCheck' in options && typeof options.onCheck === 'function'){

        return options.onCheck(isMatch);

    }

    return isMatch;

};
/**
 *
 * @returns {*}
 */
module.exports.getInstance = function(){

    if(!instance) instance = new Access();

    return instance;
};