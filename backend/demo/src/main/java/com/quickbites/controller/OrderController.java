package com.quickbites.controller;

import com.quickbites.entity.Order;
import com.quickbites.service.OrderService;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;


    public OrderController(
            OrderService orderService) {

        this.orderService =
                orderService;
    }


    // ========================================
    // GET ALL ORDERS
    // ========================================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();

    }


    // ========================================
    // GET ORDER BY ID
    // ========================================

    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Integer id) {

        return orderService.getOrderById(id);

    }


    // ========================================
    // CREATE ORDER
    // ========================================

    @PostMapping
    public Order createOrder(
            @RequestBody Order order) {

        return orderService.createOrder(order);

    }


    // ========================================
    // UPDATE ORDER
    // ========================================

    @PutMapping("/{id}")
    public Order updateOrder(
            @PathVariable Integer id,
            @RequestBody Order order) {

        return orderService.updateOrder(
                id,
                order
        );

    }


    // ========================================
    // DELETE ORDER
    // ADMIN ONLY
    // ========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Integer id,
            Authentication authentication) {

        // ------------------------------------
        // Check authentication
        // ------------------------------------

        if (
            authentication == null ||
            !authentication.isAuthenticated()
        ) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Not authenticated");

        }


        // ------------------------------------
        // Only ADMIN can delete orders
        // ------------------------------------

        boolean isAdmin =
            authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                    authority.getAuthority()
                        .equals("ROLE_ADMIN")
                );


        if (!isAdmin) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Admin access required");

        }


        // ------------------------------------
        // Check that order exists
        // ------------------------------------

        try {

            orderService.getOrderById(id);

        } catch (RuntimeException exception) {

            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Order not found");

        }


        // ------------------------------------
        // Delete order
        // ------------------------------------

        try {

            orderService.deleteOrder(id);

            return ResponseEntity
                .ok("Order deleted successfully");

        } catch (
            DataIntegrityViolationException exception
        ) {

            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                    "This order cannot be deleted because it is linked to an existing delivery."
                );

        }

    }

}