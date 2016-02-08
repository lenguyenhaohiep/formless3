/**
 * @file 
 * @author Hiep Le <lenguyenhaohiep@gmail.com>
 * @version 0.1
 */


/*
 * Directive for selecting file and assigning a file to model, excute the method on-finish after file loaded
 */
 mainApp.directive('file1', function() {
    return {
        restrict: 'EA',
        scope: {
            file: '=',
            onFinish: '&'
        },
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                var files = event.target.files;
                var file = files[0];
                scope.file = file;
                scope.$apply();

                //apply methoad when file loaded
                if (scope.onFinish != null)
                    scope.onFinish();
            });
        }
    };
});

/*
 * Directive for selecting only one file and assigning a file to model
 */
 mainApp.directive('file2', function() {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '='
        },
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                var files = event.target.files;
                var file = files[0];

                var reader = new FileReader();
                reader.onload = function() {
                    scope.ngModel = reader.result;
                    scope.$apply();
                }
                reader.readAsText(file);
            });
        }
    };
});


/*
 * Directive for selecting multiple files and assigning to model
 */
 mainApp.directive('file3', function() {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            onFinish: '&'
        },
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                var files = event.target.files;
                for (i=0; i < files.length; i++){
                    var file = files[i];

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.ngModel.push(e.target.result);
                        scope.$apply();
                    }
                    reader.readAsText(file);
                }
            });
        }
    };
});

/*
 * Directive for selecting images and assigning to model
 * ng-model: model to be assgined
 * type-mode: type of input file, it is equal to 1 means that we can have only one image file (case of signature)
 * it is equal 2 means that we can have multiple files (case of attached )
 */
 mainApp.directive('fileimage', function(){
    return{
        restrict: 'EA',
        scope: {
            ngModel: '=',
            typeMode: '='
        },
        link: function(scope, el, attrs){
          el.bind('change', function(event) {
            var files = event.target.files;files

            //Just validate only the first file if type-mode == 1
            if (scope.typeMode==1){
                files = [];
                files.push (event.target.files[0]);
            }
            readers = [];

            //Read files
            for (i=0; i < files.length; i++){
                file = files[i];
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (scope.typeMode == 1){
                        scope.ngModel = [];
                    }
                    scope.ngModel.push({src: e.target.result, name: file.name});
                    scope.$apply();
                }
                readers.push(reader);
                readers[i].readAsDataURL(file);
            }
        });   
      }
  }
})


/**
 * When we enter the mouse in every field/ container in the form, the "remove" button will appear and allow us delete current field/container
 */
 mainApp.directive('flitem', ['sharedData', function() {
    return {
        restrict: "EA",
        scope: {
            flitem: "@"        
        },
        link: function(scope, element, attr) {
            var delete_button = angular.element(element[0].querySelector('.item-fix'));


            //Upon mouse leaves
            element.on('mouseleave', function() {
                delete_button.css("display", "none");
            });

            //Upon mouse enters
            element.on('mouseenter', function() {
                delete_button.css("display", "block");
            });
        }
    }
}]);


/**
 * This directive is used to render code HTML from text to the page, this method is unsafe method, pay attention in use
 * This plugin aims to work only in the offline mode, so this method has no risk in this case
 */
 mainApp.directive('htmlRender', function($compile, $sce) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            item: '=',
            val: '@'
        },
        link: function(scope, element) {
            var value = scope.item[scope.val];
            if (!value) return;

            //Wrap in case text only so that the compile can work without error        
            var wrapper = angular.element('<div>');

            //Trusted HTML
            value = $sce.trustAsHtml(value);
            wrapper.html(value);
            var markup = $compile(wrapper.contents())(scope);
            element.append(markup)
        }
    }
});