var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
var mysql =require("mysql");
	var connection = mysql.createConnection({
		host	: 'localhost',
		user 	: 'root',
		password: '',
		database: 'test',
		port 	: 3306
	});
	connection.connect(function(err) {
	  if (err){ 
	  	console.log(err);
        return;}
	  console.log("Connected!");
	});

server.listen(3000);

//mang user
var mangUsers=[]; 

function checkuserdb(username, callback) {
    connection.query("select user_id from user where user_name = '" + username + "'", function(err, result, fields) {
        if (err) {
            console.log('this.sql', this.sql); //command/query
            callback(err, null);
        } else callback(null, result);
    });
}

function insertdb(user_name, user_password, user_email,fisrt_name,last_name, callback) {
	var sql="INSERT INTO user (user_name,user_password,user_email,fisrt_name,last_name) VALUES ('" + user_name + "','" + user_password + "','" + user_email + "','"+ fisrt_name + "','" + last_name + "' ) ";
    connection.query(sql, function(err, result, fields) {
        if (err) {
            console.log('this.sql', this.sql); //command/query
            callback(err, null);
        } else callback(null, result);
    });
}

function checkdangnhap(username, callback) {
		connection.query("select * from user where user_name ='" + username + "'" , function(err, result, fields) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

io.on("connection",function(socket){
	console.log("Có "+socket.id+ " kết nối đến server");

	//nhan thong tin user tu client
	socket.on("Client-send-user-info",function(thongtinuser){
		checkuserdb(thongtinuser.username, function(err, result) {
                if (err) {
                    console.log('err-register:' + err);
                } else {
                    if (typeof result !== 'undefined' && result.length > 0) {
                        // user đã có
                       socket.emit("server-send-dki-thatbai");	
                    } else {
                        //user chưa có
                        console.log('client ' + socket.id + ' vua thuc hien dang ky user ' +thongtinuser.username+' '+thongtinuser.password );
                        insertdb(thongtinuser.username, thongtinuser.password, thongtinuser.email,thongtinuser.fisrtname,thongtinuser.lastname, function(err, result) {
                            if (err){
                                console.log('err-insert' + err)
                            }
                            else {
                               socket.emit('server-send-dki-thanhcong');
                            };
                            });
                    }
                }
            });
	});

	socket.on("login", function(thongtinuser){
		var user = thongtinuser.username;
		checkdangnhap(thongtinuser.username,function(err,data)
		{
		// connection.query("select * from user where user_name ='" + user_name + "'" , function(err, result, fields) {
        	 // and user_password ='" + user_password + "'
        	if (err) {
                console.log('err:' + err);
                console.log('error SQL');
            } else{

            	if(data.length>0){
            		if(thongtinuser.password == data[0].user_password){
            			console.log('login success!');
            		}
            		else{
            			console.log('emaill and password does not match!');
            		}
            	}
            	else{
            		console.log("email not exist!");
            	}
            }
        });
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
		// console.log(socket.adapter.rooms);
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
		// console.log(socket);
		// console.log(socket.adapter.rooms);
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