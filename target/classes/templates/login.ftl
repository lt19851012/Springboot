


<@override name="info"> 
    <#--<p>&nbsp;&nbsp;如果未注册用户，请先访问注册页面</p>-->
</@override>
<@override name="bodyContent">
<div style="width: 500px;background-color: white;border-radius: 6px;margin: 12% auto;">
    <#--<h2 style="color: #222d32;font-size: 24px;padding-top: 30px;padding-left: 50px;">用户登录<i style="float: right" class="fa fa-user-o fa-2x"></i></h2>-->
        <div style="width: 100%;display: flex;white-space: nowrap;height: 60px;line-height: 60px;">
            <div id="loginButton" style="width: 50%;text-align: center;" >
                <a href="${request.contextPath}/index/login" style="border: 1px solid white;border-bottom: 2px solid #01487e;color: black;font-size: 24px;text-decoration: none;display: flex;padding-left: 30%;" >登录页面</a>
            </div>
            <div id="registerButton" style="width: 50%;text-align: center">
                <a  href="${request.contextPath}/index/register"  style="background-color: transparent;color:#222d32;font-size: 24px;text-decoration: none;display: flex;padding-left: 30%;">注册页面</a>
            </div>

        </div>
        <hr style="margin: 0px;"/>
    	
    <div class="divider" style="float: left; margin-bottom: 30px;width: 100%;height:3px;background: #fff;background: rgba(255, 255, 255, 0.8);"></div>
    <input style="display: inline-block;" type="hidden" value=${request.contextPath}  name= "contextPath" id="contextPath"/>
    <form name="fm" style="padding:0px 50px;">
      <div class="form-group" id="user_form" style="margin-bottom: 15px">
        <input required="required" type="text" class="form-control" id="username" name="username" placeholder="用户名">
      </div>
      <div class="form-group" id="password_form" >
        <input required="required" type="password" class="form-control" id="password" name="password" placeholder="密码">
      </div>
      <div class="form-group" id="pwdShowHide" style="margin-bottom: 5px">
          <label style="color: #222d32a3;font-size: 12px;">显示密码</label>
		  <input type="checkbox" id="showPwd" style="position: absolute;margin-left: 5px;" onclick="showOrHide(this)">
      </div>
        <button type="button" id="login"  class="btn btn-success form-control" style="margin-bottom: 20px;background-color: #f47400;font-size: 20px; padding-top: 2.5px;border: none;">登录</button>
        <#--<a id="change_pwd" href=${request.contextPath}/index/changePassword style="background-color: #f47400;font-size: 20px; padding-top: 2.5px;" class="btn btn-warning form-control">修改密码</a>-->


    </form>
</div>
    <script type="text/javascript">
        //拦截器过滤session超时，则提示重新登录
	    $(function() {

	    	if(brurl.indexOf("1")!=-1){
				bootbox.alert("您还未登录或登录已过期，请重新登录");
	    	}
	      
	      });


	    document.onkeydown = function(e){
	    	if(!e) e = window.event;
	    	if((e.keyCode == 13 || e.which == 13)){
				$("#login").click();
			}
		}

	    	$("#login").click(function() {
	    		var username = $("#username").val();
	    		var password = $("#password").val();
	    		if (username == "" || password == "") {
	    			bootbox.alert("用户名、密码不能为空");
	    			return false;
	    		}
	    		//对数据加密
	    		//$("#password").prop('type','password');
	    		//var username = encode64($("#username").val());
    			//var password = encode64($("#password").val());
    			//$("#username").val(username);
	           	// $("#password").val(password);
	            //document.fm.submit();
	            
	            $.ajax({
					url : "${request.contextPath}/api/login",
					type : "post",
					dataType: "json",
					data : {
						"username": username,
						"password": password
					},
					success : function (data) {
						if (data.flag == 1) {
							window.location.replace("${request.contextPath}/index/home");
							
						} else if (data.flag == 0) {
							bootbox.alert("用户名、密码不能为空");
							$("#password").val(pwd);
							var checkbox = $("#showPwd")[0];
            				showOrHide(checkbox);
						} else if (data.flag == -1) {
							bootbox.alert("用户名不存在");
							$("#password").val(pwd);
							var checkbox = $("#showPwd")[0];
            				showOrHide(checkbox);
						} else if (data.flag == -2) {
							bootbox.alert("用户名或密码错误");
							$("#password").val(pwd);
							var checkbox = $("#showPwd")[0];
            				showOrHide(checkbox);
						}
					}
				});
	    	});
	  
    	
        
        
        

		//密码明文/密文
		function showOrHide(checkbox) {
	    	if (checkbox.checked == true) {
	    		$("#password").prop('type','text');
	    	} else {
	    		$("#password").prop('type','password');
	    	}
	    }
    </script>
</@override> 


<@extends name="index.ftl"/>