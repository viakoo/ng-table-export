(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('ngTableToCsv.config', [])
    .config(['$compileProvider', function ($compileProvider) {
      // allow data links
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
    }])
    .value('ngTableToCsv.config', {
      debug : true
    });

  // Modules
  angular.module('ngTableToCsv.directives', []);
  angular.module('ngTableToCsv',
    [
      'ngTableToCsv.config',
      'ngTableToCsv.directives'
    ]);

})(angular);

(function (angular) {
  'use strict';

  angular.module('ngTableToCsv.directives')
    .directive('exportCsv', ['$parse',
      function ($parse) {
        return {
          restrict : 'A',
          scope    : false,
          link     : function (scope, element, attrs) {
            var data = '';
            var separator = attrs.separator ? attrs.separator : ',';
            var csv = {
              data: {},
              stringify : function (str) {
                return '"' +
                  str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
                    .replace(/"/g, '""') + // replace quotes with double quotes
                  '"';
              },
              generate  : function() {
                data = '';
                var rows = element.find('tr');
                angular.forEach(rows, function (row, i) {
                  var tr = angular.element(row),
                    tds = tr.find('th'),
                    rowData = '';
                  if (tr.hasClass('ng-table-filters')) {
                    return;
                  }
                  if (tds.length === 0) {
                    tds = tr.find('td');
                  }
                  angular.forEach(tds, function (td, i) {
                    rowData += csv.stringify(angular.element(td).text()) + separator;
                    console.log(csv.stringify(angular.element(td).text()) + separator);
                  });
                  rowData = rowData.slice(0, rowData.length - 1); //remove last separator
                  data += rowData + '\n';
                });
              },
              generateAll  : function (items) {
                data = '';
                angular.forEach(items, function(item){
                  var rowData = '';
                  // fill data
                  angular.forEach(item, function(val){
                    rowData += val + separator;
                  });
                  rowData = rowData.slice(0, rowData.length - 1); //remove last separator
                  data += rowData + '\n';
                });
              },
              link      : function () {
                return 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
              }
            };
            $parse(attrs.exportCsv).assign(scope.$parent, csv);
          }
        };
      }
    ]);
})(angular);
