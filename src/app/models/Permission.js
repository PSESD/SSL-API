/**
 * Created by zaenal on 20/05/15.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our Permission schema
var PermissionSchema = new mongoose.Schema({

});

// Export the Mongoose model
module.exports = mongoose.model('Permission', PermissionSchema);