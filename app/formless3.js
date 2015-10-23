 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute","ui.bootstrap"]);

mainApp.controller("FormDesignCtr", function($scope) {
    var DEFAULT_LABEL = "Untitled";
    $scope.models = {
        selected: null,
        templates: [
            {type: "item", id: 1, name: "Text"  , icon:'glyphicon-font', label: DEFAULT_LABEL, component: "<input type='text' />", options: []},
            {type: "item", id: 2, name: "Number", icon:'glyphicon-sound-5-1', label: DEFAULT_LABEL, component: "<input type='number' />", options: []},
            {type: "item", id: 3, name: "Date"  , icon:'glyphicon-calendar', label: DEFAULT_LABEL, component: "<input type='date' />", options: []},
            {type: "item", id: 4, name: "Email" , icon:'glyphicon-envelope', label: DEFAULT_LABEL, component: "<input type='email' />", options: []},
            {type: "item", id: 5, name: "Paragraph", icon:'glyphicon-align-justify', label: DEFAULT_LABEL, component: "<input type='text' />", options: []},
            {type: "item", id: 6, name: "Radio", icon:'glyphicon-record', label: DEFAULT_LABEL, component: "<input type='number' />", options: []},
            {type: "item", id: 7, name: "Checkbox(es)"  , icon:'glyphicon-ok-circle', label: DEFAULT_LABEL, component: "<input type='date' />", options: []},
            {type: "item", id: 8, name: "Dropdown" , icon:'glyphicon-collapse-down', label: DEFAULT_LABEL, component: "<input type='email' />", options: []},
            {type: "item", id: 9, name: "Signature"  , icon:'glyphicon-pencil', label: DEFAULT_LABEL, component: "<input type='text' />", options: []},
            {type: "item", id: 10, name: "Attached File(s)", icon:'glyphicon-paperclip', label: DEFAULT_LABEL, component: "<input type='number' />", options: []},
            {type: "item", id: 11, name: "Header"  , icon:'glyphicon-header', label: DEFAULT_LABEL, component: "<input type='date' />", options: []},
            {type: "item", id: 12, name: "Section" , icon:'glyphicon-minus', label: DEFAULT_LABEL, component: "<input type='email' />", options: []},
                    
            {type: "container", id: 0, name: "Student", columns: [[]]}
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

mainApp.directive('htmlRender', function($compile) {
  return {
    restrict: 'E',
    scope: { html: '@' },
    link: function(scope, element) {
      scope.$watch('html', function(value) {
        if (!value) return;        
        var wrapper = angular.element('<div>');
        wrapper.html(value);
        var markup = $compile(wrapper.contents())(scope);
        element.append(markup)
      });
    }
  };
})

mainApp.controller("FileMenuCtr", function($scope){
    $scope.commands = [ {name: "Open", icon: "glyphicon-folder-open"},
                        {name: "New" , icon: "glyphicon-plus"},
                        {name: "New from Template" , icon: "glyphicon-list-alt"},
                        {name: "Save" , icon: "glyphicon-floppy-disk"},
                        {name: "Save As" , icon: "glyphicon-floppy-save"},
                        {name: "Quit" , icon: "glyphicon-log-out"},
                    ];
});

mainApp.controller("EditMenuCtr", function($scope){
    $scope.commands = [ {name: "Clear" , icon: "glyphicon-remove"},
                        {name: "Sign" , icon: "glyphicon-pencil"},
                        {name: "Verify" , icon: "glyphicon-ok"},
                    ];
});

mainApp.controller("ViewMenuCtr", function($scope){
    $scope.commands = [ {name: "Design view" , icon: "glyphicon-wrench"},
                        {name: "Edit view" , icon: "glyphicon-edit"}                        
                    ];
});

mainApp.controller("ToolMenuCtr", function($scope){
    $scope.commands = [ {name: "Settings" , icon: "glyphicon-cog"},
                        {name: "About" , icon: "glyphicon-info-sign"}                        
                    ];
});
