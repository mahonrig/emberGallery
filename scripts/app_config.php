<?php
	// Database connection
	$db_config = parse_ini_file("config.ini");
	define('DATABASE_HOST', $db_config['db_host']);	
	define('DATABASE_USERNAME', $db_config['db_username']);	
	define('DATABASE_PASSWORD', $db_config['db_password']);	
	define('DATABASE_NAME', $db_config['db_name']);
?>