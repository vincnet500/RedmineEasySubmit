
RESTicketContent = {
	
    init: function(mustCenter) {
        // Clean dialog default buttons
        document.documentElement.getButton("accept").setAttribute("style", "display:none;");
        document.documentElement.getButton("cancel").setAttribute("style", "display:none;");
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (window.innerWidth/2);
            var h = (screen.availHeight/2) - (window.innerHeight/2);
            window.moveTo(w,h);
        }
        
        RESSystem.showLoading('res-loading', true);
        RESSystem.initCommonList("status", "issue_statuses.json", "issue_statuses", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
            
		});
        this.loadTicketDetails();
        RESSystem.showLoading('res-loading', false);
	},
    
    loadTicketDetails : function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), false);
        xhr.send(null);
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var jsonSubResponse = JSON.parse(xhr.responseText);
                
                // TODO traductions
                // Load top sub header data
                document.getElementById("tickettitle").value = jsonSubResponse.issue["subject"];
                var ticketSubTitle = "[Mis à jour le " + new Date(jsonSubResponse.issue["updated_on"]).toLocaleFormat('%d-%b-%Y') + "] ";
                if (typeof(jsonSubResponse.issue["assigned_to"]) != "undefined") {
                       ticketSubTitle += " [Assigné à " + jsonSubResponse.issue["assigned_to"]["name"] + "] ";
                }
                document.getElementById("ticketsubtitle").value = ticketSubTitle;
                var description = jsonSubResponse.issue["description"];
                description = description.replace(/(?:\r\n|\r|\n)/g, '<html:br/>');
                document.getElementById("ticketdescription").innerHTML = description;
            }
        }
    },
    
    getCurrentTicketID : function() {
        return window.arguments[0].substring(1, window.arguments[0].length);
    },
    
    openTicket : function() {
        window.open(RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID());   
    },
    
    talkAccess : function() {
        var parameters = window.arguments[1];
        parameters.talkAccess = true;
		window.close();
    },
    
    changeStatus : function(note) {
        var statusId = RESSystem.getMenuPopupValue("status");
        console.error(statusId);
        var xhr = new XMLHttpRequest();
		xhr.open("PUT", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    // We must call again a get on status to check if status was changed.
                    // STOP HERE
                }
            }
            //TODO Errors
        }
        var root = new Object();
		root.issue = new Object();
        if (note != '') {
		  root.issue.notes = note;
        }
        root.issue.status_id = statusId;
        xhr.send(JSON.stringify(root));
    }

}

window.addEventListener("load", function () { RESTicketContent.init(true); }, false);