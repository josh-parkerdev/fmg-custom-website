System.Engine = System.Engine || {};

System.Engine.Controller = function(args, data) {
	var self = this;
	var defaults = {
		enabled: true,
		default: 0,
	};

	Utils.extend(this, {
		_data: defaults
	}, args);

	Utils.extend(this._data, data);

	this.weights = [60, 20, 20, 100];
	this.states = [
		['Futureman', 'idle'],
		['Futureman', 'idleLeft'],
		['Futureman', 'idleRight'],
		/*['Button1', 'warning', 0]
		['Knob', 'warning'],
		['Display1', 'warning'],
		['Display2', 'warning']*/
	];

	this.states.forEach(entry => entry[0] = System.entities.get(entry[0]).States);

	this.ticker = createjs.Ticker.on("tick", this.tick, this);
}

System.Engine.Controller.prototype = {

	tick: function(event) {
		var d = this._data;
		var i = this.states, w = this.weights;

		// wait for entity state
		//if ( ((this.current) ? this.current[0].States.active : false)) return;
		if (d.c && d.c[0].active) return;

		// roll for state
		if (d.c = roll(i, w)) { // if rolled state is not null
			d.c[0].set(d.c[0], d.c[1]);
			d.last = d.c;
		} else { // else check if default and replay
			
		}

		// if no next state, set to default
		//if (!n) { c = i[d] } else { c = n };

		// set current state
		//if (c) c[0].States.set(c[0].States, c[1]);


		function roll(items, weights) {
			var total = 0;
			var ranges = weights.slice(0);
			for(var i = 0, len = weights.length; i < len; i++) {
				ranges[i] = [total, total += ranges[i]];
			}
			var randomNumber = parseInt(Math.random() * total);
			for(;randomNumber < ranges[--i][0];);

			//console.log("roll");
			return items[i];
		}

	}
}