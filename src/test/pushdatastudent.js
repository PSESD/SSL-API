process.env.NODE_ENV = 'staging';
require('../lib/cli/db');
var Student = require('../app/models/Student');
var User = require('../app/models/User');
var readline = require('readline');
var mongoose = require('mongoose');
var fs = require('fs');
var districtFile = __dirname + '/data/districts';
var file = __dirname + '/data/students';
var json = require(file);
var _ = require('underscore');
var l = require('lodash');
var filename = districtFile;
var students = [];
var async = require('async');


/**
 * Created by zaenal on 22/03/16.
 */
function dumpDataDistrictId(done){
    readline.createInterface({
        input: fs.createReadStream(filename),
        terminal: false
    }).on('line', function(line) {
        //return ;
        Student.findOne({first_name: "Student " + line, last_name: "Test"}, function(err, student){
            console.log('MASUP');
            if(err){
                return console.log(err);
            }
            if(!student){
                student = new Student();
                student.district_student_id = line;
                student.emergency1_phone = "";
                student.emergency2_phone = "";
                student.first_name = "Student " + line;
                student.last_name = "Test";
                student.organization =  mongoose.Types.ObjectId("55c1c849e64c77a33468bcc9");
                student.phone = "";
                student.school_district = "seattle";
                student.save(function(){
                    console.log('Add student: ', line, ' => ', student._id);
                    students.push(student._id);
                });
            } else {
                console.log('GET ', line);
                students.push(student._id);
            }

        });
    }).on('close', function() {

        console.log('Have a great day!');
//        User.find({}, function(err, users){ console.log(JSON.stringify(users)); done(); });
//return;
        User.findOne({_id: mongoose.Types.ObjectId('55c1c8443c7f07b534425ae7')}, function (err, user) {

            if (err)  { return console.log(err); }

            if (!user) {
                return ;
            }

            _.each(students, function(obj){

                _.each(user.permissions, function(permission, key){

                    if(permission.organization.toString() === '55c1c849e64c77a33468bcc9' && permission.students.indexOf(obj._id) === -1){

                        user.permissions[key].students.push(obj._id);

                    }

                });
                
            });

            user.save(function(err){

                if (err) { return console.log(err); }

                done();

            });

        });

    });
}
/**
 *
 * @param std
 * @param callback
 */
function processJson(std, callback){
    Student.findOne({first_name: "Student " + std.district_student_id, last_name: "Test"}, function(err, student){
        if(err){
            return callback();
        }

        if(!student){
            student = new Student();

        }
        student.district_student_id = std.district_student_id;
        student.emergency1_phone = std.emergency1_phone;
        student.emergency2_phone = std.emergency2_phone;
        student.first_name = "Student " + std.district_student_id;
        student.last_name = "Test";
        student.organization =  mongoose.Types.ObjectId("55c1c849e64c77a33468bcc9");
        student.phone = std.phone;
        student.school_district = std.school_district;
        student.save(function(){
            console.log('Add student: ', std.district_student_id, ' => ', std._id);
            students.push(student._id);
            callback();
        });

    });
}
(function(ok){
    async.eachSeries(json, processJson, ok);
})(function(){

    User.findOne({_id: mongoose.Types.ObjectId('55c1c8443c7f07b534425ae7')}, function (err, user) {

        if (err)  { return console.log(err); }

        if (!user) {
            return ;
        }

        _.each(students, function(obj){

            _.each(user.permissions, function(permission, key){

                if(permission.organization.toString() === '55c1c849e64c77a33468bcc9' && permission.students.indexOf(obj._id) === -1){

                    user.permissions[key].students.push(obj._id);

                }

            });

        });

        user.save(function(err){

            if (err) { return console.log(err); }

            process.exit(0);

        });

    });

});
//dumpDataDistrictId(function(){
//   process.exit(0);
//});