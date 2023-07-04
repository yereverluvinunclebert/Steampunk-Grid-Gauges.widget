/*
	Grid Gauges - Displays electricity grid gauges
	Copyright © 2015 Dean Beedell and Harry Whitfield

	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public licence as published by the
	Free Software Foundation; either version 2 of the licence, or (at your
	option) any later version.

	This program is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the GNU
	General Public licence for more details.

	You should have received a copy of the GNU General Public licence along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin St, Fifth Floor, Boston, MA	02110-1301	USA

	Grid Gauges - version 1.1
	20 December, 2015
	Copyright 2015 Dean Beedell and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/* global digit1, digit2, digit3, digit4, digit5, hand, buildVitality, gaugeBody,
    getURL, getData, elog, eprint, rubberSurround,
    main_window, counterHole1, counterHole2, counterHole3,  counterHole4, counterHole5,
    scaleRasterised, layer21, rimRubyHoleCopy2, windowReflection, outerring2, unit, source,
    text1, text2, text3, text4, text5, closeButton, spawnButton, closeSpawns, restartList,
    spawnNewWidget, showButtons, hideButtons, updatePlist, spawnPath
*/

/*property
    altKey, data, debug, defaultValue, forEach, gaugePref, getTime, gw,
    hOffset, hRegistrationPoint, height, hidden, indexOf, interval, itemExists,
    join, length, logFilePref, logFlagPref, noRingPref, onMultiClick,
    onPreferencesChanged, onTimerFired, onUnload, opacity, option, optionValue,
    pc, pollingPref, push, readFile, rotation, round, scalePref, size, some,
    split, src, srcHeight, srcWidth, ticking, toFixed, toLowerCase, tooltip,
    vOffset, vRegistrationPoint, value, valuePref, width, writeFile
*/

'use strict';

include("Resources/Scripts/ES5.js");
include("Resources/Scripts/logToFile.js");
include("Resources/Scripts/vitality.js");
include("Resources/Scripts/getGridData.js");
include("Resources/Scripts/tell.js");               // Tell Widget Parser

var digit1, digit2, digit3, digit4, digit5, hand, buildVitality, gaugeBody,
    	getURL, getData, elog, eprint, rubberSurround,
    	main_window, counterHole1, counterHole2, counterHole3, counterHole4, counterHole5,
    	scaleRasterised, layer21, rimRubyHoleCopy2, windowReflection, outerring2, unit, source,
    	text1, text2, text3, text4, text5, closeButton, spawnButton, closeSpawns, restartList,
    	spawnNewWidget, showButtons, hideButtons, updatePlist, spawnPath;

var euURL = "http://www.mainsfrequency.com/";       // for Frequency Europe
var gwURL = "http://www.gridwatch.templar.co.uk/";  // for all other gauges

var gaugeBodyTooltip = "Double-click to open the data source website.\n" +
        "Alt-double-click to update the dial.";
gaugeBody.tooltip = gaugeBodyTooltip;

var theClockTimer = new Timer();
theClockTimer.ticking = false;
theClockTimer.interval = 1;


var logFilePref, logFlagPref, scale, gaugePref, gaugeArray, theURL, dataType, country,
        minValue, maxValue, multiplier, deltaValue, unitAbbrev, dataName;

preferences.valuePref.hidden = (widget.debug === "off");

var running = false;

var gaugeData = filesystem.readFile("Resources/gauges.txt");
preferences.gaugePref.optionValue = gaugeData.split(/\r\n?|\n/);
preferences.gaugePref.defaultValue = preferences.gaugePref.optionValue[0];
var gaugeOptions = [];

preferences.gaugePref.optionValue.forEach(function (ele, idx) {
	if (ele === "-") {
		gaugeOptions.push(ele);
	} else {
		gaugeOptions.push(ele.split(" ", 2).join(" "));
	}
//	eprint('"' + gaugeOptions[idx] + '"');
});
preferences.gaugePref.option = gaugeOptions;

