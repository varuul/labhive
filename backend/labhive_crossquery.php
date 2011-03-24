<?php
	require_once("bootstrap.php");
	
	$myUser = $_SESSION[$bid]["userinfo"];
	
	$Session = Session__FindInDB(session_id());
	if ($Session == false) {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
		Quit();
	} else {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
	}
	
	CQ_DBTableInfos__add();
	CQ_DBQueries__add();
	$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
	
	if ($job == "crossquery_filter") {
		$answer = CQ_filter();
		$_SESSION[$bid]["REPLY"]["results"] = $answer["results"];
		$_SESSION[$bid]["REPLY"]["colnames"] = $answer["colnames"];
		$_SESSION[$bid]["REPLY"]["maxresults"] = $answer["maxresults"];
		$_SESSION[$bid]["REPLY"]["totalrows"] = $answer["totalrows"];
		
		$_SESSION[$bid]["REPLY"]["query"] = $answer["query"];
		$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "ran the filter query");
	} else if ($job == "crossquery_returnDataSets") {
		$tomes = CQ_returnDataSets();
		$_SESSION[$bid]["REPLY"]["results"] = $tomes;
		$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "identified available datasets");
	} else if ($job == "crossquery_getSavedQueries") {
		if (!isset($myUser["user_id"])) Quit();
		$uid = $myUser["user_id"];
		$queries = CQ_getSavedQueriesByUserId($uid);
		$_SESSION[$bid]["REPLY"]["results"] = $queries;
		$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "returned saved queries");
	} else if ($job == "crossquery_saveQuery") {
		if (!isset($myUser["user_id"])) Quit();
		$uid = $myUser["user_id"];
		$data = array( 
			"filter"=>$_POST["filter"],
			"sorter"=>$_POST["sorter"],
			"orientation"=>$_POST["orientation"],
			"limit"=>$_POST["limit"],
			"name"=>$_POST["name"],
			"dataset_id"=>$_POST["dataset_id"],
			
		);
		$res1 = CQ_setSavedQueriesByUserId($uid,$data);
		if ($res1 == true) {
			$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "saved query");
		} else {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "save query failed");
		}
		$queries = CQ_getSavedQueriesByUserId($uid);
		$_SESSION[$bid]["REPLY"]["results"] = $queries;
		
	} else if ($job == "crossquery_savedQuery_delete") {
		if (!isset($myUser["user_id"])) Quit();
		$uid = $myUser["user_id"];
		$QIndex = $_POST["Qindex"];
		$res1 = CQ_deleteSavedQueriesByUserIdAndQueryId($uid,$QIndex);
		if ($res1 == true) {
			$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "deleted query");
		} else {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "delete query failed");
		}
		$queries = CQ_getSavedQueriesByUserId($uid);
		$_SESSION[$bid]["REPLY"]["results"] = $queries;
	}
	
	
	Quit();
	
