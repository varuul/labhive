// Registration Plugin for LabHive depends on 
// USER and 
// BROWSER plugins ,
//  the general LabHive FrameWork as well as
// jQuery and its plugins jGritter, jMD5


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- integrating into the current project -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
	myRegistration = new RegistrationObject(myBrowser);
	myPlugins.add(myRegistration);
});




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- pure Object -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

RegistrationObject = function(myDad) {
	if (isEmpty(myDad) || isEmpty(myDad.URL_html)) return false;
	this.myParent = myDad;
	this.initialized = false;
	this.name = "Anonymous";
	this.email = "test@example.com";
	this.password = "";
	this.FileName_registration = "user.php";
	this.Images = {};
	this.Images.verifyFail = this.myParent.URL_images + "registration/failed.png";
	this.Images.verifySuccess = this.myParent.URL_images + "registration/verified.png";
	this.UserInputStatus = 0;
	this.PasswordInputStatus = 0;
	this.EmailInputStatus = 0;
	this.UserNameTests = new Array();
	
}

RegistrationObject.prototype.init = function() {
	var thisRO = this;
	this.addLocalizedTexts();
	$(document).bind("AjaxResponse", function(event) {
		thisRO.ajax_responseHandler(event);
	});
	$(document).bind("RegistrationAnswer", function(event) {
		thisRO.registration_responseHandler(event);
	});
	$(document).bind("RegistrationVerifyChange", function(event) {
		thisRO.RegistrationVerifyChange_handler(event);
	});
	loadHTML(thisRO.myParent.URL_html+"registration_dialog.html",function(html_ID) {
		var myhtml = (HTMLcontainer[html_ID].data);
		var myDialogID = Dialog_build(localized_text[thisRO.myParent.language]["REGISTERDIALOG__HeaderText"],myhtml);
		thisRO.RegisterPanel = $("#"+myDialogID);
		$(thisRO.RegisterPanel).dialog({autoOpen:false, width:"auto", resizable: false, modal: true});
		thisRO.initialized = true;
		$("#Registration_username_verified").attr("src",thisRO.Images.verifyFail);
		$("#Registration_password_verified").attr("src",thisRO.Images.verifyFail);
		$("#Registration_email_verified").attr("src",thisRO.Images.verifyFail);
	},false);
	
	var RegisterButton = {
		id:"Button__Register",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Register']+"</div>",
		show_condition: function() {
			if (myUser.UserStatus == 0) return "block";
			else return "none";
		},
		click: function(e) { 
			thisRO.RegisterPanel.dialog("open"); 
		},
		MenuLevel: 0
	}
	myMenu.add(RegisterButton);	
	
}


RegistrationObject.prototype.ajax_responseHandler = function(event) {
	if (event.json.job == "register") {
		$(document).trigger({ type:"RegistrationAnswer", json: event.json });
	}
}
RegistrationObject.prototype.registration_responseHandler = function(event) {
	var thisReg = this;
	
	if (event.json.jobresult == "true") {
		var Title = localized_text[this.myParent.language]["INFO__REGISTRATION_SUCCESSFUL_TITLE"];
		var Content = localized_text[this.myParent.language]["INFO__REGISTRATION_SUCCESSFUL_TEXT"];
		var Img = this.myParent.myTemplate.Images.Success;
		$(thisReg.RegisterPanel).dialog("close");
		$(myUser.LoginPanel).dialog("open");
		
	} else {
		var Title = localized_text[this.myParent.language]["INFO__REGISTRATION_FAIL_TITLE"];
		var Content = localized_text[this.myParent.language]["INFO__REGISTRATION_FAIL_TEXT"];
		var Img = this.myParent.myTemplate.Images.Fail;
	}
	$.gritter.add({
		title: Title,
		text: Content,
		image: Img,
		sticky: false, 
		time: 4000
	});
	
}


RegistrationObject.prototype.addLocalizedTexts = function() {
	localized_text["en"]["REGISTERDIALOG__HeaderText"] = "Registration";
	localized_text["en"]['BUTTON_TEXT__Register'] = "register";
	localized_text["en"]['INFO__REGISTRATION_SUCCESSFUL_TITLE'] = "Registration was successful";
	localized_text["en"]['INFO__REGISTRATION_SUCCESSFUL_TEXT'] = "You successfully registered. Please Log In Now.";
	localized_text["en"]['INFO__REGISTRATION_FAIL_TITLE'] = "Registration has failed";
	localized_text["en"]['INFO__REGISTRATION_FAIL_TEXT'] = "Sorry, but something went wrong during registration.<br> This is the server's response:<br><div id='RegistrationInfo_ErrorDescription'></div>";
	localized_text["en"]['INFO__REGISTRATION_USERNAME_TAKEN_TITLE'] = "UserName Taken";
	localized_text["en"]['INFO__REGISTRATION_USERNAME_TAKEN_TEXT'] = "Sorry, but this (@@_username) username has already been taken!";
	localized_text["en"]['INFO__REGISTRATION_USERNAME_INPUTFAIL_TITLE'] = "UserName Problem";
	localized_text["en"]['INFO__REGISTRATION_USERNAME_INPUTFAIL_TEXT'] = "Sorry, but this the username can not have spaces and it must be between 4 and 15 chars long.";
	
}


