<?php
 header('Access-Control-Allow-Origin: *');
require 'flight/Flight.php';

Flight::route('/', function(){
    echo 'hello world!';
});

Flight::route('/user/@name', function($name){
    $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
    $sql = "SELECT * FROM utilisateurs WHERE username='".$name."'";
    $result = $bdd->query($sql);
    if($user = $result->fetch_assoc()){
    	echo json_encode($user);
    } else {echo "no user";
}
});

Flight::route('POST /new', function(){
    if(isset($_POST['logupUsername']) AND isset($_POST['logupEmail']) AND isset($_POST['logupPassword'])){
        $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
        $sql = "INSERT INTO utilisateurs (logupUsername, logupEmail, logupPassword) VALUES ('".$_POST['logupUsername']."', '".$_POST['logupEmail']."', '".$_POST['logupPassword']."')";
    $result = $bdd->query($sql);
    if($result) {
        echo '{ "noteid" : '.$bdd->insert_id.'}';
    }
 else {
        echo '{"error": "error during sql request"}';
    }
} else {
    echo '{"error" : "Wrong parameters"}';
}
});

Flight::route('/allposts/@index', function($index){
    $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
    $sql = "SELECT * FROM fichiers ORDER BY id DESC LIMIT ".$index.", 10"; // seleccionamos
    $result = $bdd->query($sql);
    $posts = array();
    while ($row = $result->fetch_assoc()) {
        array_push($posts, $row);
    }
    echo json_encode($posts);
});

Flight::route('POST /post', function(){
    if(isset($_POST['text']) AND isset($_POST['user_name'])){
        $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
        $sql = "INSERT INTO fichiers(userName, post, photo) VALUES ('".$_POST['user_name']."', '".$_POST['text']."', 'noPhoto')";
    $result = $bdd->query($sql);
        if($result) {
            echo '{ "postid" : '.$bdd->insert_id.'}';
        }   else {
                echo '{"error": "error during sql request"}';
            }
    } else {
        echo '{"error" : "Wrong parameters"}'; 
      }
});

Flight::route('/post/@id', function($id){
    $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
    $sql = "SELECT * FROM fichiers WHERE id=".$id;
    $result = $bdd->query($sql);
    if($post = $result->fetch_assoc()){
        echo json_encode($post);
    } else {echo "no post";
}
});

Flight::route('POST /comment', function(){ 
    if(isset($_POST['text']) AND isset($_POST['user_name']) AND isset($_POST['post_id'])){
        $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
        $sql = "INSERT INTO commentaires(comment, postId, userName) VALUES ('".$_POST['text']."', ".$_POST['post_id'].", '".$_POST['user_name']."')";
        $result = $bdd->query($sql);
        if($result) {
            echo '{ "commentid" : '.$bdd->insert_id.'}';
        }   else {
                echo '{"error": "error during sql request"}';
            }
    } else {
        echo '{"error" : "Wrong parameters"}'; 
      }
});

Flight::route('/comments/@id', function($id){
    $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
    $sql = "SELECT * FROM commentaires WHERE postId = ".$id; // seleccionamos
    $result = $bdd->query($sql);
    $comments = array();
    while ($row = $result->fetch_assoc()) {
        array_push($comments, $row);
    }
    echo json_encode($comments);
});

Flight::route('/friends/@id', function($id){
    $bdd = new mysqli('gironchi.co.mysql', 'gironchi_co', 'gironmanuel', 'gironchi_co');
    $sql = "SELECT username FROM utilisateurs WHERE id != ".$id; // seleccionamos
    $result = $bdd->query($sql);
    $friends = array();
    while ($row = $result->fetch_assoc()) {
        array_push($friends, $row);
    }
    echo json_encode($friends);
});

Flight::start();
?>