// ######################################################################


	function CQ_DBTableInfos__add() {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		if (!isset($_SESSION["CFG"]["tables"])) $_SESSION["CFG"]["tables"] = array();
		if (!isset($_SESSION["CFG"]["tables"]["dataset_list"])) $_SESSION["CFG"]["tables"]["dataset_list"] = array();
		
		$_SESSION["CFG"]["tables"]["saved_queries"] = "cq_saved_queries";
		$_SESSION["CFG"]["tables"]["cq_saved_queries"] = array(
			"table_fields" => array(
				//variable-key => db_column-id
				"query_index" => "query_index",
				"query_filter" => "query_filter",
				"query_sorter" => "query_sorter",
				"query_orientation" => "query_orientation",
				"query_limit" => "query_limit",
				"query_name" => "query_name",
				"query_owner_id" => "query_owner_id",
				"query_dataset_id" => "query_dataset_id"				
			),
			"answer_fields" => array(
				//variable-key => db_column-id
				"query_index", 
				"query_filter", 
				"query_sorter", 
				"query_orientation",
				"query_limit",
				"query_name",
				"query_dataset_id"				
			)
		);
		$_SESSION["CFG"]["tables"]["dataset_list"] = "cq_datasets";
		$_SESSION["CFG"]["tables"]["cq_datasets"] = array(
			"table_fields" => array(
				//variable-key => db_column-id
				"tome_id" => "tome_id",
				"tome_name" => "tome_name",
				"tome_shortcut" => "tome_shortcut",
				"tome_species" => "tome_species",
				"tome_tablename" => "tome_tablename",
				"tome_description" => "tome_description",
				"tome_id_link" => "tome_id_link"
			),
			"answer_fields" => array(
				//variable-key => db_column-id
				"tome_id", 
				"tome_name", 
				"tome_species", 
				"tome_tablename",
				"tome_description",
				"tome_id_link" 
			)
		);
		
		$_SESSION["CFG"]["tables"]["dataset_cols"] = "cq_datasets_cols";
		$_SESSION["CFG"]["tables"]["cq_datasets_cols"] = array(
			"table_fields" => array(
				//variable-key => db_column-id
				"field_index" => "field_index",
				"field_name" => "col_name",
				"field_type" => "field_type",
				"field_desc" => "field_desc",
				"dataset_id" => "dataset_id"
			),
			"answer_fields" => array(
				//variable-key => db_column-id
				"field_index",
				"field_name", 
				"field_type", 
				"field_desc",
				"dataset_id"
			)
		);
		
	}

	function CQ_DBQueries__add() {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		// no replacements here
		$answerFields = implode(",",$_CFG["tables"][$_CFG["tables"]["dataset_list"]]["answer_fields"]);
		$_SESSION["QUERIES"]["CQ_get_available_transcriptomes"] = 'SELECT '.$answerFields.' FROM '.$_CFG["tables"]["dataset_list"].';';
		$answerFields2 = implode(",",$_CFG["tables"][$_CFG["tables"]["dataset_cols"]]["answer_fields"]);
		$_SESSION["QUERIES"]["CQ_get_available_transcriptome_fields"] = 'SELECT '.$answerFields2.' FROM '.$_CFG["tables"]["dataset_cols"].';';
		// reading and saving queries ...
		$answerFields3 = implode(",",$_CFG["tables"][$_CFG["tables"]["saved_queries"]]["answer_fields"]);
		// @@_V_query_owner_id
		$_SESSION["QUERIES"]["CQ_get_saved_queries"] = 'SELECT '.$answerFields3.' FROM '.$_CFG["tables"]["saved_queries"].' WHERE '.$_CFG["tables"][$_CFG["tables"]["saved_queries"]]["table_fields"]["query_owner_id"].'="@@_V_query_owner_id";';
		$writefields = "query_filter,query_sorter,query_orientation,query_limit,query_name,query_owner_id,query_dataset_id";
		// @@_V_query_filter,@@_V_query_sorter,@@_V_query_orientation,@@_V_query_limit,@@_V_query_name,@@_V_query_owner_id,@@_V_query_dataset_id
		$_SESSION["QUERIES"]["CQ_put_saved_query"] = 'INSERT into '.$_CFG["tables"]["saved_queries"].' ('.$writefields.') VALUES("@@_V_query_filter","@@_V_query_sorter","@@_V_query_orientation","@@_V_query_limit","@@_V_query_name","@@_V_query_owner_id","@@_V_query_dataset_id");';
		// @@_V_query_index,@@_V_query_owner_id
		$_SESSION["QUERIES"]["CQ_delete_saved_query"] = 'DELETE from '.$_CFG["tables"]["saved_queries"].' WHERE '.$_CFG["tables"][$_CFG["tables"]["saved_queries"]]["table_fields"]["query_index"].'=@@_V_query_index AND '.$_CFG["tables"][$_CFG["tables"]["saved_queries"]]["table_fields"]["query_owner_id"].'=@@_V_query_owner_id;';
		
	}
