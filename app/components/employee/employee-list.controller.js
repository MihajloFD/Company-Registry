(function() {
	"use strict";

	angular
		.module('company-registry.employee')
		.controller('EmployeeListController', EmployeeListController);

	EmployeeListController.$inject = ['$scope', '$location', 'employees', 'places', 'Employee'];
	function EmployeeListController($scope, $location, employees, places, Employee) {
		
		var elc = this;
		elc.employees = employees.results;
		elc.places = places.results;

		elc.pagination = {
			page: 1,
			pageSize: 5,
			iterator: new Array(Math.ceil(employees.count / 5)),
			changePage: function(page) {
				elc.pagination.page = page;
				getAll();
			}
		};

		$scope.$watch(function() {
			return elc.filter; 
		}, function(newVal, oldVal) {
			if(!angular.equals(newVal, oldVal)) { 
				getAll();
			}
		}, true); 

		elc.tableChanged = function(sortParam) {
			if(elc.sort === sortParam) {
				elc.sortDirection = elc.sortDirection == 'asc' ? 'desc' : 'asc';
			} else {
				elc.sort = sortParam;
				elc.sortDirection = 'asc';
			}
			getAll();
		};

		elc.edit = function(id) {
			$location.path("/employee/"+id);
		};

		function getAll() {
			Employee.get({sort: elc.sort, sortDirection: elc.sortDirection, filter: elc.filter, page: elc.pagination.page, pageSize: elc.pagination.pageSize}).$promise.then(function(data) {
				elc.employees = data.results;
				elc.pagination.iterator = new Array(Math.ceil(data.count / elc.pagination.pageSize));
			});
		}
	}
})();