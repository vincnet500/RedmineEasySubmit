
RESAssigned = {
    
    init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket) {
        var assignedToNode = ticket["assigned_to"];
        if ( (typeof(assignedToNode) != "undefined") && (assignedToNode["id"] == currentUserId) ) {
            return ticket;
        }
        return null;
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

window.addEventListener("load", function () { RESAssigned.init(true); }, false);