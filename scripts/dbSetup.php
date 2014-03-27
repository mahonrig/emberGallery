<?php
    session_start();
	$messages = '';
    require_once "db_functions.php";
	$db = getConnection();

	if (isset($_SESSION['admin_user'])) {
		$admin_user = $_SESSION['admin_user'];
		unset($_SESSION['admin_user']);
	} else {
		$messages = $messages . "Admin user field was not set. ";
	}

	if (isset($_SESSION['admin_pass'])) {
		$admin_pass = $_SESSION['admin_pass'];
		unset($_SESSION['admin_pass']);
	} else {
		$messages = $messages . "Admin password field was not set. ";
	}

    function tryQuery($db, $query){
        try {
            $stmt = $db->query($query);
        } catch (PDOException $e) {
            $messages .= $e->getMessage();
        }
    }

	// setup the required database tables
    if (!table_exists($db, "site")) {
        $query = "CREATE TABLE site (id int AUTO_INCREMENT PRIMARY KEY, title varchar(100) NOT NULL, email varchar(255), facebook varchar(255), twitter varchar(255), tumblr varchar(255), pinterest varchar(255), paypal varchar(255));";
        tryQuery($db, $query);
	} else {
		$messages .= "Site info table already exists. ";
	}

	if (!table_exists($db, "users")){
        $query = "CREATE TABLE users (id int AUTO_INCREMENT PRIMARY KEY, username varchar(20) NOT NULL, password varchar(50) NOT NULL);";
        tryQuery($db, $query);
	} else {
		$messages .= "User table already exists. ";
	}

	if (!table_exists($db, "galleries")) {
		$query = "CREATE TABLE galleries (id int AUTO_INCREMENT PRIMARY KEY, title varchar(50) NOT NULL, description varchar(255));";
		tryQuery($db, $query);
	} else {
		$messages .= "Galleries table already exists. ";
	}

	if (!table_exists($db, "photos")) {
		$query = "CREATE TABLE photos (id int AUTO_INCREMENT PRIMARY KEY, title varchar(100), caption varchar(500), largeFile varchar(255), mediumFile varchar(255), smallFile varchar(255), thumbFile varchar(255));";
		tryQuery($db, $query);
	} else {
		$messages .= "Photo table already exists. ";
	}

	if (!table_exists($db, "gallery_photo")) {
		$query = "CREATE TABLE gallery_photo (gallery_id int NOT NULL, photo_id int NOT NULL);";
		tryQuery($db, $query);
	} else {
		$messages .= "Gallery-Photo table already exists. ";
	}

	if (!table_exists($db, "pages")) {
		$query = "CREATE TABLE pages (id int AUTO_INCREMENT PRIMARY KEY, name varchar(50));";
		tryQuery($db, $query);
	} else {
		$messages .= "Pages table already exists. ";
	}

    if (!table_exists($db, "blocks")) {
		$query = "CREATE TABLE blocks (id int AUTO_INCREMENT PRIMARY KEY, page_id int NOT NULL, type varchar(50), content varchar(2000));";
		tryQuery($db, $query);
	} else {
		$messages .= "Blocks table already exists. ";
	}

    if (!table_exists($db, "orderTypes")) {
        $query = "CREATE TABLE orderTypes (id int AUTO_INCREMENT PRIMARY KEY, type varchar(50));";
        tryQuery($db, $query);
    } else {
        $messages .= "orderTypes table already exists. ";
    }

    if (!table_exists($db, "orderOptions")) {
        $query = "CREATE TABLE orderOptions (id int AUTO_INCREMENT PRIMARY KEY, type_id int NOT NULL, size varchar(50), price int);";
        tryQuery($db, $query);
    } else {
        $messages .= "orderOptions table already exists. ";
    }

    if (!table_exists($db, "orderType_photo")) {
		$query = "CREATE TABLE orderType_photo (type_id int NOT NULL, photo_id int NOT NULL);";
		tryQuery($db, $query);
	} else {
		$messages .= "orderTypes-Photo table already exists. ";
	}

    if (!table_exists($db, "orderOption_photo")) {
		$query = "CREATE TABLE orderOption_photo (option_id int NOT NULL, photo_id int NOT NULL);";
		tryQuery($db, $query);
	} else {
		$messages .= "orderOption-Photo table already exists. ";
	}


	if (isset($admin_user, $admin_pass)) {
		try {
			add_user($db, $admin_user, $admin_pass);
		} catch (PDOException $e) {
			$messages .= $e->getMessage();
		}
	} else {
		$messages .= "No username and/or password was set";
	}

	if (isset($_SESSION['site_name'])) {
		$new_site_name = $_SESSION['site_name'];

		try {
			$stmt = $db->prepare("INSERT INTO site (title) VALUES (:title);");
			$stmt->execute(array(':title' => $new_site_name));
		} catch (PDOException $e) {
			$messages .= $e->getMessage();
		}
			unset($_SESSION['site_name']);
	} else {
		$messages = $messages . "Site name field was not set. ";
	}

	$_SESSION['messages'] = $messages;
	$_SESSION['admin'] = TRUE;
	header("Location: /admin");
	exit();
