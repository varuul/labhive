<?php
// ######################################### MASSIVE ERROR REPORTING FOR ERROR FINDING DURING DEVELOPMENT ############
	$old_error_handler = set_error_handler("userErrorHandler");
	error_reporting(E_ALL);
	ini_set("display_errors", 1); 
	// user defined error handling function   via php website!
	function userErrorHandler($errno, $errmsg, $filename, $linenum, $vars)  {
		// timestamp for the error entry
		$dt = date("Y-m-d H:i:s (T)");
		// define an assoc array of error string
		// in reality the only entries we should
		// consider are E_WARNING, E_NOTICE, E_USER_ERROR,
		// E_USER_WARNING and E_USER_NOTICE
		$errortype = array (
					E_ERROR              => 'Error',
					E_WARNING            => 'Warning',
					E_PARSE              => 'Parsing Error',
					E_NOTICE             => 'Notice',
					E_CORE_ERROR         => 'Core Error',
					E_CORE_WARNING       => 'Core Warning',
					E_COMPILE_ERROR      => 'Compile Error',
					E_COMPILE_WARNING    => 'Compile Warning',
					E_USER_ERROR         => 'User Error',
					E_USER_WARNING       => 'User Warning',
					E_USER_NOTICE        => 'User Notice',
					E_STRICT             => 'Runtime Notice',
					E_RECOVERABLE_ERROR  => 'Catchable Fatal Error'
					);
		// set of errors for which a var trace will be saved
		$user_errors = array(E_USER_ERROR, E_USER_WARNING, E_USER_NOTICE);
		$err = "<errorentry>\n";
		$err .= "\t<datetime>" . $dt . "</datetime>\n";
		$err .= "\t<errornum>" . $errno . "</errornum>\n";
		$err .= "\t<errortype>" . $errortype[$errno] . "</errortype>\n";
		$err .= "\t<errormsg>" . $errmsg . "</errormsg>\n";
		$err .= "\t<scriptname>" . $filename . "</scriptname>\n";
		$err .= "\t<scriptlinenum>" . $linenum . "</scriptlinenum>\n";
		if (in_array($errno, $user_errors)) {
			$err .= "\t<vartrace>" . wddx_serialize_value($vars, "Variables") . "</vartrace>\n";
		}
		$err .= "</errorentry>\n\n";
		echo $err;
		return false;
	}
// ######################################### END OF MASSIVE ERROR REPORTING FOR ERROR FINDING DURING DEVELOPMENT ############
//  TAKE THIS OUT ONCE YOUR SYSTEM GOES LIVE!
// #################################
	
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
	if (!isset($_SESSION[$bid]) or count($_SESSION[$bid]) < 2) {
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
	$_SESSION[$bid]["REPLY"]["SessionCalls"]++;
	$_SESSION[$bid]["REPLY"]["now"] = $dbNOW;
	$_SESSION[$bid]["now"] = $dbNOW;
	
	
	
	// #####################################################################
	
	
?>