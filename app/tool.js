/*
 * Add an image after the button
 */
function create_line_image(object, source, name) {
    var multiple = object.getAttribute('multiple');
    var parentNode = object.parentNode;

    if (multiple == null) {
        var divs = parentNode.querySelectorAll('div');
        for (i = 0; i < divs.length; i++) {
            parentNode.removeChild(divs[i]);
        }
    }

    var image = document.createElement('img');
    image.setAttribute("property", object.getAttribute("data-tempproperty"));
    image.setAttribute('alt', '');
    image.src = source;
    image.addEventListener('click', function() {
        window.open(this.src, '_blank');
    });

    var span = document.createElement('span');
    span.innerHTML = name;

    var button = document.createElement('button');
    button.innerHTML = 'Remove';
    button.addEventListener('click', function() {
        var r = confirm('Do you want to remove this file');
        if (r == true) {
            parent2 = this.parentNode;
            parent1 = parent2.parentNode;
            parent1.removeChild(parent2);
            reset(parent1);
        }
    });

    var div = document.createElement('div');
    if (multiple != null) {
        div.className = 'image-line multiple';        
    } else {
        div.className = 'image-line';        
    }
    div.appendChild(span);
    div.appendChild(image);
    div.appendChild(button);

    parentNode.appendChild(div);
}


/*
 * Reset when there is no image
 */
function reset(object) {
    var divs = object.querySelectorAll('div');
    if (divs.length == 0) {
        input = object.querySelector('input');
        if (input != undefined)
            input.value = '';
    }
}


/*
 * Add a trigger to upload file
 */
function updateFileEvent() {
    var signatures = document.getElementsByClassName('fileupload');
    for (i = 0; i < signatures.length; i++) {
        signature = signatures[i];
        //signature.disabled = false;
        signature.addEventListener('change', function() {
            var object = this;
            var files = this.files;
            if (files == null) return;
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                var name = file.name;
                var reader = new FileReader();
                reader.onload = function(e) {
                    create_line_image(object, e.target.result, name);
                }
                reader.readAsDataURL(file);
            }
        });
    }

    //updateFileEvent();
    var inputs = document.getElementsByClassName('input');

    for (i = 0; i < inputs; i++) {
        input = inputs[i];
        if (input.type == "text") {
            input.addEventListener('change', function() {
                this.setAttribute('value', this.value);
            })
        }
    }
}

// function disable(tag) {
//     if (tag.disable == true)
//         tag.setAttribute('disable', 'true');
//     else
//         tag.removeAttribute('disable');
// }

function updateStateOfForm(id) {
    if (id == null)
        id = 'form';
    var doc = document.getElementById(id);

    if (doc == null)
        return;

    type = ['input', 'textarea'];
    for (k = 0; k < type.length; k++) {
        inputs = doc.querySelectorAll(type[k]);
        for (i = 0; i < inputs.length; i++) {
            input = inputs[i];
            if (input.type == "checkbox" || input.type == "radio") {
                if (input.checked) {
                    input.setAttribute("property", input.getAttribute('data-property2'));
                    input.setAttribute("checked", "checked");
                } else {
                    input.removeAttribute('property');
                    input.removeAttribute("checked");
                }
                disable(input);
            } else if (input.type == 'textarea'){
                input.setAttribute('content', input.value);
                input.innerHTML = input.value;
            } 
            else 
            {
                if (input.type != 'file'){
                    input.setAttribute('content', input.value);
                    input.setAttribute('value', input.value);
                }
            }
        }
    }

    var selects = document.getElementsByTagName('select');
    for (i = 0; i < selects.length; i++) {
        select = selects[i];
        for (j = 0; j < select.options.length; j++) {
            select.options[j].removeAttribute("selected");
        }
        if (select.selectedIndex != -1)
            select.options[select.selectedIndex].setAttribute("selected", "selected");
        disable(select);
    }
}