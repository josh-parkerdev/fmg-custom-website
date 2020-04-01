System.Component = System.Component || {};

System.Component.NERFSystem = function(args, data) {
	var self = this;
	var defaults = {
		css: {
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 0,
			margin: 0,
			width: "100%",
			height: "100%",
			overflow: "hidden",
			backgroundColor: "transparent"
		},
		bounds: [0,0,0,0]
	}

	Utils.extend(this, {
		_data: defaults
	}, args)
	Utils.extend(this._data.css, data.css)

	var image, imageSrc;
	if (this._data.image != null) {
		image = this._data.image;
		imageSrc = this._data.imageSrc;
	}

	$console=		$('<div>', {id: 'console', class: 'noisy'});
	$frame=			$('<div>', {id: 'console-frame', class: 'frame'});
	$scanlines=		$('<div>', {id: 'console-scanlines', class: 'overlay scanlines noclick'})
	$glow=			$('<div>', {id: 'console-glow', class: 'overlay glow noclick'})
	$info=			$('<div>', {id: 'console-info', class: 'column info'})
	$output=		$('<div>', {id: 'console-output', class: 'column output'})
	$left_column=	$('<div>', {id: 'console-left-column', class: 'overlay column left'});
	$right_column=	$('<div>', {id: 'console-right-column', class: 'overlay column right'});

	$copyright=		$('<div>', {id: 'copyright', class: 'fixed footer'});
	$($copyright).html("<small>&copy;2016 Josh Parker - FuturemanGaming</small>");
	$($console).append($copyright);

	$input=			$('<div>', {id: 'console-input', class: 'column input'})

	this.$info = $info;
	this.$output = $output;
	this.$console = $console;

}

System.Component.NERFSystem