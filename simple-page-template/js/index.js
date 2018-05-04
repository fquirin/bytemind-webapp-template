//Settings
var usesTouch = false;

//Check for touch event
window.addEventListener('touchstart', function() {
	
	//add touch-device class, set state, remove listener
	document.body.classList.add('touch-device');
	usesTouch = true;
	window.removeEventListener('touchstart', onFirstTouch, false);
	console.log('Uses touch events');
	
}, false);