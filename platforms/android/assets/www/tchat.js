


$("#tchatSubmit").submit(function(event) {
	event.preventDefault();
	var message= $('#text').val();
	socket.emit('ahiva', message);
});

socket.on("gestionMessages", function(rem) {
	$('#messagelist').append("<li>"+  rem + "</li>");
});