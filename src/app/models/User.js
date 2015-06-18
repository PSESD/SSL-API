// Load required packages
var mongoose = require('mongoose');
var crypto = require('crypto');
var UserPermission = require('./schema/UserPermission');
var Organization = require('./Organization');
var Code = require('./Code');
var Client = require('./Client');
var Student = require('./Student');
var Program = require('./Program');
var ObjectId = mongoose.Types.ObjectId;

// Define our user schema
var UserSchema = new mongoose.Schema({
    hashedAuthCode: { type: String },
    hashedPassword: {
        type: String
    },
    /**
    * Store salt as plain text
    */
    salt: {
        type: String
    },
    first_name: { type: String, trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, required: true, index: true, minlength: 6 },
    permissions: [ UserPermission ], // Store a permission a user has, by each organization.
    created: {
        type: Date,
        default: Date.now
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    last_updated: { type: Date, required: true, default: Date.now },
    last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

UserSchema.virtual('userId')
    .get(function(){
      return this.id;
    });
/**
 *
 * @param password
 * @returns {*}
 */
UserSchema.methods.encryptPassword = function (password) {
    return crypto.pbkdf2Sync(''+password, this.salt, 4096, 512, 'sha256').toString('hex');
};
/**
 *
 * @param password
 * @returns {String|string|*}
 */
UserSchema.methods.encryptAuthCode = function (code) {
    return crypto.pbkdf2Sync(''+code, this.salt, 4096, 64, 'sha256').toString('hex');
};
/**
 *
 */
UserSchema.virtual('password')
    .set(function(password) {
      this._plainPassword = password;
      this.salt = crypto.randomBytes(128).toString('base64');
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

UserSchema.virtual('authCode')
    .set(function (code) {
        var password = crypto.randomBytes(12).toString('base64');
        this._plainAuthCode = code;
        this._plainPassword = password;
        this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
        this.hashedAuthCode = this.encryptAuthCode(code);
    })
    .get(function () {
        return this._plainAuthCode;
    });

/**
 * User organization id
 */
UserSchema.virtual('organizationId').get(function(){
  var _id = [];
  if(this.permissions.length > 0){
      
      this.permissions.forEach(function(organization){
          _id.push(organization.organization);
      });
  }
  return _id;
});
/**
 *
 * @param password
 * @param cb
 */
UserSchema.methods.verifyPassword = function(password, cb) {
  if(!this.salt){
    cb(null, false);
  } else {
    cb(null, this.encryptPassword(password) === this.hashedPassword);
  }
};

UserSchema.methods.verifyAuthCode = function (code, cb) {
    if (!this.salt) {
        cb(null, false);
    } else {
        cb(null, this.encryptAuthCode(code) === this.hashedAuthCode);
    }
};
/**
 *
 */
UserSchema.statics.removeDeep = function(userId, done){
    Client.remove({ userId: userId }, done);
    Code.remove({ userId: userId }, done);
    Program.remove({ creator: userId }, done);
    Student.remove({ creator: userId }, done);
    Organization.remove({ creator: userId }, done);
    this.model('User').remove({_id: userId}, done);
    console.log('REMOVE CALL');
};
/**
 *
 * @param permissions
 * @param done
 */
//UserSchema.methods.addPermission = function(permissions, done){
//
//
//    if(typeof permissions !== 'array'){
//        permissions = [ permissions ];
//    }
//    var deleteIns = [];
//    permissions.forEach(function(permission, i){
//        if(typeof permission.organization === undefined){
//            delete permissions[i];
//        } else {
//            deleteIns.push(mongoose.Types.ObjectId(permission.organization));
//        }
//    });
//    var model = this.model('User');
//    var email = this.email;
//    var crit  = { email: email,  permissions: { $elemMatch: { organization : { $in: deleteIns } } }  };
//    model.remove(crit
//    , function(err) {
//        if (err) {
//            return done(err);
//        }
//        model.findOne({email: email}, function (err, user) {
//            if (err) {
//                return done(err);
//            }
//            permissions.forEach(function (permission, i) {
//                user.permissions.push(permission);
//            });
//            user.save(done);
//        });
//    });
//};
/**
 *
 * @param orgid
 * @param done
 * @returns {*}
 */
//UserSchema.methods.deletePermission = function(orgid, done){
//
//
//
//    if(!orgid instanceof Array){
//        orgid = [ orgid ];
//    }
//
//    orgid.forEach(function(org, i){
//        orgid[i] = org;
//    });
//    console.log(orgid);
//    var User = this.model('User');
//
//    User.findOne({ email: this.email }, function(err, user){
//        if(err){
//            return done(err);
//        }
//        if(!user) return done("User not found");
//
//        user.permissions.forEach(function(permission, i){
//            if(orgid.indexOf(permission.organization.toString())){
//                delete user.permissions[i];
//            }
//        });
//
//        console.log(user.permissions);
//
//        user.save(done);
//    });
//};

UserSchema.set('toJSON', { hide: 'hashedPassword' });

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
