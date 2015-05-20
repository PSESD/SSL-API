

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
	var indexController = Api.controller('Index');
	var authController = Api.controller('Auth');

	router.get('/', indexController.index);
	// Create endpoint handlers for /
	//router.route('/')
	//  .get(authController.isAuthenticated, indexController.index);

};

module.exports = Rest;