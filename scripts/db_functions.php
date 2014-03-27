<?php

require_once "database_connection.php";

function add_gallery($db, $gallery_name, $gallery_link) {

		// need a check to see if gallery at that link already exists
		$stmt = $db->prepare('INSERT INTO galleries (name, link) VALUES (:name, :link)');
		$stmt->execute(array(':name' => $gallery_name, ':link'=>$gallery_link));
		return $db->LastInsertId();

}

function add_photo($db, $title, $large, $medium, $small, $thumb) {
		$stmt = $db->prepare('INSERT INTO photos (name, large_path, medium_path, small_path, thumb_path) VALUES (:title, :large, :medium, :small, :thumb)');
        $stmt->execute(array(':title' => $title, ':large' => $large, ':medium' => $medium, ':small' => $small, ':thumb' => $thumb));
        return $db->LastInsertId();
}

function add_page($db, $name, $link, $content) {

	// need a check to see if page link already exists
	$stmt = $db->prepare('INSERT INTO pages (name, link, content) VALUES (:name, :link, :content)');
	$stmt->bindValue(':content', $content, PDO::PARAM_STR);
	$stmt->bindValue(':name', $name, PDO::PARAM_STR);
	$stmt->bindValue(':link', $link, PDO::PARAM_STR);
	$stmt->execute();
	return $db->LastInsertId();
}


function add_user($db, $username, $password) {

		// check to see if username already exists
		$stmt = $db->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
		$stmt->execute(array(':username' => $username, ':password' => crypt($password, $username)));
		return $db->LastInsertId();
}


function check_user($db, $username, $password) {
	$stmt = $db->prepare('SELECT user_id, username FROM users WHERE username = :name AND password = :pass');
	$stmt->execute(array(':name' => $username, ':pass' => crypt($password, $username)));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}


function get_site_title($db) {
	$stmt = $db->query('SELECT title FROM site');
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
	return $results['title'];
}

function get_site($db) {
	$stmt = $db->query('SELECT * FROM site');
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
	return $results;
}

function get_all_images($db) {
	$query = "SELECT * FROM images";
	$stmt = $db->query($query);
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $result;
}

function get_image($db, $id) {
	$stmt = $db->prepare("SELECT * FROM images WHERE id = :id");
	$stmt->execute(array(':id'=>$id));
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	return $result;
}

function update_site($db, $id, $body){
    $stmt = $db->prepare("UPDATE site SET title = :title WHERE id = :id");
    $stmt->execute(array(':title'=>$body->site->title, ':id'=>$id));
}

function update_photo($db, $id, $body){
    $stmt = $db->prepare("UPDATE site SET title = :title WHERE id = :id");
    $stmt->execute(array(':title'=>$body->site->title, ':id'=>$id));
}

function update_photo_name($db, $id, $name) {
	$stmt = $db->prepare("UPDATE images SET name = :name WHERE id = :id");
	$stmt->execute(array(':name'=>$name, ':id'=>$id));
}

function update_photo_caption($db, $id, $caption) {
	$stmt = $db->prepare("UPDATE images SET caption = :caption WHERE id = :id");
	$stmt->execute(array(':caption'=>$caption, ':id'=>$id));
}

function update_page_name($db, $id, $name) {
	$stmt = $db->prepare("UPDATE pages SET name = :name WHERE id = :id");
	$stmt->execute(array(':name'=>$name, ':id'=>$id));
}

function update_page_link($db, $id, $link) {
	$stmt = $db->prepare("UPDATE pages SET link = :link WHERE id = :id");
	$stmt->execute(array(':link'=>$link, ':id'=>$id));
}

function update_page_content($db, $id, $content) {
	$stmt = $db->prepare("UPDATE pages SET content = :content WHERE id = :id");
	$stmt->execute(array(':content'=>$content, ':id'=>$id));
}

function get_gallery_images($db, $gallery_id) {
	$stmt = $db->prepare('SELECT g.id, g.name, gi.image_id, i.*
							FROM galleries g
							JOIN gallery_images gi ON (g.id = gi.gallery_id)
							JOIN images i ON (gi.image_id = i.id)
							WHERE (g.id = :id)');
	$stmt->execute(array(':id' => $gallery_id));
	if ($stmt->rowCount()>0) {
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		$result = FALSE;
	}
	return $result;
}

function in_gallery($db, $image_id, $gallery_id) {
	$stmt = $db->prepare('SELECT * FROM gallery_images WHERE image_id = :image_id AND gallery_id = :gallery_id');
	$stmt->execute(array(':image_id' => $image_id, ':gallery_id' => $gallery_id));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}

function add_image_gallery($db, $image_id, $gallery_id) {
	$stmt = $db->prepare('INSERT INTO gallery_images (image_id, gallery_id) VALUES (:image_id, :gallery_id)');
	$stmt->execute(array(':image_id'=>$image_id, ':gallery_id'=>$gallery_id));
	return $db->LastInsertId();
}

function remove_image_gallery($db, $image_id, $gallery_id) {
	$stmt = $db->prepare('DELETE FROM gallery_images WHERE image_id	= :image_id AND gallery_id = :gallery_id');
	$stmt->execute(array(':image_id' => $image_id, ':gallery_id' => $gallery_id));
}

function get_galleries($db) {
		$query = "SELECT id, name, link FROM galleries ORDER BY id";
		$stmt = $db->query($query);
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $results;
}

function get_pages($db) {
	$query = "SELECT id, name, link FROM pages";
	$stmt = $db->query($query);
	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $results;
}

function get_page($db, $id) {
	$stmt = $db->prepare("SELECT * FROM pages WHERE id = :id");
	$stmt->execute(array(':id'=>$id));
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
	return $results;
}

function get_page_content($db, $link) {
	$stmt = $db->prepare("SELECT content FROM pages WHERE link = :link");
	$stmt->execute(array(':link'=>$link));
	if ($stmt->rowCount()>0) {
		$results = $stmt->fetch(PDO::FETCH_ASSOC);
	} else {
		$results = FALSE;
	}
	return $results;
}

function remove_gallery($db, $gallery_id) {
	$stmt = $db->prepare('DELETE FROM galleries WHERE id = :id');
	$stmt->execute(array(':id'=>$gallery_id));
}

function remove_image($db, $id) {
	$stmt = $db->prepare('DELETE FROM images WHERE id = :id');
	$stmt->execute(array(':id'=>$id));
}

function remove_page($db, $page_id) {
	$stmt = $db->prepare('DELETE FROM pages WHERE id = :id');
	$stmt->execute(array(':id'=>$page_id));
}

function is_gallery($db, $name) {
	$stmt = $db->prepare("SELECT gallery_name FROM galleries WHERE (gallery_name = :name)");
	$stmt->execute(array(':name' => $name));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}

function table_exists($db, $table) {
	$stmt = $db->query("SHOW TABLES LIKE '$table'");
	if ($stmt->rowCount()>0) {
		return true;
	} else {
		return false;
	}
}
?>
