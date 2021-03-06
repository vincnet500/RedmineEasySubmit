
RESSystem = {
	
	init: function() {
		
	},
	
	initCommonList: function(listName, path, rootIterator, offset, eraseExistingValues, callback, endcallback) {
		var popup = document.getElementById(listName);
        if (eraseExistingValues) {
            popup.innerHTML = '';
            popup.parentNode.value = '';
        }
		var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/" + path + "?key=" + RESSystem.getPref("apiKey") + "&limit=100&offset=" + offset, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var jsonResponse = JSON.parse(xhr.responseText);
					for (var key in jsonResponse[rootIterator]) {
						callback(popup, jsonResponse[rootIterator][key]);
					}
					var totalCount = jsonResponse["total_count"];
					if (totalCount > offset + 100) {
						// We must call again with next offset
						RESSystem.initCommonList(listName, path, rootIterator, offset + 100, false, callback, endcallback);
					}
					else if (endcallback != null) {
						endcallback();
					}
				}
			}
		}
		xhr.send(null);
	},
    
    appendListBox : function(listname, className, values) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        var listBox = document.getElementById(listname);
        var listItem = document.createElementNS(XUL_NS, "listitem");
        listItem.setAttribute("value", values[0]);
        for (var key in values) {
            var listCell = document.createElementNS(XUL_NS, "listcell");
            listCell.setAttribute("label", values[key]);
            if (className != '') {
                listCell.setAttribute("class", className);
            }
            listItem.appendChild(listCell);
        }
        listBox.appendChild(listItem);
    },
    
    cleanListBox : function(listname) {
        var listBox = document.getElementById(listname);
        var allChildNodes = listBox.childNodes;
        var allChildNodesLength = allChildNodes.length;
        var headNode = listBox.firstChild;
        while (listBox.firstChild) {
            listBox.removeChild(listBox.firstChild);
        }
        listBox.appendChild(headNode);
    },
    
    getProjectName : function(projectId, endCallback)  {
        var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/projects/" + projectId + ".json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    endCallback(jsonResponse.project["identifier"]);
                }
            }
        }
        xhr.send(null);
    },
    
    getCurrentUserAttribute : function(attributeName, endCallback) {
        var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/users/current.json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    endCallback(jsonResponse.user[attributeName]);
                }
            }
        }
        xhr.send(null);
    },
    
    getCurrentUserAttributes : function(attributesNames, endCallback) {
        var xhr = new XMLHttpRequest();
		xhr.open("GET", RESSystem.getPref("serverName") + "/users/current.json?key=" + RESSystem.getPref("apiKey"), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    var result = [];
                    var jsonResponse = JSON.parse(xhr.responseText);
                    for (var key in attributesNames) {
                        result.push(jsonResponse.user[attributesNames[key]]);
                    }
                    endCallback(result);
                }
            }
        }
        xhr.send(null);
    },
    
    testConnection : function(serverName, apiKey, showAlertSuccess) {
        if (serverName == '') {
            serverName = RESSystem.getPref("serverName");
        }
        if (apiKey == '') {
            apiKey = RESSystem.getPref("apiKey");
        }
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", serverName + "/projects.json?key=" + apiKey + "&limit=1&offset=0", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status != 200) {
                        RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", "connection.error.message"));
                    }
                    else {


                        if (showAlertSuccess) {
                            RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", "connection.success.message"));
                        }
                    }
                }
            }
            xhr.send(null);
        }
        catch (e) {
            RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", "connection.error.message"));
        }
    },
	
	createMenuItem: function(aKey, aLabel) {
		const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
		var item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
		item.setAttribute("value", aKey);
		item.setAttribute("label", aLabel);
		return item;
	},
	
	getMainWindow : function() {
		var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService();
		var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);
		return windowManagerInterface.getMostRecentWindow("navigator:browser");
	},
	
	getWindow : function(index) {
		var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService();
		var windowManagerInterface = windowManager.QueryInterface(Components.interfaces.nsIWindowMediator);
		var eb = windowManagerInterface.getEnumerator("navigator:browser");
		if (eb.hasMoreElements()) {
			var it;
			var i = 0;
			while (eb.hasMoreElements()) {
				it = eb.getNext();
				if (i == index) {
					return it.QueryInterface(Components.interfaces.nsIDOMWindow);
				}
				i++;
			}
		}
	},
	
	getBrowser : function() {
		return this.getMainWindow().getBrowser();
	},
	
	getCurrentBrowserUrl : function() {
		return this.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href;
	},
	
	getScreenshot : function(idCanvas) {
		var mainWindow = this.getMainWindow();
		var mainWindowDocument = mainWindow.getBrowser().selectedBrowser.contentWindow.document.documentElement;
		var width = mainWindowDocument.clientWidth;
		var height = mainWindowDocument.clientHeight;
		var cnvs = document.getElementById(idCanvas);
        cnvs.width = width;
		cnvs.height = height;
		var ctx = cnvs.getContext("2d");
		ctx.drawWindow(mainWindow, 0, 0, mainWindow.innerWidth, mainWindow.innerHeight, "rgb(255,255,255)");
		return(cnvs.toDataURL("image/png"));
	},
	
	b64toBlob : function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {type: contentType});
    },
	
	getMenuPopupValue : function(name) {
		var menuPopup = document.getElementById(name);
		for (var childKey in menuPopup.children) {
			var child = menuPopup.children[childKey];
			if (child.getAttribute) {
				if (child.getAttribute("selected"))	{
					return child.getAttribute("value");
				}
			}
		}
		return "";
	},
	
	getTextBoxValue : function(name) {
		return document.getElementById(name).value;
	},
	
	getCheckBoxValue : function(name) {
		var checkbox = document.getElementById(name);
		return (Boolean(checkbox.getAttribute("checked")));
	},
	
	getPref : function(pref) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var branch = prefs.getBranch("extensions.redmineeasysubmit@vincnet500.com.");
        try {
            return branch.getCharPref(pref);
        }
        catch (e) {}
        return "";
	},
    
    basicAlert: function(message) {
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
              .getService(Components.interfaces.nsIPromptService);
        prompts.alert(window, "Redmine Easy Submit", message);
    },
	
	showAlert: function(title, message) {
		var alertService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
		alertService.showAlertNotification(
			'chrome://redmineeasysubmit/skin/icon_32x32.png',
			title, message, false, '', null, ''
		);
	},
    
    showLoading: function(divID, show) {
        if (show) {
            document.getElementById(divID).style.display = 'block';
        }
        else {
            document.getElementById(divID).style.display = 'none';   
        }
    },
	
	getTranslation: function(bundle, key) {
		var stringsBundle = document.getElementById(bundle);
		return stringsBundle.getString(key);
	},
    
    getTopPriorities: function(topLimit, endCallback) {
        var topPriorities = [];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", RESSystem.getPref("serverName") + "/enumerations/issue_priorities.json?key=" + RESSystem.getPref("apiKey"), true);
        xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    var priorities = jsonResponse["issue_priorities"];
                    var index = 0;
                    for (var key in priorities.reverse()) {
                        topPriorities.push(priorities[key]["id"]);
                        index++;
                        if (index == topLimit) {
                            break;   
                        }
                    }
                    endCallback(topPriorities);
                }
            }
        }
        xhr.send(null);
    },
    
    getCurrentShortLocale : function() {
        var chromeREgistryService = Components.classes["@mozilla.org/chrome/chrome-registry;1"]
            .getService(Components.interfaces.nsIXULChromeRegistry);
        var language = chromeREgistryService.getSelectedLocale("global");
        if (language.indexOf("-") > -1) {
            language = language.substring(0, language.indexOf("-"));
        }
        return language;
    }
	
}

window.addEventListener("load", function loadRESSystemFunction(event) { RESSystem.init(true); window.removeEventListener(event, loadRESSystemFunction, false); }, false);
