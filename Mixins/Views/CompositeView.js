Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var RM = {
            byAssign: 'byAssign'
        };


    /**
     *
     * Useful for rendering layouts or views with a fixed number
     * of subviews such that they are not backed by a collection
     * or displayed as a list
     *
     * subviews must have `assignment` set to
     * jquery selector to identify it in a `$parent.find(selector)` manner
     *
     * @type {{renderMethod: string, byAssign: Function, renderChild: Function}}
     * @dependencies DisposableTreeNode, PrePostRenderMethod
     */
    mixins.CompositeView = _.extend({},
        Backbone.mixins.DisposesAsView,
        Backbone.mixins.PrePostRenderMethod,
        {

            renderMethod: RM.byAssign,

            /**
             *
             * Render all the child views using either existing dom or
             * the template as the base. blasts out the existing html every time
             * if using a template
             *
             */
            byAssign: function () {

                if (this.template){
                    this.$el.html(this.template.render(this.viewModel));
                }

                _.each(this.children(), function(child){

                    var $elem = this.$el.find(child.assignment);

                    if (!$elem.length) {
                        return;
                    }

                    child.setElement($elem)
                        .render();

                }, this);
            },

            /**
             *
             * Render an individual child view instead of all
             *
             * @param id should be the view's cid
             */
            renderChild: function(id) {

                var child = this.getChild(id);

                if (child) {
                    child.render();
                }

                return this;
            }

        });

})(Backbone.mixins);