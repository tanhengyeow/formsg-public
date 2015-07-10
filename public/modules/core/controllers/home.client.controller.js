'use strict';


angular.module('core').controller('HomeController', ['$rootScope', '$scope', 'User', 'Auth', '$state',
	function($rootScope, $scope, User, Auth, $state) {
		$scope = $rootScope;

		$scope.user = Auth.ensureHasCurrentUser(User);
	    $scope.authentication = Auth;

	    // if($scope.authentication.isAuthenticated()){
	    	// $state.go('listForms');
	    // }

	}
]);