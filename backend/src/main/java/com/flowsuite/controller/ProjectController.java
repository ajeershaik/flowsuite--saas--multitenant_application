package com.flowsuite.controller;

import com.flowsuite.dto.WorkspaceDto.*;
import com.flowsuite.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Tenant-scoped project management with dynamic plan limit checks")
public class ProjectController {

    private final ProjectService projectService;
    
    public ProjectController(ProjectService projectService) {
    	this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Get list of projects (scoped to tenant and user role)")
    public ResponseEntity<Page<ProjectResponse>> getProjects(Pageable pageable) {
        return ResponseEntity.ok(projectService.getProjects(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID (enforces tenant and assignment checks)")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Create a new project (Enforces dynamic project limits from active plan)")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return new ResponseEntity<>(projectService.createProject(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable String id,
            @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Archive a project")
    public ResponseEntity<Map<String, String>> archiveProject(@PathVariable String id) {
        projectService.archiveProject(id);
        return ResponseEntity.ok(Map.of("message", "Project archived successfully."));
    }
}
