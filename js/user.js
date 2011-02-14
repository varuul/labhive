
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- integrating into the current project -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
	myUser = new UserObject(myBrowser);
	myPlugins.add(myUser);
});




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- pure Object -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

UserObject = function(myDad) {
	if (isEmpty(myDad) || isEmpty(myDad.URL_html)) return false;
	this.myParent = myDad;
	this.initialized = false;
	this.uid = 0;
	this.name = "Anonymous";
	this.email = "test@example.com";
	this.AccessLevel = 0; // 0 = "anonymous", 1 = "normal logged in user", 2 = "admin"
	this.FileName_login = "user.php";
	// we need this fellow for enabling the browsers' autocomplete thing and potentially for more workarounds later on...
	this.fakeFormActionTargetId = HiddenIframe__create();
	$("#LOGINDIALOG__form").attr("target", this.fakeFormActionTargetId);
}

UserObject.prototype.init = function() {
	var thisUser = this;

	$(document).bind("AjaxResponse", function(event) {
		thisUser.ajax_responseHandler(event);
	});
	$(document).bind("Authentification", function(event) {
		thisUser.authentification_responseHandler(event);
	});
	$(document).bind("LogOut", function(event) {
		thisUser.logout_responseHandler(event);
	});

	loadHTML(thisUser.myParent.URL_html+"login_dialog.html",function(html_ID) {
		var myhtml = (HTMLcontainer[html_ID].data);
		var myDialogID = Dialog_build(localized_text[thisUser.myParent.language]["LOGINDIALOG__HeaderText"],myhtml);
		$("#"+myDialogID).dialog({autoOpen:false, width:"auto", resizable: false, modal: true});
		$("#LOGINDIALOG__form").appendTo($("#login_dialog_container")[0]);
		thisUser.LoginPanel = $("#"+myDialogID);
		$(".need_localization").each(function(key,obj) {
			$(this).html(localize($(this).html()));
		});
		$("#LOGINDIALOG__button_login").button();
		thisUser.initialized = true;
		thisUser.SessionCheck();
	},false);
	
	var LoginButton = {
		id:"Button__Login",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Login']+"</div>",
		show_condition: function() {
			if (thisUser.UserStatus == 0) return "block";
			else return "none";
		},
		click: function(e) { thisUser.LoginPanel.dialog("open"); },
		MenuLevel: 0
	}
	myMenu.add(LoginButton);	
	
	var LogoutButton = {
		id:"Button__Logout",
		click: function(e) { thisUser.logout(); },
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Logout']+"</div>",
		show_condition: function() {
			if (thisUser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	myMenu.add(LogoutButton);
	
}

UserObject.prototype.login = function() {
	var thisUser = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "login";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = this.myParent.id;  // with this we ID our script instance for the server...
	enteredUserName = $("#LOGINDIALOG__input_username").val();
	var un = $.md5(enteredUserName);
	var pw = $.md5($("#LOGINDIALOG__input_password").val());
	postinfo.username = un;
	postinfo.password = pw;
	$.post(this.myParent.URL_backend+this.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = thisUser.myParent.AJAX__ProcessAnswer(doc);
		}
	);
	return true;
}

UserObject.prototype.logout = function() {
	var thisUser = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "logout";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = this.myParent.id;  // with this we ID our script instance for the server...
	$.post(this.myParent.URL_backend+this.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = thisUser.myParent.AJAX__ProcessAnswer(doc);
		}
	);
	return true;
}

UserObject.prototype.SessionCheck = function () {
	var thisUser = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "hello";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	$.post(this.myParent.URL_backend+this.FileName_login, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = thisUser.myParent.AJAX__ProcessAnswer(doc);
		}
	);
}



UserObject.prototype.ajax_responseHandler = function(event) {
	if (event.json.job == "login" || event.json.job == "hello") {
		$(document).trigger({ type:"Authentification", json: event.json });
	} else if (event.json.job == "logout") {
		$(document).trigger({ type:"LogOut", json: event.json });
	}
}


UserObject.prototype.authentification_responseHandler = function(event) {
	var thisUser = this;
	var Title = localized_text[this.myParent.language]["INFO__ANONYMOUS_WELCOME_TITLE"];
	var Content = localized_text[this.myParent.language]["INFO__ANONYMOUS_WELCOME_TEXT"];
	var Img = this.myParent.myTemplate.Images.Alert;
	if (event.json.jobresult == "true") {
		thisUser.UserStatus = (event.json.DB_Session=="true") ? 1 : 0;
		if (isEmpty(event.json.userinfo)==false) {
			thisUser.email = (isEmpty(event.json.userinfo.user_email)) ? "test@example.com" : event.json.userinfo.user_email;
			thisUser.AccessLevel = (isEmpty(event.json.userinfo.user_xslevel)) ? 0 : event.json.userinfo.user_xslevel;
			thisUser.name = (isEmpty(event.json.userinfo.username)) ? 0 : event.json.userinfo.username;
			thisUser.uid = (isEmpty(event.json.userinfo.user_id)) ? 0 : event.json.userinfo.user_id;
			var Title = localized_text[this.myParent.language]["LOGINDIALOG__SUCCESS_HeaderText"];
			var Content = localized_text[this.myParent.language]["LOGINDIALOG__SUCCESS_Text"].replace(/@@username/g, event.json.userinfo.username);
			var Img = this.myParent.myTemplate.Images.Success;
		}
		thisUser.LoginPanel.dialog("close");
	}
	$.gritter.add({
		title: Title,
		text: Content,
		image: Img,
		sticky: false, 
		time: 4000
	});
	$(document).trigger("UserChange", event);
}


UserObject.prototype.logout_responseHandler = function(event) {
	var thisUser = this;
	if (event.json.jobresult == "true") {
		var Title = localized_text[this.myParent.language]["LOGOUTDIALOG__SUCCESS_HeaderText"];
		var Content = localized_text[this.myParent.language]["LOGOUTDIALOG__SUCCESS_Text"];
		var Img = this.myParent.myTemplate.Images.Success;
	} else {
		var Title = localized_text[this.myParent.language]["LOGOUTDIALOG__FAILED_HeaderText"];
		var Content = localized_text[this.myParent.language]["LOGOUTDIALOG__FAILED_ErrorText"];
		var Img = this.myParent.myTemplate.Images.Fail
	}
	$.gritter.add({
		title: Title,
		text: Content,
		image: Img,
		sticky: false, 
		time: 4000
	});
	thisUser.UserStatus = (event.json.DB_Session=="true") ? 1 : 0;
	if (isEmpty(event.json.userinfo)==false) {
		thisUser.email = (isEmpty(event.json.userinfo.user_email)) ? "test@example.com" : event.json.userinfo.user_email;
		thisUser.AccessLevel = (isEmpty(event.json.userinfo.user_xslevel)) ? 0 : event.json.userinfo.user_xslevel;
		thisUser.name = (isEmpty(event.json.userinfo.username)) ? 0 : event.json.userinfo.username;
		thisUser.uid = (isEmpty(event.json.userinfo.user_id)) ? 0 : event.json.userinfo.user_id;
	}
	$(document).trigger("UserChange", event);
}



