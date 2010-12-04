function consoleObject() {
	myBrowser.FileName_console = "console.php";
	this.myCommandAreaID = "CONSOLE_CommandArea_"+tools_randomid(8);
	var me = this;
	loadHTML(myBrowser.URL_html+"console_dialog.html",function(html_ID) {
			var myhtml = localize(myBrowser.loadedhtml[html_ID].data);
			var pattern = new RegExp("@@CONSOLEDIALOG__CommandArea","");
			myhtml = myhtml.replace(pattern,myConsole.myCommandAreaID);
			myConsole.myDialogID = Dialog_build(localized_text[myBrowser.language]["CONSOLEDIALOG__HeaderText"],myhtml);
			$("#"+myConsole.myDialogID).dialog({autoOpen:false, width:"auto", resizable: false,  modal: true});
			myBrowser.ConsolePanel = $("#"+myConsole.myDialogID);
		},false);
	this.show = function() {
		$("#"+this.myDialogID).dialog("open");
	}
	this.close = function() {
		$("#"+this.myDialogID).dialog("close");
	}
	this.sendCommand = function() {
		var myCommand = $("#"+this.myCommandAreaID);
		var postinfo = {};	// generate an object to pass via POST
		postinfo.job = "console";		// this is passed to tell the serverside php what we want to do
		postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
		postinfo.command = myCommand.val();
		$.post(myBrowser.URL_backend+myBrowser.FileName_console, postinfo,	// POST VIA AJAX!
			function(doc){	// IF ajax call is returned do this...
				AJAX__ProcessAnswer(doc);
			}
		);
		return true;
	}
}
