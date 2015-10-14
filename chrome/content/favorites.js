
RESFavorites = {
	
	init: function() {
		RESSystem.initCommonList("defaultProjectName", "projects.json", "projects", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("defaultProjectName").parentNode.value = RESSystem.getPref("defaultProjectName");
		});
		RESSystem.initCommonList("defaultTrackerName", "trackers.json", "trackers", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("defaultTrackerName").parentNode.value = RESSystem.getPref("defaultTrackerName");
		});
	}

}

window.addEventListener("load", function () { RESFavorites.init(); }, false);