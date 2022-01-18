var words = [
	["ābols", "sula", "viela", "spēks", "sala", "lauva", "laipa", "spēle"],
	["veikals", "grāmata", "slieka", "sports", "valsts", "lauva", "motors"],
	["zvaigzne", "sienāzis", "viela", "sports", "valsts", "lauva", "laipa"]
];

const totalTime = 100; //Total time (seconds)
const minLevel = 1;
const maxLevel = words.length;

var currentWord = ''; //Word to guess
var shuffledWord = '';
var level = 0; //Game level
var points = 0;
var time = totalTime; //Counter

//Current draging element
let draggingElement;
let placeholder = null;
let isDraggingStarted = false;

//Current mouse position relative to the dragging element
let x = 0;
let y = 0;

let intervalId = null;

function init() {
	//Set max number for level input element
	document.settings.level.setAttribute('max', maxLevel);
	getElement('time-placeholder').appendChild(document.createTextNode(time));
}

function getElement (id) {
	if (document.getElementById)
		return document.getElementById(id);
	else
		if (document.all)
			return document.all[id];
		else
			if (document.lyers)
				return document.lyers[id];
			else
				return null;
}

function cancelEvents(e) {
	if (!e)
		e = window.event;
	
	e.cancelBubble = true;
	if (e.stopPropagation)
		e.stopPropagation();
}

function addEvent(evnt, elem, func) {
   if (elem.addEventListener)  // W3C DOM
      elem.addEventListener(evnt,func,false);
   else if (elem.attachEvent) { // IE DOM
      elem.attachEvent("on"+evnt, func);
   }
   else { // No much to do
      elem["on"+evnt] = func;
   }
}

function removeEvent(evnt, elem, func) {
   if (elem.removeEventListener)  // W3C DOM
      elem.removeEventListener(evnt,func,false);
   else if (elem.detachEvent) { // IE DOM
      elem.detachEvent("on"+evnt, func);
   }
}

function getEventTarget(e) {
	//Event
	if (!e)
		var e = window.event; //Windows IE
	
	//Target
	var t;
	if (e.target)
		t = e.target;
	else if (e.srcElement)
		t = e.srcElement;
	
	//Safari bug
	if (t.nodeType == 3)
        t = targ.parentNode;
	
	return t;
}

function shuffleString(s) {
	var a = s.split('');
	var l = a.length;
	var shuffledString = '';
	
	if (l < 2) {
		return s;
	}
	
	do {
		for (var i = 0; i < l; i++) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		shuffledString = a.join('');
	} while (shuffledString == s);
	
	
	return shuffledString;
}

function isCorrect() {
	t = '';
	letterElements = getElement('wordId').children;
	for (i = 0; i < letterElements.length; i++) {
		t = t + letterElements[i].textContent;
	}
	
	if (t == currentWord && time > 0) {
		return true;
	} else {
		return false;
	}
}

function deleteWord() {
	wordElement = getElement('wordId');
	while (wordElement.hasChildNodes()) {
		wordElement.removeChild(wordElement.lastChild);
	}
	currentWord = '';
}

function wordComplete () {
	points = points + 10 * level;
	getElement('points-placeholder').textContent = points;
	if (time > 0) {
		createWord();
	}
}

