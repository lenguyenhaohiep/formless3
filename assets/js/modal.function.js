//display dialogs
var check = document.getElementById('append');
if (check)
    check.remove();
var funcHTML = "";
switch (func) {
    case "sign":
        funcHTML = "<h3>Sign</h3><div class='main'><h5>Private Key</h5><input id='file' type='file' /><textarea id='private_key' rows='15' class='form-control' placeholder='Enter your private key'></textarea><h5>Passphrase</h5><input id='passphrase' type='password' class='form-control' placeholder='Enter your passphrase'/><br/><button class='btn' id='sign'>Click to sign this form</button></div>"
        break;
    case "verify":
        funcHTML = "<h3>Verify</h3><div class='main'><h5>Public Key</h5><input id='file' type='file' /><textarea id='public_key' rows='15' class='form-control' placeholder='Enter the public key'></textarea><br/><button class='btn' id='verify'>Click to verify this form</button></div>"
        break;
    case "edit":        
        var check = document.getElementById('append');
        if (check)
            check.remove();
        localStorage.text = document.documentElement.outerHTML;
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
    inputFile.onchange = function(event){
        var files = event.target.files;
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function() {
            switch(func){
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

    //sign and verify
    switch (func) {
        case "sign":
            dialog.showModal();
            document.getElementById('sign').onclick = function() {
                private_key = document.getElementById('private_key').value;
                passphrase = document.getElementById('passphrase').value;
                if (private_key == '' || passphrase == '') {
                    alert("Please enter private key and passphrase");
                    return;
                }
                var check = document.getElementById('append');
                check.remove();

                var data= {func: func, private_key: private_key, passphrase: passphrase, text: document.documentElement.outerHTML};
                chrome.runtime.sendMessage({job: data}, function(response) {});
            };
            break;
        case "verify":
            dialog.showModal();
            document.getElementById('verify').onclick = function() {
                public_key = document.getElementById('public_key').value;
                if (public_key == '') {
                    alert("Please enter public key");
                    return;
                }
                var check = document.getElementById('append');
                check.remove();
                var data= {func: func, public_key: public_key, text: document.body.innerHTML};
                chrome.runtime.sendMessage({job: data}, function(response) {});

            }
            break;
        case "save":
            var data= {func: func, text: document.documentElement.outerHTML};

                    var substring = "-----BEGIN PGP SIGNED MESSAGE-----";
            if (data.text.indexOf(substring) != -1){
                data.text = document.body.innerHTML;
            }
            chrome.runtime.sendMessage({job: data}, function(response) {});
            break;
        default:
            break;
    }


} else {
    alert("This is not a valid form");
}