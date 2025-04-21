package com.example.petshop_be.services.impl;

import com.example.petshop_be.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailserviceImple implements MailService {
	
	@Autowired
	private JavaMailSender sender;

	@Autowired
	private Environment environment;

	@Override
	public boolean send(String from, String to, String subject, String content) {
		try {
			MimeMessage mimeMessage = sender.createMimeMessage();
			MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
			messageHelper.setFrom(from);
			messageHelper.setTo(to);
			messageHelper.setSubject(subject);
			messageHelper.setText(content,true);
			sender.send(mimeMessage);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public boolean sendOtpEmail(String to, String otpCode) {
		try {
			MimeMessage mimeMessage = sender.createMimeMessage();
			MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			String from = environment.getProperty("spring.mail.username");

			messageHelper.setFrom(from);
			messageHelper.setTo(to);
			messageHelper.setSubject("Mã xác thực OTP từ PetShop");

			String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; max-width: 600px; " +
					"margin: auto; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;\">" +
					"<h2 style=\"color: #333;\">Xác thực tài khoản PetShop</h2>" +
					"<p style=\"font-size: 16px; color: #555;\">Xin chào,</p>" +
					"<p style=\"font-size: 16px; color: #555;\">Chúng tôi đã nhận được yêu cầu xác thực tài khoản của bạn. " +
					"Vui lòng sử dụng mã OTP bên dưới để tiếp tục:</p>" +
					"<div style=\"text-align: center; margin: 30px 0;\">" +
					"<span style=\"font-size: 28px; font-weight: bold; color: #2c3e50; " +
					"letter-spacing: 4px; background-color: #eaf4ff; padding: 10px 20px; border-radius: 8px; display: inline-block;\">" +
					otpCode + "</span></div>" +
					"<p style=\"font-size: 14px; color: #999;\">Mã này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>" +
					"<hr style=\"margin: 20px 0;\">" +
					"<p style=\"font-size: 12px; color: #bbb;\">© 2025 PetShop. All rights reserved.</p>" +
					"</div>";

			messageHelper.setText(htmlContent, true);

			sender.send(mimeMessage);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
