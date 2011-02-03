SideDock_menu = function(myId) {
	this.initialized = false;
	this.myButtons = new Array();
	if (isEmpty(myId)) return false;
	if ($("#"+myId).length > 0) return false;
	this.id=myId;
	return this;	
}

SideDock_menu.prototype.init = function() {
	var me = this;
	this.DOMelement = document.createElement("div");
	$(this.DOMelement).addClass("css__ButtonSlideDiv");
	this.DOMelement.id = this.id;
	this.SliderType = "left";
	this.LabelImage = myBrowser.URL_images+"menu.png";
	this.myButtonTR_class = "css__ButtonSlide_ButtonTR_left";
	this.LabelBackgroundColor = "#cc0000 ";
	this.hide_delay = 800;
	this.VisiblePixelsWhenHidden = 22;
	this.HiddenPixelsWhenShown = 6;
	this.myWidth = 170;
	this.status = "hidden";
	this.MenuLevel = 0;
	$(this.DOMelement).click(function(e) {
		me.show();
	});
	$(this.DOMelement).hover(
		function(e) {
			me.show();
		},
		function(e) {
			me.hide();
		}
	);
	
	$("body").append(this.DOMelement);
	this.initialized = true;
}

SideDock_menu.prototype.updatePosition = function() {
	$(this.DOMelement).css("top",30);
	return true;
}

SideDock_menu.prototype.hide = function() {
	if (this.SliderType == "top") {
		var newT = - parseInt($(this).height()) + this.VisiblePixelsWhenHidden;
		$(this.DOMelement).css("top",newT);
	} else if (this.SliderType == "left") {
		var newL = - parseInt($(this.DOMelement).width()) + this.VisiblePixelsWhenHidden;
		$(this.DOMelement).css("left",newL);
	}
	this.status = "hidden";
}

SideDock_menu.prototype.show = function() {
	if (this.SliderType == "top") {
		$(this.DOMelement).css("top",-this.HiddenPixelsWhenShown);
	} else if (this.SliderType == "left") {
		$(this.DOMelement).css("left",-this.HiddenPixelsWhenShown);
	}
	this.status = "shown";
}


SideDock_menu.prototype.updatePosition = function() {
};

SideDock_menu.prototype.drawButtons = function() {
	var BSTable = document.createElement("table");
	$(BSTable).attr("id",this.id+"_BSTable");
	$(BSTable).addClass("css__ButtonSlide_Table");

	if (this.SliderType == "top") {
		$(BSTable).append("<tr><td class='css__ButtonSlide_TD00' id='"+this.id+"_BSTableTD_00'></td></tr>");
	} else if (this.SliderType == "left") {
		$(BSTable).append("<tr><td class='css__ButtonSlide_TD00' id='"+this.id+"_BSTableTD_00'></td><td  rowspan='100' id='"+this.id+"_BSTableLabelTD' class='css__ButtonSlide_LabelTD_left'><img src='"+this.LabelImage+"'></td></tr>");
	}
	
	for (var i=0;i<this.myButtons.length;i++) {
		var nextButton = document.createElement("button");
		$(nextButton).html(this.myButtons[i].html);
		$(nextButton).attr("id",this.myButtons[i].id);
		$(nextButton).bind("click", this.myButtons[i].click  );
		$(nextButton).addClass("css__ButtonSlide_button");
		var nextTR = document.createElement("tr");
		nextTR.id = this.id+"_TR_"+i;
		this.myButtons[i].myTR = nextTR.id;
		$(nextTR).addClass(this.myButtonTR_class);
		var nextTD = document.createElement("td");
		$(BSTable).append(nextTR);
		$(nextTR).append(nextTD);
		$(nextTD).append(nextButton);
	}
	
	if (this.SliderType == "top") {
		$(BSTable).append("<tr><td class='css__ButtonSlide_LabelTD_top' id='"+this.id+"_BSTableLabelTD'><img src='"+this.LabelImage+"'></td></tr>");
	} 
	
	$(this.DOMelement).empty();
	$(this.DOMelement).append(BSTable);
	$(this.DOMelement).width(this.myWidth);
	$(".css__ButtonSlide_button").button();
	this.updateButtonVisibility();
	this.updatePosition();
};


SideDock_menu.prototype.updateButtonVisibility = function() {
	for (var i=0; i<this.myButtons.length;i++) {
		var display = "block";
		if (jQuery.isFunction(this.myButtons[i].show_condition)) display = this.myButtons[i].show_condition();
		if (display != "block" && display != "none") display = "none";
		if (this.MenuLevel != this.myButtons[i].MenuLevel) display = "none";
		$("#"+this.myButtons[i].myTR).css("display",display);
	}
	$("#"+this.id+"_BSTableLabelTD").css("background-color",this.LabelBackgroundColor);
	if (this.status != "shown") this.hide(); 
}

SideDock_menu.prototype.add = function(newButtonObject) {
	/* 
	ButtonObject = {
		id: some string to track the button by
		html: "some html",
		show_condition: function() {} must return STRING with either "block" or "none",
		click: function(e) {},
		myTR: id of the tr it sits in - this is automatically added later,
		MenuLevel: 0..9 an int (preferrably, but also strings will work) which tells the system at which level of the button-tree we currently are...
	}
	*/
	this.myButtons.push(newButtonObject);
	this.drawButtons();
}





// CREATE the side-docked menu
myMenu = new SideDock_menu("myMenu");

$(document).ready(function() {
	$(document).bind("UserChange", function(event) {
		myMenu.updateButtonVisibility();
	});
	myPlugins.add(myMenu);
});



