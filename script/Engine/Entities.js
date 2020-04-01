System.Engine = System.Engine || {};

System.Engine.Entities = function() {
	this.children = [];
};

System.Engine.Entities.prototype = {
	add: function(object) {
		var args = {};
		for (var i = 1; i < arguments.length; i++) {
			Utils.extend(args, arguments[i]);
		}

		/* create new object */
		if (typeof object === "function") {
			args.collection = this;
			var e = new object(args); }

		/* adopt existing object */
		else {
			e = object;
			e.collection = this;
		}
		this.children.push(e);
		return e;
	},

	get: function(name) {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var entity = this.children[i];
			if (entity.name === name) return entity;
		}
	},

	cleanup: function() {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var entity = this.children[i];
			if (entity._remove) {
				this.children.splice(i--, 1);
				len--;
			}

		}
		this.dirty = false;
	},

	resize: function(s) {
		var self = this;
		this.children.forEach(function(element) {
			if (element.resize) element.resize(s);
		});
	}

}

System.Engine.Entity = function(args, data) {
	var self = this;
	Utils.extend(this, {
	}, args);

	/*data._requires.forEach(function(key, index, array) {
		var _data = data._data[key]._data;
		var component = new System.Component[key](args, _data, self);
		self[key] = component;
	})*/
	
}

System.Engine.Entity.prototype = {

	getComponent(name) {
		return this._components[name];
	},

	tick: function(event) {
		var self = this;
		
	},

	resize: function(s) {
		var self = this;
		this._requires.forEach(function(e) {
			var c = self._components[e];
			if (c.resize) c.resize(s);
		})
	},

	activate: function() {
		var self = this;
		this._requires.forEach(function(key, index, array) {
			var component = self._components[key];
			//var component = self[key];
			if (component.activate) component.activate();
		})
	}
}