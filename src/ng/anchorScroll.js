'use strict';

/**
 * @ngdoc service
 * @name $anchorScroll
 * @kind function
 * @requires $window
 * @requires $location
 * @requires $rootScope
 *
 * @description
 * When called, it checks current value of `$location.hash()` and scrolls to the related element,
 * according to rules specified in
 * [Html5 spec](http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document).
 *
 * It also watches the `$location.hash()` and scrolls whenever it changes to match any anchor.
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.
 *
 * @example
   <example module="anchorScrollExample">
     <file name="index.html">
       <div id="scrollArea" ng-controller="ScrollController">
         <a ng-click="gotoBottom()">Go to bottom</a>
         <a id="bottom"></a> You're at the bottom!
       </div>
     </file>
     <file name="script.js">
       angular.module('anchorScrollExample', [])
         .controller('ScrollController', ['$scope', '$location', '$anchorScroll',
           function ($scope, $location, $anchorScroll) {
             $scope.gotoBottom = function() {
               // set the location.hash to the id of
               // the element you wish to scroll to.
               $location.hash('bottom');

               // call $anchorScroll()
               $anchorScroll();
             };
           }]);
     </file>
     <file name="style.css">
       #scrollArea {
         height: 350px;
         overflow: auto;
       }

       #bottom {
         display: block;
         margin-top: 2000px;
       }
     </file>
   </example>
 */
function $AnchorScrollProvider() {

  var DEFAULT_OFFSET = 0;

  var autoScrollingEnabled = true;
  var scrollOffsetGetter = function() { return DEFAULT_OFFSET; };

  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  this.setScrollOffset = function(newScrollOffset) {
    if (isFunction(newScrollOffset)) {
      scrollOffsetGetter = function() { return newScrollOffset(); };
    } else if (isNumber(newScrollOffset)) {
      scrollOffsetGetter = function() { return newScrollOffset; };
    }
  };

  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;

    // helper function to get first anchor from a NodeList
    // can't use filter.filter, as it accepts only instances of Array
    // and IE can't convert NodeList to an array using [].slice
    // TODO(vojta): use filter if we change it to accept lists as well
    function getFirstAnchor(list) {
      var result = null;
      forEach(list, function(element) {
        if (!result && nodeName_(element) === 'a') result = element;
      });
      return result;
    }

    function scrollTo(elem) {
      if (elem) {
        elem.scrollIntoView();
      } else {
        $window.scrollTo(0, 0);
      }

      var offset = scrollOffsetGetter();
      if (offset) {
        $window.scrollBy(0, -1 * offset);
      }
    }

    function scroll() {
      var hash = $location.hash(), elm;

      // empty hash, scroll to the top of the page
      if (!hash) scrollTo(null);

      // element with given id
      else if ((elm = document.getElementById(hash))) scrollTo(elm);

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);

      // no element and hash == 'top', scroll to the top of the page
      else if (hash === 'top') scrollTo(null);
    }

    // does not scroll when user clicks on anchor link that is currently on
    // (no url change, no $location.hash() change), browser native does scroll
    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction() {
          $rootScope.$evalAsync(scroll);
        });
    }

    return scroll;
  }];
}
