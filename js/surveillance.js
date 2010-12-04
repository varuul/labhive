aSurveillance = function() {
	this.Checks = new Array();
	// CHECKOBJECT {
	//		id: "MyGreatTimedAndRuledCheck"
	// 	nextCheckTime: 0,
	//		checkInterval: 10000,   // this will be added to the nextCheckTime IF the time was reached before (=independent of checkRule!)
	//		checkRule: function() { return true; },
	//		myCheck: function() { what to do IF nextCheckTime is reached AND checkRule returns TRUE }
	//
	this.SurveillanceDialogId = "none";
	this.InfoDialog = function() {
		//DIALOG__call(title, content, autoclosedelay, noclose, animate, uponClose,Position,noOverlay,resize,onShow) 
		this.SurveillanceDialogId = DIALOG__call("surveillance", "lastcheck <span id='surveillance_lastcheck'>0000</span>", 0, false,"",function() {}, null,true,false,function(){});
	}
	
	this.interval = 500; // callback to itself in milliseconds
	
	this.addCheck = function(CheckObject) {
		var myIndex = this.getCheckIdxById(CheckObject.id);
		if (myIndex != -1) {
			this.Checks[myIndex] = CheckObject;
		} else {
			this.Checks.push(CheckObject);
		}
		return this.getCheckIdxById(CheckObject.id);
	}
	
	this.removeCheck = function(CheckID) {
		var idx = this.getCheckIdxById(CheckID);
		if (idx == 1) return false;
		this.Checks.splice(idx,1);
		return true;
	}
	
	this.getCheckIdxById = function(CheckID) {
		for (var i=0; i<this.Checks.length; i++) {
			if (this.Checks[i].id == CheckID) return i;
		}
		return -1;
	}
	
	this.runChecks = function() {
		var now =  tools__NOW();
		if (this.SurveillanceDialogId!="none") {
			$("#"+this.SurveillanceDialogId).dialog("open");
			$("#surveillance_lastcheck").html(now);
		}
		for (var i=0;i<this.Checks.length;i++) {
			if (now>this.Checks[i].nextCheckTime) {
				if (this.Checks[i].checkRule) {
					this.Checks[i].nextCheckTime = now + this.Checks[i].checkInterval
					this.Checks[i].myCheck();
				}
			}
		}
		this.lastcheck = now;
		setTimeout("mySurveillance.runChecks();",mySurveillance.interval);
	}
	
	this.lastcheck = tools__NOW();
	// DIALOG__call(title, content, autoclosedelay, noclose, animate, uponClose,Position,noOverlay,resize,onShow) 
}

function tools__NOW() {
	var dateNow = new Date();
	var ms = Date.parse(dateNow);
	return ms;
}