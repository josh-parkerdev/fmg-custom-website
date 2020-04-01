System.Component = System.Component || {};

System.Component.States = function(args, data) {
	var self = this;

	var defaults = {

	}

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);


}

System.Component.States.prototype = {
	set: function(target, state) {

		

	}
}