function scaleWidget(scale) {

    function sc(img, hOffset, vOffset) {
        img.hOffset = hOffset * scale;
        img.vOffset = vOffset * scale;
        img.width = img.srcWidth * scale;
        img.height = img.srcHeight * scale;
    }

    function scTxt(txt, hOffset, vOffset, width, height, hReg, vReg, size) {
        txt.hOffset = hOffset * scale;
        txt.vOffset = vOffset * scale;
        txt.width = width * scale;
        txt.height = height * scale;
        txt.hRegistrationPoint = hReg * scale;
        txt.vRegistrationPoint = vReg * scale;
        txt.size = Math.round(size * scale);
    }

    main_window.width = 310 * scale;
    main_window.height = 310 * scale;
    
    

    sc(gaugeBody, 31, 28);
    sc(rubberSurround, 6, 6);




    sc(counterHole5, 178, 113);
    sc(counterHole4, 162, 113);
    sc(counterHole3, 146, 113);
    sc(counterHole2, 126, 113);
    sc(counterHole1, 110, 113);

    sc(digit5, 183, 125);
    sc(digit4, 167, 125);
    sc(digit3, 151, 125);
    sc(digit2, 131, 125);
    sc(digit1, 115, 125);

    sc(scaleRasterised, 0, 0);

    sc(hand, 152, 161);                     // was 171
    hand.hRegistrationPoint = 14 * scale;
    hand.vRegistrationPoint = 91 * scale;   // was 101

    sc(layer21, 62, 63);
    sc(rimRubyHoleCopy2, 144, 153);         // was 163
    sc(windowReflection, 172, 88);
    sc(outerring2, 4, 4);

    sc(unit, 152, 225);
    sc(source, 152, 241);

    scTxt(text5, 152, 155, 26, 11, 0, 81, 11);
    scTxt(text4, 152, 155, 26, 11, 0, 82, 11);
    scTxt(text3, 152, 155, 26, 11, 0, 83, 11);
    scTxt(text2, 152, 155, 26, 11, 0, 82, 11);
    scTxt(text1, 152, 155, 26, 11, 0, 81, 11);

    if (preferences.noRingPref.value === "1") {
        sc(closeButton, 70, 230);
        sc(spawnButton, 200, 230);
    } else {
        sc(closeButton, 8, 250);
        sc(spawnButton, 270, 250);
    }


}

widget.onPreferencesChanged = function () {
	logFilePref = preferences.logFilePref.value;	// path to log file
    logFlagPref = preferences.logFlagPref.value;	// flag to control printing to file

    scale = Number(preferences.scalePref.value) / 100;
    scaleWidget(scale);

    if (preferences.noRingPref.value === "1") {
        rubberSurround.opacity = 0;
        outerring2.opacity = 0;
    } else {
        rubberSurround.opacity = 255;
        outerring2.opacity = 255;
    }

    gaugePref = preferences.gaugePref.value;
    eprint("gaugePref: " + gaugePref);
    gaugeArray = gaugePref.split(" ");

    theURL = euURL;
    if (gaugeArray[0] !== "FrequencyEU") {
        theURL = gwURL;
        if (gaugeArray[1] === "France") {
            theURL += "france/";
        }
    }
    dataType = gaugeArray[0];
    eprint("dataType: " + dataType);
    country = gaugeArray[1];
    minValue = Number(gaugeArray[2]);
    maxValue = Number(gaugeArray[3]);
    deltaValue = Number(gaugeArray[4]);

    multiplier = 100 / (maxValue - minValue);

    dataName = dataType;

    text5.data = minValue;
    text4.data = (3 * minValue + maxValue) / 4;
    text3.data = (minValue + maxValue) / 2;
    text2.data = (minValue + 3 * maxValue) / 4;
    text1.data = maxValue;

    if (dataType.indexOf("Frequency") === 0) {
        unit.src = "Resources/Images/hz.png";
        source.src = "Resources/Images/frequency.png";
        unitAbbrev = "Hz";
        dataName = "Frequency";
        text1.rotation = 72;
        text5.rotation = -70;
    } else {
        unit.src = "Resources/Images/gw.png";
        eprint("src: " + "Resources/Images/" + dataType.toLowerCase() + ".png");
        source.src = "Resources/Images/" + dataType.toLowerCase() + ".png";
        unitAbbrev = "GW";
        text1.rotation = 75;
        text5.rotation = -74;
    }

    if (running) {
        updatePlist();  // rewrite Plist of spawned widget
    }

	theClockTimer.interval = 1;
};

widget.onUnload = function () {
    elog("Widget Closed");
};

gaugeBody.onMultiClick = function (event) {
    if (event.altKey) {
        elog("Update Requested");
        theClockTimer.interval = 1;
        return;
    }
    openURL(theURL);
};

var findOptionIndex = function (option, value) {
	var i;

	if (option.some(function (ele, idx) {
		i = idx;
		return ele === value;
	})) {
		return i;
	}
	return -1;
};


var resetRange = function (val) {
	var newMinValue = minValue, newMaxValue = maxValue, i;

	eprint("resetRange: " + val);

	if (deltaValue === 0) {	// was if (dataType.indexOf("Frequency") === 0)
		return;
	}
	if ((val < 0) || (val > 100)) {
		return;
	}

	if (val < minValue) {
		if (minValue === 0) {
			return;
		}
		newMinValue -= deltaValue;
	} else if (val > maxValue) {
		if (maxValue === 100) {
			return;
		}
		newMaxValue += deltaValue;
	}

	preferences.gaugePref.value = dataType + " " + country + " " + newMinValue + " " + newMaxValue + " " + deltaValue;
	eprint("preferences.gaugePref.value: " + preferences.gaugePref.value);
	i = findOptionIndex(preferences.gaugePref.option, dataType + " " + country);
	eprint("index: " + i);
	if (i !== -1) {
		preferences.gaugePref.optionValue[i] = preferences.gaugePref.value;
		eprint("preferences.gaugePref.optionValue[" + i + "]: " + preferences.gaugePref.optionValue[i]);
	}
	savePreferences();
	widget.onPreferencesChanged();
};


