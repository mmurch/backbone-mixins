(function(mixins){

	/**
		*mixins.ListView*

		A mixin that makes rendering listviews easier and faster.
		This class aims to standardize the way views are added to the
		DOM during render. This class will not instantiate subviews
		for you (see [How to use]).

		***Dependencies***
    	-	mixins.DisposableTreeNode
    	-	CockTail

    	***When to use***
    	If you have a view with any number of subviews that 
    	needs to be rendered often, this class gives you 
    	two fast options.

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

	*/

	mixins.ListView = {

		renderStrategy: 'byAppend',

		render: function () {

			var __this = _(this);

			__this.result('preRender');

			this.result(this.renderStrategy);

			__this.result('postRender');

			return this;
		},

		preRender: function(){
			if (this.renderStrategy === 'byAppend'){
				this.disposeChildren();
			}
		},

		byAppend: function () {

			// TODO: can I seed this with this.template.render()?
			var frag = document.createDocumentFragment();

			// TODO: fix use of _children
			this._children.each(function(view){
				frag.appendChild(view
					.render()
					.el
				);
			}, this);

			this.$el.html(frag);
		
			return this;
		},

		// if using the `byAssign` render strategy, assignment
		// should be overridden to the jQuery selector that 
		// returns the elements to assign the child views 
		assignment: '',

		byAssign: function () {

			var _this = this;

			// why not frag this
			this.$el.html(this.template.render(this.viewModel));

			this.$el.find('.item').each(function(i){
				_this.views[i].setElement($(this)).render();
			});
		}
	};

})(ZD.module('BackboneMixins'));