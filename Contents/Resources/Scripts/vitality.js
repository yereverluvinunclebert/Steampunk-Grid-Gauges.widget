/*properties
    appendChild, createDocument, createElement, dockOpen, setAttribute,
    setDockItem
*/

'use strict';

function buildVitality(src) {
	var d, v, dock_bg;

	if (!widget.dockOpen) {
		return;
	}

	d = XMLDOM.createDocument();
	v = d.createElement("dock-item");
	v.setAttribute("version", "1.0");
	d.appendChild(v);

	dock_bg = d.createElement("image");
	dock_bg.setAttribute("src", src);
	dock_bg.setAttribute("hOffset", "0");
	dock_bg.setAttribute("vOffset", "0");
	dock_bg.setAttribute("width", "70");
	dock_bg.setAttribute("height", "70");
	v.appendChild(dock_bg);

	widget.setDockItem(d, "fade");
}
