/**
 * The controller handles the module "Form Design"
 */
 var mainApp = angular.module("MainApp", ["dndLists", "ngRoute", "ui.bootstrap"]);

 mainApp.controller("FormCtr", function($scope, sharedData, schema, sharedData, $timeout) {
    $scope.models = sharedData.models;
    $scope.schema = schema;


    $scope.matchProperty = function(prop, item) {
        var check = schema.getProp(prop);
        if (check.indexOf("ov:") == -1)
            item.semantic.prefix = "";
        else {
            item.semantic.prefix = "ov:";
        }
    }

    $scope.matchTypeOfProperty = function(prop, item) {
        var type = schema.getPropType(prop);
        item.name = type;
    }

    /**
     *   When an options for checkbox/radio/dropdown is selected, we mark them as checked=true
     */
    $scope.setSelect = function(item, option) {
        if (item.name != 'Checkbox') {
            angular.forEach(item.field_options, function(i) {
                i.checked = false;
            });
            option.checked = true;

            item.value = option;
        } else {
            item.value = [];
            angular.forEach(item.field_options, function(i) {
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
     *   Remove an option at index for the current item
     */
    $scope.removeOption = function(item, index) {
        var r = confirm('Do you want to remove');
        if (r == true) {
            item.field_options.splice(index, 1);
        }
    };

    /*
     *   Delete an item in the current model
     */
    $scope.removeItem = function(item) {
        var r = confirm('Do you want to remove');
        if (r == true) {
            $scope.models.selected = null;
            $scope.removeNode($scope.models.dropzones, item);
        }
    };

    $scope.$watch('models.dropzones', function(model) {

        //to upload an image
        //updateFileEvent();    
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);


    /*
     *   Delete an item in the current model in the interface
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
     *   Update the semantic info of a node in a list
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
     *   Update the semantic info when user clicks to a form control
     */
    $scope.selectItem = function(item) {
        $scope.models.selected = item;
        $scope.updateSemantic($scope.models.dropzones, $scope.models.selected);
    };

    /*
     *   Find properties by a given class
     */
    $scope.findProperties = function(_class) {
        return schema.findProperties(_class);
    };


    /*
     * Delete an image
     */
    $scope.deleteImage = function(item, img) {
        var r = confirm('Do you want to remove this file');
        if (r == false)
            return;

        for (i = 0; i < item.value.length; i++) {
            if (item.value[i] == img) {
                item.value.splice(i, 1);
                return;
            }
        }
    }
});


mainApp.controller("FunctionCtr", function($scope, $compile, sharedData, rdfa, schema) {

    $scope.schema = schema;
    $scope.keys = {
        public_key: "",
        private_key: "",
        passphrase: ""
    }

    $scope.formsInput = [];

    $scope.rdfa = [];

    $scope.rdfaData = [];

    $scope.rdfaCurrent = [];

    $scope.schema = schema;

    $scope.openedfile = null;

    $scope.initialize = function() {
        //schema.file = $scope.file;
        if (schema.file == null)
            return;
        var reader = new FileReader();
        reader.onload = function(e) {
            schema.initialize(e.target.result);
            $scope.$apply();
        }
        reader.readAsText(schema.file);
    }


    $scope.loadfile = function(){
        if ($scope.openedfile != null){
            var reader = new FileReader();
            reader.onload = function(e) {
                //sharedData.currentFunction = "Edit view";
                sharedData.parseForm(e.target.result);
                $scope.$apply();
            }
            reader.readAsText($scope.openedfile);
        }
    }

    $scope.updateSchema = function(text) {
        schema.parseFormText(text);
    }

    $scope.sign = function(text, private_key, passphrase) {
        try {
            if (private_key && passphrase) {
                $scope.keys.private_key = private_key;
                $scope.keys.passphrase = passphrase;
            }

            if ($scope.keys.private_key != "" && $scope.keys.passphrase != "") {

                if (text) {
                    parser = new DOMParser();
                    html = parser.parseFromString(text, "text/html");
                    message = $scope.getDoc(true, html);

                } else {
                //disable the forms
                    setTimeout( function() {
                        disableAll('export', true);
                        updateStateOfForm();
                    }, 0);
                    message = $scope.getDoc(true);
                }

                privkey = $scope.keys.private_key;
                passphrase = $scope.keys.passphrase;

                var openpgp = window.openpgp;
                var priv = openpgp.key.readArmored(privkey);
                var privKey = priv.keys[0];
                var success = privKey.decrypt(passphrase);
                var signed = openpgp.signClearMessage(priv.keys, message);

                signed.then(function(msg) {
                    alert("Signed succefully!!!");
                    $scope.save(msg);
                });
            } else {
                alert("Please enter private key and passphrase");
            }
        } catch (err) {
            alert("Error! Please check private key, passphrase and try again");
        }
    }

    $scope.verify = function(text, public_key) {
        try {
            if (public_key)
                $scope.keys.public_key = public_key;
            if ($scope.keys.public_key != "") {
                pubkey = $scope.keys.public_key;

                var openpgp = window.openpgp;
                var publicKeys = openpgp.key.readArmored(pubkey);
                if (text) {
                    message = openpgp.cleartext.readArmored(text);
                } else {
                    if (sharedData.signed) {
                        message = openpgp.cleartext.readArmored(sharedData.originDoc);
                    } else {
                        signed_message = $scope.msg;
                        signed_message = sharedData.originDoc;
                        message = openpgp.cleartext.readArmored(signed_message);
                    }
                }
                var verified = openpgp.verifyClearSignedMessage(publicKeys.keys, message);
                verified.then(function(res) {
                    if (res.signatures[0].valid === true) {
                        console.log(res.signatures);
                        var msg_alert = "Verify succefully!!!";
                        msg_alert += "\n Signed by the following public key";
                        msg_alert += "\n ---------------------------------------------";
                        msg_alert += "\n User's info: " + publicKeys.keys[0].getUserIds();
                        msg_alert += "\n Creation: " + publicKeys.keys[0].getPrimaryUser().selfCertificate.created;
                        msg_alert += "\n Expiration: " + publicKeys.keys[0].getExpirationTime();
                        alert(msg_alert);
                    } else {
                        alert("Verify unsuccefully!!!")
                    }
                });

            } else {
                alert("Please enter public key");
            }
        } catch (err) {
            alert("This is not a signed form or the public key is invalid, Please try again !!!");
        }
    }

    $scope.fill = function() {
        sharedData.clear();
        $scope.fillAction(sharedData.models.dropzones.templates);
    }

    $scope.fillAction = function(list) {
        if (!(list instanceof Array)) {
            temp = [];
            temp.push(list);
            list = temp;
        }
        for (i = 0; i < $scope.rdfaCurrent.length; i++) {
            var str = $scope.rdfaCurrent[i].field;

            //source
            _name = str.split("-")[0];
            _subtype = str.split("-")[1];
            _id = parseInt(_subtype.substring(_subtype.length - 1, _subtype.length));
            if (isNaN(_id)) {
                _id = 1;
            } else
                _subtype = _subtype.substring(0, _subtype.length - 1);


            if ($scope.rdfaCurrent[i].data == null)
                break;
            //dest
            var str2 = $scope.rdfaCurrent[i].data;
            _nDoc = parseInt(str2.split("-")[0]) - 1;
            _obj = str2.split("-")[1];
            _subObj = str2.split("-")[2];

            for (j = 0; j < list.length; j++) {
                node = list[j];

                if (node.type == 'container' || node.type == 'subProperty') {
                    if (node.name == _name && node.subtype == _subtype && node.id == _id) {
                        for (k = 0; k < node.templates[0].length; k++) {
                            item = node.templates[0][k];

                            if (item.type == "container" || item.type == 'subProperty') {
                                if (item.templates != null)
                                    $scope.fillAction(item);
                            } else {
                                _property = item.semantic.property;
                                _prefix = item.semantic.prefix;
                                prop = _prefix + _property;

                                var val = null;
                                try {
                                    val = $scope.rdfaData[_nDoc][_obj][_subObj][prop];
                                } catch (err) {

                                }
                                if (val)
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

    $scope.loadFromTab = function(text) {
        parser = new DOMParser();
        htmlDoc = parser.parseFromString(text, "text/html");
        models = sharedData.htmlToTemplate(htmlDoc, _class = null, _id = null);
        sharedData.models.dropzones.templates = models;
    }

    $scope.sharedData = sharedData;
    $scope.commands = sharedData.commands;

    $scope.selectMenu = function(name) {

        $scope.sharedData.changeFunction(name);

        if (sharedData.currentFunction == "New") {
            window.open(window.location.href, '_blank');
            return;
        }

        if (sharedData.currentFunction == "Open") {
            $scope.openFile();
            //$scope.sharedData.changeFunction("Edit view");
            return;
        }

        if (sharedData.currentFunction == "New from Template") {
            $scope.openFile();
            //$scope.sharedData.changeFunction("Edit view");
            return;
        }

        if (sharedData.currentFunction == "Save") {
            setTimeout(function() {
                $scope.sharedData.changeFunction("Edit view");
                updateStateOfForm();
                $scope.save();
            }, 0);
            return;
        }

        if (sharedData.originDoc != "" && sharedData.currentFunction != "Verify") {
            alert("This is a signed document, modification is impossible");
            sharedData.changeFunction("Verify");
            return;
        }

        if (sharedData.currentFunction == "Clear All") {

            var r = confirm('Do you want to clear both structure and data to create a new form');
            if (r == true) {
                sharedData.clearAll();
            }
            $scope.sharedData.changeFunction("Design view");
        }

        if (sharedData.currentFunction == "Sign") {
            setTimeout(function() {
                disableAll('export', true);
            }, 0);
        }


        if (sharedData.currentFunction == "Fill") {
            updateStateOfForm();
        }

        if (sharedData.currentFunction == "Clear Data") {
            var r = confirm('Do you want to clear all data');
            if (r == true) {
                sharedData.clear();
            }
            $scope.sharedData.changeFunction("Edit view");
        }
    }

    $scope.openFile = function() {
        document.getElementById("tempFile").click();
    }


    $scope.getDoc = function(signed, html) {
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

        var code = '<script type="text/javascript">var body=document.getElementsByTagName("body")[0];body.style.color="white";var main=document.getElementById("form");main.style.color="black";</script>';
        var disableSignature = code;
        var js="/* * Add an image after the button */function create_line_image(object, source, name){var multiple=object.getAttribute('multiple'); var parentNode=object.parentNode; if (multiple==null){var divs=parentNode.querySelectorAll('div'); for (i=0; i <divs.length; i++){parentNode.removeChild(divs[i]);}}var image=document.createElement('img'); image.setAttribute('ng-init', 'itemload()'); image.src=source; image.addEventListener('click', function(){window.open(this.src,'_blank');}); var span=document.createElement('span'); span.innerHTML=name; var button=document.createElement('button'); button.innerHTML='Remove'; button.addEventListener('click', function(){var r=confirm('Do you want to remove this file'); if (r==true){parent2=this.parentNode; parent1=parent2.parentNode; parent1.removeChild(parent2); reset(parent1);}}); var div=document.createElement('div'); div.className='image-line'; div.appendChild(span); div.appendChild(image); div.appendChild(button); parentNode.appendChild(div);}/* * Reset when there is no image */function reset(object){var divs=object.querySelectorAll('div'); if (divs.length==0){input=object.querySelector('input'); input.value='';}}/* * Add a trigger to upload file */function updateFileEvent(){var signatures=document.getElementsByClassName('fileupload'); for (i=0; i < signatures.length; i++){signature=signatures[i]; signature.addEventListener('change', function(){var object=this; var files=this.files; if (files==null) return; for (var i=0; i < files.length; i++){file=files[i]; var name=file.name; var reader=new FileReader(); reader.onload=function(e){create_line_image(object, e.target.result, name);}reader.readAsDataURL(file);}});}}document.addEventListener('DOMContentLoaded', function (){updateFileEvent();});";
        var html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Form generated by Formless Plugin</title><style type="text/css">.form-final{padding: 20px;margin: 0 auto;width: 700px;}.form-final .required-field{color: red;}.form-final h3{font-size: 20px;font-weight:bold;text-align: center;}.form-final h5{font-size: 18px;font-weight: bold;}.form-final .form-control{width: 500px;}.form-final .label-block{border: none;height: 20px;display: inline-block;width: 100px;}.form-final .control-block{display: inline-block;}.form-final ul{list-style: none;padding-left: 0;}.form-final ul li{margin: 5px;}input:valid{color: black;}.label-field{font-weight: bold;}input:invalid ~ .input-validation::before{content: "Matched format required"; color: red;}input:invalid{color: red;}.image-line:hover{background:#f5f5f5}.image-line{height:100px}.image-line span{width:100px;display:inline-block;padding-left:10px}.image-line img{height:100px;padding:10px}</style><script type="text/javascript">'+js+'</script></head><body>' + body + '</body>'+disableSignature+'</html>';
        return html_beautify(html);
    }

    $scope.save = function(text, signed) {
        var substring = "-----BEGIN PGP SIGNED MESSAGE-----";

        var d = new Date();
        filename = "form-" + d.toISOString().substr(0, 10);

        if (text == null) {
            if (sharedData.originDoc != '')
                html = sharedData.originDoc;
            else
                html = $scope.getDoc();
        } else {
            html = text;
        }

        if (html.indexOf(substring) == -1) {
            filename += ".html";
        } else {
            filename += "_signed.html";
        }

        var enterFileName = prompt("Please enter file name", filename);
        if (enterFileName != null && enterFileName !== false) {
            var result = html;
            var aFileParts = [result];
            var oMyBlob = new Blob(aFileParts, {
                type: 'text/html'
            });
            saveAs(oMyBlob, enterFileName);
        } else {
            if (enterFileName == "")
                alert("Please enter a file name");
        }
    }

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

    $scope.clearDoc = function(){
        $scope.formsInput = [];
        $scope.rdfaCurrent = [];
        document.getElementById('fileSelection').value = '';
    }

    $scope.analyse = function() {
        if ($scope.formsInput.length <= 0)
            return;

        //Objects for documents
        $scope.rdfa = [];

        //Data from documents 
        $scope.rdfaData = [];

        //
        $scope.rdfaCurrent = [];

        for (i = 0; i < $scope.formsInput.length; i++) {
            var objs = rdfa.parse($scope.formsInput[i]);
            for (obj in objs) {
                for (type in objs[obj]) {
                    $scope.rdfa.push([i + 1, obj, type].join('-'));
                }
            }
            $scope.rdfaData.push(objs);
        }

        //Objects in the current form
        var currentObjs = rdfa.parse(document.getElementById('export').innerHTML);

        var checked = {};
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

    $scope.autoDectectObject = function(){

        var checked = [];
        //Fill with complete match
        //ex Person-Student1 = Person-Student2
        for (i=0; i<$scope.rdfaCurrent.length; i++){
            var str = $scope.rdfaCurrent[i].field;
            for (j=0; j<$scope.rdfa.length; j++){
                //dest
                var str2 = $scope.rdfa[j];
                str2 = str2.substring(2);
                if (str2 == str && checked.indexOf(j)==-1){
                    $scope.rdfaCurrent[i].data = $scope.rdfa[j];
                    checked.push(j)
                    break;
                }
            }
        }

        //Fill with incomplete match
        //ex Person-Student1 == Person-Student2

        //ex Person-Student1 == Person-1

        //ex Person-1 == Person-Student-1
    }
});