package com.demo.dtos.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentLinkRequest {
    private String productName;
    private String description;
    private String returnUrl;
    private int price;
    private String cancelUrl;
    private int orderId;
}