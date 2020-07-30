$(function() {
    winHeight = $(window).height();
    $("#passwordWin").css('padding-top', (winHeight * 0.20) + "px");
});

//$(function() {
$("#login").click(function() {
    var username = sessionStorage.getItem("user");
    var pwd = $("#password").val();
    var new_pwd = $("#new_password").val();
    var confirm_new_pwd = $("#confirm_new_password").val();
    if (pwd == "" || new_pwd == "" || confirm_new_pwd == "") {
        layer.msg("新旧密码、确认密码均不能为空");
        return false;
    } else if (new_pwd != confirm_new_pwd) {
        layer.msg("新密码与确认密码不一致");
        return false;
    }
    //对数据加密
    $("#password").prop('type','password');
    $("#new_password").prop('type','password');
    $("#confirm_new_password").prop('type','password');
    //var username = encode64($("#username").val());
    var password = encode64($("#password").val());
    var new_password = encode64($("#new_password").val());
    var confirm_new_password = encode64($("#confirm_new_password").val());
    //$("#username").val(username);
    $("#password").val(password);
    $("#new_password").val(new_password);
    $("#confirm_new_password").val(confirm_new_password);
    //document.fm.submit();

    $.ajax({
        url : base_url+"/api/change",
        type : "post",
        dataType: "json",
        data : {
            "username": username,
            "password": password,
            "new_password": new_password,
            "confirm_new_password": confirm_new_password
        },
        success : function (data) {
            $('#passwordWin').modal('hide');

            if (data.flag == 1) {
                layer.msg("密码修改成功");

            } else if (data.flag == 0) {
                if (loginFlag) {
                    layer.msg("新密码、确认密码均不能为空");
                } else {
                    layer.msg("用户名、新旧密码、确认密码均不能为空");
                    $("#password").val(pwd);
                }
                $("#new_password").val(new_pwd);
                $("#confirm_new_password").val(confirm_new_pwd);
                var checkbox = $("#showPwd")[0];
                showOrHide(checkbox);
            } else if (data.flag == -1) {
                layer.msg("新密码与确认密码不一致");
                if (!loginFlag) {
                    $("#password").val(pwd);
                }
                $("#new_password").val(new_pwd);
                $("#confirm_new_password").val(confirm_new_pwd);
                var checkbox = $("#showPwd")[0];
                showOrHide(checkbox);
            } else if (data.flag == -2) {
                layer.msg("用户名不存在");
                if (!loginFlag) {
                    $("#password").val(pwd);
                }
                $("#new_password").val(new_pwd);
                $("#confirm_new_password").val(confirm_new_pwd);
                var checkbox = $("#showPwd")[0];
                showOrHide(checkbox);
            } else if (data.flag == -3) {
                layer.msg("旧密码错误");

                if (!loginFlag) {
                    $("#password").val(pwd);
                }
                $("#new_password").val(new_pwd);
                $("#confirm_new_password").val(confirm_new_pwd);
                var checkbox = $("#showPwd")[0];
                showOrHide(checkbox);
            } else if (data.flag == -4) {
                layer.msg("密码修改失败,请稍后重试");

                if (!loginFlag) {
                    $("#password").val(pwd);
                }
                $("#new_password").val(new_pwd);
                $("#confirm_new_password").val(confirm_new_pwd);
                var checkbox = $("#showPwd")[0];
                showOrHide(checkbox);
            }
        }
    });
});
//});

$("input[name='userName']").blur(function () {
    $("#user_form").removeClass('has-error');
    $("#user_form label").remove();
    var v = $("input[name='userName']").val();
    if(v == ''){
        $("#user_form").addClass('has-error');
        $("#user_form").append("<label class=\"control-label user_error_info\" style=\"margin-top: 8px\"><i class=\"fa fa-times-circle\" style=\"margin-left: 5px; margin-right: 5px\" aria-hidden=\"true\"></i>用户名不能为空</label>")
    }
});

