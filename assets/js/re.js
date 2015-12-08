try{
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {

	  	var scope = angular.element(document.getElementById("SchemaCtr")).scope();
	    scope.$apply(function(){
	        scope.updateSchema(request.json);
	    });

	});
}catch(err){
	
}