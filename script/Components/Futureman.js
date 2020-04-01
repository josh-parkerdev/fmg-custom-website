System.Component = System.Component || {};

System.Component.Futureman = function(args, data) {
	//var parent = this.parent;

	Utils.extend(this, {

	}, args, data);

	//this.parent.SpriteSheet.sprite.on('animationend', this.trigger, this);

	// register for events
	


}

System.Component.Futureman.prototype = {

	trigger: function(e) {

		switch(e.name) {
			case 'button1_armUp_pause':
				var button = System.ship.entities.get('Button1');

				button.Momentary.press();
				break;
		
			case 'button1_press':
				var button = System.ship.entities.get('Button1');

				button.Momentary.release();
				break;

		}


	}

}