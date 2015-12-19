
RESDiscussions = {
	
	init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket, endCallback) {
        var issueId = ticket["id"];
        var subxhr = new XMLHttpRequest();
        subxhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + issueId + ".json?include=journals&key=" + RESSystem.getPref("apiKey"), true);
        subxhr.onreadystatechange = function() {
			if (subxhr.readyState == 4) {
				if (subxhr.status == 200) {
                    var jsonSubResponse = JSON.parse(subxhr.responseText);
                    var allJournals = jsonSubResponse.issue.journals;
                    for (var key in allJournals) {
                        var journalItem = allJournals[key];
                        if ( (journalItem.user["id"] == currentUserId) && (typeof(journalItem["notes"]) != "undefined") && (journalItem["notes"] != "") ) {
                            endCallback(jsonSubResponse.issue);
                            return;
                        }
                    }
                    endCallback(null);
                    return;
                }
            }
        }
        subxhr.send(null);
    },
    
    customTicketClassName: function(topPriorities, ticket, currentUserId) {
        var allJournals = ticket.journals;
        if (allJournals[allJournals.length - 1].user["id"] != currentUserId) {
            return "cell-highlighted";
        }
        return "";
    },
    
    getDetailsView: function() {
        return "mydiscussionscontent.xul";    
    }

}

window.addEventListener("load", function loadRESDiscussionsFunction(event) { RESDiscussions.init(true); window.removeEventListener(event, loadRESDiscussionsFunction, false); }, false);
