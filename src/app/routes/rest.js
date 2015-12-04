'use strict';
/**
 *
 * @param router
 * @param Api
 * @constructor
 */
function Rest(router, Api){

      this.router = router;

      this.Api    = Api;

      this.format = '.:format?';
      /**
       * Defined Controller
       */
      this.userController = this.Api.controller('UserController');

      this.organizationController = this.Api.controller('OrganizationController');

      this.studentController = this.Api.controller('StudentController');

      this.tagController = this.Api.controller('TagController');

      this.indexController = this.Api.controller('IndexController');

      this.studentProgramController = this.Api.controller('StudentProgramController');

      this.authController = this.Api.controller('Auth');

      this.handleRoutes();
}

/**
 *
 */
Rest.prototype.handleRoutes = function(){

      this.routeHome();

      this.routeUser();

      this.routeOrganization();

      this.routeOrganizationUser();

      this.routeOrganizationProgram();

      this.routeOrganizationStudent();

      this.routeOrganizationUserStudent();

      this.routeStudentProgram();

      this.routeProgramStudent()

      this.routeTag();

      this.routeTest();

};

/**
 *
 */
Rest.prototype.routeHome = function(){

      this.router.get('/' + this.format, this.indexController.index);

      this.router.get('/heartbeat' + this.format, function(req, res){
            res.sendSuccess('OK');
      });

};
/**
 *
 */
Rest.prototype.routeUser = function(){

      this.router.route('/user' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.userController.get)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.userController.save)
      ;
};
/**
 *
 */
Rest.prototype.routeOrganization = function(){

      this.router.route('/organizations' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.get);

      this.router.route('/:organizationId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.find);

      this.router.route('/:organizationId/profile' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.profile)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.organizationController.updateProfile);

};
/**
 *
 */
Rest.prototype.routeOrganizationUser = function(){

      this.router.route('/:organizationId/users' + this.format)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.organizationController.postUser)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.allUsers);

      this.router.route('/:organizationId/users/:userId' + this.format)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.organizationController.putUser)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.organizationController.getUser)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.organizationController.deleteUser)
      ;
};
/**
 *
 */
Rest.prototype.routeOrganizationProgram = function(){

      this.router.route('/:organizationId/programs' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.allProgram)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.postProgram);

      this.router.route('/:organizationId/programs/:programId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.getProgram)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.putProgram)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.organizationController.deleteProgram)
      ;
};
/**
 *
 */
Rest.prototype.routeOrganizationStudent = function(){
      this.router.route('/:organizationId/students' + this.format)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.createByOrgId)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.getStudents);

      this.router.route('/:organizationId/students/:studentId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.getStudentById)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.putStudentById)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.deleteStudentById);

};
/**
 *
 */
Rest.prototype.routeOrganizationUserStudent = function(){
      this.router.route('/:organizationId/users/:userId/students' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.getByUserId)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.postByUserId)
      ;

      this.router.route('/:organizationId/users/:userId/students/:studentId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.getStudentUserById)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.putStudentUserById)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.deleteStudentUserById)
      ;

      this.router.route('/:organizationId/students/:studentId/xsre' + this.format)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.deleteCacheStudentsBackpack)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentController.getStudentsBackpack);
};
/**
 *
 */
Rest.prototype.routeStudentProgram = function(){

      this.router.route('/:organizationId/students/:studentId/programs' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.getByStudentId)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.addByStudentId)
      ;

      this.router.route('/:organizationId/students/:studentId/programs/CBOStudent.xml')
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.getByStudentIdXsre)
      ;
};
/**
 *
 */
Rest.prototype.routeProgramStudent = function(){

      this.router.route('/:organizationId/programs/:programId/students' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.getByProgramId)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.addByProgramId)
      ;

      this.router.route('/:organizationId/programs/:programId/students/:studentId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.getStudentById)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.putStudentById)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.studentProgramController.deleteStudentById)
      ;


};
/**
 *
 */
Rest.prototype.routeTag = function(){
      /**
       * Tag route
       */
      this.router.route('/:organizationId/tags' + this.format)
            .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.tagController.createByOrgId)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.tagController.getTags);

      this.router.route('/:organizationId/tags/:tagId' + this.format)
            .get(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.tagController.getTagById)
            .put(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.tagController.putTagById)
            .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.tagController.deleteTagById);

};
/**
 * Only for development
 */
Rest.prototype.routeTest = function(){

      if(this.Api.env !== 'production'){
            this.router.get('/:organizationId/students/:studentId/xsre-skip' + this.format, this.studentController.getStudentsBackpack);
            this.router.get('/dummy/test' + this.format, this.Api.controller('DummyController').index);
            this.router.get('/users/cleanup' + this.format, this.userController.cleanAll);
            this.router.route('/organizations' + this.format).post(this.authController.isBearerAuthenticated, this.authController.isAdmin, this.organizationController.create);
            this.router.route('/user' + this.format)
                  .post(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.create)
                  .delete(this.authController.isBearerAuthenticated, this.authController.hasAccess, this.authController.isAdmin, this.userController.deleteByEmail)
            ;
      }
};

module.exports = Rest;