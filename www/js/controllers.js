angular.module('staffApp', []).controller('staffPageInfo', function($scope) {
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

});
//staffPageInfo end

  
