package com.example.petshop_be.services;

public interface MailService {
	 boolean send(String from, String to,String subject, String content);

	boolean sendOtpEmail(String to, String otpCode);

}
