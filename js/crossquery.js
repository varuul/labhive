// CrossQuery Plugin for LabHive depends on 
// BROWSER plugins ,
//  the general LabHive FrameWork as well as
// jQuery and its plugins jGritter, jQuery-UI, jQ-Plot, excanvas, md5


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
	this.savedQueries = new Array();
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
		"SavedQueryPanel" : {
			state: false
		}
		
	}
	this.GraphDrawButtonSelector = "#cq_graphs_button__draw";
	this.LinkURLs = new Array();
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
	$(document).bind("UserChange", function(e) {
			thisCQ.ajax_RequestDatasets();
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
				$("#cq_input__dataset_selection").unbind("change");
				$("#cq_input__dataset_selection").bind("change", function(e) {
					$("#cq_input__datafields_container").empty();
					$("#cq_input__textfields_container").empty();
					$("#cq_input__idfields_container").empty();
					var current= $(this).val();
					if (typeof myCrossQuery.datasets[current] != "undefined") {
						for (var key in myCrossQuery.datasets[current].fields) {
							var aField = document.createElement("button");
							aField.id = "field_selector__"+myCrossQuery.datasets[current].fields[key].field_name;
							$(aField).html(myCrossQuery.datasets[current].fields[key].field_name);
							$(aField).attr("data",myCrossQuery.datasets[current].fields[key].field_name);
							
							$(aField).addClass("cq_fieldselectors");
							$(aField).bind("click",function(e) {
								var bla = $("#cq_input__filter_code").val();
								bla += $(this).attr("data");
								$("#cq_input__filter_code").val(bla);
							});
							
							if (myCrossQuery.datasets[current].fields[key].field_type == "DATA") {
								$("#cq_input__datafields_container").append(aField);
							} else if (myCrossQuery.datasets[current].fields[key].field_type == "TEXT") {
								$("#cq_input__textfields_container").append(aField);
							} else if (myCrossQuery.datasets[current].fields[key].field_type == "ID") {
								$("#cq_input__idfields_container").append(aField);
							}
						}
					}
					$(".cq_fieldselectors").button();
				});
				$("#cq_input__dataset_selection").trigger("change");
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
	loadHTML(thisCQ.myParent.URL_html+"crossquery__savedquerylist.html",function(html_ID) {
		var myhtml = (HTMLcontainer[html_ID].data);
		var myDialogID = Dialog_build(localized_text[thisCQ.myParent.language]["CROSSQUERY_SAVEDDQUERYPANEL__HeaderText"],myhtml);
		thisCQ.CQ_SavedQueryPanel = $("#"+myDialogID);
		$(thisCQ.CQ_SavedQueryPanel).dialog({autoOpen:false, width:"auto", resizable: true, modal: true});
		$(document).trigger({type:"CQ_PartInitated", part: { name: "SavedQueryPanel", state: true } });
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
	this.plot__ButtonUpdate();
	this.ajax_RequestDatasets();
}

CrossQueryObject.prototype.plot__ButtonUpdate = function() {
	var thisCQ = this;
	$(thisCQ.GraphDrawButtonSelector).unbind("click");
	if (typeof thisCQ.data_columns == "undefined" || ObjectSize(thisCQ.data_columns) < 2) {
		$(thisCQ.GraphDrawButtonSelector).bind("click",function(e) {
			var DialogId = Dialog_build(localized_text[myBrowser.language]['CROSSQUERYDIALOG__Plotting__NoDataTitle'],localized_text[myBrowser.language]['CROSSQUERYDIALOG__Plotting__NoDataText']);
			$("#"+DialogId).dialog({autoOpen: true, modal:true});
		});
	} else {
		$(thisCQ.GraphDrawButtonSelector).bind("click",thisCQ.plot_filtered);
	}
	
}

CrossQueryObject.prototype.addLocalizedTexts = function() {
	localized_text["en"]["CROSSQUERYDIALOG__HeaderText"] = "CrossQuery v0.9beta";
	localized_text["en"]["BUTTON_TEXT__CrossQuery"] = "CrossQuery";
	localized_text["en"]["CROSSQUERYDIALOG__Plotting__NoDataTitle"] = "nothing to plot";
	localized_text["en"]["CROSSQUERYDIALOG__Plotting__NoDataText"] = "You have to have results before you can plot something!!";
	localized_text["en"]["CROSSQUERY_SAVEDDQUERYPANEL__HeaderText"] = "Available Saved Queries";
	localized_text["en"]["CROSSQUERYDIALOG__SAVEDQUERYPANEL__DeleteButtonLabel"] = "x";
	localized_text["en"]["CROSSQUERYDIALOG__SAVEDQUERYPANEL__UseButtonLabel"] = "use -> ";
	localized_text["en"]["CROSSQUERYDIALOG__SavedQuery__Title"] = "Successfully";
	localized_text["en"]["CROSSQUERYDIALOG__SavedQuery__Text"] = "saved your query to the database.";
	localized_text["en"]["CROSSQUERYDIALOG__SaveQuery_BADCODE__Title"] = "ERROR";
	localized_text["en"]["CROSSQUERYDIALOG__SaveQuery_BADCODE__Text"] = "your code can not contain the words DELETE,INSERT,SELECT,UPDATE.";
	localized_text["en"]["CROSSQUERYDIALOG__SaveQuery_DUPENAME__Title"] = "ERROR";
	localized_text["en"]["CROSSQUERYDIALOG__SaveQuery_DUPENAME__Text"] = "you already have a query saved with this name. to update it delete it first, then save!";
	
}
CrossQueryObject.prototype.ajax_responseHandler = function(event) {
	if (typeof event.json.job == "string" && event.json.job.substr(0,10) == "crossquery") {
		$(document).trigger({ type:"CrossQueryAnswer", json: event.json });
	}
}

CrossQueryObject.prototype.loadQuery = function() {
	var thisCQ = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_getSavedQueries";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	$.post(this.myParent.URL_backend+this.FileName_crossquery, postinfo,						// POST VIA AJAX!
		function(doc){					// IF ajax call is returned do this...
			var JSONdoc = thisCQ.myParent.AJAX__ProcessAnswer(doc);
		}
	);
}

CrossQueryObject.prototype.savedQuery__delete = function(Qindex) {
	var thisCQ = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_savedQuery_delete";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.Qindex = Qindex;
	$.post(this.myParent.URL_backend+this.FileName_crossquery, postinfo,						// POST VIA AJAX!
		function(doc){					// IF ajax call is returned do this...
			var JSONdoc = thisCQ.myParent.AJAX__ProcessAnswer(doc);
		}
	);
}

CrossQueryObject.prototype.savedQuery__use = function(Qindex) {
	$("#cq_input__filter_code").val(this.savedQueries[Qindex]["query_filter"]);
	$("#cq_input__result_limit").val(this.savedQueries[Qindex]["query_limit"]);	
	$("#cq_input__sort_code").val(this.savedQueries[Qindex]["query_sorter"]);	
	$("#cq_input__sort_orientation").val(this.savedQueries[Qindex]["query_orientation"]);
	$("#cq_input__query_name").val(this.savedQueries[Qindex]["query_name"]);
	$("#cq_input__dataset_selection").val(this.savedQueries[Qindex]["query_dataset_id"]);
}


CrossQueryObject.prototype.saveQuery = function(event) {
	var thisCQ = this;
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_saveQuery";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.filter = $("#cq_input__filter_code").val();
	postinfo.limit = $("#cq_input__result_limit").val();	
	postinfo.sorter = $("#cq_input__sort_code").val();	
	postinfo.orientation = $("#cq_input__sort_orientation").val();
	postinfo.name = $("#cq_input__query_name").val();
	postinfo.dataset_id = $("#cq_input__dataset_selection").val();
	
	if (postinfo.filter.search(/select/i)>-1 || postinfo.filter.search(/delete/i)>-1 || postinfo.filter.search(/insert/i)>-1 ||
		postinfo.limit.search(/select/i)>-1 || postinfo.limit.search(/delete/i)>-1 || postinfo.limit.search(/insert/i)>-1 ||
		postinfo.orientation.search(/select/i)>-1 || postinfo.orientation.search(/delete/i)>-1 || postinfo.orientation.search(/insert/i)>-1 ||
		postinfo.sorter.search(/select/i)>-1 || postinfo.sorter.search(/delete/i)>-1 || postinfo.sorter.search(/insert/i)>-1 
	) {
		var Img = thisCQ.myParent.myTemplate.Images.Fail;
		$.gritter.add({
			title: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SaveQuery_BADCODE__Title'],
			text: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SaveQuery_BADCODE__Text'],
			image: Img,
			sticky: false, 
			time: 4000
		});
		
		return false;
	}
	
	if (jQuery.grep(thisCQ.savedQueries, function (qu) { return qu.query_name == postinfo.name; }).length != 0) {
		var Img = thisCQ.myParent.myTemplate.Images.Fail;
		$.gritter.add({
			title: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SaveQuery_DUPENAME__Title'],
			text: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SaveQuery_DUPENAME__Text'],
			image: Img,
			sticky: false, 
			time: 4000
		});
		return false;
	}
	
	$("#cq_button__save").fadeOut("fast");
	$.post(this.myParent.URL_backend+this.FileName_crossquery, postinfo,						// POST VIA AJAX!
		function(doc){					// IF ajax call is returned do this...
			var JSONdoc = thisCQ.myParent.AJAX__ProcessAnswer(doc);
		}
	);
}

CrossQueryObject.prototype.runQuery = function(event) {
	var thisCQ = this;
	var filtered = $("#cq_input__filter_code").val();
	filtered = filtered.replace(/find/g, "LOCATE");
	//filtered = filtered.replace(/gid/gi, "ensembl_id");
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "crossquery_filter";
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.ds = $("#cq_input__dataset_selection").val();
	postinfo.f = filtered;	
	postinfo.l = $("#cq_input__result_limit").val();	
	postinfo.s = $("#cq_input__sort_code").val();	
	postinfo.o = $("#cq_input__sort_orientation").val();
	if (postinfo.f.search(/select/i)>-1 || postinfo.f.search(/delete/i)>-1 || postinfo.f.search(/insert/i)>-1 ||
		postinfo.l.search(/select/i)>-1 || postinfo.l.search(/delete/i)>-1 || postinfo.l.search(/insert/i)>-1 ||
		postinfo.o.search(/select/i)>-1 || postinfo.o.search(/delete/i)>-1 || postinfo.o.search(/insert/i)>-1 ||
		postinfo.s.search(/select/i)>-1 || postinfo.s.search(/delete/i)>-1 || postinfo.s.search(/insert/i)>-1 
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
			thisCQ.loadQuery();
		}
	);
}	

CrossQueryObject.prototype.stats_generate = function(data) {
	var result_count = data.maxresults+"/"+data.totalrows;
	$("#cq_rows_filtered").html(result_count);
}

CrossQueryObject.prototype.ajax_CrossQueryAnswerHandler = function(event) {
	var thisCQ = myCrossQuery;
	var JSONdoc = event.json;
	if (JSONdoc.job == "crossquery_returnDataSets") {
		if (typeof JSONdoc.results == "undefined") return false;
		var results = JSONdoc.results;
		$("#cq_input__dataset_selection").empty();
		thisCQ.datasets = new Array();
		jQuery.each(results, function(key, object) {
			thisCQ.datasets[object.tome_name] = object;
			var aDataset = document.createElement("option");
			$(aDataset).attr("ds_id", "cq_dataset_"+object.tome_id);
			$(aDataset).attr("id", object.tome_id);
			$(aDataset).html(object.tome_name);
			$(aDataset).val(object.tome_id);
			thisCQ.LinkURLs[object.tome_name] = object.tome_id_link;
			for (var i=0;i< object.fields.length;i++) {
				if (object.fields[i].field_type == "ID") {
					thisCQ.datasets[object.tome_name]["IDField"] = i;
					break; 
				}
			}
			$("#cq_input__dataset_selection").append(aDataset);
		});
		
		$(document).trigger({type:"CQ_PartInitated", part: { name: "DataSets", state: true } });
	} else if (JSONdoc.job == "crossquery_filter") {
		var results = JSONdoc.results;
		thisCQ.filter_results = results;
		thisCQ.stats_generate(JSONdoc);
		if (typeof G_COLS == "undefined") var oldcols = ""; else G_COLS.toString();
		G_COLS = new Array();
		G_COLS = JSONdoc.colnames;
		var newcolstring=G_COLS.toString();
		if (oldcols != newcolstring) {
			DisplaySetup_create();
		}
		G_RESULTS = new Array();
		thisCQ.data_columns = new Array();
		jQuery.each(results, function(i,val) {
			G_RESULTS[i] = new Array();
			jQuery.each(G_COLS, function(y,v) {
				G_RESULTS[i][v] = val[y];
				if (typeof thisCQ.data_columns[v] == "undefined") {
					thisCQ.data_columns[v] = new Array();
				}
				thisCQ.data_columns[v].push(val[y]);
			});
		});
		MultiDimensionalArrayToTable(G_RESULTS);
		thisCQ.plots = new Array();
		$("#cq_chart_container").empty();
		thisCQ.plot_linecheckboxes_add();
		thisCQ.plot_filtered();
	} else if (JSONdoc.job == "crossquery_getSavedQueries") {
		thisCQ.savedQueries = JSONdoc.results;
		thisCQ.savedQuery__updatePanel();
	} else if (JSONdoc.job == "crossquery_saveQuery") {
		thisCQ.savedQueries = JSONdoc.results;
		thisCQ.savedQuery__updatePanel();
		var Img = thisCQ.myParent.myTemplate.Images.Success;
		$.gritter.add({
			title: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SavedQuery__Title'],
			text: localized_text[myBrowser.language]['CROSSQUERYDIALOG__SavedQuery__Text'],
			image: Img,
			sticky: false, 
			time: 4000
		});
		$("#cq_button__save").fadeIn("fast");
	} else if (JSONdoc.job == "crossquery_savedQuery_delete") {
		thisCQ.savedQueries = JSONdoc.results;
		thisCQ.savedQuery__updatePanel();
	}
	
	thisCQ.plot__ButtonUpdate();
}

CrossQueryObject.prototype.savedQuery__updatePanel = function() {
	var thisCQ = this;
	$("#cq__savedQueryTable").empty();
	var TableLine = "<tr>";
	TableLine += "<td><button class='cq__savedQueryTable__Button' id='cq__savedQueryTable_TR@@y_button_delete' onclick='myCrossQuery.savedQuery__delete(@@qindex);'>"+localized_text[myBrowser.language]['CROSSQUERYDIALOG__SAVEDQUERYPANEL__DeleteButtonLabel']+"</button></td>";
	TableLine += "<td><button class='cq__savedQueryTable__Button' id='cq__savedQueryTable_TR@@y_button_get' onclick='myCrossQuery.savedQuery__use(@@y);'>"+localized_text[myBrowser.language]['CROSSQUERYDIALOG__SAVEDQUERYPANEL__UseButtonLabel']+" @@name</button></td>";
	TableLine += "</tr>";
	for (var i=0;i<thisCQ.savedQueries.length;i++) {
		var thisLine = TableLine.replace(/@@y/g, i);
		thisLine = thisLine.replace(/@@qindex/g, thisCQ.savedQueries[i].query_index);
		
		thisLine = thisLine.replace(/@@name/g, thisCQ.savedQueries[i].query_name);
		$("#cq__savedQueryTable").append(thisLine);
	}
	$(".cq__savedQueryTable__Button").button();
}

CrossQueryObject.prototype.savedQuery__openPanel = function() {
	var thisCQ = this;
	$(thisCQ.CQ_SavedQueryPanel).dialog("open");
}

CrossQueryObject.prototype.plot_linecheckboxes_add = function() {
	var thisCQ = this;
	var i=0;
	var checks = 0;
	var NonDataCols = new Array();
	var currentDataSetName = $("#cq_input__dataset_selection").val();
	for (var i=0;i< thisCQ.datasets[currentDataSetName].fields.length;i++) {
		if (thisCQ.datasets[currentDataSetName].fields[i].field_type != "DATA") {
			NonDataCols.push(thisCQ.datasets[currentDataSetName].fields[i].field_name);
		}
	}	
	$("#cq__linecheckboxes").empty();
	for (var key in thisCQ.data_columns) {
		if (jQuery.inArray(key, NonDataCols)==-1) {
			var newLineCheck = document.createElement("input");
			$(newLineCheck).attr("type","checkbox");
			$(newLineCheck).addClass("cq__linedraw_checkbox");
			$(newLineCheck).attr("id","cq_plotsetup_checkbox__"+key);
			checks++;
			if (checks<2) $(newLineCheck).attr("checked",true);
			
			$(newLineCheck).val(key);
			$("#cq__linecheckboxes").append(newLineCheck);
			$("#cq__linecheckboxes").append("<label for='cq_plotsetup_checkbox__"+key+"'>"+key+"</label>");
		}	
		i++;
	}
	$(".cq__linedraw_checkbox").button();
}

CrossQueryObject.prototype.plot_filtered = function() {
	var thisCQ = myCrossQuery;
	thisCQ.plot_lines = new Array();
	thisCQ.plotlineids = new Array();
	$(".cq__linedraw_checkbox:checked").each(function(i,obj) { thisCQ.plotlineids.push($(obj).val()); });
	if (thisCQ.plotlineids.length == 0) thisCQ.plotlineids.push($(".cq__linedraw_checkbox").val());
	var DataSet = $("#cq_input__dataset_selection").val();
	var idfield_id = myCrossQuery.datasets[DataSet].IDField;
	var idcolval = myCrossQuery.datasets[DataSet].fields[idfield_id].field_name;
	thisCQ.plot_xLabel = idcolval;
	$.jqplot.config.enablePlugins = true;
	thisCQ.plot_filtered_ticks = new Array();
	if (typeof thisCQ.data_columns[thisCQ.plot_xLabel] == "undefined") return false;
	for (var i=0; i<thisCQ.data_columns[thisCQ.plot_xLabel].length;i++) {
		jQuery.each(thisCQ.plotlineids, function(key, res) {
			//thisCQ.plot_lines[res] = [thisCQ.data_columns[thisCQ.plot_xLabel][i], parseInt(thisCQ.data_columns[res][i])];
			if (typeof thisCQ.plot_lines[key] == "undefined") thisCQ.plot_lines[key] = new Array();
			// numbered lines
			thisCQ.plot_lines[key].push(parseInt(thisCQ.data_columns[res][i]));
			// named lines
			//thisCQ.plot_lines[key][thisCQ.data_columns[thisCQ.plot_xLabel][i]] =parseInt(thisCQ.data_columns[res][i]);
		});
		thisCQ.plot_filtered_ticks.push(thisCQ.data_columns[thisCQ.plot_xLabel][i]);
	}
	thisCQ.plot_filtered_series = new Array();
	for (var key in thisCQ.plot_lines) {
		thisCQ.plot_filtered_series.push({label:thisCQ.plotlineids[key]}); // ,yaxis:'yaxis',xaxis:'xaxis'
	}
	
	thisCQ.plots.filtered = $.jqplot('cq_chart_container', thisCQ.plot_lines, {
		title:'Filtered Results',
		series: thisCQ.plot_filtered_series,
		axes:{
			xaxis:{
				ticks: thisCQ.plot_filtered_ticks,
				renderer:$.jqplot.CategoryAxisRenderer,
				rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer},
				tickOptions:{
					formatString:'', 
					fontSize:'10pt', 
					fontFamily:'Tahoma', 
					angle:-30
				}
			},
			yaxis: { 
				renderer: $.jqplot.LinearAxisRenderer, 
				min: 0,
			}
		},
		highlighter: {
			//formatString: 'hallo %d -'+thisCQ.plot_ticks[7]+'-%s',
			sizeAdjust: 7.5
		},
		cursor:{
			//tooltipLocation:'nw', 
			//showCursorLegend:false, 
			zoom:true
		},
		legend:{
			show: true,
			location: "ne"
		}
		
	});
	thisCQ.plots.filtered.redraw();
	
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
				var DataSet = $("#cq_input__dataset_selection").val();
				for (y=0;y<rows;y++) {
					var inthisTR = "";
					for (z=0;z<cols;z++) {
						var aTDdata = mudiar[y][G_COLS[z]];
						var aTD = "";
						if (G_COLS[z] == "goterms") {
							var spanA = "<span id='gospan@godef@' onclick='event__goonclick(@godef@);event.preventDefault();event.stopPropagation();' onmouseover='event__gotermhover(event,@godef@);' onmousemove='event__gotermhover(event,@godef@);' onmouseout='event__gotermhover(event,-1);' class='go_term_span'>";
							var spanB = "</span>";
							var pattern = /GO:[0-9]{7}.+?::/g; 
							//var pattern = /GO:[0-9]{8}/g; 
							
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
							if (z==0) add = '<img title="ADD this row to export data" id="button__exportTR" class="imgbutton" onclick="onclick__exportTR(event,'+y+');event.preventDefault();event.stopPropagation();" src="./img/crossQuery/export.png"></img>';
							aTD = '<td colname="'+G_COLS[z]+'" align="left">'+add+aTDdata+'</td>';
						}
						inthisTR += aTD;
					}
					rowchange = !rowchange;
					if (rowchange) trclass="tr_dark"; else trclass="tr_light";
					var idfield_id = myCrossQuery.datasets[DataSet].IDField;
					var idcolval = myCrossQuery.datasets[DataSet].fields[idfield_id].field_name;
					TableData += "<tr class='"+trclass+"' link_id='"+mudiar[y][idcolval]+"' onclick='LINK__open(this);'>"+inthisTR+"</tr>";
				}
				TableData += "</table>";
				var TableDiv = document.createElement("div");
				TableDiv.id = "TableDiv";
				$("#xQ-MAINTABS-TABCONTENT-DATA").append(TableDiv);
				$(TableDiv).html(TableHeader+TableData);
				onclick_displayupdate();
			}
			
			
			function event__gotermhover(e,idx) {
				if ($("#cq_tooltip").length == 0) {
					$("body").append('<div class="css__tooltipBaseClass" id="cq_tooltip" style="display:none" onmouseover="$(this).hide();"></div>');
				}
				if (idx==-1) {
					$("#cq_tooltip").html("");
					$("#cq_tooltip").css("display","none");
				} else {
					$("#cq_tooltip").html(global__gotermdefinitions[idx]);
					$("#cq_tooltip").css("display","block");
					$("#cq_tooltip").css("left",e.clientX+window.scrollX-200);
					$("#cq_tooltip").css("top",e.clientY+window.scrollY-40);
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
				var link_id = $(trobj).attr("link_id");
				var DataSet = $("#cq_input__dataset_selection").val();
				var URL = myCrossQuery.LinkURLs[DataSet]+link_id;
				window.open(URL,"_blank");
			}
