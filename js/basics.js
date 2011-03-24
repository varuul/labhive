// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- generating unique IDs with DOM-check and more  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------


function tools_randomid(length,numeric,charsonly, makeUnique) {		// this generates a random string from safe chars
	if (isEmpty(numeric) || numeric != true) numeric = false;
	if (isEmpty(makeUnique) || makeUnique != true) makeUnique = false;
	var rid = "";
	if (numeric == false) {
		if (charsonly) {
			var ridchars = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
		} else {
			var ridchars = new Array("1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","-","_");
		}
	} else {
		var ridchars = new Array("1","2","3","4","5","6","7","8","9","0");
	}
	var acceptable = false;
	while (acceptable == false) {
		for (var i=0;i<length;i++) {
			rid += ridchars[Math.floor(Math.random()*ridchars.length)];
		}
		if (makeUnique == false) acceptable = true;
		else if (makeUnique == true) {
			if ($("#"+rid).length!=0) acceptable = false;
			else acceptable=true;
		}
	}
	if (numeric == true) {
		return parseInt(rid);
	}
	return rid;
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- generating a random number within specific bounds  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function tools_MakeRandomNumber(min,max) {
	if (typeof min == "undefined") min = 0;
	if (typeof max == "undefined") max = 100;
	if (min>max) {
		return(-1);
	}
	if (min==max) {
		return(-1);
	}
	var rnd = parseInt(Math.random() * (max+1));
	return (rnd + min <= max ? rnd + min : rnd);
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- simple content check  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function isEmpty(variable) {
	if (typeof variable == "undefined") return true;
	if (variable == "") return true;
	return false;
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- building simple jqUI based dialogs  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function Dialog_build(title,contents) {
	if ($("#_dialogs_container").length==0) {
		var newDiaContainer = document.createElement("div");
		$(newDiaContainer).attr("id","_dialogs_container");
		$(newDiaContainer).addClass("css__HiddenContainer");
		$("body").append(newDiaContainer);
	}
	var newDiDiv = document.createElement("div");
	var DiID = tools_randomid(12);
	while ($("#"+DiID).length > 0) DiID = tools_randomid(12);
	$(newDiDiv).attr("id",DiID);
	$(newDiDiv).attr("title",title);
	$(newDiDiv).html(contents);
	$("#_dialogs_container").append(newDiDiv);
	$("#"+DiID+" button").button();
	return DiID;
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- Standard Time Format  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------


function DateTime_Now() {
	var today = new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	if (m<10) m = "0"+m;
	if (s<10) s = "0"+s;
	return h+":"+m+":"+s;
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- DYNAMIC LOADING OF HTML  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------


HTMLcontainer = new Array();
function loadHTML(html_url,callback,ForceReload,keepLineBreaks) {
	if (keepLineBreaks == undefined) keepLineBreaks = true;
	var targetid = "HTMLcontainer_"+encodeURI(html_url);
	targetid = targetid.replace(/\//g,"_");
	targetid = targetid.replace(/\./g,"_");
	targetid = targetid.replace(/\:/g,"_");
	targetid = targetid.replace(/\#/g,"_");
	targetid = targetid.replace(/\>/g,"_");
	targetid = targetid.replace(/\</g,"_");
	var needsRemake = false;
	var ourobject = HTMLcontainer[targetid];
	if (isEmpty(ourobject) == false && ourobject.type == "htmlContainer") {
		if (ForceReload == true) {
			// go on
			//ourobject.attr("LoadStatus","loading");
		} else {
			callback(targetid);
			return 2;   // template already loaded, do nothing
		}
	} else {
		needsRemake = true;
	}

	if (needsRemake) {
		HTMLcontainer[targetid] = new htmlContainerObject();
	}
	
	$.ajax({
		type: "GET",
		url: html_url,
		cache: false,
		success: function(doc){
			if (keepLineBreaks != true) {
				doc = doc.replace(/(\r\n|\n|\r)/gm,"");
			}
			if (isEmpty(HTMLcontainer[targetid]) == false && HTMLcontainer[targetid].type == "htmlContainer") {
				HTMLcontainer[targetid].fill(doc);
				HTMLcontainer[targetid].status="loaded";
			} else {
			}
			if (!isEmpty(callback) && jQuery.isFunction(callback)) callback(targetid);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			HTMLcontainer[targetid].status = "LoadError";
			HTMLcontainer[targetid].fill("<div>error loading content: "+errorThrown+"</div>");
		}
	});
	return 0;   // load in progress
}


htmlContainerObject = function () {
	this.data = "";
	this.status = "new";
	this.type = "htmlContainer";
	return this;
}

htmlContainerObject.prototype.fill = function(data) {
	this.data = data;
	this.status = "filled";
}

htmlContainerObject.prototype.clear = function() {
	this.data = "";
	this.status = "cleared";
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- generating a hidden IFrame  -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function HiddenIframe__create() {
	if ($("#HiddenIFrameContainer").length == 0) {
		var IFcontainer = document.createElement("div");
		$(IFcontainer).attr("id","HiddenIFrameContainer");
		$(IFcontainer).css("visibility","hidden");
		$(IFcontainer).css("width","0px");
		$(IFcontainer).css("height","0px");
		$(IFcontainer).css("left","0px");
		$(IFcontainer).css("top","0px");
		$(IFcontainer).css("position","absolute");
		$(IFcontainer).css("overflow","hidden");
		$("body").append(IFcontainer);
	} 
	var IFrame = document.createElement("iframe");
	var i=0;
	while ($("#HiddenIFrame_"+i).length != 0) { i++ };
	$(IFrame).attr("id","HiddenIFrame_"+i);
	$(IFrame).attr("src","");
	$(IFrame).attr("name","HiddenIFrame_0"+i);
	$(IFrame).css("visibility","hidden");
	$(IFrame).css("width","0px");
	$(IFrame).css("height","0px");
	$(IFrame).css("left","0px");
	$(IFrame).css("top","0px");
	$(IFrame).css("position","absolute");
	$(IFrame).css("overflow","hidden");
	$("#HiddenIFrameContainer").append(IFrame);
	return "HiddenIFrame_0"+i;
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- extension of jQuery selectors with :focus attribute -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

jQuery.extend(jQuery.expr[':'], {
    focus: function(element) { 
        return element == document.activeElement; 
    }
});
$.fn.extend({
    hasFocus: function() {
		if (this.length != 1) return false;
		if (this[0] == document.activeElement) return true;
		else return false; 
	}
});


function ObjectSize(obj) {
	var n=0;
	for (i in obj) {
		n++;
	}
	return n;
}