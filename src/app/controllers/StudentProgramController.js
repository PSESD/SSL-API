/**
 * Created by zaenal on 21/05/15.
 */
var mongoose = require('mongoose');
var StudentProgram = require('../models/StudentProgram');
var Program = require('../models/Program');
var User = require('../models/User');
var BaseController = require('./BaseController');
var _ = require('underscore');


var StudentProgramController = new BaseController(StudentProgram).crud();
/**
 * Create student program by id
 * @param req
 * @param res
 * @returns {*}
 */
StudentProgramController.getByStudentId = function (req, res) {};
StudentProgramController.createByStudentId = function (req, res) {};
StudentProgramController.saveByStudentId = function (req, res) {};
StudentProgramController.deleteByStudentId = function (req, res) {};



module.exports = StudentProgramController;