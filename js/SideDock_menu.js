function SideDock_menu() {
	if ($("#SideDock_menu").length != 0) {
		$("#SideDock_menu").empty();
		$("#SideDock_menu").remove();		
	}
	var thismenu = new ButtonSlide();
	thismenu.id = "SideDock_menu";
	thismenu.SliderType = "left";
	thismenu.LabelImage = myBrowser.URL_images+"menu.png";
	thismenu.myButtonTR_class = "css__ButtonSlide_ButtonTR_left";
	thismenu.LabelBackgroundColor = "#cc0000 ";
	thismenu.updatePosition = function() {
		$(this).css("top",30);
		return true;
	}
	
	var LoginButton = {
		id:"Button__Login",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Login']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 0) return "block";
			else return "none";
		},
		click: function(e) { myBrowser.LoginPanel.dialog("open"); },
		MenuLevel: 0
	}
	thismenu.buttons_add(LoginButton);	
	
	var LogoutButton = {
		id:"Button__Logout",
		click: function(e) { USER__logout(); },
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Logout']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	thismenu.buttons_add(LogoutButton);
	
	var ConsoleButton = {
		id:"Button__Console",
		click: function(e) { myConsole.show(); },
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Console']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	thismenu.buttons_add(ConsoleButton);
	var LogButton = {
		id:"Button__Log",
		click: function(e) { 
			var content = myBrowser.log.content();
			var myDialogID = Dialog_build(">> ActionLog",content);
			$("#"+myDialogID).dialog(); 
		},
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Log']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	thismenu.buttons_add(LogButton);
	return thismenu;	
}