RegistrationObject.prototype.RegistrationPanelSubmit = function() {
	var thisReg = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "registration";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.username = $("#Registration_username_Input").val();
	postinfo.unmd5 = $.md5($("#Registration_username_Input").val());	
	postinfo.password = $.md5($("#Registration_password_Input").val());
	postinfo.email = $("#Registration_email_Input").val();
	$.post(this.myParent.URL_backend+this.FileName_registration, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = thisReg.myParent.AJAX__ProcessAnswer(doc);
			$(document).trigger({type:"RegistrationAnswer", json:JSONdoc});
			
		}
	);
}

RegistrationObject.prototype.InputKeyUp = function(event) {
	if (event.target.id == "Registration_username_Input") this.verify_username();
	if (event.target.id == "Registration_password_Input") this.verify_password();
	if (event.target.id == "Registration_email_Input") this.verify_email();
}


RegistrationObject.prototype.RegistrationVerifyChange_handler = function(event) {
	if (this.UserInputStatus == 1 && this.PasswordInputStatus == 1 && this.EmailInputStatus == 1) {
		$("#Registration_Button_Submit").button("enable");
	} else {
		$("#Registration_Button_Submit").button("disable");
	}
}


RegistrationObject.prototype.verify_username = function(event) {
	var thisReg = this;
	this.UserInputStatus = 0;
	var username = $("#Registration_username_Input").val();
	var myUNmd5 = $.md5(username);
	if (username.length < 4 || username.length > 15) {
		this.UserInputStatus = -1;
	}
	if (username.indexOf(" ") > -1) {
		this.UserInputStatus = -1;
	}
	if (this.UserInputStatus == -1) {
		var Title = localized_text[thisReg.myParent.language]["INFO__REGISTRATION_USERNAME_INPUTFAIL_TITLE"];
		var Content = localized_text[thisReg.myParent.language]["INFO__REGISTRATION_USERNAME_INPUTFAIL_TEXT"];
		var Img = thisReg.myParent.myTemplate.Images.Fail;
		if (typeof thisReg.UserNameRegulationInfo == "undefined") {
		
			thisReg.UserNameRegulationInfo = $.gritter.add({
				title: Title,
				text: Content,
				image: Img,
				sticky: false, 
				time: 4000
			});
		} else {
			var me = thisReg.UserNameRegulationInfo;
		}
		$(document).trigger({ type: "RegistrationVerifyChange" });
		return -1;
	}
	var matchingQueries = jQuery.grep(this.UserNameTests, function(UserNameTest) {
		return UserNameTest.username == username;
	});
	if (matchingQueries.length > 0) {
		if (matchingQueries[0].available == true) {
			this.UserInputStatus = 1;
			$("#Registration_username_verified").attr("src",thisReg.Images.verifySuccess);
		} else {
			this.UserInputStatus = -1;
			$("#Registration_username_verified").attr("src",thisReg.Images.verifyFail);
		}
		$(document).trigger({ type: "RegistrationVerifyChange" });
		return this.UserInputStatus;
	}
	
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "username_availability";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.untest = myUNmd5;
	$.post(this.myParent.URL_backend+this.FileName_registration, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var username = $("#Registration_username_Input").val();
			var myUNmd5 = $.md5(username);
			var JSONdoc = thisReg.myParent.AJAX__ProcessAnswer(doc);
			thisReg.UserNameTests.push({ "username": username, available: JSONdoc.jobresult});
			if (JSONdoc.jobresult == true && JSONdoc.queriedUserName == myUNmd5) {
				$("#Registration_username_verified").attr("src",thisReg.Images.verifySuccess);
				thisReg.UserInputStatus = 1;
			} else {
				$("#Registration_username_verified").attr("src",thisReg.Images.verifyFail);
				thisReg.UserInputStatus = -1;
				var Title = localized_text[thisReg.myParent.language]["INFO__REGISTRATION_USERNAME_TAKEN_TITLE"];
				var Content = localized_text[thisReg.myParent.language]["INFO__REGISTRATION_USERNAME_TAKEN_TEXT"];
				Content = Content.replace("@@_username", username);
				var Img = thisReg.myParent.myTemplate.Images.Fail;
				$.gritter.add({
					title: Title,
					text: Content,
					image: Img,
					sticky: false, 
					time: 4000
				});
			}
			$(document).trigger({ type: "RegistrationVerifyChange" });
		}
	);
}




RegistrationObject.prototype.verify_password = function(event) {
	this.PasswordInputStatus = 0;
	var password = $("#Registration_password_Input").val();
	if (password.length < 4 || password.length > 15) {
		this.PasswordInputStatus = -1;
		$("#Registration_password_verified").attr("src",this.Images.verifyFail);
	} else {
		this.PasswordInputStatus = 1;
		$("#Registration_password_verified").attr("src",this.Images.verifySuccess);
	}
	$(document).trigger({ type: "RegistrationVerifyChange" });
}


RegistrationObject.prototype.verify_email = function(event) {
	var email = $("#Registration_email_Input").val();
	this.EmailInputStatus = 0;
	var pattern = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
	var emailpattern=new RegExp(pattern);
	var result = emailpattern.test(email);
	if (result) {
		this.EmailInputStatus = 1;
		$("#Registration_email_verified").attr("src",this.Images.verifySuccess);
	} else {
		this.EmailInputStatus = -1;
		$("#Registration_email_verified").attr("src",this.Images.verifyFail);
	}
	$(document).trigger({ type: "RegistrationVerifyChange" });
}

