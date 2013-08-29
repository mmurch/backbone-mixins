Backbone.mixins = Backbone.mixins || {};

(function(mixins){

	mixins.ListView = {

		renderStrategy: 'byAppend',

		render: function () {

			var __this = _(this);

			__this.result('preRender');

			__this.result(this.renderStrategy);

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

})(Backbone.mixins);