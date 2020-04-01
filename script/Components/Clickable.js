System.Component = System.Component || {};

System.Component.Clickable = function(args, data) {
	var self = this;
	var defaults = {}

	Utils.extend(this, {
		_data: defaults,
	}, args);

	Utils.extend(this._data, data);

	this.active = false;

	var sprite = System.getSprite(this);
	var scale = this.app.scale;

	this.layer.stage.enableMouseOver(20);

	var x = sprite._data.x * scale[0],
		y = sprite._data.y * scale[1],
		w = sprite._data.width * scale[0],
		h = sprite._data.height * scale[1];

	var hit = new createjs.Shape();
	hit.graphics.beginFill("#000").drawRect(x, y, w, h);
	sprite.g.hit = hit

	sprite.g.on("mouseover", this.focus, this, false)
	sprite.g.on("mouseout", this.blur, this, false);
	sprite.g.on("click", this.click, this, false);

	this.layer.stage.canvas.style.pointerEvents = "all";

}

System.Component.Clickable.prototype = {

	activate: function() {
		this.active = true;
	},

	click: function(event) {
		if (!this.active) return;

		var event = new createjs.Event("Clickable_click");
		event.set({"name": this.name})
		this.app.dispatchEvent(event);

		/*var url = this._data[event.type].url;
		if (url) window.open(url, "Timeline");

		var entity = this.layer.parent.entities.get(this._data[event.type].target);
		var sprite = System.getSprite(entity);
		var play = this._data[event.type].play;

		if (play) sprite.g.gotoAndPlay(play);*/
	},

	focus: function(event) {
		if (!this.active) return;
		this.layer.stage.cursor = "pointer";

		var event = new createjs.Event("Clickable_focus");
		event.set({"name": this.name})
		this.app.dispatchEvent(event);


		/*var entity = this.app.entities.get(this._data[event.type].target);
		var sprite = System.getSprite(entity);

		sprite.g.gotoAndPlay(this._data[event.type].play);*/
	},

	blur: function(event) {
		if (!this.active) return;

		var event = new createjs.Event("Clickable_blur");
		event.set({"name": this.name})
		this.app.dispatchEvent(event);
	},

	end: function(event) {

	}

}

