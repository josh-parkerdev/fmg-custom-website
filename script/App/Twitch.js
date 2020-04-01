System.Twitch = function(app, options) {
	this.app = app;
	var self = this;

	this.data = System.twitch;

	this.$player = $('<div>', {id: 'player', class: 'embedded'})
	$('body').append(this.$player);

	this.player = new Twitch.Player('player', this.data.options);
	this.start();

	this.player._bridge.addEventListener('ready', function() {
		self.ready = true;
		self.play();
	})
}

System.Twitch.prototype = {
	setBounds: function(w, h) {
		var e = this.$player;

		var scale = this.app.scale;
		
		var bounds = {
			left: this.data.left,
			top: this.data.top
		}

		for(property in bounds) {
			var value = bounds[property] * scale[0];
			e.css(property, value);
		}

		if (w && h) {
			var frame = this.player._bridge._iframe;
			frame.width = w;
			frame.height = h;
			e.css('width', w);
			e.css('height', h);
		} else {
			var frame = this.player._bridge._iframe;
			frame.width = bounds.width * scale[0];
			frame.height = bounds.height * scale[1];
		}
	},

	setScale: function() {
		var e = this.$player;

		var options = this.data.options;
		var scale = this.app.scale;

		e.css('width', options.width * scale[0]);
		e.css('height', options.height * scale[1]);

		var frame = this.player._bridge._iframe;
		frame.width = options.width * scale[0];
		frame.height = options.height * scale[1];
	},

	start: function() {
		this.app.echo("Twitch Player Ready");
		this.setBounds(400, 300);
		//createjs.Ticker.setFPS(60);
	},

	play: function() {
		this.$player.css('visibility', 'visible');
		this.setScale();
		//createjs.Ticker.setFPS(60);
	},

	resize: function(event) {
		this.setBounds();
		this.setScale();
	}
}