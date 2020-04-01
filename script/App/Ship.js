var entities, controller;
var loader, manifest;

System.Ship = function(app) {
	this.app = app;
	this.loadInterval = 0;

	this.animate = true;
	this.scale = 4;
	this.channel = "futuremangaming";

	createjs.EventDispatcher.initialize(System.Ship.prototype);

	this.load = function() {
		var self = this;

		this.loader = new System.Engine.Loader('data/data.json');
		this.booter = new System.Engine.Booter('data/boot.json');

		/* loader events */
		this.loader.on('ready', function(event) {
			event.queue.load();

			this.send(event)
		}, this);

		/* Log item loading messages to console */
		this.loader.on('filestart', function(event) {
			this.send(event, {
				item: event.item
			});
		}, this);

		/* Update console log with Simcity loading messages */
		this.loader.on('progress', function(event) {
			this.send(event, {
				progress: event.progress
			})			
		}, this);

		/* Initiate startup sequence */
		this.loader.on('complete', function(event) {
			var layers = this.loader._layers;

			this.send(event, {
				booter: this.booter,
				loader: this.loader,
				layers: layers
			});
		}, this);
	}

	this.boot = function() {
		var lastTarget;
		var self = this;
		this.app.echo("Build");
		console.log("Build");

		System.layers = System.layers || new System.Engine.Layers;
		System.entities = System.entities || new System.Engine.Entities;

		/* Elements */
		var layers = this.loader._layers;
		System.buildElements(this, layers);

		/* Boot sequence */
		var queue = this.booter._queue;
		System.bootSequence(this, queue)
	}

	this.resize = function(data) {
		/* This fires an event when the window is done being resized*/
		if (!data) return;

		data.time = new Date();
		if (data.timeout === false) {
			data.timeout = true;
			setTimeout(function() {
				resizeEnd(data);
			}, data.delta)
		}

		function resizeEnd(data) {
			if (new Date() - data.time < data.delta) {
				setTimeout(function() {
					resizeEnd(data)
				}, data.delta);
			} else {
				data.timeout = false;
				// Do something after resizing is done
			}
		}
			

	}

}

System.Ship.prototype = {
	send: function(event, args) {
		var e = event.clone()
		e.set(args)

		// check for missing event dispatcher
		this.dispatchEvent(e)
	}
}