// CrossQuery Plugin for LabHive depends on 
// BROWSER plugins ,
//  the general LabHive FrameWork as well as
// jQuery and its plugins jGritter


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- integrating into the current project -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
	myCrossQuery = new CrossQueryObject(myBrowser);
	myPlugins.add(myCrossQuery);
});




// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------- pure Object -------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------

CrossQueryObject = function(myDad) {
	if (isEmpty(myDad) || isEmpty(myDad.URL_html)) return false;
	this.myParent = myDad;
	this.initialized = false;
	this.FileName_crossquery = "labhive_crossquery.php";
	this.Images = {};
	this.inits = {
		"DisplaySetupHtml" : {
			state: false
		},
		"PanelHtml" : {
			state: false
		},
		"DataSets" : {
			state: false
		},
		
	}
}

CrossQueryObject.prototype.init = function() {
	var thisCQ = this;
	this.addLocalizedTexts();
	$(document).bind("CrossQueryAnswer", thisCQ.ajax_CrossQueryAnswerHandler);
	$(document).bind("AjaxResponse", function(event) {
		thisCQ.ajax_responseHandler(event);
	});
	$(document).bind("CQ_PartInitated", function(event) {
		thisCQ.inits[event.part.name] = event.part.state;
		var alldone = true;
		for (var key in thisCQ.inits) {
			if (thisCQ.inits[key].state == false) alldone = false;
		}
		if (alldone) thisCQ.initialized = true;
		else thisCQ.initialized = false;
	});
	
	loadHTML(thisCQ.myParent.URL_html+"crossquery.html",function(html_ID) {
		var myhtml = (HTMLcontainer[html_ID].data);
		var myDialogID = Dialog_build(localized_text[thisCQ.myParent.language]["CROSSQUERYDIALOG__HeaderText"],myhtml);
		thisCQ.CQ_Panel = $("#"+myDialogID);
		$(thisCQ.CQ_Panel).dialog({
			autoOpen:false, 
			width:"auto", 
			resizable: true, 
			modal: false,
			open: function(e,ui) {
				$("#xQ-MAINTABS-CONTAINER").tabs();
			}
		});
		$(document).trigger({type:"CQ_PartInitated", part: { name: "PanelHtml", state: true } });
	},false);
	loadHTML(thisCQ.myParent.URL_html+"crossquery_displaysetup.html",function(html_ID) {
		var myhtml = (HTMLcontainer[html_ID].data);
		var myDialogID = Dialog_build(localized_text[thisCQ.myParent.language]["CROSSQUERY_DISPLAYSETUPDIALOG__HeaderText"],myhtml);
		thisCQ.CQ_DisplayPanel = $("#"+myDialogID);
		$(thisCQ.CQ_DisplayPanel).dialog({autoOpen:false, width:"auto", resizable: true, modal: false});
		$(document).trigger({type:"CQ_PartInitated", part: { name: "DisplaySetupHtml", state: true } });
	},false);
	
	var CQButton = {
		id:"Button__CrossQuery",
		html: "<div class='css__Bar_Button_Div'>"+localized_text[myBrowser.language]['BUTTON_TEXT__CrossQuery']+"</div>",
		show_condition: function() {
			if (myUser.UserStatus == 0) return "none";
			else return "block";
		},
		click: function(e) { 
			thisCQ.CQ_Panel.dialog("open"); 
		},
		MenuLevel: 0
	}
	myMenu.add(CQButton);	
	
	this.ajax_RequestDatasets();
}

