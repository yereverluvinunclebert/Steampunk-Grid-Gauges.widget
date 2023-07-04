/*
	Style.setStyle(styleString)

	Copyright © 2007,2014,2015 Harry Whitfield

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

	Style.setStyle(styleString) - version 2.3
	19 November, 2015
	Copyright © 2007,2014,2015 Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*property
    forEach, indexOf, length, match, prototype, replace, setStyle, split,
    toUpperCase
*/

///////////////////////////////// Start of the setStyle function /////////////////////////////////

Style.prototype.setStyle = function (styleString) {
	'use strict';
    var items = styleString.split(';'), last = items[items.length - 1], that = this;

	function trim(s) {
		return s.replace(/^\s+|\s+$/g, "");
	}

	function toCamelCase(s) {
		var t = "", ok = /^-?[a-z]+(-[a-z]+)*$/, f = false;

		function doThis(c) {
		    if (c === "-") {
		        f = true;
		    } else {
		        t += f
		            ? c.toUpperCase()
		            : c;
		        f = false;
		    }
		}

		if (s.match(ok) === null) {
			alert("Badly formed css attribute: " + s);
			return "";
		}

		s.split("").forEach(doThis);

		return t;
	}

    if ((last === "") || (last.indexOf(":") === -1)) {
    	items.length -= 1;
    } 	// remove empty entry

    function doThat(ele) {
        var item = ele.split(":"),
            key = trim(item[0]),
            value = trim(item[1]);

        key = toCamelCase(key);
        if (key !== "") {
			that[key] = value;
		}
    }

    items.forEach(doThat);

};

///////////////////////////////// End  of  the setStyle function /////////////////////////////////
