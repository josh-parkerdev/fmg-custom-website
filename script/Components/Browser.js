System.Component = System.Component || {};

System.Component.Browser = function(args, data) {
	var self = this;
	var defaults = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		bounds: [0,0,0,0],
		url: "about://blank"
	}

	Utils.extend(this, {
		_data: defaults
	}, args);
	Utils.extend(this._data, data);

	var canvas = this.layer.stage.canvas;

	var url = this._data.url;

	this.$container=	$('<div>', {id: 'browser-container', class: 'embedded'});
	this.$browser=		$('<div>', {id: 'browser', class: 'noisy'});
	this.$iframe=		$('<iframe>', {id: 'browser-frame', src: url, frameborder: 0, scrollable: false});

	$(this.$container).append(this.$browser);
	$(this.$browser).append(this.$iframe);

	$("body").append(this.$container);

	this.setBounds();

	this.app.on("resize", this.resize, this);

	this.app.on("Console_expand", function(event) {
		self.state("expand", 0, null);
	});
	this.app.on("Console_contract", function(event) {
		self.state("shrink", 0, null);
	})
}

System.Component.Browser.prototype = {
	resize: function(event) {
		var $iframe = $("#browser-frame");
		var sprite = System.getSprite(this.layer.entities.ConsoleFrame).g;
		var scale = this.layer.stage.scaleY;
		this.setBounds();
		this.update(sprite, scale);
	},

	setBounds: function() {
		var e = this.$browser;
		var css = this._data.css,
			bounds = this._data.bounds,
			stage = this.layer.stage,
			scaleX = stage.scaleX,
			scaleY = stage.scaleY;

		for (property in bounds) {
			e.css(property, bounds[property] * scaleX);
		}
	},

	update: function(sprite, scale) {
		this._data.bounds.top = parseInt( $(this.layer.stage.canvas).css('top') ) + sprite.y * scale;
		this._data.bounds.height = (this._data.states.height * scale) - sprite.y * scale;
		this.$iframe.css('top', this._data.bounds.top);
		this.$iframe.css('height', this._data.bounds.height);
	},

	state: function(state, delay, callback) {
		var self = this;
		var targetY = this._data.states[state];
		var scaleY = this.layer.stage.scaleY;

		var sprite = System.getSprite(this.layer.entities.ConsoleFrame).g;

		var tween = createjs.Tween.get(sprite, {onChange: frame => this.update(sprite, scaleY)})
		.wait(delay)
		.to({y: targetY}, 2000, createjs.Ease.getPowInOut(3))
		.call(endListener);
		//createjs.Ticker.setFPS(60);
		this.ticker = createjs.Ticker.on("tick", this.layer.stage);
		
		function endListener() {
			createjs.Ticker.off("tick", self.ticker);
			tween.removeAllEventListeners();
			delete self.ticker;
			//createjs.Ticker.setFPS(30);
			if (callback) callback.call();
		}
	}
}