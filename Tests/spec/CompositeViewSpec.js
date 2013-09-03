(function(){

    var compositeView,
        C = {
            WRAPPER: 'composite-view-wrapper',
            ITEM: 'composite-item'
        };

    var CompositeViewClass = Brace.View.extend({
        mixins: [
            Backbone.mixins.CompositeView,
            Backbone.mixins.DisposableTreeNode,
            Backbone.mixins.PrePostRenderMethod
        ]
    });

    describe('composite view', function(){

        beforeEach(function(){
            setTestDomForByAssign();
            compositeView = new CompositeViewClass();
            compositeView.setElement($('.' + C.WRAPPER))
        });

        afterEach(function(){
            removeTestDom();
        });

    });


    var setTestDomForByAssign = function(){
        $('body').append(
            $('<div></div>')
                .addClass(C.WRAPPER)
                .append(
                    $('<div></div>')
                        .addClass(C.ITEM + 1)
                )
                .append(
                    $('<div></div>')
                        .addClass(C.ITEM + 2)
                )
        );
    };

    var removeTestDom = function(){
        $('.' + C.WRAPPER).remove();
    };

})();



