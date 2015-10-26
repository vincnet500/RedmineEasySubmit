
RESDiscussions = {
	
	init: function(mustCenter) {
        RESSystem.showLoading('res-loading', true);
        RESSystem.testConnection('', '', false);
		RESSystem.initCommonList("projectName", "projects.json", "projects", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("projectName").parentNode.value = RESSystem.getPref("defaultProjectName");
            RESSystem.showLoading('res-loading', false);
		});
	},
    
    loadDiscussions : function() {
        var currentUserId = RESSystem.getCurrentUserAttribute("id");
        var projectId = RESSystem.getMenuPopupValue("projectName"); 
        var tickets = this.loadOpenTickets(projectId, currentUserId);
        console.error(tickets);
    },
    
    loadOpenTickets : function(project, currentUserId) {
        var myDiscussionTickets = [];
        var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/issues.json?key=" + RESSystem.getPref("apiKey") + "&project_id=" + project + "&status_id=open&limit=100", false);
		xhr.send(null);
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                for (var key in jsonResponse.issues) {
                    var issueId = jsonResponse.issues[key]["id"];
                    var subxhr = new XMLHttpRequest();
                    subxhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + issueId + ".json?include=journals&key=" + RESSystem.getPref("apiKey"), false);
                    subxhr.send(null);
                    if (subxhr.readyState == 4) {
                        if (subxhr.status == 200) {
                            var jsonSubResponse = JSON.parse(subxhr.responseText);
                            var allJournals = jsonSubResponse.issue.journals;
                            for (var key in allJournals) {
                                if (allJournals[key].user["id"] == currentUserId) {
                                    myDiscussionTickets.push(jsonSubResponse);
                                }
                            }
                        }
                    }
                    
                }
            }
        }
        return myDiscussionTickets;   
    }

}

window.addEventListener("load", function () { RESDiscussions.init(true); }, false);