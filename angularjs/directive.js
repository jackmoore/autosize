;'use strict';
angular.module('textarea-autosize', []).directive('autosize', function factory() {
  return {
      restrict: 'A',
      compile: function(elem, attrs, transcludeFn) {
          return function link (scope, element, attrs) {
            element.autosize(scope.$eval(attrs.autosize));
          };
      }
  };
});