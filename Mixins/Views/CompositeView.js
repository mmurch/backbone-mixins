Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var RM = {
            byAssign: 'byAssign'
        };


    mixins.CompositeView = {

        renderMethod: RM.byAssign,

        // subviews must have `assignment` set to
        // jquery selector to identify it
        byAssign: function () {

            if (this.template){
                this.$el.html(this.template.render(this.viewModel));
            }

            _.each(this.children(), function(child){

                child.setElement(
                        this.$el.find(child.assignment)
                    )
                    .render();

            }, this);
        }
    };

})(Backbone.mixins);