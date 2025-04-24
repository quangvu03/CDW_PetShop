package com.demo.helpers;

import java.util.Random;

public class RandomNumberHelper {

    public static String generate6DigitString() {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            int digit = random.nextInt(10); // từ 0 đến 9
            sb.append(digit);
        }

        return sb.toString();
    }

    public static void main(String[] args) {
        String randomString = generate6DigitString();
        System.out.println("6-digit random string: " + randomString);
    }
}
