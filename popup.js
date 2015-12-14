//read schema from json files
function readJsonSchema(){
		var url = chrome.extension.getURL("app/userdata/schemaorg.json"); // full url
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
			  	localStorage.schemaorg = xhr.responseText;
				//chrome.runtime.sendMessage({json: xhr.responseText}, function(response) {});
			  }
			}
			xhr.send();
}

function display(func){
	chrome.tabs.executeScript(null, {
		    code: 'var func = "'+ func +'"'
		}, function() {
		    chrome.tabs.executeScript(null, {file: "assets/js/modal.function.js"});
		});

		window.close();
}


document.addEventListener('DOMContentLoaded', function () {

	//New a template
	document.getElementById('func1').addEventListener('click', function(){ 
		readJsonSchema();
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
	});

	//New a form from a template
	document.getElementById('func2').addEventListener('click', function(){
		readJsonSchema();
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
		display("verify")
	});
	
	//Fill
	document.getElementById('func6').addEventListener('click', function(){
		readJsonSchema();
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
	});
	
	//Save - Download
	document.getElementById('func7').addEventListener('click', function(){

	});
})
