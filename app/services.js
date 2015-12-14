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
        property: null
    };


    //Current Function
    sharedData.currentFunction = "Design view";
    sharedData.changeFunction = function(name) {
        sharedData.currentFunction = name;
    }

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
                component: "<input value='{{item.value}}' type='text' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC
            }, {
                type: "item",
                id: 0,
                name: "Number",
                icon: 'glyphicon-sound-5-1',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                value: null,
                component: "<input value='{{item.value}}' type='number' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC
            }, {
                type: "item",
                id: 0,
                name: "Date",
                icon: 'glyphicon-calendar',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                value: null,
                component: "<input value='{{item.value}}' type='date' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC

            }, {
                type: "item",
                id: 0,
                name: "Email",
                icon: 'glyphicon-envelope',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                value: null,
                component: "<input value='{{item.value}}' type='email' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value'/><div class='input-validation'></div>",
                semantic: DEFAULT_SEMANTIC
            }, {
                type: "item",
                id: 0,
                name: "Paragraph",
                icon: 'glyphicon-align-justify',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                value: null,
                component: "<textarea value='{{item.value}}' rows='3' property='{{item.semantic.property}}' content='{{item.value}}' class='form-control' ng-model='item.value' /></textarea>",
                semantic: DEFAULT_SEMANTIC

            }, {
                type: "item",
                id: 0,
                name: "Radio",
                icon: 'glyphicon-record',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                component: "<input type='radio' property='{{item.semantic.property}}' content='{{item.value.label}}' name='{{item.name}}{{item.id}}' ng-repeat-start='option in item.field_options' ng-model='option.checked' ng-value='true' ng-click='$parent.$parent.setSelect(item, option)' }}'/><span class='opt'>{{option.label}}</span><br ng-repeat-end/>",
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
                component: "<input type='checkbox' property='{{item.semantic.property}}'  content='{{item.value.label}}' name='{{item.name}}{{item.id}}' ng-model='option.checked' ng-repeat-start='option in item.field_options' value='{{option.label}}' ng-click='$parent.$parent.setSelect(item, option)'/><span class='opt'>{{option.label}}</span><br ng-repeat-end />",
                field_options: [{
                    label: "Checkbox 1",
                    checked: false
                }, {
                    label: "Checkbox 2",
                    checked: false
                }],
                value: null,
                properties: PROPERTIES_DEFAULT,
                semantic: DEFAULT_SEMANTIC

            }, {
                type: "item",
                id: 0,
                name: "Dropdown",
                icon: 'glyphicon-collapse-down',
                required: REQ_DEFAULT,
                label: DEFAULT_LABEL,
                component: "<select class='form-control' property='{{item.semantic.property}}' content='{{item.value.label}}' ng-model='item.value' ng-options='option.label for option in item.field_options'></select>",
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
                value: null,
                component: "<input property='{{item.semantic.property}}' content='{{item.value}}' type='file' />",
                semantic: DEFAULT_SEMANTIC
            }, {
                type: "item",
                id: 0,
                name: "Attached File(s)",
                required: REQ_DEFAULT,
                icon: 'glyphicon-paperclip',
                label: DEFAULT_LABEL,
                value: null,
                component: "<input property='{{item.semantic.property}}' content='{{item.value}}' type='file' multiple/>",
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
                name: "Untitled Object",
                subtype: null,
                icon: 'glyphicon-user',
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
            parser = new DOMParser();
            htmlDoc = parser.parseFromString(reader.result, "text/html");
            models = sharedData.htmlToTemplate(htmlDoc, _class = null, _id = null);
            sharedData.models.dropzones.templates = models;
        }
        reader.readAsText(file);
    }

    sharedData.htmlToTemplate = function(html, _class, _id) {
        var res = [];
        var xPath = "/html/body/div/div/ul/li";
        var parser = new DOMParser();
        var result = html.evaluate(xPath, html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

        var li = result.iterateNext();
        //in case of a container

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
                container.name = div.getAttribute("typeof");
                var temp = div.getAttribute("resource");
                container.subtype = temp.substring(0, temp.length - 1);
                container.id = parseInt(temp.substring(temp.length - 1, temp.length));

                container.templates[0] = sharedData.htmlToTemplate(htmlDoc, container.name, container.id);
                res.push(container);
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
                        var item = angular.copy(sharedData.models.templates[i]);

                        //get semantic info
                        if (_class != null && _id != null) {
                            item.semantic.class = _class;
                            item.semantic.id = parseInt(_id);
                        }

                        //get Labels
                        if (i == 10 || i == 11) {
                            item.label = control.innerText;
                        } else {
                            label = htmlDoc.getElementsByTagName("label")[0];
                            if (label)
                                item.label = label.innerText;
                            item.required = htmlDoc.getElementsByTagName("span")[0] ? "yes" : "no";
                            item.semantic.property = control.getAttribute("property");
                        }

                        //get options

                        switch (i) {
                            //section, header  
                            //radio
                            case 5:
                                inputs = htmlDoc.getElementsByTagName('span');
                                item.field_options = [];
                                for (j = 1; j < inputs.length; j++) {
                                    var option = {
                                        label: inputs[j].innerText,
                                        checked: false
                                    };
                                    item.field_options.push(option)
                                }
                                break;
                            case 6:
                                inputs = htmlDoc.getElementsByTagName('input');
                                item.field_options = [];
                                for (j = 0; j < inputs.length; j++) {
                                    var option = {
                                        label: inputs[j].getAttribute("value"),
                                        checked: false
                                    };
                                    item.field_options.push(option)
                                }
                                break;
                            case 7:
                                inputs = htmlDoc.getElementsByTagName('option');
                                item.field_options = [];
                                for (j = 0; j < inputs.length; j++) {
                                    var option = {
                                        label: inputs[j].innerText,
                                        checked: false
                                    };
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

    schema.initialize = function() {
        if (schema.file == null)
            return;
        var reader = new FileReader();
        reader.onload = function() {
            schema.json = angular.fromJson(reader.result);
            angular.forEach(schema.json["types"], function(key, value) {
                schema.objects.push(value);
            });
        }
        reader.readAsText(schema.file);
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
            return "ov:" + type;
        return type;

    }

    schema.getProp = function(prop) {
        alert(prop);
        if (schema.json["properties"][prop] == null)
            return "ov:" + prop;
        return prop;

    }

    return schema;
});