System.Component = System.Component || {};

System.Component.Binary = function(args, data) {
	var self = this;
	var defaults = {
		index: 0
	}
	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

}

System.Component.Binary.prototype = {

	activate: function() {

		var target = this._data.target;
		var entity = this._components.SpriteSegment;

		var data = {
			index: 0,
			stage: this.layer.stage,
			count: entity.children.length - 1,
			frame: entity.frame,
			entity: entity
		}

		data.ticker = createjs.Ticker.on('tick',
			this.tick, this, false, data
		);

		this.data = data;
	},

	stop: function() {
		createjs.Ticker.off('ticker', this.data.ticker);
	},

	tick: function(event, data) {
		time = Math.floor(event.time / 1000);
		if (time == this.prevTime) return;
		this.prevTime = time;

		for (i=data.count; i >= 0; i--) {
			var bitMask = 1 << data.count-i;

			var bit = (data.index & bitMask) ? 1 : 0;
			data.entity.frame(i, bit);
		}
		data.index++;

		data.stage.update();

	}
	
}