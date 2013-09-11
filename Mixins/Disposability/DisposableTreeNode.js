Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var EVENT_DISPOSE = 'onDispose',
        FUNC_DISPOSE = 'dispose';

    mixins.DisposableTreeNode = {

        initialize: function(){

            // children to be accessed by cid
            this._children = {};

            // separate storage of cids in the order in which they were added to guarantee order
            this._orderedChildIds = [];

        },

        // helper isOfType bool
        isDisposableTreeNode: true,

        hasChildren: function(){
            return !_(this._children).isEmpty();
        },

        children: function(){
            return _.map(this._orderedChildIds, function(id){
                return this._children[id];
            }, this);
        },


        /**
         * internal version of add child that expects an already
         * constructed child storage object
         * @private
         * @param childStorage see format above
         */
        addChild: function(child){

            var id = child.cid || _.identity(child);

            this._children[id] = child;
            this._orderedChildIds.push(id);
        },


        /**
         * @param children may be an array
         * or as a list of arguments, making the only invalid
         * class to use this mixin with (you guessed it!) Array.
         * limitation: accepted
         *
         * expects children as formatted in the comments above
         */
        addChildren: function(children){

            children = _.isArray(children)
                ? children
                : Array.prototype.slice.call(arguments);

            _(children).each(function(child){
                this.addChild(child);
            }, this);

        },

        /**
         *
         * @param id
         */
        getChild: function(id){
            return this._children[id];
        },

        /**
         * calls dispose on its children and then
         * its own dispose handler
         */
        dispose: function () {

            var __this = _(this);

            this.disposeChildren();

            __this.result(EVENT_DISPOSE);

        },

        /**
         * disposes of a particular child by its identifier
         * @param childId
         */
        disposeChild: function(childId){
            _(this._children[childId])
                .result(FUNC_DISPOSE);

            delete this._children[childId];
            this._orderedChildIds = _.without(this._orderedChildIds, childId);
        },

        disposeChildren: function(){
            _(this._children).each(function(child){
				_(child).result(FUNC_DISPOSE);
            });
            this._children = {};
            this._orderedChildIds = [];
        }
    };

})(Backbone.mixins);