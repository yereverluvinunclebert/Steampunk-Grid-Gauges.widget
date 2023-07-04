/*
    ES5 polyfill    25 June 2015
*/

/*property
    __proto__, call, create, hasOwnProperty, isArray, keys, prototype, push,
    toString
*/

if (!Object.create) {
    Object.create = function (o) {
        'use strict';
        var F = function () {};

        if (o === null) {
            return {__proto__: null};   // was {"__proto__": null}
        }
        F.prototype = o;
        return new F();
	};
}

if (!Object.keys) {
    Object.keys = function (o) {
        'use strict';
        var name, keys;

        if ((typeof o !== 'object' && typeof o !== 'function') || o === null) {
            throw new TypeError('Object.keys called on non-object or null');
        }

        keys = [];
        for (name in o) {
            if (Object.prototype.hasOwnProperty.call(o, name)) {
                keys.push(name);
            }
        }

        return keys;
    };
}

if (!Array.isArray) {
    Array.isArray = function (o) {
        'use strict';
        return Object.prototype.toString.call(o) === "[object Array]";
    };
}

//////////////////////////////////////////////////////////////////////////////////////////
