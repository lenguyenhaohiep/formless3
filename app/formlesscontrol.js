/**
 * @file 
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

/*
 * Find the similarity between 2 strings
 * 
 * @param {string} s1 String1
 * @param {String} s2 String2
 * @return 
 */
function checkSimilarity(s1, s2){
    count = 0;
    minLength = s1.length > s2.length ? s2.length : s1.length;
    for (i=0; i<minLength; i++){
        if (s1.charAt(i) == s2.charAt(i))
            count++;
        else
            return count;
    }

    return count;
}

/*
 * Sort an array in descending order
 * 
 * @param {array} list The list
 * @return 
 */
function bubbleSort(list){
    for (i=0; i<list.length-1; i++){
        for (j=i+1; j<list.length; j++){
            if (list[i].field.length < list[j].field.length){
                var temp = list[i];
                list[i]=list[j];
                list[j]=temp;
            }
        }
    }
}

function autoIncreaseSize(){
    var elmnt = document.getElementById("export");
    var scrollHeight = elmnt.scrollHeight;
    var divHeight = elmnt.offsetHeight;
    var scrollerEndPoint = scrollHeight - divHeight;

    var divScrollerTop =  elmnt.scrollTop;

    if(divScrollerTop === scrollerEndPoint){
        var elmnt2 = document.getElementById("form");
        h = (elmnt2.offsetHeight + 200);
        elmnt2.style.height = h + "px";
    }
}


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
    image.setAttribute("property", object.getAttribute("tempproperty"));
    image.setAttribute('ng-init', 'itemload()');
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
    div.className = 'image-line';
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

function disable(tag) {
    if (tag.disable == true)
        tag.setAttribute('disable', 'true');
    else
        tag.removeAttribute('disable');
}

function updateStateOfForm() {
    var doc = document.getElementById('form');

    if (doc == null)
        return;

    type = ['input', 'textarea'];
    for (k = 0; k < type.length; k++) {
        inputs = doc.querySelectorAll(type[k]);
        for (i = 0; i < inputs.length; i++) {
            input = inputs[i];
            if (input.type == "checkbox" || input.type == "radio") {
                if (input.checked) {
                    input.setAttribute("property", input.getAttribute('property2'));
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
                input.setAttribute('content', input.value);
                input.setAttribute('value', input.value);
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

/*
 * diable/enable upload file
 */

function disableFile(bool) {
    var signatures = document.getElementsByClassName('fileupload');
    for (i = 0; i < signatures.length; i++) {
        signatures[i].disabled = bool;
    }
}


/*
 * Disable all form components
 */
function disableAll(id, bool, doc) {
    if (doc == null)
        div = document.getElementById(id);
    else
        div = doc.getElementById(id);

    var controls = ['input', 'button', 'select', 'textarea'];
    for (k = 0; k < controls.length; k++) {
        var inputs = div.querySelectorAll(controls[k]);

        for (i=0; i<inputs.length; i++){
            if (inputs[i].className.indexOf('input-transparent') == -1){
                if (bool == true )
                    inputs[i].setAttribute("disabled", bool);
                else
                    inputs[i].removeAttribute("disabled");
            }
        }
    }
}