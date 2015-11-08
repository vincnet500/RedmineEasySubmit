
RESOpened = {
	
    init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket) {
        // We return all tickets : we only have "opened" tickets in generic source
        return ticket;
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

window.addEventListener("load", function () { RESOpened.init(true); }, false);