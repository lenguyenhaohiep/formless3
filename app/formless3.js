 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute","ui.bootstrap"]);

mainApp.controller("FormDesignCtr", ['$scope', "findParent", "parseOWL", "formModel", "schema", function($scope, findParent, parseOWL, formModel, schema) {
    //$scope.ontologyStructure = ontologyStructure;
    $scope.models = formModel.models;
    $scope.schema = schema;

    //$scope.models.vocab = ontologyStructure.namespaces["xml:base:rdf"];

    /**
    *   When an options for checkbox/radio/dropdown is selected, we mark them as checked=true
    */
    $scope.setSelect = function(item, option){
        if (item.name != 'Checkbox'){
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
        var new_option = {label: "Untitled", checked: false};
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
    $scope.removeItem = function(item) {
        $scope.models.selected = null;
        $scope.removeNode($scope.models.dropzones, item)
    };

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        //console.log($scope.modelAsJson);
    }, true);

    $scope.removeNode = function (list, node){
        var l; 
        if (list.templates[0] instanceof Array){
            l = list.templates[0];
        }
        else
            l =list.templates;

        for (i=0;i<l.length;i++) {
            item = l[i];
            if (item == node){
                l.splice(i,1);
                return ;
            }
            if (item.templates != null){
                $scope.removeNode(item, node);
            }
        }
    };

    $scope.updateSemantic = function (list, node){
        if (node.type == 'container')
            return;
        var l; 
        if (list.templates[0] instanceof Array){
            l = list.templates[0];
        }
        else
            l =list.templates;

        angular.forEach(l, function (item) {
            if (item == node){
                node.semantic.class = list.name;
                node.semantic.id = list.id;
                return list;
            }
            if (item.templates != null){
                $scope.updateSemantic(item, node);
            }
        });
    };

    $scope.selectItem = function(item){
        $scope.models.selected = item;
        $scope.updateSemantic($scope.models.dropzones, $scope.models.selected);
    };

    $scope.findProperties = function(_class){
        return schema.findProperties(_class);
    };
}]);


mainApp.service('formModel',function(){
    var formModel = {}; 
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
    var DEFAULT_SEMANTIC = {class: null, id: null, property: null};
    var prefix = "fl:";
    formModel.models = {
        prefix: prefix,
        vocab: null,
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
                component: "<input type='text' property='"+prefix+"{{item.semantic.class}}' class='form-control' ng-model='item.value' /><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "item", 
                id: 0, 
                name: "Number", 
                icon:'glyphicon-sound-5-1', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='number' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "item", 
                id: 0, 
                name: "Date"  , 
                icon:'glyphicon-calendar', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='date' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC            

            },
            {
                type: "item", 
                id: 0, 
                name: "Email" , 
                icon:'glyphicon-envelope',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='email' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC
            },
            {
                type: "item", 
                id: 0, 
                name: "Paragraph", 
                icon:'glyphicon-align-justify',
                required: REQ_DEFAULT, 
                label: DEFAULT_LABEL, 
                value: null,
                component: "<textarea rows='5' class='form-control' ng-model='item.value' /></textarea>",
                semantic: DEFAULT_SEMANTIC            

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
                properties: PROPERTIES_DEFAULT,
                semantic: DEFAULT_SEMANTIC            
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
                properties: PROPERTIES_DEFAULT,
                semantic: DEFAULT_SEMANTIC            

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
                properties: PROPERTIES_DEFAULT,
                semantic: DEFAULT_SEMANTIC            

            },
            {
                type: "item", 
                id: 0, 
                name: "Signature"  , 
                icon:'glyphicon-pencil', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                value: null,
                component: "<input type='file' />",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "item", 
                id: 0, 
                name: "Attached File(s)", 
                required: REQ_DEFAULT,
                icon:'glyphicon-paperclip', 
                label: DEFAULT_LABEL,
                value: null, 
                component: "<input type='file' multiple/>",
                semantic: DEFAULT_SEMANTIC
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Header"  , 
                icon:'glyphicon-header', 
                label: "Header of the form", 
                component: "<h1>{{item.label}}</h1>",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Section", 
                icon:'glyphicon-minus', 
                label: "Section", 
                component: "<h3>{{item.label}}</h3>",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "container", 
                id: 1, 
                name: "Untitled Object", 
                subtype: null,
                icon: 'glyphicon-user',
                templates: [[]]
            }

        ],
        dropzones: {
            templates: []
        }
    };

    formModel.initialize = function(ontologyStructure){
        angular.forEach(ontologyStructure.class,function(key,val){
            var container = {
                type: "container", 
                id: 1, 
                name: val, 
                icon: 'glyphicon-record',
                templates: [[]]
            };
        formModel.models.templates.push(container);
        });
    };

    return formModel;

});

