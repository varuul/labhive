 function USER__login() {
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "login";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	enteredUserName = $("#LOGINDIALOG__input_username").val();
	var un = $.md5(enteredUserName);
	var pw = $.md5($("#LOGINDIALOG__input_password").val());
	postinfo.username = un;
	postinfo.password = pw;
	$.post(myBrowser.URL_backend+myBrowser.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = AJAX__ProcessAnswer(doc);
			if (JSONdoc != false) {
				if (JSONdoc.job == "login") {
					if (JSONdoc.jobresult == "true") {
						var content = localized_text[myBrowser.language]["LOGINDIALOG__SUCCESS_Text"].replace(/@@username/g, enteredUserName);
						var Info = Dialog_build(localized_text[myBrowser.language]["LOGINDIALOG__SUCCESS_HeaderText"],content);
						$("#"+Info).dialog({width:"auto", resizable: false,  modal: true});
						myBrowser.User = {
							uid: JSONdoc.uid,
							name: enteredUserName,
							email: "test@example.com",
							AccessLevel: 0,// 0 = "anonymous", 1 = "normal logged in user", 2 = "admin"
						}
						myBrowser.menu.updateButtonVisibility();
					} else {
						var Info = Dialog_build(localized_text[myBrowser.language]["LOGINDIALOG__FAILED_HeaderText"],localized_text[myBrowser.language]["LOGINDIALOG__FAILED_ErrorText"]);
						$("#"+Info).dialog({width:"auto", resizable: false,  modal: true});
					}
				}
			}
		}
	);
	myBrowser.LoginPanel.dialog("close");
	return true;
}

function USER__logout() {
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "logout";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	$.post(myBrowser.URL_backend+myBrowser.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = AJAX__ProcessAnswer(doc);
			if (JSONdoc != false) {
				if (JSONdoc.job == "logout") {
					if (JSONdoc.jobresult == "true") {
						var Info = Dialog_build(localized_text[myBrowser.language]["LOGOUTDIALOG__SUCCESS_HeaderText"],localized_text[myBrowser.language]["LOGOUTDIALOG__SUCCESS_Text"]);
						$("#"+Info).dialog({width:"auto", resizable: false,  modal: true});
					} else {
						var Info = Dialog_build(localized_text[myBrowser.language]["LOGOUTDIALOG__FAILED_HeaderText"],localized_text[myBrowser.language]["LOGOUTDIALOG__FAILED_ErrorText"]);
						$("#"+Info).dialog({width:"auto", resizable: false,  modal: true});
					}
				}
			}
		}
	);
	return true;
}