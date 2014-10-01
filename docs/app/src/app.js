angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngAnimate',
  'DocsController',
  'versionsData',
  'pagesData',
  'navData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'bootstrap',
  'ui.bootstrap.dropdown'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}])

.config(['$anchorScrollProvider', function($anchorScrollProvider) {
  var header;
  $anchorScrollProvider.setScrollOffset(function () {
    header = header || window.document.querySelector('header');
    if (!header) return 0;

    var style = window.getComputedStyle(header);
    return (style.position === 'fixed') ? header.offsetHeight : 0;
  });
}]);
