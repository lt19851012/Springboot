package com.today.controller;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.today.bean.User;
import com.today.service.impl.UserServiceImpl;

import net.sf.json.JSONObject;


@Controller
public class UserController {
	
	@Autowired
	UserServiceImpl userService;
	
	@RequestMapping("/index/login")
	public String LoginWeb(Map<String, Object> map, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		User user = (User) session.getAttribute("user");
		if(user != null){			
			map.put("loginFlag", 1);
			map.put("myName", user.getUsername());
			map.put("myPwd", user.getPassword());
			response.sendRedirect(request.getContextPath() + "/index/home");
			return "home";
		}
		map.put("loginFlag", 0);
		map.put("myName", "");
		map.put("myPwd", "");
		return "login";		
	}
	@ResponseBody
	@RequestMapping(value = "/api/login", method = RequestMethod.POST)
	public String Login(@RequestParam(name = "username", required = false) String username,
			@RequestParam(name = "password", required = false) String password, HttpSession session){
		System.out.println("username："+username);
		System.out.println("password："+password);
		JSONObject result = new JSONObject();
		if(username !=null && password !=null){
			User user = userService.findUserByNamePwd(username, password);
			if(user !=null){
				result.put("flag", 1);
			}else {
				result.put("flag", -2);
			}
		}
		return result.toString();
		
	}

}
