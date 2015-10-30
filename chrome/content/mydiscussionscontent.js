
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
        
        RESSystem.showLoading('res-loading', true);
        this.loadNotes();
        RESSystem.showLoading('res-loading', false);
	},
    
    submitNote : function(message) {
        var xhr = new XMLHttpRequest();
		xhr.open("PUT", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    var currentUserAttributes = RESSystem.getCurrentUserAttributes(["id", "firstname", "lastname"]);
                    RESDiscussionsContent.addNote("currentNotes", currentUserAttributes[0], currentUserAttributes[1] + " " + currentUserAttributes[2], new Date(), message);
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
    
    loadNotes : function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?include=journals&key=" + RESSystem.getPref("apiKey"), false);
        xhr.send(null);
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var jsonSubResponse = JSON.parse(xhr.responseText);
                
                // Load top sub header data
                document.getElementById("discussiontitle").value = jsonSubResponse.issue["subject"];
                document.getElementById("discussiondescription").value = jsonSubResponse.issue["description"];
                
                var allJournals = jsonSubResponse.issue.journals;
                for (var key in allJournals) {
                    var note = allJournals[key];
                    if (note["notes"] != '') {
                        this.addNote("currentNotes", note.user["id"], note.user["name"], note["created_on"], note["notes"]);
                    }
                }
            }
        }
    },
    
    addNote : function(parentID, authorId, author, date, message) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        
        var parent = document.getElementById(parentID);
        var lastChildGroupBox = parent.lastChild;
        var align = "right";
        if (lastChildGroupBox != null) {
            if (lastChildGroupBox.getAttribute("author") == authorId) {
                align = lastChildGroupBox.getAttribute("align");
            }
            else if (lastChildGroupBox.getAttribute("align") == "right") {
                align = "left";
            }
        }
        
        var groupbox = document.createElementNS(XUL_NS, "groupbox");
        groupbox.setAttribute("align", align);
        groupbox.setAttribute("author", authorId);
        
        var text = document.createElementNS(XUL_NS, "text");
        text.setAttribute("value", author);
        groupbox.appendChild(text);
        
        var text = document.createElementNS(XUL_NS, "text");
        text.setAttribute("value", date);
        groupbox.appendChild(text);
        
        var text = document.createElementNS(XUL_NS, "text");
        text.setAttribute("value", message);
        groupbox.appendChild(text);
        
        parent.appendChild(groupbox);
    },
    
    getCurrentTicketID : function() {
        return window.arguments[0].substring(1, window.arguments[0].length);
    }

}

window.addEventListener("load", function () { RESDiscussionsContent.init(true); }, false);