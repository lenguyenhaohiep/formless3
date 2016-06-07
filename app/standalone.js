
var htmlButtons = 
`<a id="b-save" onclick="save()">Save</a>
<a id="b-import" onclick="run('import')">Import</a>
<a id="b-print" onclick="run('print')">Print/PDF</a>
<a id="b-sign" onclick="run('sign')">Lock</a>
`

var htmlButtonVerificaton = 
`<a id="b-verify" onclick="verify()">Open Verification Tool</a>`


var domain="https://rawgit.com/lenguyenhaohiep/formless3/master/"
//for dev
//var domain='/Volumes/DATA/dev/formless3/'


var formExJS = 
`<script src="`+domain+`assets/js/openpgp.js"></script>
<script src="`+domain+`app/portableform.js"></script>
<script src="`+domain+`assets/js/angular.js"></script>
<script src="`+domain+`assets/js/angular-route.js"></script>
<script src="`+domain+`app/lang_en.js"></script>
<script src="`+domain+`app/defaultvalue.js"></script>
<script src="`+domain+`app/controllers.js"></script>
<script src="`+domain+`app/directives.js"></script>
<script src="`+domain+`app/services.js"></script>
<script src="`+domain+`app/formlesscontrol.js"></script>
<script src="`+domain+`assets/js/beautify-html.js"></script>
<script src="`+domain+`assets/js/beautify.js"></script>
<script src="`+domain+`assets/js/beautify-css.js"></script>
<script src="`+domain+`assets/js/FileSaver.js"></script>
<script src="`+domain+`assets/js/angular-drag-and-drop-lists.js"></script>
<link rel="stylesheet" href="`+domain+`assets/css/portableform.css"/>`



var formCSS=
`.form-final h3,
.form-final h5,
.label-field,
a {
    font-weight: 700
}
.form-final,
a {
    box-shadow: 0 0 20px #d1d1d1;
    border: 1px solid #d1d1d1;
    width: 80px;
}
#a,
.form-final,
a {
    background-color: #fff
}
.form-final h3,
.form-final h5 {
    text-align: center;
    font-weight: 700
}
.form-final .required-field,
input:invalid {
    color: red
}
#form,
a,
input:valid {
    color: #000
}
#form{
	margin-top:20px;
}
a {
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 3px;
    border: none;
    background-color: #2b669a;
    color: white;
    height: 30px;
    min-width: 80px;
}
a:hover {
    cursor: pointer
}
body {
    background-color: #eee;
    font-family: Arial;
    font-size: 14px;
    color: #eee
}
label {
    display: inline;
    margin: 5px 0
}
.form-final {
    margin: 0 auto;
    padding: 20px;
    width: 700px
}
.form-final h3 {
    font-size: 20px;
    margin: 10px 0;
}
.form-final h5 {
    font-size: 16px;
    margin: 10px 0;
}
.form-final .form-control {
    width: 100%
}
.form-final .label-block {
    border: none;
    display: inline-block;
    height: 20px;
    width: 100px
}
.form-final .control-block {
    display: inline-block;
    width: 100%
}
.form-final ul {
    list-style: none;
    padding-left: 0
}
textarea:invalid,
input[type=text]:invalid,
input[type=date]:invalid,
input[type=email]:invalid,
input[type=number]:invalid {
    border: 1px solid red;
}
.image-line:hover {
    background: #f5f5f5
}
.image-line {
    min-height: 100px;
    overflow: hidden;
}
.image-line span {
    display: inline-block;
    margin: 10px;
    width: 100px;
    float: left;
}
.image-line button{
    float: right;
    margin: 10px;
}
.image-line img {
    width: 100%;
    height: 100%;
}
.note-sec, .note-attr{
	font-size: 12px;
	color: gray;
	font-style: italic
}
.static-text {
    text-align: justify;
    display: block;
}
input, textarea, select{
	font-family: inherit;
	font-size: inherit
}
input[type=text], input[type=number], input[type=email], input[type=date]{
	height: 20px;
}
.img-frame {
    resize: both;
    overflow: auto;
    margin: 10px;
    float: left;
    height: 100px;
    width: auto;
    max-width: 500px;
}
`

