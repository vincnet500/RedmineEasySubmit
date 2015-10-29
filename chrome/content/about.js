
RESAbout = {
	
	init: function(mustCenter) {
        // Clean dialog default buttons
        document.documentElement.getButton("accept").setAttribute("style", "display:none;");
        document.documentElement.getButton("cancel").setAttribute("style", "display:none;");
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (window.innerWidth/2);
            var h = (screen.availHeight/2) - (window.innerHeight/2);
            window.moveTo(w,h);
        }
	}
    
}

window.addEventListener("load", function () { RESAbout.init(true); }, false);