$("input[name='password']").blur(function () {
    $("#password_form").removeClass('has-error');
    $("#password_form label").remove();
    var v = $("input[name='password']").val();
    if(v == ''){

        $("input[name='password']").tips({   //selector 为jquery选择器
            msg:'旧密码不能为空!',    //你的提示消息  必填
            side:1,  //提示窗显示位置  1，2，3，4 分别代表 上右下左 默认为1（上） 可选
            color:'#FFF', //提示文字色 默认为白色 可选
            bg:'#F00',//提示窗背景色 默认为红色 可选
            time:2,//自动关闭时间 默认2秒 设置0则不自动关闭 可选
            x:0,//横向偏移  正数向右偏移 负数向左偏移 默认为0 可选
            y:0,//纵向偏移  正数向下偏移 负数向上偏移 默认为0 可选
        })
        /*$("#password_form").addClass('has-error');
        $("#password_form").append("<label class=\"control-label user_error_info\" style=\"margin-top: 8px\"><i class=\"fa fa-times-circle\" style=\"margin-left: 5px; margin-right: 5px\" aria-hidden=\"true\"></i>旧密码不能为空</label>")*/
    }
});

$("input[name='new_password']").blur(function () {
    $("#new_password_form").removeClass('has-error');
    $("#new_password_form label").remove();
    var v = $("input[name='new_password']").val();
    if(v == ''){
        $("input[name='new_password']").tips({   //selector 为jquery选择器
            msg:'新密码不能为空!',    //你的提示消息  必填
            side:1,  //提示窗显示位置  1，2，3，4 分别代表 上右下左 默认为1（上） 可选
            color:'#FFF', //提示文字色 默认为白色 可选
            bg:'#F00',//提示窗背景色 默认为红色 可选
            time:2,//自动关闭时间 默认2秒 设置0则不自动关闭 可选
            x:0,//横向偏移  正数向右偏移 负数向左偏移 默认为0 可选
            y:0,//纵向偏移  正数向下偏移 负数向上偏移 默认为0 可选
        })
        /*$("#new_password_form").addClass('has-error');
        $("#new_password_form").append("<label class=\"control-label user_error_info\" style=\"margin-top: 8px\"><i class=\"fa fa-times-circle\" style=\"margin-left: 5px; margin-right: 5px\" aria-hidden=\"true\"></i>新密码不能为空</label>")*/
    }
});

$("input[name='confirm_new_password']").blur(function () {
    $("#confirm_new_password_form").removeClass('has-error');
    $("#confirm_new_password_form label").remove();
    var v = $("input[name='confirm_new_password']").val();
    if(v == ''){
        /*$("#confirm_new_password_form").addClass('has-error');
        $("#confirm_new_password_form").append("<label class=\"control-label user_error_info\" style=\"margin-top: 8px\"><i class=\"fa fa-times-circle\" style=\"margin-left: 5px; margin-right: 5px\" aria-hidden=\"true\"></i>确认密码不能为空</label>")*/
        $("input[name='confirm_new_password']").tips({   //selector 为jquery选择器
            msg:'确认密码不能为空!',    //你的提示消息  必填
            side:1,  //提示窗显示位置  1，2，3，4 分别代表 上右下左 默认为1（上） 可选
            color:'#FFF', //提示文字色 默认为白色 可选
            bg:'#F00',//提示窗背景色 默认为红色 可选
            time:2,//自动关闭时间 默认2秒 设置0则不自动关闭 可选
            x:0,//横向偏移  正数向右偏移 负数向左偏移 默认为0 可选
            y:0,//纵向偏移  正数向下偏移 负数向上偏移 默认为0 可选
        })
    }
});

//密码明文/密文
function showOrHide(checkbox) {
    if (checkbox.checked == true) {
        $("#password").prop('type','text');
        $("#new_password").prop('type','text');
        $("#confirm_new_password").prop('type','text');
    } else {
        $("#password").prop('type','password');
        $("#new_password").prop('type','password');
        $("#confirm_new_password").prop('type','password');
    }
}



