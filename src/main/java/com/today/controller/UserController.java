package com.today.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.today.bean.User;
import com.today.service.impl.UserServiceImpl;

@Controller
public class UserController {
	
	@Autowired
	UserServiceImpl userService;
	
	@RequestMapping("/index/login")
	public String Login(Map<String, Object> map, HttpSession session, HttpServletRequest request,
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

}
