<?php
	require_once("bootstrap.php");
	
	
	
	
	$Session = Session__FindInDB(session_id());
	if ($Session == false) {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "false";
		Quit();
	} else {
		$_SESSION[$bid]["REPLY"]["DB_Session"] = "true";
	}
	
	SeqAlter_DBTableInfos__add();
	SeqAlter_DBQueries__add();
	
	Quit();
// ######################################################################

	function SeqAlter_DBTableInfos__add() {
		/*
		$_SESSION["CFG"]["tables"][""] = "";
		$_SESSION["CFG"]["tables"]["table_fields"] = array(
			//variable-key => db_column-id
			"field1" => "name1",
		);
		*/
	}

	function SeqAlter_DBQueries__add() {
		// @@_V_sessionid
		// SELECT ...
		/*
		$_SESSION["QUERIES"]["CQ_get_user_columns"] = 'SELECT '.$_CFG["sessiontable_fields"]["user_id"].' FROM '.$_CFG["tables"]["sessions"].' WHERE '.$_CFG["sessiontable_fields"]["session_id"].'="@@_V_sessionid"';
		*/
	}

?>