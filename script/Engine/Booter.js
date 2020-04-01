System.Engine = System.Engine || {};
System.Engine.Booter = function(path, args) {
	var self = this;

	self._data = {};
	self._manifest = [];
	self._queue = [];

	createjs.EventDispatcher.initialize(System.Engine.Booter.prototype);

	this.loadJSON(path, function(response) {
		var json = JSON.parse(response);

		/* push each object to queue */
		Object.keys(json).map( key => self._queue.push(key) );

		/* parse each boot sequence set */
		self._queue.forEach(function(key, index, array) {
			var obj = json[key];

			var parsed = self.parseData(obj);
			var properties = parsed._properties;

			/* push object properties to data */
			self._data[key] = {_properties: properties, _data: data, index: index};
			
			var data = {};
			properties.forEach(key => data[key] = obj[key]);

			self._data[key] = {
				_properties: properties, _data: data
			};
		});

	});

}

System.Engine.Booter.prototype = {
	parseData: function(data) {
		var properties = [];
		Object.keys(data).map(function(key) {
			properties.push(key);
		})

		return {_properties: properties, data: data};
	},
	loadJSON: function(path, callback) {
		var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
		xobj.open('GET', path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	}
}