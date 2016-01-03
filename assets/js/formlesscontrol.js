    /*
     * Add an image after the button
     */
    function create_line_image(object, source, name){
        var multiple = object.getAttribute('multiple');
        var parentNode = object.parentNode;

        if (multiple == null){
            var divs = parentNode.querySelectorAll('div');
            for (i=0; i <divs.length; i++){
                parentNode.removeChild(divs[i]);
            }
        }
        
        var image = document.createElement('img');
        image.setAttribute("property", object.getAttribute("tempproperty"));
        image.setAttribute('ng-init', 'itemload()');
        image.src = source;
        image.addEventListener('click', function(){
            window.open(this.src,'_blank');
        });
        
        var span = document.createElement('span');
        span.innerHTML = name;

        var button = document.createElement('button');
        button.innerHTML = 'Remove';
        button.addEventListener('click', function(){
            var r = confirm('Do you want to remove this file');
            if (r == true) {
                parent2=this.parentNode;
                parent1=parent2.parentNode;
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
    function reset(object){
        var divs = object.querySelectorAll('div');
        if (divs.length == 0){
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
            signature.disabled = false;
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

        for (i=0 ;i< inputs; i++){
            input = inputs[i];
            if (input.type == "text"){
                input.addEventListener('change', function(){
                    this.setAttribute('value',this.value);
                })
            }
        }
    }


    document.addEventListener('DOMContentLoaded', function () {

    });

    function updateStateOfForm(){
        var inputs = document.getElementById('export').querySelectorAll('input');
        texts = ['text', 'email', 'number'];
        choices = ['radio','checkbox'];
        for (i=0 ;i < inputs.length; i++){
            input = inputs[i];
 
            if (input.type == "radio"){
                    radios = document.getElementsByName(input.name);
                    for (j=0; j< radios.length; j++){
                        if (radios[j].checked){
                            radios[j].setAttribute("checked", "checked");
                        }
                        else{
                            radios[j].removeAttribute("checked");
                        }
                    }                        
            }

            if (input.type == "checkbox"){
                    if (input.checked){
                        //input.setAttribute("property", input.getAttribute('_property'));
                        //input.removeAttribute('_property');
                        input.setAttribute("checked", "checked");
                    }
                    else{
                        //input.setAttribute("_property", input.getAttribute('property'));
                        //input.removeAttribute('property');
                        input.removeAttribute("checked");
                    }
            }
        }

        var selects = document.getElementsByTagName('select');
        for (i=0; i<selects.length; i++){
            select = selects[i];
                for (j=0; j<select.options.length; j++){
                    select.options[j].removeAttribute("selected");
                }
                select.options[select.selectedIndex].setAttribute("selected","selected");
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

     function disableAll(id, bool){
        var div = document.getElementById(id);
        var controls = ['input', 'button', 'select', 'textarea'];
        for (k=0; k<controls.length; k++){
            var inputs = div.querySelectorAll(controls[k]);

            for (i=0; i<inputs.length; i++){
                if (inputs[i].className.indexOf('input-transparent') == -1)
                    inputs[i].disabled = bool;
            }
        }
     }
