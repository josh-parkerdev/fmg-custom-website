System.Component = System.Component || {};

System.Component.Menu = function(args, data) {
	var self = this;
	var defaults = {
		x:0,
		y:0,
		width:0,
		height: 0
	}

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

	this.alpha = 0;

	var stage = this.layer.stage;

	stage.canvas.style.pointerEvents = "all";
	stage.enableMouseOver(30);

	var listLeft = this.listLeft = [];
	var listRight = this.listRight = [];

	// Menu labels
	var labels = this._data.labels;
	var links = this._data.links;
	this.buildList(listLeft, labels, "selections");
	this.buildList(listRight, links, "links-support");
	/*this.shapes.forEach(function(element, index, array) {
		element.alpha = 0;
	})*/

	listLeft.forEach(function(element, index, array) {
		element.alpha = 0;
	});
	listRight.forEach(function(element, index, array) {
		element.alpha = 0;
	});

	this.listeners = {};

	var events = this._data.events;
	for (e in events) {
		var data = self._data.events[e];

		var listener = self.app.on(e, self.event, this, false, data);
		self.listeners[e] = listener;
	}
}

System.Component.Menu.prototype = {
	buildList: function(arr, data, list) {
		var self = this;
		var obj = data.list[list];

		obj.forEach(function(element, index, array) {
			var stage = self.layer.stage;

			var x = data.x + data.xOffset * index;
			var y = data.y + data.yOffset * index;
			var font = data.font;
			var color = data.color;
			var size = data.size;

			var line = data.list[list][index];
			var type = line[0];
			var txt = line[1];

			var text = new createjs.Text(txt, font, color);
			text.index = index;
			text.data = line;

			text.blurColor = "#71f341";
			text.focusColor = "#6abe30";
			text.size = size;
			text.x = x;
			text.y = y;

			var lineWidth = text.getMeasuredWidth();
			var lineHeight = text.getMeasuredHeight();

			var hit = new createjs.Shape();
			hit.index = index;
			hit.graphics.beginFill("#000000").drawRect(0,0, lineWidth + 3, lineHeight * 2);
			text.hitArea = hit;

			if (type == "selection" || type == "link") {
				text.on("mouseover", self.interaction, self, false);
				text.on("mouseout", self.interaction, self, false);
				text.on("click", self.interaction, self, false);
			}

			arr.push(text);
			stage.addChild(text);
			stage.update();
		})
	},
	interaction: function(event) {
		var target = event.target;
		var index = target.index;

		var lineWidth = target.getMeasuredWidth();
		var lineHeight = target.getMeasuredHeight();

		if (target.alpha > 0) {

			var color = (event.type == "mouseover") ? target.focusColor : target.blurColor;
			target.color = color;

			if (event.type == "click") {
				var type = target.data[0];

				// Build submenu
				if (type == "selection") {
					this.clearList(this.listRight);

					var arr = this.listRight;
					var list = this._data.links;
					var subMenu = target.data[2];
					this.buildList(arr, list, subMenu);
				// Open new link
				} else if (type == "link") {
					var url = target.data[2];
					this.openURL(url);
				}
			}

			this.layer.stage.update();
		}

	},

	clearList: function(arr) {
		var stage = this.layer.stage;
		arr.forEach(function(element, index, array) {
			stage.removeChild(element);
			delete element;
		})
	},

	openURL: function(url) {
		if (url) {
			window.open(url);
		}
	},

	event: function(event, data) {
		var self = this;

		var hasComponent = false;
		data.components.forEach(function(key, index, array) {
			if (event.name == key) {
				hasComponent = true;
			}
		})

		if (hasComponent) {
			for (func in data.functions) {
				var args = data.functions[func];
				this[func](args, data)
			}
		}
	},

	fade: function(data) {
		var tween;
		var listener;

		var sprite = this;
		var options = data[sprite.alpha]

		tween = createjs.Tween.get(sprite)
		.wait(options.delay)
		.to({alpha: options.end}, options.duration)

		listener = tween.on('change', function(event, data) {
			var alpha = sprite.alpha;
			this.listLeft.forEach(function(element, index, array) {
				element.alpha = alpha;
			});
			this.listRight.forEach(function(element, index, array) {
				element.alpha = alpha;
			});

			this.layer.stage.update();
			
		}, this, false, data);
	},

	transparency: function(g, a) {
		var stage = this.layer.stage;

		g.filters = [new createjs.ColorFilter(1,1,1,a, 0,0,0,1)];

		if (g.cacheID > 0) g.updateCache();
		stage.update();
	}
}