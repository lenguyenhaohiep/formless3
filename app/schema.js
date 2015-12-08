mainApp.controller('SchemaCtr',['$scope', "schema", function($scope, schema){
  $scope.schema = schema; 
  $scope.$watch("schema.file",function(){
    schema.initialize();
  });
}]);

mainApp.service('schema', function(){
    var  schema = {};
    schema.file = null;
    schema.json = null;
    schema.objects = [];
    schema.path = 'userdata/schemaorg.json';
    schema.test = [];
    schema.tempFile = null;

    schema.initialize = function(){
        if (schema.file==null)
            return;
        var reader = new FileReader();
        reader.onload = function(){
            schema.json = angular.fromJson(reader.result);
            angular.forEach(schema.json["types"], function(key,value){
                schema.objects.push(value);
            });
        }
        reader.readAsText(schema.file);
    }

    schema.findProperties = function(_class){
        if (schema.json["types"][_class] == null)
            return [];
        return schema.json["types"][_class]["properties"];
    }

    schema.getType = function (type){
        if (schema.json["types"][type] == null)
            return "ov:"+type;
        return type;

    }

    schema.getProp = function (prop){
        alert(prop);
        if (schema.json["properties"][prop] == null)
            return "ov:"+prop;
        return prop;

    }

    return schema;
});

mainApp.directive('file',function(schema){
    return {
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                //scope.file = file ? file.name : undefined;
                scope.file = file;
                scope.$apply();
            });
        }
    };
});