/**
 * Read the schema.org
 */

document.addEventListener('DOMContentLoaded', function() {

    //read schema
    try{
        var scope = angular.element(document.getElementById("SchemaCtr")).scope();
        scope.$apply(function() {
            if (localStorage.schemaorg)
                scope.updateSchema(localStorage.schemaorg);
        });
    } catch(err){}


    try{
        var job = localStorage.job;
        var data = localStorage.data;

        if (job != "" && job != undefined){
            if (data != '' && data != undefined){
                var scope = angular.element(document.getElementById("SchemaCtr")).scope();
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

        localStorage.clear();
    } catch (err){
    }

});