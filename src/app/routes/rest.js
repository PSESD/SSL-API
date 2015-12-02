'use strict';
var Limiter = require('express-rate-limiter');
var MemoryStore = require('express-rate-limiter/lib/memoryStore');
var limiter = new Limiter({ db : new MemoryStore() });
/**
 *
 * @param router
 * @param Api
 * @constructor
 */
function Rest(router, Api){
      var self = this;
      self.handleRoutes(router, Api);
}
/**
 * Handle Route from Request
 * @param router
 * @param Api
 */
Rest.prototype.handleRoutes = function(router, Api){
      var userCtr = Api.controller('UserController');
      var ratelimiter = limiter.middleware();

      var organizationCtr = Api.controller('OrganizationController');

      var studentCtr        = Api.controller('StudentController');
      var tagCtr            = Api.controller('TagController');
      var indexCtr          = Api.controller('IndexController');
      var studentProgramCtr = Api.controller('StudentProgramController');
      var prsCtr            = Api.controller('PRSController');
      var auth              = Api.controller('Auth');
      var format            = '.:format?';

      router.get('/' + format, indexCtr.index);

      router.get('/heartbeat' + format, function(req, res){
            res.sendSuccess('OK');
      });

      router.route('/user' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, userCtr.get)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, userCtr.save)
      ;

      //router.route('/user/role/:userId')
      //    .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.setRole)
      //    .get(auth.isBearerAuthenticated, userCtr.getRole)
      //;


      router.route('/organizations' + format)
            //disabled for now and only available on stage or dev
            //.post(auth.isBearerAuthenticated, auth.isAdmin, organizationCtr.create)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.get);

      router.route('/:organizationId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.find);

      router.route('/:organizationId/profile' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.profile)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.updateProfile);

      router.route('/:organizationId/users' + format)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.postUser)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.allUsers);

      router.route('/:organizationId/users/:userId' + format)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.putUser)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.getUser)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.deleteUser)
      ;

      router.route('/:organizationId/programs' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.allProgram)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.postProgram);

      router.route('/:organizationId/programs/:programId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.getProgram)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.putProgram)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.deleteProgram)
      ;

      router.route('/:organizationId/students' + format)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.createByOrgId)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudents);


      //router.route('/:organizationId/students/not-assign')
      //    .post(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, studentCtr.getStudentNotAssigns);

      router.route('/:organizationId/students/:studentId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudentById)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.putStudentById)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.deleteStudentById);

      router.route('/:organizationId/users/:userId/students' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.getByUserId)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.postByUserId)
      ;

      router.route('/:organizationId/users/:userId/students/:studentId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.getStudentUserById)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.putStudentUserById)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.deleteStudentUserById)
      ;
      /**
       * Tag route
       */
      router.route('/:organizationId/tags' + format)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, tagCtr.createByOrgId)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, tagCtr.getTags);

      router.route('/:organizationId/tags/:tagId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, tagCtr.getTagById)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, tagCtr.putTagById)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, tagCtr.deleteTagById);

      router.route('/:organizationId/students/:studentId/xsre' + format)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.deleteCacheStudentsBackpack)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudentsBackpack);


      router.route('/:organizationId/students/:studentId/programs' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getByStudentId)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.addByStudentId)
      ;

      router.route('/:organizationId/students/:studentId/programs/CBOStudent.xml')
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getByStudentIdXsre)
      ;

      router.route('/:organizationId/programs/:programId/students' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getByProgramId)
            .post(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.addByProgramId)
      ;

      router.route('/:organizationId/programs/:programId/students/:studentId' + format)
            .get(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getStudentById)
            .put(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.putStudentById)
            .delete(ratelimiter, auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.deleteStudentById)
      ;

      //router.route('/:organizationId/districts')
      //    .delete(auth.isBearerAuthenticated, auth.hasAccess, prsCtr.deleteCacheDistricts)
      //    .get(auth.isBearerAuthenticated, auth.hasAccess, prsCtr.getDistricts);

      /**
       * Only for development
       */
      if(Api.env !== 'production'){
            router.get('/:organizationId/students/:studentId/xsre-skip' + format, studentCtr.getStudentsBackpack);
            router.get('/dummy/test' + format, Api.controller('DummyController').index);
            router.get('/users/cleanup' + format, userCtr.cleanAll);
            router.route('/organizations' + format).post(auth.isBearerAuthenticated, auth.isAdmin, organizationCtr.create);
            router.route('/user' + format)
                  .post(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.create)
                  .delete(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.deleteByEmail)
            ;
      }


};

module.exports = Rest;