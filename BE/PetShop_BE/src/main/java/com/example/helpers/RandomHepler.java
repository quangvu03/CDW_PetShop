package com.example.helpers;
import java.util.UUID;

public class RandomHepler {
        public static String random() {
            return UUID.randomUUID().toString().replace("-","");
        }

    }
