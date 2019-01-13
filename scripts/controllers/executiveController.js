angular.module('electionsApp')
    .controller('executiveController', function presidentContoller($state, $scope, localStorageService, dataFactory, $modal) {

        // Get state information
        var nextState = $state.current.nextState;
        var currentState = $state.current.stateName;

        // Make a list of senators available to the view
        $scope.candidateList = _.shuffle(dataFactory.getCandidates(currentState));

        // Create the selectionData object
        $scope.selectionData = _.fill(Array($scope.candidateList.length), null);

        // Setup the way the candidates will be displayed
        if ($scope.candidateList.length >= 3) {
            $scope.candidateClass = 'col-sm-3';
        } else if ($scope.candidateList.length === 2) {
            $scope.candidateClass = 'col-sm-6';
        } else {
            $scope.candidateClass = 'col-sm-12';
        }

        // Skip this step if there are no items in the list
        if ( !$scope.candidateList || $scope.candidateList.length === 0) {
            localStorageService.set('nextState', nextState);
            $state.go('form.' + nextState);
        }

        // Process no preference
        $scope.processNoPreference = function () {
            $scope.formData[currentState + 'NoPreference'] = true;

            // Clear others
            $scope.formData[currentState + 'All'] = [];

            // Set the next state
            localStorageService.set('nextState', nextState);
            $state.go('form.' + nextState);
        };

        // Process the submit request
        $scope.processSubmit = function () {
            // Make sure the correct number of choices have been entered
            if (_.some($scope.selectionData, function(value) { return value == null; })) {
                $modal.open({
                    templateUrl: 'partials/errorModal.html',
                    controller: 'allPreferencesErrorController'
                });
                return;
            }

            // The choice of candidates must be distinct
            if (_.uniq($scope.selectionData).length !== $scope.candidateList.length) {
                $modal.open({
                    templateUrl: 'partials/errorModal.html',
                    controller: 'choiceErrorController'
                });
                return;
            }

            // Clear no preference
            $scope.formData[currentState + 'NoPreference'] = false;

            // Pass on the preferences
            $scope.formData[currentState + 'All'] = $scope.selectionData;

            // Set the next state
            localStorageService.set('nextState', nextState);
            $state.go('form.' + nextState);
        };
    });
