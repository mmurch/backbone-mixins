(function(){

	Backbone.DisposableTreeNode = {

		_children: {},

		isDisposableTreeNode: true,

		hasChildren: function(){
			return _(this._children).isEmpty();
		},

		addChild: function(child){
			
			this._children[child.cid || _.identity(child)] = child;
		
		},

		addChildren: function(children){
			
			// children may be passed in as an array 
			// or as a list of arguments, making the only invalid
			// class to use this mixin with (you guessed it!) Array
			children = _.isArray(children)
				? children
				: Array.prototype.slice.call(arguments);

			_(children).each(function(child){
				this.addChild(child);
			}, this);

		},

		dispose: function () {

			var __this = _(this);

			this.disposeChildren();

			__this.result('onDispose');
		},

		disposeChildren: function(){
			_(this._children).each(function(child){
				_(child).result('dispose');
			});
			this._children = {};
		}
	};

})();