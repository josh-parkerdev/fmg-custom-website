var Utils = {

	extend: function() {
		for (var i = 1; i < arguments.length; i++) {
			for (var j in arguments[i]) {
				arguments[0][j] = arguments[i][j];
			}
		}

		return arguments[0];
	},

	distance: function(x1, y1, x2, y2) {
		if (arguments.length > 2) {
			var dx = x1 - x2;
			var dy = y1 - y2;

			return Math.sqrt(dx * dx + dy * dy);
		} else {
			var dx = x1.x - y1.x;
			var dy = x1.y - y1.y;

			return Math.sqrt(dx * dx + dy * dy);
		}
	},

	random: function(a, b) {

		if (a === undefined) {
			return Math.random();
		} else if (b !== undefined) {
			return Math.floor(a + Math.random() * Math.abs(b - a + 1));
		} else {
			if (a instanceof Array) return a[(a.length + 1) * Math.random() - 1 | 0];
			else {
				return a[this.randomElement(Object.keys(a))];
			}
		}

	},

	randomElement: function(a) {
		if (a instanceof Array) return a[(a.length + 1) * Math.random() - 1 | 0];
		else {
			return a[this.randomElement(Object.keys(a))];
		}
	},

	moveTo: function(value, target, step) {
		if (value < target) {
			value += step;
			if (value > target) value = target;
		}
		if (value > target) {
			value -= step;
			if (value < target) value = target;
		}

		return value;
	},

	lookAt: function(a, b) {
		var angle = Math.atan2(b.y - a.y, b.x - a.x);
		if (angle < 0) angle = Math.PI * 2 + angle;
		return angle;
	},

	circWrappedDistance: function(a, b) {
		return this.wrappedDistance(a, b, Math.PI * 2)
	},

	wrappedDistance: function(a, b, max) {
		if (a === b) return 0;
		else if (a < b) {
			var l = -a - max + b;
			var r = b - a;
		} else {
			var l = b - a;
			var r = max - a + b;
		}

		if (Math.abs(l) > Math.abs(r)) return r;
		else return l;
	},

	circWrap: function(val) {
		return this.wrap(val, 0, Math.PI * 2);
	},

	wrap: function(value, min, max) {
		if (value < min) return max + (value % max);
		if (value >= max) return value % max;
		return value;
	},

	wrapTo: function(value, target, max, step) {
		if (value === target) return target;

		var result = value;

		var d = this.wrappedDistance(value, target, max);

		if (Math.abs(d) < step) return target;

		result += (d < 0 ? -1 : 1) * step;

		if (result > max) {
			result = result - max;
		} else if (result < 0) {
			result = max + result;
		}

		return result;
	},

	circWrapTo: function(value, target, step) {
		return this.wrapTo(value, target, Math.PI * 2, step);
	},

	sincos: function(angle, radius) {

		if (arguments.length === 1) {
			radius = angle;
			angle = Math.random() * 6.28;
		}

		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius
		};
	},

	pointInRect: function(x, y, rx, ry, rw, rh) {
		return !(x < rx || y < ry || x > rx + rw || y > ry + rh);
	},

	rectInRect: function(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
		return !(r2x > r1x + r1w ||
			r2x + r2w < r1x ||
			r2y > r1y + r1h ||
			r2y + r2h < r1y);
	},

	lineCircleIntersection: function(ax, ay, bx, by, cx, cy, r) {

		var result = {
			inside: false,
			tangent: false,
			intersects: false,
			enter: null,
			exit: null
		};
		var a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
		var b = 2 * ((bx - ax) * (ax - cx) + (by - ay) * (ay - cy));
		var cc = cx * cx + cy * cy + ax * ax + ay * ay - 2 * (cx * ax + cy * ay) - r * r;
		var deter = b * b - 4 * a * cc;

		result.distance = Math.sqrt(a);

		if (deter <= 0) {
			result.inside = false;
		} else {
			var e = Math.sqrt(deter);
			var u1 = (-b + e) / (2 * a);
			var u2 = (-b - e) / (2 * a);
			if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
				if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
					result.inside = false;
				} else {
					result.inside = true;
				}
			} else {

				if (0 <= u2 && u2 <= 1) {
					result.enter = this.interpolatePoints(ax, ay, bx, by, 1 - u2);
				}
				if (0 <= u1 && u1 <= 1) {
					result.exit = this.interpolatePoints(ax, ay, bx, by, 1 - u1);
				}
				result.intersects = true;
				if (result.exit != null && result.enter != null && result.exit[0] == result.enter[0] && result.exit[1] == result.enter[1]) {
					result.tangent = true;
				}
			}
		}
		return result.intersects ? result : false;
	},

	/* http://keith-hair.net/blog/2008/08/05/line-to-circle-intersection-data/ */

	interpolatePoints: function(ax, ay, bx, by, f) {

		return [f * ax + (1 - f) * bx, f * ay + (1 - f) * by];
	},

	array2d: function(width, height, value) {
		var result = [];

		if (value === undefined) value = 0;

		for (var x = 0; x < width; x++) {
			result[x] = [];
			for (var y = 0; y < height; y++) {
				result[x][y] = 0;
			}
		}
	},


	rotate: function(ax, ay, bx, by, a) {

		return [
			bx + (ax - bx) * Math.cos(a) - (ay - by) * Math.sin(a),
			by + (ax - bx) * Math.sin(a) + (ay - by) * Math.cos(a)
		];

	},

	repulse: function(a, b) {
		var angle = this.lookAt(b, a);

		a.x = b.x + Math.cos(angle) * (a.radius + b.radius);
		a.y = b.y + Math.sin(angle) * (a.radius + b.radius);
	},

	clonePolygon: function(polygon) {
		var result = [];

		for (var i = 0; i < polygon.length; i++) {
			result.push([polygon[i][0], polygon[i][1]]);
		}

		return result;
	},

	scalePolygon: function(polygon, scale) {

		for (var i = 0; i < polygon.length; i++) {

			var vertex = polygon[i];

			vertex[0] *= scale;
			vertex[1] *= scale;
		}

		return polygon;
	},

	interval: function(key, interval, object) {

		if (!object) object = this;

		if (!object.throttles) object.throttles = {};
		if (!object.throttles[key]) object.throttles[key] = 0;

		if (!object.throttleLastCall) object.throttleLastCall = object.delta;

		var delta = object.delta - object.throttleLastCall;

		if (delta) {
			object.throttleLastCall = object.delta;

			for (var key in object.throttles) {
				object.throttles[key] -= delta;
			}
		}

		if (object.throttles[key] <= 0) {
			object.throttles[key] = interval;
			return true;
		} else return false;

	},


	saw: function(t) {
		if (t < 0.5) {
			return t / 0.5;
		} else {
			return 1 - (t - 0.5) / 0.5;
		}
	},

	/*colCount: function(frames, cols) {
		var mod = frames % cols;

		console.log(mod === 0 ? cols : mod);
	},*/

	rowCount: function(frames, cols) {
		return Math.ceil(frames / cols);
	},

	flatten: function(o) {
		return Object.keys(o).reduce(function(cur, next) {
			if ( Object.prototype.toString.call(o[next]) === '[object Object]' && !o[next] === o) {
				return cur.concat( Utils.flatten(o[next]) );
			}
			
			return cur.concat( [ [next, o[next]] ] );
		}, []);
	},

	wrapText: function(context, text, x, y, maxWidth, lineHeight) {
		var cars = text.split("\n");
		for (var ii = 0; ii < cars.length; ii++) {

			var line = "";
			var words = cars[ii].split(" ");

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + " ";
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;

				if (testWidth > maxWidth) {
					context.fillText(line, x, y);
					line = words[n] + " ";
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}
			context.fillStyle("rgba(0,0,0,.5)");
			context.fillRect(x, y - lineHeight, testWidth, lineHeight);
			context.restore();
			
			context.font("16px monospace");
			context.fillStyle("#fff");
			context.fillText(line, x, y);
			context.restore();

			y += lineHeight;
		}
	 }

};