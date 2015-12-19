
RESOpened = {
	
    init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket, endCallback) {
        // We return all tickets : we only have "opened" tickets in generic source
        endCallback(ticket);
    },
    
    customTicketClassName: function(topPriorities, ticket, currentUserId) {
        if (topPriorities.indexOf(ticket.priority["id"]) > -1) {
            return "cell-highlighted";
        }
        return "";
    },
    
    getDetailsView: function() {
        return "myticketcontent.xul";    
    }

}

window.addEventListener("load", function loadRESOpenedFunction(event) { RESOpened.init(true); window.removeEventListener(event, loadRESOpenedFunction, false); }, false);
