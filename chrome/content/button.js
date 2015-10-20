
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
		
		if (a == 'default') {
			window.open('chrome://redmineeasysubmit/content/submitticket.xul', '', 'chrome,centerscreen');
		}
		else if (a == 'options') {
			window.open('chrome://redmineeasysubmit/content/options.xul', '', 'chrome,centerscreen');
		}
		else if (a == 'favorites') {
			window.open('chrome://redmineeasysubmit/content/favorites.xul', '', 'chrome,centerscreen');
		}
		else if (a == 'submitticket') {
			window.open('chrome://redmineeasysubmit/content/submitticket.xul', '', 'chrome,centerscreen');
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
            window.open(RESSystem.getPref("serverName") + "/projects/" + defaultProject + "search?q=" + content);
        }
        else {
            window.open(RESSystem.getPref("serverName") + "/search?q=" + content);
        }
    }

};

window.addEventListener("load", function () { RedmineEasySubmit.init(); }, false);
