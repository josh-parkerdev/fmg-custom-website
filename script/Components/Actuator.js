System.Component = System.Component || {};

System.Component.Actuator = function(args, data) {
	var self = this;
	var defaults = {};

	this.listeners = {};

	Utils.extend(this, {
		_data: defaults
	}, args)
	Utils.extend(this._data, data);

	//start(this._data.pos[1]);

	var events = this._data.events;

	for (e in events) {
		var data = self._data.events[e];

		var listener = self.app.on(e, self.event, this, false, data);
		self.listeners[e] = listener;
	}

}

System.Component.Actuator.prototype = {
	event: function(event, data) {
		var self = this;

		var hasComponent = false;
		event.sprites.forEach(function(key, index, array) {
			if (self.name == key) {
				hasComponent = true;
			}
		})

		if (hasComponent) {
			for (func in data.functions) {
				var args = data.functions[func];
				this[func](args, data);
			}
		}
	},
	start: function(targetY, speed) {
		var sprite = System.getSprite(this).g;
		var scale = this.app.scale[0];

		createjs.Tween.get(sprite, {onChange: frame => this.update(sprite)})
		.to({y: targetY * scale}, speed)
		.call(endListener);

		function endListener(event) {

		}
	},
	slide: function(args, data) {
		var targetY = args.y;
		var speed = args.speed;
		
		this.start(targetY, speed);
	},
	update: function(event) {
		this.layer.stage.update();
	}
}