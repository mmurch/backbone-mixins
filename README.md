backbone-mixins
===============

All mixins currently depend on Brace (https://bitbucket.org/atlassian/backbone-brace) but could be adapted to
any mixin framework. They are currently being stored at `Backbone.mixins`.

**mixins.PrePostRenderMethod**

A mixin that implements your Backbone view's `render` method such
that it calls a `preRender` and a `postRender` method before its
render method, specified by the view's `renderMethod` property.

Example usage:

```js

var MyViewClass = Brace.View.extend({

    mixins: [ Backbone.mixins.PrePostRenderMethod ],

    renderMethod: 'mySpecialRenderStrategy',

    // typical behavior here could be to format your data for display
    preRender: function(){
        this.viewModel = {
            some: 'json',
            for: 'rendering
        };
    },

    // there are other mixins for boilerplate render methods (see below)
    // so most of the time specifying this will be unnecessary
    mySpecialRenderStrategy: function(){
        this.$el.html(this.template.render(this.viewModel));
    },

    // typical behavior here could be to cache some selections
    // for later use during events
    postRender: function(){
        this.$thatButton = this.$el.find('.ohTHATButton');
    }

});

```

**mixins.DisposableTreeNode**

This mixins makes expressing hierarchies (typically for views, but could be
used with any uniquely identifiable object) quite easy.
Calling dispose on a node will call dispose on all the children of the tree.
Children are kept track of such that you can dependably iterate through them
in the order in which they were added. Can be used with other mixins that provide
typical disposal behavior.

Example usage:

```js

var MyListView = Brace.View.extend({


});

```

**mixins.ListView**

A mixin that makes rendering listviews easier and faster.
This class aims to standardize the way views are added to the
DOM during render. This class will not instantiate subviews
for you.

***Dependencies***
-	mixins.DisposableTreeNode
-

***When to use***
If you have a view with any number of subviews that 
needs to be rendered often

***How to use***
If your view uses this mixin, do not specify a render method.
ListView's render method's behavior is specified by the value
of `renderStrategy` (defaults to `'byAppend'`). This render
behavior is surrounded by calls to `preRender` and `postRender`.
The render method operates on the children of the view, so 
use the `preRender` phase to set up those children if they
haven't been already.

A typical `preRender` for the `byAppend` strategy might look like this:
```js
preRender: function(){
	this.collection.each(function(model){
		this.addChild(
			new myModule.MySubView({
				model: model
			})
		);
	}, this);
}
```
Notice that it constructs the view instance with its model,
but it does not call the subview's render method. Leave
that up to the ListView. 

`postRender` is included for convenience. Typically it might
include jQuery selections to cache, or similar. 

Note: the byAppend strategy calls `DisposableTreeNode`'s 
`disposeChildren` during its preRender phase and `byAssign` does not.
