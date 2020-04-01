System.Component = System.Component || {};

System.Component.Visualizer = function(args, data) {
	var self = this;
	var defaults = {
		css: {
			left: 0,
			top: 0,
			width: "100%",
			height: "100%"
		}
	}

	Utils.extend(this, {
		_data: defaults
	}, args)

	Utils.extend(this._data, data);

	this.$html = load('visualizer/index.html');
	this.$html.addClass('embedded');

	$('body').append(this.$html);

	this.resize();

	this.app.on("resize", this.resize, this);

}

System.Component.Visualizer.prototype = {
	resize: function(event) {
		var e = $(this.$html);
		var css = this._data.css,
			bounds = this._data.bounds,
			stage = this.layer.stage,
			sx = stage.scaleX,
			sy = stage.scaleY;

		for (property in bounds) {
			e.css(property, bounds[property] * sx);
		}
	}
}