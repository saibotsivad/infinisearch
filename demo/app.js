var module = angular.module('demo-app', ['data-search']);

module.controller('DemoController', function($scope, DataSearch) {
  $scope.queryParams = {};
  var page_size = 15;
  $scope.dataSearch = new DataSearch({
    // to demo, run the following in the main directory (not the demo directory): python -m SimpleHTTPServer
    url: 'http://127.0.0.1:8000/demo/sample_data.json',
    prepare: function(params) {
      var query_params = {
        opts: {
          auth: 'secret key',
          q: $scope.queryParams,
          page: {
            start: params.paginate === undefined ? 0 : params.end,
            end: params.paginate === undefined ? page_size : params.end + page_size
          }
        }
      }
      console.log(query_params);
      return query_params;
    },
    success: function(params, data, append_cb) { // optional (if not present, returned data must be an array and all elements will be appended)
      var count = params.paginate !== undefined && params.paginate < 0 ? params.start - page_size : params.end;
      for (var i = 0; i < data.length; i++) {
        data[i].count = count + i + 1;
        append_cb(data[i]);
      }
    }
  });
});
