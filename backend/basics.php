<?php
	// MYSQL DATABASE STUFF

	function DB_QueryReplace($Query, $ReplaceArray) {
		if (!isset($Query)) return false;
		if (!isset($ReplaceArray) OR count($ReplaceArray) == 0) return $Query;
		$patterns = array();
		$replacements = array();
		foreach ($ReplaceArray as $Patt=>$Rep) {
			array_push($patterns,$Patt);
			array_push($replacements,$Rep);
		}
		$q = preg_replace($patterns, $replacements , $Query);
		return $q;
	}
	function DB_GetDate() {
		$q_timestamp = "SELECT UTC_TIMESTAMP";
		$res = mysql_query($q_timestamp);
		$sqldate = mysql_fetch_row($res);
		$dbNOW = $sqldate[0];
		return $dbNOW;
	}
	function DB_Connect() {
		$_CFG = $_SESSION["CFG"];
		$dblink = mysql_connect ($_CFG["db_server"],$_CFG["db_username"],$_CFG["db_password"]);
		if (!$dblink) return false;
		$db = mysql_select_db ($_CFG["db_name"], $dblink);
		if (!$db) return false;
		return $db;
	}
	
	
	// SAFETY STUFF
	function Security_POSTcheck() {
		if (!isset($_POST["browserID"])) {
			array_push($_SESSION["REPLY"]["ERRORS"], "no browserID");
			return false;
		} else if (strlen($_POST["browserID"])!=12) {
			array_push($_SESSION["REPLY"]["ERRORS"], "wrong browserID");
			return false;
		}
		if (!isset($_POST["job"])) {
			array_push($_SESSION[$_POST["browserID"]]["REPLY"]["ERRORS"], "no job");
			return false;
		} else {
			if (!in_array($_POST["job"], $_SESSION["CFG"]["PossibleJobs"])) { 
				array_push($_SESSION[$_POST["browserID"]]["REPLY"]["ERRORS"], "bad job");
				return false;
			} else {
				$_SESSION[$_POST["browserID"]]["REPLY"]["job"] = $_POST["job"];
			}
		}
		return true;
	}
	
	// CONTROL STUFF
	function Quit() {
		REPLY_JSON();
		exit;
	}
	
	// VIEWS
	
	function REPLY_JSON() {
		$reply = array("ERRORS" => "bad client");
		if (isset($_SESSION[$_POST["browserID"]]) AND isset($_SESSION[$_POST["browserID"]]["REPLY"])) {
			$reply = $_SESSION[$_POST["browserID"]]["REPLY"];
		} else if (isset($_SESSION["REPLY"])){
			$reply = $_SESSION["REPLY"];
		}
		echo json_encode($reply);
		return true;
	}
	
?>