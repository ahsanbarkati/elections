angular.module('electionsApp')
    .controller('adminController', function adminController ($state, $scope, localStorageService, dataFactory) {
        $scope.batches = dataFactory.batches;
        $scope.posts = dataFactory.posts;

        // Function to get postName
        $scope.getPostName = dataFactory.getPostName;

        function perm(xs) {
            let ret = [];

            for (let i = 0; i < xs.length; i = i + 1) {
                let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

                if(!rest.length) {
                    ret.push([xs[i]]);
                } else {
                    for(let j = 0; j < rest.length; j = j + 1) {
                        ret.push([xs[i]].concat(rest[j]));
                    }
                }
            }
            return ret;
        }

        var postGensecMap = {};
        for (var post of dataFactory.posts) {
            var gensecs = dataFactory.gensecs.filter(function(gensec) {
                return gensec.position === post;
            });
            postGensecMap[post] = perm(gensecs);
        }
        $scope.postGensecMap = postGensecMap;

        // Get senators
        $scope.getSenators = function(batch) {
            return dataFactory.senators[batch];
        };

        // Get no preference
        $scope.getNoPreference = function(position) {
            return localStorageService.get(position + 'NoPreference') || 0;
        };

        // Get votes for a particular ID
        $scope.getVotes = function (id, preference) {
            return localStorageService.get(id + '_' + preference) || 0;
        };

        $scope.getNames = function (gensecs) {
            return gensecs.map(function(g) {
                return g.name;
            }).join('    |    ');
        };

        // Get votes for a particular ID
        $scope.getGensecVotes = function (gensecs) {
            var id = gensecs.map(function(g) {
                return g.id;
            }).join('-');
            return localStorageService.get(id + '_' + 1) || 0;
        };

        // Close admin panel
        $scope.close = function () {
            // Redirect to login state
            $state.go('login');
        };

        // Exit the application
        $scope.exit = function () {
            // Exit the application
            var gui = require('nw.gui');
            gui.App.quit();
        };

        // Clear all the data
        $scope.clear = function() {
            // localStorageService.clearAll();
        };
    });