var formJS=
`function updateButtonEvent() {
    var e = document.querySelectorAll("button");
    for (i = 0; i < e.length; i++) "Remove" == e[i].textContent && e[i].addEventListener("click", function() {
        var e = confirm("Do you want to remove this file");
        1 == e && (parent2 = this.parentNode, parent1 = parent2.parentNode, parent1.removeChild(parent2), reset(parent1))
    })
}

function create_line_image(e, t, n) {
    var r = e.getAttribute("multiple"),
        a = e.parentNode;
    if (null == r) {
        var o = a.querySelectorAll("div");
        for (i = 0; i < o.length; i++) a.removeChild(o[i])
    }
    var frame = document.createElement("div")
    frame.className="img-frame"
    var u = document.createElement("img");
    u.setAttribute("property", e.getAttribute("data-tempproperty")), u.setAttribute("alt", ""), u.src = t, u.addEventListener("click", function() {
        window.open(this.src, "_blank")
    });
    frame.appendChild(u)
    var l = document.createElement("span");
    l.innerHTML = n;
    var d = document.createElement("button");
    d.innerHTML = "Remove", d.addEventListener("click", function() {
        var e = confirm("Do you want to remove this file");
        1 == e && (parent2 = this.parentNode, parent1 = parent2.parentNode, parent1.removeChild(parent2), reset(parent1))
    });

    var div = document.createElement('div');
    if (r != null) {
        div.className = 'image-line multiple';
        div.appendChild(l);        
    } else {
        div.className = 'image-line';        
    }
    div.appendChild(frame);
    div.appendChild(d);
    a.appendChild(div);
}

function reset(e) {
    var t = e.querySelectorAll("div");
    0 == t.length && (input = e.querySelector("input"), input.value = "")
}

function updateFileEvent() {
    var e = document.getElementsByClassName("fileupload");
    for (i = 0; i < e.length; i++) signature = e[i], signature.addEventListener("change", function() {
        var e = this,
            t = this.files;
        if (null != t)
            for (var n = 0; n < t.length; n++) {
                file = t[n];
                var i = file.name,
                    r = new FileReader;
                r.onload = function(t) {
                    create_line_image(e, t.target.result, i)
                }, r.readAsDataURL(file)
            }
    })
}

function updateImageEvent() {
    var e = document.getElementsByTagName("img");
    for (i = 0; i < e.length; i++) e[i].addEventListener("click", function() {
        window.open(this.src, "_blank")
    })
}

function save() {
    if (checkValidate() == true) {
        var e = document.getElementById("append");
        e && e.remove(), updateStateOfForm();
        var t = document.title + ".html",
            n = window.prompt("Please enter the file name", t);
        if (null != n && n !== !1) {
            if (n.indexOf('.html') == -1)
                n = n + ".html"
            c = document.documentElement.outerHTML
            c = c.replace(c.substring(c.indexOf("head")+5, c.indexOf("meta")-1),'')
            var i = document.getElementById("b-save");
            i.href = "data:Application/octet-stream," + encodeURIComponent(c), i.download = n
        }
    }
}

function disable(e) {
    1 == e.disable ? e.setAttribute("disable", "true") : e.removeAttribute("disable")
}

function updateStateOfForm() {
    var e = document.getElementById("form");
    if (null != e) {
        for (type = ["input", "textarea"], k = 0; k < type.length; k++)
            for (inputs = e.querySelectorAll(type[k]), i = 0; i < inputs.length; i++) input = inputs[i], "checkbox" == input.type || "radio" == input.type ? (input.checked ? (input.setAttribute("property", input.getAttribute("data-property2")), input.setAttribute("checked", "checked")) : (input.removeAttribute("property"), input.removeAttribute("checked")), disable(input)) : "textarea" == input.type ? (input.setAttribute("content", input.value), input.innerHTML = input.value) : "file" != input.type && (input.setAttribute("content", input.value), input.setAttribute("value", input.value));
        var t = document.getElementsByTagName("select");
        for (i = 0; i < t.length; i++) {
            for (select = t[i], j = 0; j < select.options.length; j++) select.options[j].removeAttribute("selected"); - 1 != select.selectedIndex && select.options[select.selectedIndex].setAttribute("selected", "selected"), disable(select)
        }
    }
}

function updateFunction() {
    var e = document.getElementById("b-sign"),
        t = document.getElementById("b-import"),
        n = document.getElementById("b-verify");
    (void 0 == window.openpgp || 0 == scriptFunctionLoaded) && (disableFunction(e, !0), disableFunction(t, !0), disableFunction(n, !0))
}

function run(e) {
    switch (e) {
        case "import":
            importData();
            break;
        case "sign":
            sign();
            break;
        case "verify":
            verify();
            break;
        case "print":
            printPage();
            break;
        case "normalsign":
            signByImage();
            break;
    }
}

function disableFunction(e, t) {
    if (void 0 != e) {
        e.disabled = t;
        var n = function() {
            alert("This feature is not supported in offline mode")
        };
        e.onclick = n
    }
}
var scriptFunctionLoaded = !1;
document.addEventListener("DOMContentLoaded", function() {
    updateFileEvent(), updateButtonEvent(), updateImageEvent(), updateFunction()
});

function checkValidate() {
    var e = document.getElementById("form-validate");
    if (0 == e.checkValidity()) {
        var t = confirm("The form has missing fields or invalid format fields, do you want to continue the process?"),
            i = document.getElementById("submit");
        return t ? !0 : (i.click(), !1)
    }
    return !0
}`

        