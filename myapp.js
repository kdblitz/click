'use strict';

var module = angular.module('nokiaclick', ['ui.router']);

module.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('dashboard', {
      url: '/',
      template: '<dashboard data="$ctrl.data"></dashboard>'
    })
		.state('signalAnalytics', {
      url: '/analytics',
      template: '<analytics data="$ctrl.data"></analytics>'
    })
		.state('macroAnalytics', {
			url: '/macroAnalytics',
			template: '<macro-analytics data="$ctrl.data"></macro-analytics>'
		});
});

module.component('nokiaClickNav', {
	templateUrl: 'templates/navbar.html'
});

module.component('nokiaClick', {
	templateUrl: 'templates/nokiaClick.html',
	controller: function ($timeout, $http) {
		this.data = [];
		this.currentStates = {};

		getData.call(this);

		function getData () {
			var that = this;
			$http.get('/data.json').then(
				function (response) {
					var events = response.data['Nokia Manila'];
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

module.component('dashboard', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/dashboard.html'
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
				var analysis = {};
				analysis.description = key;
				analysis.length = cluster.length;
				analysis.responseTime = _.random(1, 60) + ' mins';
				return analysis;
			});
		}
	}
});

module.component('analytics', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/analytics.html'
});

module.component('statistics', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/statistics.html'
});

module.component('interval', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/interval.html'
});

module.component('macroAnalytics', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/macroAnalytics.html'
});

module.component('macroStatistics', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/macroStatistics.html'
});

module.component('signalComparison', {
	bindings: {
		'data': '<'
	},
	templateUrl: 'templates/signalComparison.html'
});
