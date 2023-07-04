// Spawning Code
// 20 December, 2015
// Copyright 2004-2015 Harry Whitfield
// mailto:g6auc@arrl.net

// Widget spawning code based on code by Arlo Rose

/* global closeButton, spawnButton, eprint, main_window */

/*property
    RunningWidgets, availHeight, availWidth, copy, count, createObject,
    defaultValue, description, forEach, fromCharCode, gaugePref,
    getDirectoryContents, hOffset, indexOf, item, itemExists,
    konfabulatorWindowLevel, konfabulatorWindowOpacity, lastIndexOf, length,
    match, name, newChildPref, newSpawnPref, noRingPref, open,
    openFileInApplication, option, platform, pollingPref, push, readFile,
    remove, replace, restartListPref, scalePref, sort, spawnKonFilePref, split,
    substring, timeoutPref, title, tooltip, type, vOffset, value, versionPref,
    widgetDataFolder, writeFile
*/

'use strict';

var closeButton, spawnButton, eprint, main_window;

////////////////////////////////////// Start of Spawning Code //////////////////////////////////////

var versionPref = "1.1";

var systemPlatform = system.platform;
//var systemPlatform = "windows";	// for testing windows code on the macintosh

var resPath;        // Path to Resources folder - set below
var spawnPath;      // Path to Spawns folder - set below
var spawnResPath;   // spawnButton's Path to Resources folder - set below
var spawnKonFile;   // Filename of .kon file of spawned widget - set below
var widgetName;     // Name of widget - set below
var children = 0;   // Count of number of children

function escapePath(path) {
	return path.replace(/([\W])/g, '\\$1');
}

function escapeChar(s) {
	return s.replace(/([\W])/g, "\\$1");
}

