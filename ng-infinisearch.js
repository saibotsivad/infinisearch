/*

Reusable infinite or pageable scrolling.

  1) Inside your HTML, put ng-model fields like: <input type="text" ng-model="dataSearch.params.username">
  2) The search action is like (using ng-click here): <button type="button" ng-click="dataSearch.search()">Search</button>
  3) List of queried items is accessible like: <li ng-repeat='item in dataSearch.items'>
  4) To display a loading notification: <span ng-show='dataSearch.busy'>Loading data...</span>

Infinite scrolling:

  1) Uses the infinite scroll: http://binarymuse.github.io/ngInfiniteScroll/
  2) Parameters for the plugin are like:
    * infinite-scroll='dataSearch.loadMore()'
    * infinite-scroll-disabled='dataSearch.busy || !dataSearch.firstSearchRan'
    * infinite-scroll-distance='1'

Click to load (single page, not auto loading):

  1) The load next page button needs: ng-click="dataSearch.loadMore()"
  2) To hide "next" button while loading: ng-show='!dataSearch.busy'
  3) Don't use (or otherwise disable) infinite-scroll directive

Pagination (multi-page, not auto loading):

  There is a convenience method `loadPage` that will make pagination easier. It expects
  an integer offset, e.g. to go back two pages call `loadPage(-2)`. This will 
  2) Load a numbered page (simple offset*page number, 1-indexed), e.g.: ng-click="dataSearch.loadPage(-2)"

*/

var module = angular.module('infinisearch', ['infinite-scroll']);

module.factory('InfiniSearch', function($http) {
  var InfiniSearch = function(opts) {
    this.opts = opts;
    this.position = {
      start: 0,
      end: 0
    };
    this.items = [];
    this.busy = false;
    this.firstSearchRan = false;
  };

  InfiniSearch.prototype.queryData = function(page) {
    if (this.busy) return;
    this.busy = true;

    var current = {
      paginate: page,
      start: this.position.start,
      end: this.position.end
    }
    $http
      .get(
        typeof this.opts.url === 'function' ? this.opts.url(current) : this.opts.url,
        typeof this.opts.config === 'function' ? this.opts.config(current) : undefined)
      .success(function(data, status, headers, config) {
        if (page !== undefined) {
          this.items = [];
        }
        var output = [];
        if (typeof this.opts.success === 'function') {
          this.opts.success(current, function(result) {
            output.push(result);
          }, data, status, headers, config);
        } else {
          output = data;
        }
        for (var i = 0; i < output.length; i++) {
          this.items.push(output[i]);
        };
        if (page === undefined) {
          this.position.end = this.position.end + output.length;
        } else {
          this.position.end = this.position.end + output.length * page;
          this.position.start = this.position.start + output.length * page;
        }
        this.busy = false;
      }.bind(this))
      .error(function(data, status, headers, config) {
        if (typeof this.opts.error === 'function') {
          this.opts.error(params, data, status, headers, config);
        }
      });
  }

  InfiniSearch.prototype.loadMore = function() {
    this.queryData();
  };

  InfiniSearch.prototype.loadPage = function(page) {
    this.queryData(page);
  };

  InfiniSearch.prototype.search = function() {
    this.firstSearchRan = true;
    this.items = [];
    this.position.start = 0;
    this.position.end = 0;
    this.queryData();
  }

  return InfiniSearch;
})