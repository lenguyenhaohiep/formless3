//display dialogs
var check = document.getElementById('window');
if (check)
    check.remove();
var funcHTML = "";
switch (func) {
    case "sign":
        funcHTML = "<h3>Sign</h3><div class='main'><h5>Private Key</h5><textarea id='private_key' rows='15' class='form-control' placeholder='Enter your private key'></textarea><h5>Passphrase</h5><input id='passphrase' type='password' class='form-control' placeholder='Enter your passphrase'/><br/><button class='btn' id='sign'>Click to sign this form</button></div>"
        break;
    case "verify":
        funcHTML = "<h3>Verify</h3><div class='main'><h5>Public Key</h5><textarea id='public_key' rows='15' class='form-control' placeholder='Enter the public key'></textarea><br/><button class='btn' id='verify'>Click to verify this form</button></div>"
        break;
    default:
        break;
}

var dialogHTML = '<dialog id="window"><button id="exit">Exit</button>' + funcHTML + '</dialog>';
var div = document.createElement("div");
div.innerHTML = dialogHTML;

check = document.getElementsByClassName('form-final');
if (check.length != 0) {
    document.getElementsByClassName('form-final')[0].appendChild(div);

    var dialog = document.getElementById('window');
    dialog.style.width = "500px";
    dialog.style.height = "500px";

    dialog.showModal();
    document.getElementById('exit').onclick = function() {
        dialog.close();
    };

    //sign and verify
    switch (func) {
        case "sign":
            document.getElementById('sign').onclick = function() {
                private_key = document.getElementById('private_key').value;
                passphrase = document.getElementById('passphrase').value;
                if (private_key == '' || passphrase == '') {
                    alert("Please enter private key and passphrase");
                    return;
                }
            };
            break;
        case "verify":
            document.getElementById('verify').onclick = function() {
                public_key = document.getElementById('public_key').value;
                if (public_key == '') {
                    alert("Please enter public key");
                    return;
                }

            }
            break;
        default:
            break;
    }


} else {
    alert("This is not a valid form");
}