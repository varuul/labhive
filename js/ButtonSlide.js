function ButtonSlide() {
	var myDIV = document.createElement("div");
	$(myDIV).addClass("css__ButtonSlideDiv");
	$("body").append(myDIV);
	
	myDIV.SliderType = "top";
	myDIV.hide_delay = 800;
	myDIV.VisiblePixelsWhenHidden = 22;
	myDIV.HiddenPixelsWhenShown = 6;
	myDIV.myButtonTR_class = "css__ButtonSlide_ButtonTR_top";
	myDIV.LabelImage = "";
	myDIV.LabelBackgroundColor = "#000000";
	myDIV.myWidth = 170;
	myDIV.status = "hidden";
	myDIV.MenuLevel = 0;
	
	$(myDIV).hover(
		function(e) {
			this.status = "shown";
			this.show();
		},
		function(e) {
			this.status = "hidden";
			this.hide();
		}
	);
	myDIV.hide = function() {
		if (this.SliderType == "top") {
			var newT = - parseInt($(this).height()) + this.VisiblePixelsWhenHidden;
			$(this).css("top",newT);
		} else if (this.SliderType == "left") {
			var newL = - parseInt($(this).width()) + this.VisiblePixelsWhenHidden;
			$(this).css("left",newL);
		}
	}
	myDIV.show = function() {
		if (this.SliderType == "top") {
			$(this).css("top",-this.HiddenPixelsWhenShown);
		} else if (this.SliderType == "left") {
			$(this).css("left",-this.HiddenPixelsWhenShown);
		}
	}
	$(myDIV).click(function(e) {
		this.show();
	});
	
	myDIV.updatePosition = function() {};
	
	myDIV.drawButtons = function() {
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
		
		$(this).empty();
		$(this).append(BSTable);
		$(this).width(this.myWidth);
		$(".css__ButtonSlide_button").button();
		this.updateButtonVisibility();
		this.updatePosition();
	};
	
	myDIV.updateButtonVisibility = function() {
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
	
	myDIV.myButtons = new Array();
	
	myDIV.buttons_add = function(newButtonObject) {
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
	
	return myDIV;
}