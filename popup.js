var tabs = [];
//read schema from json files
function readJsonSchema(){
	var url = chrome.extension.getURL("assets/schema/schemaorg.json"); // full url
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	  	localStorage.schemaorg = xhr.responseText;
	  }
	}
	xhr.send();
}


function display(func){
	chrome.tabs.getSelected(null, function(tab){ 
		var id = tab.id; 
		if (tabs.indexOf(id) == -1){
			tabs.push(id);
			executeScripts(id, [ 
		        { code: "var func = '"+ func +"'" },
		            { file :"assets/js/angular.js"},
				    { file :"assets/js/angular-route.js"},
		        	{ file :"app/communication.js"},    
				    { file :"app/controllers.js"},
				    { file :"app/directives.js"},
				    { file :"app/services.js"},
				    { file :"app/formlesscontrol.js"},
				    { file :"assets/js/ui-bootstrap-tpls-0.14.3.js"},
				    { file :"assets/js/xml2json.js"},
				    { file :"assets/js/openpgp.js"},
				    { file :"assets/js/FileSaver.js"},
				    { file :"assets/js/beautify-html.js"},
				    { file :"assets/js/beautify.js"},
				    { file :"assets/js/beautify-css.js"},
				    { file :"assets/js/angular-drag-and-drop-lists.js"},
				    { file :"assets/js/image.load.js"},
		       		{ file: "app/modal.function.js" }
			]);
		}

    }); 
    return;
}

function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}


document.addEventListener('DOMContentLoaded', function () {

	//New a template
	document.getElementById('func1').addEventListener('click', function(){ 
		readJsonSchema();
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
	});

	//New a form from a template
	document.getElementById('func2').addEventListener('click', function(){
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});
	});

	//Edit Template
	document.getElementById('func3').addEventListener('click', function(){
		readJsonSchema();
        chrome.tabs.create({url: chrome.extension.getURL('index.html')});
	});

	//Sign
	document.getElementById('func4').addEventListener('click', function(){ 
		display("sign");
	});
	
	//Verify
	document.getElementById('func5').addEventListener('click', function(){
		display("verify");
	});
	
	//Fill
	document.getElementById('func6').addEventListener('click', function(){
		readJsonSchema();
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
	});
	
	//Save - Download
	document.getElementById('func7').addEventListener('click', function(){
		display("save");
	});
})
