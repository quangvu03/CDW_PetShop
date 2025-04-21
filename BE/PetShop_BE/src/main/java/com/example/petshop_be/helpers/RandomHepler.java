package com.example.petshop_be.helpers;
import java.util.UUID;

public class RandomHepler {
        public static String random() {
            return UUID.randomUUID().toString().replace("-","");
        }

    public static String generateOTP() {
        int otp = (int) (Math.random() * 900000) + 100000; // Tạo số từ 100000 đến 999999
        return String.valueOf(otp);
    }

}
