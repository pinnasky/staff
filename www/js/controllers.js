angular.module('staffApp', ['ngSanitize']).controller('staffPageInfo', function($scope,$sce) {
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

});
//staffPageInfo end

  
