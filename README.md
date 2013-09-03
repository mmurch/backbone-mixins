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
            for: 'rendering'
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

Example (obviously unrealistic) usage:

```js

var MyListView = Brace.View.extend({
    mixins: [ Backbone.mixins.DisposableTreeNode ],
    render: function(){
        var subView = new MyItemView();

        this.addChild(subView);

        this.$el.append(subView.render().el);
    },

    // other mixins can provide this boilerplate view disposal behavior
    onDispose: function(){
        this.unbind();
        this.remove();
    }
});

var MyItemView = Brace.View.extend({
    mixins: [ Backbone.mixins.DisposableTreeNode ],
    render: function(){
        this.$el.html(this.template.render());
        return this;
    },
    onDispose: function(){
        this.unbind();
        this.remove();
    }
});

// init
var list = new MyListView();

// to dispose entire tree
list.dispose();

```

**mixins.ListView**

***Dependencies***
-	mixins.DisposableTreeNode
-   mixins.PrePostRenderMethod

A mixin that makes rendering listviews easier and faster.
This class aims to standardize the way views are added to the
DOM during render. This class will not instantiate subviews
for you. Unlike the previous mixins, this one has dependencies on
others, unfortunately, out of the box Brace does not allow a mixin
to express a dependency on another.

The intended pattern involves setting up subviews during
preRender and then the render method consumes them for you.

Example usage:
```js

var MyListView = Brace.View.extend({
    mixins: [
        Backbone.mixins.ListView,
        Backbone.mixins.PrePostRenderMethod,
        Backbone.mixins.DisposableTreeNode
    ],

    // all you have to do is set your children
    preRender: function(){

        this.disposeChildren();

        this.addChildren(
            this.collection.map(function(model){
                return new MyItemView({
                    model: model
                });
            });
        );

    }

});

var MyItemView = Brace.View.extend({
    mixins: [
        Backbone.mixins.DisposableTreeNode
    ],

    render: function(){
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
    }
});


```

**mixins.CompositeView**

***Dependencies***
-	mixins.DisposableTreeNode
-   mixins.PrePostRenderMethod

A mixin that helps rendering composite views easier. Composite
views identify their subviews by jQuery selectors and typically do not
reinstantiate their subviews in between renders.

Example usage:

```js

var MyCompositeView = Brace.View.extend({

    mixins: [
        Backbone.mixins.CompositeView,
        Backbone.mixins.PrePostRenderMethod,
        Backbone.mixins.DisposableTreeNode
    ],

    initialize: function(){
        this.hasRendered = false;
        this.template = JST['templateName'];
    },

    // all you have to do is set your children
    preRender: function(){

        //TODO: abstract away this first render vs second render instantiation stuff
        if (!hasRendered) {
            this.addChild(
                new MySubView();
            );
            this.hasRendered: true;
        }

    }

});

var MySubView = Brace.View.extend({

    assignment: '#subViewId',

    mixins: [
        Backbone.mixins.DisposableTreeNode
    ],

    render: function(){
        this.$el.html(this.template.render(this.model.toJSON()));
        return this;
    }
});

```
