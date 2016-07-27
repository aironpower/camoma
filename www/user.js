var User = function(username, password) {
    this.username = username;
    this.password = password;
    this.email= "";
    this.photo = '';
    this.address = "";
    this.id;
    this.posts = [];
}
var friendList = [];

User.prototype.connect = function (callback) {
	var _this = this;    //para que mire al this de User y no al de $.ajax
	$.ajax({
		url: "http://gironchi.co/webservice/user/"+_this.username,
		dataType: 'json',
		success: function(data) {
			if(_this.password == data.password) {
				_this.email = data.email;
				_this.id = data.id;
				callback();
			} else {
				alert ('Mot de passe incorrect');
				console.log(data.idUser);
			}
		},
		error: function() {
				alert ('error conexion');
				console.log("asd");
		}
	});
}
User.prototype.createUser = function(username, email, password) {
	var _this = this;
	$.ajax({
		url: "http://gironchi.co/webservice/new/",
		dataType: 'json',
		type: 'POST',
		data: {
			username: username,
			email: email,
			password: password
		},
		success: function(data) {
			if (data) {
				console.log('saved');
			} else {
				console.log('error ea');
			}
		},
		error : function(){
			console.log("ajax error");
		}
	});
}
User.prototype.addPost = function(post) {
	var _this = this;
	$.ajax({
		url: "http://gironchi.co/webservice/post/",
		dataType: 'json',
		type: 'POST',
		data: {
			user_name: _this.username,
			text: post.text
		},
		success: function(data) {
			if (data.postid) {
				post.id = data.postid;
				console.log('saved');
			} else {
				alert('Error : '+data.error);
				console.log('error');
			}
		},
		error : function(){
			console.log("ajax error");
		}
	});
}
User.prototype.getFriends = function(callback) {
	var _this = this;
	$.ajax({
		url: "http://gironchi.co/webservice/friends/"+_this.id,
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				var friend = new Friend (data[i].username);
				friend.photo = data[i].photo;
				friendList.push(friend);
			}
			callback();
		},
		error: function () {

		}

	});
}