CrossQueryObject.prototype.addLocalizedTexts = function() {
	localized_text["en"]["CROSSQUERYDIALOG__HeaderText"] = "CrossQuery";
	localized_text["en"]["BUTTON_TEXT__CrossQuery"] = "CrossQuery";
	
}
CrossQueryObject.prototype.ajax_responseHandler = function(event) {
	if (event.json.job == "crossquery_filter") {
		$(document).trigger({ type:"CrossQueryAnswer", json: event.json });
	}
	if (event.json.job == "crossquery_returnDataSets") {
		$(document).trigger({ type:"CrossQueryAnswer", json: event.json });
	}
	
}
CrossQueryObject.prototype.runQuery = function(event) {
	var thisCQ = this;
	var filtered = $("#filter-code").val();
	filtered = filtered.replace(/find/g, "LOCATE");
	filtered = filtered.replace(/gid/gi, "ensembl_id");
	
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_filter";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.f = filtered;	
	postinfo.l = $("#resultlimit").val();	
	postinfo.s = $("#sort-code").val();	
	postinfo.o = $("#sort-orientation").val();
	postinfo.xs = $("#xs-code").val();
	if (postinfo.f.search(/select/i)>-1 || postinfo.f.search(/delete/i)>-1 || postinfo.f.search(/insert/i)>-1 ||
		postinfo.l.search(/select/i)>-1 || postinfo.l.search(/delete/i)>-1 || postinfo.l.search(/insert/i)>-1 ||
		postinfo.o.search(/select/i)>-1 || postinfo.o.search(/delete/i)>-1 || postinfo.o.search(/insert/i)>-1 ||
		postinfo.s.search(/select/i)>-1 || postinfo.s.search(/delete/i)>-1 || postinfo.s.search(/insert/i)>-1 ||
		postinfo.xs.search(/select/i)>-1 || postinfo.xs.search(/delete/i)>-1 || postinfo.xs.search(/insert/i)>-1
	) {
		alert("sorry, but your inputs may not contain the words 'select','insert','delete'!");
		return false;
	}
	$.post(this.myParent.URL_backend+this.FileName_crossquery, postinfo,						// POST VIA AJAX!
		function(doc){					// IF ajax call is returned do this...
			var JSONdoc = thisCQ.myParent.AJAX__ProcessAnswer(doc);
		}
	);
	$("#xQ-MAINTABS-CONTAINER").tabs( "select" , 1 );
}
CrossQueryObject.prototype.ajax_RequestDatasets = function(event) {
	var thisCQ = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_returnDataSets";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	$.post(this.myParent.URL_backend+this.FileName_crossquery, postinfo,						// POST VIA AJAX!
		function(doc){					// IF ajax call is returned do this...
			var JSONdoc = thisCQ.myParent.AJAX__ProcessAnswer(doc);
		}
	);
}	
	