function createWord() {
	const isBefore = function (nodeL, nodeR) {
		// Get the bounding rectangle of nodes
		const rectL = nodeL.getBoundingClientRect();
		const rectR = nodeR.getBoundingClientRect();
		
		return rectL.left + rectL.height / 2 < rectR.left + rectR.height / 2;
	};
	
	const swap = function (nodeL, nodeR) {
		const parentL = nodeL.parentNode;
		const siblingL = nodeL.nextSibling === nodeR ? nodeL : nodeL.nextSibling;

		// Move `nodeL` to before the `nodeR`
		nodeR.parentNode.insertBefore(nodeL, nodeR);

		// Move `nodeR` to before the sibling of `nodeL`
		parentL.insertBefore(nodeR, siblingL);
	};
	
	const mouseDownHandler = function (e) {
		draggingElement = getEventTarget(e);

		//Calculate the mouse position
		const rect = draggingElement.getBoundingClientRect();
		if (e.pageX) {
			x = e.pageX - rect.left;
			y = e.pageY - rect.top;
		} else {
			x = (e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) - rect.left;
			y = (e.clientY + document.body.scrollTop + document.documentElement.scrollTop) - rect.top;
		}
		
		//Attach the listeners to `document`
		addEvent('mousemove', document, mouseMoveHandler);
		addEvent('mouseup', document, mouseUpHandler);
	};
	
	const mouseMoveHandler = function (e) {
		const draggingRect = draggingElement.getBoundingClientRect();
		
		if (!isDraggingStarted) {
			isDraggingStarted = true;
			
			//Add placeholder, so that following letter stays in place and does not move to the left while dragging
			placeholder = document.createElement('div');
			placeholder.classList.add('placeholder');
			draggingElement.parentNode.insertBefore(
				placeholder,
				draggingElement.nextSibling
			);
			//Looks like getBoundingClientRect does not include margin and border, it's better to relay on placeholder css class here.
			//placeholder.style.width = `${draggingRect.width}px`;
		}
		
		// Set position for dragging element
		draggingElement.style.position = 'absolute';
		//draggingElement.style.top = `${e.pageY - y}px`; //Do not allow to drag up and down
		draggingElement.style.left = `${e.pageX - x}px`;
		
		const prevElement = draggingElement.previousElementSibling;
		const nextElement = placeholder.nextElementSibling;
		
		// User moves item to the left
		if (prevElement && isBefore(draggingElement, prevElement)) {
			swap(placeholder, draggingElement);
			swap(placeholder, prevElement);
			return;
		}
		
		// User moves item to the right
		if (nextElement && isBefore(nextElement, draggingElement)) {
			swap(nextElement, placeholder);
			swap(nextElement, draggingElement);
		}
	};
	
	const mouseUpHandler = function () {
		//Remove placeholder
		placeholder && placeholder.parentNode.removeChild(placeholder);
		placeholder = null;
		
		isDraggingStarted = false;
		
		// Remove the position styles
		draggingElement.style.removeProperty('top');
		draggingElement.style.removeProperty('left');
		draggingElement.style.removeProperty('position');

		x = null;
		y = null;
		draggingElement = null;

		// Remove the handlers of `mousemove` and `mouseup`
		removeEvent('mousemove', document, mouseMoveHandler);
		removeEvent('mouseup', document, mouseUpHandler);
		
		if (isCorrect()) {
			letterElements = getElement('wordId').children;
			for (i = 0; i < letterElements.length; i++) {
				letterElements[i].className = 'letter letter_done';
				removeEvent('mousedown', letterElements[i], mouseDownHandler);
			}
			
			//Leave 500 ms for animation
			setTimeout(wordComplete, 500);
		}
	};
	
	deleteWord(); //Delete current word
	currentWord = words[level - 1][Math.floor(Math.random() * words[level - 1].length)]; //Rondomly chose new word from array according to the level
	shuffledWord = shuffleString(currentWord); //Shuffle choosen word
	
	//Create div elements from shuffled word
	var len = shuffledWord.length;
	for (i = 0; i < len; i++) {
		var letterElement = document.createElement('div');
		letterElement.className = 'letter';
		letterElement.appendChild(document.createTextNode(shuffledWord[i]));
		getElement('wordId').appendChild(letterElement);
		addEvent('mousedown', letterElement, mouseDownHandler);
	}
}

function countdown() {
	time--;
	getElement('time-placeholder').textContent = time;
	if (time < 1) {
		clearInterval(intervalId);
		popupOpen('popup-save-results');
		//alert('Spēle pabeigta, Jūsu punkti: ' + points + '\n' + 'Spēles rezultātu saglabāšana tiks ieviesta 2. darba daļā.');
	}
}

function gameStart() {
	level = getElement('settings-level').value;
	if (isNaN(level) || level < minLevel || level > maxLevel) {
		alert('Incorrect level value');
		return;
	}
	
	time = totalTime;
	getElement('time-placeholder').textContent = time;
	points = 0;
	createWord();
	if (intervalId) {
		clearInterval(intervalId);
	}
	intervalId = setInterval(countdown, 1000);
}
