<?php
// #################################
//  TAKE THIS OUT ONCE YOUR SYSTEM GOES LIVE!
// ######################################### MASSIVE ERROR REPORTING FOR ERROR FINDING DURING DEVELOPMENT ############
	$old_error_handler = set_error_handler("userErrorHandler");
	error_reporting(E_ALL);
	ini_set("display_errors", 0); 
	// user defined error handling function   via php website!
	function userErrorHandler($errno, $errmsg, $filename, $linenum, $vars)  {
		$dt = date("Y-m-d H:i:s (T)");
		$myError = array(
			"ERROR" => array( "error_timestamp" => $dt,
								"error_number" => $errno,
								"error_message" => $errmsg,
								"filename" => $filename,
								"error_line" => $linenum,
								"variables" => $vars)
		);
		echo json_encode($myError);
		exit();
		return false;
	}
// ######################################### END OF MASSIVE ERROR REPORTING FOR ERROR FINDING DURING DEVELOPMENT ############

	
	session_start();
	
	//imports some basic php functions
	require_once("basics.php");
	// DEFINES $_CFG
	require_once("config.php");
	// DEFINES $_QU
	require_once("db_queries.php");
	// adds SESSION functionalities
	require_once("session.php");
	
	$_SESSION["DB"] = DB_connect();

	date_default_timezone_set('UTC');
	$t = mysql_query("SET NAMES 'utf8'"); 
	$dbNOW = DB_GetDate();
	$_SESSION["REPLY"]["SUCCESSES"] = array();
	$_SESSION["REPLY"]["ERRORS"] = array();
	array_push($_SESSION["REPLY"]["SUCCESSES"], "startup");

	if (!Security_POSTcheck()) {
		$_SESSION["REPLY"]["talk"] = "false";
		REPLY_JSON();
		exit;
	} 
	$bid = $_POST["browserID"];
	$job = $_POST["job"];
	if (!isset($_SESSION[$bid]["IP"])) {
		Session__FixABrowser($bid);
		$_SESSION[$bid]["REPLY"]["SessionMode"] = "new";
	} else {
		$_SESSION[$bid]["REPLY"]["SessionMode"] = "old";
	}
	$_SESSION[$bid]["REPLY"]["SUCCESSES"] = array();
	$_SESSION[$bid]["REPLY"]["ERRORS"] = array();
	$_SESSION[$bid]["REPLY"]["SessionID"] = $bid;
	$_SESSION[$bid]["REPLY"]["talk"] = "true";
	$_SESSION[$bid]["REPLY"]["job"] = $job;
	if (isset($_SESSION[$bid]["REPLY"]["SessionCalls"])) {
		$_SESSION[$bid]["REPLY"]["SessionCalls"]++;
	} else {
		$_SESSION[$bid]["REPLY"]["SessionCalls"] = 1;
	}
	$_SESSION[$bid]["REPLY"]["now"] = $dbNOW;
	$_SESSION[$bid]["now"] = $dbNOW;
	
	
	
	// #####################################################################
	
	
?>