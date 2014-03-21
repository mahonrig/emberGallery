<?php
    session_cache_limiter(false);
	session_start();
  
    if (isset($_SESSION['messages'])){
        $messages = $_SESSION['messages'];
    } else {
        $messages = '';
    }
	if (isset($_SESSION['admin'])){
        define('ADMIN', $_SESSION['admin']);
    } else {
        define('ADMIN', 0);
    }
	//load composer requirements
	require_once 'vendor/autoload.php';
    require_once 'scripts/db_functions.php';
	define('DEBUG', false);
	
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
        $db = getConnection();
        try {
            $title = get_site_title($db);
        } catch (PDOException $e) {
            $messages .= $e->getMessage();
        }
        $data = array(
			'pageTitle' => $pagetitle,
			'siteTitle' => $title,
            'admin' => ADMIN,
            'messages' => $messages
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
    
    $app->get('/login', function() use ($app) {
		renderApp($app, 'Please login');
	});
    
    $app->post('/checklogin', function() use ($app) {
        if (isset($_POST['username']) && isset($_POST['password'])){
            $user = trim($_POST['username']); $pass = trim($_POST['password']);
            $db = getConnection();
            $isAdmin = check_user($db, $user, $pass);
            if ($isAdmin){
                $_SESSION['admin'] = 1;
                $app->redirect('/');
            } else {
                $_SESSION['messages'] = "Incorrect username or password ";
                $app->redirect('/login');
            }
        }
    });
    
    $app->get('/sites', function() use ($app){
        if ($app->request->isAjax()){
            $db = getConnection();
            $json = [];
            try {
                $json[site][0] = get_site($db);
            } catch (PDOException $e) {
                $messages .= $e->getMessage();
            }
            $json[site][0]['admin'] = ADMIN;
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
        } else {
            $app->redirect('/');
        }
    });
    
    $app->get('/sites/:id', function($id) use ($app){
        if ($app->request->isAjax()){
            $db = getConnection();
            $json = [];
            try {
                $json[site] = get_site($db);
            } catch (PDOException $e) {
                $messages .= $e->getMessage();
            }
            $json[site]['admin'] = ADMIN;
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
        } else {
            $app->redirect('/');
        }
    });
    
    $app->put('/sites/:id', function($id) use ($app) {
        if ($app->request->isAjax()){
            $json = $app->request->getBody();
            $body = json_decode($json);
            $db = getConnection();
            try {
                update_site($db, $id, $body);
            } catch (PDOException $e) {
                $messages .= $e->getMessage();
            }
        }
    });
	
	$app->get('/prints', function() use ($app) {
		renderApp($app, 'Available Prints');
	});
    
    $app->get('/admin', function() use ($app) {
		renderApp($app, 'Admin');
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