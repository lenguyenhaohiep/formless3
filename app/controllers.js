/**
 * @file The controllers
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

 var mainApp;
 var DEFAULT_PROP_CHAR = " \u2192 ";


// Load some dependencies for the functionalitites of the form
if (typeof(scriptFunctionLoaded) != 'undefined'){
    mainApp = angular.module("MainApp", ["dndLists", "ngRoute"]); 
}   
// In case of the tooltool
else{ 
    mainApp = angular.module("MainApp", ["dndLists", "ngRoute", "ui.bootstrap","typeahead-focus"]);
}

/**
 * The controller handles the module "Form Design"
 */
 mainApp.controller("FormCtr", function($scope, sharedData, schema) {

    /*
     * VARIABLES
     * 
     * {item[]} models The list of items
     * {schema} schema The schema Service
     */
     $scope.models = sharedData.models;
     $scope.schema = schema;


    /*
     * Update the semantic info of a node in a list when drop ends
     * Node belongs to the closest Object
     * 
     * @return {item} The item inserted 
     */
     $scope.updateSemanticDrop = function(event, index, item, external, type, allowedType) {
        $scope.selectItem(item);
        try {
            if (item.semantic.class == null){
                item.semantic.property = item.id;
            }
        } catch (err) {

        }
        return item;
    };

    /*
     *  OPERATIONS
     */

    /*
     * Find properties by a given class
     *
     * @param {string} _class the name of class
     * @param {string[]} Properties corresponding to the class 
     */
     $scope.findProperties = function(_class) {
        return schema.findProperties(_class);
    };



    $scope.maxLength = function(text){
        if (text == "" || text == " ")
            return schema.json["types"].length;
        return 10;
    }
    /*
     * Find the prefix of a form control and update to the item 
     *
     * @param {string} prop the property
     * @param {Item} the Item model for a control
     *  
     */
     $scope.matchProperty = function(prop, item) {
        //find the property from schema, if it doesn't belong to schema, it contains a prefix namespace
        var check = schema.getProp(prop);
        if (check.indexOf(PREFIX) == -1){
            item.semantic.prefix = "";
            if (item.label == "Untitled" || item.label == "")
                item.label = schema.getLabel(prop);
        } else {
            item.semantic.prefix = PREFIX;
        }
    }

    /*
     * Find the class of a given property and update to the item model
     *
     * @param {string} prop the name of property
     * @param {Item} the Item model for a control
     */
     $scope.matchTypeOfProperty = function(prop, item) {
        var type = schema.getPropType(prop);
        item.name = type;
    }


    /**
     * When an options for checkbox/radio/dropdown is selected, we mark them as checked=true
     *
     * @param {item} item The item model
     * @param {option} option The option in item model 
     */
     $scope.setSelect = function(item, option) {
        //In case of checkbox
        if (item.name != 'Checkbox') {
            angular.forEach(item.field_options, function(i) {
                i.checked = false;
            });
            option.checked = true;

            item.value = option;
        } 
        //Case of radio/ dropdown
        else {
            item.value = [];
            angular.forEach(item.field_options, function(i) {
                if (i.checked)
                    item.value.push(i);
            });
        }
    };



    /**
     * Add more options for checkbox/radio/dropdown
     * item is an object which represents a field/container
     * When index=-1, we add an option at the end
     * 
     * @param {item} item The item model
     * @param {int} index The last index of options
     */
     $scope.addOption = function(item, index) {
        var new_option = {
            label: "Untitled",
            checked: false
        };
        //Last of the list
        if (index == -1) {
            index = item.field_options.length;
        }
        //At after index
        item.field_options.splice(index, 0, new_option);
    };


    /**
     * Remove an option at index for the current item
     * @param {item} item The item model
     * @param {int} the position of the option
     */
     $scope.removeOption = function(item, index) {
        var r = confirm(REMOVE_CONFIRM);
        if (r == true) {
            item.field_options.splice(index, 1);
        }
    };

    /*
     * Delete an item in the current model
     *
     * @param {item} item The item to be deleted
     */
     $scope.removeItem = function(item) {
        var r = confirm(REMOVE_CONFIRM);
        if (r == true) {
            $scope.models.selected = null;
            $scope.removeNode($scope.models.dropzones, item);
        }
    };

    /*
     * Delete an item in the current model in the interface
     *
     * @param {item[]} list The List of items
     * @param {item} node The item to be deleted
     */
     $scope.removeNode = function(list, node) {
        var l;
        if (list.templates[0] instanceof Array) {
            l = list.templates[0];
        } else
        l = list.templates;

        for (var i = 0; i < l.length; i++) {
            item = l[i];
            if (item == node) {
                l.splice(i, 1);
                return;
            }
            if (item.templates != null) {
                $scope.removeNode(item, node);
            }
        }
    };

    $scope.setSelectedItem = function (item, e) {
        $scope.models.selected = item
        var event = e || arguments[0] || window.event;
        event.stopPropagation();
        setTimeout(function (){
            document.getElementsByClassName("selected")[0].scrollIntoView()
        }, 100); 
    }

    /*
     * Update the semantic info of a node in a list
     * Node belongs to the closest Object
     * 
     * @param {item[]} list The List of items
     * @param {item} node The item 
     */
     $scope.updateSemantic = function(list, node) {
        if (node.type == 'container')
            return;
        var l;
        if (list.templates[0] instanceof Array) {
            l = list.templates[0];
        } else
        l = list.templates;

        angular.forEach(l, function(item) {
            if (item == node) {
                node.semantic.class = list.name || null;
                node.semantic.id = list.id || null;
                return list;
            }
            if (item.templates != null) {
                $scope.updateSemantic(item, node);
            }
        });
    };

    /*
     * Update the semantic info when user clicks to a form control
     *
     * @param {item} item The item/the form control
     */
     $scope.selectItem = function(item) {
        $scope.models.selected = item;
        $scope.updateSemantic($scope.models.dropzones, $scope.models.selected);
        setTimeout(function (){
            document.getElementsByClassName("item-selected")[0].scrollIntoView()
        }, 100); 
    };



    /*
     * Delete an image from the list of images
     *
     * @param {item} item The item model
     * @param {string} img The Base64 value of an image
     */
     $scope.deleteImage = function(item, img) {
        var r = confirm(REMOVE_CONFIRM);
        if (r == false)
            return;

        for (i = 0; i < item.value.length; i++) {
            //Check the value of an image in a list
            if (item.value[i] == img) {
                item.value.splice(i, 1);
                return;
            }
        }
    }
});


