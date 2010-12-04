localized_text = {
	en: {
		yes: "yes",
		no: "no",
		session: "session",
		
		BUTTON_TEXT__Login:"login",
		BUTTON_TEXT__Logout:"logout",
		BUTTON_TEXT__Console:"console",
		BUTTON_TEXT__Log:"log",
		
		
		LOGINDIALOG__HeaderText: "please log in...",
		LOGINDIALOG__PreText_Username: "username",
		LOGINDIALOG__PreText_Password: "password",
		LOGINDIALOG__ButtonText_Login: "login",
		LOGINDIALOG__SUCCESS_HeaderText: "logged in...",
		LOGINDIALOG__FAILED_HeaderText: "NOT! logged in...",
		LOGINDIALOG__SUCCESS_Text: "welcome, <b>@@username</b>!<br>we hope you will enjoy your visit!",
		LOGINDIALOG__FAILED_ErrorText: "there was a problem with your login.<br>please try again.",

		CONSOLEDIALOG__HeaderText: "Console...",
		CONSOLEDIALOG__PreText_CommandArea:"What's your command, master?",
		CONSOLEDIALOG__ButtonText_Send:"Send Command",
		LOGOUTDIALOG__SUCCESS_HeaderText: "logged out...",
		LOGOUTDIALOG__FAILED_HeaderText: "NOT! logged out...",
		LOGOUTDIALOG__SUCCESS_Text: "your session was terminated.<br>We hope you will come back! ;)",
		LOGOUTDIALOG__FAILED_ErrorText: "your session could not be terminated.<br>If this error persists, please contact us about the bug!",
		LOGOUTDIALOG__FAILED_NoSessionText: "you were not logged in at all - no sense logging out, eh!",
		
	}
};

function localize(html) {
	var pattern = /@#\w*#@/;
	var matches = html.match(pattern);
	var replaced = html;
	while (matches != null && matches.length>0) {
		var len = matches[0].length;
		var textid = matches[0].substring(2,len-2);
		replaced = replaced.replace(matches[0],localized_text[myBrowser.language][textid]);
		matches = replaced.match(pattern);
	}
	return replaced;
}
