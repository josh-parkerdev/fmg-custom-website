System.Component = System.Component || {};

System.Component.SpriteSheet = function(args, data, parent) {
	var self = this;
	this.parent = parent;
	var defaults = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		inturrupt: false,
		shade: 1,
		animations: {}
	};

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

	this.complete = true;
	this.animating = false;
	this.listener = {};

	/* spritesheet */
	var sheet = new createjs.SpriteSheet({
		animations: this._data.animations || this.layer._data.animaions,
		framerate: this._data.framerate,
		images: [args.loader.queue.getResult(this._data.image)],
		frames: {
			count: this._data.count,
			width: this._data.width,
			height: this._data.height
		}
	});

	this.g = new createjs.Sprite(sheet);
	this.g.skewX = this._data.skewX;
	this.g.opacity = this._data.opacity;

	var scale = this.layer._data.scale;

	this.setBounds(this.g,
		this._data.x,
		this._data.y,
		this._data.width,
		this._data.height
	)

	this.brightness(this._data.shade);

	this.cache();

	this.layer.stage.addChild(this.g);
	this.layer.stage.update();

	this.listeners = {};

	var events = this._data.events;
	for (e in events) {
		var data = self._data.events[e];

		var listener = self.app.on(e, self.event, this, false, data);
		self.listeners[e] = listener;
	}

	//var change = this.g.on("change", self.change, this, false);
}

System.Component.SpriteSheet.prototype = {

	change: function(event) {
		//console.log(this.g.currentAnimation);
		//if (!this.layer.update) this.layer.update = true;
	},

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
				this[func](args, data, event)
			}
		}
	},

	openURL: function(args, data) {
		var self = this;

		if (args.url) {
			window.open(args.url);
		}
	},

	playToggle: function(args, data, event) {
		var anim = this.lastAnimation;
		this.playSequence(args[anim], null, event);
	},

	playSequence: function(args, data, event) {
		var self = this;
		var data = data || {};

		if (data.inturrupt || this.complete) {
			var play = args.play;

			this.g.gotoAndPlay(play);
			if (self.complete) start(play);
		}

		function start(anim) {
			self.complete = false;
			self.layer.redraw = true;
			self.listener = self.g.on("animationend", function(event) {
				if (!event.next) {
					self.layer.redraw = false;
					self.g.off("animationend", self.listener);
					//self.layer.stage.update();
					console.log("animationend");
					self.lastAnimation = event.name;
					self.complete = true;
				}

				//self.g.off("animationend", self.listener);
			});
		}
	},

	activate: function() {
		this.uncache();
		var play = this._data.play;
		if (play) this.playSequence({play: play});
	},

	filter: function(shade, alpha) {
		var stage = this.layer.stage;
		var g = this.g;

		shade = shade || 1;
		alpha = alpha || 1;

		g.filters = [
			new createjs.ColorFilter(shade,shade,shade,alpha, 0,0,0,1)
		]

		if (g.cacheID > 0) g.updateCache();
		stage.update();
	},

	brightness: function(shade) {
		var stage = this.layer.stage;
		var g = this.g;

		g.filters = [new createjs.ColorFilter(shade,shade,shade,1, 0,0,0,1)];

		// object ust be cached before calling updateCache
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

	cache: function() {
		var g = this.g;
		var bounds = g.getBounds();
		
		//this.setBounds(this.g, bounds.x, bounds.y, bounds.width, bounds.height)
		g.cache(bounds.x, bounds.y, bounds.width, bounds.height);
	},

	uncache: function() {
		this.g.uncache();
	},

	setBounds: function(object, x, y, w, h) {
		//object.setBounds(x, y, w, h);
		object.x = x
		object.y = y
		object.width = w
		object.height = h
	},
}