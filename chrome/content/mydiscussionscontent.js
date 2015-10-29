
RESDiscussionsContent = {
	
    init: function(mustCenter) {
        // Clean dialog default buttons
        document.documentElement.getButton("accept").setAttribute("style", "display:none;");
        document.documentElement.getButton("cancel").setAttribute("style", "display:none;");
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (window.innerWidth/2);
            var h = (screen.availHeight/2) - (window.innerHeight/2);
            window.moveTo(w,h);
        }
        
        console.error(this.getCurrentTicketID());
	},
    
    submitNote : function(message) {
        var xhr = new XMLHttpRequest();
		xhr.open("PUT", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					window.close();
                }
            }
            //TODO Errors
        }
        var root = new Object();
		root.issue = new Object();
		root.issue.notes = message;
        console.error(JSON.stringify(root));
        xhr.send(JSON.stringify(root));
    },
    
    getCurrentTicketID : function() {
        return window.arguments[0].substring(1, window.arguments[0].length);
    }

}

window.addEventListener("load", function () { RESDiscussionsContent.init(true); }, false);