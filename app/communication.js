/**
 * Read the schema.org
 */
document.addEventListener('DOMContentLoaded', function() {
    try{

    var scope = angular.element(document.getElementById("SchemaCtr")).scope();
    scope.$apply(function() {
        if (localStorage.schemaorg)
            scope.updateSchema(localStorage.schemaorg);
        //if (localStorage.text)
            //scope.loadFromTab(localStorage.text);
    });
    } catch(err){} 


    try{
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        
        //download
        if (request.job.func == "save"){
        var scope = angular.element(document.getElementById("FunctionCtr")).scope();
            scope.$apply(function() {
                    scope.save(request.job.text);
            });        
        }

        //sign
        if (request.job.func == "sign"){
        var scope = angular.element(document.getElementById("FunctionCtr")).scope();
            scope.$apply(function() {
                scope.sign(request.job.text, request.job.private_key, request.job.passphrase);
            });        
        }
        //verify
        if (request.job.func == "verify"){
        var scope = angular.element(document.getElementById("FunctionCtr")).scope();
            scope.$apply(function() {
                scope.verify(request.job.text, request.job.public_key);
            });        
        }
      });
    } catch (err){
    }

});