/**
 * The main controller
 */
 mainApp.controller("FunctionCtr", function($scope, $compile, sharedData, rdfa, schema) {

    /*
     * Variables
     *
     * {schema} schema The Schema service
     * {string[]} keys The public, private and passphrase
     * {string[]} formsInput The list of files selected for filling form
     * {string[]} rdfa List of objects detected from files given by user
     * {string[]} rdfaCurrent List of objects in the current form
     * {json} the data extracted from files given by user
     * {file} openfile The file opened by user
     * {json[]} commands List of functions
     * {sharedData} sharedData SharedData Service
     */
     $scope.schema = schema;
     $scope.keys = {
        public_key: "",
        private_key: "",
        passphrase: ""
    }
    $scope.formsInput = [];
    $scope.rdfa = [];
    $scope.rdfaCurrent = [];
    $scope.rdfaData = [];
    $scope.openedfile = null;
    $scope.commands = sharedData.commands;
    $scope.sharedData = sharedData;

    /*
     * Operations
     */
     $scope.init = function(){
        schema.init(SCHEMA);
    }

    /* 
     * Read the schema.org when the applications start
     */
     $scope.initialize = function() {
        if (schema.file == null)
            return;
        var reader = new FileReader();
        reader.onload = function(e) {
            schema.initialize(e.target.result);
            $scope.$apply();
        }
        reader.readAsText(schema.file);
    }

    /* 
     * Read the form opened by
     */
     $scope.loadfile = function(){
        //sharedData.currentFunction = 6;
        if ($scope.openedfile != null){
            sharedData.hashCode = '';
            var reader = new FileReader();
            reader.onload = function(e) {
                sharedData.parseForm(e.target.result);
                $scope.$apply();
            }
            reader.readAsText($scope.openedfile);
        }
    }

    /* 
     * Update schema from a text, this function is used when interacting with chrome extension
     * schema file is read and stored as text in the localStorage
     */
     $scope.updateSchema = function(text) {
        schema.parseFormText(text);
    }

    /* 
     * Sign a form or a text (if we use chrome extension)
     * 
     * @param {string} text The text to be signed
     * @param {string} private_key The private key
     * @param {String} passphrase
     */
     $scope.sign = function(text, private_key, passphrase) {
        try {
            // Check if private key and passphrase are provided
            if (private_key && passphrase) {
                $scope.keys.private_key = private_key;
                $scope.keys.passphrase = passphrase;
            }

            if ($scope.keys.private_key != "" && $scope.keys.passphrase != "") {
                var message = '';
                // if sign a text using the form
                if (text) {

                    //get the document first 
                    var parser = new DOMParser();
                    var html = parser.parseFromString(text, "text/html");
                    disableAll('form', true, html);
                    
                    message = html.getElementById('form').outerHTML;
                    message = $scope.getDoc(true, message);
                    //assign the title 
                    sharedData.title = html.title;
                    
                    //change HTML Code
                    var s1 = '</body>\n\n</html>';
                    var s2 = '';
                    message = message.replace(s1, s2);

                    s1 = '<!DOCTYPE html>\n<html>';
                    s2 = '';
                    message = message.replace(s1, s2);
                    message = message.trim();

                    message = "'>\n" + message;


                } 
                // if sign a current form using the tool
                else {
                    updateStateOfFormInTool();
                    message = $scope.getDoc(false, null);
                }

                var privkey = $scope.keys.private_key;
                var passphrase = $scope.keys.passphrase;

                var openpgp = window.openpgp;
                //read private key
                var priv = openpgp.key.readArmored(privkey);
                var privKey = priv.keys[0];

                //decrypt the passphrase and sign the form
                var success = privKey.decrypt(passphrase);
                var signed = openpgp.signClearMessage(priv.keys, message);

                signed.then(function(msg) {
                    alert(SIGN_MESSAGE);
                    //fix HTML
                    var s1 = "-----BEGIN PGP SIGNED MESSAGE-----";
                    var s2 = '';
                    msg = msg.replace(s1,s2);

                    s1 = 'Hash: SHA256';
                    s2 = '<!DOCTYPE html>\n<html data-signature-header=\'\n-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256';
                    msg = msg.replace(s1,s2);
                    msg += "</body>\n</html>";

                    sharedData.signed = true;
                    sharedData.originDoc = msg;
                    $scope.save(sharedData.originDoc);
                });
            } else {
                alert(KEY1_CONFIRM);
            }
        } catch (err) {
            alert(ERROR1_MESSAGE + "\n" + err);
        }
    }



    /* 
     * Verify a form or a text (if we use chrome extension)
     * 
     * @param {string} text The text to be signed
     * @param {string} public_key The public key
     */
     $scope.verify = function(text, public_key) {
        if (sharedData.originDoc == ''){
            alert(NO_FORM)
            return;
        }
        try {
            if (public_key)
                $scope.keys.public_key = public_key;
            if ($scope.keys.public_key != "") {
                pubkey = $scope.keys.public_key;

                var openpgp = window.openpgp;

                //Read public key
                var publicKeys = openpgp.key.readArmored(pubkey);
                if (publicKeys.keys.length == 0){
                    alert(ERROR7_MESSAGE);
                    return
                }
                
                var strCheck = "-----BEGIN PGP SIGNED MESSAGE-----";

                if (sharedData.originDoc.indexOf(strCheck) == -1){
                    alert(ERROR6_MESSAGE);
                    return;
                }
                var message = openpgp.cleartext.readArmored(sharedData.originDoc);

                // Verify
                var verified = openpgp.verifyClearSignedMessage(publicKeys.keys, message);

                verified.then(function(res) {
                    //verify successfully 
                    if (res.signatures[0].valid === true) {
                        var msg_alert = VERIFY_MESSAGE;
                        msg_alert += "\n " + SIGNATURE1;
                        msg_alert += "\n ---------------------------------------------";
                        msg_alert += "\n " + SIGNATURE2 + publicKeys.keys[0].getUserIds();
                        msg_alert += "\n " + SIGNATURE3 + publicKeys.keys[0].getPrimaryUser().selfCertificate.created;
                        msg_alert += "\n " + SIGNATURE4 + publicKeys.keys[0].getExpirationTime();
                        alert(msg_alert);
                    } else {
                        alert(VERIFY_ERROR);
                    }
                });
            } else {
                alert(KEY2_CONFIRM);
            }
        } catch (err) {
            //alert(err);
            alert(ERROR4_MESSAGE);
        }
    }

    /*
     * Fill the form automatically
     */

     $scope.fill = function() {
        sharedData.clear();
        var list = sharedData.models.dropzones.templates;
        $scope.fillAction(list);
        $scope.fillNonObject(list);
    }


    $scope.fillOneItem = function(item, data){
        var val = data

        if (val != null && val != undefined)
            switch (item.name) {
                case "Number":
                item.value = parseInt(val);
                break;
                case "Date":
                strDate = val;
                item.value = new Date(strDate.replace('"', '').replace('"', ''));
                break;
                case "Checkbox":
                item.value = [];
                if (!(val instanceof Array)){
                    temp = [];
                    temp.push(val);
                    val = temp;
                }
                for (var kk = 0; kk < item.field_options.length; kk++) {
                    item.field_options[kk].checked = false;
                    for (jj = 0; jj < val.length; jj++) {
                        if (item.field_options[kk].label == val[jj]) {
                            item.field_options[kk].checked = true;
                            item.value.push(item.field_options[kk]);
                        }
                    }
                }
                break;
                case "Radio":
                case "Dropdown":
                for (var jj = 0; jj < item.field_options.length; jj++) {
                    item.field_options[jj].checked = false;
                    if (item.field_options[jj].label == val) {
                        item.field_options[jj].checked = true;
                        item.value = item.field_options[jj];
                    }
                }
                break;
                case "Signature":
                item.value = [];
                item.value.push(val);
                break;
                case "Attached File(s)":
                if (!(val instanceof Array)){
                    var temp = val;
                    val = [];
                    val.push(temp);
                }    
                item.value = [];
                for (jj = 0; jj < val.length; jj++) {
                    item.value.push(val[jj]);
                }
                break;
                default:
                item.value = data;
                break;
            }

        }

    $scope.fillAction = function(list){
        if (!(list instanceof Array)) {
            var temp = [];
            temp.push(list);
            list = temp;
        }
        for (var i = 0; i < $scope.rdfaCurrent.length; i++) {
            if ($scope.rdfaCurrent[i].check == true)
                continue;
            var str = $scope.rdfaCurrent[i].field;

            //source label (name, subtype, id)
            var _name = str.split(DEFAULT_PROP_CHAR)[0];
            var _subtype = str.split(DEFAULT_PROP_CHAR)[1];
            var _id = parseInt(str.split(DEFAULT_PROP_CHAR)[2]);

            if ($scope.rdfaCurrent[i].data == null)
                continue;
            //dest (#doc, name, subtype, id)
            var str2 = $scope.rdfaCurrent[i].data;
            var _nDoc = parseInt(str2.split(DEFAULT_PROP_CHAR)[0]) - 1;
            var _obj = str2.split(DEFAULT_PROP_CHAR)[1];
            var _subObj = str2.split(DEFAULT_PROP_CHAR)[2];
            var _sid = parseInt(str2.split(DEFAULT_PROP_CHAR)[3]);
            //var _sid = 1;

            for (var j = 0; j < list.length; j++) {
                var node = list[j];

                if (node.type == 'container' || node.type == 'subProperty') {
                    var tempSub = node.subtype;

                    while (tempSub.indexOf(" ") != -1)
                        tempSub = tempSub.replace(" ","_");

                    if (node.name == _name && tempSub == _subtype && node.id == _id) {
                        for (k = 0; k < node.templates[0].length; k++) {
                            var item = node.templates[0][k];

                            if (item.type !== "item") {
                                if (item.templates != null){
                                    $scope.fillAction(item);
                                }
                            } else {
                                $scope.rdfaCurrent[i].check = true;
                                var _property = item.semantic.property;
                                var _prefix = item.semantic.prefix;
                                var prop = _prefix + _property;
                                var data = null
                                try{
                                    data = $scope.rdfaData[_nDoc][_obj][_subObj][_sid][prop];
                                } catch(err){
                                    console.log(err)
                                }
                                $scope.fillOneItem(item, data)
                            }
                        }
                    }
                }
            }
 
        }
}
/*
     * Handle menu tool bar
     * @param {String} name The current function
     */
     $scope.fillNonObject = function(list) {
        var index = ["Thing", "currentForm", 1].join(DEFAULT_PROP_CHAR)
        var check = false
        for (var i=0; i < $scope.rdfaCurrent.length; i++){
            if ($scope.rdfaCurrent[i].field == index){
                var str2 = $scope.rdfaCurrent[i].data;
                if (str2 != null && str2 != ""){
                    var _nDoc = parseInt(str2.split(DEFAULT_PROP_CHAR)[0]) - 1;
                    var _obj = str2.split(DEFAULT_PROP_CHAR)[1];
                    var _subObj = str2.split(DEFAULT_PROP_CHAR)[2];
                    var _sid = parseInt(str2.split(DEFAULT_PROP_CHAR)[3]); 
                    check = true
                    break;      
                }     
            }
        }
        if (check)
            for (var i=0; i < list.length; i++){
                var item = list[i]
                if (item.type == "item"){
                    var prop = item.semantic.prefix + item.id; 
                    data = $scope.rdfaData[_nDoc][_obj][_subObj][_sid][prop];
                    $scope.fillOneItem(item, data);
                }
            }
    }


    /*
     * Handle menu tool bar
     * @param {String} name The current function
     */
     $scope.selectMenu = function(id) {

        $scope.sharedData.changeFunction(id);

        if (sharedData.currentFunction == 2) {
            window.open(window.location.href, '_blank');
            return;
        }

        if (sharedData.currentFunction == 1 || sharedData.currentFunction == 3) {
            $scope.openFile();
            return;
        }

        if (sharedData.currentFunction == 4) {
            $scope.sharedData.changeFunction(6);
            updateStateOfFormInTool();
            setTimeout(function() {
                $scope.save();
            }, 100);
            return;
        }

        if (sharedData.originDoc != "" && sharedData.currentFunction != 10) {
            alert(ERROR3_MESSAGE);
            sharedData.changeFunction(10);
            return;
        }

        if (sharedData.currentFunction == 8) {

            var r = confirm(CLEARALL_CONFIRM);
            if (r == true) {
                sharedData.clearAll();
            }
            $scope.sharedData.changeFunction(5);
        }

        if (sharedData.currentFunction == 9) {
            setTimeout(function() {
                disableAll('export', true);
            }, 100);
        }


        if (sharedData.currentFunction == 11) {
            updateStateOfFormInTool();
        }

        if (sharedData.currentFunction == 7) {
            var r = confirm(CLEAR_CONFIRM);
            if (r == true) {
                sharedData.clear();
            }
            $scope.sharedData.changeFunction(6);
        }
    }

    /*
     * Trigger to open a file
     */     
     $scope.openFile = function() {
        document.getElementById("tempFile").click();
    }

    /*
     * Get the html of the form
     *
     * @param {bool} signed If the form is signed
     * @param {string} body The main html of the form to be signed
     * @return the html text of the form
     */
     $scope.getDoc = function(signed, body) {
        //get the body part
        if (body == null){
            var node = document.getElementById("export").cloneNode(true); 
            cleanHTML(node);
            body =  clearComment(node.innerHTML);
        }
        
        if (signed == false){
            var js = formJS
            var exJs = formExJS
        }
        else {
            var js = "function verify(){window.open('https://rawgit.com/lenguyenhaohiep/formless3/master/verify.html','_blank');}";
            var exJs = formSignedJS;
        }
        
        var css = formCSS
        var saveButton = (signed == false || signed == undefined) ? htmlButtons : htmlButtonVerificaton;

        var title = sharedData.title != '' ? sharedData.title : "Untitled";
        var html = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>' +title+'</title><style type="text/css"> '+css+' </style><script type="text/javascript">'+js+'</script>'+exJs+'</head><body><form id="form-validate" onsubmit="return false;">\n' + saveButton + '\n'+body+'<input id="submit" type="submit" style="display:none"/></form></body></html>';
        
        //Append the body part into the html code
        //var s1 = '\n</body>';
        //var s2 = '\n' + body + '</body>';
        //var html = html.replace(s1, s2);
        //clean the HTML code and remove invalid tags
        s1 = "html-render";
        s2 = "div"
        while (html.indexOf(s1) != -1)
            html = html.replace(s1, s2);
        
        //return the HTML code
        return html_beautify(html);
    }

    /*
     * Save the form
     * @param {String} text The text/html to be saved
     * @param {bool} signed Check if this is a signed text
     */
     $scope.save = function(text, signed) {
        var filename = sharedData.title != '' ? sharedData.title : "Untitled";

        //get the filename of form
        var enterFileName = prompt(ENTER_NAME, filename);

        if (enterFileName != null && enterFileName !== false) {
            sharedData.title = enterFileName;
            filename = enterFileName;
            if (text == null) {
                if (sharedData.originDoc != '')
                    // signed form
                html = sharedData.originDoc;
                else
                    // unsigned form
                html = $scope.getDoc(false, null);
            } else {
                html = text;
            }

            //suffix for the download file
            if (html.indexOf(CHECK_SIGNED_STRING) == -1) {
                filename += ".html";
            } else {
                filename += "_signed.html";
            }
            var result = html;
            var aFileParts = [result];
            var oMyBlob = new Blob(aFileParts, {type: 'text/html'});
            saveAs(oMyBlob, filename);
        } else if (enterFileName == ""){
            alert(ENTER_NAME);
        }
    }

    /*
     * Update the display button for the selection of a particular function 
     */
     $scope.$watch("sharedData.currentFunction", function() {
        setTimeout(function() {
            angular.forEach($scope.commands, function(item) {
                item.selected = false;
                if (item.id == sharedData.currentFunction) {
                    item.selected = true;
                }
            });
        }, 0);
    });

     $scope.$watch("sharedData.lockCode", function() {
        //alert(sharedData.lockCode);
        if (sharedData.lockCode != '')
            $scope.restrictMode = true;    
    });

    /*
     * Clear data of the current form
     */
     $scope.clearDoc = function(){
        $scope.formsInput = [];
        $scope.rdfaCurrent = [];
        document.getElementById('fileSelection').value = '';
    }

    /*
     * Matching same objects from the current form and from the data 
     */
     $scope.findMatchers = function(){
        if ($scope.formsInput.length <= 0)
            return;

            //Objects for documents
            $scope.rdfa = [];
            //Data from documents 
            $scope.rdfaData = [];
            //Object from current form
            $scope.rdfaCurrent = [];

            //Detect objects and extract data from files given by user
            for (i = 0; i < $scope.formsInput.length; i++) {
                //Detect objects
                var objs = rdfa.parse($scope.formsInput[i].data, false);
                for (obj in objs) {
                    for (type in objs[obj]) {
                        for (id in objs[obj][type])
                        //Detect objets label 
                    $scope.rdfa.push([i + 1, obj, type, id].join(DEFAULT_PROP_CHAR));
                }
            }
                //Extract data
                $scope.rdfaData.push(objs);
            }

            //Objects in the current form
            var currDoc; 
            if (document.getElementById('export') != undefined)
                currDoc = document.getElementById('export').innerHTML;
            else 
                currDoc = document.getElementById('form').innerHTML;
            
            var currentObjs = rdfa.parse(currDoc, false);

            //Get labels for objects
            for (obj in currentObjs) {
                for (type in currentObjs[obj]) {
                    for (id in currentObjs[obj][type])
                        $scope.rdfaCurrent.push({
                            field: [obj, type, id].join(DEFAULT_PROP_CHAR),
                            data: null,
                            check: false
                        });
                }
            }

            //Sort objects with the with the desending length order
            bubbleSort($scope.rdfaCurrent);

            //Detect matched objects
            $scope.autoDectectObject();
        }

    /*
     * Analyse the forms given by user, detect objects, extract data and automatically fill the current form
     * This function is for the tool, but it is currently disable because the tool doesn't need the fill function
     */
     $scope.analyse = function() {
        $scope.findMatchers();
        $scope.fill();
    }

    /*
     * Analyse the form given by user, detect objects and extract data to fill into current form
     */
     $scope.analyse2 = function(){
        $scope.findMatchers();
        setTimeout(function(){
            document.getElementById('b-fill').scrollIntoView()
        }, 100);
    }

    /*
     * Fill the current form
     */
     $scope.fill2 = function(){
        // parse the form structure from the form
        sharedData.parseForm(document.documentElement.innerHTML, false);
        $scope.fill();
        setTimeout( function () {
            //
            disableAll('form2', false);
            updateStateOfFormInTool('form2');
            var div = document.getElementById("form2").cloneNode(true);
            cleanHTML(div);
            body = clearComment(div.innerHTML);
            var s1 = "html-render";
            var s2 = "div"
            while (body.indexOf(s1) != -1)
                body = body.replace(s1, s2);
            var message = html_beautify(body);
            sharedData.clearAll();
            document.getElementById('form').innerHTML = message;
            updateFileEvent();
            updateButtonEvent();
            updateImageEvent();
            overlay();
        }, 100);
    }

    /*
     * Detect relations between objects by its class name, its sub type and its id
     */
     $scope.autoDectectObject = function(){
        var checked = [];

        for (var i=0; i<$scope.rdfaCurrent.length; i++){
            var str = $scope.rdfaCurrent[i].field;
            var similarity = 0;
            var trace;

            for (var j=0; j<$scope.rdfa.length; j++){
                //dest
                var str2 = $scope.rdfa[j];

                if (checked.indexOf(j) == -1){
                    arr = str2.split(DEFAULT_PROP_CHAR);
                    //Check the similarity between two label of object
                    val = checkSimilarity(str, arr[1]+DEFAULT_PROP_CHAR+arr[2]);
                    //update the most similar
                    if (val > similarity){
                        similarity = val;
                        trace = j;
                    }
                }

            }

            if (similarity != 0){
                $scope.rdfaCurrent[i].data = $scope.rdfa[trace];
                //mark as use
                checked.push(trace);
            }
        }
    }
});


