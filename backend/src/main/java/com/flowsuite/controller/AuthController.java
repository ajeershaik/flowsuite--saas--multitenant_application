package com.flowsuite.controller;

import com.flowsuite.dto.AuthDto.*;
import com.flowsuite.entity.User;
import com.flowsuite.repository.UserRepository;
import com.flowsuite.security.TenantContext;
import com.flowsuite.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, login, token refresh, and password reset")
public class AuthController {

	private final AuthService authService;
	private final UserRepository userRepository;

	public AuthController(AuthService authService, UserRepository userRepository) {
	    this.authService = authService;
	    this.userRepository = userRepository;
	}

    @PostMapping("/register")
    @Operation(summary = "Register a new user and create an organization with Free plan and OWNER role")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with email and password, returning JWT access and refresh tokens")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Renew expired access token using valid refresh token (rotates refresh token)")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke user's refresh token and active sessions")
    public ResponseEntity<Map<String, String>> logout() {
        String userId = TenantContext.getUserId();
        if (userId != null) {
            authService.logout(userId);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    @PostMapping("/password-reset/request")
    @Operation(summary = "Request a time-limited cryptographically secure password reset token")
    public ResponseEntity<Map<String, String>> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        String message = authService.requestPasswordReset(request);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/password-reset/confirm")
    @Operation(summary = "Confirm password reset using token and set new password")
    public ResponseEntity<Map<String, String>> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        authService.confirmPasswordReset(request);
        return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile and active workspace info")
    public ResponseEntity<UserSummary> getCurrentUser() {
        String userId = TenantContext.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(TenantContext.getRole())
                .build());
    }
}
