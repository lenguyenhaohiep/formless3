/**
 * @file The controllers
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */


 var mainApp = angular.module("MainApp", ["dndLists", "ngRoute", "ui.bootstrap"]);


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
        if (check.indexOf(PREFIX) == -1)
            item.semantic.prefix = "";
        else {
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
                node.semantic.class = list.name;
                node.semantic.id = list.id;
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
        if ($scope.openedfile != null){
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
                // if sign a text (use Chrome extension)
                if (text) {
                    var parser = new DOMParser();
                    var html = parser.parseFromString(text, "text/html");
                    message = $scope.getDoc(true, html);
                } 
                // if sign a current form
                else {
                    //disable the forms
                    setTimeout( function() {
                        disableAll('export', true);
                        updateStateOfForm();
                    }, 0);
                    message = $scope.getDoc(true);
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
                    $scope.save(msg);
                });
            } else {
                alert(KEY1_CONFIRM);
            }
        } catch (err) {
            alert(ERROR1_MESSAGE);
        }
    }



    /* 
     * Verify a form or a text (if we use chrome extension)
     * 
     * @param {string} text The text to be signed
     * @param {string} public_key The public key
     */
    $scope.verify = function(text, public_key) {
        try {
            if (public_key)
                $scope.keys.public_key = public_key;
            if ($scope.keys.public_key != "") {
                pubkey = $scope.keys.public_key;

                var openpgp = window.openpgp;

                //Read public key
                var publicKeys = openpgp.key.readArmored(pubkey);
                
                if (text) {
                    // Chrome extension
                    message = openpgp.cleartext.readArmored(text);
                } else {
                    // current form in app
                    message = openpgp.cleartext.readArmored(sharedData.originDoc);
                }

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
    }

    $scope.fillAction = function(list){
        if (!(list instanceof Array)) {
            var temp = [];
            temp.push(list);
            list = temp;
        }
        for (i = 0; i < $scope.rdfaCurrent.length; i++) {
            var str = $scope.rdfaCurrent[i].field;

            //source label (name, subtype, id)
            var _name = str.split("-")[0];
            var _subtype = str.split("-")[1];
            var _id = parseInt(_subtype.substring(_subtype.length - 1, _subtype.length));
            if (isNaN(_id)) {
                _id = 1;
            } else
                _subtype = _subtype.substring(0, _subtype.length - 1);


            if ($scope.rdfaCurrent[i].data == null)
                break;
            //dest (#doc, name, subtype, id)
            var str2 = $scope.rdfaCurrent[i].data;
            var _nDoc = parseInt(str2.split("-")[0]) - 1;
            var _obj = str2.split("-")[1];
            var _subObj = str2.split("-")[2];

            for (j = 0; j < list.length; j++) {
                var node = list[j];

                if (node.type == 'container' || node.type == 'subProperty') {
                    if (node.name == _name && node.subtype == _subtype && node.id == _id) {
                        for (k = 0; k < node.templates[0].length; k++) {
                            var item = node.templates[0][k];

                            if (item.type == "container" || item.type == 'subProperty') {
                                if (item.templates != null)
                                    $scope.fillAction(item);
                            } else {
                                var _property = item.semantic.property;
                                var _prefix = item.semantic.prefix;
                                var prop = _prefix + _property;

                                var val = null;
                                
                                try {
                                    val = $scope.rdfaData[_nDoc][_obj][_subObj][prop];
                                } catch (err) {}

                                if (val != null && val != undefined)
                                    switch (item.name) {
                                    case "Number":
                                        item.val = parseInt(val);
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
                                        for (kk = 0; kk < item.field_options.length; kk++) {
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
                                        for (jj = 0; jj < item.field_options.length; jj++) {
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
                                        item.value = [];
                                        for (jj = 0; jj < val.length; jj++) {
                                            item.value.push(val[jj]);
                                        }
                                        break;
                                    default:
                                        item.value = $scope.rdfaData[_nDoc][_obj][_subObj][prop];
                                        break;
                                }

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
    $scope.selectMenu = function(name) {

        $scope.sharedData.changeFunction(name);

        if (sharedData.currentFunction == NEW) {
            window.open(window.location.href, '_blank');
            return;
        }

        if (sharedData.currentFunction == OPEN || sharedData.currentFunction == NEWTEMPLATE) {
            $scope.openFile();
            return;
        }

        if (sharedData.currentFunction == SAVE) {
            setTimeout(function() {
                $scope.sharedData.changeFunction(EDIT);
                updateStateOfForm();
                $scope.save();
            }, 0);
            return;
        }

        if (sharedData.originDoc != "" && sharedData.currentFunction != VERIFY) {
            alert(ERROR3_MESSAGE);
            sharedData.changeFunction(VERIFY);
            return;
        }

        if (sharedData.currentFunction == CLEARALL) {

            var r = confirm(CLEARALL_CONFIRM);
            if (r == true) {
                sharedData.clearAll();
            }
            $scope.sharedData.changeFunction(DESIGN);
        }

        if (sharedData.currentFunction == SIGN) {
            setTimeout(function() {
                disableAll('export', true);
            }, 0);
        }


        if (sharedData.currentFunction == FILL) {
            updateStateOfForm();
        }

        if (sharedData.currentFunction == CLEAR) {
            var r = confirm(CLEAR_CONFIRM);
            if (r == true) {
                sharedData.clear();
            }
            $scope.sharedData.changeFunction(EDIT);
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
     * @param {string} text The test to be signed
     * @return the html text of the form
     */
    $scope.getDoc = function(signed, html) {
        var body = '';
        if (html == null){
            //for the app
            disableAll('form', false);
            body = document.getElementById("export").innerHTML;
        }
        else {
            //for Chrome extension
            disableAll('form', true, html);
            body = html.getElementById("form").outerHTML;
        }
        //html code for the form
        var disableSignature = '<script type="text/javascript">var body=document.getElementsByTagName("body")[0];body.style.color="white";var main=document.getElementById("form");main.style.color="black";</script>';
        var js = 'function updateButtonEvent(){var e=document.querySelectorAll("button");for(i=0;i<e.length;i++)e[i].addEventListener("click",function(){var e=confirm("Do you want to remove this file");1==e&&(parent2=this.parentNode,parent1=parent2.parentNode,parent1.removeChild(parent2),reset(parent1))})}function create_line_image(e,t,n){var r=e.getAttribute("multiple"),a=e.parentNode;if(null==r){var l=a.querySelectorAll("div");for(i=0;i<l.length;i++)a.removeChild(l[i])}var o=document.createElement("img");o.setAttribute("ng-init","itemload()"),o.src=t,o.addEventListener("click",function(){window.open(this.src,"_blank")});var d=document.createElement("span");d.innerHTML=n;var u=document.createElement("button");u.innerHTML="Remove",u.addEventListener("click",function(){var e=confirm("Do you want to remove this file");1==e&&(parent2=this.parentNode,parent1=parent2.parentNode,parent1.removeChild(parent2),reset(parent1))});var c=document.createElement("div");c.className="image-line",c.appendChild(d),c.appendChild(o),c.appendChild(u),a.appendChild(c)}function reset(e){var t=e.querySelectorAll("div");0==t.length&&(input=e.querySelector("input"),input.value="")}function updateFileEvent(){var e=document.getElementsByClassName("fileupload");for(i=0;i<e.length;i++)signature=e[i],signature.addEventListener("change",function(){var e=this,t=this.files;if(null!=t)for(var n=0;n<t.length;n++){file=t[n];var i=file.name,r=new FileReader;r.onload=function(t){create_line_image(e,t.target.result,i)},r.readAsDataURL(file)}})}document.addEventListener("DOMContentLoaded",function(){updateFileEvent(),updateButtonEvent()});';
        var html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Form generated by Formless Plugin</title><style type="text/css">.form-final{padding: 20px;margin: 0 auto;width: 700px;}.form-final .required-field{color: red;}.form-final h3{font-size: 20px;font-weight:bold;text-align: center;}.form-final h5{font-size: 18px;font-weight: bold;}.form-final .form-control{width: 500px;}.form-final .label-block{border: none;height: 20px;display: inline-block;width: 100px;}.form-final .control-block{display: inline-block;}.form-final ul{list-style: none;padding-left: 0;}.form-final ul li{margin: 5px;}input:valid{color: black;}.label-field{font-weight: bold;}input:invalid ~ .input-validation::before{content: "Matched format required"; color: red;}input:invalid{color: red;}.image-line:hover{background:#f5f5f5}.image-line{height:100px}.image-line span{width:100px;display:inline-block;padding-left:10px}.image-line img{height:100px;padding:10px}</style><script type="text/javascript">'+js+'</script></head><body>' + body + '</body>'+disableSignature+'</html>';
        return html_beautify(html);
    }

    /*
     * Save the form
     * @param {String} text The text/html to be saved
     * @param {bool} signed Check if this is a signed text
     */
    $scope.save = function(text, signed) {
        var substring = "-----BEGIN PGP SIGNED MESSAGE-----";

        var d = new Date();
        filename = "form-" + d.toISOString().substr(0, 10);

        if (text == null) {
            if (sharedData.originDoc != '')
                // signed form
                html = sharedData.originDoc;
            else
                // unsigned form
                html = $scope.getDoc();
        } else {
            //Chrome extension
            html = text;
        }

        //suffix for the download file
        if (html.indexOf(substring) == -1) {
            filename += ".html";
        } else {
            filename += "_signed.html";
        }

        //get the filename of form
        var enterFileName = prompt(ENTER_NAME, filename);
        if (enterFileName != null && enterFileName !== false) {
            var result = html;
            var aFileParts = [result];
            var oMyBlob = new Blob(aFileParts, {
                type: 'text/html'
            });
            saveAs(oMyBlob, enterFileName);
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
                if (item.name == sharedData.currentFunction) {
                    item.selected = true;
                }
            });
        }, 0);
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
     * Analyse the forms given by user, detect objects, extract data and automatically fill the current form
     */
    $scope.analyse = function() {
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
            var objs = rdfa.parse($scope.formsInput[i]);
            for (obj in objs) {
                for (type in objs[obj]) {
                    //Detect objets label 
                    $scope.rdfa.push([i + 1, obj, type].join('-'));
                }
            }
            //Extract data
            $scope.rdfaData.push(objs);
        }

        //Objects in the current form
        var currentObjs = rdfa.parse(document.getElementById('export').innerHTML);

        //Get labels for objects
        for (obj in currentObjs) {
            for (type in currentObjs[obj]) {
                $scope.rdfaCurrent.push({
                    field: [obj, type].join('-'),
                    data: null
                });
            }
        }
        $scope.autoDectectObject();
    }

    /*
     * Detect relations between objects by its class name, its sub type and its id
     */
    $scope.autoDectectObject = function(){
        var checked = [];

        for (var i=0; i<$scope.rdfaCurrent.length; i++){
            var str = $scope.rdfaCurrent[i].field;
            var similarity = -1;
            var trace;

            for (var j=0; j<$scope.rdfa.length; j++){
                //dest
                var str2 = $scope.rdfa[j];

                if (checked.indexOf(j) == -1){
                    arr = str2.split('-');
                    //Check the similarity between two label of object
                    val = checkSimilarity(str, arr[1]+'-'+arr[2]);
                    //update the most similar
                    if (val > similarity){
                        similarity = val;
                        trace = j;
                    }
                }

            }

            if (similarity != -1){
                $scope.rdfaCurrent[i].data = $scope.rdfa[trace];
                //mark as use
                checked.push(trace);
            }
        }
    }
});


