package com.example.Services;

public interface MailService {
	public boolean send(String from, String to,String subject, String content);
}
