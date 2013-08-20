(function(){

	// semi-deprecated, there are better ways to solve this problem
	Backbone.DisposesItsCollection = {
		onDispose: function(){
			_(this).safeGet('model.onDispose');
		}
	};

})();