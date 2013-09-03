Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var EV = {
            preRender: 'preRender',
            postRender: 'postRender'
        };

    mixins.PrePostRenderMethod = {

        render: function () {

            var __this = _(this);

            __this.result(EV.preRender);

            __this.result(this.renderMethod);

            __this.result(EV.postRender);

            return this;
        }
    };

})(Backbone.mixins);