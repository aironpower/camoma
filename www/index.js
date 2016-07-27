	var currentUser="";
	var currentPost;
	var currentTchat;
	var connectedUsers;
	var friendSocketId="";


$(function(){

	var postList = [];

	$('#loginSubmit').click(function(event) {							// pageIntro
		event.preventDefault();					
		var loginUsername = $('#loginUsername').val();
		var loginPassword = $('#loginPassword').val();
		currentUser = new User (loginUsername, loginPassword);
		currentUser.connect(function(){
			$('#pageIntro').css('display', 'none');
			$('#accueil').fadeIn();
			getPosts(0, function(){
				refreshList();
				currentUser.getFriends(function(){
					refreshListFriends();
					tchatConnect();
				});
			});
		});
	});

	$('#logupButton').click(function(event) {			
		event.preventDefault();	
		$('#logup').fadeIn();
		$('#logupButton').css('display', 'none');
	});

	$('#logupSubmit').click(function(event) {
		event.preventDefault();
		var logupUsername = $('#logupUsername').val();
		var logupEmail = $('#logupEmail').val();
		var logupPassword = $('#logupPassword').val();
		currentUser = new User (logupUsername, logupPassword);
		currentUser.createUser(logupUsername, logupEmail, logupPassword, function() {
		});
	});
																		//ACCUEIL

	$('#ajouteAccueil').on('click', function() {
		$('#accueilAjouteList').slideToggle();
		$('#accueilProfilList').slideUp();
		$('#footerAccueil').slideUp();
	});

	$('#tchatAccueil').on('click', function() {
		$('#accueil').css('display', 'none');
		$('#pageTchatFriends').fadeIn();
		$('#accueilAjouteList').slideUp();
		$('#accueilProfilList').slideUp();
		$('#footerAccueil').slideUp();
	});

	$('#profilAccueil').on('click', function() {	
		$('#accueilAjouteList').slideUp();
		$('#accueilProfilList').slideToggle();
		$('#footerAccueil').slideUp();
	});

	$('#textBurguer').on('click', function() {
		$('#accueilAjouteList').slideToggle();
		$('#footerAccueil').slideToggle(); 
	});

	$('#optionsBurguer').on('click', function() {
		$('#accueilProfilList').slideToggle();
		$('#optionsList').slideToggle(); 
	});

	$('#webLink').on('click', function() {
		$('#optionsList').slideToggle(); 
	});

	$('#rechargeButton').on('click', function() {
		$('#optionsList').slideToggle();
		getPosts(0, function(){
			refreshList();
		});
	});

	$('#deconnexBurguer').on('click', function() {
		location.reload();
	})

	$('#accueilSubmit').on('click', function(event) {
		event.preventDefault();
		var text = $('#accueilText').val();
		var post = new Post(text);
		currentUser.addPost(post);
		$('#footerAccueil').slideToggle();
		$('#postList').prepend('<li class="postList"><h2>'+text+'</h2></li>');
	});

	$('#terrain').on('click', function() {	
		$('#accueilAjouteList').slideUp();
		$('#accueilProfilList').slideUp();
		$('#footerAccueil').slideUp();
	});
																//  POST
	$(document).on('click', '.postList', function(event) {
		event.preventDefault();
		var currentId = $(this).attr('id');
		getPostById(currentId, function () {
			montrerPost();
			currentPost.getComments(function() {
				refreshListComments();
			});			
			$('#accueil').css('display', 'none');
			$('#pagePost').fadeIn();
		});
	});

	$('#sortirPost').on('click', function() {
		$('#pagePost').css('display', 'none');
		$('#accueil').fadeIn();
		$('#footerPost').slideUp();
		$('#listComments').html('');
	});

	$('#commenter').on('click', function() {
		$('#footerPost').slideToggle();
	})

	$('#commentSubmit').on('click', function(event) {
		event.preventDefault();
		var text = $('#commentText').val();
		var comment = new Comment(text);
		currentPost.addComment(comment, currentUser.username); 
		$('#footerPost').slideToggle();
		$('#listComments').prepend('<li class="commentList"><h2>'+text+'</h2></li>');
	});

																//   TCHAT
	$('#sortirTchatFriends').on('click', function() {
		$('#pageTchatFriends').css('display', 'none');
		$('#accueil').fadeIn();
	});

	$(document).on('click', '.connected', function(event) {
		event.preventDefault();
		currentTchat = $(this).attr('id');
		$('#nomTchat').html(currentTchat);
		$('#pageTchatFriends').css('display', 'none');
		$('#pageTchat').fadeIn();
		tchatMessage();
	});

	$(document).on('click', '.grupo', function(event) {
		event.preventDefault();
		$('#pageTchatFriends').css('display', 'none');
		$('#pageTchatGroup').fadeIn();
		tchatGroupMessage();
	});

	$('#sortirTchat').on('click', function() {
		$('#pageTchat').css('display', 'none');
		$('#pageTchatFriends').fadeIn();
		currentTchat = "";
	});

	$('#sortirTchatGroup').on('click', function() {
		$('#pageTchatGroup').css('display', 'none');
		$('#pageTchatFriends').fadeIn();
		currentTchat = "";
	});

																//  FONCTIONS

function getPosts(index, callback) {
	var _this = this;
	$.ajax({
		url: "http://gironchi.co/webservice/allposts/"+index,
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				var post = new Post (data[i].post, data[i].userName);
				post.id = data[i].id;
				post.date = data[i].date;
				postList.push(post);
			}
			callback();
		},
		error: function () {
			console.log("ajax error");
		}
	});
}

