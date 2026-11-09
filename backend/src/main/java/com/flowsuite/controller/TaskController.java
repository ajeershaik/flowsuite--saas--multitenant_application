package com.flowsuite.controller;

import com.flowsuite.dto.WorkspaceDto.*;
import com.flowsuite.enums.TaskStatus;
import com.flowsuite.service.TaskService;
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

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task tracking, assignment, status workflow, and overdue management")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get paginated tasks (filterable by project and status)")
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) TaskStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(taskService.getTasks(projectId, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task details by ID")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Create a new task within a project")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return new ResponseEntity<>(taskService.createTask(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Update task details")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status (Members can update their own assigned tasks)")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request));
    }
}
