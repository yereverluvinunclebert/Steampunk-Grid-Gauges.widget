/*
	Tell Widget Parser
	Copyright © 2007-2015 Ricky Romero and Harry Whitfield

	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public licence as published by the
	Free Software Foundation; either version 2 of the licence, or (at your
	option) any later version.

	This program is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	General Public licence for more details.

	You should have received a copy of the GNU General Public licence along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

	Tell Widget Parser - version 1.7 - for WCP 2.9.9
	25 June, 2015
	Copyright © 2007-2015 Ricky Romero and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/* global closwWidget, reInitialize, widgetName */

/*property
    data, event, match, onTellWidget
*/

'use strict';

var closwWidget, reInitialize, widgetName;

function parseTellCommand(data) {	// "action:name1=param1;name2=param2;name3=param3;name4=param4" etc.
                                    // data   ::= action ":" params
									// params ::= (param) (";" param)*
									// param  ::= name "=" value
	var params = [],
	    k = 0,
	    action,
	    lookFor = /^(\w+)\:(?:(\w+)\=([^;]+))((?:;(?:\w+)\=(?:[^;]+))*)$/,
	    found = data.match(lookFor);

	if (found !== null) {
		action = found[1];
		params[k] = [found[2], found[3]];
		k += 1;

		while (found[4]) {
			data = found[4];
			lookFor = /^(;)(\w+)\=([^;]+)((?:;(?:\w+)\=(?:[^;]+))*)$/;
			found = data.match(lookFor);
			if (found !== null) {
				params[k] = [found[2], found[3]];
				k += 1;
			}
		}
		return [action, params];	// returns array with [0] = action and [1] =  params
	} else {
	    return null;
	}
}

var handleExternalCall = function () {
	var command, action, params, item, name, wName;
	command = parseTellCommand(system.event.data);	// "reInitialize:name=widgetName"
	if (command !== null) {
		action = command[0];	// "reInitialize" or "close"
		params = command[1];	// [ [ "name", "widgetName" ] ]

		item = params[0];
		name = item[0];
		wName = item[1];

		if ((name === "name") && (wName === widgetName)) {
    		if (action === "reInitialize") {
				reInitialize();
    		} else if (action === "close") {
				closeWidget();
    		}
    	}
	}
};

widget.onTellWidget = handleExternalCall;	//if not set in the .kon file
