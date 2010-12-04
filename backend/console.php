<?php
	
	// this is basically for administrative purposes.
	// the commands and arguments currently integrated are :
	//
	//  --1-- adduser,username,userpassword
	//  --2-- removeuser,username
	
	require_once("bootstrap.php");
	
	$Session = Session__FindInDB(session_id());
	
	if ($Session == false) {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
		array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "console can only be accessed by logged in admins");
		$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
		Quit();
	} else {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
	}
	$job = $_POST["job"];
	
	if ($job == "console" AND isset($_POST["command"]) AND strlen($_POST["command"])>3) {
		$possiblecommands = array("adduser","removeuser","adduserinfo");
		$cmdarray = explode(";",$_POST["command"]);
		$cmd = strtolower($cmdarray[0]);
		if (!in_array($cmd,$possiblecommands)) {
			array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "unknown console command");
			$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			Quit();
		}
		array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "console triggered");
		if ($cmd=="adduser") {
			$un = $cmdarray[1];
			$pw = md5($cmdarray[2]);
			if (User__UserNameExists($un) == false) {
				$result = User__Add($un, $pw);
				if ($result==true) {
					array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "user added");
					$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
				} else {
					array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "user insertion failed at DB level\r\n".$result);
					$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
				}
			} else {
				array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "username already exists");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			}
		} else if ($cmd=="removeuser") {
			$un = $cmdarray[1];
			if (User__UserNameExists($un) == true) {
				$result = User__Remove("username",$un);
				if ($result==true) {
					array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "user removed");
					$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
				} else {
					array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "user removal failed at DB level\r\n".$result);
					$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
				}
			} else {
				array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "username does not exist");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			}			
		} else if ($cmd=="adduserinfo") {
			$uid = $cmdarray[1];
			$thing = $cmdarray[2];
			$content = $cmdarray[3];
			$result = User__AddInfo($uid,$thing,$content);
			if ($result==true) {
				array_push($_SESSION[$bid]["REPLY"]["SUCCESSES"], "user removed");
				$_SESSION[$bid]["REPLY"]["jobresult"] = "true";
			} else {
				array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "user removal failed at DB level\r\n".$result);
				$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
			}
		}
		
	} else {
		array_push($_SESSION[$bid]["REPLY"]["ERRORS"], "bad console command");
		$_SESSION[$bid]["REPLY"]["jobresult"] = "false";
	}
	Quit();
	
	
	// ######################################################

	



?>