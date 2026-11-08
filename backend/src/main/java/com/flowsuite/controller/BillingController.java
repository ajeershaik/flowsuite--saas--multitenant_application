package com.flowsuite.controller;

import com.flowsuite.dto.BillingAndUsageDto.CheckoutSessionResponse;
import com.flowsuite.dto.BillingAndUsageDto.CreateCheckoutSessionRequest;
import com.flowsuite.dto.BillingAndUsageDto.InvoiceResponse;
import com.flowsuite.service.StripeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
@Tag(name = "Billing & Stripe Checkout", description = "Stripe test-mode checkout sessions and billing invoice history")
public class BillingController {

    private final StripeService stripeService;

    @PostMapping("/checkout-session")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Create Stripe Checkout session for subscription upgrade or plan change (Owner only)")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            @Valid @RequestBody CreateCheckoutSessionRequest request) {
        return ResponseEntity.ok(stripeService.createCheckoutSession(request));
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Get billing history and Stripe test-mode invoices (Owner only)")
    public ResponseEntity<List<InvoiceResponse>> getInvoices() {
        return ResponseEntity.ok(stripeService.getBillingHistory());
    }

    @GetMapping("/gateway-status")
    @Operation(summary = "Get payment gateway status and whether live checkout is active")
    public ResponseEntity<java.util.Map<String, Object>> getGatewayStatus() {
        boolean configured = stripeService.isConfigured();
        return ResponseEntity.ok(java.util.Map.of(
                "configured", configured,
                "gatewayName", stripeService.getGatewayName(),
                "message", configured 
                        ? "Payment gateway is active and verified." 
                        : "Payment gateway credentials pending mentor confirmation. Paid checkout is disabled."
        ));
    }
}
