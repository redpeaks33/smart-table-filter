main.directive('tableFilter', function () {
    return {
        restrict: 'EA',
        //require: '^table',
        scope: {
            original: '=',
            collection: '='
        },
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.filterInfoContainer = {};
            $scope.isFiltering = false;
            this.getFilterInfoContainer = function () {
                return $scope.filterInfoContainer;
            };

            this.execute = function (element, predicate) {
                $scope.isFiltering = true;
                //if selected all, don't execute filter. Display all
                if (element.value == 'All') {
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
        templateUrl: '/custom/html/TableColumnFilter.html',
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

main.directive('filRow', function () {
    return {
        restrict: 'EA',
        //require: '^table',
        scope: {
            original: '=',
            showing: '='
        },
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.filterInfoContainer = {};

            //#region getter
            this.getFilterInfoContainer = function () {
                return $scope.filterInfoContainer;
            }

            this.getOriginalCollection = function () {
                return $scope.original;
            };

            this.getShowingCollection = function () {
                return $scope.showing;
            };
            //#endregion

            //#region execute filter
            this.executeFilter = function (element, predicate) {
                //if selected all, don't execute filter. Display all
                if (element.value == 'Select All') {
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

                    //_.each($scope.filterInfoContainer, function (filterInfo, key) {
                    //    if (predicate == key)
                    //    {
                    //        _.each(filterInfo, function (n) {
                    //            if (filterInfo.value == element.value)
                    //            {
                    //                n.selected = element.selected;
                    //            }
                    //        });
                    //    }
                    //});

                    //_.find($scope.filterInfoContainer[predicate], { value: 'All' }).selected = true;
                    //_.each($scope.filterInfoContainer[predicate], function (filterInfo) {
                    //    _.find(filterInfo, { value: 'All' }).selected = true;
                    //});

                    //filter original list 
                    //_.each($scope.filterInfoContainer, function (filterInfo, key) {
                    //    var filterList = _.where(filterInfo, { selected: false })
                    //    _.each($scope.original, function (item) {
                    //        if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0) {
                    //            item.visible = false;
                    //        }
                    //    })
                    //});
                    _.each($scope.original, function (item) {
                        var filterElement = _.filter($scope.filterInfoContainer[predicate], function (n) {
                            return n.value == item[predicate].name
                        });
                        item.visible = filterElement[0].selected;
                    });

                    //Synchronize Select All

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
                $scope.showing = _.filter($scope.original, function (n) { return n.visible })
            };
            //#endregio
            ////#region execute filter
            //this.executeFilter = function (element, predicate) {
            //    //if selected all, don't execute filter. Display all
            //    if (element.value == 'All') {
            //        //Synchronize with 'All'
            //        _.each($scope.original, function (item) {
            //            item.visible = element.selected;
            //        })

            //        _.each($scope.filterInfoContainer, function (filterInfo, key) {
            //            _.each(filterInfo, function (n) {
            //                n.selected = element.selected;
            //            });
            //        });
            //    }
            //    else {
            //        //initialize
            //        _.each($scope.original, function (item) {
            //            item.visible = true;
            //        });

            //        _.each($scope.filterInfoContainer, function (filterInfo, key) {
            //            _.each(filterInfo, function (n) {
            //                n.selected = element.selected;
            //            });
            //        });

            //        //_.find($scope.filterInfoContainer[predicate], { value: 'All' }).selected = true;
            //        //_.each($scope.filterInfoContainer[predicate], function (filterInfo) {
            //        //    _.find(filterInfo, { value: 'All' }).selected = true;
            //        //});

            //        //filter original list 
            //        _.each($scope.filterInfoContainer, function (filterInfo, key) {
            //            var filterList = _.where(filterInfo, { selected: false })
            //            _.each($scope.original, function (item) {
            //                if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0) {
            //                    item.visible = false;
            //                }
            //            })
            //        });

            //        //create filterInfoContainer from filtered original list; !!!
            //        //_.each($scope.filterInfoContainer, function (filterInfo, key) {
            //        //    let converted = _.sortBy(_.uniq(_.flatten(_.pluck(scope.collection, key))));
            //        //    //_.each($scope.original, function (item) {
            //        //    //    if (item.visible && _.filter(filterList, function (n) { return n.value == item[key].name }).length > 0) {
            //        //    //        item.visible = false;
            //        //    //    }
            //        //    //})
            //        //});
            //        //$rootScope.$broadcast('updateFilterInfo', $scope.filterInfoContainer)
            //        //_.each($scope.filterInfoContainer, function (filterInfo, key) {
            //        //    var filterInfoList = _.filter(filterInfo, function (n) { return n == element });
            //        //    if (filterInfoList.length == 0) {
            //        //        var filterList = _.each(filterInfo, function (n) {
            //        //            n.selected = true;
            //        //        });
            //        //    }
            //        //    else {
            //        //        _.filter(filterInfo, function (n) { return n.value == 'All' })[0].selected = true;
            //        //    }
            //        //});
            //    }
            //    //set collection in order to display
            //    $scope.showing = _.filter($scope.original, function (n) { return n.visible })
            //};
            ////#endregion

            //#region sort
            this.executeSort = function (isDesc, predicate) {
                $scope.showing = _.sortBy($scope.showing, function (n) {
                    return n[predicate].name;
                });
                if (isDesc) {
                    $scope.showing = $scope.showing.reverse();
                }
            };
            //#endregion

            //#region text search 
            this.executeTextSearch = function (text,predicate) {
                //set collection in order to display
                $scope.showing = _.filter($scope.showing, function (n) {
                    return n[predicate].name.toLowerCase().indexOf(text) != -1;
                })
            };
            //#endregion

            //#region initialize
            this.executeInitialize = function () {
                //set collection in order to display
                $scope.showing = $scope.original;
            };
            //#endregion
        }],
        link: function (scope, element, attr, ctrl) {
            scope.filterInfoContainer = {};
            scope.$parent.isFiltering = false;
        }
    };
});

main.directive('filCol', function () {
    return {
        restrict: 'EA',
        require: '^filRow',
        scope: {
            predicate: '@',
            title: '@',
            onlyshowing: '=',
            onlychecked: '='
        },
        templateUrl: '/custom/html/TableColumnFilter.html',
        link: function (scope, element, attr, tableFilterCtrl) {
            initialize();

            function initialize() {
                //add title.
                scope.dropdownLabel = scope.title;

                //initialize collection
                scope.original = tableFilterCtrl.getOriginalCollection();
                scope.showing = tableFilterCtrl.getShowingCollection();
                scope.distinctItems = createDistinctItems();

                //set this column state to parent filter container .
                updateParentFilterContainer();
            }

            function createDistinctItems() {
                //extract predicate and get uniq and sort.
                let converted = _.sortBy(_.uniq(_.flatten(_.pluck(scope.original, scope.predicate))));
                //Add 'All' to list head.
                converted.unshift({
                    name: 'Select All',
                    selected: true
                });
                //convert for checkbox item list.
                return _.map(converted, function (n) {
                    let item = {
                        value: n.name,
                        selected: true
                    }
                    return item;
                });
            }

            function updateParentFilterContainer() {
                tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = scope.distinctItems;
            }

            function synchronizeAllSelection() {
                    var filterElements = _.filter(scope.distinctItems, function (n) {
                        return n.value != 'Select All' && n.selected == false;
                    });

                    _.find(scope.distinctItems, function (n) {
                        return n.value == 'Select All' 
                    }).selected = (filterElements.length == 0);
            }

            scope.filterChanged = function (element) {
                synchronizeAllSelection(element);
                updateParentFilterContainer();
                tableFilterCtrl.executeFilter(element, scope.predicate);
            };

            scope.sort = function (isDesc) {
                tableFilterCtrl.executeSort(isDesc, scope.predicate);
            };

            scope.clear = function () {
                tableFilterCtrl.executeInitialize();
            };

            scope.textSearch = function (text) {
                tableFilterCtrl.executeTextSearch(text, scope.predicate);
            };

            scope.showListingItem = function () {
                updateParentFilterContainer();
            };

            scope.showCheckedItem = function () {
                updateParentFilterContainer();
             };

            scope.$on('updateFilterInfo', function (event, filterInfoContainer) {
                tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = filterInfoContainer[scope.predicate]
            });
        },
    };
});

