 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute","ui.bootstrap"]);

mainApp.controller("FormDesignCtr", function($scope) {
    var DEFAULT_LABEL = "Untitled";
    var NO_LABEL = "";
    var REQ_DEFAULT = 'yes';
    var PROPERTIES_DEFAULT = "<div class='option-item' ng-repeat='option in item.field_options'>\
                                <input type='checkbox' ng-checked='{{option.checked}}' ng-model='option.checked'/>\
                                <input type='text' value='{{option.label}}' ng-model='option.label'/>\
                                <a class='mini-item item-add glyphicon-plus'></a>\
                                <a class='mini-item item-remove glyphicon-minus'></a>\
                            </div>\
                            <button type='button' class='btn btn-primary btn-xs'>Add option</button>";


    $scope.models = {
        selected: null,
        templates: [
            {
                type: "item", 
                id: 0, 
                name: "Text"  , 
                icon:'glyphicon-font', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='text' />"            
            },
            {
                type: "item", 
                id: 0, 
                name: "Number", 
                icon:'glyphicon-sound-5-1', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='number' />"
            },
            {
                type: "item", 
                id: 0, 
                name: "Date"  , 
                icon:'glyphicon-calendar', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='date' />",
            },
            {
                type: "item", 
                id: 0, 
                name: "Email" , 
                icon:'glyphicon-envelope',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                component: "<input type='email' />"
            },
            {
                type: "item", 
                id: 0, 
                name: "Paragraph", 
                icon:'glyphicon-align-justify',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                component: "<textarea rows='5'></textarea>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Radio", 
                icon:'glyphicon-record', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='radio' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.checked}}' ng-checked='{{option.checked}}'/>\
                                <span ng-model='option.label'>{{option.label}}</span><br ng-repeat-end/>", 
                field_options:[
                            {label: "Radio 1", checked: true},
                            {label: "Radio 2", checked: true}
                        ],
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Checkbox"  , 
                icon:'glyphicon-ok-circle', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='checkbox' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' ng-checked='{{option.checked}}'/>\
                                <span ng-model='option.label'>{{option.label}}</span><br ng-repeat-end />", 
                field_options:[
                            {label: "Checkbox 1", checked: true},
                            {label: "Checkbox 2", checked: false}
                        ],
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Dropdown" , 
                icon:'glyphicon-collapse-down', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<select>\
                                <option ng-repeat='option in item.field_options' value='{{option.label}}'>{{option.label}}</option>\
                             </select>", 
                field_options: [
                                    {label: "Option 1", checked: true},
                                    {label: "Option 2", checked: false}
                                ],
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Signature"  , 
                icon:'glyphicon-pencil', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='file' />"
            },
            {
                type: "item", 
                id: 0, 
                name: "Attached File(s)", 
                required: REQ_DEFAULT,
                icon:'glyphicon-paperclip', 
                label: DEFAULT_LABEL, 
                component: "<input type='file' multiple/>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Header"  , 
                icon:'glyphicon-header', 
                label: NO_LABEL, 
                component: "<h1>Header of the form</h1>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Section", 
                icon:'glyphicon-minus', 
                label: NO_LABEL, 
                component: "<h3>Section of a part</h3>"
            },       
            {
                type: "container", 
                id: 1, 
                name: "Student", 
                properties: [
                    {name: "Nom", type: "text"},
                    {name: "Prenom", type: "text"},
                    {name: "Date de naissance", type: "date"},
                    {name: "Sexe", type: "text"}
                    ]
                ,
                columns: [[]]
            }
            ,            
            {
                type: "container", 
                id: 1, 
                name: "Teacher", 
                columns: [[]]
            }
            ,            
            {
                type: "container", 
                id: 1, 
                name: "Project", 
                columns: [[]]
            }
        ],
        dropzones: {
            "Form Design": [
            ]
        }
    };

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        console.log($scope.modelAsJson);
    }, true);

});

mainApp.directive('htmlRender', function($compile, $sce) {
  return {
    restrict: 'E',
    transclude: true,
    scope: { item: '=' , val: '@'},
    link: function(scope, element) {

        var value = scope.item[scope.val];
        if (!value) return;        
        var wrapper = angular.element('<div>');value
        value=$sce.trustAsHtml(value);
        wrapper.html(value);
        var markup = $compile(wrapper.contents())(scope);
        element.append(markup)
        console.log(markup);
    }
  }
});

mainApp.directive('bindUnsafeHtml', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
          scope.$watch(
            function(scope) {
              // watch the 'bindUnsafeHtml' expression for changes
              return scope.$eval(attrs.bindUnsafeHtml);
            },
            function(value) {
              // when the 'bindUnsafeHtml' expression changes
              // assign it into the current DOM
              element.html(value);

              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
            }
        );
    };
}]);

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
