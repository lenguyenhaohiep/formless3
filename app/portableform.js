/*
This is used for the functions which use the external javascritps
*/
scriptFunctionLoaded = true;

url = "https://rawgit.com/lenguyenhaohiep/formless3/master/app/standalone.js";

function loadjs(filename){
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
    if (typeof fileref!="undefined")	
        document.getElementsByTagName("head")[0].appendChild(fileref)
}


if (typeof(formCSS) == 'undefined'){
	loadjs(url)
}


function sign () {
	if (checkValidate() == true)
		display('sign');
}

function importData(){
	display('importData');
}

function printPage(){
	window.print()
}

function signByImage(){
	overlay();
	disableAll('form', true, null);
	updateStateOfForm()
    var t = document.title + ".html",
        n = window.prompt("Please enter the file name", t);
    if (null != n && n !== !1) {
    	var content = document.documentElement.outerHTML
    	content = content.replace('<a id="b-save" onclick="save()">Save</a>','')
    	content = content.replace('<a id="b-import" onclick="run(\'import\')">Import</a>','')
    	content = content.replace('<a id="b-sign" onclick="run(\'sign\')">Lock</a>','')

        var i = document.getElementById("lock");
        i.href = "data:Application/octet-stream," + encodeURIComponent(content), i.download = t
    }
}

var private_key = null
var passphrase = null

function signByPGP(){
    private_key = document.getElementById('private_key').value;
    passphrase = document.getElementById('passphrase').value;
    if (private_key == '' || passphrase == '') {
        alert(KEY1_CONFIRM);
        return;
    }

    resetOriginal();
    updateStateOfForm();

    text = document.documentElement.outerHTML;
    var scope = getController();

    scope.$apply(function() {
    	scope.sign(text, private_key, passphrase);
        setTimeout(function() {
       		if (scope.sharedData.originDoc != '')
            	disableAll('form', true, null);
        	});
		}, 100);    
}

function Lock(){
    private_key = document.getElementById('private_key').value;
    passphrase = document.getElementById('passphrase').value;
    if (private_key == "" && passphrase == "")
    	signByImage()
    else
    	signByPGP()
}


