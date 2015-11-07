
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
        
        RESSystem.initCommonList("priority", "enumerations/issue_priorities.json", "issue_priorities", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
		});
        
        var allStatuses = [];
        var localStatusPopup = null;
        RESSystem.initCommonList("status", "issue_statuses.json", "issue_statuses", 0, true, function(popup, elem)  {
			localStatusPopup = popup;
            allStatuses.push(elem);
		}, function() {
            allStatuses.sort(function(a, b) {
                if (a["name"].toLowerCase() < b["name"].toLowerCase())
                    return -1;
                if ( a["name"].toLowerCase() > b["name"].toLowerCase() )
                    return 1;
                return 0;
            });
            for (var key in allStatuses) {
                localStatusPopup.appendChild(RESSystem.createMenuItem(allStatuses[key]["id"], allStatuses[key]["name"]));
            }
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
                
                // Load top sub header data
                document.getElementById("tickettitle").value = jsonSubResponse.issue["subject"];
                var ticketSubTitle = RESSystem.getTranslation("res-string-bundle", "ticket.information.updateon") + " " + new Date(jsonSubResponse.issue["updated_on"]).toLocaleFormat('%d-%b-%Y') + " ";
                if (typeof(jsonSubResponse.issue["assigned_to"]) != "undefined") {
                       ticketSubTitle += " / " + RESSystem.getTranslation("res-string-bundle", "ticket.information.assignedto") + " " + jsonSubResponse.issue["assigned_to"]["name"] + " ";
                }
                document.getElementById("ticketsubtitle").value = ticketSubTitle;
                document.getElementById("ticketsubsubtitle").value = RESSystem.getTranslation("res-string-bundle", "ticket.information.status") + " : " + jsonSubResponse.issue.status["name"] + " / " + RESSystem.getTranslation("res-string-bundle", "ticket.information.priority") + " : " + jsonSubResponse.issue.priority["name"];
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
    
    changeStatus : function() {
        this.internalChange("status", "status", "status_id", "ticket.update.status.success", "ticket.update.status.error");
    },
    
    changePriority : function() {
        this.internalChange("priority", "priority", "priority_id", "ticket.update.priority.success", "ticket.update.priority.error");
    },
        
    internalChange : function(menuListId, attributeIssueNode, putAttributeNode, messageSuccess, messageError) {
        var id = RESSystem.getMenuPopupValue(menuListId);
        var xhr = new XMLHttpRequest();
		xhr.open("PUT", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    // We must call again a get to check if attribute was really changed.
                    var subxhr = new XMLHttpRequest();
                    subxhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + RESTicketContent.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), false);
                    subxhr.send(null);
                    if (subxhr.readyState == 4) {
                        if (subxhr.status == 200) {
                            var jsonSubResponse = JSON.parse(subxhr.responseText);
                            if (id == jsonSubResponse.issue[attributeIssueNode]["id"]) {
                                RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", messageSuccess));
                                window.close();
                            }
                            else {
                                RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", messageError));
                            }
                        }
                    }
                }
            }
            //TODO Errors
        }
        console.error(id);
        var root = new Object();
		root.issue = new Object();
        root.issue[putAttributeNode] = id;
        xhr.send(JSON.stringify(root));
    }

}

window.addEventListener("load", function () { RESTicketContent.init(true); }, false);