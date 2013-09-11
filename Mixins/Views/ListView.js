Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var RM = {
            byAppend: 'byAppend'
        };

    mixins.ListView = _.extend({},
        Backbone.mixins.DisposesAsView,
        Backbone.mixins.PrePostRenderMethod,
        {

            renderMethod: RM.byAppend,

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
            }
        });

})(Backbone.mixins);