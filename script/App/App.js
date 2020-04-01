App = function() {
	var self = this;

	createjs.EventDispatcher.initialize(App.prototype);

	var canvasTag = $('<style>canvas {padding-left: 0}</style>');
	var embeddedTag = $('<style>embedded {margin-left: 0}</style>')
	$('html > head').append(canvasTag);
	$('html > head').append(embeddedTag);

	this.setScale();

	this.layers = this.layers || new System.Engine.Layers;
	this.entities = this.entities || new System.Engine.Entities;

	this.console = new System.Console(this);
	this.ship = new System.Ship(this);
	//this.visualizer = new System.Visualizer(this);
	this.twitch = new System.Twitch(this);

	/* Options GUI */
	/*var gui = new dat.GUI();
	var channel = gui.add(this.ship, "channel")
	gui.add(this.ship, "scale", 1, 4);
	gui.add(this.ship, "animate")

	channel.onFinishChange(function(value) {
		console.log("channel: " + value);
	})*/

	self.ship.load();
	self.resize(self.scale);

	self.console.isReady = true;

	this.ship.on("ready", function(event) {
		self.dispatchEvent("CONSOLE INITIALIZED");
	})

	this.ship.on("progress", function(event) {
		self.event("FILE PROGRESS", {
			progress: event.progress
		})
	})

	this.ship.on("filestart", function(event) {
		self.event("FILE LOADING", {
			item: event.item
		})
	})

	this.ship.on("complete", function(event) {
		buildElements(event);

		self.event("LOADING COMPLETE", {
			booter: event.booter
		});

		//createjs.Ticker.on("tick", self.screenshot, self, false, {queue: renderQueue, viewport: viewport});

	})

	/* internal methods */
	var buildElements = function(event) {
		var loader = event.loader;
		var layers = event.layers;

		var app = self;

		layers.forEach(function(layerkey, layerindex, layerarray) {
			// lots of hard coded linked objects - entities, components
			// these are defined in each loop and added to all child objects
			var entities = {};
			var layer = new System.Engine.Layer({
				app: app,
				name: layerkey,
				entities: entities,
			}, loader._data[layerkey]);
			self.layers.add(layer);

			layer._entities.forEach(function(entitykey, entityindex, entityarray) {
				var components = {};
				var data = loader._data[entitykey];
				var entity = new System.Engine.Entity({
					app: app,
					name: entitykey,
					layer: layer,
					loader: loader,
					entities: entities,
					_components: components,
					_requires: data._requires
				}, data)
				entities[entitykey] = entity;
				self.entities.add(entity);

				entity._requires.forEach(function(componentkey, componentindex, componentarray) {
					var data = loader._data[entitykey]._data[componentkey]._data
					var args = loader._data[entitykey];
					var component = new System.Component[componentkey]({
						name: entitykey,
						app: app,
						layer: layer,
						loader: loader,
						_components: components
					}, data);
					components[componentkey] = component;
				})

			})
		})

		// resize elements immediately after they're created
		// calculate and set the padding/margins for canvas and embeds
		self.resize(self.scale);
	}
	
}

App.prototype = {
	screenshot: function(event, data) {
		var self = this;
		$('#viewport').remove();
		var c = document.createElement("canvas");
		c.id = "viewport";
		c.width = System.bounds.width;
		c.height = System.bounds.height;
		c.style.position = "absolute";
		c.style.zIndex = 100;
		c.style.visibility = "hidden";
		$('body').append(c);
		
		var viewport = new createjs.Stage(c.id);
		viewport.autoClear = false;
		viewport.update();

		/* Render viewport */
		var renderQueue = self.layers.children.sort(function(a, b) {
			return a._data.z - b._data.z;
		});

		renderQueue.forEach(function(layer, index, array) {
			var canvas = layer.stage.canvas;

			layer.stage.uncache();

			var scale = 1;
			if (layer._data.scale) {
				var scale = layer._data.scale / 4;
			}
			var x = layer._data.x * scale || 0,
				y = layer._data.y * scale || 0,
				w = layer._data.width * scale || 0,
				h = layer._data.height * scale || 0;

			var ctx = viewport.canvas.getContext("2d");
			ctx.drawImage(canvas, x, y, w, h);
			//viewport.stage.update();

		})
		var uri = viewport.canvas.toDataURL('image/png');
		window.open(uri);
	},

	protocolZ: function() {
		var self = this;

		var vw = System.bounds.width;
		var vh = System.bounds.height;

		var viewports = [];
		var index = 0;
		for (var w = vw; w > 100; w -= 10) {
			var c = document.createElement("canvas");
			c.style.position = "absolute";
			c.style.zIndex = -1;
			c.id = "viewport" + index++;
			c.width = w;
			c.height = w / (16/9);
			$(c).css('left', vw - c.width / 2);
			$(c).css('top', vh - c.height / 2);
			$('body').append(c);

			var v = new createjs.Stage(c.id);
			v.width = c.width;
			v.height = c.height;
			v.autoClear = false;
			v.update();

			viewports.push(v);
		}

		/* Render viewport */
		var renderQueue = self.layers.children.sort(function(a, b) {
			return a._data.z - b._data.z;
		});

		createjs.Ticker.on("tick", function() {
			renderQueue.forEach(function(layer, index, array) {
				var canvas = layer.stage.canvas;
				layer.stage.uncache();

				var scale = 1;
				if (layer._data.scale) {
					var scale = layer._data.scale / 4;
				}
				var x = layer._data.x * scale || 0,
						y = layer._data.y * scale || 0,
						w = layer._data.width * scale || 0,
						h = layer._data.height * scale || 0;

				var ctx = v.canvas.getContext("2d");
				ctx.drawImage(canvas, x, y, w, h);
				viewports[0].stage.update();
			})

			viewports.forEach(function(viewport, index, array) {
				if (index == 0) return;

				var current = viewports[index];
				var previous = viewports[index-1];
				current.canvas.getContext("2d").drawImage(previous.canvas, current.x, current.y, current.width, current.height);
				//current.update();
			})

		});

	},

	setScale: function() {
		var globalWidth = System.bounds.width;
		var globalHeight = System.bounds.height;
		var aspect = globalWidth / globalHeight;
	
		var screenRatio = window.innerWidth / window.innerHeight;

		var scaleX, scaleY;
		// ultrawide displays
		if (screenRatio > aspect){
			scaleY = (window.innerHeight / globalHeight);
			scaleX = (window.innerHeight * aspect / globalWidth);
		} else {
			scaleX = (window.innerWidth / globalWidth);
			scaleY = (window.innerWidth / aspect / globalHeight)
		}

		this.scale = [scaleX, scaleY];
	},

	resize: function() {
		var s = this.scale;

		var padding = window.innerWidth - (System.bounds.width * this.scale[0]);

		$('canvas').css('marginLeft', padding / 2);
		$('.embedded').css('marginLeft', padding / 2);
		$('#console-container').css('maxWidth', System.bounds.width * s[0]);
		$('#console-container').css('maxHeight', System.bounds.height * s[1]);

		if (this.layers) this.layers.resize(s);
	},

	redraw: function() {
		var self = this;
		this.entities.children.forEach(function(key, index, array) {
			key.layer.stage.update();
		})
	},

	echo: function(message) {
		if (this.t1) this.t1.terminal.echo(message);
	},

	error: function(message) {
		if (this.t1) this.t1.terminal.error(message);
	},

	getScale: function() {
		return this.scale;
	},

	event: function(name, args) {
		var e = new createjs.Event(name)
		e.set(args)
		this.dispatchEvent(e);
	}
}