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

    $messages = '';

  /* Image sizes */
  define('XLARGE', 1280);
  define('LARGE', 1024);
  define('MEDIUM', 768);
  define('SMALL', 512);
  define('THUMB', 256);

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

  class PrerenderMiddleware extends \Slim\Middleware
  {
    protected $backendURL;
    protected $token;
    protected $render = false;

    public function __construct($backendURL, $token)
    {
        $this->backendURL = $backendURL;
        $this->token = $token;
    }
    public function call()
    {
        //The Slim application
        $app = $this->app;

        //The Environment object
        $env = $app->environment;

        //The Request object
        $req = $app->request;

        //The Response object
        $res = $app->response;

        $agent = $req->getUserAgent();
        $bots = "!(Googlebot|bingbot|Googlebot-Mobile|Yahoo|YahooSeeker|FacebookExternalHit|Twitterbot|TweetmemeBot|BingPreview|developers.google.com/\+/web/snippet/)!i";

        if (isset($_GET['_escaped_fragment_'])){
          $init = $this->backendURL . $env['slim.url_scheme'] . '://' . $env['HTTP_HOST'] . '/?_escaped_fragment_=' . $_GET['_escaped_fragment_'];
          $this->render = true;
        } else if(preg_match($bots, $agent)){
          $resourceUri = $req->getResourceUri();
          $init = $this->backendURL . $env['slim.url_scheme'] . '://' . $env['HTTP_HOST'] . $resourceUri;
          $this->render = true;
        }

        if ($this->render){
          $ch = curl_init($init);
          $xtoken = 'X-Prerender-Token: ' . $this->token;
          curl_setopt($ch, CURLOPT_HTTPHEADER, array($xtoken));
          curl_setopt($ch, CURLOPT_USERAGENT, $agent);
          curl_setopt($ch, CURLOPT_HEADER, 0);            // No header in the result
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return, do not echo result

          /* Fetch and return content, save it. */
          $prerender = curl_exec($ch);
          curl_close($ch);
          $app->response->setBody($prerender);

        } else { /* Not coming from a bot, render as usual */
            $this->next->call();
        }
    }
  }

	// create the new slim app, set view to our twig class
	$app = new \Slim\Slim(array(
		'view' => new TwigView()
	));

  /* Initiate our prerender middleware */
  $app->add(new \PrerenderMiddleware('http://service.prerender.io/', 'ddcyY6FNLL8zcA4F3Ynt'));

  function renderApp($app, $pagetitle){
    $data = array(
	    'pageTitle' => $pagetitle,
      'admin' => ADMIN,
    //  'messages' => $messages
    );
    $app->render('app.phtml', $data);
  }

	// load the homepage
	$app->get('/', function() use ($app) {
      renderApp($app, 'Welcome to Mahonri Gibson Photographic Works');
  });

  $app->get('/stylesheet/custom', function() use($app) {
      $data = array(
          'body_bg_color' => '#1a1a1a',
      );
      $app->response->headers->set('Content-Type', 'text/css');
      $app->render('customcss.phtml', $data);
  });

  $app->get('/login', function() use ($app) {
		renderApp($app, 'Please login');
	});

  $app->get('/logout', function() use ($app){
    $_SESSION['admin'] = 0;
    $app->redirect('/');
  });

    $app->post('/login', function() use ($app) {
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
            $json = array();
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
            $json = array();
            try {
                $json['site'] = get_site($db);
            } catch (PDOException $e) {
                $messages .= $e->getMessage();
            }
            $json['site']['admin'] = ADMIN;
            $app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($json));
        } else {
            $app->redirect('/');
        }
    });

    $app->put('/sites/:id', function($id) use ($app) {
        if ($app->request->isAjax() && ADMIN){
            $json = $app->request->getBody();
            $body = json_decode($json);
            $db = getConnection();
            try {
                update_site($db, $id, $body);
            } catch (PDOException $e) {
                $messages .= $e->getMessage();
                echo $messages;
            }
        }
    });

    $app->get('/admin', function() use ($app) {
      if (ADMIN){
        renderApp($app, 'Admin');
      } else {
          $app->redirect('/login');
      }
	  });

    $app->get('/about', function() use ($app) {
      renderApp($app, 'About');
    });

    $app->get('/printDetails', function() use ($app) {
      renderApp($app, 'Print Details');
    });

	$app->get('/galleries', function() use ($app) {
		if ($app->request->isAjax()){
        $data = array();
        try {
          $db = getConnection();
          $data['gallery'] = get_galleries($db);
          foreach ($data['gallery'] as &$gallery){
            $id = $gallery['id'];
            $gallery['photos'] = get_gallery_photos($db, $id);
          }
        } catch (PDOException $e){
          $messages .= $e->getMessage();
        }

			$app->response->headers->set('Content-Type', 'application/json');
			$app->response->body(json_encode($data));
		} else {
			renderApp($app, 'View All Galleries');
		}
	});

    $app->get('/galleries/:id', function($id) use ($app) {
        if ($app->request->isAjax()){
            $data = array();
            try {
              $db = getConnection();
              $data['gallery'] = get_gallery($db, $id);
              $data['gallery']['photos'] = get_gallery_photos($db, $id);
            } catch (PDOException $e){
              $messages .= $e->getMessage();
            }
            $app->response->headers->set('Content-Type', 'application/json');
			      $app->response->body(json_encode($data));
		     } else {
			        renderApp($app, 'View Gallery');
		     }
    });

    $app->get('/galleries/photo/:id', function($id) use ($app) {
      renderApp($app, 'View Photo');
    });

    $app->put('/galleries/:id', function($id) use ($app){
      if (ADMIN){
        $json = $app->request->getBody();
        $data = json_decode($json);
        $db = getConnection();
        try {
          update_gallery($db, $id, $data);
        } catch (PDOException $e) {
          $messages .= $e->getMessage();
          echo $messages;
        }
      }
    });

    $app->get('/photo/:id', function($id) use ($app) {
			renderApp($app, 'View Photo');
    });

    $app->get('/gallery/:id', function($id) use ($app) {
      renderApp($app, 'View Gallery');
    });

    $app->get('/gallery/:id/photo/:pid', function($id, $pid) use ($app) {
      renderApp($app, 'View Photo');
    });

    $app->post('/gallery/new', function() use ($app){
      if (isset($_POST['title'])){
        $title = trim($_POST['title']);
        try {
          $db = getConnection();
          $id = add_gallery($db, $title);
        } catch (PDOException $e){
          $messages .= $e->getMessage();
        }
        $data = array('id' => $id, 'title'=>$title);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body(json_encode($data));
      } else {
        echo 'Title not set';
      }
    });

    $app->delete('/galleries/:id', function($id) use($app){
      if (ADMIN){
        try {
          $db = getConnection();
          delete_gallery($db, $id);
        } catch (PDOException $e){
          $messages .= $e->getMessage();
          echo $messages;
        }
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body('{}');
      } else {
        echo 'Not Admin';
      }
    });

    $app->get('/photos', function() use ($app) {
    //    if ($app->request->isAjax()){
            $data = array();
            try {
              $db = getConnection();
              $data['photo'] = get_photos($db);
              foreach ($data['photo'] as &$photo){
                $id = $photo['id'];
                $photo['orderTypes'] = get_photo_orderTypes($db, $id);
                $photo['orderOptions'] = get_photo_orderOptions($db, $id);
              }
            } catch (PDOException $err){
              $messages .= $err->getMessage();
            }

            $app->response->headers->set('Content-Type', 'application/json');
			      $app->response->body(json_encode($data));
    //    } else {
		//	       $app->redirect('/');
		 //   }

    });

    $app->get('/photos/:id', function($id) use ($app) {
    //    if ($app->request->isAjax()){
          $data = array();
            try {
              $db = getConnection();
              $data[photo] = get_photo($db, $id);
              $data[photo][orderTypes] = get_photo_orderTypes($db, $id);
              $data[photo][orderOptions] = get_photo_orderOptions($db, $id);
            } catch (PDOException $err){
              $messages .= $err->getMessage();
            }
            $app->response->headers->set('Content-Type', 'application/json');
			      $app->response->body(json_encode($data));
    //    } else {
		//	       $app->redirect('/');
		//    }

    });

    $app->put('/photos/:id', function($id) use ($app) {
      if ($app->request->isAjax() && ADMIN){
          $json = $app->request->getBody();
          $data = json_decode($json);
          $db = getConnection();
          try {
              update_photo($db, $id, $data);
          } catch (PDOException $e) {
              $messages .= $e->getMessage();
              echo $messages;
          }
      }
    });

    $app->delete('/photos/:id', function($id) use ($app){
      if (ADMIN){
        $db = getConnection();
        try {
            delete_photo($db, $id);
        } catch (PDOException $e) {
            $messages .= $e->getMessage();
        }
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body('{}');
      }
    });

    /* This probably all needs refactored */
    $app->post('/photos/new', function() use ($app){
      if (isset($_FILES['file']) && isset($_POST['title']) && ADMIN){

        if (!file_exists('uploads/')){
          @mkdir ("uploads/", 0755)
            or $error_msg .= "Error creating directory thumbs.";
        }
        if (!file_exists("uploads/thumbs")) {
          @mkdir ("uploads/thumbs", 0755)
            or $error_msg .= "Error creating directory thumbs.";
        }
        if (!file_exists("uploads/small")) {
          @mkdir ("uploads/small", 0755)
            or $error_msg .= "Error creating directory small.";
        }
        if (!file_exists("uploads/medium")) {
          @mkdir ("uploads/medium", 0755)
            or $error_msg .= "Error creating directory medium.";
        }
        if (!file_exists("uploads/large")) {
          @mkdir ("uploads/large", 0755)
            or $error_msg .= "Error creating directory large.";
        }
        if (!file_exists("uploads/xlarge")) {
          @mkdir ("uploads/xlarge", 0755)
            or $error_msg .= "Error creating directory large.";
        }

        include('scripts/simple_image.php');
        $image = new SimpleImage();
        $image->load($_FILES['file']['tmp_name']);
        $filename = $_FILES['file']['name'];
        $xlarge = 'uploads/xlarge/' . $filename;
        $large = 'uploads/large/' . $filename;
        $medium = 'uploads/medium/' . $filename;
        $small = 'uploads/small/' . $filename;
        $thumb = 'uploads/thumbs/' . $filename;
        if ($image->getWidth() >= $image->getHeight()){
            $image->resizeToWidth(XLARGE);
            $image->save($xlarge);
            $image->resizeToWidth(LARGE);
            $image->save($large);
            $image->resizeToWidth(MEDIUM);
            $image->save($medium);
            $image->resizeToWidth(SMALL);
            $image->save($small);
        } else {
            $image->resizeToHeight(XLARGE);
            $image->save($xlarge);
            $image->resizeToHeight(LARGE);
            $image->save($large);
            $image->resizeToHeight(MEDIUM);
            $image->save($medium);
            $image->resizeToHeight(SMALL);
            $image->save($small);
        }
        /* Always want these 256 wide */
        $image->resizeToWidth(THUMB);
        $image->save($thumb);

        $title = $_POST['title'];
        $xlarge = '/' . $xlarge;
        $large = '/' . $large;
        $medium = '/' . $medium;
        $small = '/' . $small;
        $thumb = '/' . $thumb;
        $db = getConnection();
        $id = add_photo($db, $title, $xlarge, $large, $medium, $small, $thumb);
        $data = array('id' => $id, 'title'=>$title, 'xlargeFile'=>$xlarge, 'largeFile'=>$large, 'mediumFile'=>$medium, 'smallFile'=>$small, 'thumbFile' => $thumb, 'error' => $error_msg);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body(json_encode($data));
      } else {
        echo "Error, file or title not set";
      }

    });

  $app->get('/orderTypes', function() use ($app){
    $db = getConnection();
    $data = array();
    try {
       $data['orderType'] = get_order_types($db);
       foreach ($data['orderType'] as &$orderType){
         $id = $orderType['id'];
         $orderType['options'] = get_type_options($db, $id);
       }
    } catch (PDOException $e) {
        $messages .= $e->getMessage();
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->body(json_encode($data));
  });

  $app->get('/orderTypes/:id', function($id) use ($app){
    $db = getConnection();
    $data = array();
    try {
       $data['orderType'] = get_order_type($db, $id);
       $data['orderType']['options'] = get_type_options($db, $id);
    } catch (PDOException $e) {
        $messages .= $e->getMessage();
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->body(json_encode($data));
  });

  $app->post('/orderTypes', function() use ($app){
    if (ADMIN){
      $json = $app->request->getBody();
      $data = json_decode($json);
      $db = getConnection();
      try {
          $id = add_order_type($db, $data);
      } catch (PDOException $e) {
          $messages .= $e->getMessage();
      }
        $response = array();
        $response['orderType'] = array('id' => $id, 'type' => $data->orderType->type);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body(json_encode($response));
    }
  });

  $app->put('/orderTypes/:id', function($id) use ($app){
    if (ADMIN){
      $json = $app->request->getBody();
      $data = json_decode($json);
      $db = getConnection();
      try {
         update_order_type($db, $id, $data);
      } catch (PDOException $e) {
          $messages .= $e->getMessage();
      }
      /*  $response = array();
        $response['orderType'] = array('id' => $id, 'type' => $data->orderType->type, 'options' => $data->orderType->options);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body(json_encode($response));*/
    }
  });

  $app->delete('/orderTypes/:id', function($id) use ($app){
    if (ADMIN){
      $db = getConnection();
      try {
         delete_order_type($db, $id);
      } catch (PDOException $e) {
          $messages .= $e->getMessage();
      }
      $app->response->headers->set('Content-Type', 'application/json');
      $app->response->body('{}');
    }
  });

  $app->get('/orderOptions', function() use ($app){
    $db = getConnection();
    $data = array();
    try {
       $data[orderOption] = get_order_options($db);
    } catch (PDOException $e) {
        $messages .= $e->getMessage();
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->body(json_encode($data));
  });

  $app->get('/orderOptions/:id', function($id) use ($app){
    $db = getConnection();
    $data = array();
    try {
       $data[orderOption] = get_order_option($db, $id);
    } catch (PDOException $e) {
        $messages .= $e->getMessage();
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->body(json_encode($data));
  });

  $app->post('/orderOptions', function() use ($app){
    if (ADMIN){
      $json = $app->request->getBody();
      $data = json_decode($json);
      $db = getConnection();
      try {
          $id = add_order_option($db, $data);
      } catch (PDOException $e) {
          $messages .= $e->getMessage();
          echo $messages;
      }
      $response = array();
      $response['orderOption'] = array(
       'id' => $id,
       'type' => $data->orderOption->type,
       'size' => $data->orderOption->size,
       'price' => $data->orderOption->price);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->body(json_encode($response));
    }
  });

  $app->delete('/orderOptions/:id', function($id) use($app){
    if (ADMIN){
      $db = getConnection();
      try {
         delete_order_option($db, $id);
      } catch (PDOException $e) {
          $messages .= $e->getMessage();
      }
      $app->response->headers->set('Content-Type', 'application/json');
      $app->response->body('{}');
    }
  });

	$app->run();
?>
