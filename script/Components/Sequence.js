System.Component = System.Component || {};

System.Component.Sequence = function(args, data) {
	var self = this;

	Utils.extend(this, {
		random: true
	}, args, data);

}

System.Component.Sequence.prototype = {

	init: function(entity) {
		var SpriteSheet = this.parent.SpriteSheet;
		var animation = SpriteSheet.play;
		if (animation) entity.play(animation);
	},
	
	tick: function(event) {

	},

	play: function(animation) {
		if (animation === 'random') {
			this.random = true;
			this.rand() }
		else {
			this.start(animation);
		}

	},

	start: function(animation) {
		var parent = this.parent;
		var sprite = parent.SpriteSheet.sprite;

		sprite.gotoAndPlay(animation);
	},

	stop: function() {
		this.random = false;
	},

	rand: function() {
		var parent = this.parent;
		var Animation = parent.Animation;
		var Sequence = parent.Sequence;
		var SpriteSheet = parent.SpriteSheet;

		var sprite = parent.SpriteSheet.sprite;
		var spriteSheet = sprite.spriteSheet;

		setTimeout(function() {
			if (!Sequence.random) return;

			var numFrames = parent.SpriteSheet.numFrames - 1;
			var randFrame = Math.floor(Math.random() * numFrames);

			var omit = Sequence.omitFrames || [];

			for (var i = 0; i < omit.length; i++) {
				if (omit[i] === randFrame) return;
			}

			sprite.gotoAndStop(randFrame);

			Sequence.rand();

		}, getRandomIntInclusive(100, 300));

		function getRandomIntInclusive(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	},

}