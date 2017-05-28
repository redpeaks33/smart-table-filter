var main = angular.module("app", ['infinite-scroll']);

main.controller('MyController', ['$scope', '$http', function ($scope, $http) {
    $scope.Message = 'Click Button';

    var
       nameList = [{ id: 1, name: 'Pierre' }, { id: 2, name: 'Pol' }, {id:3,name:'Jacques'}, {id:4,name:'Robert'}, {id:5,name:'Elisa'}],
       familyName = [{id:1,name:'Dupont'}, {id:2,name:'Germain'}, {id:3,name:'Delcourt'}, {id:4,name:'bjip'}, {id:5,name:'Menez'}],
       nationList = [{id:1,name:'USA'}, {id:2,name:'France'}, {id:3,name:'Germany'}],
       educationList = [{ id: 1, name: 'Doctorate' }, { id: 2, name: 'Master' }, { id: 3, name: 'Bachelor' }, { id: 4, name: 'High school' }];

    function createRandomItem(index) {
        var
          firstName = nameList[Math.floor(Math.random() * 5)],
          lastName = familyName[Math.floor(Math.random() * 5)],
          nationality = nationList[Math.floor(Math.random() * 3)],
          education = educationList[Math.floor(Math.random() * 4)];

        return {
            id:index,
            firstName: firstName,
            lastName: lastName,
            nationality: nationality,
            education: education
        };
    }

    $scope.collection = [];
    for (var j = 0; j < 20; j++) {
        $scope.collection.push(createRandomItem(j));
    };

    $scope.displayed = [].concat($scope.collection);

    $scope.loadMore = function () {
        var last = $scope.collection[$scope.collection.length - 1];

        for (var j = 0; j < 20; j++) {
            $scope.collection.push(createRandomItem(j));
            $scope.displayed =[].concat($scope.collection);
        };
    };
}]);
