package com.today.dao;

import java.util.List;

import org.apache.ibatis.annotations.Select;
import com.today.bean.User;

public interface UserDao {
	@Select("select * from user")
	public List<User> findUsers();

}
