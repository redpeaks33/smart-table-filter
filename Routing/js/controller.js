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
        controller: ['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
            $scope.filterInfoContainer = {};
            $scope.isFiltering = false;
            this.getFilterInfoContainer = function () {
                return $scope.filterInfoContainer;
            };

            this.execute = function (element,predicate) {
                $scope.isFiltering = true;
                //if selected all, don't execute filter. Display all
                if (element.value == 'All')
                {
                    //Synchronize with 'All'
                    _.each($scope.original, function (item) {
                        item.visible = element.selected;
                    })

                    _.each($scope.filterInfoContainer, function (filterInfo, key) {
                        _.each(filterInfo, function (n) {
                            n.selected = element.selected;
                        });
                    });
                }
                else {
                    //initialize
                    _.each($scope.original, function (item) {
                        item.visible = true;
                    });

                    _.each($scope.filterInfoContainer, function (filterInfo, key) {
                        _.each(filterInfo, function (n) {
                            n.selected = element.selected;
                        });
                    });

                    //_.find($scope.filterInfoContainer[predicate], { value: 'All' }).selected = true;
                    //_.each($scope.filterInfoContainer[predicate], function (filterInfo) {
                    //    _.find(filterInfo, { value: 'All' }).selected = true;
                    //});

                    //filter original list 
                    _.each($scope.filterInfoContainer, function (filterInfo, key) {
                        var filterList = _.where(filterInfo, { selected: false })
                        _.each($scope.original, function (item) {
                            if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0) {
                                item.visible = false;
                            }
                        })
                    });

                    //create filterInfoContainer from filtered original list; !!!
                    //_.each($scope.filterInfoContainer, function (filterInfo, key) {
                    //    let converted = _.sortBy(_.uniq(_.flatten(_.pluck(scope.collection, key))));
                    //    //_.each($scope.original, function (item) {
                    //    //    if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0) {
                    //    //        item.visible = false;
                    //    //    }
                    //    //})
                    //});
                    //$rootScope.$broadcast('updateFilterInfo', $scope.filterInfoContainer)
                //_.each($scope.filterInfoContainer, function (filterInfo, key) {
                //    var filterInfoList = _.filter(filterInfo, function (n) { return n == element });
                //    if (filterInfoList.length == 0) {
                //        var filterList = _.each(filterInfo, function (n) {
                //            n.selected = true;
                //        });
                //    }
                //    else {
                //        _.filter(filterInfo, function (n) { return n.value == 'All' })[0].selected = true;
                //    }
                //});
                }
                //set collection in order to display
                $scope.collection = _.filter($scope.original, function (n) { return n.visible })

                $timeout(function () {
                    $scope.isFiltering = false;
                });
            };
        }],
        link: function (scope, element, attr, ctrl) {
            scope.filterInfoContainer = {};
            scope.$parent.isFiltering = false;
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
            title: '@',
            listonlydisplay:'='
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
                tableFilterCtrl.execute(element, scope.predicate);
            };
            scope.$on('updateFilterInfo', function (event, filterInfoContainer) {
                tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = filterInfoContainer[scope.predicate]
            });
        },
        //controller: ['$scope', function ($scope) {
        //    $scope.$on('setFilterInfo', function (event, args) {
        //        alert();
        //    });
        //}]
    };
});

main.directive('tableColumnSort', function () {
    return {
        restrict: 'EA',
        require: '?^table',
        scope: {
            collection: '=',
            predicate: '@',
            title: '@',
        },
        templateUrl: 'TableColumnSort.html',
        link: function (scope, element, attr, tableFilterCtrl) {
            var stateInfo = [{ id: 0, name: 'normal' }, { id: 1, name: 'asc' }, { id: 2, name: 'desc' }];
            scope.state = stateInfo[0];
            scope.execute = function () {
                scope.state = stateInfo[++scope.state.id % 2];

                var sorted = _.sortBy(scope.collection, function (n) {
                    return n[scope.predicate].name;
                });
                if(scope.state.id == 2){
                    scope.collection = sorted.reverse();
                }
                else if (scope.state.id == 1) {
                     scope.collection  = sorted;
                }
            };
        },
    };
});

main.directive('tableSearch', function () {
    return {
        restrict: 'EA',
        require: '?^table',
        scope: {
            collection: '=',
        },
        templateUrl: 'TableSearch.html',
        link: function (scope, element, attr, tableFilterCtrl) {
            scope.execute = function (model) {
                _.each(this.collection, function (n) {
                    alert(n);
                });
            };
        },
    };
});


