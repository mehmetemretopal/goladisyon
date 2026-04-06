package com.adisyon.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/orders/update")
    @SendTo("/topic/orders")
    public String handleOrderUpdate(String payload) {
        // Will just broadcast the incoming payload (can be JSON representing the orders array or the specific action)
        return payload;
    }
}
