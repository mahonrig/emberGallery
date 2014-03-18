<?php
	session_start();
	session_cache_limiter(false);
	
	//load composer requirements
	require_once 'vendor/autoload.php';
	//require_once 'scripts/db_functions.php';
	define('DEBUG', false);
    define('ADMIN', 1);
	
	// create our own view class to use twig templates
	class TwigView extends \Slim\View {
		public function render($template) {
			//twig code here
			$loader = new Twig_Loader_Filesystem('./templates/');
			$twig = new Twig_Environment($loader);
			return $twig->render($template, $this->all());
			
		}
	}
    
    function renderApp($app, $pagetitle){
        $data = array(
			'pageTitle' => $pagetitle,
			'siteName' => 'Mahonri Gibson Photographic Works',
                'admin' => ADMIN
		);
		$app->render('app.phtml', $data);
    }
	
	// create the new slim app, set view to our twig class
	$app = new \Slim\Slim(array(
		'view' => new TwigView()
	));
	
	// load the homepage
	$app->get('/', function() use ($app) {
		renderApp($app, 'Welcome to Mahonri Gibson Photographic Works');
	});
	
	$app->get('/prints', function() use ($app) {
		renderApp($app, 'Available Prints');
	});
	
	$app->get('/order/:id', function($id) use ($app) {
		renderApp($app, 'Order a Print');
	});
	
	$app->get('/galleries', function() use ($app) {
		if ($app->request->isAjax()){
            $galleries = 'json/galleries.json';
            $json = [];
            $json[gallery] = json_decode(file_get_contents($galleries), TRUE);
            
			$app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
		} else {
			renderApp($app, 'View All Galleries');
		}
	});
    
    $app->get('/galleries/:id', function($id) use ($app) {
        if ($app->request->isAjax()){
            $galleries = 'json/galleries.json';
            $json = [];
            $json_gallery = json_decode(file_get_contents($galleries), TRUE);
            $json[gallery] = $json_gallery[$id-1];
            
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
		} else {
			renderApp($app, 'View Gallery');
		}
    });
    
    $app->get('/galleries/:gallery_id/photo/:photo_id', function($gallery_id, $photo_id) use ($app) {
			renderApp($app, 'View Photo');
    });
    
    $app->get('/photos', function() use ($app) {
        if ($app->request->isAjax()){
            $photos = 'json/photos.json';
            $json = [];
            $json[photo] = json_decode(file_get_contents($photos), TRUE);
            
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
            } else {
			$app->redirect('/');
		}
        
    });
    
    $app->get('/photos/:id', function($id) use ($app) {
        if ($app->request->isAjax()){
            $photos = 'json/photos.json';
            $json = [];
            $json_photos = json_decode(file_get_contents($photos), TRUE);
            $json[photo] = $json_photos[$id-1];
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
            } else {
			$app->redirect('/');
		}
        
    });
	
	$app->run();
?>