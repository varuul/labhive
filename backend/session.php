<?php
	function Session__FixABrowser($bid) {
		global $dbNOW;
		$_SESSION[$bid] = array();
		$_SESSION[$bid]["REPLY"] = array();
		$_SESSION[$bid]["FirstContact"] = $dbNOW;
		$_SESSION[$bid]["LastChangesCheck"] = "0000-00-00 00:00:00";
		
		$_SESSION[$bid]["IP"] = $_SERVER["REMOTE_ADDR"];
		$_SESSION[$bid]["REFERER"] = $_SERVER["HTTP_REFERER"];
		$_SESSION[$bid]["myRoot"] = $_SERVER["SERVER_NAME"];
		
		$_SESSION[$bid]["REPLY"]["SessionCalls"] = 0;
		return true;
	}
	
	function Session__FindInDB($SessionID) {
		GLOBAL $bid;
		if (!isset($SessionID) OR $SessionID == "") $SessionID = session_id();
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_sessionid/" => $SessionID
		);
		$myQuery = DB_QueryReplace($_QU["get_userid_by_session"], $RepArray);
		$Res = mysql_query($myQuery);	
		$RowCount = mysql_num_rows($Res);
		if ($RowCount == 1) {
			$row = mysql_fetch_array($Res, MYSQL_ASSOC);
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "session found in DB");
			return $row[$_CFG["sessiontable_fields"]["user_id"]];
		} else if ($RowCount == 0) {
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "no session in DB");
			return false;
		} else {
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "DB session check failed");
			// should not happen
			return false;
		}
	} 
	
	function Session__SaveToDB() {
		GLOBAL $bid;
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_userid/" => $_SESSION[$bid]["user_id"],
			"/@@_V_now/" => $_SESSION[$bid]["now"],
			"/@@_V_userIP/" => $_SESSION[$bid]["IP"]
		);
		$myQuery = DB_QueryReplace($_QU["add_session_by_userid"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == true) {
			return mysql_insert_id();
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "session saved to db");
		} else {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "session could not be saved to db");
			return false;
		}  
	}
	
	function Session__RemoveFromDB($SessionID = "") {
		GLOBAL $bid;
		if (!isset($SessionID) OR $SessionID == "") $SessionID = session_id();
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_SessId/" => $SessionID
		);
		$myQuery = DB_QueryReplace($_QU["delete_session_by_sessionID"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == true) {
			array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "session deleted from db");
		} else {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "session could not be deleted from db");
		}
		return $Res;
	}
?>