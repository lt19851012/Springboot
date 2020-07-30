package com.today.bean;

import java.io.Serializable;
import java.util.Date;

public class User implements Serializable {
	
	private int id;
	private int sys_type;
	private	String username;
	private	String password;
	private	String email;
	private	String phone;
	private	int status;
	private	int email_verified;
	private	int phone_verified;
	private	String token;
	private	String token_expired;
	private Date create_time;
	private Date update_time;
	private Date last_login;
	private int supply_id;
	private int user_type;
	private int login_num;
	private Date login_time;
	private int delete_status;
	private String wx_openid;
	private String refercode;
	private int acc_id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getSys_type() {
		return sys_type;
	}
	public void setSys_type(int sys_type) {
		this.sys_type = sys_type;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public int getEmail_verified() {
		return email_verified;
	}
	public void setEmail_verified(int email_verified) {
		this.email_verified = email_verified;
	}
	public int getPhone_verified() {
		return phone_verified;
	}
	public void setPhone_verified(int phone_verified) {
		this.phone_verified = phone_verified;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getToken_expired() {
		return token_expired;
	}
	public void setToken_expired(String token_expired) {
		this.token_expired = token_expired;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}
	public Date getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Date update_time) {
		this.update_time = update_time;
	}
	public Date getLast_login() {
		return last_login;
	}
	public void setLast_login(Date last_login) {
		this.last_login = last_login;
	}
	public int getSupply_id() {
		return supply_id;
	}
	public void setSupply_id(int supply_id) {
		this.supply_id = supply_id;
	}
	public int getUser_type() {
		return user_type;
	}
	public void setUser_type(int user_type) {
		this.user_type = user_type;
	}
	public int getLogin_num() {
		return login_num;
	}
	public void setLogin_num(int login_num) {
		this.login_num = login_num;
	}
	public Date getLogin_time() {
		return login_time;
	}
	public void setLogin_time(Date login_time) {
		this.login_time = login_time;
	}
	public int getDelete_status() {
		return delete_status;
	}
	public void setDelete_status(int delete_status) {
		this.delete_status = delete_status;
	}
	public String getWx_openid() {
		return wx_openid;
	}
	public void setWx_openid(String wx_openid) {
		this.wx_openid = wx_openid;
	}
	public String getRefercode() {
		return refercode;
	}
	public void setRefercode(String refercode) {
		this.refercode = refercode;
	}
	public int getAcc_id() {
		return acc_id;
	}
	public void setAcc_id(int acc_id) {
		this.acc_id = acc_id;
	}
	
	
	

}
