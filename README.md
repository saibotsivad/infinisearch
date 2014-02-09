infinisearch
============

Opinionated use of AngularJS and infinite-scroll to paginate
or infinite scroll arbitrary $http.get() sources.

See demos, but here's the basic gist of it all:

Specify inclusion in your module:

	var module = angular.module('demo-app', ['infinisearch']);

Include it inside your controller:

	module.controller('DemoController', function($scope, InfiniSearch) {

Create a new search like this (see below for details):

	$scope.search = new InfiniSearch({
		url: 'string or function(params)',
		config: function(params) {},
		success: function(params, append_cb, data, status, headers, config) {},
		error: function(params, data, status, headers, config) {}
	});

Then you can use things inside your HTML like `ng-repeat="item in search.items"`

The following describe the object elements for the InfiniSearch creation:

## url

Either pass in the URL endpoint of the API you are accessing, or a function
that will be called with the `params` object (see below). This function must
return a string, which is the generated URL endpoint.

## config

An optional parameter which can either be a function or an object. It is the
second parameter in the AngularJS `$http.get()` method. If it is a function,
it is passed the `params` object (see below).

## success

An optional parameter which can be used to modify the returning data. After
modifying the data, for each element to be added to the item list, send it
to the `append_cb` function. The `data` parameter is exactly the data returned
from the `success` function of the `$http.get()`.

## error

An optional parameter that is given the `error` parameters from `$http.get()`

## params

The `params` object is handed to every function as the first parameter, it contains
the following:

### paginate

If you use the `loadPage(N)` method of pagination, `N` is the value. Otherwise `undefined`.

### start

The index number of the first item in the list. If you are using infinite
scrolling, this will always be `0`. If you paginate to the third page, and
are loading 25 per page, `start` will be 50.

### end

Similarly, the index number of the last item in the last. If you are using
infinite scrolling, this will always be the number of items loaded. It you
paginate to the third page, and are loading 25 per page, `end` will be 75.

# Demo

Inside the `demo` folder you'll see several examples. They call `localhost` to
access a dummy JSON file, so to see this in action (using python, anyway):

* `git clone https://github.com/tobiaslabs/infinisearch.git`
* `cd infinisearch`
* `python -m SimpleHTTPServer`
* open `http://127.0.0.1:8000`