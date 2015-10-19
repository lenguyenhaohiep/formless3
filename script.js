 /**
 * The controller doesn't do much more than setting the initial data model
 */
angular.module("demo",["dndLists"]).controller("NestedListsDemoController", function($scope) {

    $scope.models = {
        selected: null,
        templates: [
            {type: "item", id: 4},
            {type: "item", id: 2},
            {type: "container", id: 1, columns: [[]]}
        ],
        dropzones: {
            "Template": [
            ],
	    "zone 2": [],
	    "zone 3": []
        }
    };

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
