(function(){


    describe('render method with pre and post render events', function(){

        var view;

        beforeEach(function(){
            view = new ViewClass();
        });

        it('won\'t break without pre or post or renderMethod methods', function(){
            delete view.preRender;
            delete view.postRender;
            delete view.renderMethod;
            delete view.howYouLike;
            view.render();

            view = new ViewClass();
            delete view.howYouLike;
            view.render();
        });

        it('calls pre and post render methods if specified', function(){
            spyOn(view, 'preRender').andCallThrough();
            spyOn(view, 'postRender');
            view.render();
            expect(view.preRender).toHaveBeenCalled();
            expect(view.postRender).toHaveBeenCalled();
        });

        it('calls render method specified by `renderMethod`', function(){
            spyOn(view, 'howYouLike');
            view.render();
            expect(view.howYouLike).toHaveBeenCalled();
        });

        it('returns this from its render method', function(){
            var _listView = view.render();
            expect(_listView === view).toBeTruthy();
        });

    });

    var ViewClass = Brace.View.extend({
        mixins: [ Backbone.mixins.PrePostRenderMethod ],
        preRender: function(){},
        postRender: function(){},
        renderMethod: 'howYouLike',
        howYouLike: function(){}
    });

})();