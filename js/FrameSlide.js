	$(window).bind("resize",function(e) {
		$(".css__FrameSlide_main").width($(window).width()-10);
		$(".css__FrameSlide_main").css("left",5);
	});

FrameSlide = function(myId) {
	if (myId == undefined) return false;
	if ($("#"+myId).length != 0) return false;
	this.type = "top";
	this.baseClass = "css__FrameSlide_main";
	this.labelClass = "css__FrameSlide_label";
	this.labelContent = "<b>TestLabel</b>";
	this.closeTimeout = 800;
	this.animationSpeed = 700;
	this.inactive_opacity = .7;
	this.inactive_position = function() {
		var myHeight = $(this.DOMelement).height();
		var newTop = -myHeight+2;
		return newTop;
	}
	this.active_opacity = 1;
	this.active_position = function() {
		var newTop = -2;
		return newTop;
	}
	this.DOMelement = document.createElement("div");
	$(this.DOMelement).attr("id",myId);
	$("body").append(this.DOMelement);
	$(this.DOMelement).addClass(this.baseClass);
	this.myContent = document.createElement("div");
	$(this.DOMelement).append(this.myContent);
	$(this.myContent).html("hello<br>hline2<br>line3<br>line4");
	this.label = document.createElement("div");
	this.label.parent = this;
	$(this.label).addClass(this.labelClass);
	$(this.label).html(this.labelContent);
	$(this.DOMelement).append(this.label);
	this.DOMelement.parent = this;
	$(this.label).click(function(e) {
		this.parent.slide();
	});	
	$(this.DOMelement).hover(
		function(e) {
			var TimerID =this.id+"CloseCheck"
			mySurveillance.removeCheck(TimerID);
			this.parent.open();
		},
		function(e) {
			var next = tools__NOW()+this.parent.closeTimeout;
			var FrameSlideCloseCheck = {
				id: this.parent.DOMelement.id+"CloseCheck",
				CheckParent: this.parent,
				checkInterval: this.parent.closeTimeout,
				nextCheckTime: next,
				checkRule: true,
				done: false,
				myCheck: function() {
					this.CheckParent.close();
					this.done = true;
				}
			}
			mySurveillance.addCheck(FrameSlideCloseCheck);
		}		
	);
	$(this.DOMelement).width($(window).width()-10);
	$(this.DOMelement).css("left",5);
	this.close();
}
	
FrameSlide.prototype.setType = function(type) {
	if (type != "top" && type != "bottom") return false;
	this.type = type;
	return type;
}

FrameSlide.prototype.open = function() {
	if (this.type == "top") {
		$(this.DOMelement).animate({
			opacity: this.active_opacity,
			top: this.active_position()
		 }, this.animationSpeed, 
		 function() {
			this.status = "open";
		});
	}	
	this.updateLabel();
}

FrameSlide.prototype.close = function() {
	if (this.type == "top") {
		$(this.DOMelement).animate({
			opacity: this.inactive_opacity,
			top: this.inactive_position()
		}, this.animationSpeed, 
		 function() {
			this.status = "closed";
		});
	}	
	this.updateLabel();
}


FrameSlide.prototype.updateLabel = function() {
	var myHeight = $(this.DOMelement).height();
	var myWidth = $(this.DOMelement).width()-250;
	if (myWidth < 5) myWidth = 5;
	$(this.label).css("top",myHeight-6);
	$(this.label).css("left",myWidth-250);
}

FrameSlide.prototype.slide = function() {
	if (this.status == "closed") this.open();
	else if (this.status == "open") this.close();
}


FrameSlide.prototype.content = function(newContent) {
	if (newContent == undefined) return $(this.myContent).html();
	else {
		$(this.myContent).html(newContent);
		this.close();
	}
}


FrameSlide.prototype.label = function(newContent) {
	if (newContent == undefined) return this.labelContent;
	else {
		this.labelContent = newContent;
		$(this.label).html(this.labelContent);
		this.close();
	}
}


