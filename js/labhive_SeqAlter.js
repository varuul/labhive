$(document).ready(function() {
	
	SeqAlterObject = function() {
		this.init = function() {
			loadHTML(myBrowser.URL_html+"SeqAlter/SeqAlter__SeqDiv_max.html",function(tid){ SeqAlter.SeqDiv_HTML_max = myBrowser.loadedhtml[tid].data; },false,false);
			loadHTML(myBrowser.URL_html+"SeqAlter/SeqAlter__SeqDiv_min.html",function(tid){ SeqAlter.SeqDiv_HTML_min = myBrowser.loadedhtml[tid].data; },false,false);
			SeqAlter__createPanel();
			SeqAlter__addTexts();
			SeqAlter__addMenuButtons();
			SeqAlter__addDropTarget_Antisense();
			SeqAlter__addDropTarget_Translate();
			
		}
		this.createSequenceInstance = function() {
			var me = SeqAlter__createSequenceInstance__DOMelement();
			return me;
		}
		
	}

	SeqAlter = new SeqAlterObject();
	myPlugins.add(SeqAlter);
	
});



function SeqAlter__createSequenceInstance__DOMelement() {
	var SeqDiv = document.createElement("div");
	var myID = "SeqDiv__"+tools_randomid(8,false,true,true);
	$(SeqDiv).attr("id",myID);
	SeqDiv.myTitle = "unnamed";
	$(SeqDiv).addClass("css__SeqAlter");
	$(SeqDiv).addClass("css__SeqAlter__SeqDiv");
	$(SeqDiv).addClass("css__SeqAlter_draggable");
	$("#SeqAlter__Panel").append(SeqDiv);
	var myHTML = localize(SeqAlter.SeqDiv_HTML_max);
	myHTML = myHTML.replace(/SeqDiv__SeqTitle__Input/g, "SeqDiv__SeqTitle__Input__"+myID);
	myHTML = myHTML.replace(/SeqDiv__Sequence__TextArea/g, "SeqDiv__Sequence__TextArea__"+myID);
	SeqDiv.maxHTML = myHTML;
	SeqDiv.minHTML = localize(SeqAlter.SeqDiv_HTML_min);
	SeqDiv.state = 1; // 0=minimized; 1=maximized
	SeqDiv.myTitle = "no-name";
	SeqDiv.mySequence = "";
	var Info = Dialog_build(SeqDiv.myTitle,SeqDiv.maxHTML);
	SeqDiv.myDialog = $("#"+Info).dialog({width:"auto", resizable: true,  modal: false, 
		beforeclose: function (event, ui) {
			SeqAlter__minimize(this.id);
		},
		open: function (event, ui) {
			var i = 0;
		},
		autoOpen: false
	});
	SeqDiv.update = function() {
		if (this.state == 1) {
			$(this).draggable("disable");
			$(this).css("display","none");
			this.myDialog.dialog("open");
			SeqAlter__maximize(this.id);
		} else {
			var myHTML = this.minHTML.replace(/@@SeqTitle/g,this.myTitle);
			$(this).html(myHTML);
			$(this).draggable("enable");
			$(this).css("display","block");
			$(this).click(function(e) { this.state = 1;  this.myDialog.dialog("option", "title",this.myTitle); this.update(); });
		}
	}
	$(SeqDiv).addClass("css__SeqAlter__SeqDiv__min");
	$(SeqDiv).draggable();
	SeqDiv.update();
	return SeqDiv;
}

function SeqAlter__minimize(dialogID) {
	$(".css__SeqAlter__SeqDiv").each(function(key, obj) {
		if (this.myDialog.attr("id") == dialogID) {
			var myID = this.id;
			this.mySequence = $("#SeqDiv__Sequence__TextArea__"+myID).val();
			this.myTitle = $("#SeqDiv__SeqTitle__Input__"+myID).val();
			this.state = 0;
			this.update();
		}
	});	
}

function SeqAlter__maximize(dialogID) {
	$(".css__SeqAlter__SeqDiv").each(function(key, obj) {
		if (this.myDialog.attr("id") == dialogID) {
			var myID = this.id;
			//$("#SeqDiv__Sequence__TextArea__"+myID).val(this.mySequence);
			//$("#SeqDiv__SeqTitle__Input__"+myID).val(this.myTitle);
		}
	});	
}