/*

###############################################################  FUNCTIONS ################################################

*/

	function CQ_getSavedQueriesByUserId($uid) {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		// @@_V_query_owner_id
		$RepArray = array(
			"/@@_V_query_owner_id/" => $uid
		);
		$myQuery = DB_QueryReplace($_QU["CQ_get_saved_queries"], $RepArray);
		$Res = mysql_query($myQuery);	
		$queries = array();
		while ($row = mysql_fetch_array($Res, MYSQL_ASSOC)) {
			array_push($queries, $row);
		}	
		return $queries;
	}

	function CQ_setSavedQueriesByUserId($uid,$data) {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		// @@_V_query_owner_id
		$RepArray = array(
			"/@@_V_query_owner_id/" => $uid,
			"/@@_V_query_filter/" => $data["filter"],
			"/@@_V_query_sorter/" => $data["sorter"],
			"/@@_V_query_orientation/" => $data["orientation"],
			"/@@_V_query_limit/" => $data["limit"],
			"/@@_V_query_name/" => $data["name"],
			"/@@_V_query_dataset_id/" => $data["dataset_id"]
		);
		$myQuery = DB_QueryReplace($_QU["CQ_put_saved_query"], $RepArray);
		$Res = mysql_query($myQuery);	
		return $Res;
	}

	function CQ_deleteSavedQueriesByUserIdAndQueryId($uid,$QIndex) {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		// @@_V_query_owner_id
		$RepArray = array(
			"/@@_V_query_owner_id/" => $uid,
			"/@@_V_query_index/" => $QIndex
		);
		$myQuery = DB_QueryReplace($_QU["CQ_delete_saved_query"], $RepArray);
		$Res = mysql_query($myQuery);	
		return $Res;
	}

	function CQ_returnDatasets() {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$myQuery = $_QU["CQ_get_available_transcriptomes"];
		$Res = mysql_query($myQuery);	
		if ($Res == false) return false;
		$RowCount = mysql_num_rows($Res);
		if ($RowCount > 0) {
			$tomes = array();
			while ($row = mysql_fetch_array($Res, MYSQL_ASSOC)) {
				$tomes[$row["tome_id"]] = $row;
			}
		} else if ($RowCount == 0) {
			return false;
		} else {
			// should not happen
			return false;
		}
		$myQuery = $_QU["CQ_get_available_transcriptome_fields"];
		$Res = mysql_query($myQuery);	
		if ($Res == false) return false;
		$RowCount = mysql_num_rows($Res);
		if ($RowCount > 0) {
			$data_fields = array();
			while ($row = mysql_fetch_array($Res, MYSQL_ASSOC)) {
				array_push($data_fields, $row);
			}
		} else if ($RowCount == 0) {
			return false;
		} else {
			// should not happen
			return false;
		}
		foreach ($tomes as $key=>$obj) {
			$tomes[$key]["fields"] = array();
			for ($y=0;$y<count($data_fields);$y++) {
				if ($tomes[$key]["tome_id"] == $data_fields[$y]["dataset_id"]) {
					array_push($tomes[$key]["fields"], $data_fields[$y]);
				}
			}
		}
		$_SESSION["TOMES"] = $tomes;

		return $tomes;
	}
	
	function CQ_filter() {
		$inLimit = $_POST["l"];
		// this is just for really basic safety...
		$inLimit = str_ireplace("insert", "badfilter", $inLimit);
		$inLimit = str_ireplace("delete", "badfilter", $inLimit);
		$inLimit = str_ireplace("select", "badfilter", $inLimit);
		$limit = BuildLimit($inLimit);
		
		$inSort = $_POST["s"];
		/*
		foreach($FRONTEND2DB as $key=>$val) {
			$inSort = str_replace($key, $val, $inSort);
		}
		*/
		$columns = "";
		$fields = $_SESSION["TOMES"][$_POST["ds"]]["fields"];
		foreach($fields as $key=>$value) {
			$columns.=$value["field_name"].",";
		}
		$columns .= "(".$inSort.") as SORTER";
		$inDir = $_POST["o"];
		// this is just for really basic safety...
		$inDir = str_ireplace("insert", "badfilter", $inDir);
		$inDir = str_ireplace("delete", "badfilter", $inDir);
		$inDir = str_ireplace("select", "badfilter", $inDir);
		$inSort = str_ireplace("insert", "badfilter", $inSort);
		$inSort = str_ireplace("delete", "badfilter", $inSort);
		$inSort = str_ireplace("select", "badfilter", $inSort);
		$sort = BuildSort($inSort,$inDir);

		
		$inFilter = $_POST["f"];			
		// this is just for really basic safety...
		$inFilter = str_ireplace("insert", "badfilter", $inFilter);
		$inFilter = str_ireplace("delete", "badfilter", $inFilter);
		$inFilter = str_ireplace("select", "badfilter", $inFilter);
		// this makes sure that all the short frontend column names are translated
		
		/*
		foreach($FRONTEND2DB as $key=>$val) {
			$inFilter = str_replace($key, $val, $inFilter);
		}
		*/
		$tablename = $_SESSION["TOMES"][$_POST["ds"]]["tome_tablename"];
		$query = BuildQuery($columns,$tablename,$inFilter);
		
		$answer["results"] = RunQuery($query,$sort, $limit);
		$answer["maxresults"] = RunCountQuery($tablename,$inFilter);
		$answer["totalrows"] = RunCountTablerows($tablename);
		$colarray = $columns;
		/*
		foreach($DB2FRONTEND as $key=>$val) {
			$colarray = str_replace($key, $val, $colarray);
		}
		*/
		$answer["colnames"] = explode(",",$colarray);
		
		$answer["query"] = $query.$sort.$limit;
		
		return $answer;
	}
	
	function BuildQuery($columns,$tablename,$inFilter) {
		$q = "SELECT ".$columns." FROM ".$tablename." WHERE ".$inFilter. " ";
		return $q;
	}
	
	
	
	function BuildSort($inSort, $inDir) {
		if (!isset($inDir)) $orient="DESC"; else $orient = strtoupper($inDir);
		if ($orient != "ASC" && $orient != "DESC") $orient = "DESC";
		if (!isset($inSort)) return ""; else $sorter = $inSort;
		$ret = " ORDER BY " . $inSort . " " . $orient;
		return $ret;
	}
	
	
	
	function BuildLimit($inLimit) {
		if ($inLimit=="" || $inLimit == 0 || isset($inLimit)==false) $inLimit="100";
		$ret = " LIMIT ".$inLimit;
		return $ret;
	}
	
	
	
	function RunQuery($query,$sort,$limit) {
		$fq = $query.$sort.$limit;
		$rows = array();
		$result = mysql_query($fq);
		if ($result==false) return $rows;
		$found = mysql_num_rows($result);
		if ($found > 0) {
			$count=0;
			while ($tmp = mysql_fetch_array($result)) {
				$rows[$count] = array();
				foreach ($tmp as $key => $value) {
					$rows[$count][$key] = $value;
				}
				$count++;
			}
		} else {
			$rows = array();
		}
		return $rows;
	}

	
	
	function RunCountQuery($tablename, $where) {
		$counter = "SELECT count(*) FROM ".$tablename." WHERE ".$where.";";
		$res = mysql_query($counter);
		if ($res == false) return 0;
		//$ret = mysql_result($res);
		$retA = mysql_fetch_row($res);
		if (isset($retA[0])) {
			$ret=(int)$retA[0];
			return $ret;
		}
		return 0;
	}
	
	function RunCountTablerows($tablename) {
		$counter = "SELECT count(*) FROM ".$tablename.";";
		$res = mysql_query($counter);
		if ($res == false) return 0;
		//$ret = mysql_result($res);
		$retA = mysql_fetch_row($res);
		if (isset($retA[0])) {
			$ret=(int)$retA[0];
			return $ret;
		}
		return 0;
	}

	
?>