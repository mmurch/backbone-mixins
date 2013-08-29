Backbone.mixins = Backbone.mixins || {};

(function(mixins){

    var EVENT_DISPOSE = 'onDispose',
        FUNC_DISPOSE = 'dispose',
        DATA_KEY = 'data',
        CHILD_KEY = 'child';

	mixins.DisposableTreeNode = {


        /**
         * children will be stored in the following format:
         * ```js
         *
         * var childStorage = {
         *      obj: {},    // actual instance of child node
         *      data: {}    // optional other storage, should be used sparingly and carefully
         * }
         *
         * ```
         */

        // children to be accessed by cid
		_children: {},

        // separate storage of cids in the order in which they were added to guarantee order
        _orderedChildIds: [],

        // helper isOfType bool
		isDisposableTreeNode: true,

		hasChildren: function(){
			return _(this._children).isEmpty();
		},

        /**
         * internal version of add child that expects an already
         * constructed child storage object
         * @private
         * @param childStorage see format above
         */
        _addChild: function(childStorage){

            var _cs = _(childStorage).chain(),
                id = _cs.result(CHILD_KEY)
                        .result('cid').value() ||
                    _.identity(
                        _cs.result(CHILD_KEY).value()
                    );

            this._children[id] = childStorage;
            this._orderedChildIds.push(id);
        },

        /**
         * @param child can be any other disposable tree node
         */
		addChild: function(child, data){

            var childStorage = {};

            childStorage[CHILD_KEY] = child;
            childStorage[DATA_KEY] = data;

            this._addChild(childStorage);
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
				this._addChild(child);
			}, this);

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
            _.chain(this._children[childId])
                .result(CHILD_KEY)
                .result(FUNC_DISPOSE)
                .value();

            delete this._children[childId];
            this._orderedChildIds = _.without(this._orderedChildIds, childId);
        },


		disposeChildren: function(){
			_(this._children).each(function(child){
				_.chain(child)
                    .result(CHILD_KEY)
                    .result(FUNC_DISPOSE)
                    .value();
			});
			this._children = {};
			this._orderedChildIds = [];
		}
	};

})(Backbone.mixins);