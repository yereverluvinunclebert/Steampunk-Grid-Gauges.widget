var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";

//===========================================
// this function allows a spacer in the menu
//===========================================
function nullfunction() {
    print("null");
}
//=====================
//End function
//=====================

//===========================================
// this function causes explorer to be opened 
// to the relevant folder
//===========================================
function findWidget() {

 // temporary development version of the widget
    var widgetFullPath = convertPathToPlatform(system.userWidgetsFolder + "/" + widgetName);
    var alertString = "The widget folder is: \n";
    if (filesystem.itemExists(widgetFullPath)) {
        alertString += system.userWidgetsFolder + " \n\n";
        alertString += "The widget name is: \n";
        alertString += widgetName + ".\n ";

        alert(alertString, "Open the widget's folder?", "No Thanks");

        filesystem.reveal(widgetFullPath);
    } else {
        widgetFullPath = resolvePath(".");   
        filesystem.reveal(widgetFullPath);
        print("widgetFullPath " + widgetFullPath);
    }
}
//=====================
//End function
//=====================


//=========================================================================
// this function assigns the menu items
//=========================================================================
function setmenu() {
    main_window.onContextMenu = function() {
        var items = [], sItem, mItem;

        mItem = new MenuItem();
        mItem.title = "Donate a Coffee with Ko-Fi";
        mItem.onSelect = function () {
            donate();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function () {
            nullfunction();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Select Gauge Type";
        items.push(mItem);

        preferences.gaugePref.option.forEach(function (ele, idx) {
            if (ele !== "-") {
                sItem = new MenuItem();
                sItem.title = ele.split(" ", 2).join(" ");
                sItem.onSelect = function () {
                    selectGaugeType(idx);
                };
                mItem.appendChild(sItem);
            }
        });

        mItem = new MenuItem();
        mItem.title = "Steampunk Grid Gauge Help";
        mItem.onSelect = function () {
            helpShow();
        };
         items.push(mItem);  
         
        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function () {
            nullfunction();
        };
         items.push(mItem);           

        mItem = new MenuItem();
        mItem.title = "Online Help";
        mItem.onSelect = function () {
            widgethelp();
        };
          
        items.push(mItem);
        
        mItem = new MenuItem();
        mItem.title = "See More Steampunk Widgets";
        mItem.onSelect = function () {
            otherwidgets();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Download Latest Version";
        mItem.onSelect = function () {
            update();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Display Licence Agreement...";
        mItem.onSelect = function () {
            displayLicence();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Contact Support";
        mItem.onSelect = function () {
            contact();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Reveal Widget in Windows Explorer";
        mItem.onSelect = function() {
            findWidget();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
        items.push(mItem);

        mItem = new MenuItem();
        mItem.title = "Reload Widget (F5)";
        mItem.onSelect = function () {
            reloadWidget();
        };
        items.push(mItem);

        if (preferences.imageEditPref.value != "" && debugFlg === "1") {
            mItem = new MenuItem();
            mItem.title = "Edit Widget using " + preferences.imageEditPref.value ;
            mItem.onSelect = function () {
                editWidget();
            };
            items.push(mItem);
        }

        main_window.contextMenuItems = items;

    };
}
//=====================
//End function
//=====================




//=========================================================================
// this function sets the current gauge type according to the user choice 
//=========================================================================
function selectGaugeType(index) {
    preferences.gaugePref.value = preferences.gaugePref.optionValue[index];
    thePreferencesChanged();
};
//=====================
//End function
//=====================



//===============================================================
// this function defines the keyboard events captured
//===============================================================
main_window.onKeyDown = function(event) {
    if (system.event.keyCode==116) {
        print("pressing "+system.event.keyCode);
        reloadWidget();
    }
};
//=====================
//End function
//=====================



//===========================================
// this function opens the online help file
//===========================================
function menuitem1OnClick() {
    var answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("https://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the URL for paypal
//===========================================
function donate() {
    var answer = alert("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Kofi donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
    }
}
//=====================
//End function
//=====================



//===========================================
// this function opens other widgets URL
//===========================================
function menuitem5OnClick() {
    var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981269/yahoo-widgets");
    }
}
//=====================
//End function
//=====================
//===========================================
// this function opens the download URL
//===========================================
function update() {
    var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("https://www.deviantart.com/yereverluvinuncleber/art/Steampunk-Coal-Power-Gauge-shows-real-consumption-609211016");
    }
}
//=====================
//End function
//=====================
//===========================================
// this function opens the browser at the contact URL
//===========================================
function contact() {
    var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser at the contact URL
//===========================================
function facebookChat() {
    var answer = alert("Visiting the Facebook chat page - this button opens a browser window and connects to our Facebook chat page.). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================






//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
        //uses the contents of imageEditPref to initiate your default editor
        performCommand("menu");
    //}

}
//=====================
//End function
//=====================


//=====================
// function to carry out a command
//=====================
function performCommand(method) {
    var answer;

    if (method === "menu") {
        runCommandInBg(preferences.imageEditPref.value, "runningTask");
    } else {
        print("method "+method);
        if (system.event.altKey) { // filesystem.open() call
            if (preferences.openFilePref.value === "") {
                answer = alert("This widget has not been assigned an alt+double-click function. You need to open the preferences and select a file to be opened. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
            filesystem.open(preferences.openFilePref.value);
        } else {
            if (preferences.imageCmdPref.value === "") {
                answer = alert("This widget has not been assigned a double-click function. You need to open the preferences and enter a run command for this widget. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
                runCommandInBg(preferences.imageCmdPref.value, "runningTask");
        }
    }
}
//=====================
//End function
//=====================




//=====================
// function to show the help window form
//=====================
function helpShow() {
    helpWindow.visible = true;
    print (preferences.soundPref.value);
    if (preferences.soundPref.value !== "disabled") {
        play(till, false);
    }
}
//=====================
//End function
//=====================


//=====================
// function to hide the help form
//=====================
gaugeHelp.onMouseDown = function () {
    helpWindow.visible = false;
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
};