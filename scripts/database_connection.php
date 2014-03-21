<?php
	require_once 'app_config.php';
	
	function getConnection() {
		$db = new PDO('mysql:host=' . DATABASE_HOST . 
					  ';dbname=' . DATABASE_NAME . 
					  ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD, 
					  array(PDO::ATTR_EMULATE_PREPARES => false, 
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        return $db;                                            
	}
	
?>