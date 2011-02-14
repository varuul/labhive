<?php
	require_once("bootstrap.php");
	
	
	$JobVectors = array(
		"hello" => user->hello($dbNOW, $bid),
		"login" => user->login($dbNOW, $bid),
		"logout" => user->logout($dbNOW, $bid),
		"adduser" => user->adduser($dbNOW, $bid),
		"removeuser" => user->removeuser($dbNOW, $bid),
		"adduserinfo" => user->adduserinfo($dbNOW, $bid),
		"username_availability" => user->checkusername($dbNOW, $bid),
		
	);
	
	
	foreach ($_POST["jobs"] as ($key => $job)) {
		if (array_key_exists($key, $JobVectors)) {
			function_exists($JobVectors[$key]) $_SESSION[$bid]["REPLY"][$key] = $JobVectors[$key]();
		}
	}
	
?>