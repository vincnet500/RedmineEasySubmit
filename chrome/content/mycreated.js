
RESCreated = {
	
    init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket, endCallback) {
        if (ticket.author["id"] == currentUserId) {
            endCallback(ticket);
            return;
        }
        endCallback(null);
        return;
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

window.addEventListener("load", function loadRESCreatedFunction(event) { RESCreated.init(true); window.removeEventListener(event, loadRESCreatedFunction, false); }, false);