function getPostById(id, callback) {
	var _this = this;
	$.ajax({
		url: "http://gironchi.co/webservice/post/"+id,
		dataType: 'json',
		success: function(data) {
			currentPost = new Post (data.post, data.userName);
			currentPost.id = data.id;
			currentPost.date = data.date;
			callback();
		},
		error: function () {
			console.log("ajax error");
		}
	});
}

function refreshList() {
	$('#postList').html('');
	var li= "";
	for (var i in postList) {
		var post = postList[i];
		li += "<li id='"+post.id+"' class='postList'><h2>"+post.userName+"</h2><h3>"+couperText(post.text)+"</h3></li>";
	}
	$('#postList').html(li);
}

function refreshListFriends() {
	$('#friendList').html('<li id="CamomaTchat" class="friendlist grupo"><h2>Pandi Chupi Guay</h2></li>');
	var li= "";
	for (var i in friendList) {
		var friend = friendList[i];		
		li += "<li id='"+friend.username+"' class='friendList'><h2>"+friend.username+"</h2></li>";
	}
	$('#friendList').append(li); 	
	friendList = [];
}

function refreshListComments() {
	$('#listComments').html('');
	var li= "";
	for (var i in commentList) {
		var comment = commentList[i];		
		li += "<li id='"+comment.id+"' class='commentList'><h2>"+couperText(comment.text)+"</h2></li>";
	}
	$('#listComments').html(li); 	
	commentList = [];
}

function montrerPost() {
	$('#postUser').html(currentPost.userName);

	var nomMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
	var date = new Date(currentPost.date);
	var jour = date.getDate();
	var chifreMois = date.getMonth();
	var annee = date.getFullYear();
	$('#postDate').html(jour + ' ' + nomMois[chifreMois] + ' ' + annee);
	$('#postText').html(currentPost.text);
}

function tchatConnect() {
	var socket = io.connect('http://gironchi.co:3000');
	socket.emit('logged', currentUser);
	socket.on("gestionUsers", function(user) {
		connectedUsers = user;
		$('#connectedList').html(" ");
		for (var i = 0; i < user.length; i++) { 
			if (user[i]!=null) {
				$('#'+user[i].username).removeClass("connected");
				if ((currentUser.username != user[i].username) && user[i].tchatControl === 1) {
					$('#'+user[i].username).addClass("connected");
				}
			}
		}
	});
}

function tchatMessage() {
	var socket = io.connect('http://gironchi.co:3000');

	$("#tchatSubmit").on('click', function(event) {
		event.preventDefault();
		var message= $('#tchatText').val();
		socket.emit('ahiva', message, currentUser, currentTchat); 
	});

	socket.on("gestionMessages", function(rem, user, destination) {
		var currentClass = "otherClass";
		if (user.username === currentUser.username) {
			currentClass = "currentClass";
		}
		if ((user.username === currentUser.username) || (currentUser.username === destination)) {
			if ((user.username === currentUser.username) || (currentTchat === user.username)) {
				var jarl = "<li class='"+currentClass+"'>"+ rem + "</li>";
				$('#tchatList').append(jarl);
			} 
		}
	});
}

function tchatGroupMessage() {
	var socket = io.connect('http://gironchi.co:3000');

	$("#tchatGroupSubmit").on('click', function(event) {
		event.preventDefault();
		var message= $('#tchatGroupText').val();
		socket.emit('paustedes', message, currentUser);
	});

	socket.on("gestionMessagesGroup", function(rem, user) {
		var currentClass = "otherClass";
		if (user.username === currentUser.username) {
			currentClass = "currentClass";
			user.username = "";
		}
		var jarl = "<li class='"+currentClass+"'><strong>"+user.username+"</strong> "+ rem + "</li>";
		$('#tchatGroupList').append(jarl);
	});
}

function couperText(text) {
	if (text.length>20) {
		var clone = text;
		var res = clone.slice(0,19)+"...";
		return res; 
	} else {
		return text;
	}
}

/*function getSocketId(username) {
	for (var i = 0; i < connectedUsers.length; i++) { 
		if (connectedUsers[i].username === username) {
			var socketId = connectedUsers[i].socketId;
		}
	}
	return socketId;
}*/

})
