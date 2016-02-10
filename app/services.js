/**
 * @file Services
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

/* 
 *  SharedData Service with form models
 */ 
mainApp.service('sharedData', function($compile, $sce) {
    /*
     * Properties
     *
     * {bool} signed Check if the form is signed
     * {string} originDoc The text file when user open a file
     * {string} currenFunction The current function
     * {json[]} commands List of function of the app, each object include name, icon and indication if it is selected
     * {string} hashCode hash value of the structure
     * {string} lockCode hash value of the code for locking structure
     * {string} title The title of the current form
     * {json} models Structure of the form
     */
    var sharedData = {};

    sharedData.signed = false;
    sharedData.originDoc = "";
    sharedData.currentFunction = 5;
    sharedData.commands = [{
        id: 1,
        name: OPEN,
        icon: "glyphicon-folder-open",
        selected: false,
        disable: false
    }, {
        id: 2,
        name: NEW,
        icon: "glyphicon-plus",
        selected: false,
        disable: false
    }, {
        id: 3,
        name: NEWTEMPLATE,
        icon: "glyphicon-list-alt",
        selected: false,
        disable: true
    }, {
        id: 4,
        name: SAVE,
        icon: "glyphicon-floppy-disk",
        selected: false,
        disable: false
    }, {
        id: 5,
        name: DESIGN,
        icon: "glyphicon-wrench",
        selected: true,
        disable: true
    }, {
        id: 6,
        name: EDIT,
        icon: "glyphicon-search",
        selected: false,
        disable: true
    }, {
        id: 7,
        name: CLEAR,
        icon: "glyphicon-remove",
        selected: false,
        disable : true
    }, {
        id: 8,
        name: CLEARALL,
        icon: "glyphicon-trash",
        selected: false,
        disable: true
    }, {
        id: 9,
        name: SIGN,
        icon: "glyphicon-pencil",
        selected: false,
        disable: true
    }, {
        id: 10,
        name: VERIFY,
        icon: "glyphicon-ok",
        selected: false,
        disable: true
    }, {
        id: 11,
        name: FILL,
        icon: "glyphicon-indent-left",
        selected: false,
        disable: true
    }];

    sharedData.hashCode = '';
    sharedData.lockCode = '';
    sharedData.title = 'Untitled Form'

    //Template
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
            component: COMPONENT_TEXT,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Number",
            icon: 'glyphicon-sound-5-1',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: COMPONENT_NUMBER,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Date",
            icon: 'glyphicon-calendar',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: COMPONENT_DATE,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Email",
            icon: 'glyphicon-envelope',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: COMPONENT_EMAIL,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Paragraph",
            icon: 'glyphicon-align-justify',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            value: null,
            component: COMPONENT_TEXTAREA,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Radio",
            icon: 'glyphicon-record',
            required: REQ_DEFAULT,
            label: DEFAULT_LABEL,
            component: COMPONENT_RADIO,
            field_options: DEFAULT_OPTIONS,
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
            component: COMPONENT_CHECKBOX,
            field_options: DEFAULT_OPTIONS,
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
            component: COMPONENT_SELECT,
            field_options: DEFAULT_OPTIONS,
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
            component: COMPONENT_SIGNATURE,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            id: 0,
            name: "Attached File(s)",
            required: REQ_DEFAULT,
            icon: 'glyphicon-paperclip',
            label: DEFAULT_LABEL,
            value: [],
            component: COMPONENT_ATTACH,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            noinput: true,
            id: 0,
            name: "Header",
            icon: 'glyphicon-header',
            label: "Header of the form",
            component: COMPONENT_HEADER,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "item",
            noinput: true,
            id: 0,
            name: "Section",
            icon: 'glyphicon-minus',
            label: "Section",
            component: COMPONENT_SECTION,
            semantic: DEFAULT_SEMANTIC
        }, {
            type: "container",
            id: 1,
            name: "Person",
            subtype: '',
            icon: 'glyphicon-user',
            templates: [ [] ]
        }, 
        {
            type: "container",
            id: 1,
            name: "Thing",
            subtype: '',
            icon: 'glyphicon-star',
            templates: [ [] ]
        },
        {
            type: "subProperty",
            id: 1,
            name: "SubProperty",
            subtype: '',
            icon: 'glyphicon-unchecked',
            semantic: DEFAULT_SEMANTIC,
            templates: [ [] ]
        }

        ],
        dropzones: {
            templates: []
        }
    };

    /*
     * Load a file, read its content and then call parse function
     *
     * @param {file} file The form 
     */
    sharedData.load = function(file) {
        var reader = new FileReader();
        reader.onload = function() {
            sharedData.parseForm(reader.result);
        }
        reader.readAsText(file);
    }

    /*
     * Change the current function
     *
     * @param {string} name The name of function 
     */
    sharedData.changeFunction = function(id) {
        sharedData.currentFunction = id;
        if (id == 4)
            return;
        if (id == 5)
            //Disable form controls in design mode
            setTimeout(function(){ 
                disableAll('formExport', true);
            }, 00);

        //if (id != 5)
            //enable forms controls 
            setTimeout(function(){ 
                //if form is signed, we also disable forms
                if (sharedData.originDoc == "" && sharedData.signed == false){
                    disableAll('export', false);
                }   
                //form is editable
                else{
                    disableAll('export', true);
                }
            }, 00);
    }

    sharedData.getHashCode = function(){
        var copyTemplate = angular.copy(sharedData.models.dropzones);
        sharedData.empty(copyTemplate);
        var hashCode = hashFunction(JSON.stringify(copyTemplate));

        return hashCode;
    }

    /*
     * Empty data of form
     *
     * @param {array} list The list of forms, same structure as sharedData.models.templates 
     */    
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

            //in case of checkbox, radio, select
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

    /*
     * Clear all data of the form
     */
    sharedData.clear = function(){
        sharedData.empty(sharedData.models.dropzones);
    }

    /*
     * Clear all data and structure of the form
     */
    sharedData.clearAll = function(){
        sharedData.models.dropzones.templates = [];
    }

    /*
     * Parse a from from html, this function will call htmlToTemplate to get the final result
     *
     * @param {String} html The html form
     */
    sharedData.parseForm = function(html, check){
            parser = new DOMParser();
            var signed = false;

            if (html.indexOf(CHECK_SIGNED_STRING) == -1){
                //clear form
                sharedData.signed = false;
                sharedData.originDoc = "";

            }else{
                //signed form
                sharedData.signed = true;
                sharedData.originDoc = html;
                alert(ERROR3_MESSAGE);
                signed = true;
                sharedData.changeFunction(sharedData.currentFunction);
                //sharedData.currentFunction = 10;
            }

            //Parse the file and apply to models
            htmlDoc = parser.parseFromString(html, "text/html");
            models = sharedData.htmlToTemplate(htmlDoc, _class = null, _id = null);
            sharedData.models.dropzones.templates = models;
            
            //In case of generating a new form from an existed from, we clear off all data
            if (sharedData.currentFunction == 3){
                sharedData.clear();
            }

            //update the current function and apply the change in view
            //sharedData.changeFunction(sharedData.currentFunction);
            
            if (check != null && check != undefined && check == false)
                return;
            //check modification structure
            /*
            if (sharedData.signed != true ){
                if (sharedData.getHashCode() != sharedData.hashCode)
                    alert(ERROR_MODIFICATION);
            }
            */
    }

    /*
     * Parse in detail form controls from full/ partial HTML with class and id given
     * if class and id are null, this means we parse full HTML, else, we parse partial HTML which corresponds to an object
     * The control found in the html will belong to the object with class and id given
     *
     * @param {String} html The html form/ control
     * @param {string} _class the class of object which has the corresponding html
     * @param {int} _id The id of object which has the corresponding HTML
     * @return {array} List of objects/controls found
     */
     sharedData.htmlToTemplate = function(html, _class, _id) {
        var res = [];
        var xPath = "/html/body/div/div/ul/li";
        var xPath2 = "/html/body/div/div/ul";
        var parser = new DOMParser();
        var result = html.evaluate(xPath, html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);


        /*
        if (sharedData.hashCode == ''){
            sharedData.hashCode = html.querySelector('#hashValue') != undefined ? html.querySelector('#hashValue').value : '';
            sharedData.lockCode = html.querySelector('#lockCode') != undefined ? html.querySelector('#lockCode').value : '';
            sharedData.title = html.title;
        }*/

        var li = result.iterateNext();
        //in case of a container

        var count = 0;

        while (li) {
            htmlDoc = parser.parseFromString(li.innerHTML, "text/html");
            //res.templates.push(sharedData.htmlToTemplate(htmlDoc));
            //check item or container
            var check = htmlDoc.evaluate(xPath2, htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

            if (check.iterateNext()) {
                if (res.templates == null)
                    res.templates = [];

                var container = angular.copy(sharedData.models.templates[12]);

                var div = htmlDoc.getElementsByTagName('div')[0];

                //container or subProperty
                if (div.getAttribute("resource") != null){

                    //if it is a container => an object => find name, subtype, id
                    container.name = div.getAttribute("typeof");
                    var temp = div.getAttribute("resource");
                    container.id = parseInt(div.getAttribute('data-oid'));
                    container.subtype = temp.substring(0, temp.length - div.getAttribute('data-oid').length);
                    //container.id = parseInt(temp.substring(temp.length - 1, temp.length));

                    //parse controls belongs to this object
                    container.templates[0] = sharedData.htmlToTemplate(htmlDoc, container.name, container.id);
                    //add to list
                    res.push(container);
                } else {
                    //if it is a container => an object => find name, subtype, id

                    var subProperty = angular.copy(sharedData.models.templates[14]);
                    subProperty.name = div.getAttribute("typeof");
                    subProperty.subtype = div.getAttribute("property");
                    subProperty.id = parseInt(div.getAttribute('data-oid'));
                    
                    if (subProperty.subtype)
                        //update semantic information
                    if (subProperty.subtype.indexOf(PREFIX) == -1){
                        subProperty.semantic.property = subProperty.subtype;
                        subProperty.semantic.prefix = '';
                    } else {
                        subProperty.semantic.property = subProperty.subtype.substring(3, subProperty.subtype.length);
                        subProperty.semantic.prefix = PREFIX;
                    } 
                    subProperty.semantic.class = div.getAttribute("data-temptype") != "" ? div.getAttribute("data-temptype") : null;
                    subProperty.semantic.id = div.getAttribute("data-sid") != "" ? parseInt(div.getAttribute("data-sid")) : null;

                        //parse controls belongs to this subtype
                        subProperty.templates[0] = sharedData.htmlToTemplate(htmlDoc, subProperty.name, subProperty.id);
                        //add to list
                        res.push(subProperty);
                    }
                } else {
                //parse control in detail with xpath for each type of HTML control
                xpaths = [  "//div/input[@type='text']",
                "//div/input[@type='number']",
                "//div/input[@type='date']",
                "//div/input[@type='email']",
                "//div/textarea",
                "//div/input[@type='radio']",
                "//div/input[@type='checkbox']",
                "//div/select",
                "//div/input[@type='file']",
                "//div/input[@type='file']",
                "//h3",
                "//h5",
                ];

                for (i = 0; i < xpaths.length; i++) {
                    control = htmlDoc.evaluate(xpaths[i], htmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
                    if (control) {

                        //Distinguish type vs type multiple in case of input[file]
                        if ((i==8 && control.multiple) || (i==9 && !control.multiple)){
                            continue;
                        }

                        //Create by cloning a template of a control from sharedData.models.templates
                        var item = angular.copy(sharedData.models.templates[i]);
                        item.id = parseInt(control.getAttribute('data-oid'));
                        count = count + 1;
                        
                        //get semantic info
                        if (_class != null && _id != null) {
                            item.semantic.class = (_class != '') ? _class : null;
                            item.semantic.id = parseInt(_id);
                        }

                        //get Labels of Header, Sections
                        if (i == 10 || i == 11) {
                            item.label = control.textContent;
                        } else {
                            //get label of the control
                            label = htmlDoc.getElementsByTagName("label")[0];
                            if (label)
                                item.label = label.textContent;

                            //check if field is required
                            item.required = htmlDoc.getElementsByTagName("span")[0] ? "yes" : "no";
                            prop = control.getAttribute("property");

                            //in case of file where property in the images, not in input, we use tempproperty
                            if (prop == null || prop == undefined || prop == "")
                                prop = control.getAttribute("data-tempproperty");

                            //in case of radio, checkbox, data-property2 is kept instead of property in case of unchecked
                            if (prop == null || prop == undefined || prop == "")
                                prop = control.getAttribute("data-property2");
                            if (prop)
                                //find the prefix of property
                            if (prop.indexOf(PREFIX) == -1){
                                item.semantic.property = prop;
                                item.semantic.prefix = '';
                            } else{
                                item.semantic.property = prop.substring(3, prop.length);
                                item.semantic.prefix = PREFIX;
                            }

                            if (item.semantic.property == "")
                                item.semantic.property = null;
                        }

                        //get value
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
                                // find options of the control to find value
                                inputs = htmlDoc.getElementsByTagName('input');
                                item.field_options = [];
                                for (j = 0; j < inputs.length; j++) {
                                    var option = {
                                        label: inputs[j].getAttribute("value"),
                                        checked: (inputs[j].getAttribute("checked")=="checked") ? true : false
                                    };

                                    //checkbox
                                    if  (i==5)
                                        option.label = inputs[j].getAttribute("data-label");

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
                                    label: inputs[j].textContent,
                                    checked: (inputs[j].getAttribute("selected")=="selected") ? true : false
                                };
                                if (inputs[j].hasAttribute('value'))
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

/* 
 *  Schema Service to parse schema.json to array, to find property and class in the schema
 */
mainApp.service('schema', function() {
    var schema = {};

    /*
     * PROPERTIES 
     *
     * {file} file The schema file opened by user
     * {json} json The json parse from schema
     * {string[]} objects List of objects in schema
     * {string} path The path of schema
     */
    schema.file = null;
    schema.json = null;
    schema.objects = [];
    schema.path = 'assets/schema/schemaorg.json';

    schema.init = function(json){
        schema.json = json;
        angular.forEach(schema.json["types"], function(key, value) {
            schema.objects.push(value);
        });     
    }

    /*
     * Read schema from a file and push objects into schema.objects
     *
     * @param {string} text The text of schema
     */
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
        angular.forEach(schema.json["types"], function(key, value) {
            schema.objects.push(value);
        });
    }

    /*
     * Read schema from a text and push objects into schema.objects
     *
     * @param {string} jsonText The json text of schema
     */
    schema.parseFormText = function(jsonText) {
        schema.json = angular.fromJson(jsonText);
        angular.forEach(schema.json["types"], function(key, value) {
            schema.objects.push(value);
        });
    }

    /*
     * Find the list of properties from a given class name
     *
     * @param {string} _class The class name
     * @return {string[]} Array of properties corresponding to a class, return [] if there is no property
     */
    schema.findProperties = function(_class) {
        if (schema.json["types"][_class] == null)
            return [];
        return schema.json["types"][_class]["properties"];
    }

    /*
     * Find the type/classname of an object
     *
     * @param {string} type The type/classname
     * @return {string} The type, if it doesn't belong to schema.org, it will contain prefix, else, nothing changes
     */
    schema.getType = function(type) {
        return type;
        if (schema.json["types"][type] == null)
            return "Thing";
    }

    /*
     * Find the property of an object
     *
     * @param {string} type The property
     * @return {string} The property, if it doesn't belong to schema.org, it will contain prefix, else, nothing changes
     */
    schema.getProp = function(prop) {
        if (schema.json["properties"][prop] == null)
            return PREFIX + prop;
        return prop;

    }

    /*
     * Find the type/classname from a property
     *
     * @param {string} prop The property
     * @return {string} The type, if the property doesn't belong to schema.org, it will return ''
     */
    schema.getPropType = function(prop){
        if (schema.json["properties"][prop] == null)
            return '';
        return schema.json["properties"][prop]["ranges"][0];
    }

    /*
     * Find lable of a given property
     *
     * @param {string} prop The given property
     * @return {string} The label corresponding to the property
     */
    schema.getLabel = function(prop){
        if (schema.json["properties"][prop] == null)
            return '';
        return schema.json["properties"][prop]["label"];    
    }


    return schema;
});


/* 
 *  Rdfa Service to parse objects, data from an html file
 */
mainApp.service('rdfa', function(){
    var rdfa = {};
    /*
     * Parse RDFa from an html text file
     *
     * @param {string} html The form
     * @return {json} data parsed from the html form
     */    
    rdfa.parse = function (html){

        // in case of signed message
        if (html.indexOf(CHECK_SIGNED_STRING) != -1){
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
            _id = object.getAttribute('data-oid') || 1;

            if (_resource == null){
                _resource = object.getAttribute('property');
            } else {
                _resource = _resource.substring(0, _resource.length - _id.length);
            }

            if (_resource == null)
                _resource = "1";

            while (_resource.indexOf(" ") != -1)
                _resource = _resource.replace(" ","_");

            if (!rdfaInfo[_typeof])
                rdfaInfo[_typeof]= {};

            if (!rdfaInfo[_typeof][_resource]){
                rdfaInfo[_typeof][_resource] = {};
            }
            _id = 1; 

            if (!rdfaInfo[_typeof][_resource][_id]){
                rdfaInfo[_typeof][_resource][_id] = {};
            }           

            //parse properties 
            doc = parser.parseFromString(object.innerHTML,'text/html');
            xPath = '//*[@property]';
            properties = doc.evaluate(xPath, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            property = properties.iterateNext();
            
            while (property){
                //check whether the control is a checkbox or radio
                //if radio or checkbox is not checked, we dont parse them
                check = true;
                if (property.type == 'radio' || property.type == 'checkbox'){
                    if (!property.checked){
                        check = false;
                    }
                } 

                if (check){
                    _property = property.getAttribute('property');

                    //parse the images
                    if (property.tagName == 'IMG'){
                        _src = property.getAttribute('src');
                        _name = property.getAttribute('title');
                        _content = {src: _src, name: _name};
                    }
                    else
                        //get from attribute content, textNode or href 
                        _content = property.getAttribute('content') || property.textContent || property.getAttribute("href");
                    
                    if (!rdfaInfo[_typeof][_resource][_id][_property]){
                        rdfaInfo[_typeof][_resource][_id][_property] = _content;
                    } else {            
                        if (rdfaInfo[_typeof][_resource][_id][_property] instanceof Array){  
                            rdfaInfo[_typeof][_resource][_id][_property].push(_content);                        
                        }else {
                            // if the value is a list
                            var temp = rdfaInfo[_typeof][_resource][_id][_property];
                            rdfaInfo[_typeof][_resource][_id][_property] = [];
                            rdfaInfo[_typeof][_resource][_id][_property].push(temp);
                            rdfaInfo[_typeof][_resource][_id][_property].push(_content);
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