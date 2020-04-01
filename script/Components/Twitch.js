System.Component = System.Component || {};

System.Component.Twitch = function(args, data) {
	var self = this;
	var defaults = {
		options: {
			width: 400,
			height: 300
		},
		bounds: {}
	}

	Utils.extend(this, {
		_data: defaults
	}, args);
	Utils.extend(this._data, data);

	var canvas = this.layer.stage.canvas;
	var zIndex = canvas.style.zIndex;

	$player	= $('<div>', {id:'player'});
	$($player).addClass('embedded');
	this.$player = $player;

	$("body").append($player);

	this.app.on("resize", this.resize, this);
}

System.Component.Twitch.prototype = {
	api: function(request, callback) {
		var channel = this._data.options.channel;
		var clientId = this._data.api.clientId;
		var baseURL = "https://api.twitch.tv/kraken/"
		var apiCall = baseURL + request + '/' + channel + '?client_id=' + clientId;
		$.getJSON(apiCall, function(response) {
			if (callback) callback(response);
		});
	},
	resize: function(event) {
		this.setBounds();
		this.setScale();
	},
	activate: function() {
		var self = this;
		this.player = new Twitch.Player("player", this._data.options);
		//$(this.player).addClass('drawable');
		this.start();

		this.player._bridge.addEventListener("ready", function() {
			self.ready = true;
			self.play();
		});
	},

	play: function() {
		this.$player.css("visibility", "visible");
		this.setScale();
	},

	start: function() {
		this.app.echo("Twitch Player Ready");
		this.setBounds(400, 300);
		//this.setScale();
	},

	// Resize the player element and iframe to actual dimensions
	setScale: function() {
		var e = this.$player;

		var options = this._data.options;
		var stage = this.layer.stage;
		var scaleX = stage.scaleX;
		var scaleY = stage.scaleY;

		e.css("width", options.width * scaleX);
		e.css("height", options.height * scaleY);

		if (!this.player) return;
		var frame = this.player._bridge._iframe;
		frame.width = options.width * scaleX;
		frame.height = options.height * scaleY;
	},

	// Set the initial position, scale, and zIndex of the player element and iframe
	// Chrome blocks video smaller than 400 x 300 so set it to this before activating
	setBounds: function(w, h) {
		var e = this.$player;

		var stage = this.layer.stage;
		var	scaleX = stage.scaleX;
		var	scaleY = stage.scaleY;

		var bounds = this._data.bounds;
		for (property in bounds) {
			var value = bounds[property] * scaleX;
			e.css(property, value);
		}

		if (w && h) {
			var frame = this.player._bridge._iframe;
			frame.width = w;
			frame.height = h;
			e.css("width", w);
			e.css("height", h);
		} else {
			if (!this.player) return;
			var frame = this.player._bridge._iframe;
			frame.width = bounds.width * scaleX;
			frame.height = bounds.height * scaleY;
		}


		
	}
}