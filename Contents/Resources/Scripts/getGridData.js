/*
	Get Grid Data - Fetches and parses electricity grid data
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

	Get Grid Data - version 1.1
	20 December, 2015
	Copyright 2015 Dean Beedell and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*property
    fetchAsync, gw, location, match, outputFile, pc, response, result,
    setRequestHeader, timeout, timeoutPref, value
*/

'use strict';

function getURL(url, outputFile, referer, callback) {
    var myUrl = new URL();

    function url_done(myUrl) {
        var result = myUrl.result,
            resp = myUrl.response;

        if (resp === 200) {
            if (outputFile === "") {
                callback(result);
                return;
            }
            callback("");
            return;
        }
        callback(null);
    }

    myUrl.location = url;

    if (outputFile !== "") {
        myUrl.outputFile = outputFile;
    }

    if (referer !== '') {
        myUrl.setRequestHeader('Referer', referer);
    }

    myUrl.setRequestHeader('Accept-Charset', 'utf-8');
    myUrl.timeout = Number(preferences.timeoutPref.value);

    myUrl.fetchAsync(url_done);
}

function getFrequency(data) {   // <b>Frequency 50.003Hz</b>
    var lookFor = /<b>Frequency\ (\d\d\.\d\d\d)Hz<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1])};
    }
    return null;
}

function getFrequencyF(data) {   // <b>European frequency 50.021Hz</b>
    var lookFor = /<b>European\ frequency\ (\d\d\.\d\d\d)Hz<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1])};
    }
    return null;
}

function getFrequencyEU(data) {   //  <f>50.009</f> <f>50.01</f> <f>50.1</f>
    var lookFor = /<f>(\d\d(\.\d{1,3})?)<\/f>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1])};
    }
    return null;
}

function getDemand(data) {  // <b>Demand 32.94GW</b>
    var lookFor = /<b>Demand\ (\d\d\.\d\d)GW<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1])};
    }
    return null;
}

function getCoal(data) {    // <b>Coal 7.52GW<br>(22.83%)</b>
    var lookFor = /<b>Coal\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getNuclear(data) {    // <b>Nuclear 7.88GW<br>(23.93%)</b>
    var lookFor = /<b>Nuclear\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getCCGT(data) {    // <b>CCGT 7.36GW<br>(22.35%)</b>
    var lookFor = /<b>CCGT\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getOCGT(data) {    // <b>OCGT 0.00GW<br>(0.00%)</b>
    var lookFor = /<b>OCGT\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getHydro(data) {    // <b>Hydro 5.34GW<br>(9.03%)</b>
    var lookFor = /<b>Hydro\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getWind(data) {    // <b>Wind 4.41GW<br>(13.39%)</b>
    var lookFor = /<b>Wind\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getPumped(data) {	// <b>Pumped 0.35GW<br>(1.02%)</b>
    var lookFor = /<b>Pumped\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getGas(data) {    // <b>Gas 0.27GW<br>(0.50%)</b>
    var lookFor = /<b>Gas\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getOil(data) {    // <b>Oil 0.27GW<br>(0.50%)</b>
    var lookFor = /<b>Oil\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getBiomass(data) {    // <b>Biomass 0.52GW<br>(0.97%)</b>
    var lookFor = /<b>Biomass\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getSolar(data) {    // <b>Solar 0.04GW<br>(0.07%)</b>
    var lookFor = /<b>Solar\ (\d{1,2}\.\d\d)GW<br>\((\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}


function getFrenchICT(data) {	// <b>French ICT 2.00GW<br>(5.82%)</b>
    var lookFor = /<b>French\ ICT\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getDutchICT(data) {	// <b>Dutch ICT 1.02GW<br>(2.97%)</b>
    var lookFor = /<b>Dutch\ ICT\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getIrishICT(data) {	// <b>Irish ICT 1.02GW<br>(2.97%)</b>
    var lookFor = /<b>Irish\ ICT\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getE_WICT(data) {	// <b>E-W ICT -0.20GW<br>(-0.58%)</b>
    var lookFor = /<b>E-W\ ICT\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getGermany(data) {	// <b>Germany -2.22GW<br>(-4.06%)</b>
    var lookFor = /<b>Germany\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getBelgium(data) {	// <b>Belgium -1.57GW<br>(-2.87%)</b>
    var lookFor = /<b>Belgium\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getItaly(data) {	// <b>Italy 1.38GW<br>(2.52%)</b>
    var lookFor = /<b>Italy\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getSwitzerland(data) {	// <b>Switzerland -0.00GW<br>(0.00%)</b>
    var lookFor = /<b>Switzerland\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getSpain(data) {	// <b>Spain -3.28GW<br>(-6.00%)</b>
    var lookFor = /<b>Spain\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getUK(data) {	// <b>UK -2.69GW<br>(-5.02%)</b>
    var lookFor = /<b>UK\ (-?\d{1,2}\.\d\d)GW<br>\((-?\d{1,2}\.\d\d)%\)<\/b>/,
        found = data.match(lookFor);

    if (found !== null) {
        return {gw: Number(found[1]), pc: Number(found[2])};
    }
    return null;
}

function getData(type, data) {
    switch (type) {
    case "Frequency":
        return getFrequency(data);
    case "FrequencyF":
        return getFrequencyF(data);
    case "FrequencyEU":
        return getFrequencyEU(data);
    case "Demand":
        return getDemand(data);
    case "Coal":
        return getCoal(data);
    case "Nuclear":
        return getNuclear(data);
    case "CCGT":
        return getCCGT(data);
    case "OCGT":
        return getOCGT(data);
    case "Hydro":
        return getHydro(data);
    case "Wind":
        return getWind(data);
    case "Pumped":
    	return getPumped(data);
    case "Gas":
    	return getGas(data);
    case "Oil":
    	return getOil(data);
    case "Biomass":
    	return getBiomass(data);
    case "Solar":
    	return getSolar(data);
    case "FrenchICT":
    	return getFrenchICT(data);
    case "DutchICT":
    	return getDutchICT(data);
    case "IrishICT":
    	return getIrishICT(data);
    case "E-WICT":
    	return getE_WICT(data);
    case "Germany":
    	return getGermany(data);
    case "Belgium":
    	return getBelgium(data);
    case "Italy":
    	return getItaly(data);
    case "Switzerland":
    	return getSwitzerland(data);
    case "Spain":
    	return getSpain(data);
    case "UK":
    	return getUK(data);
    }
}

/* Test Code
var data = filesystem.readFile("/Users/nhw/Desktop/data.html");
var result;

result = getFrequency(data);
print("Frequency: " + result.gw:);

result = getDemand(data);
print("Demand: " + result.gw);

result = getCoal(data);
print("Coal: " + result.gw + ", " + result.pc);


result = getNuclear(data);
print("Nuclear: " + result.gw + ", " + result.pc);

result = getCCGT(data);
print("CCGT: " + result.gw + ", " + result.pc);

result = getWind(data);
print("Wind: " + result.gw + ", " + result.pc);
*/
