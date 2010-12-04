	$(window).bind("resize",function(e) {
		var myW = $(".css__GrowSlide_main").width();
		$(".css__GrowSlide_main").css("left",$(window).width()/2 - myW/2);
		$(".css__GrowSlide_main").css("top",$(window).height() - 40);
	});

GrowSlide = function(myId) {
	if (myId == undefined) return false;
	if ($("#"+myId).length != 0) return false;
	this.baseClass = "css__GrowSlide_main";
	this.labelClass = "css__GrowSlide_label";
	this.contentClass = "css__GrowSlide_content";
	this.labelHTML = "mylabel";
	this.contentHTML = "content<br>content<br><button>hello</button>";
	this.inactive_opacity = .7;
	this.inactive_position = function() {
		var newTop = $(window).height() - 40;
		return newTop;
	}
	this.active_opacity = 1;
	this.active_position = function() {
		var newTop = $(window).height() - 40 - this.active_height() + this.inactive_height();
		return newTop;
	}
	this.active_height = function() {
		var newHeight = $(this.label).height() + $(this.content).height() + 12;
		return newHeight;
	}
	this.inactive_height = function() {
		var newHeight = $(this.label).height() + 8;
		return newHeight;
	}
	this.DOMelement = document.createElement("div");
	this.status="closed";
	$(this.DOMelement).attr("id",myId);
	$("body").append(this.DOMelement);
	$(this.DOMelement).addClass(this.baseClass);
	this.label = document.createElement("div");
	this.label.parent = this;
	$(this.label).addClass(this.labelClass);
	$(this.label).html(this.labelHTML);
	$(this.DOMelement).append(this.label);
	$(this.label).click(function(e) {
		this.parent.toggle();
	});	
	
	this.content = document.createElement("div");
	this.content.parent = this;
	$(this.content).addClass(this.contentClass);
	$(this.content).html(this.contentHTML);
	$(this.DOMelement).append(this.content);
	this.DOMelement.parent = this;

	$(this.DOMelement).hover(
		function(e) {
			this.parent.open();
		},
		function(e) {
			this.parent.close();
		}		
	);
	var myW = $(".css__GrowSlide_main").width();
	$(".css__GrowSlide_main").css("left",$(window).width()/2 - myW/2);
	this.close();
}

GrowSlide.prototype.open = function() {
	$(this.DOMelement).css("top",this.active_position());
	$(this.DOMelement).css("opactity",this.active_opacity);
	$(this.DOMelement).css("height",this.active_height());
	this.status = "open";
}

GrowSlide.prototype.close = function() {
	$(this.DOMelement).css("top",this.inactive_position());
	$(this.DOMelement).css("opactity",this.inactive_opacity);
	$(this.DOMelement).css("height",this.inactive_height());
	this.status = "open";
}

GrowSlide.prototype.toggle = function() {
	if (this.status == "closed") this.open();
	else if (this.status == "open") this.close();
}

GrowSlide.prototype.setContent = function(contentHTML) {
	$(this.content).html(contentHTML);
}
GrowSlide.prototype.setLabel = function(labelHTML) {
	$(this.label).html(labelHTML);
}

GrowSlide.prototype.setSlideClass = function(slideClass) {
	$(this.DOMelement).removeClass(this.baseClass);
	this.baseClass = slideClass
	$(this.DOMelement).addClass(slideClass);
}
GrowSlide.prototype.setLabelClass = function(labelClass) {
	$(this.label).removeClass(this.labelClass);
	this.labelClass = labelClass
	$(this.label).addClass(labelClass);
}

GrowSlide.prototype.setContentClass = function(contentClass) {
	$(this.content).removeClass(this.contentClass);
	this.contentClass = contentClass
	$(this.content).addClass(contentClass);
}

GrowSlide.prototype.hide = function() {
	$(this.DOMelement).css("display","none");
}

GrowSlide.prototype.show = function() {
	$(this.DOMelement).css("display","block");
}

