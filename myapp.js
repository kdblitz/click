'use strict';

var module = angular.module('nokiaclick', []);

module.component('nokiaClickNav', {
	templateUrl: 'templates/navbar.html'
});

module.component('dashboard', {
	templateUrl: 'templates/dashboard.html',
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
				this.data.unshift(this.currentStates[event.name]);
			} else if (event.value === "0" && this.currentStates[event.name]) {
				this.currentStates[event.name].endTime = new Date();
				delete this.currentStates[event.name];
			}
		}
	}
});

module.component('eventLogs', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/eventLogs.html'
});

module.component('clusterData', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/clusterData.html',
	controller: function ($scope) {
		var vm = this;
		$scope.$watchCollection(function () {
			return vm.data;
		}, cluster)

		function cluster (newData) {
			var clusteredData = _.groupBy(newData, function (item) {
				return item.description;
			});
			vm.clusteredData = _.map(clusteredData, function (cluster, key) {
				console.log(arguments);
				var analysis = {};
				analysis.description = key;
				analysis.length = cluster.length;
				analysis.responseTime = _.random(1, 60) + ' mins';
				return analysis;
			});
		}
	}
});
