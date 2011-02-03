
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- integrating into the current project -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
	// the console is for administration and testing purposes. might make sense to deactivate it later on
	myConsole = new consoleObject(myBrowser);
	myPlugins.add(myConsole);
});

$(document).bind("InitStage1complete", function(event) {
	var ConsoleButton = {
		id:"Button__Console",
		click: function(e) { myConsole.show(); },
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Console']+"</div>",
		show_condition: function() {
			if (myUser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	myMenu.add(ConsoleButton);
});







// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- pure Object -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

consoleObject = function (myDad) {
	this.initialized = false;
	if (isEmpty(myDad) || isEmpty(myDad.URL_html)) return false;
	this.myParent = myDad;
	var thisConsole = this;
	this.FileName_console = "console.php";
	this.myCommandAreaID = "CONSOLE_CommandArea_"+tools_randomid(8);
}

consoleObject.prototype.init = function() {
	var thisConsole = this;
	loadHTML(thisConsole.myParent.URL_html+"console_dialog.html",function(html_ID) {
		var myhtml = localize(HTMLcontainer[html_ID].data);
		var pattern = new RegExp("@@CONSOLEDIALOG__CommandArea","");
		myhtml = myhtml.replace(pattern,thisConsole.myCommandAreaID);
		thisConsole.myDialogID = Dialog_build(localized_text[thisConsole.myParent.language]["CONSOLEDIALOG__HeaderText"],myhtml);
		$("#"+thisConsole.myDialogID).dialog({autoOpen:false, width:"auto", resizable: false,  modal: true});
		thisConsole.myParent.ConsolePanel = $("#"+thisConsole.myDialogID);
		this.initialized = true;
	},false);
	
}

consoleObject.prototype.show = function() {
	$("#"+this.myDialogID).dialog("open");
}

consoleObject.prototype.close = function() {
	$("#"+this.myDialogID).dialog("close");
}

consoleObject.prototype.sendCommand = function() {
	var myCommand = $("#"+this.myCommandAreaID);
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "console";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = thisConsole.myParent.id;  // with this we ID our script instance for the server...
	postinfo.command = myCommand.val();
	$.post(thisConsole.myParent.URL_backend+thisConsole.FileName_console, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			AJAX__ProcessAnswer(doc);
		}
	);
	return true;
}
