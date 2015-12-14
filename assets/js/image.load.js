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
}


document.addEventListener('DOMContentLoaded', function () {
    updateFileEvent();
});

/*
 * diable/enable upload file
 */

 function disableFile(bool) {
    var signatures = document.getElementsByClassName('fileupload');
    for (i = 0; i < signatures.length; i++) {
        signatures[i].disabled = bool;
    }
}
