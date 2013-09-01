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

            var hasOwnTemplate = !!this.template;

            /**
             * if this listview has its own template
             * then we will render it to seed our
             * fragment with it and not use documentFragment
             * @type {*|jQuery|HTMLElement}
             */
			var frag = hasOwnTemplate
                ? $(this.template.render(this.viewModel))
                : document.createDocumentFragment();

			var appendMethod = hasOwnTemplate
                ? 'append'
                : 'appendChild';

            _(this._orderedChildIds).each(function(viewId){
				frag[appendMethod](
                    this._children[viewId].render().el
				);
			}, this);

			this.$el.html(frag);
		
			return this;
		},

		// if using the `byAssign` render strategy, attribute `assignment`
		// should be set to the jQuery selector that
		// returns the elements to assign the child views

        assignment: '',

		byAssign: function () {

			var _this = this;

			// why not frag this
			this.$el.html(this.template.render(this.viewModel));

			this.$el.find(this.getAssignment()).each(function(i){
				_this._children[this._orderedChildIds[i]]
                    .setElement($(this))
                    .render();
			});
		}
	};

})(Backbone.mixins);