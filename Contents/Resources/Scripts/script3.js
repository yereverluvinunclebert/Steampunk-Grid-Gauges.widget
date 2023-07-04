/* global closeButtonButton, spawnButton, spawnNewWidget */

/*property
    altKey, onGainFocus, onLoseFocus, onMouseDown, onMouseUp, opacity
*/

'use strict';

var closeButton, spawnButton, spawnNewWidget;

closeButton.onMouseUp = function (event) {
    closeButton.opacity = 255;
    if (event.altKey) {
        alert("This widget is a spawnButton.	You can only close other spawns through the original parent widget.");
    } else {
        closeWidget();
    }
};

closeButton.onMouseDown = function () {
    closeButton.opacity = 127;
};

spawnButton.onMouseUp = function (event) {
    spawnButton.opacity = 255;
    if (event.altKey) {
        alert("This widget is a spawn.	You can only select which widgets are restarted through the original parent widget.");
    } else {
        spawnNewWidget();
    }
};

spawnButton.onMouseDown = function () {
    spawnButton.opacity = 127;
};

function showButtons() {
	var i;
	if (closeButton.opacity === 0) {
		for (i = 31; i < 256; i += 32) {
			closeButton.opacity = i;
			spawnButton.opacity = i;
			if (i < 255) {
			    sleep(10);
			}
		}
	}
}

function hideButtons() {
	var i;
	if (closeButton.opacity !== 0) {
		for (i = 224; i >= 0; i -= 32) {
			closeButton.opacity = i;
			spawnButton.opacity = i;
			if (i > 0) {
			    sleep(10);
			}
		}
	}
}

//widget.onGainFocus = showButtons;
//widget.onLoseFocus = hideButtons;

gaugeBody.onMouseEnter = showButtons;
gaugeBody.onMouseExit = hideButtons;

setmenu();