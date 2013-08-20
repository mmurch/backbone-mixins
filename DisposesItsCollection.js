Backbone.mixins = Backbone.mixins || {};

(function(mixins){

	// semi-deprecated, there are better ways to solve this problem
	mixins.DisposesItsCollection = {
		onDispose: function(){
			_(this).safeGet('collection.onDispose');
		}
	};

})(Backbone.mixins);