
RedmineEasySubmit = {
	
	init: function () {
		this.addButton();
	},
	
	addButton: function () {
		toolbarButton = 'res-button';
		navBar = document.getElementById('nav-bar');
		currentSet = navBar.getAttribute('currentset');
		if (!currentSet) {
			currentSet = navBar.currentSet;
		}
		curSet = currentSet.split(',');
		if (curSet.indexOf(toolbarButton) == -1) {
			set = curSet.concat(toolbarButton);
			navBar.setAttribute("currentset", set.join(','));
			navBar.currentSet = set.join(',');
			document.persist(navBar.id, 'currentset');
			try {
				BrowserToolboxCustomizeDone(true);
			} catch (e) {}
		}
	},
	
	run : function(e) {
		if (e == undefined) {
			a = 'default';
		} else {
			var a = e.target.getAttribute('value');
			if (a == '') a = 'default';
		}
		
		if ( (a == 'default') || (a == 'submitticket') ) {
            var apiKey = RESSystem.getPref("apiKey");
            if (apiKey != '') {
                window.open('chrome://redmineeasysubmit/content/submitticket.xul', '', 'chrome,centerscreen');
            }
            else {
			    window.open('chrome://redmineeasysubmit/content/options.xul', '', 'chrome,centerscreen');
            }
		}
		else if (a == 'options') {
			window.open('chrome://redmineeasysubmit/content/options.xul', '', 'chrome,centerscreen');
		}
		else if (a == 'favorites') {
			window.open('chrome://redmineeasysubmit/content/favorites.xul', '', 'chrome,centerscreen');
		}
        else if (a == 'mydiscussions') {
			window.open('chrome://redmineeasysubmit/content/mydiscussions.xul', '', 'chrome,centerscreen');
		}
        else if (a == 'myassigned') {
			window.open('chrome://redmineeasysubmit/content/myassigned.xul', '', 'chrome,centerscreen');
		}
        else if (a == 'mysubmited') {
			window.open('chrome://redmineeasysubmit/content/mycreated.xul', '', 'chrome,centerscreen');
		}
        else if (a == 'opened') {
			window.open('chrome://redmineeasysubmit/content/myopened.xul', '', 'chrome,centerscreen');
		}
        else if (a == 'about') {
			window.open('chrome://redmineeasysubmit/content/about.xul', '', 'chrome,centerscreen');
		}
	},
    
    directAccess : function(ticketID) {
        if (ticketID == '') {
            return; 
        }
        if (ticketID.indexOf("#") === 0) {
            ticketID = ticketID.substring(1);
        }
        window.open(RESSystem.getPref("serverName") + "/issues/" + ticketID);
    },
    
    search : function(content, favoriteTicketCheckboxId) {
        if (content == '') {
            return; 
        }
        var favoriteTicketCheckboxId = RESSystem.getCheckBoxValue(favoriteTicketCheckboxId);
        if (favoriteTicketCheckboxId) {
            var defaultProject = RESSystem.getPref("defaultProjectName");
            if (defaultProject != '') {
                RESSystem.getProjectName(defaultProject, function(projectName) {
                    window.open(RESSystem.getPref("serverName") + "/projects/" + projectName + "/search?q=" + content);
                });
            }
            else {
                RESSystem.basicAlert("No default project found in configuration.");
            }
        }
        else {
            window.open(RESSystem.getPref("serverName") + "/search?q=" + content);
        }
    }

};

window.addEventListener("load", function loadRedmineEasySubmitFunction(event) { RedmineEasySubmit.init(true); window.removeEventListener(event, loadRedmineEasySubmitFunction, false); }, false);
