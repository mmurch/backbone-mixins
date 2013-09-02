Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var RM = {
            byAppend: 'byAppend',
            byAssign: 'byAssign'
        },
        EV = {
            preRender: 'preRender',
            postRender: 'postRender'
        };


	mixins.ListView = {

        mixins: [ Backbone.mixins.DisposableTreeNode ],

        renderMethod: RM.byAppend,

		render: function () {

			var __this = _(this);

			__this.result(EV.preRender);

			__this.result(this.renderMethod);

			__this.result(EV.postRender);

			return this;
		},

		byAppend: function () {

            var hasOwnTemplate = !!this.template,
                frag = document.createDocumentFragment();

            // if it has its own template we have two
            // dom manipulations instead of one
            if (hasOwnTemplate){
                this.$el.html(this.template.render(this.viewModel));
            }

            // add all the rendered children to the fragment
            _(this.children()).each(function(child){
				frag.appendChild(
                    child.render().el
				);
			}, this);

            if (hasOwnTemplate){
                this.$el.append(frag);
            }
            else {
                this.$el.html(frag);
            }

			return this;
		},

        // if using the `byAssign` render strategy, each subview
        // must have the attribute `assignment` set to the
        // jQuery selector that returns the elements
        // to assign the subview

        assignment: '',

		byAssign: function () {

			var _this = this;

			// why not frag this
			this.$el.html(this.template.render(this.viewModel));

			this.$el.find(this.assignment).each(function(i){
				_this._children[this._orderedChildIds[i]]
                    .setElement($(this))
                    .render();
			});
		}
	};

})(Backbone.mixins);