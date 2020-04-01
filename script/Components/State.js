System.Component = System.Component || {};

System.Component.State = function(args, data) {

	Utils.extend(this, {
		index: 0,
		current: '',
		active: false,
		done: false,
		listener: {},
		
		debug: false
	}, args, data)

}

System.Component.State.prototype = {

	set: function(state) {
		if (this.debug) console.log(state);
		if (state === 'clear') {
			this.stop();
			return;
		}

		this.current = state;
		this.active = true;

		this.start();
	},

	start: function() {
		var self = this;
		var Animation = this.parent.Animation;
		var SpriteSheet = this.parent.SpriteSheet;
		var Sequence = this.parent.Sequence;
		var sprite = SpriteSheet.sprite;
		var anim = Animation[this.current].play;
		var trigger = Animation[this.current].trigger;
		var count = Animation[this.current].count;

		this.count = count;
		this.done = false;

		if (Sequence && Sequence.play) Sequence.stop();
		if (anim) sprite.gotoAndPlay(anim);
		sprite.on('animationend', this.listen, this);
	},

	listen: function(event) {
		var animation = this.parent.Animation[this.current];
		var trigger = animation.trigger || animation.play;

		if (event.name === trigger) {
			this.end(animation);
		}

	},

	end: function(animation) {
		if (this.count && this.index <= this.count) {
			this.index++;
			return;
		}
		this.count = 0;
		this.index = 0;
		var entity = System.ship.entities.get(animation.target);
		entity.SpriteSheet.sprite.removeAllEventListeners('animationend');
		entity.State.set(animation.state);
	},

	stop: function() {
		var Sequence = this.parent.Sequence;
		if (Sequence && Sequence.play) Sequence.play('random');

		this.current = '';
		this.active = false;
		this.done = true;

		this.trigger = null;
		this.target = null;


	},

	update: function() {

	}

}