# UI-Router-Breadcrumbs
[![Build Status](https://travis-ci.org/interval-braining/angular-ui-router-breadcrumbs.png?branch=master)](https://travis-ci.org/interval-braining/angular-ui-router-breadcrumbs)

UI-Router-Breadcrumbs provides a service and directive that allow for the
creation of navigational breadcrumbs that are flexible and ready for customization.

**Note:** *This library is under active development and is most definitely
subject to change.*

## Getting Started

**(1)** Get UI-Router-Breadcrumbs by cloning and building this repository:
```bash
git clone git@github.com:interval-braining/angular-ui-router-breadcrumbs.git
cd angular-ui-router-breadcrumbs
npm install
bower install
```

**(2)** Include `angular-ui-router-breadcrumbs.js` (or
`angular-ui-router-breadcrumbs.min.js`) with your javascripts, after including
Angular itself.

**(3)** Add `'ui.router.breadcrumbs'` to your main module's list of dependencies.

## Usage
UI-Router-Breadcrumbs is split into two components: A breadcrumbs service and
a simple breadcrumbs directive that's primary function is to make the breadcrumbs
service available to the directive's scope.

### Breadcrumbs Service
The breadcrumbs service handles traversing the ui-router state hierarchy to
build an array of breadcrumb data for common use. This is done by walking from
the current state on up the tree from state to parent state until a state is
reached that does not have a parent. It should be noted that this means that
breadcrumbs will not be available for all states, but only for those states
that are ancestors of the current state.

By default, the service examines the current and each ancestor state for a
`breadcrumb` attribute to process. If a breadcrumb attribute is present and it
is a string, the service assumes the string is the text for the breadcrumb and
stores an object with the text and the name of the associated state. If the
breadcrumb attribute is not a string, but some other object, the service stores
the given object as the data for the breadcrumb. If the breadcrumb attribute is
null or undefined, it is assumed the state has no breadcrumb.

To add a breadcrumb to a state, simply add a breadcrumb attribute to the state
object where it is defined. For example:
```javascript
  $stateProvider.state('a', {
    breadcrumb: 'State A',
    url: '/a',
  }).state('a.b', {
    breadcrumb: {
      class: 'alternate',
      stateName: 'a.b',
      text: 'State B',
    },
    url: '/b'
  });
```

This is more or less supported by UI-Router as UI-Router supports
[custom data](https://github.com/angular-ui/ui-router/wiki#wiki-attach-custom-data-to-state-objects),
though typically on a `data` attribute. Breadcrumbs are stored elsewhere because
nested states inherit custom data from parent states and this behavior is not
especially intuitive given this approach to breadcrumbs. For example, storing
breadcrumbs as part of a state's `data` attribute would require having to
explicitly define a null breadcrumb for some child states or else handle
duplicate breadcrumbs when a child state doesn't override the inherited breadcrumb.

#### Customization
During the configuration phase, the `breadcrumbsProvider` can be
configured to use a custom compiler to extract breadcrumb information from each
state in the current ancestory. A custom compiler function can be used by
passing the compiler function to `breadcrumbsProvider.compileWith()`. For
example, to create a custom compiler that expects a breadcrumbs function,
something like this might work:

```javascript
var yourApp = angular.module('yourApp', ['ui.router.breadcrumbs']);
yourApp.config(['breadcrumbsProvider', function(breadcrumbsProvider) {
  breadcrumbsProvider.compileWith(function(state) {
    return state.breadcrumbs && state.breadcrumbs();
  });
});
```

Though the example is contrived it should illustrate the flexibility of the
breadcrumbs service.

### Breadcrumbs Directive
The breadcrumbs directive is very simple and primarily serves to make the
breadcrumbs service available to the scope of the directive during the
prelinking phase. This allows for other directives, including ui-router
directives, to utilize the breadcrumbs data.

The breadcrumbs data can be used in templates by referencing breadcrumbs
on the scope. For example, a simple breadcrumbs control might look like:
```html
<ol breadcrumbs>
  <li ng-repeat="breadcrumb in breadcrumbs">
    <a ui-sref="{{breadcrumb.stateName}}">{{breadcrumb.text}}</a>
  </li>
</ol>
```

## Example
As a more full example, consider the following declaration of states:
```javascript
var app = angular.module('app', ['ui-router', 'ui-router-breadcrumbs']);

app.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('a', {
      breadcrumb: 'A',
      url: '/a'
    })
    .state('a.b', {
      breadcrumb: {
        class: 'highlight',
        text: 'AB',
        stateName: 'a.b'
      },
      url: '/b'
    })
    .state('a.b.c', {
      url: '/c'
    }),
    .state('a.b.c.d', {
      breadcrumb: 'ABCD',
      url: '/d'
    });
});
```

and this template:
```html
<ol breadcrumbs>
  <li ng-repeat="breadcrumb in breadcrumbs">
    <a ng-class="breadcrumb.class" ui-sref="{{breadcrumb.stateName}}">{{breadcrumb.text}}</a>
  <li>
</ol>
```

Given the default configuration, the state 'a.b.c.d' should compile a control something like:
```html
<ol breadcrumbs>
  <li ng-repeat="breadcrumb in breadcrumbs" class="ng-scope">
    <a ng-class="breadcrumb.class" ui-sref="a" class="ng-scope" href="#/a">A</a>
  </li>
  <li ng-repeat="breadcrumb in breadcrumbs" class="ng-scope">
    <a ng-class="breadcrumb.class" ui-sref="a.b" class="ng-scope highlight" href="#/a/b">AB</a>
  </li>
  <li ng-repeat="breadcrumb in breadcrumbs" class="ng-scope">
    <a ng-class="breadcrumb.class" ui-sref="a.b.c.d" class="ng-scope" href="#/a/b/c/d">ABCD</a>
  </li>
</ol>
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
