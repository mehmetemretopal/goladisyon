package com.adisyon.backend.controller;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private String table;
    private List<MenuItemDTO> items;
    private String status;
    private String garsonName;

    @Data
    public static class MenuItemDTO {
        private Long id;
        private String name;
        private String category;
        private BigDecimal price;
    }
}
