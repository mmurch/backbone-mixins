(function(){

    var listView,
        C = {
            WRAPPER: 'listViewWrapper'
        };

    var ListViewClass = Brace.View.extend({

        mixins: [ Backbone.mixins.ListView ],

        preRender: function(){

        },
        postRender: function(){

        }
    });

    describe('list view', function(){

        beforeEach(function(){
            setTestDom();
            listView = new ListViewClass();
            listView.setElement($('.' + C.WRAPPER))
        });

        afterEach(function(){
            removeTestDom();
        });

        it('has renderMethod of byAppend by default', function(){
            expect(listView.renderMethod).toEqual('byAppend');
        });

        it('won\'t break without pre or post render methods', function(){
            delete listView.preRender;
            delete listView.postRender;
            listView.render();
        });

        it('calls pre and post render methods if specified', function(){
            spyOn(listView, 'preRender');
            spyOn(listView, 'postRender');
            listView.render();
            expect(listView.preRender).toHaveBeenCalled();
            expect(listView.postRender).toHaveBeenCalled();
        });

    });


    var setTestDom = function(){
        $('body').append(
            $('<div></div>')
                .addClass(C.WRAPPER)
        );
    };

    var removeTestDom = function(){
        $('.' + C.WRAPPER).remove();
    };




})();