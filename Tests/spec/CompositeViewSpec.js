(function(){

    var compositeView,
        C = {
            WRAPPER: 'composite-view-wrapper',
            ITEM: 'composite-item'
        };

    var CompositeViewClass = Brace.View.extend({
        mixins: [ Backbone.mixins.CompositeView ]
    });
    var ChildViewOne = Brace.View.extend({
        mixins: [ Backbone.mixins.DisposesAsView ],
        assignment: '.' + C.ITEM + 1,
        template: {
            render: function(viewModel){
                return viewModel.stuff;
            }
        },
        render: function(){
            this.viewModel = {
                stuff: 1
            };
            this.$el.html(this.template.render(this.viewModel));
            return this;
        }
    });
    var ChildViewTwo = Brace.View.extend({
        mixins: [ Backbone.mixins.DisposesAsView ],
        assignment: '.' + C.ITEM + 2,
        template: {
            render: function(viewModel){
                return viewModel.stuff;
            }
        },
        render: function(){
            this.viewModel = {
                stuff: 2
            };
            this.$el.html(this.template.render(this.viewModel));
            return this;
        }
    });
    var ChildViewThree = Brace.View.extend({
        mixins: [ Backbone.mixins.DisposesAsView ],
        assignment: '.' + C.ITEM + 3,
        template: {
            render: function(viewModel){
                return viewModel.stuff;
            }
        },
        render: function(){
            this.viewModel = {
                stuff: 3
            };
            this.$el.html(this.template.render(this.viewModel));
            return this;
        }
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

        it('calls the appropriate renderMethod', function(){
            spyOn(compositeView, 'byAssign');
            compositeView.render();
            expect(compositeView.byAssign).toHaveBeenCalled();
        });

        it('renders template with view model if template exists', function(){
            var tempCompositeViewClass = CompositeViewClass.extend({
                preRender: function(){
                    this.viewModel = {
                        stuff: 'wow'
                    };
                },
                template: {
                    render: function(viewModel){
                        return viewModel.stuff;
                    }
                }
            });

            compositeView = new tempCompositeViewClass();
            compositeView.setElement($('.' + C.WRAPPER))

            compositeView.render();

            expect($('.' + C.WRAPPER).text()).toEqual('wow');

        });

        it('assigns according to `assignment` property and renders', function(){
            var childOne = new ChildViewOne();
            var childTwo = new ChildViewTwo();

            spyOn(childOne, 'render').andCallThrough();
            spyOn(childTwo, 'render').andCallThrough();
            spyOn(childOne, 'setElement').andCallThrough();
            spyOn(childTwo, 'setElement').andCallThrough();

            compositeView.addChild(childOne);
            compositeView.addChild(childTwo);
            compositeView.render();

            expect(childOne.render).toHaveBeenCalled();
            expect(childTwo.render).toHaveBeenCalled();
            expect(childOne.setElement).toHaveBeenCalled();
            expect(childTwo.setElement).toHaveBeenCalled();

            expect(childOne.$el === $('.' + C.ITEM + 1));
            expect(childTwo.$el === $('.' + C.ITEM + 2));

            expect(childOne.$el.text()).toEqual('1');
            expect(childTwo.$el.text()).toEqual('2');
        });

        it('doesn\'t call render on subviews whose assignments don\'t succeed', function(){
            var childThree = new ChildViewThree();
            spyOn(childThree, 'render');
            compositeView.addChild(childThree);
            compositeView.render();
            expect(childThree.render).not.toHaveBeenCalled();
        });

        it('renders specific child with renderChild', function(){
            var childOne = new ChildViewOne();
            var childTwo = new ChildViewTwo();

            spyOn(childOne, 'render');
            spyOn(childTwo, 'render');

            compositeView.addChild(childOne);
            compositeView.addChild(childTwo);

            compositeView.render();

            expect(childOne.render).toHaveBeenCalled();
            expect(childTwo.render).toHaveBeenCalled();

            compositeView.renderChild(childOne.cid);

            expect(childOne.render.callCount).toEqual(2);
            expect(childTwo.render.callCount).toEqual(1);

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



