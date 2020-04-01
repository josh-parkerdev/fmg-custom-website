System.Console = function(app) {
	var self = this;
	this.app = app;

	createjs.EventDispatcher.initialize(System.Console.prototype);

	this.ready = true;
	this.hidden = false;

	this.messages = [
		['recalibrating','excavating','finalizing','acquiring','locking','fueling','extracting','binding'],
		['flux','data','spline','storage','plasma','cache','laser'],
		['capacitor','conductor','assembler','disk','detector','post-processor','integrator']
	]
	this.loadInterval = 7;

	$container= 	$('<div>', {id: 'console-container', class:"embedded"})
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

	$("body").append($container);

	this.send("CONSOLE INITIALIZED");

	// External methods
	this.hide = function(delay, callback) {
		if (!self.ready || self.hidden) return;

		self.ready = false;
		var data = [delay || 0, 100, 0];
		self.fade(data, function() {
			self.ready = true;
			self.hidden = true;
			if (callback) callback();
		});
	};

	this.show = function(delay, callback) {
		if (!self.ready || !self.hidden) return;

		self.ready = false;
		var data = [delay || 0, 0, 100];
		self.fade(data, function() {
			self.ready = true;
			self.hidden = false;
			if (callback) callback();
		});
	};

	this.clear = function(frame) {
		var element = $('#console-' + frame);
		$(element).empty();
	}

	this.output = function(message) {
		$(self.$output).append(message);
		$(self.$output).scrollTop(self.$output.height());
	}

	this.info = function(message) {
		$(self.$info).append(message);
	}
}

System.Console.prototype = {
	fade: function(data, callback) {
		var self = this;
		var c = $(this.$console);

		var delay = data[0];
		var start = data[1];
		var end = data[2];
		c.opacity = start;

		var tween = createjs.Tween.get(c, {onChange: function(event) { c.css("opacity", c.opacity / 100) }})
		.wait(delay)
		.to({opacity: end}, 500)
		.call(callback);
	},

	send: function(event, args) {
		var e;

		e = typeof event == "string" ? new createjs.Event(event) : event.clone();
		if (args) e.set(args);

		// check for missing event dispatcher
		this.dispatchEvent(e);
	},

	getProgress: function(percent) {
		var progress = Math.floor(percent * this.loadInterval)
		if (this.progressLast != progress && percent < 1) {
			var message = this.loadingMessage();
			this.progressLast = progress;
			return message;
		}
		this.progressLast = progress;
	},

	loadingMessage: function() {
		var verb = randMessage(this.messages[0]);
		var adj	 = randMessage(this.messages[1]);
		var noun = randMessage(this.messages[2]);

		function randMessage(words) {
			var rand = Math.floor(Math.random() * words.length);
			var result = words.splice(rand, 1)[0];			

			return result.charAt(0).toUpperCase() + result.slice(1)
		}
		return [verb, adj, noun]
	}
}