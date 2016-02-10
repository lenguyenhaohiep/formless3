scriptFunctionLoaded = true;

function sign () {
	display('sign');
}

function verify() {
	display('verify');
}

function importData(){
	display('importData');
}


function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

/*
 * This method aims to check whether a form is signed
 * @param html : text of html of the form
 * @return true if signed, else false
 */

function checkSigned(html) {
    var substring = "-----BEGIN PGP SIGNED MESSAGE-----";
    return (html.indexOf(substring) != -1)
}

/*
 * We want to use code from AngularJS, so we have to create a temporature controller 
 * Because this the form after generated, it no longer works properly with the code in the view 
 * But we need to use some method in the controller
 * @return Scope of FunctionCtr
 */
function getController() {
    var div = document.getElementById('FunctionCtr') || document.createElement('div');
    div.setAttribute('ng-app', 'MainApp');
    div.setAttribute('id', 'FunctionCtr');
    div.setAttribute('ng-controller', 'FunctionCtr');
    angular.bootstrap(div, ['MainApp']);
    var scope = angular.element(div).scope();
    return scope;
}

/*
 * Remove appended html of a dialog if existed 
 */
function resetOriginal() {
    var check = document.getElementById('append');
    if (check)
        check.remove();
}

function display(func){
	resetOriginal();
	var funcHTML = "";
	switch (func) {
	    case "sign":
	        funcHTML = "<h3>Sign</h3><div class='main'><h5>Private Key</h5><input id='file' type='file' /><textarea id='private_key' rows='15' class='form-control' placeholder='Enter your private key'></textarea><h5>Passphrase</h5><input id='passphrase' type='password' class='form-control' placeholder='Enter your passphrase'/><br/><button class='btn' id='sign'>Click to sign this form</button></div>"
	        break;
	    case "verify":
	        funcHTML = "<h3>Verify</h3><div class='main'><h5>Public Key</h5><input id='file' type='file' /><textarea id='public_key' rows='15' class='form-control' placeholder='Enter the public key'></textarea><br/><button class='btn' id='verify'>Click to verify this form</button></div>"
	        break;
	    case "importData":
	    	var tempForm = '<script type="text/ng-template" id="list2.html"> <ul dnd-list="list"> <li ng-repeat="item in list" ng-include="item.type + \'2.html\'"> </li></ul> </script> <script type="text/ng-template" id="container2.html"> <h5 style="text-align: left">{{item.subtype}}</h5> <div resource="{{item.subtype}}{{item.id}}" data-oid="{{item.id}}" typeof="{{schema.getType(item.name)}}"> <div ng-repeat="list in item.templates" ng-include="\'list2.html\'"></div></div></script> <script type="text/ng-template" id="subProperty2.html"> <div property="{{item.subtype}}" typeof="{{schema.getType(item.name)}}" data-oid="{{item.id}}" data-temptype="{{item.semantic.class}}" data-sid="{{item.semantic.id}}"> <div ng-repeat="list in item.templates" ng-include="\'list2.html\'"></div></div></script> <script type="text/ng-template" id="item2.html"> <div ng-if="item.noinput==null"> <label class="label-view">{{item.label}}</label> <span ng-if="item.required==\'yes\'" class="required-field">*</span> <br/> <div class="control-block"> <html-render item="item" val="component"></html-render> </div></div><div ng-if="item.noinput !=null"> <h3 data-oid="{{item.id}}" ng-if="item.name==\'Header\'">{{item.label}}</h3> <h5 data-oid="{{item.id}}" ng-if="item.name==\'Section\'">{{item.label}}</h5> </div></script> <div ng-repeat="(zone, list) in sharedData.models.dropzones" style="display:none" class="col-md-6 template-zone"> <div id="form2" class="box box-grey centerarea"> <div ng-include="\'list2.html\'" class="form-final" vocab="http://schema.org/" prefix="ov: http://personal.schema.example/"> </div></div></div>';
	    	funcHTML = "<h3>Import</h3> <div id='FunctionCtr' class='main'> "+tempForm+" <h5>Forms</h5> <input id='fileSelection' file3 type='file' ng-model='formsInput' on-finish='alert()' multiple/> <br/> <span>{{formsInput.length}} Document(s) selected</span> <br/> <div ng-if='formsInput.length > 0'> <button class='btn' ng-click='clearDoc()'>Clear</button> <button class='btn' ng-click='analyse2()'>Import</button> <div ng-if='rdfaCurrent.length > 0'> <h5>Mapping</h5> <table class='table table-bordered'> <tbody> <tr ng-repeat='obj in rdfaCurrent'> <td> <label>{{obj.field}}</label> <select class='form-control' ng-change='fill()' ng-model='obj.data'> <option></option> <option ng-repeat='option in rdfa' value='{{option}}'>{{option}}</option> </select> </td></tr></tbody> </table> <button class='btn' ng-click='fill2()'>Fill</button> </div></div></div>";
	        break;
	    default:
	        break;
	}

	var dialogHTML = '<div id="overlay"><div id="window"><button id="exit">Exit</button>' + funcHTML + '</div></div>';
	var div = document.createElement("div");
	div.id = 'append';
	div.innerHTML = dialogHTML;

	    document.body.appendChild(div);

	    var dialog = document.getElementById('window');
	    dialog.style.width = "500px";
	    dialog.style.height = "500px";

	    document.getElementById('exit').onclick = function() {
	    	overlay();    
	    };

	    var inputFile = document.getElementById('file');
	    if (inputFile)
	        inputFile.onchange = function(event) {
	            var files = event.target.files;
	            var file = files[0];

	            var reader = new FileReader();
	            reader.onload = function() {
	                switch (func) {
	                    case "sign":
	                        document.getElementById("private_key").value = reader.result;
	                        break;
	                    case "verify":
	                        document.getElementById("public_key").value = reader.result;
	                        break;
	                    default:
	                        break;
	                }
	            }
	            reader.readAsText(file);
	        }

	    var scope = getController();
	    //sign and verify
	    switch (func) {
	        case "sign":
	            if (checkSigned(document.body.outerHTML)) {
	                alert(ERROR3_MESSAGE);
	                break;
	            }
	            overlay();
	            document.getElementById('sign').onclick = function() {
	                private_key = document.getElementById('private_key').value;
	                passphrase = document.getElementById('passphrase').value;
	                if (private_key == '' || passphrase == '') {
	                    alert(KEY1_CONFIRM);
	                    return;
	                }

	                resetOriginal();
	                updateStateOfForm();

	                text = document.documentElement.outerHTML;

	                scope.$apply(function() {
	                	scope.sign(text, private_key, passphrase);
		                setTimeout(function() {
		               		if (scope.sharedData.originDoc != '')
		                    	disableAll('form', true, null);
		                	});
	            		}, 100);    
	            };
	            break;
	        case "verify":
	            if (!checkSigned(document.body.innerHTML)) {
	                alert(ERROR2_MESSAGE);
	                break;
	            }
	            overlay();
	            document.getElementById('verify').onclick = function() {
	                public_key = document.getElementById('public_key').value;
	                if (public_key == '') {
	                    alert(KEY2_CONFIRM);
	                    return;
	                }

	                resetOriginal();

	                text = document.body.innerHTML;

	                scope.$apply(function() {
	                    scope.verify(text, public_key);
	                });   
	            }
	            break;

	        case "importData":
	            if (checkSigned(document.body.outerHTML)) {
	                alert(MODIFY_MESSAGE);
	                break;
	            }
	            overlay();
	            break;

	        default:
	            break;
	    }
	
}


