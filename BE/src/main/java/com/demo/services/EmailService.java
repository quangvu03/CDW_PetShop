package com.demo.services;

public interface EmailService {
    public void send(String from, String to, String subject, String content);
}
