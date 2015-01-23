angular.module('electionsApp')
    .controller('scienceController', function scienceController($state, $scope, localStorageService, dataFactory, $modal) {
        // Make a list of senators available to the view
        $scope.candidateList = dataFactory.getCandidates($state.current.stateName);
        $scope.candidateList.shuffle();

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
            localStorageService.set('nextState', 'films');
            $state.go('form.films');
        }

        // Process no preference
        $scope.processNoPreference = function () {
            $scope.formData.scienceNoPreference = true;

            // Jump to next state
            localStorageService.set('nextState', 'films');
            $state.go('form.films');
        };

        // Process the submit request
        $scope.processSubmit = function () {
            // Make sure the correct number of choices have been entered
            if ($scope.candidateList.length >= 4) {
                if (!$scope.formData.scienceFirst || !$scope.formData.scienceSecond || !$scope.formData.scienceThird) {
                    $modal.open({
                        templateUrl: 'partials/errorModal.html',
                        controller: 'threePreferencesErrorController'
                    });
                    return;
                }
            } else if ($scope.candidateList.length === 3) {
                if (!$scope.formData.scienceFirst || !$scope.formData.scienceSecond) {
                    $modal.open({
                        templateUrl: 'partials/errorModal.html',
                        controller: 'twoPreferencesErrorController'
                    });
                    return;
                }
            } else if ($scope.candidateList.length >= 1) {
                if (!$scope.formData.scienceFirst) {
                    $modal.open({
                        templateUrl: 'partials/errorModal.html',
                        controller: 'onePreferenceErrorController'
                    });
                    return;
                }
            }

            // The choice of candidates must be distinct
            if (($scope.candidateList.length > 2) &&
                (($scope.formData.scienceFirst === $scope.formData.scienceSecond) ||
                ($scope.formData.scienceSecond === $scope.formData.scienceThird) ||
                ($scope.formData.scienceThird === $scope.formData.scienceFirst))) {
                $modal.open({
                    templateUrl: 'partials/errorModal.html',
                    controller: 'choiceErrorController'
                });
                return;
            }

            // Clear no preference
            $scope.formData.scienceNoPreference = false;

            // Set the next state
            localStorageService.set('nextState', 'films');

            // Redirect to president
            $state.go('form.films');
        };
    });
