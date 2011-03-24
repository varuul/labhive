<?php
	require_once("bootstrap.php");
	
	$Session = Session__FindInDB(session_id());
	if ($Session == false) {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
	} else {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
	}
	
	
	if ($job == "hello") {
		$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
		if ($Session != false) {
			$_SESSION[$bid]["REPLY"]["userinfo"] = User__GetInfo($Session);
			$_SESSION[$bid]["userinfo"] = $_SESSION[$bid]["REPLY"]["userinfo"];
		}
	}
	
	if ($job == "login") {
		if ($Session == true) {
			array_push($_SESSION["REPLY"]["ERRORS"], "already logged in");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			Quit();
		}
		if (isset($_POST["username"]) AND strlen($_POST["username"]) > 3 AND isset($_POST["password"]) AND strlen($_POST["password"]) > 3) {
			$login = User__checkLogin($_POST["username"], $_POST["password"]);
			if ($login == false) {
				array_push($_SESSION["REPLY"]["ERRORS"], "unknown login/password");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			} else {
				$_SESSION[$bid]["user_id"] = $login;
				$SessionID = Session__SaveToDB();
				$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
				$_SESSION[$bid]["REPLY"]["uid"] = $login;
				$_SESSION[$bid]["REPLY"]["userinfo"] = User__GetInfo($login);
				$_SESSION[$bid]["userinfo"] = $_SESSION[$bid]["REPLY"]["userinfo"];
				$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
			}
		} else {
			array_push($_SESSION["REPLY"]["ERRORS"], "bad login/password");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
		}
	}
	
	if ($job == "logout") {
		if ($Session == false) {
			array_push($_SESSION["REPLY"]["ERRORS"], "not logged in");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
		} else if ($Session == true) {
			$logout = User__logout();
			if ($logout == false) {
				array_push($_SESSION["REPLY"]["ERRORS"], "logout failed");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			} else {
				$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
				array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "logout successful");
				$SessRemove = Session__RemoveFromDB();
				$_SESSION[$bid]["REPLY"]["userinfo"] = User__GetInfo();
				if ($SessRemove) {	
					array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "session removed from db successfully");
					$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
				} else {
					array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "failed to remove session from db");
				}
			}
		} 
	}
	
	if ($job == "username_availability") {
		$res = User__UserNameExists($_POST["untest"]);
		$_SESSION[$bid]["REPLY"]["jobresult"] = !$res;
		$_SESSION[$bid]["REPLY"]["queriedUserName"] = $_POST["untest"];
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "usernamecheck done");
	}
	
	if ($job == "registration") {
		$exists = User__UserNameExists($_POST["unmd5"]);
		if ($exists == false) {
			$result = User__Add($_POST["username"], $_POST["password"]);
			if ($result==true) {
				array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "user added");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
				$uid = User__GetUID($_POST["username"]);
				if ($uid > -1) {
					User__AddInfo($uid,"user_email",$_POST["email"]);
					User__AddInfo($uid,"user_xslevel","1");
					array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "userinfo added");
				
				} else {
					array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "userinfo could not be added");
				
				}
				
			} else {
				array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "user insertion failed at DB level\r\n".$result);
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			}
		} else {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "username already in DB\r\n".$exists);
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
		
		}
	}
	
	Quit();
	
	
	// ######################################################
	
	function User__checkLogin($login, $password) {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_username/" => $login,
			"/@@_V_password/" => $password
		);
		$myQuery = DB_QueryReplace($_QU["get_userid_by_login"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == false) return false;
		$RowCount = mysql_num_rows($Res);
		if ($RowCount == 1) {
			$row = mysql_fetch_array($Res, MYSQL_ASSOC);
			return $row[$_CFG["usertable_fields"]["user_id"]];
		} else if ($RowCount == 0) {
			return false;
		} else {
			// should not happen
			return false;
		}
	}
	
	function User__GetUID($username = "") {
		if ($username == "") return -1;
		GLOBAL $bid;
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_username/" => $username
		);
		$myQuery = DB_QueryReplace($_QU["get_userid_by_username"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == false) {
			return -1;
		}
		$RowCount = mysql_num_rows($Res);
		if ($RowCount!=1) {
			return -1;
		} else {
			$row = mysql_fetch_array($Res, MYSQL_ASSOC);
			return $row[$_CFG["usertable_fields"]["user_id"]];
		}
		
	}

	function User__GetInfo($uid = 0) {
		GLOBAL $bid;
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_userid/" => $uid
		);
		$myQuery = DB_QueryReplace($_QU["get_userInfo_by_userID"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == false) {
			//array_push($_SESSION[$bid]["REPLY"]["ERRORS"], $myQuery);
			return false;
		}
		$RowCount = mysql_num_rows($Res);
		$userinfo = array();
		if ($RowCount>0) {
			while ($row = mysql_fetch_row($Res)) {
				$userinfo[$row[0]] = $row[1];
			}
		}
		$myQuery = DB_QueryReplace($_QU["get_username_by_userid"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == false) {
			//array_push($_SESSION[$bid]["REPLY"]["ERRORS"], $myQuery);
			return false;
		}
		if ($RowCount>0) {
			$row = mysql_fetch_assoc($Res);
			$userinfo[$_CFG["usertable_fields"]["username"]] = $row[$_CFG["usertable_fields"]["username"]];
		}
		$userinfo[$_CFG["usertable_fields"]["user_id"]] = $uid;
		return $userinfo;
	}
	
	
	function User__logout() {
		GLOBAL $bid;
		$_SESSION[$bid]["userinfo"] = array();
		return true;
	}

	
	function User__Add($username,$password) {
		GLOBAL $bid;
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_username/" => $username,
			"/@@_V_password/" => $password,
			"/@@_V_now/" =>  $_SESSION[$bid]["now"]
		);
		$myQuery = DB_QueryReplace($_QU["add_user_by_login"], $RepArray);
		$Res = mysql_query($myQuery);
		if ($Res == true) {
			return true;
		} else {
			$error = "MySQL error ".mysql_errno().": ".mysql_error()."\n<br>When executing:<br>\n$myQuery\n<br>"; 
			return $error;
		}
	}


	function User__Remove($mode,$info) {
		GLOBAL $bid;
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		if ($mode == "username") {
			$RepArray = array(
				"/@@_V_username/" => $info,
			);
			$myQuery = DB_QueryReplace($_QU["delete_user_by_username"], $RepArray);
		} else if ($mode == "uid") {
			$RepArray = array(
				"/@@_V_userid/" => $info,
			);
			$myQuery = DB_QueryReplace($_QU["delete_user_by_userid"], $RepArray);
		}
		$Res = mysql_query($myQuery);
		if ($Res == true) {
			return true;
		} else {
			$error = "MySQL error ".mysql_errno().": ".mysql_error()."\n<br>When executing:<br>\n$myQuery\n<br>"; 
			return $error;
		}
	}


	function User__UserNameExists($username) {
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$bid = $_POST["browserID"];
		$RepArray = array(
			"/@@_V_username/" => $username
		);
		$myQuery = DB_QueryReplace($_QU["get_userid_by_MD5username"], $RepArray);
		$Res = mysql_query($myQuery);	
		$RowCount = mysql_num_rows($Res);
		if ($RowCount == 1) {
			return true;
		} else if ($RowCount == 0) {
			return false;
		} else {
			// should not happen
			return true;
		}
	}
	
	function User__AddInfo($uid,$thing,$content) {
		global $bid;
		$_CFG = $_SESSION["CFG"];
		$_QU = $_SESSION["QUERIES"];
		$RepArray = array(
			"/@@_V_userid/" => $uid, 
			"/@@_V_thing/" => $thing, 
			"/@@_V_content/" => $content
		);
		$myQuery = DB_QueryReplace($_QU["add_userInfo_by_userID"], $RepArray);
		$Res = mysql_query($myQuery);	
		if ($Res == true) {
			return true;
		} else {
			// should not happen
			return true;
		}
	}
?>