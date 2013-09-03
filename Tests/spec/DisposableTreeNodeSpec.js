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
                return new dtNodeBaseWithHandler();
            });

            _(children).each(function(child){
                spyOn(child, 'onDispose').andCallThrough();
                spyOn(child, 'dispose').andCallThrough();

            });

            dtNode.addChildren(children);

            dtNode.dispose();

            _(children).each(function(child){
                expect(child.dispose).toHaveBeenCalled();
                expect(child.onDispose).toHaveBeenCalled();
            });

        });

        it('stores children correctly', function(){

            // using addChild
            var child = new dtNodeBaseWithHandler();
            dtNode.addChild(child);
            expect(dtNode._children[child.cid]).toEqual(child);

            // using addChildren
            child = new dtNodeBaseWithHandler();
            dtNode.addChildren(child);
            expect(dtNode._children[child.cid]).toEqual(child);

            // using addChildren with array
            child = new dtNodeBaseWithHandler();
            dtNode.addChildren([child]);
            expect(dtNode._children[child.cid]).toEqual(child);

            expect(dtNode._orderedChildIds.length).toEqual(3);

        });

        it('maintains order when adding and disposing', function(){

            var children = _.map(_.range(0,8), function(){
                return new dtNodeBaseWithHandler();
            });

            var cids = _.map(children, function(child){
                return child.cid;
            });

            spyOn(children[1], 'dispose');

            dtNode.addChildren(_(children).take(3));

            expect(dtNode._orderedChildIds).toEqual(_(cids).take(3));

            dtNode.disposeChild(cids[1]);

            expect(children[1].dispose).toHaveBeenCalled();

            expect(dtNode._orderedChildIds).toEqual(
                _.chain(cids)
                    .take(3)
                    .without(cids[1])
                    .value()
            );

            expect(dtNode._children[cids[1]]).toBeUndefined();

            dtNode.addChild(children[5]);

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

    });

})();