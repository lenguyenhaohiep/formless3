mainApp.controller('OWLSourceCtrl', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}]);

mainApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

mainApp.service('ontologyStructure', ["formModel", function(formModel){
  var ontologyStructure = {};
  ontologyStructure.path = 'userdata/structure.owl';
  ontologyStructure.structure = null;
  ontologyStructure.class = {};
  ontologyStructure.namespaces = {};
  ontologyStructure.relationship = {};


  ontologyStructure.update = function(data){
    ontologyStructure.structure = data;
  }

  ontologyStructure.analyze = function(){
    // Create x2js instance with default config
    var x2js = new X2JS();  
    // Parse XML String to JSON array
    var jsonObj = x2js.xml_str2json(this.structure);

    // Retrieve namespaces
    ontologyStructure.namespaces["xmlns"] = jsonObj["RDF"]["_xmlns"];
    ontologyStructure.namespaces["xmlns:rdfs"] = jsonObj["RDF"]["_xmlns:rdfs"];
    ontologyStructure.namespaces["xmlns:owl"] = jsonObj["RDF"]["_xmlns:owl"];
    ontologyStructure.namespaces["xmlns:xsd"] = jsonObj["RDF"]["_xmlns:xsd"];
    ontologyStructure.namespaces["xmlns:rdf"] = jsonObj["RDF"]["_xmlns:rdf"];
    ontologyStructure.namespaces["xml:base:rdf"] =  jsonObj["RDF"]["_xml:base"];

    // Retrieve classes
    angular.forEach(jsonObj["RDF"]["Class"],function(item){
      //get name of the class
      var str = item["_rdf:about"];
      str = str.substring(str.indexOf("#")+1, str.length);
      ontologyStructure.class[str] = {};
      if (item["subClassOf"] != null){
        //get name of the subclass
        var str2 = item["_rdf:about"];
        str2 = str2.substring(str2.indexOf("#")+1, str2.length);
        ontologyStructure.class[str2] = {};
        ontologyStructure.class[str]["subclass"] = str2;

      }
    });

    //Retrieve Properties
    angular.forEach(jsonObj["RDF"]["DatatypeProperty"],function(item){
      //get propertiesname
      var str = item["_rdf:about"];
      var property = str.substring(str.indexOf("#")+1, str.length);

      //get type
      str = item["range"]["_rdf:resource"];
      var type = str.substring(str.indexOf("#")+1, str.length);

      var domains = {};
      var _item;
      if (item["domain"] instanceof Array){
        _item = item["domain"];
      }
      else{
        _item = [];
        _item.push(item["domain"]);
      }
      angular.forEach(_item, function(domain){
          str = domain["_rdf:resource"];
          var _class=str.substring(str.indexOf("#")+1, str.length);
          ontologyStructure.class[_class][property] = type;  
      });
    });

    //Retrieve Relationship
    angular.forEach(jsonObj["RDF"]["ObjectProperty"],function(item){
      var str = item["domain"]["_rdf:resource"];
      var domain = str.substring(str.indexOf("#")+1, str.length);
      str = item["range"]["_rdf:resource"];
      var range = str.substring(str.indexOf("#")+1, str.length);
      str = item ["_rdf:about"];
      var relationship = str.substring(str.indexOf("#")+1, str.length);
      var temp = [];
      temp[range] = relationship;
      ontologyStructure.relationship[domain]= temp;
    });

    formModel.initialize(this);
  }

  return ontologyStructure;
}]);

mainApp.controller('SourceCtr',['$scope', "ontologyStructure", function($scope, ontologyStructure){
  $scope.ontologyStructure = ontologyStructure; 

}]);

mainApp.directive('file',["ontologyStructure", function(ontologyStructure){
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
                        ontologyStructure.update(scope.contentFile);
                        ontologyStructure.analyze();
                    }
                    reader.readAsText(file);
                });
            });
        }
    };
}]);