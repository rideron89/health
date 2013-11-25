var myApp = angular.module("myApp", []);

myApp.controller("SpicyCtrl", ["$scope", function($scope) {
	$scope.spice = "very";

	$scope.spicy = function(spice) {
		$scope.spice = spice;
	};
}]);
