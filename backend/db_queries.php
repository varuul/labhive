<?php
	$_CFG = $_SESSION["CFG"];
	$_SESSION["QUERIES"] = array(
		'get_userid_by_session' => 'SELECT '.$_CFG["sessiontable_fields"]["user_id"].' FROM '.$_CFG["tables"]["sessions"].' WHERE '.$_CFG["sessiontable_fields"]["session_id"].'="@@_V_sessionid"',

		// @@_V_userid
		'get_username_by_userid' => 'SELECT '.$_CFG["usertable_fields"]["username"].' FROM '.$_CFG["tables"]["users"].' WHERE '.$_CFG["usertable_fields"]["user_id"].'="@@_V_userid"',

		// @@_V_username, @@_V_password
		'get_userid_by_login' => 'SELECT '.$_CFG["usertable_fields"]["user_id"].' FROM '.$_CFG["tables"]["users"].' WHERE MD5('.$_CFG["usertable_fields"]["username"].')="@@_V_username" AND '.$_CFG["usertable_fields"]["password"].'=MD5(CONCAT("@@_V_password",'.$_CFG["usertable_fields"]["created_date"].'))',
		
		// @@_V_username
		'get_userid_by_username' => 'SELECT '.$_CFG["usertable_fields"]["user_id"].' FROM '.$_CFG["tables"]["users"].' WHERE '.$_CFG["usertable_fields"]["username"].'="@@_V_username"',
		// @@_V_username
		'get_userid_by_MD5username' => 'SELECT '.$_CFG["usertable_fields"]["user_id"].' FROM '.$_CFG["tables"]["users"].' WHERE MD5('.$_CFG["usertable_fields"]["username"].')="@@_V_username"',

		// @@_V_userid
		// sample query: SELECT thing, content FROM info WHERE association_id="1" AND associated_table="0";
		'get_userInfo_by_userID' => 'SELECT '.$_CFG["infotable_fields"]["thing"].','.$_CFG["infotable_fields"]["content"].' FROM '.$_CFG["tables"]["info"].' WHERE '.$_CFG["infotable_fields"]["association_id"].'="@@_V_userid" AND '.$_CFG["infotable_fields"]["associated_table"].'="0"',

		// @@_V_userid, @@_V_thing, @@_V_content
		// sample query: INSERT INTO info (associated_table,association_id,thing,content) VALUES ("0","1","user_xslevel","2");
		'add_userInfo_by_userID' => 'INSERT INTO '.$_CFG["tables"]["info"].' ('.$_CFG["infotable_fields"]["associated_table"].','.$_CFG["infotable_fields"]["association_id"].','.$_CFG["infotable_fields"]["thing"].','.$_CFG["infotable_fields"]["content"].') VALUES ("0", "@@_V_userid", "@@_V_thing","@@_V_content")',
		
		// @@_V_username, @@_V_password, @@_V_now
		'add_user_by_login' => 'INSERT INTO '.$_CFG["tables"]["users"].' ('.$_CFG["usertable_fields"]["username"].','.$_CFG["usertable_fields"]["password"].','.$_CFG["usertable_fields"]["created_date"].') VALUES ("@@_V_username",MD5("@@_V_password@@_V_now"),"@@_V_now")',

		// @@_V_NEWpassword, @@_V_username, @@_V_password
		'update_userpassword_by_login' => 'UPDATE '.$_CFG["tables"]["users"].' SET '.$_CFG["usertable_fields"]["password"].'=MD5("@@_V_NEWpassword") WHERE MD5('.$_CFG["usertable_fields"]["username"].')="@@_V_username" AND '.$_CFG["usertable_fields"]["password"].'=MD5("@@_V_password@@_V_now")',

		// @@_V_userid
		'delete_user_by_userid' => 'DELETE FROM '.$_CFG["tables"]["users"].' WHERE '.$_CFG["usertable_fields"]["user_id"].'="@@_V_userid" LIMIT 1',

		// @@_V_username
		'delete_user_by_username' => 'DELETE FROM '.$_CFG["tables"]["users"].' WHERE '.$_CFG["usertable_fields"]["username"].'="@@_V_username" LIMIT 1',

		
		// @@_V_userid, @@_V_now, @@_V_userIP
		'add_session_by_userid' => 'INSERT INTO '.$_CFG["tables"]["sessions"].' ('.$_CFG["sessiontable_fields"]["session_id"].','.$_CFG["sessiontable_fields"]["user_id"].','.$_CFG["sessiontable_fields"]["created_date"].','.$_CFG["sessiontable_fields"]["created_ip"].') VALUES("'.session_id().'","@@_V_userid","@@_V_now", "@@_V_userIP")',

		// @@_V_SessId
		'delete_session_by_sessionID' => 'DELETE FROM '.$_CFG["tables"]["sessions"].' WHERE '.$_CFG["sessiontable_fields"]["session_id"].'="@@_V_SessId" LIMIT 1',
		
	);
?>