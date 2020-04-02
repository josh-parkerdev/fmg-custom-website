var FutureShip;

var System = {
	twitch: {
		left: 175,
		top: 3,
		options: {
			width: 130,
			height: 75,
			channel: "futuremangaming",
			autoplay: false,
			muted: true
		}
	},
	visualizer: {
		css: {
			position: "absolute",
			left: 11,
			top: 28,
			width: 458,
			height: 201			
		}
	},
	bounds: {
		posX: 0,
		posY: 0,
		width: 480,
		height: 270
	},
	animationQueue: [],
	spriteIndex: 0,
	queueLength: 0
};

System.initialize = function() {
	FutureShip = this.app = new App();
	var self = FutureShip;

	createjs.Ticker.setFPS(60);

	$(window).resize(function(event) {
		self.setScale();
		self.resize(self.scale);
		if (self.twitch) self.twitch.resize();
	})

	$("#app").empty();
	// terminal
	this.t1 = $('#tilda').tilda(function(command, terminal) {

		var args = command.split(" ");
			argEntity = args[0],
			argFunc = args[1];
			argParams = args[2];

		if (toLower(args[0]) == "help") {
			this.echo("Type `console [show|hide]`");
		} else {
			var entity = self[argEntity] || self.entities.getEntity(argEntity);
			var func = entity[argFunc];

			if (func) func(argParams);
		}

		function toLower(str) {
			return str.toLowerCase(str);
		}
	});

	// Console can be interacted with
	FutureShip.on("CONSOLE INITIALIZED", function(event) {
		this.console.info(
			"<h1>N.E.R.F. System</h1>" +
			"<h3>Version 1.5</h3>" +
			"<br>"
		)

		this.console.info(
			"Initializing Ship" +
			"<br>"
		)
	})

	FutureShip.on("FILE PROGRESS", function(event) {
		var verb, adj, noun
		var message = this.console.getProgress(event.progress);
		if (message) {
			verb = message[0], adj = message[1], noun = message[2]
			this.console.output(
				"<br>" +
				verb + " " + adj + " " + noun +
				"<br>"
			);
			this.console.info(verb + " " + adj + " " + noun + "<br>");
		}

	})

	FutureShip.on("FILE LOADING", function(event) {
		if (event.item.type != "image") return;
		var tab = "&nbsp&nbsp&nbsp"
		this.console.output(tab + event.item.id + "<br>");
	})

	FutureShip.on("LOADING COMPLETE", function(event) {
		var self = this;
		System.spriteIndex = 0;
		System.queueLength = 0;

		this.console.hide(250, activate);

		event.booter._queue.forEach(function(key, index, array_) {
			var set = event.booter._data[key];
			var sequence = set._data.sequence;

			var bootQueue = [];
			var sprite, entity, start;

			sequence.forEach(function(key, index, array) {
				entity = FutureShip.entities.get(key);

				sprite = System.getSprite(entity);

				if (sprite != null) {
					shade = set._data.filters.shade;

					sprite.shade = shade[0];
					sprite.filter(shade[0], null);
					//sprite.brightness(shade[0]);
					//if (sprite.transparency) sprite.transparency(shade);
					sprite.layer.stage.update();
				}

				System.queueLength++;
				bootQueue.push(entity);
			})

			System.animationQueue.push(new System.Animation(set._data, bootQueue));
		});

		function activate() {
			var queue = System.animationQueue;
			
			queue.forEach(function(key, index, array) {
				var delay = queue[index].delay
				queue[index].nextSprite(delay);
			})
		}

		this.console.info(
			"<br>" + 
			"Loading Complete"
		);

	})

}

System.Animation = function(data, queue) {
	var self = this;
	this.queue = queue;
	this.delay = data.delay;

	this.nextSprite = function(delay) {
		var lastChange = 0;
		var target = self.queue.shift();
		if (target == null) return;

		var sprite = System.getSprite(target);

		if (sprite != null) {
			var shade = data.filters.shade;
			//var opacity = data.filters.opacity;

			sprite.filter(shade[0], null);
			//sprite.brightness(shade[0]);
			//if (sprite.transparency) sprite.transparency(opacity[0]);
			//if (sprite.transparency) sprite.transparency(sprite.shade);

			if (!data.duration || data.duration == "undefined") {
				FutureShip.error("WARNING: [Boot Sequence] Sprite '" + target.name + "' duration missing");
			}

			data.tween = createjs.Tween.get(sprite)
			.wait(delay)
			.to({shade: shade[1]}, data.duration).call(beginAnimation, [target, data]);

			data.listener = data.tween.on('change', function(event, data) {
				//sprite.brightness(sprite.shade);
				if (sprite.shade != lastChange) {
					sprite.filter(sprite.shade, null);
					lastChange = sprite.shade;				
				}
				//if (sprite.transparency) sprite.transparency(sprite.opacity);
			}, this, false, data);
		} else {
			setTimeout(function() {
				beginAnimation(target);
			}, this.delay)
		}
	}

	function beginAnimation(target, data) {

		System.spriteIndex++;
		if (System.spriteIndex == System.queueLength) {
			FutureShip.echo("Boot Sequence Complete");
			FutureShip.event("BOOT COMPLETE");
		}

		if (target.activate) {
			target.activate();
		}

		self.nextSprite(0);
	}
}


System.getSprite = function(entity) {
	var sprite;
	classes = ["Sprite", "SpriteSheet", "SpriteSegment", "Rectangle"];
	classes.forEach(function(key, index, array) {
		if (entity._components[key]) {
			sprite = entity._components[key]
			return;
		}
	})

	return sprite;
}

System.getLayer = function(app, name) {
	var layer;
	app.layers.children.forEach(function(key, index, array) {
		if (name == key.name) layer = key;
	})
	return layer;
}
