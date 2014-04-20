<?php
	session_start();
	$messages = '';
//if (!is_file("config.ini")) { // ok no config yet
	// if we're processing the new database form
	if (isset($_POST['db_host'])) {
		// write the config settings into config.ini
		$db_host = trim($_POST['db_host']);
		$db_username = trim($_POST['db_username']);
		$db_password = trim($_POST['db_password']);
		$db_name = trim($_POST['db_name']);
		$site_name = trim($_POST['site_name']);
		$admin_user = trim($_POST['admin_user']);
		$admin_pass = trim($_POST['admin_pass']);
		$_SESSION['admin_user'] = $admin_user;
		$_SESSION['admin_pass'] = $admin_pass;
		$_SESSION['site_name'] = $site_name;

		//lets see if this connection works
		try {
			$db = new PDO('mysql:host=' . $db_host . ';dbname=' . $db_name . ';charset=utf8', $db_username, $db_password, array(PDO::ATTR_EMULATE_PREPARES => false,
                                                                                                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		} catch (PDOException $e) {
			$messages .= $e->getMessage();
			print $messages;
			exit();
		}

			$handle = fopen('config.ini', 'w+');
			fwrite($handle, ";Database Configuration File\n");
			fwrite($handle, "db_host = {$db_host}\ndb_username = {$db_username}\ndb_password = '{$db_password}'\ndb_name = {$db_name}\n");

		// ok, we've written the config file, lets configure the database.
		header("Location: /scripts/dbSetup.php");

	} else { // display db config form
		header('Location: /scripts/setup.html');
	}

//} else { // we've already got a config file, try to load home
 //   header("Location: /");
//}

?>
