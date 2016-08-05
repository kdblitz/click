'use strict';

var module = angular.module('nokiaclick', []);

module.component('nokiaClickNav', {
	templateUrl: 'navbar.html'
});

module.component('dashboard', {
	templateUrl: 'dashboard.html',
	controller: function ($timeout, $http) {
		this.data = [];
		this.currentStates = {};

		getData.call(this);

		function getData () {
			var that = this;
			$http.get('/data.json').then(
				function (response) {
					var events = response.data;
					events.forEach(readEvent.bind(that));
					$timeout(getData.bind(that), 1000);
				}
			);
		}

		function readEvent(event) {
			if (event.value === "1" && !this.currentStates[event.name]) {
				this.currentStates[event.name] = {description:event.name, startTime:new Date()};
				this.data.push(this.currentStates[event.name]);
			} else if (event.value === "0" && this.currentStates[event.name]) {
				this.currentStates[event.name].endTime = new Date();
				delete this.currentStates[event.name];
			}
		}
	}
});

module.component('reports', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'reports.html'
});

module.component('clusterData', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'clusterData.html',
	controller: function ($scope) {
		var vm = this;
		$scope.$watchCollection(function () {
			return vm.data;
		}, cluster)

		function cluster (newData) {
			vm.clusteredData = _.groupBy(newData, function (item) {
				return item.description;
			});
		}
	}
});