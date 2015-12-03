mainApp.controller('SchemaCtr',['$scope', "schema", function($scope, schema){
  $scope.schema = schema; 

}]);

mainApp.service('schema', function(){
    var  schema = {};
    schema.json = null;
    schema.objects = [];
    schema.path = 'userdata/schemaorg.json';
    schema.test = [];

    schema.initialize = function(jsonString){
        schema.json = angular.fromJson(jsonString);
        angular.forEach(schema.json["types"], function(key,value){
            schema.objects.push(value);
        });
    }

    schema.findProperties = function(_class){
        if (schema.json["types"][_class] == null)
            return [];
        return schema.json["types"][_class]["properties"];
    }

    schema.getDescription = function(){
        
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