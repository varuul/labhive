aSurveillance = function() {
	var thisSurveillance = this;
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
		this.lastcheck = tools__NOW();
		if (this.SurveillanceDialogId!="none") {
			$("#"+this.SurveillanceDialogId).dialog("open");
			$("#surveillance_lastcheck").html(this.lastcheck);
		}
		if (!isEmpty(this.Checks)) {
			for (var i=0;i<this.Checks.length;i++) {
				if (this.lastcheck>this.Checks[i].nextCheckTime) {
					if (this.Checks[i].checkRule) {
						this.Checks[i].nextCheckTime = this.lastcheck + this.Checks[i].checkInterval
						this.Checks[i].myCheck();
					}
				}
			}
		}
		var DelayWrapper = function() {
			return (function() { thisSurveillance.runChecks(); })();
		}
		setTimeout(DelayWrapper,this.interval);
	}

	this.lastcheck = tools__NOW();
}


function tools__NOW() {
	var dateNow = new Date();
	var ms = Date.parse(dateNow);
	return ms;
}



// this is a newly introduced object that will do constant checks and thereby work as  a global, subscibable timer...
mySurveillance = new aSurveillance();
mySurveillance.interval = 50;
setTimeout("mySurveillance.runChecks();",mySurveillance.interval);