CrossQueryObject.prototype.ajax_CrossQueryAnswerHandler = function(event) {
	var JSONdoc = event.json;
	
	if (JSONdoc.job == "crossquery_returnDataSets") {
		var results = JSONdoc.results;
		$(document).trigger({type:"CQ_PartInitated", part: { name: "DataSets", state: true } });
	} else if (JSONdoc.job == "crossquery_filter") {
		var results = JSONdoc.results;
		var oldcols = G_COLS.toString();
		G_COLS = new Array();
		G_COLS = JSONdoc.colnames;
		var newcolstring=G_COLS.toString();
		if (oldcols != newcolstring) {
			DisplaySetup_create();
		}
		G_RESULTS = new Array();
		jQuery.each(results, function(i,val) {
			G_RESULTS[i] = new Array();
			jQuery.each(G_COLS, function(y,v) {
				G_RESULTS[i][v] = val[y];
			});
		});
		MultiDimensionalArrayToTable(G_RESULTS);
	}
}




			function DisplaySetup_create() {
				$("#columnchecklist").empty();
				jQuery.each(G_COLS, function(i,val) {
					var li = document.createElement("li");
					li.id = val;
					$(li).addClass("ui-widget-content");
					$(li).addClass("ui-selected");
					$(li).bind("click", function(e) {
						if (!$(this).hasClass("ui-selected")) $(this).addClass("ui-selected"); else $(this).removeClass("ui-selected");
					});
					$(li).html(val);
					$("#columnchecklist").append(li);
				});
				$("#columnchecklist").sortable();
			}
			
			function MultiDimensionalArrayToTable_BuildHeader(ColArray) {
				var TableHeader = "<table class='css__ObjectTable' id='resultstable'><thead>";
				var addbutton = true;
				jQuery.each(ColArray, function(x,val) {
					if (addbutton) {
						addbutton = false;
						TableHeader += "<th align='center' id='"+val+"' colname='"+val+"' class='css__ObjectTableHeader' onclick='TABLE__sortby(this.id);'>"+val+"</th>";
					} else {
						TableHeader += "<th align='center' id='"+val+"' colname='"+val+"' class='css__ObjectTableHeader' onclick='TABLE__sortby(this.id);'>"+val+"</th>";
					}
				});
				TableHeader += "</thead>";
				return TableHeader ;
			}
			
			function MultiDimensionalArrayToTable_getVisibleCols(selectablelistID, selectedClass) {
				var jqo = $("#"+selectablelistID);
				var visiblecols = jqo.sortable('toArray');
				for (c=visiblecols.length;c>-1;c--) {
					if (!$("#"+selectablelistID+" > li[id='"+visiblecols[c]+"']").hasClass(selectedClass)) visiblecols.splice(c,1);
				}
				return visiblecols;
			}
			
			
			function MultiDimensionalArrayToTable_colselect(ColArray,VisibleArray,TableID) {
				$("#"+TableID).css("display","none");
					for (x=0;x<ColArray.length;x++) {
						var display = "none";
						for (y=0;y<VisibleArray.length;y++) {
							if (ColArray[x] == VisibleArray[y]) {
								shown = "visible";
								display = "";
								var width = "";
								break;
							}
						}
						$("th[colname='"+ColArray[x]+"']").css("display",display);
						$("td[colname='"+ColArray[x]+"']").css("display",display);
					}
				$("#"+TableID).css("display","block");	
				return true;
			}
			
			function onclick__exportupdate() {
				var csv="";
				var visiblecolumns = MultiDimensionalArrayToTable_getVisibleCols("columnchecklist", "ui-selected");
				var cols = visiblecolumns.length;
				for (x=0;x<cols;x++) {
						var thisline = visiblecolumns[x].replace(/\;/g,"_");
						csv += thisline;
						if (x != cols-1) csv += ";"
					}
					csv += "\r\n";
				for (i=0;i<G_RESULTS.length;i++) {
					
					for (x=0;x<cols;x++) {
						var thisline = G_RESULTS[i][visiblecolumns[x]].replace(/\;/g,"_");
						csv += thisline;
						if (x != cols-1) csv += ";"
					}
					csv += "\r\n";
				}
				csv = csv.replace(/::br::/g,",");  //cleaning up some table formatting we did earlier
				csv = csv.replace(/,;/g,";"); //cleaning up some mess the earlier cleanup produced ;)
				$("#exporttext").val(csv);
			}
			
			function onclick__colchoice() {
				if (G_COLS==undefined || G_COLS.length<1) {
					alert("sorry, but you have to run a query first!");
					$("#xQ-MAINTABS-CONTAINER").tabs( "select" , 0 );
				}
				$("#display_setup_dialog").dialog('open');
			}
			
			function onclick_displayupdate(e) {
				var visiblecolumns = MultiDimensionalArrayToTable_getVisibleCols("columnchecklist", "ui-selected");
				MultiDimensionalArrayToTable_colselect(G_COLS, visiblecolumns,"resultstable");
				return true;
			}
			
			function onclick__exportTR(e,key) {
				var csv="";
				var visiblecolumns = MultiDimensionalArrayToTable_getVisibleCols("columnchecklist", "ui-selected");
				var cols = visiblecolumns.length;
				for (x=0;x<cols;x++) {
					csv += G_RESULTS[key][visiblecolumns[x]];
					if (x != cols-1) csv += ";"
				}
				csv += "\r\n";
				csv = csv.replace(/::br::/g,",");  //cleaning up some table formatting we did earlier
				csv = csv.replace(/,;/g,";"); //cleaning up some mess the earlier cleanup produced ;)
				var thusfar = $("#exporttext").val();
				$("#exporttext").val(thusfar+csv);
				return false;
			}
			
			function MultiDimensionalArrayToTable(mudiar) {
				if (mudiar.length<1) {
					$("#resultstable").empty();
					alert("sorry, but there were no hits!");
					return false;
				}
				var TableHeader = MultiDimensionalArrayToTable_BuildHeader(G_COLS);
				$("#TableDiv").remove();
				var TableData = "";
				global__gotermdefinitions = new Array();
				var rowchange = true;
				var trclass = "";
				var rows = mudiar.length
				var cols = G_COLS.length;
				for (y=0;y<rows;y++) {
					var inthisTR = "";
					for (z=0;z<cols;z++) {
						var aTDdata = mudiar[y][G_COLS[z]];
						var aTD = "";
						if (G_COLS[z] == "got") {
							var spanA = "<span id='gospan@godef@' onclick='event__goonclick(@godef@);event.preventDefault();event.stopPropagation();' onmouseover='event__gotermhover(event,@godef@);' onmousemove='event__gotermhover(event,@godef@);' onmouseout='event__gotermhover(event,-1);' class='go_term_span'>";
							var spanB = "</span>";
							var pattern = /GO:[0-9]{7} .+?::/g; 
							var goarray = aTDdata.match(pattern);
							aTD += "<td colname='"+G_COLS[z]+"' align='left' onmouseout='event__gotermhover(event,-1);'>";
							if (goarray != undefined && goarray.length>0) {
								var rot = 0;
								$.each(goarray, function(key,goterm) {
									rot++;
									var goid=goterm.substr(0,10);
									var godef=goterm.substr(0,goterm.length-2);
									global__gotermdefinitions.push(godef);
									aTD += (spanA.replace(/@godef@/g,global__gotermdefinitions.length-1) + goid + spanB);
									if (rot < 3 && key < goarray.length-1) {
										aTD += ",";
									} else if (rot == 3 && key < goarray.length-1) {
										aTD += " ";
										rot = 0;
									}
								});
							}
							aTD += "</td>";
						} else {
							var add="";
							if (z==0) add = '<img title="ADD this row to export data" id="button__exportTR" class="imgbutton" onclick="onclick__exportTR(event,'+y+');event.preventDefault();event.stopPropagation();" src="./img/export.png"></img>';
							aTD = '<td colname="'+G_COLS[z]+'" align="left">'+add+aTDdata+'</td>';
						}
						inthisTR += aTD;
					}
					rowchange = !rowchange;
					if (rowchange) trclass="tr_dark"; else trclass="tr_light";
					TableData += "<tr class='"+trclass+"' gid='"+mudiar[y][G_FieldID4Link]+"' onclick='LINK__open(this);'>"+inthisTR+"</tr>";
				}
				TableData += "</table>";
				var TableDiv = document.createElement("div");
				TableDiv.id = "TableDiv";
				$("#xQ-MAINTABS-TABCONTENT-RESULT").append(TableDiv);
				$(TableDiv).html(TableHeader+TableData);
				onclick_displayupdate();
			}
			
			
			function event__gotermhover(e,idx) {
				if (idx==-1) {
					$("#tooltip").html("");
					$("#tooltip").css("display","none");
				} else {
					$("#tooltip").html(global__gotermdefinitions[idx]);
					$("#tooltip").css("display","block");
					$("#tooltip").css("left",e.clientX+window.scrollX-200);
					$("#tooltip").css("top",e.clientY+window.scrollY-40);
				}
			}
			
			function event__goonclick(idx) {
				if (idx>-1) {
					var goid = global__gotermdefinitions[idx].substr(0,10);
					window.open("http://amigo.geneontology.org/cgi-bin/amigo/term-details.cgi?term="+goid,"_blank");
				}
				return false;
			}
			
			function LINK__open(trobj) {
				var gid = $(trobj).attr("gid");
				var URL = G_LinkURL+gid;
				window.open(URL,"_blank");
			}
