/*

Reusable infinite or pageable scrolling.

  1) Inside your HTML, put ng-model fields like: <input type="text" ng-model="dataSearch.params.username">
  2) The search action is like (using ng-click here): <button type="button" ng-click="dataSearch.search()">Search</button>
  3) List of queried items is accessible like: <li ng-repeat='item in dataSearch.items'>
  4) To display a loading notification: <span ng-show='dataSearch.busy'>Loading data...</span>

Infinite scrolling:

  1) Uses the infinite scroll: http://binarymuse.github.io/ngInfiniteScroll/
  2) Parameters for the plugin are like:
    * infinite-scroll='dataSearch.loadNextPage()'
    * infinite-scroll-disabled='dataSearch.busy || !dataSearch.firstSearchRan'
    * infinite-scroll-distance='1'

Click to load (single page, not auto loading):

  1) The load next page button needs: ng-click="dataSearch.loadNextPage()"
  2) To hide "next" button while loading: ng-show='!dataSearch.busy'
  3) Don't use (or otherwise disable) infinite-scroll directive

Pagination (multi-page, not auto loading):

  1) Current page number is available with: {{dataSearch.page}}
  2) Load a numbered page (simple offset*page number, 1-indexed), e.g.: ng-click="dataSearch.loadPage(dataSearch.page - 2)"

*/

var module = angular.module('data-search', ['infinite-scroll']);

module.controller('DataSearchController', function($scope, DataSearch) {
  $scope.dataSearch = new DataSearch({
    url: 'http://127.0.0.1:8000/sample_datax.json', // path to server
    prepare: function(params) { // output is the second variable given to $http.get
      console.log(params)
      return {
        params: {
          key: 'auth key',
          offset: params.offset
        }
      }
    },
    output: function(item_count, data, append_cb) {
      for (var i = 0; i < data.length; i++) {
        data[i].count = item_count + i;
        append_cb(data[i]);
      }
    }
  });
});

module.factory('DataSearch', function($http) {
  var DataSearch = function(opts) {
    this.opts = opts;
    this.loaded = 0;
    this.items = [];
    this.busy = false;
    this.firstSearchRan = false;
  };

  DataSearch.prototype.queryData = function(page) {
    if (this.busy) return;
    this.busy = true;

    $http.get(
      this.opts.url,
      this.opts.prepare({
        paginate: page,
        loaded: this.loaded,
        items: this.items.length
    })).success(function(data) {
      var output = [];
      this.opts.output(this.loaded, data, function(result) {
        output.push(result);
      })
      for (var i = 0; i < output.length; i++) {
        this.items.push(output[i]);
        this.loaded++;
      };
      this.busy = false;
    }.bind(this));
  }

  DataSearch.prototype.loadNextPage = function() {
    this.queryData(1);
  };

  DataSearch.prototype.loadPage = function(page) {
    this.items = [];
    this.queryData(page);
  };

  DataSearch.prototype.search = function() {
    this.firstSearchRan = true;
    this.items = [];
    this.loaded = 0;
    this.queryData();
  }

  return DataSearch;
})