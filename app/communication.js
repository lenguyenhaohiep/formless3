/**
 * @file File working with Chrome Extension 
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */

/**
 * When working as the chrome without running index.html, the current tab will store data and request to localStorage 
 * and then injtects this file to handle the request. The chrome extension also read the schemaorg.json file and store to localStorage
 * so that if there is the schema in localStorage, it won't load again 
 */

 document.addEventListener('DOMContentLoaded', function() {

    //load and read schema and call the conresponding function 
    try{
        var scope = angular.element(document.getElementById("SchemaCtr")).scope();
        scope.$apply(function() {
            if (localStorage.schemaorg != undefined && localStorage.schemaorg != ''){
                scope.updateSchema(localStorage.schemaorg);
            }
        });
    } catch(err){}


    try{
        /*
         * job is the request (edit, reset, fill) and data is the current tab html in the chrome browser
         * Only support some functions (edit, reset, fill)
         */
        var job = localStorage.job;
        var data = localStorage.data;

        if (job != "" && job != undefined){
            if (data != '' && data != undefined){
                var scope = angular.element(document.getElementById("FunctionCtr")).scope();
                switch (job){
                    case 'edit':
                        scope.selectMenu('Design view');
                        scope.sharedData.parseForm(data);
                        break;
                    case 'reset':
                        scope.selectMenu('Edit view');
                        scope.sharedData.parseForm(data);
                        break;
                    case 'fill':
                        scope.selectMenu('Fill');
                        scope.sharedData.parseForm(data);
                        break;
                    default: 
                        break;
                }
            }
        }

         /*
         * after finish the request, we detroy job and data because localStorage is available in the same domain
         * if not, every tab in the same do main will access the same job and data
         */       
        var temp = localStorage.schemaorg;
        localStorage.clear();
        if (temp != undefined)
            localStorage.schemaorg = temp;
    } catch (err){
    }

});