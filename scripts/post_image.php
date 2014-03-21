<?php
	require_once 'database_connection.php';
	$error_msg = 'Any Errors: ';
	
	
	if (isset($_FILES['image_upload'])) {
		if (!file_exists("../thumbs")) {
			@mkdir ("../thumbs", 0755)
				or $error_msg .= "Error creating directory thumbs.";
		}
		if (!file_exists("../small")) {
			@mkdir ("../small", 0755)
				or $error_msg .= "Error creating directory small.";
		}
		if (!file_exists("../medium")) {
			@mkdir ("../medium", 0755)
				or $error_msg .= "Error creating directory medium.";
		}
		if (!file_exists("../large")) {
			@mkdir ("../large", 0755)
				or $error_msg .= "Error creating directory large.";
		}
		if (!file_exists("../original")) {
			@mkdir ("../original", 0755)
				or $error_msg .= "Error creating directory original.";
		}
		
		include('simple_image.php');
		$image = new SimpleImage();
		$image->load($_FILES['image_upload']['tmp_name']);
		$filename = $_FILES['image_upload']['name'];
		$large = 'large/' . $filename;
		$medium = 'medium/' . $filename;
		$small = 'small/' . $filename;
		$thumb = 'thumbs/' . $filename;
		@$image->save('../original/' . $filename);
		$image->resizeToWidth(1680);
		@$image->save('../' . $large);
		$image->resizeToWidth(1024);
		@$image->save('../' . $medium);
		$image->resizeToWidth(512);
		@$image->save('../' . $small);
		$image->resizeToWidth(150);
		@$image->save('../' . $thumb);
		$id = add_image($large, $medium, $small, $thumb);
		$data = array('thumb' => $thumb, 'imageID' => $id, 'error' => $error_msg);
		echo json_encode($data);
		}
	?>