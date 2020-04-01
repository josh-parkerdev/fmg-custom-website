System.Engine = System.Engine || {};
System.Engine.Sounds = function(path, args) {
	var self = this;

	self._data = {};
	self._manifest = [];
	self._queue = [];

	createjs.EventDispatcher.initialize(System.Engine.Sounds.prototype);

	this.loadJSON(path, function(response) {
		var json = JSON.parse(response);
		Object.keys(json).map( key => self._queue.push(key) );

		self._queue.forEach(function(key, index, array) {
			var obj = json[key];

			var parsed = self.parseData(obj);
			var properties = parsed._properties;

			var data = {};
			properties.forEach(key => data[key] = obj[key]);

			self._data[key] = {
				_properties: properties, _data: data
			};
		})

		var items = [];
		self._queue.forEach(function(entity) {
			var obj = self._data[entity];

			var sound = obj._data.sound,
				src = obj._data.src;

			if (sound && src) {
				self._manifest.push({id: sound, src: src})
			}
		})

		self.queue = new createjs.LoadQueue(false);
		createjs.Sound.alternateExtensions = ["mp3"];
		self.queue.installPlugin(createjs.Sound);
		self.queue.loadManifest(self._manifest, false);

		self.queue.on('fileload', function(event) {
			var fileload = new createjs.Event('fileload');
			fileload.set({
				item: event.item,
				result: event.results,
				rawResult: event.rawResult
			})
			self.dispatchEvent(fileload);
		})

		self.queue.on('filestart', function(event) {
			var item = event.item
			var filestart = new createjs.Event('filestart');
			filestart.set({
				item: item
			});
			self.dispatchEvent(filestart);
		})

		self.queue.on('progress', function(event) {
			var progress = new createjs.Event('progress').set({
				loaded: event.loaded,
				progress: event.progress
			})
			self.dispatchEvent(progress);
		})

		self.queue.on('complete', event => self.dispatchEvent(event));

		var ready = new createjs.Event('ready');
		ready.set({queue: self.queue});
		self.dispatchEvent(ready);
	});

}

System.Engine.Sounds.prototype = {
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