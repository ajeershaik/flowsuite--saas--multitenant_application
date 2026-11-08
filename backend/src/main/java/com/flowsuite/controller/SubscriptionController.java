package com.flowsuite.controller;

import com.flowsuite.dto.BillingAndUsageDto.PlanResponse;
import com.flowsuite.dto.BillingAndUsageDto.SubscriptionResponse;
import com.flowsuite.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Subscriptions & Plans", description = "Plan catalog, subscription status, and lifecycle management")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    @Operation(summary = "Get list of active subscription plans and dynamic limits")
    public ResponseEntity<List<PlanResponse>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @GetMapping("/subscriptions/current")
    @Operation(summary = "Get active subscription details for the current organization")
    public ResponseEntity<SubscriptionResponse> getCurrentSubscription() {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription());
    }

    @PostMapping("/subscriptions/cancel")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Schedule subscription cancellation at period end (Owner only)")
    public ResponseEntity<Map<String, String>> cancelSubscription() {
        subscriptionService.cancelSubscriptionAtPeriodEnd();
        return ResponseEntity.ok(Map.of("message", "Subscription scheduled to cancel at end of current billing period."));
    }
}
