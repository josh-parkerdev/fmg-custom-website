System.Component = System.Component || {};

System.Component.Rectangle = function(args, data) {
	var self = this;
	var defaults = {
		x: 0,
		y: 0,
		width:100,
		height:100,
		shade: 1,
		color: "#000000"
	};

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

	var stage = this.layer.stage;

	var graphics = new createjs.Graphics().beginFill(this._data.color).drawRect(this._data.x, this._data.y, this._data.width, this._data.height);
	this.g = new createjs.Shape(graphics);

	this.brightness(this._data.shade);

	this.cache();

	stage.addChild(this.g);
	stage.update();
	
}

System.Component.Rectangle.prototype = {

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

		this._data.shade = shade;

		g.filters = [
			new createjs.ColorFilter(shade,shade,shade,1, 0,0,0,1)
		];

		if (g.cacheID > 0) g.updateCache();
		stage.update();
	},

	transparency: function(shade) {
		var stage = this.layer.stage;
		var g = this.g;

		this._data.transparency = shade

		g.shade = shade;
	},

	cache: function() {
		var g = this.g;

		var bounds = [this._data.x, this._data.y, this._data.width, this._data.height];

		g.cache(bounds[0], bounds[1], bounds[2], bounds[3]);
	},

	uncache: function() {
		var g = this.g;

		g.uncache();
	}
}