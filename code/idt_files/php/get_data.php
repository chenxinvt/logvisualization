<?php
if (!isset($_GET['action'])) {
	die('Invalid request');
}

require_once 'db.php';

switch($_GET['action']) {
	case 'get-daily-error' :
		getDailyError($_GET['details']);
		break;
	case 'get-date-list' :
		break;
	case 'get-total' :
		break;
}

function getDailyError($details) {
	//action=get-daily-error&details=2014-03-30 23:44|2014-03-31 02:16|E401
	$args = explode('|', $details);
	$time_start = $args[0];
	$time_end = $args[1];
	$errors = array_slice($args, 2);
	if (count($errors) < 1) {
		$errors[] = 'E400';
	}

	$fields = array('time_stamp', 'IP', 'PID', 'tool_id', 'OS', 'browser_name', 'browser_version', 'response_code');
	$sql = "SELECT " . implode(',', $fields) . " FROM all_errors WHERE time_stamp >= '{$time_start}' AND time_stamp <= '{$time_end}' AND response_code IN ('" . implode("','", $errors) . "') ORDER BY time_stamp ASC";
	$results = get_rows_as_arr($sql);
	echo implode(',', $fields), "\n";
	foreach ($results as $r) {
		echo implode(',', $r), "\n";
	}
}
?>
