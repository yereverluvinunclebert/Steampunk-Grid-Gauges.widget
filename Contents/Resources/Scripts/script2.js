/* global close, spawnButton, closeSpawns, restartList, spawnNewWidget */

/*property
    altKey, onGainFocus, onLoseFocus, onMouseDown, onMouseUp, opacity
*/

'use strict';

var close, spawnButton, closeSpawns, restartList, spawnNewWidget;

closeButton.onMouseUp = function (event) {
    closeButton.opacity = 255;
    if (event.altKey) {
        closeSpawns();
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
        restartList();
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


gaugeBody.onMouseEnter = showButtons;
gaugeBody.onMouseExit = hideButtons;

setmenu();