 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute"]);

mainApp.controller("FormDesignCtr", function($scope) {
    $scope.models = {
        selected: null,
        templates: [
            {type: "<h1>Header</h1>", id: 2, label: "", component: "" },
            {type: "container", id: 1, columns: [[]]}
        ],
        dropzones: {
            "Form Design": [
            ]
        }
    };

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
