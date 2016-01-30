/**
 * @file 
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

 
mainApp.service('sharedData', function($compile, $sce) {
    var sharedData = {};
    /**
     *   Some default values
     */
     var DEFAULT_LABEL = "Untitled";
     var NO_LABEL = "";
     var REQ_DEFAULT = 'yes';
     var PROPERTIES_DEFAULT = "<div class='option-item' ng-repeat='option in item.field_options'>\
     <input type='checkbox' ng-checked='{{option.checked}}' ng-model='option.checked' ng-click='$parent.$parent.setSelect(item, option)'/>\
     <input type='text' value='{{option.label}}' ng-model='option.label'/>\
     <a class='mini-item item-add glyphicon-plus' ng-click='$parent.$parent.addOption(item, $index+1)'></a>\
     <a class='mini-item item-remove glyphicon-minus' ng-click='$parent.$parent.removeOption(item, $index)'></a>\
     </div>\
     <button type='button' class='btn btn-primary btn-xs' ng-click='$parent.$parent.addOption(item, -1)'>Add option</button>";
     var DEFAULT_LABEL_OPTION = "Option";
     var DEFAULT_CHECK_OPTION = false;
     var DEFAULT_SEMANTIC = {
        class: null,
        id: null,
        property: null,
        prefix: PREFIX,
    };

    sharedData.signed = false;
    sharedData.originDoc = "";

    //Current Function
    sharedData.currentFunction = "Design view";

    sharedData.commands = [{
        name: "Open",
        icon: "glyphicon-folder-open",
        selected: false
    }, {
        name: "New",
        icon: "glyphicon-plus",
        selected: false
    }, {
        name: "New from Template",
        icon: "glyphicon-list-alt",
        selected: false
    }, {
        name: "Save",
        icon: "glyphicon-floppy-disk",
        selected: false
    }, {
        name: "Design view",
        icon: "glyphicon-wrench",
        selected: true
    }, {
        name: "Edit view",
        icon: "glyphicon-edit",
        selected: false
    }, {
        name: "Clear Data",
        icon: "glyphicon-remove",
        selected: false
    }, {
        name: "Clear All",
        icon: "glyphicon-trash",
        selected: false
    }, {
        name: "Sign",
        icon: "glyphicon-pencil",
        selected: false
    }, {
        name: "Verify",
        icon: "glyphicon-ok",
        selected: false
    }, {
        name: "Fill",
        icon: "glyphicon-indent-left",
        selected: false
    }];

    //Open Template
    sharedData.models = {
        vocab: null,
        selected: null,
        templates: [{
            type: "item",
            id: 0,
            name: "Text",
            icon: 'glyphicon-font',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: "<input disabled value='{{item.value}}' type='text' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /><div class='input-validation'></div>",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Number",
            icon: 'glyphicon-sound-5-1',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: "<input disabled value='{{item.value}}' type='number' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Date",
            icon: 'glyphicon-calendar',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: "<input disabled value='{{item.value}}' type='date' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
            semantic: DEFAULT_SEMANTIC

        }, {
            type: "item",
            id: 0,
            name: "Email",
            icon: 'glyphicon-envelope',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: "<input disabled value='{{item.value}}' type='email' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Paragraph",
            icon: 'glyphicon-align-justify',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: "<textarea disabled value='{{item.value}}' rows='3' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' />{{item.value}}</textarea>",
            semantic: DEFAULT_SEMANTIC

        }, {
            type: "item",
            id: 0,
            name: "Radio",
            icon: 'glyphicon-record',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            component: "<input disabled type='radio' property='{{item.semantic.prefix}}{{item.semantic.property}}' property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' data='{{option.label}}' ng-model='option.checked' ng-value='true' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)' /><span class='opt'>{{option.label}}</span><br ng-repeat-end/>",
            field_options: [{
                label: "Radio 1",
                checked: false
            }, {
                label: "Radio 2",
                checked: false
            }],
            value: null,
            properties: PROPERTIES_DEFAULT,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Checkbox",
            icon: 'glyphicon-ok-circle',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            component: "<input disabled type='checkbox' property='{{item.semantic.prefix}}{{item.semantic.property}}' property2='{{item.semantic.prefix}}{{item.semantic.property}}' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' content='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)'/><span class='opt'>{{option.label}}</span><br ng-repeat-end />",
            field_options: [{
                label: "Checkbox 1",
                checked: false
            }, {
                label: "Checkbox 2",
                checked: false
            }],
            value: [],
            properties: PROPERTIES_DEFAULT,
            semantic: DEFAULT_SEMANTIC

        }, {
            type: "item",
            id: 0,
            name: "Dropdown",
            icon: 'glyphicon-collapse-down',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            component: "<select disabled class='form-control' property='{{item.semantic.prefix}}{{item.semantic.property}}' content='{{item.value.label}}' ng-model='item.value' ng-options='option.label for option in item.field_options'></select>",
            field_options: [{
                label: "Option 1",
                checked: false
            }, {
                label: "Option 2",
                checked: false
            }],
            value: null,
            properties: PROPERTIES_DEFAULT,
            semantic: DEFAULT_SEMANTIC

        }, {
            type: "item",
            id: 0,
            name: "Signature",
            icon: 'glyphicon-pencil',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: [],
            component: "<input disabled class= 'fileupload' fileimage type-mode=1 ng-model='item.value' tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file'/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}'><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Attached File(s)",
            required: REQ_DEFAULT,
            icon: 'glyphicon-paperclip',
            label: DEFAULT_LABEL,
            value: [],
            component: "<input disabled class= 'fileupload' fileimage type-mode=2 ng-model='item.value' tempproperty='{{item.semantic.prefix}}{{item.semantic.property}}' type='file' multiple/><div ng-repeat-start='img in item.value' class='image-line'><span>{{img.name}}</span><img property='{{item.semantic.prefix}}{{item.semantic.property}}' src='{{img.src}}' title='{{img.name}}' ><button ng-click='$parent.$parent.deleteImage(item,img)'>Remove</button></div><br ng-repeat-end />",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            noinput: true,
            id: 0,
            name: "Header",
            icon: 'glyphicon-header',
            label: "Header of the form",
            component: "<h3><input type='text' class='form-control'  ng-model='item.label' /></h3>",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            noinput: true,
            id: 0,
            name: "Section",
            icon: 'glyphicon-minus',
            label: "Section",
            component: "<h3><input type='text' class='form-control' ng-model='item.label' /></h3>",
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "container",
            id: 1,
            name: "Person",
            subtype: '',
            icon: 'glyphicon-user',
            templates: [
            []
            ]
        }, 
        {
            type: "container",
            id: 1,
            name: "Thing",
            subtype: '',
            icon: 'glyphicon-star',
            templates: [
            []
            ]
        },
        {
            type: "subProperty",
            id: 1,
            name: "SubProperty",
            subtype: '',
            icon: 'glyphicon-unchecked',
            semantic: DEFAULT_SEMANTIC,
            templates: [
            []
            ]
        }

        ],
        dropzones: {
            templates: []
        }
    };


    sharedData.load = function(file) {
        var reader = new FileReader();
        reader.onload = function() {
            sharedData.parseForm(reader.result);
        }
        reader.readAsText(file);
    }

        sharedData.changeFunction = function(name) {
        sharedData.currentFunction = name;
        if (name == "Design view")
            setTimeout(function(){ 
                disableAll('formExport', true);
            }, 100);

        if (name != "Design view")
            setTimeout(function(){ 
                if (sharedData.originDoc == ""){
                    disableAll('export', false);
                }    
                else{
                    disableAll('export', true);
                }
            }, 100);
    }

    //Clear all data
    sharedData.empty = function(list){
        var l;
        if (list.templates[0] instanceof Array) {
            l = list.templates[0];
        } else
        l = list.templates;


        for (var i = 0; i < l.length; i++) {
            item = l[i];
            if (item.value instanceof Array)
                item.value = [];
            else
                item.value = null;

            if (item.field_options){
                for (var j=0; j<item.field_options.length; j++){
                    item.field_options[j].checked = false;
                }
            }
            if (item.templates != null) {
                sharedData.empty(item);
            }
        }
    }

    sharedData.clear = function(){
        sharedData.empty(sharedData.models.dropzones);
    }

    sharedData.clearAll = function(){
        sharedData.models.dropzones.templates = [];
    }

    sharedData.parseForm = function(html){
            parser = new DOMParser();
            var signed = false;

            var substring = "-----BEGIN PGP SIGNED MESSAGE-----";
            if (html.indexOf(substring) == -1){
                //clear
                sharedData.signed = false;
                sharedData.originDoc = "";
                //sharedData.currentFunction = "Edit view";

            }else{
                //signed
                sharedData.signed = true;
                sharedData.originDoc = html;
                alert("This is a signed document, you can not neither edit nor modify this document !!!");
                signed = true;
                sharedData.currentFunction = "Verify";
            }

            //Parse the file and apply to models
            htmlDoc = parser.parseFromString(html, "text/html");
            models = sharedData.htmlToTemplate(htmlDoc, _class = null, _id = null);
            sharedData.models.dropzones.templates = models;
            
            //In case of generating a new form from an existed from, we clear off all data
            if (sharedData.currentFunction == "New from Template"){
                sharedData.clear();
            }

            sharedData.changeFunction(sharedData.currentFunction);
    }

    sharedData.htmlToTemplate = function(html, _class, _id) {
        var res = [];
        var xPath = "/html/body/div/div/ul/li";
        var parser = new DOMParser();
        var result = html.evaluate(xPath, html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

        var li = result.iterateNext();
        //in case of a container

        var count = 0;

        while (li) {
            htmlDoc = parser.parseFromString(li.innerHTML, "text/html");
            //res.templates.push(sharedData.htmlToTemplate(htmlDoc));
            //check item or container
            check = htmlDoc.evaluate(xPath, htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            if (check.iterateNext()) {
                if (res.templates == null)
                    res.templates = [];

                var container = angular.copy(sharedData.models.templates[12]);

                var div = htmlDoc.getElementsByTagName('div')[0];

                //container or subProperty
                if (div.getAttribute("resource") != null){
                    container.name = div.getAttribute("typeof");
                    var temp = div.getAttribute("resource");
                    container.subtype = temp.substring(0, temp.length - 1);
                    container.id = parseInt(temp.substring(temp.length - 1, temp.length));

                    container.templates[0] = sharedData.htmlToTemplate(htmlDoc, container.name, container.id);
                    res.push(container);
                } else{
                    var subProperty = angular.copy(sharedData.models.templates[13]);
                    subProperty.name = div.getAttribute("typeof");
                    subProperty.subtype = div.getAttribute("property");
                    
                    if (subProperty.subtype)
                        if (subProperty.subtype.indexOf(PREFIX) == -1){
                            subProperty.semantic.property = subProperty.subtype;
                            subProperty.semantic.prefix = '';
                        } else {
                            subProperty.semantic.property = subProperty.subtype.substring(3, subProperty.subtype.length);
                            subProperty.semantic.prefix = PREFIX;
                        } 
                        subProperty.semantic.class = div.getAttribute("temptype");

                        subProperty.templates[0] = sharedData.htmlToTemplate(htmlDoc, subProperty.name, subProperty.id);
                        res.push(subProperty);
                    }
                } else {
                //in case of a document
                xpaths = ["//html-render/input[@type='text']",
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

                for (i = 0; i < xpaths.length; i++) {
                    control = htmlDoc.evaluate(xpaths[i], htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
                    if (control) {

                        //Distinguish type vs type multiple 
                        if ((i==8 && control.multiple) || (i==9 && !control.multiple)){
                            continue;
                        }


                        var item = angular.copy(sharedData.models.templates[i]);
                        item.id = "_" + count;
                        count = count + 1;
                        
                        //get semantic info
                        if (_class != null && _id != null) {
                            item.semantic.class = _class;
                            item.semantic.id = parseInt(_id);
                        }

                        //get Labels of Header, Sections
                        if (i == 10 || i == 11) {
                            item.label = control.textContent;
                        } else {
                            label = htmlDoc.getElementsByTagName("label")[0];
                            if (label)
                                item.label = label.textContent;
                            item.required = htmlDoc.getElementsByTagName("span")[0] ? "yes" : "no";
                            prop = control.getAttribute("property");
                            if (prop == null || prop == undefined || prop == "")
                                prop = control.getAttribute("tempproperty");
                            if (prop == null || prop == undefined || prop == "")
                                prop = control.getAttribute("property2");
                            if (prop)
                                if (prop.indexOf(PREFIX) == -1){
                                    item.semantic.property = prop;
                                    item.semantic.prefix = '';
                                } else{
                                    item.semantic.property = prop.substring(3, prop.length);
                                    item.semantic.prefix = PREFIX;
                                }
                            }

                        //get options
                        switch (i) {
                            case 1:
                            item.value = parseInt(control.getAttribute("content"));
                            break;
                            case 2:
                            var d = new Date (control.getAttribute("content").replace("\"",'').replace("\"",''));
                            item.value = d;
                            break;
                            case 0:
                            case 3:
                            case 4:
                            item.value = control.getAttribute('content');
                            break;
                            //radio // checkbox
                            case 5:
                            // checkbox
                            case 6:
                            inputs = htmlDoc.getElementsByTagName('input');
                            item.field_options = [];
                            for (j = 0; j < inputs.length; j++) {
                                var option = {
                                    label: inputs[j].getAttribute("value"),
                                    checked: (inputs[j].getAttribute("checked")=="checked") ? true : false
                                };
                                if  (i==5)
                                    option.label = inputs[j].getAttribute("data");

                                item.field_options.push(option)

                                if (inputs[j].getAttribute("checked") == "checked"){
                                    if (i==5)
                                            //radio has only one value
                                        item.value = option;
                                        else 
                                            //checkbox has more than one
                                        item.value.push (option);
                                    }
                                }
                                break;

                            // Select
                            case 7:
                            inputs = htmlDoc.getElementsByTagName('option');
                            item.field_options = [];
                            for (j = 0; j < inputs.length; j++) {
                                var option = {
                                    label: inputs[j].innerText,
                                    checked: (inputs[j].getAttribute("selected")=="selected") ? true : false
                                };
                                item.field_options.push(option)

                                if (inputs[j].getAttribute("selected") == "selected"){
                                    item.value = option;
                                }
                            }
                            break;
                            // File and Multiple File
                            case 8:
                            case 9:
                            images = htmlDoc.getElementsByTagName('img');
                            spans = htmlDoc.getElementsByTagName('span');

                            for (j=0; j<images.length; j++){
                                image = {src: images[j].getAttribute('src'), name: spans[j+1].textContent};
                                item.value.push(image);
                            }
                            break;
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

    return sharedData;

});


mainApp.service('schema', function() {
    var schema = {};
    schema.file = null;
    schema.json = null;
    schema.objects = [];
    schema.path = 'assets/schema/schemaorg.json';
    schema.test = [];
    schema.tempFile = null;
    schema.load = false;

    schema.initialize = function(text) {
        try{
            schema.json = angular.fromJson(text);
        }catch(err){
            schema.file == null;
            alert('wrong file');
            return;
        }
        if (schema.json['types'] == null){
            alert('wrong file');
            return
        }
        schema.load = true;
        angular.forEach(schema.json["types"], function(key, value) {
            schema.objects.push(value);
        });
    }

    schema.parseFormText = function(jsonText) {
        schema.json = angular.fromJson(jsonText);
        angular.forEach(schema.json["types"], function(key, value) {
            schema.objects.push(value);
        });
    }

    schema.findProperties = function(_class) {
        if (schema.json["types"][_class] == null)
            return [];
        return schema.json["types"][_class]["properties"];
    }

    schema.getType = function(type) {
        if (schema.json["types"][type] == null)
            return PREFIX + type;
        return type;

    }

    schema.getProp = function(prop) {
        if (schema.json["properties"][prop] == null)
            return PREFIX + prop;
        return prop;

    }

    schema.getPropType = function(prop){
        if (schema.json["properties"][prop] == null)
            return '';
        return schema.json["properties"][prop]["ranges"][0];
    }

    return schema;
});


mainApp.service('rdfa', function(){
    var rdfa = {};
    rdfa.data = [];
    rdfa.parse = function (html){

        // in case of signed message
        var substring = "-----BEGIN PGP SIGNED MESSAGE-----";
        if (html.indexOf(substring) != -1){
            html = openpgp.cleartext.readArmored(html).text;
        }
        rdfaInfo = {};
        parser = new DOMParser();
        doc = parser.parseFromString(html, 'text/html');
        xPath = '//*[@typeof]';
        objects = doc.evaluate(xPath, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        object = objects.iterateNext();
        while (object){
            //parse objects
            _typeof = object.getAttribute('typeof');
            _resource = object.getAttribute('resource');

            if (_resource == null)
                _resource = object.getAttribute('property');
            if (!rdfaInfo[_typeof])
                        rdfaInfo[_typeof]= {};

            if (!rdfaInfo[_typeof][_resource]){
                        rdfaInfo[_typeof][_resource] = {};
                    }            

            //parse properties 
            doc = parser.parseFromString(object.innerHTML,'text/html');
            xPath = '//*[@property]';
            properties = doc.evaluate(xPath, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            property = properties.iterateNext();
            
            while (property){
                check = true;
                if (property.type == 'radio' || property.type == 'checkbox'){
                    if (!property.checked){
                        check = false;
                    }
                } 

                if (check){
                    _property = property.getAttribute('property');
                    if (property.tagName == 'IMG'){
                        _src = property.getAttribute('src');
                        _name = property.getAttribute('title');
                        _content = {src: _src, name: _name};
                    }
                    else 
                        _content = property.getAttribute('content');
        
                    
                    if (!rdfaInfo[_typeof][_resource][_property]){
                        rdfaInfo[_typeof][_resource][_property] = _content;
                    } else {            
                        if (rdfaInfo[_typeof][_resource][_property] instanceof Array){  
                            rdfaInfo[_typeof][_resource][_property].push(_content);                        
                        }else {
                            temp = rdfaInfo[_typeof][_resource][_property];
                            rdfaInfo[_typeof][_resource][_property] = [];
                            rdfaInfo[_typeof][_resource][_property].push(temp);
                            rdfaInfo[_typeof][_resource][_property].push(_content);
                        }
                    }

                }
                
                property = properties.iterateNext();
            }

            object = objects.iterateNext();
        }
        return rdfaInfo;
    }
    return rdfa;
});