function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	document.body.style.overflow = (el.style.visibility == "visible") ? "hidden" : "auto";
	resize = "both"
	if (el.style.visibility == "visible")
		resize = "none"
	imgs = document.getElementsByClassName("img-frame");
	for (var i=0;i<imgs.length;i++){
		imgs[i].style.resize = resize
	}
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
	        funcHTML = 
	        `<h3>Lock</h3>
	        <div class='main'>
	        	<h5>Private Key</h5>
	        	<input id='file' type='file' />
	        	<textarea id='private_key' rows='15' class='form-control' placeholder='If you have a private PGP key, please import or paste it here. Otherwise leave this field empty.'></textarea>
	        	<h5>Passphrase</h5>
	        	<input id='passphrase' type='password' class='form-control' placeholder='Please provide your passphrase or leave it empty'/>	
	        	<br/><br/>       
	        	<a id='lock' onclick="Lock()">Lock</a>
	        </div>`
	        break;
	    case "verify":
	        funcHTML = 
	        `<h3>Verify</h3>
	        <div class='main'>
	        	<h5>Public Key</h5>
	        	<input id='file' type='file' />
	        	<textarea id='public_key' rows='15' class='form-control' placeholder='Import your public key from file or enter here'></textarea>
	        	r/>
	        	<button class='btn' id='verify'>Click to verify this form</button>
	        </div>`
	        break;
	    case "importData":
	    	var tempForm = 
	    	`<div id='FunctionCtr' class='main'> 
	    		<script type="text/ng-template" id="list2.html"> 
		    		<ul dnd-list="list"> 
		    			<li ng-repeat="item in list" ng-include="item.type + \'2.html\'"> </li>
	    			</ul> 
	    		</script> 
	    		<script type="text/ng-template" id="container2.html"> 
		    		<h5 style="text-align: left">{{item.subtype}}</h5> 
                    <span class="note-sec" ng-show="item.note != ''">{{item.note}}</span>
		    		<div resource="{{item.subtype}}{{item.id}}" data-oid="{{item.id}}" typeof="{{schema.getType(item.name)}}"> 
		    			<div ng-repeat="list in item.templates" ng-include="\'list2.html\'">
		    			</div>
		    		</div>
	    		</script> 
	    		<script type="text/ng-template" id="subProperty2.html"> 
	    			<div property="{{item.subtype}}" typeof="{{schema.getType(item.name)}}" data-oid="{{item.id}}" data-temptype="{{item.semantic.class}}" data-sid="{{item.semantic.id}}"> 
		    			<div ng-repeat="list in item.templates" ng-include="\'list2.html\'">
		    			</div>
	    			</div>
				</script> 
				<script type="text/ng-template" id="item2.html"> 
					<div ng-if="item.noinput==null"> 
						<label class="label-view">{{item.label}}</label> 
						<span ng-if="item.required==\'yes\'" class="required-field">*</span> 
						<br/> 
                        <span class="note-attr"  ng-show="item.note != ''">{{item.note}}</span>
						<div class="control-block"> 
							<html-render item="item" val="component"></html-render> 
						</div>
					</div>
					<div ng-if="item.noinput !=null"> 
						<h3 data-oid="{{item.id}}" ng-if="item.name==\'Header\'">{{item.label}}</h3> 
						<h5 data-oid="{{item.id}}" ng-if="item.name==\'Section\'">{{item.label}}</h5> 
						<span data-oid='{{item.id}}' ng-if='item.name == "StaticText"' class="static-text">{{item.label}}</span>
		                <br/>		
                        <center ng-if='item.name == "Header"'><span class="note-attr"  ng-show="item.note != ''">{{item.note}}</span></center>
                        <span ng-if='item.name == "Section"' class="note-attr"  ng-show="item.note != ''">{{item.note}}</span>
					</div>
				</script> 
				<div ng-repeat="(zone, list) in sharedData.models.dropzones" style="display:none" class="col-md-6 template-zone"> 
					<div id="form2" class="box box-grey centerarea" vocab="http://schema.org/" prefix="ov: http://personal.schema.example/"> 
						<div ng-include="\'list2.html\'" class="form-final" class='form-final' resource="currentForm" typeof="Thing"> 
						</div>
					</div>
				</div>`;
	    	funcHTML = "<h3>Import</h3>"+tempForm+
	    	`
	    		<div class='left-block'>
	    			<h5>Forms</h5> 
		    		<input id='fileSelection' file3 type='file' ng-model='formsInput' on-finish='alert()' multiple/> 
		    		<div ng-if='formsInput.length > 0'> 
			    		<button class='btn' ng-click='clearDoc()'>Clear</button> 
			    		<button class='btn' ng-click='analyse2()'>Import</button> 
		    		</div>
		    		<br/> 
		    		<span>{{formsInput.length}} Document(s) selected</span>
		    	</div>
		    	<div class='right-block'>
		    		<p ng-repeat='f in formsInput'>{{$index + 1}} - {{f.name}}</p> 
	    		</div> 
	    		<div ng-if='rdfaCurrent.length > 0'> 
		    		<h5>Mapping</h5> 
		    		<table class='table table-bordered'> 
		    			<thead>
		    				<tr>
		    					<th>Object \u2192 Instance \u2192 ID</th>
		    					<th>#Document \u2192 Object \u2192 Instance \u2192 ID</th>
		    				</tr>
		    			</thead>
		    			<tbody> 
		    				<tr ng-repeat='obj in rdfaCurrent'> 
		    					<td>
		    						<label>{{obj.field}}</label> 
		    					</td>
		    					<td> 
		    						<select class='form-control' ng-change='fill()' ng-model='obj.data'> 
		    							<option></option> 
		    							<option ng-repeat='option in rdfa' value='{{option}}'>{{option}}</option> 
		    						</select> 
		    					</td>
		    				</tr>
		    			</tbody> 
		    		</table> 
	    			<button id='b-fill' class='btn' ng-click='fill2()'>Fill</button> 
	    		</div>
    		</div>`;
	        break;
	    default:
	        break;
	}

	var dialogHTML = '<div id="overlay"><div id="window"><button id="exit">×</button>' + funcHTML + '</div></div>';
	var div = document.createElement("div");
	div.id = 'append';
	div.innerHTML = dialogHTML;

	    document.body.appendChild(div);

	    var dialog = document.getElementById('window');
	    dialog.style.width = "800px";
	    dialog.style.height = "500px";
	    dialog.style.overflow = "scroll"
	    dialog.style.resize = "both"

	    document.onkeydown = function(evt) {
		    evt = evt || window.event;
		    var isEscape = false;
		    if ("key" in evt) {
		        isEscape = evt.key == "Escape";
		    } else {
		        isEscape = evt.keyCode == 27;
		    }
		    if (isEscape && document.getElementById("overlay").style.visibility == "visible") {
		    	overlay();
		    }
		};

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
	            } else {
	            	overlay();
	            	if (private_key != null){
						document.getElementById('private_key').value = private_key
	            	}

	            	if (passphrase !=null){
	            		document.getElementById('passphrase').value = passphrase 
	            	}
	            	break;
	        	}
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


