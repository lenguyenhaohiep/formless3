document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('func1').addEventListener('click', function(){ 
		chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
	});

	document.getElementById('func2').addEventListener('click', function(){
		var url = chrome.extension.getURL("app/userdata/schemaorg.json"); // full url

			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				chrome.runtime.sendMessage({json: xhr.responseText}, function(response) {});
				chrome.tabs.create({url: chrome.extension.getURL('index.html')});	
			  }
			}
			xhr.send();
	});
	document.getElementById('func3').addEventListener('click', function(){ alert('function3'); });
	document.getElementById('func4').addEventListener('click', function(){ alert('function4'); });
	document.getElementById('func5').addEventListener('click', function(){ alert('function5'); });
	document.getElementById('func6').addEventListener('click', function(){ alert('function6'); });
})
