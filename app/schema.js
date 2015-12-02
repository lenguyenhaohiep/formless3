mainApp.controller('SchemaCtr',['$scope', "schema", function($scope, schema){
  $scope.schema = schema; 

}]);

mainApp.service('schema', function(){
    var  schema = {};
    schema.jsonText = null;
    schema.path = 'userdata/schemaorg.json';

    schema.initialize = function(jsonString){
        schema.jsonText = jsonString;
    }
    return schema;
});

mainApp.directive('file',["schema", function(schema){
    return {
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                scope.$apply(function(){
                  var reader = new FileReader();
                    reader.onload = function(){
                        scope.contentFile = reader.result;
                        schema.initialize(scope.contentFile);
                    }
                    reader.readAsText(file);
                });
            });
        }
    };
}]);