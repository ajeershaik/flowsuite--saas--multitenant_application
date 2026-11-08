package com.flowsuite.dto;

import com.flowsuite.enums.Role;
import com.flowsuite.enums.TaskPriority;
import com.flowsuite.enums.TaskStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class WorkspaceDto {

    // --- Organization & Member ---
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizationDetails {
        private String id;
        private String name;
        private String slug;
        private String status;
        private Instant createdAt;
        private long memberCount;
        private long projectCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateOrganizationRequest {
        @NotBlank(message = "Organization name is required")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberResponse {
        private String id;
        private String userId;
        private String name;
        private String email;
        private Role role;
        private String status;
        private Instant joinedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InviteMemberRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotNull(message = "Role is required")
        private Role role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateMemberRoleRequest {
        @NotNull(message = "Role is required")
        private Role role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvitationResponse {
        private String id;
        private String email;
        private Role role;
        private String status;
        private String token;
        private Instant expiresAt;
        private Instant createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AcceptInvitationRequest {
        @NotBlank(message = "Token is required")
        private String token;

        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Password is required")
        private String password;
    }

    // --- Project ---
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectResponse {
        private String id;
        private String name;
        private String description;
        private String status;
        private LocalDate startDate;
        private LocalDate endDate;
        private String createdBy;
        private String creatorName;
        private Instant createdAt;
        private Instant updatedAt;
        private int totalTasks;
        private int completedTasks;
        private List<String> assignedMemberIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateProjectRequest {
        @NotBlank(message = "Project name is required")
        private String name;

        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<String> memberIds;
        private String customerId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProjectRequest {
        @NotBlank(message = "Project name is required")
        private String name;

        private String description;
        private String status;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<String> memberIds;
    }

    // --- Task ---
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskResponse {
        private String id;
        private String projectId;
        private String projectName;
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private String assignedTo;
        private String assigneeName;
        private String createdBy;
        private LocalDate dueDate;
        private boolean isOverdue;
        private Instant createdAt;
        private Instant completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTaskRequest {
        @NotBlank(message = "Project ID is required")
        private String projectId;

        @NotBlank(message = "Task title is required")
        private String title;

        private String description;
        private TaskPriority priority;
        private String assignedTo;
        private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateTaskRequest {
        @NotBlank(message = "Task title is required")
        private String title;

        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private String assignedTo;
        private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateTaskStatusRequest {
        @NotNull(message = "Task status is required")
        private TaskStatus status;
    }

    // --- Customer ---
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerResponse {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String company;
        private String address;
        private String notes;
        private String status;
        private Instant createdAt;
        private List<String> associatedProjectIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCustomerRequest {
        @NotBlank(message = "Customer name is required")
        private String name;

        private String email;
        private String phone;
        private String company;
        private String address;
        private String notes;
        private List<String> projectIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCustomerRequest {
        @NotBlank(message = "Customer name is required")
        private String name;

        private String email;
        private String phone;
        private String company;
        private String address;
        private String notes;
        private String status;
        private List<String> projectIds;
    }
}
