(function(){

    describe('disposable tree node', function(){


        var dtNode;


        beforeEach(function(){
            dtNode = new dtNodeBaseWithHandler();
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

        it('maintains order when adding and disposing', function(){

            var children = _.map(_.range(0,8), function(){
                return getExampleChild();
            });

            var cids = _.map(children, function(child){
                return child.child.cid;
            });

            spyOn(children[1].child, 'dispose');

            dtNode.addChildren(_(children).take(3));

            expect(dtNode._orderedChildIds).toEqual(_(cids).take(3));

            dtNode.disposeChild(cids[1]);

            expect(children[1].child.dispose).toHaveBeenCalled();

            expect(dtNode._orderedChildIds).toEqual(
                _.chain(cids)
                    .take(3)
                    .without(cids[1])
                    .value()
            );

            expect(dtNode._children[cids[1]]).toBeUndefined();

            dtNode.addChild(children[5].child);

            expect(dtNode._orderedChildIds).toEqual(
                _.chain(cids)
                    .take(3)
                    .without(cids[1])
                    .value()
                    .concat([cids[5]])
            );

        });

        it('identifies as disposabletreenode', function(){
            expect(dtNode.isDisposableTreeNode).toBeTruthy();
        });


        // helpers
        var dtNodeBaseWithHandler = Brace.View.extend({
            mixins: [Backbone.mixins.DisposableTreeNode],
            onDispose: function(){}
        });

        var getExampleChild = function(data){

            return {
                child: _.extend(
                    new dtNodeBaseWithHandler()
                ),
                data: data || {
                    someOtherData: 6
                }
            };

        };

    });

})();