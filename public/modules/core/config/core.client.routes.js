'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider, Authorization) {
		// Redirect to home view when route not found
		console.log('redirect to /forms')
		$urlRouterProvider.otherwise('/forms');
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', 'Auth', '$state', '$stateParams',
	function($rootScope, Auth, $state, $stateParams) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		// add previous state property
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {

			console.log('on state change')
			console.log(fromState)
			console.log(toState)

			$state.previous = fromState;
			//console.log('toState: '+toState.name);

			// var statesToIgnore = ['home', 'signin', 'resendVerifyEmail', 'verify', 'signup', 'signup-success', 'forgot', 'reset-invalid', 'reset', 'reset-success'];
			var statesToIgnore = ['home', 'resendVerifyEmail', 'verify', 'signup', 'signup-success', 'forgot', 'reset-invalid', 'reset', 'reset-success'];


			//Redirect to listForms if user is authenticated
			if(statesToIgnore.indexOf(toState.name) > 0){
				if(Auth.isAuthenticated()){
					console.log('/redirect to listforms 1')
					event.preventDefault(); // stop current execution
					$state.go('listForms'); // go to listForms page
				}
			}
			//Redirect to 'signup' route if user is not authenticated
			else if(toState.name !== 'access_denied' && !Auth.isAuthenticated() && toState.name !== 'submitForm'){
				console.log('/redirect to listforms 2')
				console.log(fromState.name)
				console.log(toState.name)
				console.log('//')
				event.preventDefault(); // stop current execution
				// $state.go('listForms'); // go to listForms page
			}

		});

	}
]);

//Page access/authorization logic
angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', 'Auth', 'User', 'Authorizer', '$state', '$stateParams',
	function($rootScope, Auth, User, Authorizer, $state, $stateParams) {
		$rootScope.$on('$stateChangeStart', function(event, next) {
			var authenticator, permissions, user;
			permissions = next && next.data && next.data.permissions ? next.data.permissions : null;

			Auth.ensureHasCurrentUser(User);
			user = Auth.currentUser;

			if(user){
				authenticator = new Authorizer(user);
				//console.log('access denied: '+!authenticator.canAccess(permissions));
				//console.log(permissions);
				if( (permissions !== null) ){
					if( !authenticator.canAccess(permissions) ){
						console.log('/redirect to access denied')
						event.preventDefault();
						//console.log('access denied');
						$state.go('access_denied');
					}
				}
			}
		});
	}]);
