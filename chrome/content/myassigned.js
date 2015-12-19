
RESAssigned = {
    
    init: function(mustCenter) {
        RESGenericTickets.init(mustCenter, this.getDetailsView);
    },
    
    findTicket: function(currentUserId, ticket, endCallback) {
        var assignedToNode = ticket["assigned_to"];
        if ( (typeof(assignedToNode) != "undefined") && (assignedToNode["id"] == currentUserId) ) {
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

window.addEventListener("load", function loadRESAssignedFunction(event) { RESAssigned.init(true); window.removeEventListener(event, loadRESAssignedFunction, false); }, false);
