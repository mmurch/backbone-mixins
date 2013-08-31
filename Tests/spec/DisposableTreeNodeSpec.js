(function(){

    describe('disposable tree node', function(){


        var dtNode;


        beforeEach(function(){
            dtNode = _.extend(dtNodeBaseWithHandler, Backbone.mixins.DisposableTreeNode);
        });

        it('invokes dispose handler when dispose is invoked', function(){
            spyOn(dtNode, 'onDispose');
            dtNode.dispose();
            expect(dtNode.onDispose).toHaveBeenCalled();
        });

        it('doesnt break when there is no dispose handler', function(){
            delete dtNode.onDispose;
            dtNode.dispose();
        });

        it('invokes dispose handler on all children when disposed', function(){

            var children = _.map(_.range(0, 8), function(){
                return getExampleChild();
            });

            _(children).each(function(child){
                spyOn(child.child, 'onDispose').andCallThrough();
                spyOn(child.child, 'dispose').andCallThrough();

            });

            dtNode.addChildren(children);

            dtNode.dispose();

            _(children).each(function(child){
                expect(child.child.dispose).toHaveBeenCalled();
                expect(child.child.onDispose).toHaveBeenCalled();
            });

        });

        it('stores children in the correct format', function(){

            // using addChild
            var child = getExampleChild();
            dtNode.addChild(child.child, child.data);
            expect(dtNode._children[child.child.cid]).toEqual(child);

            // using addChildren
            child = getExampleChild();
            dtNode.addChildren(child);
            expect(dtNode._children[child.child.cid]).toEqual(child);

            // using addChildren with array
            child = getExampleChild();
            dtNode.addChildren([child]);
            expect(dtNode._children[child.child.cid]).toEqual(child);

            expect(dtNode._orderedChildIds.length).toEqual(3);

        });


        // helpers
        var dtNodeBaseWithHandler = {
            onDispose: function(){}
        };

        var getExampleChild = (function(){

            var id = 0;

            return function(){

                return {
                    child: _.extend({
                            cid: ++id,
                            other: 'wow'
                        },
                        dtNodeBaseWithHandler,
                        _.clone(Backbone.mixins.DisposableTreeNode)),
                    data: {
                        someOtherData: 6
                    }
                };

            };
        })();

    });

})();