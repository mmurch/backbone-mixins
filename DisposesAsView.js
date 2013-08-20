Backbone.mixins = Backbone.mixins || {};

(function(mixins){

	mixins.DisposesAsView = {
		onDispose: function(){
			// just in case
			this.unbind();

			// calls stopListening internally 
			// and removes itself from the DOM
			this.remove();
		}
	};

})(Backbone.mixins);