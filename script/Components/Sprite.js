System.Component = System.Component || {};

System.Component.Sprite = function(args, data) {
	var self = this;
	var defaults = {
		shade: 1,
		alpha: 1,
		x: 0,
		y: 0
	};

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

	this.complete = true;
	this.listener = {};

	var stage = this.layer.stage;

	var id = this._data.image;
	var image = args.loader.queue.getResult(id);

	this.g = new createjs.Bitmap(image);

	this.g.x = this._data.x;
	this.g.y = this._data.y;

	var shade = this._data.shade;
	var alpha = this._data.alpha;

	this.filter(shade, alpha);

	/*this.brightness(this._data.shade);
	this.transparency(this._data.alpha);*/

	this.cache();

	stage.addChild(this.g);
	stage.update();

	this.listeners = {};

	var events = this._data.events;
	for (e in events) {
		var data = self._data.events[e];

		var listener = self.app.on(e, self.event, this, false, data);
		self.listeners[e] = listener;
	}
}

System.Component.Sprite.prototype = {

	event: function(event, data) {
		var self = this;

		var hasComponent = false;
		data.components.forEach(function(key, index, array) {
			if (event.name == key) {
				hasComponent = true;
			}
		})

		if (hasComponent) {
			for (func in data.functions) {
				var args = data.functions[func];
				this[func](args, data)
			}
		}
	},

	openURL: function(args, data) {
		var self = this;

		if (args.url) {
			window.open(args.url);
		}
	},

	filter: function(shade, alpha) {
		var stage = this.layer.stage;
		var g = this.g;

		this.shade = shade;
		this.alpha = alpha;

		g.filters = [
			new createjs.ColorFilter(shade,shade,shade,alpha, 0,0,0,1)
		]

		if (g.cacheID > 0) g.updateCache();
		stage.update();
	},

	saturation: function(intensity) {
		var stage = this.layer.stage;
		var g = this.g;

		var matrix = new createjs.ColorMatrix().adjustSaturation(intensity);
		g.filters = [
			new createjs.ColorMatrixFilter(matrix)
		]

		g.updateCache();
		stage.update();
	},

	brightness: function(shade) {
		var stage = this.layer.stage;
		var g = this.g;

		//this._data.shade = shade;

		g.filters = [
			new createjs.ColorFilter(shade,shade,shade,1, 0,0,0,1)
		];

		if (g.cacheID > 0) g.updateCache();
		stage.update();

	},

	transparency: function(shade) {
		var stage = this.layer.stage;
		var g = this.g;

		g.filters = [new createjs.ColorFilter(1,1,1,shade, 0,0,0,1)];

		if (g.cacheID > 0) g.updateCache();
		stage.update();
	},

	fade: function(data) {
		var tween;
		var listener;

		var sprite = System.getSprite(this);
		var options = data[sprite.alpha]

		tween = createjs.Tween.get(sprite)
		.wait(options.delay)
		.to({alpha: options.end}, options.duration)

		listener = tween.on('change', function(event, data) {
			sprite.filter(null, sprite.alpha);
		}, this, false, data);
	},

	cache: function() {
		var g = this.g;

		var obj = g.getBounds();
		var bounds = Object.keys(obj).map(key => obj[key]);
		g.cache(bounds[0], bounds[1], bounds[2], bounds[3]);		
	},

	uncache: function() {
		this.g.uncache();
	}
	
}