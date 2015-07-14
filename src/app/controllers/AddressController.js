/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var Address = require('../models/Address');
var Program = require('../models/Program');
var User = require('../models/User');
var BaseController = require('./BaseController');
var _ = require('underscore');
var AddressController =  new BaseController(Address).crud();

module.exports = AddressController;