function AJAX__ProcessAnswer(doc) {
	var JSONdoc = {};
	try {
		JSONdoc = tools_JSONparser(doc);
	} catch(err) {
		log("error Parsing JSON");
		log("got this:"+doc);
		return false;
	}
	myBrowser.CheckAjaxUpdates(JSONdoc);
	return JSONdoc;
}

function AJAX__SessionCheck() {
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "hello";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	$.post(myBrowser.URL_backend+myBrowser.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = AJAX__ProcessAnswer(doc);
			if (JSONdoc != false) {
				if (JSONdoc.job == "hello") {
					var now = DateTime_Now();
					//var myDialogID = Dialog_build(now+">> session check","calls="+JSONdoc.SessionCalls+"<br>init="+JSONdoc.SessionMode);
					//$("#"+myDialogID).dialog();
					
				}
			}
		}
	);
}