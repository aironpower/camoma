var Post = function(text, userName) {
	this.id = 0;
	this.userName=userName;
	this.text = text;
	this.photo = '';
	this.date = '';
}
var commentList = [];

Post.prototype.addComment = function(comment, userName) {
	var _this = this; console.log(this.id, comment.text, userName)
	$.ajax({
		url: "http://localhost/projet/webservice/comment/",
		dataType: 'json',
		type: 'POST',
		data: {
			post_id: _this.id,
			text: comment.text,
			user_name: userName
		},
		success: function(data) {
			if (data.commentid) {
				comment.id = data.commentid;
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

Post.prototype.getComments = function(callback) {
	var _this = this; 
	$.ajax({
		url: "http://localhost/projet/webservice/comments/"+_this.id,
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				var comment = new Comment (data[i].comment, _this.id);
				comment.userName = data[i].userName;
				comment.date = data[i].date;
				commentList.push(comment);
			}
			callback();
		},
		error: function () {
			console.log("ajax error")
		}

	});
}