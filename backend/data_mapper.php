<?php
session_start();

require "basics.php";
require "config.php";

$_CFG = $_SESSION["CFG"];

echo "<br>dbname = ".$_CFG['db_name']. " connecting as ".$_CFG['db_username'];

$target_table = "medaka";
$target_reference_column = "transcript_id";
$target_data_columns = array("goterms","description","UniProt_xref_id","dmrt1binding");

$source_table = "tome_v7";
$source_reference_column = "tid";
$source_data_columns = array("goterms","description","UniProt_xref_id","dmrt1binding");


$myDB = DB_Connect();
date_default_timezone_set('UTC');
$t = mysql_query("SET NAMES 'utf8'"); 
$dbNOW = DB_GetDate();
echo "<br>getting the target reference column...@ $dbNOW";
$q1 = "SELECT $target_reference_column FROM $target_table;";
$result1 = mysql_query($q1);
if ($result1 == false) {
	echo "<br> failed: ".mysql_error();
	exit();
}
echo "<br> found ".mysql_num_rows($result1)." rows by running $q1";
$i = 0;
$target_column_data = array();
while ($row = mysql_fetch_array($result1, MYSQL_ASSOC)) {
	$target_data[$row[$target_reference_column]] = array();
	$i++;
}

echo "<br>getting the source columns...@ $dbNOW";
$q2 = "SELECT $source_reference_column, ".implode(',',$source_data_columns)." FROM $source_table;";
$result2 = mysql_query($q2);
if ($result2 == false) {
	echo "<br> failed: ".mysql_error();
	exit();
}
$max2 = mysql_num_rows($result2);
echo "<br> found $max2 rows by running $q2";
$i = 0;
$source_reference_column_data = array();
$source_data_column_data = array();
$source_data = array();
while ($row = mysql_fetch_array($result2, MYSQL_ASSOC)) {
	$source_reference_column_data[] = $row[$source_reference_column];
	$source_data[$row[$source_reference_column]] = array();
	foreach ($source_data_columns as $key) {
		$source_data[$row[$source_reference_column]][$key] = $row[$key];
	}
	echo "<br>read [$i/$max2] ";
	$i++;
}
$success=0;
$failed=0;
$all_updates = "";
for ($i=17000;$i<count($source_data); $i++) {
	$newvalue = $source_data_column_data[$i];
	$reference_id = $source_reference_column_data[$i];
	$newvalues = '';
	$colnum = 0;
	foreach ($source_data_columns as $key) {
		$newvalues .= $target_data_columns[$colnum].'="'.$source_data[$source_reference_column_data[$i]][$key].'",';
		$colnum++;
	}
	$newvalues = rtrim($newvalues,",");
	$update_query = 'UPDATE '.$target_table.' SET '.$newvalues.' WHERE '.$target_table.'.'.$target_reference_column.' = "'.$reference_id.'";';	
	$all_updates .= $update_query.";";
	
	$result3 = mysql_query($update_query);
	if ($result3 == false) {
		echo "<br><br>update#$i failed ($update_query): ".mysql_error();
		$failed++;
		break;
	} else {
		echo "<br><br>update#$i successful. new value: $newvalues";
		$success++;
	}
	
}
//echo "<br>altogether we had $success updates and $failed errors";
echo "------------------ Below are all queries -----------------------";
echo $all_updates;
echo "------------------ Above are all queries -----------------------";

?>