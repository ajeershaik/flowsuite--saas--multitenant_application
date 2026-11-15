package com.flowsuite.controller;

import com.flowsuite.dto.WorkspaceDto.*;
import com.flowsuite.service.CustomerService;
import com.flowsuite.service.MembershipService;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Memberships & Invitations", description = "Team member invitations, role management, and seat limits")
public class MemberController {

    private final MembershipService membershipService;
    
    public MemberController(MembershipService membershipService) {
    	this.membershipService = membershipService;
    }

    @GetMapping
    @Operation(summary = "Get all members of the authenticated organization")
    public ResponseEntity<List<MemberResponse>> getMembers() {
        return ResponseEntity.ok(membershipService.getMembers());
    }

    @GetMapping("/paginated")
    @Operation(summary = "Get paginated members of the organization")
    public ResponseEntity<Page<MemberResponse>> getMembersPaginated(Pageable pageable) {
        return ResponseEntity.ok(membershipService.getMembersPaginated(pageable));
    }

    @PostMapping("/invite")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Invite a new member to the organization (Enforces seat limit)")
    public ResponseEntity<InvitationResponse> inviteMember(@Valid @RequestBody InviteMemberRequest request) {
        return new ResponseEntity<>(membershipService.inviteMember(request), HttpStatus.CREATED);
    }

    @PostMapping("/accept")
    @Operation(summary = "Accept an invitation using invitation token")
    public ResponseEntity<MemberResponse> acceptInvitation(@Valid @RequestBody AcceptInvitationRequest request) {
        return ResponseEntity.ok(membershipService.acceptInvitation(request));
    }

    @PutMapping("/{memberId}/role")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Change a member's role (Owner only)")
    public ResponseEntity<MemberResponse> updateMemberRole(
            @PathVariable String memberId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        return ResponseEntity.ok(membershipService.updateMemberRole(memberId, request));
    }

    @DeleteMapping("/{memberId}")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Remove a member from the organization (Owner only)")
    public ResponseEntity<Map<String, String>> removeMember(@PathVariable String memberId) {
        membershipService.removeMember(memberId);
        return ResponseEntity.ok(Map.of("message", "Member removed successfully."));
    }

    @GetMapping("/invitations")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Get list of pending invitations")
    public ResponseEntity<List<InvitationResponse>> getPendingInvitations() {
        return ResponseEntity.ok(membershipService.getPendingInvitations());
    }
}
