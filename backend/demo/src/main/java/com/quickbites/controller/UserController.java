package com.quickbites.controller;

import com.quickbites.entity.User;
import com.quickbites.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;


    public UserController(
            UserRepository userRepository) {

        this.userRepository =
                userRepository;
    }


    // ========================================
    // GET ALL CUSTOMERS
    // ========================================

    @GetMapping("/customers")
    public List<UserResponse> getCustomers(
            Authentication authentication) {

        // ------------------------------------
        // Make sure someone is logged in
        // ------------------------------------

        if (
            authentication == null ||
            !authentication.isAuthenticated()
        ) {
            throw new RuntimeException(
                "Not authenticated"
            );
        }


        // ------------------------------------
        // Only ADMIN can access customers
        // ------------------------------------

        boolean isAdmin =
            authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                    authority.getAuthority()
                        .equals("ROLE_ADMIN")
                );


        if (!isAdmin) {

            throw new RuntimeException(
                "Admin access required"
            );
        }


        // ------------------------------------
        // Get customers from database
        // ------------------------------------

        return userRepository
            .findAll()
            .stream()
            .filter(user ->
                user.getRole() ==
                    User.Role.CUSTOMER
            )
            .map(UserResponse::new)
            .collect(Collectors.toList());
    }

    @GetMapping("/riders")
public List<UserResponse> getRiders(Authentication authentication) {

    if (
        authentication == null ||
        !authentication.isAuthenticated()
    ) {
        throw new RuntimeException("Not authenticated");
    }

    boolean isAdmin =
        authentication.getAuthorities()
            .stream()
            .anyMatch(authority ->
                authority.getAuthority()
                    .equals("ROLE_ADMIN")
            );

    if (!isAdmin) {
        throw new RuntimeException("Admin access required");
    }

    return userRepository
        .findAll()
        .stream()
        .filter(user ->
            user.getRole() == User.Role.RIDER
        )
        .map(UserResponse::new)
        .collect(Collectors.toList());
}

// ========================================
// DELETE CUSTOMER / RIDER
// ========================================

@DeleteMapping("/{id}")
public ResponseEntity<String> deleteUser(
        @PathVariable Integer id,
        Authentication authentication) {

    // ------------------------------------
    // Make sure someone is logged in
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
    // Only ADMIN can delete users
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
    // Find user
    // ------------------------------------

    User user =
        userRepository.findById(id)
            .orElse(null);


    if (user == null) {

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body("User not found");
    }


    // ------------------------------------
    // Never delete an admin account
    // ------------------------------------

    if (user.getRole() == User.Role.ADMIN) {

        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body("Admin users cannot be deleted here");
    }


    // ------------------------------------
    // Delete customer / rider
    // ------------------------------------

    try {

        userRepository.delete(user);

        userRepository.flush();

        return ResponseEntity
            .ok("User deleted successfully");

    } catch (DataIntegrityViolationException exception) {

        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(
                "This user cannot be deleted because they are linked to existing orders or deliveries."
            );
    }
}


    // ========================================
    // SAFE USER RESPONSE
    // ========================================

    public static class UserResponse {

        private Integer id;
        private String name;
        private String email;
        private String role;


        public UserResponse(User user) {

            this.id =
                user.getUserId();

            this.name =
                user.getName();

            this.email =
                user.getEmail();

            this.role =
                user.getRole().name();
        }


        public Integer getId() {
            return id;
        }


        public String getName() {
            return name;
        }


        public String getEmail() {
            return email;
        }


        public String getRole() {
            return role;
        }
    }
}