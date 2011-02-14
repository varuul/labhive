<?php
	$_SESSION["CFG"] = array(
		'tables' => array(
			'users' => 'users',
			'sessions' => 'sessions',
			'info' => 'info'
		),
		'sessiontable_fields' => array(
			'session_id' => 'session_id',
			'user_id' => 'uid',
			'created_date' => 'created_date',
			'created_ip' => 'created_ip'
		),
		'usertable_fields' => array(
			'user_id' => 'user_id',
			'username' => 'username',
			'password' => 'password',
			'email' => 'email',
			'created_date' => 'created_date'
		),
		// THE INFOTABLE is a new way to organize data. with pure association, a thing and content
		// this makes the system much more flexible, and probably a bit faster, but - of course nothing is for free - this system makes it necessary to adapt DB-queries constantly
		// hence, here is a list of THINGS and CONTENS that are integrated
		//	associated_table: 0 (=usertable) // ASSOCIATION_ID: uid from usertable // THING: user_email  // CONTENT: string.. an email adress
		//	associated_table: 0 (=usertable) // ASSOCIATION_ID: uid from usertable // THING: user_xslevel  // CONTENT: integer.. 0=unknown, 1=normal user, 2=admin
		
		'infotable_fields' => array(
			'index' => 'index',
			'associated_table' => 'associated_table',
			'association_id' => 'association_id',
			'thing' => 'thing',
			'content' => 'content'
		),
		'PossibleJobs' => array(
			'login','logout','hello','console','username_availability','registration'
		)
	);
	$_SESSION["CFG"]['db_name'] = '';
	$_SESSION["CFG"]['db_server'] = '';
	$_SESSION["CFG"]['db_username'] = '';
	$_SESSION["CFG"]['db_password'] = '';
	require("xs.php");
?>