function popupOpen(id) {
	//Make sure all popups are closed
	popupClose();
	
	//Open specified popup
	document.getElementById(id).style.display = 'block';
}

function popupClose() {
	var popup_win = document.getElementsByClassName('popup-background');
	for (i = 0; i < popup_win.length; i++) {
		popup_win[i].style.display = 'none';
	}
}
