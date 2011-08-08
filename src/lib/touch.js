// AMD packaged version of: 
// http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
// ..takes the approach of mapping touch events to their mouse counterparts

define([], function (){
	var touchHandler = function (event)
	{
		var touches = event.changedTouches,
			first = touches[0],
			type = "";
			 switch(event.type)
		{
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type="mousemove"; break;		   
			case "touchend":   type="mouseup"; break;
			default: return;
		}

				 //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
		//			 screenX, screenY, clientX, clientY, ctrlKey, 
		//			 altKey, shiftKey, metaKey, button, relatedTarget);
	
		var simulatedEvent = document.createEvent("MouseEvent");
		// console.log("creating simulated " + type + " event");
		simulatedEvent.initMouseEvent(type, true, true, window, 1, 
								  first.screenX, first.screenY, 
								  first.clientX, first.clientY, false, 
								  false, false, false, 0/*left*/, null);

		first.target.dispatchEvent(simulatedEvent);
		event.preventDefault();
	}

	touchHandler.init = function() 
	{
		// console.log("init touchHandler");
		document.addEventListener("touchstart", touchHandler, true);
		document.addEventListener("touchmove", touchHandler, true);
		document.addEventListener("touchend", touchHandler, true);
		document.addEventListener("touchcancel", touchHandler, true);	 
	};
	return touchHandler;
});