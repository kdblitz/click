'use strict';

var module = angular.module('nokiaclick', []);

module.component('nokiaClickNav', {
	templateUrl: 'navbar.html'
});

module.component('dashboard', {
	templateUrl: 'dashboard.html',
	controller: function ($timeout, $http) {
		this.data = [];

		getData.call(this);

		function getData () {
			var that = this;
			$http.get('/data.json').then(
				function (response) {
					var events = response.data;
					events.forEach(readEvent.bind(that));
					$timeout(getData.bind(that), 5000);
				}
			);
		}

		function readEvent(event) {
			this.data.push(event);
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
	controller: function () {
		var data = this.data;
		// this.cluster = function () {
		// 	// this.clusteredData =
		// }
	}
});