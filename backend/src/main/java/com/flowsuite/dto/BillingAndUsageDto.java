package com.flowsuite.dto;

import com.flowsuite.enums.SubscriptionStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public class BillingAndUsageDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanResponse {
        private String id;
        private String name;
        private BigDecimal priceMonthly;
        private String currency;
        private int seatLimit;
        private int projectLimit; // -1 for unlimited
        private int apiRequestLimit;
        private Map<String, Object> featureFlags;
        private boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionResponse {
        private String id;
        private String organizationId;
        private PlanResponse plan;
        private SubscriptionStatus status;
        private String billingCycle;
        private Instant currentPeriodStart;
        private Instant currentPeriodEnd;
        private Instant gracePeriodEnd;
        private boolean cancelAtPeriodEnd;
        private String stripeCustomerId;
        private String stripeSubscriptionId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCheckoutSessionRequest {
        @NotBlank(message = "Plan ID is required")
        private String planId;

        @NotBlank(message = "Success URL is required")
        private String successUrl;

        @NotBlank(message = "Cancel URL is required")
        private String cancelUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutSessionResponse {
        private String sessionId;
        private String checkoutUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceResponse {
        private String id;
        private String invoiceNumber;
        private BigDecimal amount;
        private String currency;
        private String status;
        private Instant createdDate;
        private String hostedInvoiceUrl;
        private String pdfUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageDashboardResponse {
        private String organizationId;
        private String organizationName;
        private PlanResponse currentPlan;
        private SubscriptionStatus subscriptionStatus;
        private int seatsUsed;
        private int seatLimit;
        private double seatUsagePercentage;
        private int projectsUsed;
        private int projectLimit;
        private double projectUsagePercentage;
        private long apiRequestsUsed;
        private int apiRequestLimit;
        private double apiUsagePercentage;
        private boolean hasAdvancedAnalytics;
        private Instant periodStart;
        private Instant periodEnd;
        private List<DailyUsageMetric> dailyActivity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyUsageMetric {
        private String date;
        private long apiRequests;
        private int tasksCompleted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditLogResponse {
        private String id;
        private String actorUserId;
        private String actorName;
        private String targetUserId;
        private String targetName;
        private String action;
        private String entityType;
        private String entityId;
        private String description;
        private String metadata;
        private String ipAddress;
        private Instant createdAt;
    }
}
