System.Engine = System.Engine || {};

System.Engine.Layers = function() {
	this.children = [];
}
System.Engine.Layers.prototype = new System.Engine.Entities();
System.Engine.Layers.constructor = System.Engine.Entity;

/* Layer */
System.Engine.Layer = function(args, data) {
	var self = this;
	Utils.extend(this, args, data);

	/* canvas */
	var c = document.createElement("canvas");
	c.id = this.name;
	c.style.zIndex = this._data.z;
	c.style.position = "absolute";
	c.style.pointerEvents = "none";
	c.style.visibility = this._data.hidden ? "hidden" : "visible";
	c.style.backgroundColor = this._data.backgroundColor || "transparent";
	$('#app').append(c);

	/* stage */
	this.stage = new createjs.Stage(this.name);

	createjs.Ticker.on('tick', this.tick, this);

	this.resize();
}

System.Engine.Layer.prototype = {

	resize: function() {
		var s;

		var scale = this._data.scale;
		if (scale) {
			var modifier = this.app.scale;
			var scaleX = scale * modifier[0] / 4;
			var scaleY = scale * modifier[1] / 4;

			s = [scaleX, scaleY];
		} else {
			s = this.app.scale;
		}

		var c = this.stage.canvas;
		c.width = this._data.width * s[0];
		c.height = this._data.height * s[1];
		c.style.left = this._data.x * s[0] + "px";
		c.style.top = this._data.y * s[1] + "px";

		this.stage.scaleX = s[0];
		this.stage.scaleY = s[1];

		this.pixelate();
		this.stage.update();

		var entities = this.entities;
		for (e in entities) {
			if (entities[e].resize) {
				entities[e].resize(s);
			}
		}
	},

	getEntity: function(name) {
		var entity;
		this.entities.forEach(function(key, index, array) {
			if (key.name == name) entity = key;
			return;
		})

		return key;
	},

	pixelate: function() {
		var ctx = this.stage.canvas.getContext("2d");
		ctx.mozImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	},

	tick: function(event) {
		//this.stage.update(event);
		if (this.redraw) this.stage.update(event);
	}
}