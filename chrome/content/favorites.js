
RESFavorites = {
	
	init: function() {
        var loadingCount = 0;
        RESSystem.showLoading('res-loading', true);
        RESSystem.testConnection('', '', false);
		RESSystem.initCommonList("defaultProjectName", "projects.json", "projects", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("defaultProjectName").parentNode.value = RESSystem.getPref("defaultProjectName");
            loadingCount++;
            if (loadingCount == 2) {
                RESSystem.showLoading('res-loading', false);
            }
		});
		RESSystem.initCommonList("defaultTrackerName", "trackers.json", "trackers", 0, true, function(popup, elem)  {
			popup.appendChild(RESSystem.createMenuItem(elem["id"], elem["name"]));
		}, function() {
			document.getElementById("defaultTrackerName").parentNode.value = RESSystem.getPref("defaultTrackerName");
            loadingCount++;
            if (loadingCount == 2) {
                RESSystem.showLoading('res-loading', false);
            }
		});
	}

}

window.addEventListener("load", function () { RESFavorites.init(); }, false);