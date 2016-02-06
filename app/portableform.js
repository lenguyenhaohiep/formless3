scriptFunctionLoaded = true;

function sign () {
	alert('sign');
}

function verify() {
	alert('verify');
}

function importData(){

}


/*
 * We want to use code from AngularJS, so we have to create a temporature controller 
 * Because this the form after generated, it no longer works properly with the code in the view 
 * But we need to use some method in the controller
 * @return Scope of FunctionCtr
 */
function getController() {
    var div = document.createElement('div');
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
	var funcHTML = "";
	switch (func) {
	    case "sign":
	        funcHTML = "<h3>Sign</h3><div class='main'><h5>Private Key</h5><input id='file' type='file' /><textarea id='private_key' rows='15' class='form-control' placeholder='Enter your private key'></textarea><h5>Passphrase</h5><input id='passphrase' type='password' class='form-control' placeholder='Enter your passphrase'/><br/><button class='btn' id='sign'>Click to sign this form</button></div>"
	        break;
	    case "verify":
	        funcHTML = "<h3>Verify</h3><div class='main'><h5>Public Key</h5><input id='file' type='file' /><textarea id='public_key' rows='15' class='form-control' placeholder='Enter the public key'></textarea><br/><button class='btn' id='verify'>Click to verify this form</button></div>"
	        break;
	    case "edit":
	        resetOriginal();
	        localStorage.currentForm = document.documentElement.outerHTML;
	        break;
	    default:
	        break;
	}

	var dialogHTML = '<dialog id="window"><button id="exit">Exit</button>' + funcHTML + '</dialog>';
	var div = document.createElement("div");
	div.id = 'append';
	div.innerHTML = dialogHTML;

	check = document.getElementsByClassName('form-final');
	if (check.length != 0) {
	    document.getElementsByClassName('form-final')[0].appendChild(div);

	    var dialog = document.getElementById('window');
	    dialog.style.width = "500px";
	    dialog.style.height = "500px";

	    document.getElementById('exit').onclick = function() {
	        dialog.close();
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
	            dialog.showModal();
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
	                });    
	            };
	            break;
	        case "verify":
	            if (!checkSigned(document.body.innerHTML)) {
	                alert(ERROR2_MESSAGE);
	                break;
	            }
	            dialog.showModal();
	            document.getElementById('verify').onclick = function() {
	                public_key = document.getElementById('public_key').value;
	                if (public_key == '') {
	                    alert(KEY2_CONFIRM);
	                    return;
	                }

	                resetOriginal();

	                text = fixHtml(document.body.innerHTML);

	                scope.$apply(function() {
	                    scope.verify(text, public_key);
	                });   
	            }
	            break;
	        case "save":
	            resetOriginal();
	            text = document.documentElement.outerHTML;

	            if (checkSigned(text)) {
	                text = fixHtml(document.body.innerHTML);
	            } else{
	                updateStateOfForm();
	                text = document.documentElement.outerHTML;
	            }
	            scope.$apply(function() {
	                scope.save(text);
	            });   
	            break;
	        case "edit":
	            if (checkSigned(document.body.outerHTML)) {
	                alert(MODIFY_MESSAGE);
	                break;
	            }
	            chrome.runtime.sendMessage({job: 'edit', data: document.documentElement.outerHTML});
	            window.open(domain,'_blank');
	            break;

	        case "reset":
	            if (checkSigned(document.body.outerHTML)) {
	                alert(MODIFY_MESSAGE);
	                break;
	            }
	            chrome.runtime.sendMessage({job: 'reset', data: document.documentElement.outerHTML});
	            window.open(domain,'_blank');
	            break;

	        case "fill":
	            if (checkSigned(document.body.outerHTML)) {
	                alert(MODIFY_MESSAGE);
	                break;
	            }
	            chrome.runtime.sendMessage({job: 'fill', data: document.documentElement.outerHTML});
	            window.open(domain,'_blank');
	            break;

	        default:
	            break;
	    }
	}
}