theClockTimer.onTimerFired = function () {
    var value,
        dataPath,
        timePath,
        time,
     	display = function (val) {
			var sval, face;

			if (val < 0) {
				val = -val;
				hand.src = "Resources/Images/redHand.png";
			} else {
				hand.src = "Resources/Images/hand.png";
			}

			if (val >= 100) {
				sval = "99.999";
			} else {
				sval = val.toFixed(3);
				if (sval.length < 6) {
					sval = "0" + sval;
				}
			}

			digit1.src = "Resources/Images/" + sval[0] + ".png";
			digit2.src = "Resources/Images/" + sval[1] + ".png";
			digit3.src = "Resources/Images/" + sval[3] + ".png";
			digit4.src = "Resources/Images/" + sval[4] + ".png";
			digit5.src = "Resources/Images/" + sval[5] + ".png";

			if (val < minValue) {
				resetRange(val);
				if (val < minValue) {
					val = minValue;
				}
			} else if (val > maxValue) {
				resetRange(val);
				if (val > maxValue) {
					val = maxValue;
				}
			}

			// now map val to 0..100
			val = multiplier * (val - minValue);

            hand.rotation = -72 + 1.44 * val;   // was -65 * 1.3 * val

			face = String(5 * Math.round(val / 5)) + ".png";
			buildVitality("Resources/Faces/" + face);
		},
		callback = function (data) {
	        var theValue, text;

	        if (data !== null) {
		        theValue = getData(dataType, data);

		        if (theValue !== null) {
			        display(theValue.gw);
			        text = dataName + " " + country + ": " + theValue.gw.toFixed(3) + unitAbbrev + (theValue.pc
			            ? " (" + theValue.pc.toFixed(2) + "%)"
			            : "");
			        text += " in [" + minValue + ", " + maxValue + "]";
			        elog(text);
			        gaugeBody.tooltip = text + "\n" + gaugeBodyTooltip;
			        return;
		        }
		        display(maxValue);
		        eprint("Parse error:\n" + data);
		        theClockTimer.interval = 5;
		        return;
	        }
	        display(minValue);
	        eprint("Data error");
		    theClockTimer.interval = 5;
		},
		callback2 = function (data) {
	        var theValue, text;

	        if (data === "") {
	            data = filesystem.readFile(dataPath);
		        theValue = getData(dataType, data);

		        if (theValue !== null) {
			        display(theValue.gw);
			        text = dataName + " " + country + ": " + theValue.gw.toFixed(3) + unitAbbrev + (theValue.pc
			            ? " (" + theValue.pc.toFixed(2) + "%)"
			            : "");
			        text += " in [" + minValue + ", " + maxValue + "]";
			        elog(text);
			        gaugeBody.tooltip = text + "\n" + gaugeBodyTooltip;
			        return;
		        }
		        display(maxValue);
		        eprint("Parse error:\n" + data);
		        theClockTimer.interval = 5;
		        return;
	        }
	        display(minValue);
	        eprint("Data error");
		    theClockTimer.interval = 5;
		};

    if (!preferences.valuePref.hidden) {
        value = preferences.valuePref.value;
    	if (value !== "") {
            value = Number(value);
    		if (!isNaN(value)) {
				display(value);
				gaugeBody.tooltip = gaugeBodyTooltip;
		   		return;
		   	}
        }
    }

    theClockTimer.interval = Number(preferences.pollingPref.value);

    if (theURL === euURL) {
        theClockTimer.interval = Number(preferences.pollingPref.value);
	    getURL(theURL + "frequenz9.php", "", "", callback);  // for FrequencyEU
	} else {
//	    getURL(theURL, "", "", callback);
        dataPath = spawnPath + "/" + country + ".html";
        timePath = spawnPath + "/" + country + ".txt";
        if (filesystem.itemExists(dataPath) && filesystem.itemExists(timePath)) {
            time = parseInt(filesystem.readFile(timePath), 10) || 0;
            if (new Date().getTime() < time + 300000) {
                callback2("");
                theClockTimer.interval = 30;
                return;
            }
        }
	    filesystem.writeFile(timePath, new Date().getTime().toFixed(0));
	    getURL(theURL, dataPath, "", callback2);
	    theClockTimer.interval = 300;
	}
};

include("Resources/Scripts/spawning.js");


widget.onPreferencesChanged();  // initialise widget variables

elog("Widget Started");

//===========================================
// this is startup
//===========================================
theClockTimer.ticking = true;
running = true;

var debugFlg = "";

debugFlg = preferences.debugflgPref.value;
if (debugFlg === "1") {
    preferences.imageEditPref.hidden=false;
    preferences.imageCmdPref.hidden=false;
} else {
    preferences.imageEditPref.hidden=true;
    preferences.imageCmdPref.hidden=true;
}

setmenu();