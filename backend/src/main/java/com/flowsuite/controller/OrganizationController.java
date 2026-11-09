package com.flowsuite.controller;

import com.flowsuite.dto.WorkspaceDto.OrganizationDetails;
import com.flowsuite.dto.WorkspaceDto.UpdateOrganizationRequest;
import com.flowsuite.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
@Tag(name = "Organizations", description = "Endpoints for managing workspace tenant settings and details")
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping("/current")
    @Operation(summary = "Get current authenticated tenant organization details")
    public ResponseEntity<OrganizationDetails> getCurrentOrganization() {
        return ResponseEntity.ok(organizationService.getCurrentOrganization());
    }

    @PutMapping("/current")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update organization settings (Owner or Admin)")
    public ResponseEntity<OrganizationDetails> updateOrganization(@Valid @RequestBody UpdateOrganizationRequest request) {
        return ResponseEntity.ok(organizationService.updateOrganization(request));
    }

    @DeleteMapping("/current")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Delete organization (Owner only)")
    public ResponseEntity<Map<String, String>> deleteOrganization() {
        organizationService.deleteOrganization();
        return ResponseEntity.ok(Map.of("message", "Organization deleted successfully."));
    }
}
