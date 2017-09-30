var socket = io("http://localhost:3000");

//server>client
socket.on("server-send-dki-thatbai",function(){
	alert("Duplicate username")
});

//send ds user
socket.on("server-send-ds-user",function(data){
	$("#boxContent").html("");
	data.forEach(function(i){
		$("#boxContent").append("<div class='useronline'>" + i+ "</div>");	
	});
});

//tbao dki thanh cong, hide loginform
socket.on("server-send-dki-thanhcong",function(data){
	alert("Registration successful");
	$("#registerForm").hide();
	// $("#currentUser").html(data);
	$("#loginForm").show();
	// $("#chatForm").show(1000);
	// $("#listMessagesRoom").hide();
	// $("#thongbaoRoom").hide();
	// $("#messagesRoom").hide();
	// $("#sayHiRoom").hide();
});

socket.on("server-send-login",function(data){
	if((data.result)>0)
	{
<<<<<<< HEAD
		alert(data.alert);
		$(".alert-login").html("");
		// $("#registerForm").hide();
		$("#currentUser").html(data.nameuser);
		$("#loginForm").hide(500);
		$("#chatForm").show(1000);
		$("#listMessagesRoom").hide();
		$("#thongbaoRoom").hide();
		$("#messagesRoom").hide();
		$("#sayHiRoom").hide();

=======
		alert(data.reason);
		$(".alert-login").html("");
>>>>>>> 29f4a44ad02e92395ca23036318468cf798f4e89
	} else
		{
			$(".alert-login").html(data.reason);
		}
});

<<<<<<< HEAD
socket.on('all-recived', function(msg) {
	var iduser = $("#iduser").attr('value');
    //console.log(msg.datahtml);
    var listuser = '<li class="listuser fixuser" idobj="090" style="color: white;background: #0288D1;font-weight: bold;cursor: pointer;">Sửa thông tin user</li>';
    for (i = 0; i < msg.datahtml.length; i++) {
        if (iduser == msg.datahtml[i].idObj) {
            listuser += '<li class="listuser activeuser" idobj="' + msg.datahtml[i].idObj + '"     nameobj="'+msg.datahtml[i].nameObj+'" nameuserobj="'+msg.datahtml[i].nameuserobj+'">' + msg.datahtml[i].nameuserobj + '</li>';
        } else {
            listuser += '<li class="listuser" idobj="' + msg.datahtml[i].idObj + '" nameobj="'+msg.datahtml[i].nameObj+'" nameuserobj="'+msg.datahtml[i].nameuserobj+'">' + msg.datahtml[i].nameuserobj + '</li>';
        }
    }
    listuser += "<p>" + msg.reason + "</p>";
    $('#boxContent').html(listuser);
});


=======
>>>>>>> 29f4a44ad02e92395ca23036318468cf798f4e89
socket.on("server-send-room",function(data){
	$("#currentRoom").html(data);
	$("#listMessagesRoom").show(1500);
	$("#thongbaoRoom").show(1500);
	$("#messagesRoom").show(1500);
	$("#listMessages").hide(1000);
	$("#sayHiRoom").show(1500);		
	$("#thongbao").hide(1000);
	$("#messages").hide(1000);
});

socket.on("server-send-messages",function(data){
	var time = new Date().toLocaleString();
	$("#listMessages").prepend("<p class='time'>" + time +"</p><div class='ms'>" + data.un + ":" + data.nd +"</div>");	
});

socket.on("dang-nhap",function(data){
	$("#thongbao").html(data);
});

socket.on("stop-chat",function(){
	$("#thongbao").html("");
});

socket.on("room-dang-nhap",function(data){
	$("#thongbaoRoom").html(data);
});

socket.on("room-stop-chat",function(){
	$("#thongbaoRoom").html("");
});


socket.on("server-chat-room",function(data){
	var time = new Date().toLocaleString();
	$("#listMessagesRoom").prepend("<div class='msRoom'>" + data.un + ":" + data.nd +"</div><p class='time'>" + time +"</p>");	
});

