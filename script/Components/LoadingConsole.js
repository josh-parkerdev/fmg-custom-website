System.Component = System.Component || {};

System.Component.LoadingConsole = function(args, data) {

	var self = this;
	var defaults = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		bounds: [0,0,0,0]
	}

	Utils.extend(this, {
		_data: defaults
	}, args);
	Utils.extend(this._data, data);

	var canvas = this.layer.stage.canvas;

	var image, imageSrc;
	if (this._data.image != null) {
		image = this._data.image;
		imageSrc = this._data.imageSrc;
	}

	//createjs.Ticker.on('tick', this.tick, this);

	/* create html elements */

	/*$container= 	$('<div>', {id: 'console-container', class: 'embedded'})
	$console=		$('<div>', {id: 'console', class: 'noisy'});
	$frame=			$('<div>', {id: 'console-frame', class: 'frame'});
	$scanlines=		$('<div>', {id: 'console-scanlines', class: 'overlay scanlines noclick'})
	$glow=			$('<div>', {id: 'console-glow', class: 'overlay glow noclick'})
	$info=			$('<div>', {id: 'console-info', class: 'column info'})
	$output=		$('<div>', {id: 'console-output', class: 'column output'})
	$left_column=	$('<div>', {id: 'console-left-column', class: 'overlay column left'});
	$right_column=	$('<div>', {id: 'console-right-column', class: 'overlay column right'});

	$copyright=		$('<div>', {id: 'copyright', class: 'fixed footer'});
	$($copyright).html("<small>&copy;2016 Josh Parker - FuturemanGaming</small>");
	$($console).append($copyright);

	$input=			$('<div>', {id: 'console-input', class: 'column input'})
	//$($input).html("Press Any Key to Continue");

	this.$info = $info;
	this.$output = $output;
	this.$console = $console;

	$($container).append($console);

	$($console).append($frame);
	$($console).append($scanlines);
	$($console).append($glow);

	$($frame).append($left_column);
	$($frame).append($right_column);

	$($left_column).append($info);
	$($info).append($input);

	$($right_column).append($output);

	$("body").append($container);*/

	// bounds
	this.setBounds();

	this.app.on("resize", this.resize, this);

	this.app.on("Console_expand", function(event) {
		self.state("expand", 0, null);
	});
	this.app.on("Console_contract", function(event) {
		self.state("shrink", 0, null);
	});
}

System.Component.LoadingConsole.prototype = {
	resize: function(event) {
		var $console = $("#console");
		var sprite = System.getSprite(this.layer.entities.ConsoleFrame).g;
		var scale = this.layer.stage.scaleY;
		this.setBounds();
		this.update(sprite, scale);
	},

	log: function(s, newline) {
		$(this.$info).append(s);
		if (newline) $(this.$info).append('<br>');
	},

	clear: function(frame) {
		var element = $("#console-" + frame);
		$(element).empty();

	},

	info: function(s, newline) {
		$(this.$output).append(s);
		if (newline) (this.$output).append('<br>');
		$(this.$output).scrollTop(this.$output.height());
	},
	
	state: function(state, delay, callback) {
		var self = this;
		var targetY = this._data.states[state];
		var scaleY = this.layer.stage.scaleY;

		//TODO: Remove hard-coded reference
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
	},

	update: function(sprite, scale) {
		this._data.bounds.top = parseInt( $(this.layer.stage.canvas).css('top') ) + sprite.y * scale;
		//this._data.bounds.height = (this._data.states.height * scale) - sprite.y * scale;
		this.$console.css('top', this._data.bounds.top);
		//this.$console.css('height', this._data.bounds.height);
	},

	setBounds: function() {
		var e = this.$console;
		var css = this._data.css,
			bounds = this._data.bounds,
			stage = this.layer.stage,
			scaleX = stage.scaleX,
			scaleY = stage.scaleY;

		for (property in bounds) {
			e.css(property, bounds[property] * scaleX);
		}
		// attributes are set in css stylesheet
		/*for (attribute in css) {
			e.css(attribute, css[attribute]);
		}*/

		// scale bounds to stage
		/*css.left *= scaleX;
		css.top *= scaleY;
		css.width *= scaleX;
		css.height *= scaleY;
		css.marginTop *= scaleY;
		css.marginLeft *= scaleX;*/

		// set css property with position offset
		//css.left += parseInt( $(this.layer.stage.canvas).css('left') );
		//css.top += parseInt( $(this.layer.stage.canvas).css('top') );


	}
}