(function(){

    var listView,
        C = {
            WRAPPER: 'list-view-wrapper',
            ITEM: 'list-item'
        };

    var ListViewClass = Brace.View.extend({
        mixins: [ Backbone.mixins.ListView, Backbone.mixins.DisposableTreeNode ],
        preRender: function(){
            this.viewModel = {
                stuff: 'wow'
            };
        },
        postRender: function(){},
        template: {
            render: function(viewModel){
                return '<div><h2>Header 2 and ' + viewModel.stuff + '</h2></div>';
            }
        }
    });

    var ListItemClass = Brace.View.extend({
        mixins: [Backbone.mixins.DisposableTreeNode],
        template: {
            render: function (){
                return '<div class="' + C.ITEM + '">I\'m a list item.</div>';
            }
        },
        render: function(){
            this.$el.html(this.template.render());
            return this;
        }
    });

    describe('list view', function(){

        beforeEach(function(){
            setTestDomForByAppend();
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
            spyOn(listView.template, 'render');
            listView.render();
        });

        it('calls pre and post render methods if specified', function(){
            spyOn(listView, 'preRender').andCallThrough();
            spyOn(listView, 'postRender');
            listView.render();
            expect(listView.preRender).toHaveBeenCalled();
            expect(listView.postRender).toHaveBeenCalled();
        });

        it('returns this from its render method', function(){
            var _listView = listView.render();
            expect(_listView === listView).toBeTruthy();
        });

        it('renders template and then appends rest in byAppend method', function(){

            // setup the child
            var child = new ListItemClass();
            spyOn(child.template, 'render').andCallThrough();

            listView.addChild(child);

            spyOn(listView.template, 'render').andCallThrough();

            listView.render();

            expect(listView.template.render).toHaveBeenCalledWith(listView.viewModel);

            expect($('.' + C.WRAPPER + ' h2').text()).toEqual('Header 2 and wow');

            expect(child.template.render).toHaveBeenCalled();

            expect($('.' + C.WRAPPER + ' .' + C.ITEM).length).toEqual(1);

        });

    });


    var setTestDomForByAppend = function(){
        $('body').append(
            $('<div></div>')
                .addClass(C.WRAPPER)
        );
    };

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