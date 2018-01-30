/**
 * Created by jm on 2017/12/21.
 */


var verifyCode = new GVerify("v_container");
var oToken = "";
$(function(){

    validAppToken();

    $(".login-box").css("height",$(window).height());
    $(".login-box").css("width",$(window).width());

    $('#login-btn').click(function(){
        $('#login-user').validate({
            submitHandler : function (form) {
                $(form).ajaxSubmit({
                    type:'POST',
                    url:path+'admin/login',
                    dataType:'json',
                    success:function(data){
                        //console.log(data)
                        oToken = data.data.token;
                        sessionStorage.setItem('COOKIE_NAME', oToken);
                        if(data){
                            if(verifyCode.validate($("#code_input").val())){
                                if(data.data.flag == 1){
                                    layer.msg('用户不存在！');
                                    return
                                };
                                if(data.data.flag == 2){
                                    layer.msg('帐号或密码不正确！');
                                    return
                                };
                                if(data.data.flag == 3){
                                    var manager = data.data.manager;
                                    var str = JSON.stringify(manager);
                                    sessionStorage.manager = str;
                                    str = sessionStorage.manager;
                                    obj = JSON.parse(str)
                                    window.location.href='index.html';
                                }
                            }else{
                                layer.msg("验证码输入错误",{
                                    time: 2000
                                });
                            }
                        };
                    },
                    error:function(data){
                        alert(data.status);
                    }
                });
            },
            rules : {
                userName : {
                    required : true,
                },
                password : {
                    required : true,
                },
                code : {
                    required : true,
                }
            },
            messages : {
                userName : {
                    required : '请输入用户名！',
                },
                password : {
                    required : '请输入密码！',
                },
                code : {
                    required : '请输入验证码！',
                }
            }
        });
    })
})