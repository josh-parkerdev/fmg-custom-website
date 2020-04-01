/*System.builder = function(data, args) {
	
}

System.builder.prototype = {
	inject: function(path, filename) {
		var extension = filename.split('.')[1];
		if (extension=="js") {
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", path + filename)
		} else if (extension=="css") {
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", path + filename)
		}

		if (typeof fileref!="undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref)
		}
	}
}*/