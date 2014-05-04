var staffApp = angular.module('staffApp', ['ngSanitize','ui.bootstrap']);
staffApp.controller('staffPageInfo', function($scope,$sce) {
	//localStorage.clear();
	$scope.ws = localStorage.getItem("ws");
	if ($scope.ws)
		$("#txtWs").addClass('trans-input');
	if (localStorage.getItem("login_rem")) {
		$scope.loginname = localStorage.getItem("username");
		$scope.password = localStorage.getItem("password");
		$("#login_rem").attr("checked", true);
	}
	
	$scope.userListFilte = function (row) {
    return !!((angular.lowercase(row.USR_FIRSTNAME).indexOf(angular.lowercase($scope.userListSearch) || '') !== -1 || angular.lowercase(row.USR_LASTNAME).indexOf(angular.lowercase($scope.userListSearch) || '') !== -1));
  };
  
  $scope.trustHtml = function (html) {
  	return $sce.trustAsHtml(html);
  }
  
  $scope.trustUrl = function (url) {
    return $sce.trustAsUrl(url);
  }
    
    
});
staffApp.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);
            // compile the new DOM and link it to the current scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    })
//staffPageInfo end

var DatepickerCtrl = function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
};