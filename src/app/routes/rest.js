

function Rest(router, Api) {
    var self = this;
    self.handleRoutes(router, Api);
}
/**
 * Handle Route from Request
 * @param router
 * @param Api
 */
Rest.prototype.handleRoutes= function(router, Api) {
    var userCtr = Api.controller('UserController');

	var organizationCtr = Api.controller('OrganizationController');

	var studentCtr = Api.controller('StudentController');
	var tagCtr = Api.controller('TagController');
	var indexCtr = Api.controller('IndexController');
    var studentProgramCtr = Api.controller('StudentProgramController');
    var prsCtr = Api.controller('PRSController');
	var auth = Api.controller('Auth');

	router.get('/', indexCtr.index);

	router.get('/heartbeat', function(req, res) {
        res.send('OK');
    });

    router.get('/users/cleanup', userCtr.cleanAll);


	router.route('/user')
		.get(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.get)
        .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.save)
        .post(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.create)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.deleteByEmail)
    ;

    router.route('/user/role/:userId')
        .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, userCtr.setRole)
        .get(auth.isBearerAuthenticated, userCtr.getRole)
    ;

    router.route('/user/myaccount')
        .get(auth.isBearerAuthenticated, userCtr.myAccount)
        .put(auth.isBearerAuthenticated, userCtr.updateAccount)
    ;

    router.route('/organizations')
        .post(auth.isBearerAuthenticated, auth.isAdmin, organizationCtr.create)
        .get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.get);

    router.route('/:organizationId').get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.find);

    router.route('/:organizationId/profile')
        .get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.profile)
        .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.updateProfile);

    router.route('/:organizationId/users')
        .post(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.postUser)
        .get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.allUsers);

    router.route('/:organizationId/users/:userId')
        .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.putUser)
        .get(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.getUser)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, organizationCtr.deleteUser)
    ;

    router.route('/:organizationId/programs')
        .get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.allProgram)
        .post(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.postProgram);

    router.route('/:organizationId/programs/:programId')
        .get(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.getProgram)
        .put(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.putProgram)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, organizationCtr.deleteProgram)
    ;

    router.route('/:organizationId/students')
          .post(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.createByOrgId)
          .get(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudents);


    router.route('/:organizationId/students/not-assign')
        .get(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudentNotAssigns);

    router.route('/:organizationId/students/:studentId')
        .get(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudentById)
        .put(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.putStudentById)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.deleteStudentById);

    router.route('/:organizationId/users/:userId/students')
        .get(auth.isBearerAuthenticated, auth.hasAccess, userCtr.getByUserId)
        .post(auth.isBearerAuthenticated, auth.hasAccess, userCtr.postByUserId)
    ;

    router.route('/:organizationId/users/:userId/students/:studentId')
        .get(auth.isBearerAuthenticated, auth.hasAccess, userCtr.getStudentUserById)
        .put(auth.isBearerAuthenticated, auth.hasAccess, userCtr.putStudentUserById)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, userCtr.deleteStudentUserById)
    ;
    /**
     * Tag route
     */
    router.route('/:organizationId/tags')
        .post(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, tagCtr.createByOrgId)
        .get(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, tagCtr.getTags);

    router.route('/:organizationId/tags/:tagId')
        .get(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, tagCtr.getTagById)
        .put(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, tagCtr.putTagById)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, auth.isAdmin, tagCtr.deleteTagById);

    router.route('/:organizationId/students/:studentId/xsre').get(auth.isBearerAuthenticated, auth.hasAccess, studentCtr.getStudentsBackpack);


    router.route('/:organizationId/students/:studentId/programs')
        .get(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getByStudentId)
        .post(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.addByStudentId)
    ;

    router.route('/:organizationId/programs/:programId/students')
        .get(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getByProgramId)
        .post(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.addByProgramId)
    ;

    router.route('/:organizationId/programs/:programId/students/:studentId')
        .get(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.getStudentById)
        .put(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.putStudentById)
        .delete(auth.isBearerAuthenticated, auth.hasAccess, studentProgramCtr.deleteStudentById)
    ;

    router.route('/:organizationId/xsre/districts').get(auth.isBearerAuthenticated, auth.hasAccess, prsCtr.getDistricts);

    /**
     * Only for development
     */
    if(Api.env !== 'production') {
        router.get('/:organizationId/students/:studentId/xsre-skip', studentCtr.getStudentsBackpack);
        router.get('/dummy/test', Api.controller('DummyController').index);
    }



};

module.exports = Rest;