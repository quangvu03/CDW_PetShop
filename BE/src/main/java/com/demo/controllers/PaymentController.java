// com.demo.controllers.PaymentController.java
package com.demo.controllers;

import com.demo.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    private PayOS payOS;

    @Autowired
    private OrderService orderService;

    @PostMapping("/payos_transfer_handler")
    public ObjectNode payosTransferHandler(@RequestBody ObjectNode body) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            Webhook webhookBody = objectMapper.treeToValue(body, Webhook.class);

            response.put("error", 0);
            response.put("message", "Webhook delivered");
            response.set("data", null);

            WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);
            String status = "PENDING";
            if ("00".equals(data.getCode()) && "Thành công".equalsIgnoreCase(data.getDesc())) {
                status = "PAID";
            } else if ("CANCELLED".equalsIgnoreCase(data.getDesc())) {
                status = "CANCELLED";
            }

            Long payosOrderCode = data.getOrderCode();
            orderService.updatePaymentStatusByOrderCode(payosOrderCode, status); // Sử dụng service

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }
}