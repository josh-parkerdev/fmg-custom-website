System.Component = System.Component || {};

System.Component.SpriteSegment = function(args, data) {
	var self = this;
	var defaults = {
		x: 0,
		y: 0,
		index: 0
	}

	Utils.extend(this, {
		_data: defaults
	}, args);
	Utils.extend(this._data, data);

	this.children = [];

	var stage = this.layer.stage;

	var frames = []
	this._data.segments.forEach(function(entry, index) {
		var image = args.loader.queue.getResult(self._data.image);
		var w = image.width / self._data.count;
		frames.push([entry[0], entry[1], self._data.width, self._data.height]);	// off
		frames.push([entry[0] + w, entry[1], self._data.width, self._data.height]);	// on
	})

	var data = {
		animations: this._data.animations,
		images: [args.loader.queue.getResult(self._data.image)],
		frames: frames
	}

	this._data.segments.forEach(function(entry, index) {
		var sheet, sprite;
		var regX, regY;

		sheet = new createjs.SpriteSheet(data);
		sprite = new createjs.Sprite(sheet);

		var x = entry[0];
		var y = entry[1];
		self.setBounds(sprite, x, y)

		stage.addChild(sprite);
		stage.update();

		self.children.push(sprite);

		self.frame(index, 0);
	});

	this.cache();

	stage.update();


}

System.Component.SpriteSegment.prototype = {

	activate: function() {
		this.uncache();
	},

	frame: function(index, frame) {
		var s = this.children[index], ss = s.spriteSheet,
			c = this._data.count, cf = s.currentFrame;

		if (frame > c-1) {
			console.log("SpriteSegment - frame out of range");
			frame = 0;
		}
		s.gotoAndStop(index * c + frame);
	},

	setBounds: function(object, x, y) {
		object.x = x;
		object.y = y;
	},

	filter: function(shade, alpha) {
		var stage = this.layer.stage;
		var g = this.g;

		shade = shade || 1;
		alpha = alpha || 1;

		for (i=0; i<this.children.length; i++) {
			var sprite = this.children[i];

			sprite.filters = [
				new createjs.ColorFilter(shade,shade,shade,alpha, 0,0,0,1)
			]

			if (sprite.cacheID > 0) sprite.updateCache();
			stage.update();
		}

	},

	brightness: function(shade) {
		var stage = this.layer.stage;

		for (i=0; i<this.children.length; i++) {
			var sprite = this.children[i];
			
			sprite.filters = [
				new createjs.ColorFilter(shade,shade,shade,1, 0,0,0,1)
			];

			if (sprite.cacheID > 0) sprite.updateCache();
			stage.update();
		}
	},

	cache: function() {
		for (i=0; i<this.children.length; i++) {
			var sprite = this.children[i];

			var obj = sprite.getBounds();
			var bounds = Object.keys(obj).map(key => obj[key]);
			sprite.cache(bounds[0], bounds[1], bounds[2], bounds[3]);
		}
	},

	uncache: function() {
		for (i=0; i<this.children.length; i++) {
			var sprite = this.children[i];

			sprite.uncache();
		}
	}

}