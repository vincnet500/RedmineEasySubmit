
RESDiscussionsContent = {
	
	init: function(mustCenter) {
        // Clean dialog default buttons
        document.documentElement.getButton("accept").setAttribute("style", "display:none;");
        document.documentElement.getButton("cancel").setAttribute("style", "display:none;");
        
		console.error(window.arguments[0]);
	},
    
    submitNote : function(message) {
        alert(message);
    }

}

window.addEventListener("load", function () { RESDiscussionsContent.init(true); }, false);