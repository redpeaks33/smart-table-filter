main.directive('ganttTable', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/html/ganttTable.html',
        controller: ['$scope', function ($scope) {
            $scope.totalDisplayed = 40;
            $scope.$on('setChartData', function (e, data) {
                $scope.collection = data;//alert(data);
            });
            $scope.loadMode = function () {
                $scope.totalDisplayed += 20;
                $scope.start_ms = new Date().getTime();
                $timeout(function () {
                    $scope.elapsed_ms = new Date().getTime() - $scope.start_ms;
                    alert($scope.elapsed_ms);
                });
            }
        }],
    };
});