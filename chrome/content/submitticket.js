
RESSubmitTicket = {
	
	init: function() {
		RESSystem.initCommonList("projectName", "projects.json", "projects", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("projectName").parentNode.value = RESSystem.getPref("defaultProjectName");
		});
		RESSystem.initCommonList("trackerName", "trackers.json", "trackers", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("trackerName").parentNode.value = RESSystem.getPref("defaultTrackerName");
		});
        RESSystem.initCommonList("priority", "enumerations/issue_priorities.json", "issue_priorities", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			
		});
	},
	
	loadProjectMembers : function() {
		var selectedProjectId = RESSystem.getMenuPopupValue("projectName");
		RESSystem.initCommonList("assignedTo", "projects/" + selectedProjectId + "/memberships.json", "memberships", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem.user["name"]));
		});
	},
	
	createTicket : function() {
		var projectId = RESSystem.getMenuPopupValue("projectName");
		var trackerId = RESSystem.getMenuPopupValue("trackerName");
		var priorityId = RESSystem.getMenuPopupValue("priority");
		var assignedTo = RESSystem.getMenuPopupValue("assignedTo");
		var title = RESSystem.getTextBoxValue("title");
		var description = RESSystem.getTextBoxValue("description");
		
		if ( (projectId == '') || (trackerId == '') || (title == '') || (description == '') || (priorityId == '') ) {
			alert(RESSystem.getTranslation("string-bundle", "mandatory.data.missing"));
			return;
		}
		
		var root = new Object();
		root.issue = new Object();
		root.issue.project_id = projectId;
		root.issue.tracker_id = trackerId;
		if (assignedTo != '') {
			root.issue.assigned_to_id = assignedTo;
		}
		root.issue.priority_id = priorityId;
		root.issue.subject = title;
		root.issue.description = description;
		
		var mustAttachScreenshot = RESSystem.getCheckBoxValue("attachScreenshot");
		if (mustAttachScreenshot) {
            var dataurl = RESSystem.getScreenshot("screenshotCanvas");
            
            parameters = new Object();
            parameters.dataurl = "";
			openDialog("chrome://redmineeasysubmit/content/screenshot.xul", "dlg", "modal,chrome,centerscreen", document.getElementById("screenshotCanvas"), parameters);
            dataurl = parameters.dataurl;
            
            if (dataurl != '') {
                var base64data = dataurl.split(",");
                var screenshotBlob = RESSystem.b64toBlob(base64data[1], "image/png");
                var xhrUpload = new XMLHttpRequest();
                xhrUpload.open("POST", RESSystem.getPref("serverName") + "/uploads.json?key=" + RESSystem.getPref("apiKey"), true);
                xhrUpload.setRequestHeader("Content-Type", "application/octet-stream");
                xhrUpload.onreadystatechange = function() {
                    if (xhrUpload.readyState == 4) {
                        if (xhrUpload.status == 201) {
                            var jsonResponse = JSON.parse(xhrUpload.responseText);
                            root.issue.description += "\n\n" + "_" + RESSystem.getTranslation("string-bundle", "screenshot.link.description") + " " + RESSystem.getCurrentBrowserUrl() + "_";
                            RESSubmitTicket.submitTicket(root, jsonResponse.upload.token);
                        }
                    }
                }
                xhrUpload.send(screenshotBlob);
            }
		}
		else {
			RESSubmitTicket.submitTicket(root, '');
		}
	},
	
	submitTicket : function(root, uploadToken) {
		if (uploadToken != '') {
			root.issue.uploads = [];
			var attachment = new Object();
			attachment.token = uploadToken;
			attachment.filename = "screenshot.png";
			attachment.content_type = "image/png";
			root.issue.uploads.push(attachment);
		}
		var xhr = new XMLHttpRequest();
		xhr.open("POST", RESSystem.getPref("serverName") + "/issues.json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 201) {
					RESSystem.showAlert(RESSystem.getTranslation("string-bundle", "ticket.submit.success.title"), RESSystem.getTranslation("string-bundle", "ticket.submit.success.message"));
					window.close();
				}
				else alert(RESSystem.getTranslation("string-bundle", "ticket.submit.error"));
			}
		}
		xhr.send(JSON.stringify(root));
	}
	
}

window.addEventListener("load", function () { RESSubmitTicket.init(); }, false);