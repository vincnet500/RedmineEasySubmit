
RESOptions = {
	
	init: function() {
		
	},
    
    navigateMyAccount(serverName) {
        if (serverName != '') {
            window.open(document.getElementById("serverName").value + "/my/account");
        }
        else {
            RESSystem.basicAlert(RESSystem.getTranslation("res-string-bundle", "navigate.my.account.servername.mandatory.error"));   
        }
    }

}

window.addEventListener("load", function () { RESOptions.init(); }, false);