$(document).ready(function(){
	$("#loginForm").show();
	$("#registerForm").hide();
	$("#chatForm").hide();

	//emit username>server
	$("#btnRegister").click(function(){
		// socket.emit("Client-send-username", $("#txtUserName").val());
		$("#loginForm").hide();
		$("#registerForm").show();
	});

	$("#btnBack").click(function(){
	$("#loginForm").show();
	$("#registerForm").hide();
	});

	$("#btnRegisterUser").click(function(e){
	   	var u = $('#txtUserName-register').val();
        var p = $('#txtPassword-register').val();
        var e = $('#txtEmail-register').val();
        var f = $('#txtFisrtName-register').val();
        var l = $('#txtLastName-register').val();
        if(!u||u.length === 0)
        {
        	$('#txtUserName-register').focus();
        	$(".alert-register").html("Username is empty!");
        	return false;
        } else if(!p||p.length ===0)
    		{
    			$('#txtPassword-register').focus();
	        	$(".alert-register").html("Password is empty!");
	        	return false;
    		} else if(!e||e.length ===0)
        		{
        			$('#txtEmail-register').focus();
		        	$(".alert-register").html("Email is empty!");
		        	return false;
        		}else if(!f||f.length ===0)
        		{
        			$('#txtFisrtName-register').focus();
		        	$(".alert-register").html("FisrtName is empty!");
		        	return false;
        		}else if(!l||l.length ===0)
        		{
        			$('#txtLastName-register').focus();
		        	$(".alert-register").html("LastName is empty!");
		        	return false;
        		}
     	socket.emit("Client-send-user-info",{
     		username: u,
     		password: p,
     		email: e,
     		fisrtname: f,
     		lastname: l
     	});
	});

	$("#btnLogin").click(function(){
	    var tmp = {};

        tmp.username = $('#txtUserName').val();
        tmp.password = $('#txtPassword').val();
        if (!tmp.username || tmp.username.length === 0) {
            $('#txtUserName').focus();
            $('.alert-login').html('Bạn chưa nhập user!');
            return false;
        } else if (!tmp.password || tmp.password.length === 0) {
            $('#txtPassword').focus();
            $('.alert-login').html('Bạn chưa nhập password!');
            return false;
        }
        socket.emit('login', tmp);
	});

	$("#btnLogout").click(function(){
		socket.emit("logout");
		$("#loginForm").show(1500);
		$("#chatForm").hide(700);
	});

	$("#btnSendMessages").click(function(){
		 var mess = $('#txtMessages').val();
                if(mess.trim().length<=0){
                    $('#txtMessages').focus();
                    return false;
                } 
             	socket.emit("user-send-messages", $("#txtMessages").val());
				$('#txtMessages').val('');
                $('#txtMessages').focus();
	});

	$("#txtMessages").focusin(function(){
		socket.emit("chatting");
	}); 

	$("#txtMessages").focusout(function(){
		socket.emit("offchat");
	}); 

	$("#txtMessagesRoom").focusin(function(){
		socket.emit("room-chatting");
	}); 

	$("#txtMessagesRoom").focusout(function(){
		socket.emit("room-offchat");
	}); 


	$("#btnRoom1").click(function(){
		socket.emit("join-room1");
	});

	$("#btnLeaveRoom").click(function(){
		socket.emit("leave-room");
		$("#listMessagesRoom").hide(1000);
		$("#thongbaoRoom").hide(1000);
		$("#messagesRoom").hide(1000);
		$("#sayHiRoom").hide(1000);	
		$("#listMessages").show(1500);			
		$("#thongbao").show(1500);
		$("#messages").show(1500);
	})

	$("#btnSendMessagesRoom").click(function(){
			socket.emit("user-send-messages-room", $("#txtMessagesRoom").val());
		});

	// $("#btnRoom2").click(function(){
	// 	socket.emit("join-room2");
	// });

	// $("#btnRoom3").click(function(){
	// 	socket.emit("join-room3");
	// });


});