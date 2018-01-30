
var cookieToken = sessionStorage.COOKIE_NAME;
if(cookieToken == undefined){
	window.location.href='login.html';
};

$(function(){
	var APPTOKEN = sessionStorage.getItem("APPTOKEN");
	if(APPTOKEN==undefined || APPTOKEN==null) {
    	validAppToken();
	}
	$('#login_back').on('click',function(){
		window.sessionStorage.removeItem("APPTOKEN");
		window.sessionStorage.clear();
		window.location.href='login.html';
	});

	str = sessionStorage.manager;
	obj = JSON.parse(str);
	var Id = obj.id;
	var User = obj.trueName;
	var photoSrc = obj.photo;
	$('#master').html(User);
	$('#picSrc').attr('src', photoSrc);
	$('#roleMess').html('');
	$.each(obj.mRole,function(i,v){
        $('<b>'+v.roleName+'</b>').appendTo('#roleMess');
    });


	$('#changePass').on('click',function(){
		$("#change-pass").modal('show');
	});
	$('#changeBtn').click(function(){
		newPassword = $('#newPass').val();
		data = {
			pwd: newPassword,
	 	}
		$('#changePassForm').validate({
			submitHandler : function (form) {
				$(form).ajaxSubmit({
					type:'POST',
					url:path+'admin/manager/putPassword/'+Id,
					data:data,
					dataType:'json',
					beforeSend: function (request) {
				        request.setRequestHeader("apptoken",appToken);
				        request.setRequestHeader("Authorization","Artlive "+aToken);
				    },
					success:function(res){
						console.log(res);
						if(res.data == 1){
							alert('密码修改成功，请先登录')
							$("#change-pass").modal('hide');
							window.location.href='login.html';
						}
					},
					error:function(data){
					    alert(data.status);
					}
				});
			},
			rules : {
				newPass : {
					required : true,
				},
				newPassword : {
					required : true,
					equalTo: "#newPass"
				}
			},
			messages : {
				newPass : {
					required : '请输入密码！',
				},
				newPassword : {
					required : '请输入密码！',
					equalTo: '两次输入密码不一致！'
				}
			}
		});
	})
})


