System.Component = System.Component || {};

System.Component.Emotes = function(args, data) {
	var self = this;
	var defaults = {
		meta: {},
		template: {},
		emotes: {}
	};

	Utils.extend(this, {
		_data: defaults
	}, args);
	Utils.extend(this._data, data);


}

System.Component.Emotes.prototype = {
	api: function(request) {
		var baseURL = "https://twitchemotes.com/api_cache/v2/" + request + ".json"
		$.getJSON(baseURL, function(response) {
			return response;
		})
	}
}