function bootstrap_1() {  // FIRE UP THE ENGINES!
	
	//this object holds all the general variables and information
	myBrowser = new BrowserInstance();
	
	// the console is for administration and testing purposes. might make sense to deactivate it later on
	myConsole = new consoleObject();
	
	// we need this fellow for enabling the browsers' autocomplete thing and potentially for more workarounds later on...
	HiddenIframe__create();
	
	// CREATE the login-Panel
	loadHTML(myBrowser.URL_html+"login_dialog.html",function(html_ID) {
			var myhtml = localize(myBrowser.loadedhtml[html_ID].data);
			var myDialogID = Dialog_build(localized_text[myBrowser.language]["LOGINDIALOG__HeaderText"],myhtml);
			$("#"+myDialogID).dialog({autoOpen:false, width:"auto", resizable: false, modal: true});
			myBrowser.LoginPanel = $("#"+myDialogID);
		},false);
	
	
	// ################################################################################
	// ################################################################################
	// ###############		the SURVEILLANCE STARTS HERE								############################
	// ################################################################################
	// ################################################################################

	// this is a newly introduced object that will do constant checks and thereby work as  a global, subscibable timer...
	mySurveillance = new aSurveillance();
	mySurveillance.interval = 100;
	setTimeout("mySurveillance.runChecks();",mySurveillance.interval);

	
	
	
	// CREATE the side-docked menu
	myBrowser.menu = SideDock_menu();
	myBrowser.menu.updateButtonVisibility();
	
	// Run initialisation of Plugins that registered with the system
	myPlugins.initPlugins();
	
	// init new menu type
	myTopSlide = new FrameSlide("TopSlide");
	$(myTopSlide.label).html("<img src='"+myBrowser.URL_images+"menu_top.png'>");
	var FilterHTML = "<div>define your FILTER:<br><textarea id='FilterText' rows=4 cols=40'></textarea></div>"
	var SortHTML = "<div>define your SORTER:<br><textarea id='SortText' rows=2 cols=40'></textarea></div>"
	
	myTopSlide.content(FilterHTML+SortHTML);
	// init new navi slide
	myNaviSlide = new GrowSlide("NaviSlide");
	//$(myNaviSlide.label).html("<img src='"+myBrowser.URL_images+"menu_top.png'>");
	
	
	// start talking to the server, say hello, ask for a still-open session and so on...
	AJAX__SessionCheck();
	
	return true;
}


function HiddenIframe__create() {
	var IFcontainer = document.createElement("div");
	$(IFcontainer).addClass("css__HiddenContainer");
	$(IFcontainer).attr("id","HiddenIFrameContainer");
	$("body").append(IFcontainer);
	var IFrame = document.createElement("iframe");
	$(IFrame).attr("id","HiddenIFrame_01");
	$(IFrame).attr("src","");
	$(IFrame).attr("name","HiddenIFrame_01");
	$(IFrame).css("visibility","hidden");
	$(IFcontainer).append(IFrame);
	return true;
}
