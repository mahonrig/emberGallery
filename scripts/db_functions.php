<?php

require_once "database_connection.php";

function add_gallery($db, $title) {

		// need a check to see if gallery at that link already exists
		$stmt = $db->prepare('INSERT INTO galleries (title) VALUES (:title)');
		$stmt->execute(array(':title' => $title));
		return $db->LastInsertId();
}

function add_photo($db, $title, $xlarge, $large, $medium, $small, $thumb) {
		$stmt = $db->prepare('INSERT INTO photos (title, xlargeFile, largeFile, mediumFile, smallFile, thumbFile) VALUES (:title, :xlarge, :large, :medium, :small, :thumb)');
        $stmt->execute(array(':title' => $title, ':xlarge'=> $xlarge, ':large' => $large, ':medium' => $medium, ':small' => $small, ':thumb' => $thumb));
        return $db->LastInsertId();
}

function add_order_type($db, $data) {
	$stmt = $db->prepare('INSERT INTO orderTypes (type) VALUES (:type)');
	$stmt->execute(array(':type' => $data->orderType->type));
	return $db->LastInsertId();
}

function add_order_option($db, $data) {
	$stmt = $db->prepare('INSERT INTO orderOptions (type, size, price) VALUES (:type, :size, :price)');
	$stmt->execute(array(':type' => $data->orderOption->type, ':size' => $data->orderOption->size, ':price' => $data->orderOption->price));
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

/* See if user exists, right now that means they're an admin */
function check_user($db, $username, $password) {
	$stmt = $db->prepare('SELECT id, username FROM users WHERE username = :name AND password = :pass');
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

function get_order_types($db) {
	$stmt = $db->query('SELECT * FROM orderTypes');
	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $results;
}

function get_order_type($db, $id) {
	$stmt = $db->prepare('SELECT * FROM orderTypes WHERE id = :id');
	$stmt->execute(array(':id' => $id));
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
	return $results;
}

function get_order_options($db){
	$stmt = $db->query('SELECT * FROM orderOptions');
	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $results;
}

function get_order_option($db, $id) {
	$stmt = $db->prepare('SELECT * FROM orderOptions WHERE id = :id');
	$stmt->execute(array(':id' => $id));
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
	return $results;
}

function get_type_options($db, $type_id){
	$stmt = $db->prepare("SELECT id FROM orderOptions WHERE type = :type_id");
	$stmt->execute(array(':type_id' => $type_id));
	if ($stmt->rowCount()>0) {
		$result = $stmt->fetchAll(PDO::FETCH_COLUMN);
	} else {
		$result = FALSE;
	}
	return $result;
}

function get_photos($db) {
	$query = "SELECT * FROM photos";
	$stmt = $db->query($query);
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $result;
}

function get_photo($db, $id) {
	$stmt = $db->prepare("SELECT * FROM photos WHERE id = :id");
	$stmt->execute(array(':id'=>$id));
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	return $result;
}

function update_site($db, $id, $data){
    $stmt = $db->prepare("UPDATE site SET title = :title,
		bannerImg = :bannerImg,
		email = :email,
		facebook = :facebook,
		twitter = :twitter,
		tumblr = :tumblr,
		pinterest = :pinterest,
		paypal = :paypal
		WHERE id = :id");
    $stmt->execute(array(
			':title'=>$data->site->title,
			':bannerImg'=>$data->site->bannerImg,
			':email'=>$data->site->email,
			':facebook'=>$data->site->facebook,
			':twitter'=>$data->site->twitter,
			':tumblr'=>$data->site->tumblr,
			':pinterest'=>$data->site->pinterest,
			':paypal'=>$data->site->paypal,
			':id'=>$id
		));
}

function update_order_type($db, $id, $data){
	$stmt = $db->prepare("UPDATE orderTypes SET type = :type WHERE id = :id");
	$stmt->execute(array(':type' => $data->orderType->type, ':id' => $id));
}

function update_photo($db, $id, $data) {
	$stmt = $db->prepare("UPDATE photos SET title = :title WHERE id = :id");
	$stmt->execute(array(':title'=>$data->photo->title, ':id'=>$id));
	$types = $data->photo->orderTypes;
	foreach ($types as $type){
		if (!photo_has_type($db, $type, $id)){
			add_photo_type($db, $type, $id);
		}
	}
	$options = $data->photo->orderOptions;
	foreach ($options as $option){
		if (!photo_has_option($db, $option, $id)){
			add_photo_option($db, $option, $id);
		}
	}

}

function update_gallery($db, $id, $data) {
	$stmt = $db->prepare("UPDATE galleries SET title = :title, description = :description WHERE id = :id");
	$stmt->execute(array(':title'=>$data->gallery->title, ':description'=>$data->gallery->description, ':id'=>$id));
	$photoIDs = $data->gallery->photos;
	foreach ($photoIDs as $photoID){
		if (!in_gallery($db, $photoID, $id)){
			add_photo_gallery($db, $photoID, $id);
		}
	}
	$in_gallery = get_gallery_photos($db, $id);
	foreach ($in_gallery as $photoID){
		if (!in_array($photoID, $photoIDs)){
			remove_photo_gallery($db, $photoID, $id);
		}
	}
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

function get_gallery_photos($db, $gallery_id) {
	$stmt = $db->prepare('SELECT gp.photo_id
							FROM galleries g
							JOIN gallery_photo gp ON (g.id = gp.gallery_id)
							JOIN photos p ON (gp.photo_id = p.id)
							WHERE (g.id = :id)');
	$stmt->execute(array(':id' => $gallery_id));
	if ($stmt->rowCount()>0) {
		$result = $stmt->fetchAll(PDO::FETCH_COLUMN);
	} else {
		$result = FALSE;
	}
	return $result;
}

function get_photo_orderTypes($db, $id){
	$stmt = $db->prepare('SELECT type_id FROM orderType_photo WHERE photo_id = :id');
	$stmt->execute(array(':id' => $id));
	if ($stmt->rowCount()>0) {
		$result = $stmt->fetchAll(PDO::FETCH_COLUMN);
	} else {
		$result = FALSE;
	}
	return $result;
}

function get_photo_orderOptions($db, $id){
	$stmt = $db->prepare('SELECT option_id FROM orderOption_photo WHERE photo_id = :id');
	$stmt->execute(array(':id' => $id));
	if ($stmt->rowCount()>0) {
		$result = $stmt->fetchAll(PDO::FETCH_COLUMN);
	} else {
		$result = FALSE;
	}
	return $result;
}

function in_gallery($db, $photo_id, $gallery_id) {
	$stmt = $db->prepare('SELECT * FROM gallery_photo WHERE photo_id = :photo_id AND gallery_id = :gallery_id');
	$stmt->execute(array(':photo_id' => $photo_id, ':gallery_id' => $gallery_id));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}

function photo_has_type($db, $type, $id){
	$stmt = $db->prepare('SELECT * FROM orderType_photo WHERE photo_id = :photo_id AND type_id = :type_id');
	$stmt->execute(array(':photo_id' => $id, ':type_id' => $type));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}
function add_photo_type($db, $type, $id){
	$stmt = $db->prepare('INSERT INTO orderType_photo (photo_id, type_id) VALUES (:photo_id, :type_id)');
	$stmt->execute(array(':photo_id'=>$id, ':type_id'=>$type));
	return $db->LastInsertId();
}
function photo_has_option($db, $option, $id){
	$stmt = $db->prepare('SELECT * FROM orderOption_photo WHERE photo_id = :photo_id AND option_id = :option_id');
	$stmt->execute(array(':photo_id' => $id, ':option_id' => $option));
	if ($stmt->rowCount()>0) {
		return TRUE;
	} else {
		return FALSE;
	}
}
function add_photo_option($db, $option, $id){
	$stmt = $db->prepare('INSERT INTO orderOption_photo (photo_id, option_id) VALUES (:photo_id, :option_id)');
	$stmt->execute(array(':photo_id'=>$id, ':option_id'=>$option));
	return $db->LastInsertId();
}

function add_photo_gallery($db, $photo_id, $gallery_id) {
	$stmt = $db->prepare('INSERT INTO gallery_photo (photo_id, gallery_id) VALUES (:photo_id, :gallery_id)');
	$stmt->execute(array(':photo_id'=>$photo_id, ':gallery_id'=>$gallery_id));
	return $db->LastInsertId();
}

function remove_photo_gallery($db, $photo_id, $gallery_id) {
	$stmt = $db->prepare('DELETE FROM gallery_photo WHERE photo_id	= :photo_id AND gallery_id = :gallery_id');
	$stmt->execute(array(':photo_id' => $photo_id, ':gallery_id' => $gallery_id));
}

function get_galleries($db) {
		$query = "SELECT id, title, description FROM galleries ORDER BY id";
		$stmt = $db->query($query);
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $results;
}

function get_gallery($db, $id) {
	$stmt = $db->prepare("SELECT id, title, description FROM galleries WHERE id = :id");
	$stmt->execute(array(':id' => $id));
	$results = $stmt->fetch(PDO::FETCH_ASSOC);
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

function delete_gallery($db, $gallery_id) {
	$stmt = $db->prepare('DELETE FROM galleries WHERE id = :id');
	$stmt->execute(array(':id'=>$gallery_id));
}

function delete_photo($db, $id) {
	$stmt = $db->prepare('DELETE FROM photos WHERE id = :id');
	$stmt->execute(array(':id'=>$id));

	$stmt = $db->prepare('DELETE FROM gallery_photo WHERE photo_id = :id');
	$stmt->execute(array(':id'=>$id));
}

function delete_order_type($db, $id){
	$stmt = $db->prepare('DELETE FROM orderTypes WHERE id = :id');
	$stmt->execute(array(':id'=>$id));
}

function delete_order_option($db, $id){
	$stmt = $db->prepare('DELETE FROM orderOptions WHERE id = :id');
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
