var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
// var mysql =require("mysql");
// 	var connection = mysql.createConnection({
// 		host	: 'localhost',
// 		user 	: 'root',
// 		password: '',
// 		database: 'test',
// 		port 	: 8080
// 	});
// 	connection.connect(function(err) {
// 	  if (err) throw err;
// 	  console.log("Connected!");
// 	});

server.listen(3000);

//mang user
var mangUsers=[]; 

io.on("connection",function(socket){
	console.log("Có "+socket.id+ " kết nối đến server");

	//nhan username tu client
	socket.on("Client-send-username",function(data){
		if(mangUsers.indexOf(data)>=0){
			//fail
			socket.emit("server-send-dki-thatbai");	
			}
			//success
			else{
				mangUsers.push(data);
				socket.Username = data; //tao username
				socket.emit("server-send-dki-thanhcong",data);				
				io.sockets.emit("server-send-ds-user", mangUsers);
			}
		}); 

	socket.on("disconnect",function(){
		mangUsers.splice(
			mangUsers.indexOf(socket.Username),1
			);
		socket.broadcast.emit("server-send-ds-user",mangUsers);
	});

	
	socket.on("logout",function(){
		mangUsers.splice(
			mangUsers.indexOf(socket.Username),1
			);
		socket.broadcast.emit("server-send-ds-user",mangUsers);
	});

	socket.on("leave-room",function(){
		socket.leave("Room 1");
		console.log(socket.adapter.rooms);
	});

	socket.on("user-send-messages",function(data){

		io.sockets.emit("server-send-messages", {un:socket.Username, nd:data});
	});

	socket.on("chatting",function(){
		var s = socket.Username+" đang nhập...";
		socket.broadcast.emit("dang-nhap",s);
	});

	socket.on("offchat",function(){
		io.sockets.emit("stop-chat");
	});

	socket.on("join-room1",function(){
		socket.join("Room 1");
		socket.Phong="Room 1";
		socket.emit("server-send-room","Room 1")
		console.log(socket);
		console.log(socket.adapter.rooms);
	});

	// socket.on("join-room2",function(){
	// 	socket.join("room2");
	// });

	// socket.on("join-room3",function(){
	// 	socket.join("room3");
	// });
	
	socket.on("user-send-messages-room",function(data){
		io.sockets.in(socket.Phong).emit("server-chat-room",{un:socket.Username, nd:data});
	});

	socket.on("room-chatting",function(){
		var s = socket.Username+" đang nhập...";
		socket.broadcast.emit("room-dang-nhap",s);
	});

	socket.on("room-offchat",function(){
		io.sockets.emit("room-stop-chat");
	});

});

app.get("/", function(req,res){
	res.render("trangchu");
});