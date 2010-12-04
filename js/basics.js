String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}
Array.prototype.unique = function () {
	var r = new Array();
	o:for(var i = 0, n = this.length; i < n; i++)
	{
		for(var x = 0, y = r.length; x < y; x++)
		{
			if(r[x]==this[i])
			{
				continue o;
			}
		}
		r[r.length] = this[i];
	}
	return r;
}

Array.prototype.indexOf = function(search) {
	for (var i=0; i< this.length; i++) {
		if (search==this[i]) return i;
	}
	return -1;
}


function tools_randomid(length,numeric,charsonly, makeUnique) {		// this generates a random string from safe chars
	// version TW 02.08.2010 14.00
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


function tools_MakeRandomNumber(min,max) {
	if (min>max) {
		return(-1);
	}
	if (min==max) {
		return(-1);
	}
	var rnd = parseInt(Math.random() * (max+1));
	return (rnd + min <= max ? rnd + min : rnd);
}

function tools_JSONparser(data) {    // copied from here: http://encosia.com/2009/07/07/improving-jquery-json-performance-and-security/
	var Empty = {};
	if (data == undefined || data == "") return Empty;
	if (typeof (JSON) !== 'undefined' && typeof (JSON.parse) === 'function')
		return JSON.parse(data);
	else
		return eval('(' + data + ')');
}

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

function DateTime_Now() {
	var today = new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	if (m<10) m = "0"+m;
	if (s<10) s = "0"+s;
	return h+":"+m+":"+s;
}


function loadHTML(html_url,callback,ForceReload,keepLineBreaks) {

	if (keepLineBreaks == undefined) keepLineBreaks = true;
	var targetid = "LoadedHTML_"+encodeURI(html_url);
	targetid = targetid.replace(/\//g,"_");
	targetid = targetid.replace(/\./g,"_");
	targetid = targetid.replace(/\:/g,"_");
	targetid = targetid.replace(/\#/g,"_");
	targetid = targetid.replace(/\>/g,"_");
	targetid = targetid.replace(/\</g,"_");
	var needsRemake = false;
	var ourobject = myBrowser.loadedhtml[targetid];
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
		myBrowser.loadedhtml[targetid] = new htmlContainerObject();
	}
	
	$.ajax({
		type: "GET",
		url: html_url,
		cache: false,
		success: function(doc){
			if (keepLineBreaks != true) {
				doc = doc.replace(/(\r\n|\n|\r)/gm,"");
			}
			log("load success for "+html_url);
			if (isEmpty(myBrowser.loadedhtml[targetid]) == false && myBrowser.loadedhtml[targetid].type == "htmlContainer") {
				myBrowser.loadedhtml[targetid].fill(doc);
				myBrowser.loadedhtml[targetid].status="loaded";
			} else {
				log("failed to assign loaded file to container object "+html_url);
			}
			if (!isEmpty(callback) && jQuery.isFunction(callback)) callback(targetid);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			log("load error for "+html_url);
			log("reason: "+errorThrown);
			myBrowser.loadedhtml[targetid].status = "LoadError";
			myBrowser.loadedhtml[targetid].fill("<div>error loading content: "+errorThrown+"</div>");
		}
	});
	return 0;   // load in progress
}


function log(text) {
	if (myBrowser.log == undefined) myBrowser.log = new logObject();
	myBrowser.log.add(text);
	return myBrowser.log.len();
}

htmlContainerObject = function () {
	this.data = "";
	this.status = "new";
	this.fill = function(data) {
		this.data = data;
		this.status = "filled";
	}
	this.clear = function() {
		this.data = "";
		this.status = "cleared";
	}
	this.type = "htmlContainer";
	return this;
}


logObject = function() {
	this.entries = new Array();
	this.add = function(comment) {
		var newEntry = {
			id: tools_randomid(14),
			text: comment,
			timestamp: DateTime_Now()
		}
		this.entries.push(newEntry);
	}
	this.wipe = function() {
		this.entries = new Array();
	}
	this.len = function() {
		return this.entries.length;
	}
	this.content = function(which, order, format) {
		if (isEmpty(format)) format = "<br>@@id::@@timestamp => @@text";
		if (isEmpty(order)) order = "desc";
		var output = "";
		if (order == "desc") {
			for (var i=this.entries.length-1; i>-1; i--) {
				var Pattern = new RegExp(/@@id/g);
				var nextline = format.replace(Pattern, i);
				Pattern = new RegExp(/@@timestamp/g);
				nextline = nextline.replace(Pattern, this.entries[i].timestamp);
				Pattern = new RegExp(/@@text/g);
				nextline = nextline.replace(Pattern, this.entries[i].text);
				output += nextline;
			}
		}
		return output;
	}
	return this;
}


function isEmpty(variable) {
	if (variable == undefined) return true;
	if (variable == "") return true;
	return false;
}