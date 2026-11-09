package com.flowsuite.controller;

import com.flowsuite.dto.BillingAndUsageDto.UsageDashboardResponse;
import com.flowsuite.service.UsageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
@Tag(name = "Usage & Analytics", description = "Plan quota consumption, seat and project counters, and analytics")
public class UsageController {

    private final UsageService usageService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Get workspace usage metrics, limits, percentages, and daily activity")
    public ResponseEntity<UsageDashboardResponse> getDashboard() {
        return ResponseEntity.ok(usageService.getDashboard());
    }
}
