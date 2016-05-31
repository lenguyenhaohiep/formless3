
function hashFunction(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * @file 
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

function cleanHTML(dom){
    var invalidAttrs = ['ng-repeat', 'ng-include','ng-if','ng-model','ng-repeat-start','ng-repeat-end','ng-click','ng-value','ng-model','ng-show','ng-options','dnd-list','item','fileimage','type-mode', 'val', 'data', 'ng-class'];
    if (dom.attributes == undefined) return;

    var atts = [];
    for (var i = 0; i < dom.attributes.length; i++){
        atts.push(dom.attributes[i]);
    }

    for (var i = 0; i < atts.length ; i++){
        var att = atts[i].nodeName;

        //case of required
        var tag = "ng-required"
        if (att == tag){
            var val = dom.getAttribute(tag);
            dom.removeAttribute(tag);
            if (val == 'yes')
                dom.setAttribute("required", true);
        }

        for (var j=0; j < invalidAttrs.length; j++){
            if (att == invalidAttrs[j]){
                dom.removeAttribute(att);
                break;
            }
        }
    }
    for (var k=0; k < dom.childNodes.length; k++)
        cleanHTML(dom.childNodes[k]);
}

function clearComment(html){
    pattern = /<!--((?!-->).)*-->(\\n)*/
    res = html
    while (res.search(pattern) != -1){
        res = res.replace(pattern,'')
    }
    return res
}


function findByXpath(html, listXpath){
    for (i=0; i < listXpath.length; i++){
        result = html.evaluate(listXpath[i], html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        li = result.iterateNext();
        if (li) {
            return html.evaluate(listXpath[i], html, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        }
    }
    return result;
}

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
    if (doc == null || doc == undefined)
        div = document.getElementById(id);
    else
        div = doc.getElementById(id);

    if (div == null || div == undefined)
        return;

    var controls = ['input', 'button', 'select', 'textarea'];
    for (k = 0; k < controls.length; k++) {
        var inputs = div.querySelectorAll(controls[k]);

        for (i=0; i<inputs.length; i++){
            if (inputs[i].className.indexOf('input-transparent') == -1){
                if (bool == true )
                    inputs[i].setAttribute("disabled", '');
                else
                    inputs[i].removeAttribute("disabled");
            }
        }
    }
}