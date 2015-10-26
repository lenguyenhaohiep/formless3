 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute","ui.bootstrap"]);

mainApp.controller("FormDesignCtr", function($scope) {
    /**
    *   Some default values
    */
    var DEFAULT_LABEL = "Untitled";
    var NO_LABEL = "";
    var REQ_DEFAULT = 'yes';
    var PROPERTIES_DEFAULT ="<div class='option-item' ng-repeat='option in item.field_options'>\
                                <input type='checkbox' ng-checked='{{option.checked}}' ng-model='option.checked' ng-click='$parent.$parent.setSelect(item, option)'/>\
                                <input type='text' value='{{option.label}}' ng-model='option.label'/>\
                                <a class='mini-item item-add glyphicon-plus' ng-click='$parent.$parent.addOption(item, $index+1)'></a>\
                                <a class='mini-item item-remove glyphicon-minus' ng-click='$parent.$parent.removeOption(item, $index)'></a>\
                                </div>\
                                <button type='button' class='btn btn-primary btn-xs' ng-click='$parent.$parent.addOption(item, -1)'>Add option</button>";
    var DEFAULT_LABEL_OPTION = "Option";
    var DEFAULT_CHECK_OPTION = false;


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
                value: null,
                component: "<input type='text' class='form-control' ng-model='item.value' />"            
            },
            {
                type: "item", 
                id: 0, 
                name: "Number", 
                icon:'glyphicon-sound-5-1', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='number' class='form-control' ng-model='item.value'/>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Date"  , 
                icon:'glyphicon-calendar', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='date' class='form-control' ng-model='item.value'/>",
            },
            {
                type: "item", 
                id: 0, 
                name: "Email" , 
                icon:'glyphicon-envelope',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='email' pattern='([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})' class='form-control' ng-model='item.value'/>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Paragraph", 
                icon:'glyphicon-align-justify',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                value: null,
                component: "<textarea rows='5' class='form-control' ng-model='item.value' /></textarea>"
            },
            {
                type: "item", 
                id: 0, 
                name: "Radio", 
                icon:'glyphicon-record', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='radio' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' ng-model='item.value' ng-value='option' ng-click='$parent.$parent.setSelect(item, option)'/><span ng-model='option.label'>{{option.label}}</span><br ng-repeat-end/>", 
                field_options:[
                            {label: "Radio 1", checked: false},
                            {label: "Radio 2", checked: false}
                        ],
                value: null,
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Checkbox"  , 
                icon:'glyphicon-ok-circle', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='checkbox' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' ng-checked='{{option.checked}}' ng-click='$parent.$parent.setSelect(item, option)'/><span ng-model='option.label'>{{option.label}}</span><br ng-repeat-end />", 
                field_options:[
                            {label: "Checkbox 1", checked: false},
                            {label: "Checkbox 2", checked: false}
                        ],
                value: null,
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Dropdown" , 
                icon:'glyphicon-collapse-down', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<select class='form-control' ng-model='item.value' ng-options='option.label for option in item.field_options'></select>", 
                field_options: [
                                    {label: "Option 1", checked: false},
                                    {label: "Option 2", checked: false}
                                ],
                value: null,
                properties: PROPERTIES_DEFAULT
            },
            {
                type: "item", 
                id: 0, 
                name: "Signature"  , 
                icon:'glyphicon-pencil', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='file' />"
            },
            {
                type: "item", 
                id: 0, 
                name: "Attached File(s)", 
                required: REQ_DEFAULT,
                icon:'glyphicon-paperclip', 
                label: DEFAULT_LABEL,
                value: null, 
                component: "<input type='file' multiple/>"
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Header"  , 
                icon:'glyphicon-header', 
                label: "Header of the form", 
                component: "<h1>{{item.label}}</h1>"
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Section", 
                icon:'glyphicon-minus', 
                label: "Section", 
                component: "<h3>{{item.label}}</h3>"
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
            DEFAULT_ZONE: [
            ]
        }
    };


    /**
    *   When an options for checkbox/radio/dropdown is selected, we mark them as checked=true
    */
    $scope.setSelect = function(item, option){
        if (item.name != 'Checkbox'){
            alert(item.name);
            angular.forEach(item.field_options, function(i){
                i.checked = false;
            });
            option.checked = true;

            item.value = option;
        }
        else{
            item.value = [];
            angular.forEach(item.field_options, function(i){
                if (i.checked)
                    item.value.push(i);
            });
        }
    };


    /**
    *   Add more options for checkbox/radio/dropdown
    *   item is an object which represents a field/container
    *   When index=-1, we add an option at the end
    */
    $scope.addOption = function(item, index){
        var new_option = {label: DEFAULT_LABEL, checked: DEFAULT_CHECK_OPTION};
        //Last of the list
        if (index == -1){
            index = item.field_options.length;
        }
        //At after index
        item.field_options.splice(index,0,new_option);

    };


    /**
    *   Remove an option at index for the current item
    */
    $scope.removeOption = function(item, index){
        item.field_options.splice(index, 1);
    };

    /*
    *   Delete an item in the current model
    */
    $scope.removeItem = function(index) {
        $scope.models.dropzones.DEFAULT_ZONE.splice(index,1);
        $scope.models.selected = null;
    }

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        //console.log($scope.modelAsJson);
    }, true);

});


/**
* This directive is used to render code HTML from text to the page, this method is unsafe method, pay attention in use
* This plugin aims to work only in the offline mode, so this method has no risk in this case
*/
mainApp.directive('htmlRender', function($compile, $sce) {
  return {
    restrict: 'E',
    transclude: true,
    scope: { item: '=' , val: '@'},
    link: function(scope, element) {
        var value = scope.item[scope.val];
        if (!value) return;

        //Wrap in case text only so that the compile can work without error        
        var wrapper = angular.element('<div>');value

        //Trusted HTML
        value=$sce.trustAsHtml(value);
        wrapper.html(value);
        var markup = $compile(wrapper.contents())(scope);
        element.append(markup)
        console.log(markup);
    }
  }
});

/**
* When we enter the mouse in every field/ container in the form, the "remove" button will appear and allow us delete current field/container
*/
mainApp.directive('flItem', function (){
    return function(scope, element, attr){
        var delete_button = angular.element(element[0].querySelector('.item-fix'));

        //Upon mouse leaves
        element.on('mouseleave',function(){
            delete_button.css("display","none");
        });

        //Upon mouse enters
        element.on('mouseenter', function(){
            delete_button.css("display","block");
        });
    }
});


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
