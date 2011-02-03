
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- integrating into the current project -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
	// the console is for administration and testing purposes. might make sense to deactivate it later on
	myLog = new logObject(myBrowser);
	myPlugins.add(myLog);
	
});

$(document).bind("InitStage1complete", function(event) {
	var LogButton = {
		id:"Button__Log",
		click: function(e) { 
			var content = myLog.content();
			var myDialogID = Dialog_build(">> ActionLog",content);
			$("#"+myDialogID).dialog(); 
		},
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__Log']+"</div>",
		show_condition: function() {
			if (myUser.UserStatus == 0) return "none";
			else return "block";
		},
		MenuLevel: 0
	}
	myMenu.add(LogButton);
});



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- pure Object -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

logObject = function() {
	this.initialized = false;
	this.entries = new Array();
	return this;
}

logObject.prototype.init = function() {
	this.initialized = true;
	return this.initialized;
}

logObject.prototype.add = function(comment) {
	var newEntry = {
		id: tools_randomid(14),
		text: comment,
		timestamp: DateTime_Now()
	}
	this.entries.push(newEntry);
}

logObject.prototype.wipe = function() {
	this.entries = new Array();
}

logObject.prototype.content = function(which, order, format) {
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

logObject.prototype.len = function() {
	return this.entries.length;
}




