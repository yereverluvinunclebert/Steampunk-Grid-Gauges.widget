/*
	Log To File - A Log To File Module for Yahoo! Widgets
	Copyright © 2005-2015 Harry Whitfield

	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public licence as
	published by the Free Software Foundation; either version 2 of
	the licence, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public licence for more details.

	You should have received a copy of the GNU General Public
	licence along with this program; if not, write to the Free
	Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston,
	MA  02110-1301  USA

	Log To File - version 2.0 - short version
	20 November, 2015
	Copyright © 2005-2015 Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*
	<preference name="logFlagPref">
		<title>Log Messages to File</title>
		<type>checkbox</type>
		<defaultValue>0</defaultValue>
		<hidden>false</hidden>
		<description>Check this box if you wish messages to be written to file.</description>
	</preference>

	<preference name="logFilePref">
		<title>Log File</title>
		<type>selector</type>
		<style>save</style>
		<defaultValue></defaultValue>
		<hidden>false</hidden>
		<description>Choose the location and name of the log file.</description>
	</preference>
*/

/*property
    debug, getDate, getFullYear, getMilliseconds, getMonth, length,
    logFilePref, logFlagPref, name, toLocaleTimeString, toString,
    userDocumentsFolder, value, writeFile
*/

'use strict';

var logFilePref = preferences.logFilePref.value;	// path to log file
var logFlagPref = preferences.logFlagPref.value;	// flag to control printing to file

function eprint(theStr) {
	if (widget.debug === "on") {
	    print(theStr);
	}
	if ((logFlagPref !== "0") && (logFilePref !== "")) {
	    filesystem.writeFile(logFilePref, theStr + '\n', true);
	}
}

function elog(theStr) {
	// 2004-09-20 17:36:28.004: theStr

	var d = new Date(),
		year = d.getFullYear().toString(),
		tmp = d.getMonth() + 1,
		month = tmp.toString(),
		date,
		ms;

	if (month.length === 1) {
	    month = '0' + month;
	}

	date = d.getDate().toString();
	if (date.length === 1) {
	    date = '0' + date;
	}

	ms = d.getMilliseconds().toString();
	if (ms.length === 2) {
	    ms = '0' + ms;
	} else if (ms.length === 1) {
	    ms = '00' + ms;
	}

	eprint(year + '-' + month + '-' + date + ' ' + d.toLocaleTimeString() + '.' + ms + ': ' + theStr);
}

if (logFilePref === "") {
    preferences.logFilePref.value = system.userDocumentsFolder + "/" + widget.name + ".log";
}

logFilePref = preferences.logFilePref.value;

/*
if (logFlagPref !== "0") {  // remove old log file
    filesystem.remove(logFilePref);
}
*/
