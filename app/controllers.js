/**
 * Read the schema.org
 */
document.addEventListener('DOMContentLoaded', function() {
    var scope = angular.element(document.getElementById("SchemaCtr")).scope();
    scope.$apply(function() {
        if (localStorage.schemaorg)
            scope.updateSchema(localStorage.schemaorg);
    });
});


/**
 * The controller handles the module "Form Design"
 */
var mainApp = angular.module("MainApp", ["dndLists", "ngRoute", "ui.bootstrap"]);

mainApp.controller("FormCtr", function($scope, sharedData, schema, sharedData) {
    $scope.models = sharedData.models;
    $scope.schema = schema;
    $scope.openedfile = null;


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

        for (i = 0; i < l.length; i++) {
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
     *   Deserialise a form from a html file give, it will parse the html file into an instance of shared data
     */
    $scope.$watch("openedfile", function() {
        if ($scope.openedfile != null) {
            sharedData.load($scope.openedfile);
            sharedData.changeFunction("Design view");
        }
    })

});


mainApp.controller('SchemaCtr', function($scope, schema) {
    $scope.schema = schema;
    $scope.$watch("schema.file", function() {
        schema.initialize();
    });

    $scope.updateSchema = function(text) {
        schema.parseFormText(text);
    }
});

mainApp.controller("SignCtr", function($scope, sharedData) {
    $scope.keys = {
        public_key: "",
        private_key: "",
        passphrase: ""
    }

    $scope.sign = function() {
        try {
            if ($scope.keys.private_key != "" && $scope.keys.passphrase != "") {
                message = document.getElementById('export').innerHTML;

                privkey = $scope.keys.private_key;
                passphrase = $scope.keys.passphrase;

                var openpgp = window.openpgp;
                var priv = openpgp.key.readArmored(privkey);
                var privKey = priv.keys[0];
                var success = privKey.decrypt(passphrase);
                var signed = openpgp.signClearMessage(priv.keys, message);

                signed.then(function(msg) {
                    alert("Signed succefully!!!");
                    document.getElementById('export').innerHTML = msg;
                });
            } else {
                alert("Please enter private key and passphrase");
            }
        } catch (err) {
            alert("Error! Please check private key, passphrase and try again");
        }
    }

    $scope.verify = function() {
        try {
            if ($scope.keys.public_key != "") {
                signed_message = document.getElementById('export').innerHTML;
                pubkey = $scope.keys.public_key;

                var openpgp = window.openpgp;
                var publicKeys = openpgp.key.readArmored(pubkey);
                var message = openpgp.cleartext.readArmored(signed_message);
                var verified = openpgp.verifyClearSignedMessage(publicKeys.keys, message);

                verified.then(function(res) {
                    if (res.signatures[0].valid === true) {
                        alert("Verify succefully!!!")
                    } else {
                        alert("Verify unsuccefully!!!")
                    }
                });

            } else {
                alert("Please enter public key");
            }
        } catch (err) {
            alert("Error! Please check public key and try again");
        }
    }
})

mainApp.controller("FunctionCtr", function($scope, $compile, sharedData) {
    $scope.sharedData = sharedData;
    $scope.commands = [{
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
        name: "Clear",
        icon: "glyphicon-remove",
        selected: false
    }, {
        name: "Sign",
        icon: "glyphicon-pencil",
        selected: false
    }, {
        name: "Verify",
        icon: "glyphicon-ok",
        selected: false
    }];

    $scope.selectMenu = function(name) {
        $scope.sharedData.changeFunction(name);
    }

    $scope.openFile = function() {
        document.getElementById("tempFile").click();
    }

    $scope.save = function() {
        var substring = "-----BEGIN PGP SIGNED MESSAGE-----";
        var body = document.getElementById("export").innerHTML;

        var html = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Form generated by Formless Plugin</title><style type="text/css">.form-final{padding: 20px;margin: 0 auto;width: 700px;}.form-final .required-field{color: red;}.form-final h3{font-size: 20px;font-weight:bold;text-align: center;}.form-final h5{font-size: 18px;font-weight: bold;}.form-final .form-control{width: 500px;}.form-final .label-block{border: none;height: 20px;display: inline-block;width: 100px;}.form-final .control-block{display: inline-block;}.form-final ul{list-style: none;padding-left: 0;}.form-final ul li{margin: 5px;}input:valid{color: black;}.label-field{font-weight: bold;}input:invalid ~ .input-validation::before{content: "Matched format required"; color: red;}input:invalid{color: red;}</style></head><body>' + body + '</body></html>'

        var d = new Date();
        filename = "form-" + d.toISOString().substr(0, 10);

        if (html.indexOf(substring) == -1) {
            filename += ".html";
        } else {
            filename += "_signed.html";
        }

        var enterFileName = prompt("Please enter file name", filename);
        if (enterFileName != '') {

            var options = {
                "indent": "auto",
                "indent-spaces": 2,
                "wrap": 80,
                "markup": true,
                "output-xml": false,
                "numeric-entities": true,
                "quote-marks": true,
                "quote-nbsp": false,
                "show-body-only": true,
                "quote-ampersand": false,
                "break-before-br": true,
                "uppercase-tags": false,
                "uppercase-attributes": false,
                "drop-font-tags": true,
                "tidy-mark": false
            };

            var result = html_beautify(html);
            console.log(result);
            var aFileParts = [result];
            var oMyBlob = new Blob(aFileParts, {
                type: 'text/html'
            });
            saveAs(oMyBlob, enterFileName);
        } else {
            alert("Please enter a file name");
        }
    }

    $scope.$watch("sharedData.currentFunction", function() {
        angular.forEach($scope.commands, function(item) {
            item.selected = false;
            if (item.name == sharedData.currentFunction) {
                item.selected = true;
            }
        });

        if (sharedData.currentFunction == "Open") {
            $scope.openFile();
        }

        if (sharedData.currentFunction == "Edit view") {}

        if (sharedData.currentFunction == "Sign") {}

        if (sharedData.currentFunction == "Save") {
            $scope.save();
        }
    });
});