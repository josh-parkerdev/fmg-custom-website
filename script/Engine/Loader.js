System.Engine = System.Engine || {};
System.Engine.Loader = function(path, args) {
	var self = this;

	self._layers = [];		// layer keys
	self._entities = [];	// component keys
	self._data = {};
	self._manifest = [];	// preload data

	createjs.EventDispatcher.initialize(System.Engine.Loader.prototype);

	this.loadJSON(path, function(response) {
		var json = JSON.parse(response);
		Object.keys(json).map( key => self._layers.push(key) );

		// iterate through layers array and map entities
		// and properties
		self._layers.forEach(function(key, index, array) {
			var layer = json[key];

			var parsed = self.parseData(layer);
			var properties = parsed._properties;
			var entities = parsed._objects;

			entities.forEach(function(key, index, array){
				var component = layer[key];
				var classes = {};

				var parsed = self.parseData(component);
				var properties = parsed._properties;
				var requires = parsed._objects;

				requires.forEach(function(key, index, array) {
					classes[key] = {_data: component[key]}
				})

				self._entities.push(key);
				self._data[key] = {_requires: requires, _properties: properties, _data: classes};

			});

			var data = {};
			properties.forEach(key => data[key] = layer[key]);

			self._data[key] = {
				_properties: properties, _entities: entities, _data: data
			};

		});

		// Iterate through entities and push files to preload manifest
		var items = [];
		self._entities.forEach(function(entity) {
			var obj = self._data[entity];

			obj._requires.forEach(function(key) {
				var component = obj._data[key];

				// js
				if (items.indexOf(key) < 0) {
					var path = 'script/Components/';
					var filename = key + '.js';
					items.push(key);
					self._manifest.push({id: key, src: path + filename});
				}

				// image
				var image = component._data.image,
					src = component._data.src;

				if (image && src) {
					if (items.indexOf(image) < 0) {
						self._manifest.push({id: image, src: src})
						items.push(image);
					}
				}
			})
			
		})

		self.queue = new createjs.LoadQueue(false);
		self.queue.setMaxConnections(10);
		self.queue.loadManifest(self._manifest, false);

		self.queue.on('fileload', function(event) {
			var fileload = new createjs.Event('fileload');
			fileload.set({
				item: event.item,
				result: event.result,
				rawResult: event.rawResult
			});
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
				progress: event.progress,
			})
			self.dispatchEvent(progress);
		})

		self.queue.on('complete', event => self.dispatchEvent(event));

		var ready = new createjs.Event('ready');
		ready.set({queue: self.queue});
		self.dispatchEvent(ready);

	})

	
}

System.Engine.Loader.prototype = {
	parseData: function(data) {
		var properties = [];
		var objects = [];

		Object.keys(data).map(function(key) {
			var obj = data[key];
			if (typeof obj == "object" && !Array.isArray(obj)) {
				objects.push(key);
			} else {
				properties.push(key);
			}
		});

		return {_properties: properties, _objects: objects, data: data};
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