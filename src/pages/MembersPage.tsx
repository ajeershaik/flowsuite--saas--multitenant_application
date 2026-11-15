import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Role } from '../types';
import {
  UserCheck,
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  Copy,
  Check,
  AlertCircle,
  X,
  Mail,
  Clock
} from 'lucide-react';

export const MembersPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    members,
    invitations,
    currentRole,
    activePlan,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useWorkspace();

  const isOwner = currentRole === 'OWNER';
  const isOwnerOrAdmin = isOwner || currentRole === 'ADMIN';

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('MEMBER');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit role modal state
  const [roleModalMember, setRoleModalMember] = useState<{ id: string; name: string; currentRole: Role } | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<Role>('MEMBER');

  const seatLimit = activePlan.seatLimit;
  const seatsUsed = members.length;
  const isSeatLimitReached = seatLimit !== -1 && seatsUsed >= seatLimit;

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const res = inviteMember(inviteEmail, inviteRole);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: `Invitation generated for ${inviteEmail} (Token: ${res.token})` });
      setIsInviteModalOpen(false);
      setInviteEmail('');
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to send invitation.' });
    }
  };

  const handleRoleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalMember) return;

    const res = updateMemberRole(roleModalMember.id, newSelectedRole);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: `Role updated to ${newSelectedRole} for ${roleModalMember.name}` });
      setRoleModalMember(null);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to update role.' });
    }
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) return;

    const res = removeMember(memberId);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: `Removed ${memberName} from workspace.` });
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to remove member.' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const roleBadges: Record<Role, string> = {
    OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MANAGER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEMBER: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Members & Access Control</h1>
          <p className="text-xs text-slate-400">
            Workspace collaborators, invitation links, and server-side RBAC assignments
          </p>
        </div>

        {isOwnerOrAdmin && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition self-start"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-current opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quota Bar */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span>
            Seat Quota: <strong>{seatsUsed}</strong> of <strong>{seatLimit}</strong> seats occupied on{' '}
            <strong className="text-indigo-400">{activePlan.name} Plan</strong>.
          </span>
        </div>
        {isSeatLimitReached && (
          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Seat Limit Reached ({activePlan.name === 'Free' ? 'Free max 3' : 'Starter max 10'})
          </span>
        )}
      </div>

      {/* Members Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Active Members ({members.length})</h2>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Member Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/40 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {m.user.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{m.user.name}</p>
                    <p className="text-[10px] text-slate-500">ID: {m.userId.substring(0, 10)}...</p>
                  </div>
                </td>
                <td className="p-4 text-slate-300">{m.user.email}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${roleBadges[m.role]}`}>
                    {m.role}
                  </span>
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(m.joinedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  {isOwner ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setRoleModalMember({ id: m.id, name: m.user.name, currentRole: m.role });
                          setNewSelectedRole(m.role);
                        }}
                        title="Change Role (Owner Only)"
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px] font-medium"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => handleRemove(m.id, m.user.name)}
                        title="Remove Member (Owner Only)"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">Owner managed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Pending Invitations ({invitations.filter((i) => i.status === 'PENDING').length})</h2>
              <p className="text-xs text-slate-400">Share invitation token with candidate to join this workspace</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{inv.email}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadges[inv.role]}`}>
                      {inv.role}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      Token: <strong className="text-indigo-400">{inv.token}</strong>
                    </span>
                    <span>Expires in 7 days</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(inv.token)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition self-start sm:self-auto"
                >
                  {copiedToken === inv.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken === inv.token ? 'Copied Token' : 'Copy Invite Token'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Invite Team Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Collaborator Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assign Initial Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="ADMIN">ADMIN (Workspace management, no billing)</option>
                  <option value="MANAGER">MANAGER (Projects & Task delegation)</option>
                  <option value="MEMBER">MEMBER (Assigned deliverables only)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <p>
                  Current seat count: <strong>{seatsUsed} / {seatLimit}</strong>. An invitation token will be generated.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                >
                  Generate Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Change Modal (Owner Only) */}
      {roleModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Change Member Role</h3>
              <button onClick={() => setRoleModalMember(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoleChangeSubmit} className="p-5 space-y-4 text-xs">
              <p className="text-slate-300">
                Update permissions for <strong className="text-white">{roleModalMember.name}</strong>:
              </p>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Role</label>
                <select
                  value={newSelectedRole}
                  onChange={(e) => setNewSelectedRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="OWNER">OWNER (Full control + Billing)</option>
                  <option value="ADMIN">ADMIN (Workspace management, no billing)</option>
                  <option value="MANAGER">MANAGER (Projects & Task assignment)</option>
                  <option value="MEMBER">MEMBER (Assigned tasks only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRoleModalMember(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
