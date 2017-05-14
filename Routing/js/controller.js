var main = angular.module("app", ['ui.router']);

main.controller('MyController', ['$scope', '$http', function ($scope, $http) {
    $scope.Message = 'Click Button';

    var
       nameList = [{ id: 1, name: 'Pierre' }, { id: 2, name: 'Pol' }, {id:3,name:'Jacques'}, {id:4,name:'Robert'}, {id:5,name:'Elisa'}],
       familyName = [{id:1,name:'Dupont'}, {id:2,name:'Germain'}, {id:3,name:'Delcourt'}, {id:4,name:'bjip'}, {id:5,name:'Menez'}],
       nationList = [{id:1,name:'USA'}, {id:2,name:'France'}, {id:3,name:'Germany'}],
       educationList = [{ id: 1, name: 'Doctorate' }, { id: 2, name: 'Master' }, { id: 3, name: 'Bachelor' }, { id: 4, name: 'High school' }];

    function createRandomItem() {
        var
          firstName = nameList[Math.floor(Math.random() * 5)],
          lastName = familyName[Math.floor(Math.random() * 5)],
          nationality = nationList[Math.floor(Math.random() * 3)],
          education = educationList[Math.floor(Math.random() * 4)];

        return {
            firstName: firstName,
            lastName: lastName,
            nationality: nationality,
            education: education
        };
    }

    $scope.itemsByPage = 15;

    $scope.collection = [];
    
    for (var j = 0; j < 200; j++) {
        $scope.collection.push(createRandomItem());
    };
    $scope.displayed = [].concat($scope.collection);


}]);

main.directive('tableFilter', function () {
    return {
        restrict: 'EA',
        //require: '^table',
        scope: {
            original:'=',
            collection: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.filterInfoContainer = {};

            this.getFilterInfoContainer = function () {
                return $scope.filterInfoContainer;
            };

            this.execute = function (element) {
                let filteredCollection = [];

                //if selected all, don't execute filter. Display all
                if (element.value == 'All')
                {
                    //Synchronize with 'All'
                    _.each($scope.original, function (item) {
                        item.visible = element.selected;
                    })

                    _.each($scope.filterInfoContainer, function (filterInfo, key) {
                        var filterList = _.each(filterInfo, function (n) {
                            n.selected = element.selected;
                        });
                    });
                }
                else {
                
                //initialize
                _.each($scope.original, function (item) {
                        item.visible = true;
                })

                //filter 
                _.each($scope.filterInfoContainer, function (filterInfo,key) {
                    var filterList = _.where(filterInfo, { selected: false })

                    _.each($scope.original, function (item) {
                        if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0)
                        {
                            item.visible = false;
                        }
                    })
                });
                }
                //set collection in order to display
                $scope.collection = _.filter($scope.original, function (n) { return n.visible })
            };
        }],
        link: function (scope, element, attr, ctrl) {
            scope.filterInfoContainer = {};
        }
    };
});

main.directive('tableColumnFilter', function () {
    return {
        restrict: 'EA',
        require: '^tableFilter',
        scope: {
            collection: '=',
                predicate: '@',
        title: '@'
        },
        templateUrl: 'TableColumnFilter.html',
        link: function (scope, element, attr, tableFilterCtrl) {
            initialize();
            function initialize() {
                //add title.
                scope.dropdownLabel = scope.title;
                //extract predicate and get uniq and sort.
                let converted = _.sortBy(_.uniq(_.flatten(_.pluck(scope.collection, scope.predicate))));
                //Add 'All' to list head.
                converted.unshift({
                    name: 'All',
                    selected: true
                });
                //convert for checkbox item list.
                scope.distinctItems = _.map(converted, function (n) {
                    let item = {
                        value: n.name,
                        selected: true
                    }

                    return item;
                });

                tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = scope.distinctItems;
            }

            scope.filterChanged = function (element) {
                tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = scope.distinctItems;
                tableFilterCtrl.execute(element);
            }
        }

    };
});