function SeqAlter__addDropTarget_Antisense() {
	var myDropTarget = document.createElement("div");
	$(myDropTarget).attr("id","SeqAlter_DropTarget_Antisense");
	$(myDropTarget).addClass("css__SeqAlter");
	$(myDropTarget).addClass("css__SeqAlter__DropTarget");
	$(myDropTarget).html("ANTISENSE");
	
	$("#SeqAlter__Panel").append(myDropTarget);
	$(myDropTarget).droppable({
		drop: function(event, ui) {
			var newTitle = "antisense_"+ui.draggable.attr("myTitle");
			var seq = ui.draggable.attr("mySequence").toUpperCase();
			var antisenseSEQ = seq_antisense(seq, false);
			var myNewSeq = SeqAlter.createSequenceInstance();
			$("#SeqDiv__Sequence__TextArea__"+myNewSeq.id).val(antisenseSEQ);
			$("#SeqDiv__SeqTitle__Input__"+myNewSeq.id).val(newTitle);
			myNewSeq.myDialog.dialog("option","title",newTitle);
		}
	});
}
function SeqAlter__addDropTarget_Translate() {
	var myDropTarget = document.createElement("div");
	$(myDropTarget).attr("id","SeqAlter_DropTarget_Translate");
	$(myDropTarget).addClass("css__SeqAlter");
	$(myDropTarget).addClass("css__SeqAlter__DropTarget");
	$(myDropTarget).html("TRANSLATE");
	
	$("#SeqAlter__Panel").append(myDropTarget);
	$(myDropTarget).droppable({
		drop: function(event, ui) {
			var newTitle = "translated_"+ui.draggable.attr("myTitle");
			var seq = ui.draggable.attr("mySequence").toUpperCase();
			var translatedSEQ = seq_translate(1,seq);
			var myNewSeq = SeqAlter.createSequenceInstance();
			$("#SeqDiv__Sequence__TextArea__"+myNewSeq.id).val(translatedSEQ);
			$("#SeqDiv__SeqTitle__Input__"+myNewSeq.id).val(newTitle);
			myNewSeq.myDialog.dialog("option","title",newTitle);
		}
	});
}




function SeqAlter__addTexts() {
	localized_text.en.SeqAlter__SequenceTitle__PreText = "SequenceTitle";
	localized_text.en.SeqAlter__Sequence__PreText = "Sequence";
	localized_text.en.BUTTON_TEXT__SeqAlter = "SeqAlter";
	localized_text.en.BUTTON_TEXT__SeqAlter_back = "back";
	localized_text.en.BUTTON_TEXT__SeqAlter_NewSequence = "new Sequence";
	
	
}

function SeqAlter__addMenuButtons() {
	var SeqAlterButton = {
		id:"Button__SeqAlter",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__SeqAlter']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 1) return "block";
			else return "none";
		},
		click: function(e) { 
			myBrowser.menu.MenuLevel = "SeqAlter_1";  
			myBrowser.menu.updateButtonVisibility(); 
			$("#SeqAlter__Panel").css("visibility", "visible");
		},
		MenuLevel: 0
	}
	myBrowser.menu.buttons_add(SeqAlterButton);	
	
	var SeqAlter_BackButton = {
		id:"Button__SeqAlter",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__SeqAlter_back']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 1) return "block";
			else return "none";
		},
		click: function(e) { 
			myBrowser.menu.MenuLevel = 0;  
			myBrowser.menu.updateButtonVisibility(); 
			$("#SeqAlter__Panel").css("visibility", "hidden");
		},
		MenuLevel: "SeqAlter_1"
	}
	myBrowser.menu.buttons_add(SeqAlter_BackButton);	
	
	var SeqAlter_NewSequenceButton = {
		id:"Button__SeqAlter",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__SeqAlter_NewSequence']+"</div>",
		show_condition: function() {
			if (myBrowser.UserStatus == 1) return "block";
			else return "none";
		},
		click: function(e) {  
			var newSeq = SeqAlter.createSequenceInstance();
			
		},
		MenuLevel: "SeqAlter_1"
	}
	myBrowser.menu.buttons_add(SeqAlter_NewSequenceButton);	
}



function SeqAlter__createPanel() {
	if ($("#SeqAlter__Panel").length!=0) return false;
	var myPanel = document.createElement("div");
	$("body").append(myPanel);
	$(myPanel).addClass("css__SeqAlter__Panel");
	$(myPanel).attr("id","SeqAlter__Panel");
}













// -------------------------------------------------------------------------------------  
// -------------------------------------------------------------------------------------  
// -------------------------------------------------------------------------------------  
// -------------------------------------------------------------------------------------  SEQUENCE FUNCTIONS
// -------------------------------------------------------------------------------------  
// -------------------------------------------------------------------------------------  
// -------------------------------------------------------------------------------------  



function seq_antisense(seqIN, removeN) {
	if (isEmpty(removeN)) removeN = false;
	if (isEmpty(seqIN)) return "";
	var seqOut = "";
	for (var i=seqIN.length-1;i>-1;i--) {
		switch(seqIN[i]) {
			case "A":
				seqOut += "T";
				break;
			case "T":
				seqOut += "A";
				break;
			case "C":
				seqOut += "G";
				break;
			case "G":
				seqOut += "C";
				break;
			case "N":
				if (removeN == false) seqOut += "N";
				break;
			case "U":
				seqOut += "U";
				break;
		}
	}
	return seqOut;
}


