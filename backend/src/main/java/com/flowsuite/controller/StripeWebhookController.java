package com.flowsuite.controller;

import com.flowsuite.service.StripeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/stripe/webhooks")
@RequiredArgsConstructor
@Tag(name = "Stripe Webhooks", description = "Verified Stripe webhook event ingestion for subscription updates")
public class StripeWebhookController {

    private final StripeService stripeService;

    @PostMapping
    @Operation(summary = "Handle incoming Stripe webhook events with HMAC signature verification")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        try {
            stripeService.processWebhook(payload, sigHeader);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (IllegalArgumentException e) {
            log.error("Stripe webhook verification error: {}", e.getMessage());
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Error processing Stripe webhook: {}", e.getMessage());
            return new ResponseEntity<>(Map.of("error", "Internal webhook error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
