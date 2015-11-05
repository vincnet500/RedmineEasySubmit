
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
        // Bottom currentNotes div auto scroll
        var objDiv = document.getElementById("currentNotes");
        objDiv.scrollTop = objDiv.scrollHeight;
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
                    RESDiscussionsContent.addNote("currentNotes", currentUserAttributes[0], currentUserAttributes[1] + " " + currentUserAttributes[2], (new Date()).toLocaleFormat('%d-%b-%Y'), message);
                }
            }
            //TODO Errors
        }
        var root = new Object();
		root.issue = new Object();
		root.issue.notes = message;
        xhr.send(JSON.stringify(root));
    },
    
    loadNotes : function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID() + ".json?include=journals&key=" + RESSystem.getPref("apiKey"), false);
        xhr.send(null);
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var jsonSubResponse = JSON.parse(xhr.responseText);
                
                // TODO traductions
                // Load top sub header data
                document.getElementById("discussiontitle").value = jsonSubResponse.issue["subject"];
                var ticketSubTitle = "[Mis à jour le " + new Date(jsonSubResponse.issue["updated_on"]).toLocaleFormat('%d-%b-%Y') + "] ";
                if (typeof(jsonSubResponse.issue["assigned_to"]) != "undefined") {
                       ticketSubTitle += " [Assigné à " + jsonSubResponse.issue["assigned_to"]["name"] + "] ";
                }
                document.getElementById("discussionsubtitle").value = ticketSubTitle;
                var description = jsonSubResponse.issue["description"];
                description = description.replace(/(?:\r\n|\r|\n)/g, '<html:br/>');
                document.getElementById("discussiondescription").innerHTML = description;
                
                var allJournals = jsonSubResponse.issue.journals;
                for (var key in allJournals) {
                    var note = allJournals[key];
                    if ( (typeof(note["notes"]) != "undefined") && (note["notes"] != '') ) {
                        this.addNote("currentNotes", note.user["id"], note.user["name"], new Date(note["created_on"]).toLocaleFormat('%d-%b-%Y'), note["notes"]);
                    }
                }
            }
        }
    },
    
    addNote : function(parentID, authorId, author, date, message) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        const HTML_NS = "http://www.w3.org/1999/xhtml";
        
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
        groupbox.setAttribute("class", "note-groupbox");
        
        var text = document.createElementNS(XUL_NS, "text");
        text.setAttribute("class", "note-title");
        text.setAttribute("value", author);
        groupbox.appendChild(text);
        
        var text = document.createElementNS(XUL_NS, "text");
        text.setAttribute("class", "note-subtitle");
        text.setAttribute("value", date);
        groupbox.appendChild(text);
        
        var text = document.createElementNS(HTML_NS, "div");
        text.setAttribute("class", "note-message");
        message = message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        text.innerHTML = message;
        groupbox.appendChild(text);
        
        parent.appendChild(groupbox);
    },
    
    getCurrentTicketID : function() {
        return window.arguments[0].substring(1, window.arguments[0].length);
    },
    
    openTicket : function() {
        window.open(RESSystem.getPref("serverName") + "/issues/" + this.getCurrentTicketID());   
    }

}

window.addEventListener("load", function () { RESDiscussionsContent.init(true); }, false);