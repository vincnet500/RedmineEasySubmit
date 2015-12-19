
RESGenericTickets = {
	
	init: function(mustCenter, getDetailsView) {
        RESSystem.showLoading('res-loading', true);
        RESSystem.testConnection('', '', false);
        var allProjects = [];
        var localProjectPopup = null;
		RESSystem.initCommonList("projectName", "projects.json", "projects", 0, true, function(popup, elem)  {
			localProjectPopup = popup;
            allProjects.push(elem);
		}, function() {
			allProjects.sort(function(a, b) {
                if (a["name"].toLowerCase() < b["name"].toLowerCase())
                    return -1;
                if ( a["name"].toLowerCase() > b["name"].toLowerCase() )
                    return 1;
                return 0;
            });
            for (var key in allProjects) {
                localProjectPopup.appendChild(RESSystem.createMenuItem(allProjects[key]["id"], allProjects[key]["name"]));
            }
            RESSystem.showLoading('res-loading', false);
            document.getElementById("projectName").parentNode.value = RESSystem.getPref("defaultProjectName");
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
            parameters.talkAccess = false;
			openDialog("chrome://redmineeasysubmit/content/" + getDetailsView(), "dlg", "modal,chrome,centerscreen", target.getAttribute("value"), parameters);
            if (parameters.talkAccess) {
                openDialog("chrome://redmineeasysubmit/content/mydiscussionscontent.xul", "dlg", "modal,chrome,centerscreen", target.getAttribute("value"), parameters);
            }
        }, false);
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (window.innerWidth/2);
            var h = (screen.availHeight/2) - (window.innerHeight/2);
            window.moveTo(w,h);
        }
	},
    
    loadTickets : function(findTicketFunction, customTicketClassName) {
        RESSystem.showLoading('res-loading', true);
        RESSystem.cleanListBox("ticketsTable");
        
        RESSystem.getCurrentUserAttribute("id", function(currentUserId) {
            var projectId = RESSystem.getMenuPopupValue("projectName");
            RESGenericTickets.internalLoadTickets(projectId, currentUserId, findTicketFunction, 0, [], function(tickets) {
                RESSystem.getTopPriorities(2, function(topPriorities) {
                    for (var key in tickets) {
                        var ticket = tickets[key];
                        var className = customTicketClassName(topPriorities, ticket, currentUserId);
                        var updatedOnDate = new Date(ticket["updated_on"]).toLocaleFormat('%d-%b-%Y');
                        var subject = ticket["subject"];
                        RESSystem.appendListBox("ticketsTable", className, ["#" + ticket["id"], (subject.length > 60?subject.substring(0, 57) + "...":subject), ticket.status["name"], ticket.priority["name"], ticket.tracker["name"], updatedOnDate]);
                    }

                    RESSystem.showLoading('res-loading', false);
                });
            });
        });
    },
    
    internalLoadTickets : function(project, currentUserId, findTicketFunction, offset, myTickets, endCallback) {
        var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/issues.json?key=" + RESSystem.getPref("apiKey") + "&project_id=" + project + "&status_id=open&limit=100&offset=" + offset, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var jsonResponse = JSON.parse(xhr.responseText);
					for (var key in jsonResponse.issues) {
						findTicketFunction(currentUserId, jsonResponse.issues[key], function(ticket) {
                            if (ticket != null) {
                                myTickets.push(ticket);
                            }
                        });
					}
					var totalCount = jsonResponse["total_count"];
                    if (totalCount > offset + 100) {
						// We must call again with next offset
						RESGenericTickets.internalLoadTickets(project, currentUserId, findTicketFunction, offset + 100, myTickets, endCallback);
					}
					else {
                        endCallback(myTickets);
					}
				}
			}
		}
        xhr.send(null);
    }

}