function escapeSingleQuotes(s) {
	return s.replace(/\'/g, "'\\''");
}

function escapeSpaces(s) {
	return s.replace(/\ /g, "\\ ");
}

filesystem.openFileInApplication = function (ignore, filePath) {
	return filesystem.open(filePath);
};

function getProcessTable() {
	return runCommand('ps -xww').split('\n');
}

function killProcess(pid) {
	if (pid >= 0) {
		runCommand('kill ' + pid);
	}
}

function writePlist(widgetName) {	// widgetName should be the name of a spawned widget's kon file
	var fileName = spawnPath + '/' + widgetName + '.plist', data = "";

    eprint('---- writePlist: widgetName=' + widgetName);
    eprint('---- writePlist: fileName=' + fileName);

	data += '<?xml version="1.0" encoding="UTF-8"?>\n';
	data += '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
	data += '<plist version="1.0">\n';
	data += '<dict>\n';
	data += '\t<key>Pref-gaugePref</key>\n';
	data += '\t<string>' + preferences.gaugePref.value + '</string>\n';
	data += '</dict>\n';
	data += '</plist>\n';

	filesystem.writeFile(fileName, data);
}

function updatePlist() {
    if (spawnKonFile !== "") {
    	writePlist(spawnKonFile);
    }
}

function getPref(widgetName, key) {
	var start, finish, lookFor, pattern, result, string,
		    fileName = spawnPath + '/' + widgetName + '.plist',
		    data = filesystem.readFile(fileName);

	if (data === null) {
	    return "";
	}

	// <key>Pref-gaugePref</key>
	// <string>Gauge Title</string>

	start = escapeChar('<key>Pref-' + key + '</key>') + '\\s*?' + escapeChar('<string>');
	finish = escapeChar('</string>');

	lookFor = start + '([.\\s\\S]*?)' + finish;

	pattern = new RegExp(lookFor);
	result = data.match(pattern);
	if (result !== null) {
//      found  = result[0];		//eprint("found:  " + found);
        string = result[1];		//eprint("string: " + string);
        return string;
    }
    return "";
}

function xtn(s) {
	var idx = s.lastIndexOf("."), ext;

	if (idx >= 0) {
		ext = s.substring(idx);
		if (ext.length > 1) {
			return ext;
		}
	}
	return "";
}

function listSpawnedWidgets() {
	var files = filesystem.getDirectoryContents(system.widgetDataFolder, false),
		list = '',
		n = 0,
		konFile,
		i = 0;

	while (i < files.length) {
		konFile = files[i];
		if (xtn(konFile) === ".kon") {
			if (n === 0) {
			    list += konFile;
			} else {
			    list += ',' + konFile;
			}
			n += 1;
		}
		i += 1;
	}
	return list;
}

function esc(s) {
	var alfa = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		t = "",
		i = 0;

	while (i < s.length) {
		if (alfa.indexOf(s[i]) >= 0) {
			t += s[i];
		} else if ((" " <= s[i]) && (s[i] < String.fromCharCode(127))) {
			t += "\\" + s[i];
		} else {
		    t += s[i];
		}
		i += 1;
	}
	return t;
}

function listActiveWidgets() {	// by Laurent Cozic and Harry Whitfield
	var psTable, i, activeList = "", data, lookFor, found,
		    output, konCOM, runningWidgets, runningWidget;

	if (systemPlatform === "macintosh") {
		psTable = getProcessTable();
		i = 0;
		while (i < psTable.length) {
			data = psTable[i];
			lookFor = '\\D*' + '(\\d+)' + '\\D.*?' + esc('/') + '([^\\/]+)' + esc('.kon ');
			found = data.match(lookFor);
			if (found !== null) {
				activeList += found[1] + ',' + found[2] + '.kon\n';
			} else {
				lookFor = '\\D*' + '(\\d+)' + '\\D.*?' + esc('/') + '([^\\/]+)' + esc('.widget ');
				found = data.match(lookFor);
				if (found !== null) {
					activeList += found[1] + ',' + found[2] + '.widget\n';
				}
			}
			i += 1;
		}
		return activeList;
	}
	updateNow();
	output = "";
	try {
		konCOM = COM.createObject("YahooWidgetEngine.Application");
		runningWidgets = konCOM.RunningWidgets;
		i = 0;
		while (i < runningWidgets.count) {
			if (output !== "") {
			    output += "\n";
			}
			runningWidget = runningWidgets.item(i);
			output += "0," + runningWidget.name;
			i += 1;
		}
	} catch (e) {
		eprint("[Error] YahooWidgetEngine COM: " + e);
	}
	runningWidgets = null;
	konCOM = null;
	output += "\n";
	return output;
}

function getPID(widgetName, widgetTable) {
	var item, i = 0;

//	print("*** getPID: widgetName: " + widgetName);

    while (i < widgetTable.length) {
		item = widgetTable[i].split(',');
		if (widgetName === item[1]) {
		    return item[0];
		}
		i += 1;
	}
	return -1;
}

function closeSpawns() {
	var pid, idx, wName, ls = listSpawnedWidgets(), ps, konFile, psTable, i = 0;

	if (ls === "") {
	    return;
	}
	ps = listActiveWidgets();
	if (ps === "") {
	    return;
	}
	konFile = ls.split(',');
	psTable = ps.split('\n');

	while (i < konFile.length) {
		pid = getPID(konFile[i], psTable);
		if (pid >= 0) {
			idx = konFile[i].lastIndexOf(".kon");
			wName = konFile[i].substring(0, idx);
			eprint("closeSpawns:closing: " + wName);
			tellWidget(wName, "close:name=" + wName);
		}
		i += 1;
	}
}

function reInitializeSpawns() {
	var pid, idx, wName, ls = listSpawnedWidgets(), ps, konFile, psTable, i = 0;

	if (ls === "") {
	    return;
	}
	ps = listActiveWidgets();
	if (ps === "") {
	    return;
	}
	konFile = ls.split(',');
	psTable = ps.split('\n');

	while (i < konFile.length) {
		pid = getPID(konFile[i], psTable);
		if (pid >= 0) {
			idx = konFile[i].lastIndexOf(".kon");
			wName = konFile[i].substring(0, idx);
			eprint("reInitializeSpawns:reInitializing: " + wName);
			tellWidget(wName, "reInitialize:name=" + wName);
		}
		i += 1;
	}
}

function makeNameList() {
	var wlist = listSpawnedWidgets(), files = wlist.split(','), nlist = '', n = 0, i = 0, name;

	while (i < files.length) {
		name = getPref(files[i], 'gaugePref');
		if (name !== "") {
			if (n === 0) {
			    nlist += name + ' == ' + files[i];
			} else {
			    nlist += ';' + name + ' == ' + files[i];
			}
			n += 1;
		}
		i += 1;
	}
	//eprint('nlist=' + nlist);
	return nlist;
}

function inOldRestartList(name, oldRestartList) {
	var item = name.split(' == ');

	if (oldRestartList.indexOf(item[1]) >= 0) {
	    return 'Is Restarted';
	}
	return 'Is Left Alone';
}

function appName() {
	var Yahoo = parseFloat(konfabulatorVersion()) >= 4.5;

	if (Yahoo) {
        return "Yahoo! Widgets.app";
    }
	return "Yahoo! Widget Engine.app";
}

function appFolderName() {
	return "Yahoo! Widget Engine";
}

function restartListForm(oldRestartList) {
	var nameList = makeNameList(), nameArray, formfields = [], i, formResults, result,
            n, item, fileName, userHome, path;

	function doThis(ele) {
		var nameItem = ele.split(' == '),
		    formfield = new FormField();

		formfield.title = nameItem[0] + ':';
		formfield.type = 'popup';
		formfield.option = [];
		formfield.option[0] = 'Is Restarted';
		formfield.option[1] = 'Is Left Alone';
		formfield.option[2] = 'Is Purged';
		formfield.defaultValue = inOldRestartList(ele, oldRestartList);
		formfield.description = nameItem[1];
		formfields.push(formfield);
	}

	if (nameList === "") {
		alert("This Widget has no spawns.");
		return "";
	}

	nameArray = nameList.split(';');
	nameArray = nameArray.sort();
	nameArray.forEach(doThis);

	formResults = form(formfields, 'Spawn Management', 'OK');
	result = '';
	n = 0;

	if (formResults !== null) {
	    i = 0;
	    while (i < nameArray.length) {
			if (formResults[i] === 'Is Restarted') {
				item = nameArray[i].split(' == ');
				if (n === 0) {
				    result += item[1];
				    eprint(result);
				} else {
				    result += ',' + item[1];
				    eprint(result);
				}
				n += 1;
			} else if (formResults[i] === 'Is Purged') {
				item = nameArray[i].split(' == ');
				fileName = item[1];

				if (systemPlatform === "macintosh") {
					userHome = resolvePath("~");
					path = userHome + "/Library/Preferences/" + appFolderName() + "/" + fileName + ".plist";
					filesystem.remove(path);
				} else {
					// clear out the equivalent data from the Windows registry
					eprint("clear out the equivalent data from the Windows registry");
				}

				path = spawnPath + '/' + fileName + '.plist';
				filesystem.remove(path);

				path = spawnPath + '/' + fileName;
				filesystem.remove(path);
			}
			i += 1;
		}
	} else {
		result = oldRestartList;
	}

	return result;
}

function restartList() {
	preferences.restartListPref.value = restartListForm(preferences.restartListPref.value);
	savePreferences();
}

// Code to spawn and delete widgets

function startSpawnedWidgets() {	// used by original ancestor widget to relaunch selected spawned widgets
	var ls = preferences.restartListPref.value, files, konFile, konPath, i = 0;

	if (ls === "") {
	    return;
	}
	files = ls.split(',');

	while (i < files.length) {
		konFile = files[i];
		konPath = spawnPath + "/" + konFile;
		eprint("Starting " + konFile);
		eprint("Result: " + filesystem.openFileInApplication(appName(), konPath));
		i += 1;
	}
}

function oldPrefs() { // get the parent's prefs - executed by the parent
	var result = "";

	result += preferences.konfabulatorWindowLevel.value + "<pref-sep>";
	result += preferences.konfabulatorWindowOpacity.value + "<pref-sep>";

    result += preferences.gaugePref.value + "<pref-sep>";
    result += preferences.scalePref.value + "<pref-sep>";
    result += preferences.pollingPref.value + "<pref-sep>";
    result += preferences.timeoutPref.value + "<pref-sep>";
    result += preferences.noRingPref.value + "<pref-sep>";

	result += preferences.newSpawnPref.value;

	return result;
}

function newPrefs(theSpawnPos) { // set the child's prefs - executed by the child
	preferences.konfabulatorWindowLevel.value = theSpawnPos[3];
	preferences.konfabulatorWindowOpacity.value = theSpawnPos[4];

    preferences.gaugePref.value = theSpawnPos[5];

    preferences.scalePref.value = theSpawnPos[6];
    preferences.pollingPref.value = theSpawnPos[7];
    preferences.timeoutPref.value = theSpawnPos[8];
    preferences.noRingPref.value = theSpawnPos[9];

	preferences.newSpawnPref.value = theSpawnPos[10];

	if (preferences.newSpawnPref.value === "Are Restarted") {
		preferences.newSpawnPref.value = "Are Left Alone";
	}
}

function spawnNewWidget() {
	var konFile, konPath, hOffset, vOffset, scaleBy, hShift, vShift, newHoffset, newVoffset, fileContent;

	if (children >= 9) {
	    beep();
	    return;
	}
	children += 1;

//	print("**** spawnNewWidget has set children to: " + children);

	konFile = widgetName + children + ".kon";
	eprint("spawnNewWidget: konFile: " + konFile);
	konPath = spawnPath + "/" + konFile;

	if (filesystem.itemExists(konPath)) {
		eprint("Starting " + konFile);
		filesystem.openFileInApplication(appName(), konPath);
		return;
	}

//	print("**** Spawning:" + konFile);

	hOffset = 72;	// original hOffset
	vOffset = 36;	// original vOffset

	scaleBy = Number(preferences.scalePref.value) / 100;

	hShift = 320 * scaleBy;	// horizontal shift
	vShift = 320 * scaleBy;	// vertical shift at end of row

	newHoffset = main_window.hOffset + hShift;
	newVoffset = main_window.vOffset;
	if (newHoffset >= screen.availWidth - hShift) {
		newHoffset = hOffset;
		newVoffset += vShift;
		if (newVoffset >= screen.availHeight - vShift) {
		    newVoffset = vOffset;
		}
	}

	fileContent = "";
	fileContent += newHoffset + "<pref-sep>";
	fileContent += newVoffset + "<pref-sep>";
	fileContent += konFile + "<pref-sep>";
	fileContent += oldPrefs();

	filesystem.writeFile(spawnPath + "/spawnPos.txt", fileContent);
	filesystem.copy(resPath + "/Spawns/spawnTMPL.kon", konPath);

	filesystem.openFileInApplication(appName(), konPath);
}

function deleteKonFile() { // called on Unload of spawned widget
	eprint("deleteKonFile:Deleting:" + spawnKonFile);
	filesystem.remove(spawnKonFile);
	//sleep(3000);	// enable to see the debug info
}

function purgeCache(fileName) {
	var userHome, path, command;

	if (systemPlatform === "macintosh") {
//      /Users/nhw/Library/Preferences/Yahoo! Widget Engine/Steampunk Grid Gauges.widget.plist
		userHome = resolvePath("~");
		path = userHome + "/Library/Preferences/" + appFolderName() + "/" + fileName + ".plist";
		command = "defaults read " + path;
		eprint("runCommand: " + command);
	    runCommand(command);
	}
}

// Code to find out whether this is an original widget or a spawned widget

//PATH=.../WidgetName.widget/Contents			-- original widget
//PATH=.../WidgetName.widget/Contents/Spawns	-- spawned  widget

var PATH = resolvePath(".");
eprint("PATH=" + PATH);
var ix = PATH.lastIndexOf("/");
var folder = PATH.substring(ix + 1); // "Contents" or "Spawns"

var idx, temp, theSpawnPos = null, idxKon;

//eprint("folder = " + folder);

if (folder === "Contents") { 	// this is an original widget
	resPath = resolvePath("."); // Resource path for original widget
	spawnPath = system.widgetDataFolder; // Path to spawned .kon files
	//spawnResPath = PATH;
	spawnResPath = resolvePath(".");

	idx = PATH.lastIndexOf(".widget/Contents");
	temp = PATH.substring(0, idx);
	idx = temp.lastIndexOf("/");
	widgetName = temp.substring(idx + 1);

	eprint("---- original widget: widgetName: " + widgetName);
	eprint("---- original widget: spawnPath: " + spawnPath);

    if (versionPref !== preferences.versionPref.value) {
        preferences.versionPref.value = versionPref;
        preferences.restartListPref.value = "";
        closeSpawns();
        filesystem.remove(system.widgetDataFolder);
    }

    if (!filesystem.itemExists(system.widgetDataFolder + "/Resources/Scripts/script.js")) {
	    eprint("---- updating widget: widgetName: " + widgetName);
        filesystem.copy("Resources", system.widgetDataFolder);
        filesystem.copy("Spawns", system.widgetDataFolder);
        filesystem.copy("widget.xml", system.widgetDataFolder);
    }

    spawnButton.tooltip += "  Hold down the alt key and click to manage your spawned gauges.";
    closeButton.tooltip += "  Hold down the alt key and click to close the spawned gauges.";

	if (preferences.newSpawnPref.value === "Are Restarted") {   // start any children with kon files
	    eprint("---- starting spawned widgets: widgetName: " + widgetName);
		startSpawnedWidgets();
	}
	spawnKonFile = "";  // empty in the case of the original ancestor
	eprint("---- Gauge: " + preferences.gaugePref.value);
} else {
	resPath = resolvePath(".");
	spawnPath = resolvePath(".");
	spawnResPath = resolvePath(".");
	widgetName = widget.name;

	if (!filesystem.itemExists(widget.name + ".kon.plist")) {
		eprint("---- initialising new spawned widget: widgetName: " + widgetName);
		eprint("---- new spawned widget: spawnPath: " + spawnPath);

		theSpawnPos = filesystem.readFile("spawnPos.txt").split("<pref-sep>");	// read the file written by the parent widget
		main_window.hOffset = theSpawnPos[0];
		main_window.vOffset = theSpawnPos[1];
		preferences.spawnKonFilePref.value = theSpawnPos[2];				    // save the konFile Name
		spawnKonFile = theSpawnPos[2];
		newPrefs(theSpawnPos);												    // set the child's prefs as copy of parents
		preferences.newChildPref.value = "0";								    // child now has its own prefs
        savePreferences();
//        purgeCache(widget.name + ".kon");
	} else {
		eprint("---- initialising old spawned widget: widgetName: " + widgetName);
		eprint("---- old spawned widget: spawnPath: " + spawnPath);

	    spawnKonFile = preferences.spawnKonFilePref.value;		// find our own .kon file
	}

	eprint("---- Gauge: " + preferences.gaugePref.value);
	writePlist(spawnKonFile);
}
// End of code to spawn and delete widgets
