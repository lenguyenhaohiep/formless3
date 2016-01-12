/*
 * This method is used to fix the html to the right format because when we signed a form
 * we sign a whole html page, so the signature is outside <html> tag, but when it is display
 * browser change its structure to be readable, so it changes the content and we never verify sucessfully it,
 * so we need some modification to verify it
 * 
 * @param html: text of html form
 * @return html text fixed
 */
function fixHtml(html) {
    s1 = '\n-----BEGIN PGP SIGNATURE-----';
    s2 = '</html>\n-----BEGIN PGP SIGNATURE-----';
    p1 = html.indexOf(s1);
    html = html.replace(s1, s2);

    s1 = '\n\n\n    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
    s2 = '<html>\n\n<head>\n    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
    html = html.replace(s1, s2);

    s1 = '\n\n\n\n    <div id="form" class="box box-grey centerarea" style="color: black;">';
    s2 = '\n</head>\n\n<body>\n    <div id="form" class="box box-grey centerarea">';
    html = html.replace(s1, s2);

    s1 = '    </div>\n\n<script type="text/javascript">';
    s2 = '    </div>\n</body>\n<script type="text/javascript">';
    html = html.replace(s1, s2);

    s1 = '-----BEGIN PGP SIGNED MESSAGE-----';
    s2 = '\n-----BEGIN PGP SIGNED MESSAGE-----';
    html = html.replace(s1, s2);
    return html;
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
                alert("Cannot sign a signed form");
                break;
            }
            dialog.showModal();
            document.getElementById('sign').onclick = function() {
                private_key = document.getElementById('private_key').value;
                passphrase = document.getElementById('passphrase').value;
                if (private_key == '' || passphrase == '') {
                    alert("Please enter private key and passphrase");
                    return;
                }

                resetOriginal();

                text = document.documentElement.outerHTML;

                scope.$apply(function() {
                    scope.sign(text, private_key, passphrase);
                });    
            };
            break;
        case "verify":
            if (!checkSigned(document.body.innerHTML)) {
                alert("Cannot verify unsigned form");
                break;
            }
            dialog.showModal();
            document.getElementById('verify').onclick = function() {
                public_key = document.getElementById('public_key').value;
                if (public_key == '') {
                    alert("Please enter public key");
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
            }

            scope.$apply(function() {
                scope.save(text);
            });   
            break;
        case "edit":
            chrome.runtime.sendMessage({job: 'edit', data: document.documentElement.outerHTML});
            window.open(domain,'_blank');
            break;

        case "reset":
            chrome.runtime.sendMessage({job: 'reset', data: document.documentElement.outerHTML});
            window.open(domain,'_blank');
            break;

        case "fill":
            chrome.runtime.sendMessage({job: 'fill', data: document.documentElement.outerHTML});
            window.open(domain,'_blank');
            break;

        default:
            break;
    }


} else {
    alert("This is not a valid form");
}