/**
*   Find parent of a node in the models
*/
mainApp.service('findParent', function(){
    return function (list, node){
        angular.forEach(list, function (item) {
            if (item == node)
                return list;
            if (item.columns != null){
                    if (item.columns.length != 0)
                        return findParent(item.columns, child);
            }
        });
    }
});

mainApp.service('parseOWL',['$http',function($http){
    return function(){
    }
}]);

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
mainApp.directive('flitem', ['formModel',function (formModel){
    return {
        restrict: "A",
        scope : {"flitem": "@"},
        link: function(scope, element, attr){
            var delete_button = angular.element(element[0].querySelector('.item-fix'));

            //Upon mouse leaves
            element.on('mouseleave',function(){
                delete_button.css("display","none");
            });

            //Upon mouse enters
            element.on('mouseenter', function(){
                delete_button.css("display","block");
            });

//            element.on('click', function(ev){
//                alert(formModel.models.selected);
//            });
        }
    }
}]);


mainApp.directive("editInline", function($window){
    return function(scope, element, attr){
      // a method to update the width of an input
      // based on it's value.
      var updateWidth = function () {
          // create a dummy span, we'll use this to measure text.
          var tester = angular.element('<span>'),
          
          // get the computed style of the input
              elemStyle = $window.document.defaultView
                .getComputedStyle(element[0], '');
          
          // apply any styling that affects the font to the tester span.
          tester.css({
            'font-family': elemStyle.fontFamily,
            'line-height': elemStyle.lineHeight,
            'font-size': elemStyle.fontSize,
            'font-weight': elemStyle.fontWeight
          });
          
          // update the text of the tester span
          tester.text(element.val());
          
          // put the tester next to the input temporarily.
          element.parent().append(tester);
          
          // measure!
          var r = tester[0].getBoundingClientRect();
          var w = r.width;
          
          // apply the new width!
          element.css('width', w + 'px');
          
          // remove the tester.
          tester.remove();
        };
        
        // initalize the input
        updateWidth();
        
        // do it on keydown so it updates "real time"
        element.bind("keydown", function(){
          
          // set an immediate timeout, so the value in
          // the input has updated by the time this executes.
          $window.setTimeout(updateWidth, 0);
        });
        
    }
});


mainApp.controller("MenuCtr", function($scope){
    $scope.commands = [ {name: "Open", icon: "glyphicon-folder-open"},
                        {name: "New" , icon: "glyphicon-plus"},
                        {name: "New from Template" , icon: "glyphicon-list-alt"},
                        {name: "Save" , icon: "glyphicon-floppy-disk"},
                        {name: "Save As" , icon: "glyphicon-floppy-save"},
                        {name: "Quit" , icon: "glyphicon-log-out"},
                        {name: "Clear" , icon: "glyphicon-remove"},
                        {name: "Sign" , icon: "glyphicon-pencil"},
                        {name: "Verify" , icon: "glyphicon-ok"},
                        {name: "Design view" , icon: "glyphicon-wrench"},
                        {name: "Edit view" , icon: "glyphicon-edit"},
                        {name: "Settings" , icon: "glyphicon-cog"},
                        {name: "About" , icon: "glyphicon-info-sign"}                        
                    ];
});
