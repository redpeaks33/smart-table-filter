main.directive('ganttTerm', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/html/ganttTerm.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
        }],
    };
});