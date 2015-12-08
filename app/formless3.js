 /**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp",["dndLists","ngRoute","ui.bootstrap"]);

mainApp.controller("FormDesignCtr", ['$scope', "formModel", "schema", "currentFunction", function($scope, formModel, schema, currentFunction) {
    $scope.models = formModel.models;
    $scope.schema = schema;
    $scope.openedfile = null;


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

    $scope.htmlModels = function(){
        return formModel.convertToHTML();
    }

    $scope.$watch("openedfile", function(){
        if ($scope.openedfile != null){
            formModel.load($scope.openedfile);
            currentFunction.change("Design view");
        }
    })

}]);


mainApp.service('currentFunction',function(){
    var currentFunction = {};
    currentFunction.value = "Design view";

    currentFunction.change = function(name){
        currentFunction.value = name;
    }
    return currentFunction;
});

mainApp.service('formModel',function($compile, $sce){
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


    //Open Template
    formModel.models = {
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
                component: "<input value='{{item.value}}' type='text' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /><div class='input-validation'></div>",
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
                component: "<input value='{{item.value}}' type='number' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
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
                component: "<input value='{{item.value}}' type='date' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
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
                component: "<input value='{{item.value}}' type='email' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
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
                component: "<textarea value='{{item.value}}' rows='3' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /></textarea>",
                semantic: DEFAULT_SEMANTIC            

            },
            {
                type: "item", 
                id: 0, 
                name: "Radio", 
                icon:'glyphicon-record', 
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL, 
                component: "<input type='radio' property='{{item.semantic.property}}' content='{{item.value.label}}' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' ng-model='option.checked' ng-value='true' ng-click='$parent.$parent.setSelect(item, option)' }}'/><span class='opt'>{{option.label}}</span><br ng-repeat-end/>", 
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
                component: "<input type='checkbox' property='{{item.semantic.property}}'  content='{{item.value.label}}' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)'/><span class='opt'>{{option.label}}</span><br ng-repeat-end />", 
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
                component: "<select class='form-control' property='{{item.semantic.property}}' content='{{item.value.label}}' ng-model='item.value' ng-options='option.label for option in item.field_options'></select>", 
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
                component: "<input property='{{item.semantic.property}}' content='{{item.value}}' type='file' />",
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
                component: "<input property='{{item.semantic.property}}' content='{{item.value}}' type='file' multiple/>",
                semantic: DEFAULT_SEMANTIC
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Header"  , 
                icon:'glyphicon-header', 
                label: "Header of the form", 
                component: "<h3><input type='text' class='form-control'  ng-model='item.label' /></h3>",
                semantic: DEFAULT_SEMANTIC            
            },
            {
                type: "item", 
                noinput: true,
                id: 0, 
                name: "Section", 
                icon:'glyphicon-minus', 
                label: "Section", 
                component: "<h3><input type='text' class='form-control' ng-model='item.label' /></h3>",
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


    formModel.load = function(file){
        var reader = new FileReader();
        reader.onload = function(){
            parser=new DOMParser();
            htmlDoc=parser.parseFromString(reader.result, "text/html"); 
            models = formModel.htmlToTemplate(htmlDoc, _class=null, _id=null);
            formModel.models.dropzones.templates = models;
        }
        reader.readAsText(file);
    }


    formModel.htmlToTemplate = function(html, _class, _id){
        var res = [];
        var xPath="/html/body/div/div/ul/li";
        var parser=new DOMParser();
        var result = html.evaluate(xPath, html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

        var li = result.iterateNext();
        //in case of a container

        while (li){
            htmlDoc=parser.parseFromString(li.innerHTML, "text/html"); 
            //res.templates.push(formModel.htmlToTemplate(htmlDoc));
            //check item or container
            check = htmlDoc.evaluate(xPath, htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            if (check.iterateNext()){
                if (res.templates == null)
                    res.templates = [];

                var container = angular.copy(formModel.models.templates[12]);

                var div = htmlDoc.getElementsByTagName('div')[0];
                container.name = div.getAttribute("typeof");
                var temp = div.getAttribute("resource");
                container.subtype = temp.substring(0,temp.length-1);
                container.id = parseInt(temp.substring(temp.length-1,temp.length));

                container.templates[0] = formModel.htmlToTemplate(htmlDoc, container.name, container.id);
                res.push(container);
            }
            else{
            //in case of a document
                xpaths = [  "//html-render/input[@type='text']",
                            "//html-render/input[@type='number']",
                            "//html-render/input[@type='date']",
                            "//html-render/input[@type='email']",
                            "//html-render/textarea",
                            "//html-render/input[@type='radio']",
                            "//html-render/input[@type='checkbox']",
                            "//html-render/select",
                            "//html-render/input[@type='file']",
                            "//html-render/input[@type='file']",
                            "//h3",
                            "//h5",
                            ];

                for (i=0;i<xpaths.length;i++){
                    control = htmlDoc.evaluate(xpaths[i], htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
                    if (control){
                        var item = angular.copy(formModel.models.templates[i]);

                        //get semantic info
                        if (_class != null && _id != null){
                            item.semantic.class = _class;
                            item.semantic.id = parseInt(_id);
                        }

                        //get Labels
                        if (i==10 || i == 11){
                            item.label = control.innerText;
                        } else{
                                label = htmlDoc.getElementsByTagName("label")[0];
                                if (label)
                                    item.label = label.innerText;
                                item.required = htmlDoc.getElementsByTagName("span")[0] ? "yes" : "no";
                                item.semantic.property = control.getAttribute("property");
                        }

                        //get options
                    
                        switch (i){ 
                            //section, header  
                            //radio
                            case 5:
                                inputs = htmlDoc.getElementsByTagName('span');
                                item.field_options = [];
                                for (j=1;j<inputs.length;j++){
                                    var option = {label: inputs[j].innerText, checked: false};
                                    item.field_options.push(option)
                                }
                                break;                            
                            case 6:
                                inputs = htmlDoc.getElementsByTagName('input');
                                item.field_options = [];
                                for (j=0;j<inputs.length;j++){
                                    var option = {label: inputs[j].getAttribute("value"), checked: false};
                                    item.field_options.push(option)
                                }
                                break;
                            case 7:
                                inputs = htmlDoc.getElementsByTagName('option');
                                item.field_options = [];
                                for (j=0;j<inputs.length;j++){
                                    var option = {label: inputs[j].innerText, checked: false};
                                    item.field_options.push(option)
                                }
                                break;;
                            default: 
                                break;
                        }

                        res.push(item);

          
                    }    
                }
            }

            li = result.iterateNext();
        }

        return res;
    }

    return formModel;

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
        var wrapper = angular.element('<div>');

        //Trusted HTML
        value=$sce.trustAsHtml(value);
        wrapper.html(value);
        var markup = $compile(wrapper.contents())(scope);
        element.append(markup)
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



mainApp.controller("MenuCtr", ['$scope','$compile', 'currentFunction', function($scope,$compile, currentFunction){
    $scope.currentFunction = currentFunction;
    $scope.commands = [ {name: "Open", icon: "glyphicon-folder-open", selected:false},
                        {name: "New" , icon: "glyphicon-plus", selected:false},
                        {name: "New from Template" , icon: "glyphicon-list-alt", selected:false},
                        {name: "Save" , icon: "glyphicon-floppy-disk", selected:false},            
                        {name: "Design view" , icon: "glyphicon-wrench", selected:true},
                        {name: "Edit view" , icon: "glyphicon-edit", selected:false},
                        {name: "Clear" , icon: "glyphicon-remove", selected:false},
                        {name: "Sign" , icon: "glyphicon-pencil", selected:false}, 
                        {name: "Verify" , icon: "glyphicon-ok", selected:false}                        
                    ];

    $scope.selectMenu = function(name){
        $scope.currentFunction.change(name);
    }

    $scope.openFile = function(){
        document.getElementById("tempFile").click();
    }

    $scope.$watch("currentFunction.value", function(){
        angular.forEach($scope.commands, function(item){
            item.selected=false;
            if (item.name == currentFunction.value){
                item.selected = true;
                if (currentFunction.value == "Open"){
                    $scope.openFile();
                }

                if (currentFunction.value == "Edit view"){
                    console.log(document.getElementById('formExport').innerHTML);
                }
            }

        });
    });
}]);
