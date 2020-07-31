package com.today.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.today.bean.User;

public interface UserDao {
	@Select("select * from user")
	public List<User> findUsers();
	
	@Select("select * from sys_user where username=#{username} and password=#{psssword}")
	public User findUserByNamePwd(@Param("username") String username, @Param("psssword") String psssword);

}
