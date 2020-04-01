System.Component = System.Component || {};

System.Component.Sound = function(args, data) {
	
	Utils.extend(this, {
		indexes: {}
	}, args, data)

	for (i in this.actions) {
		var action = this.actions[i];
		this.indexes[i] = action;
	}

}

System.Component.Sound.prototype = {
	
	play: function(action) {
		var index = this.indexes[action];
		var instance = createjs.Sound.play(index);
	},

	/*roll: function(arr) {
		var length = arr.length;
		var index = getRandomInt(0, length - 1)

		return arr[index];

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}*/

}