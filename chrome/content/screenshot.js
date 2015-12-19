
RESScreenshot = {
	
	init: function(mustCenter) {
        // Clean dialog default buttons
        document.documentElement.getButton("accept").setAttribute("style", "display:none;");
        document.documentElement.getButton("cancel").setAttribute("style", "display:none;");
        
        var existingCanvas = window.arguments[0];
        var destinationCanvas = document.getElementById("screenshotCanvasUpdate");
        
        var newWidth = 0.8 * existingCanvas.width;
        var newHeight = 0.8 * existingCanvas.height;
        
        destinationCanvas.width = newWidth;
        destinationCanvas.height = newHeight;
        var destinationCtx = destinationCanvas.getContext("2d");
        destinationCtx.drawImage(existingCanvas, 0, 0, destinationCanvas.width, destinationCanvas.height);
        
        this.initializeDrawCanvas("#ff0000", destinationCanvas);
        
        if (mustCenter) {
            var w = (screen.availWidth/2) - (newWidth/2);
            var h = (screen.availHeight/2) - (newHeight/2);
            window.moveTo(w,h);
        }
	},
    
    initializeDrawCanvas : function(fillColor, canvas) {
        var ctx = canvas.getContext("2d");
        
        // define a custom fillCircle method
        ctx.fillCircle = function(x, y, radius, fillColor) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };

        // bind mouse events
        canvas.onmousemove = function(e) {
            if (!canvas.isDrawing) {
               return;
            }
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            var radius = 2; // or whatever
            ctx.fillCircle(x, y, radius, fillColor);
        };
        canvas.onmousedown = function(e) {
            canvas.isDrawing = true;
        };
        canvas.onmouseup = function(e) {
            canvas.isDrawing = false;
        };
    },
    
    createTicket : function() {
        var parameters = window.arguments[1];
        parameters.dataurl = document.getElementById("screenshotCanvasUpdate").toDataURL("image/png");
        window.close();
    }

}

window.addEventListener("load", function loadRESScreenshotFunction(event) { RESScreenshot.init(true); window.removeEventListener(event, loadRESScreenshotFunction, false); }, false);