function seq_translate(frame, seqIN, mode, molecule) {
	// $mode => 0 = 1 letter code, 1 = 3 letter code, 2 = full
	if (isEmpty(seqIN)) return "";
	if (isEmpty(frame)) frame = 1;
	else {
		frame = parseInt(frame);
		if (frame <-3 || frame > 3 || frame ==0) frame = 1;
	}
	if (isEmpty(mode)) mode = 0;
	if (isEmpty(molecule)) molecule == "DNA";
	if (molecule == "RNA") {
		seqIN = seqIN.replace(/U/g,"T");
	}
	aminoacids = "";
	if (frame < 0) {
		seqIN = seq_antisense(seqIN);
		frame = - frame;
	}
	for (var i=frame-1;i<seqIN.length-frame-1;i = i+3) {
		switch(seqIN[i]+seqIN[i+1]+seqIN[i+2]) {
			case "GCT":
				aminoacids += "A";
				break;
			case "GCC":
				aminoacids += "A";
				break;
			case "GCA":
				aminoacids += "A";
				break;
			case "GCG":
				aminoacids += "A";
				break;
			case "TGT":
				aminoacids += "C";
				break;
			case "TGC":
				aminoacids += "C";
				break;
			case "GAT":
				aminoacids += "D";
				break;
			case "GAC":
				aminoacids += "D";
				break;
			case "GAA":
				aminoacids += "E";
				break;
			case "GAG":
				aminoacids += "E";
				break;
			case "TTT":
				aminoacids += "F";
				break;
			case "TTC":
				aminoacids += "F";
				break;
			case "GGT":
				aminoacids += "G";
				break;
			case "GGC":
				aminoacids += "G";
				break;
			case "GGA":
				aminoacids += "G";
				break;
			case "GGG":
				aminoacids += "G";
				break;
			case "CAT":
				aminoacids += "H";
				break;
			case "CAC":
				aminoacids += "H";
				break;
			case "ATT":
				aminoacids += "I";
				break;
			case "ATC":
				aminoacids += "I";
				break;
			case "ATA":
				aminoacids += "I";
				break;
			case "AAA":
				aminoacids += "K";
				break;
			case "AAG":
				aminoacids += "K";
				break;
			case "TTA":
				aminoacids += "L";
				break;
			case "TTG":
				aminoacids += "L";
				break;
			case "CTT":
				aminoacids += "L";
				break;
			case "CTC":
				aminoacids += "L";
				break;
			case "CTA":
				aminoacids += "L";
				break;
			case "CTG":
				aminoacids += "L";
				break;
			case "ATG":
				aminoacids += "M";
				break;
			case "AAT":
				aminoacids += "N";
				break;
			case "AAC":
				aminoacids += "N";
				break;
			case "CCT":
				aminoacids += "P";
				break;
			case "CCC":
				aminoacids += "P";
				break;
			case "CCA":
				aminoacids += "P";
				break;
			case "CCG":
				aminoacids += "P";
				break;
			case "CAA":
				aminoacids += "Q";
				break;
			case "CAG":
				aminoacids += "Q";
				break;
			case "CGT":
				aminoacids += "R";
				break;
			case "CGC":
				aminoacids += "R";
				break;
			case "CGA":
				aminoacids += "R";
				break;
			case "CGG":
				aminoacids += "R";
				break;
			case "AGA":
				aminoacids += "R";
				break;
			case "AGG":
				aminoacids += "R";
				break;
			case "TCT":
				aminoacids += "S";
				break;
			case "TCC":
				aminoacids += "S";
				break;
			case "TCA":
				aminoacids += "S";
				break;
			case "TCG":
				aminoacids += "S";
				break;
			case "AGT":
				aminoacids += "S";
				break;
			case "AGC":
				aminoacids += "S";
				break;
			case "ACT":
				aminoacids += "T";
				break;
			case "ACC":
				aminoacids += "T";
				break;
			case "ACA":
				aminoacids += "T";
				break;
			case "ACG":
				aminoacids += "T";
				break;
			case "GTT":
				aminoacids += "V";
				break;
			case "GTC":
				aminoacids += "V";
				break;
			case "GTA":
				aminoacids += "V";
				break;
			case "GTG":
				aminoacids += "V";
				break;
			case "TGG":
				aminoacids += "W";
				break;
			case "TAT":
				aminoacids += "Y";
				break;
			case "TAC":
				aminoacids += "Y";
				break;
			case "TAA":
				aminoacids += "*";
				break;
			case "TAG":
				aminoacids += "*";
				break;
			case "TGA":
				aminoacids += "*";
				break;
			default:
				aminoacids += "?";
				break;
		}
	}
	return aminoacids;
}

