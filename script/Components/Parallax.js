System.Component = System.Component || {};

System.Component.Parallax = function(args, data, parent) {
	var self = this;
	var defaults = {};

	Utils.extend(this, {
		_data: defaults
	}, args)
	Utils.extend(this._data, data);
	
	this.parent = parent;

	var sprite = this._components.Sprite.g;
	var speed = this._data.speed;

	start(this._data.pos[1]);

	function start(targetY) {
		var tween = createjs.Tween.get(sprite, {onChange: frame => self.update(sprite)})
		.to({y: targetY}, speed, createjs.Ease.getPowInOut(2))
		.call(endListener);
	}

	function endListener(event) {
		var pos = self._data.pos;
		var targetY;

		switch(event.target.y) {
			case pos[0]:
				targetY = pos[1];
				break;
			case pos[1]:
				targetY = pos[0];
				break;
		}

		start(targetY);
	}

}

System.Component.Parallax.prototype = {
	update: function(event) {
		this.layer.stage.update();
		//console.log(event.y)
	}
}