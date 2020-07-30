package com.today.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.today.bean.User;
import com.today.dao.UserDao;

@Service
public class UserServiceImpl {
	@Autowired
	UserDao userdao;
	
	public List<User> findUsers() {
		return userdao.findUsers();
	}

}
