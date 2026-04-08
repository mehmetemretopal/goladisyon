package com.adisyon.backend.controller;

import com.adisyon.backend.entity.Order;
import com.adisyon.backend.entity.OrderItem;
import com.adisyon.backend.entity.Product;
import com.adisyon.backend.repository.OrderRepository;
import com.adisyon.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    

    @PostMapping("/sync")
    public ResponseEntity<?> syncOrders(@RequestBody List<OrderDTO> dtos) {
        // Clear all existing non-completed if we want a pure sync, 
        // but it's dangerous. Let's just create/update based on ID if we can.
        // Actually, frontend IDs are timestamps, we shouldn't wipe DB blindly.
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<OrderDTO> getOrders() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public OrderDTO saveOrder(@RequestBody OrderDTO dto) {
        Order order = new Order();
        if (dto.getId() != null && dto.getId() < 1000000000000L) { // Not a frontend timestamp
            order = orderRepository.findById(dto.getId()).orElse(new Order());
        }
        order.setTableNumber(dto.getTable());
        order.setStatus(dto.getStatus().toUpperCase());
        
        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for(OrderDTO.MenuItemDTO itemDTO : dto.getItems()) {
             OrderItem item = new OrderItem();
             item.setOrder(order);
             item.setQuantity(1);
             item.setUnitPrice(itemDTO.getPrice());
             // For ease, we just find a product or bypass
             Product product = productRepository.findById(itemDTO.getId()).orElse(null);
             if (product != null) {
                 item.setProduct(product);
             }
             items.add(item);
             total = total.add(itemDTO.getPrice());
        }
        order.setItems(items);
        order.setTotalAmount(total);

        // Find waiter by username/displayName
        // We skip exact mapping to avoid foreign key failures if not found.

        order = orderRepository.save(order);
        return toDTO(order);
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTable(order.getTableNumber());
        dto.setStatus(order.getStatus().toLowerCase()); // hazir, bekliyor
        dto.setGarsonName(order.getWaiter() != null ? order.getWaiter().getDisplayName() : "Garson");
        
        List<OrderDTO.MenuItemDTO> items = new ArrayList<>();
        for(OrderItem item : order.getItems()) {
            OrderDTO.MenuItemDTO idto = new OrderDTO.MenuItemDTO();
            idto.setPrice(item.getUnitPrice());
            if (item.getProduct() != null) {
                idto.setId(item.getProduct().getId());
                idto.setName(item.getProduct().getName());
                idto.setCategory(item.getProduct().getCategory());
            }
            items.add(idto);
        }
        dto.setItems(items);
        return dto;
    }
}
