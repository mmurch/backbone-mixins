(function(){

    var listView,
        C = {
            WRAPPER: 'list-view-wrapper',
            ITEM: 'list-item'
        };

    var ListViewClass = Brace.View.extend({
        mixins: [
            Backbone.mixins.ListView,
            Backbone.mixins.DisposableTreeNode,
            Backbone.mixins.PrePostRenderMethod
        ],
        preRender: function(){
            this.viewModel = {
                stuff: 'wow'
            };
        },
        template: {
            render: function(viewModel){
                return '<h2>Header 2 and ' + viewModel.stuff + '</h2>';
            }
        }
    });

    var ListItemClass = Brace.View.extend({
        mixins: [
            Backbone.mixins.DisposableTreeNode
        ],
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
            listView.setElement($('.' + C.WRAPPER));
        });

        afterEach(function(){
            removeTestDom();
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

    var removeTestDom = function(){
        $('.' + C.WRAPPER).remove();
    };

})();