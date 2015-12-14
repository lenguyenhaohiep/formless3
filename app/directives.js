mainApp.directive('file1', function(schema) {
    return {
        restrict: 'EA',
        scope: {
            file: '='
        },
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                var files = event.target.files;
                var file = files[0];
                scope.file = file;
                scope.$apply();
            });
        }
    };
});

mainApp.directive('file2', function(schema) {
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

/**
 * When we enter the mouse in every field/ container in the form, the "remove" button will appear and allow us delete current field/container
 */
mainApp.directive('flitem', ['sharedData', function(sharedData) {
    return {
        restrict: "A",
        scope: {
            "flitem": "@"
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

            //            element.on('click', function(ev){
            //                alert(sharedData.models.selected);
            //            });
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