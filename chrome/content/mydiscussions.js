
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
        
        var listBox = document.getElementById("ticketsTable");
        listBox.addEventListener("dblclick", function(event) {
            var target = event.target;
            while (target && target.localName != "listitem") {
                target = target.parentNode;
            }
            if (!target) {
                return;
            }
            parameters = new Object();
			openDialog("chrome://redmineeasysubmit/content/mydiscussionscontent.xul", "dlg", "modal,chrome,centerscreen", target.getAttribute("value"), parameters);
        }, false);
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (window.innerWidth/2);
            var h = (screen.availHeight/2) - (window.innerHeight/2);
            window.moveTo(w,h);
        }
	},
    
    loadDiscussions : function() {
        RESSystem.showLoading('res-loading', true);
        
        RESSystem.cleanListBox("ticketsTable");
        
        var currentUserId = RESSystem.getCurrentUserAttribute("id");
        var projectId = RESSystem.getMenuPopupValue("projectName"); 
        var tickets = this.loadOpenTickets(projectId, currentUserId);
        
        for (var key in tickets) {
            var ticket = tickets[key];
            var className = "";
            var allJournals = ticket.issue.journals;
            if (allJournals[allJournals.length - 1].user["id"] != currentUserId) {
                className = "cell-highlighted";
            }
            var updatedOnDate = new Date(ticket.issue["updated_on"]).toLocaleFormat('%d-%b-%Y');
            var subject = ticket.issue["subject"];
            RESSystem.appendListBox("ticketsTable", className, ["#" + ticket.issue["id"], (subject.length > 75?subject.substring(0, 72) + "...":subject), ticket.issue.status["name"], ticket.issue.priority["name"], ticket.issue.tracker["name"], updatedOnDate]);
        }
        
        RESSystem.showLoading('res-loading', false);
    },
    
    // TODO gérer la récursivité (offset/limit)
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
                                    break;
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