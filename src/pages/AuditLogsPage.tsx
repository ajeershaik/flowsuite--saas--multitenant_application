import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { AuditLog } from '../types';
import {
  ScrollText,
  Search,
  Filter,
  Calendar,
  User,
  ShieldAlert,
  Code,
  X,
  Clock,
  Eye
} from 'lucide-react';

export const AuditLogsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { auditLogs, currentRole } = useWorkspace();
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  if (!['OWNER', 'ADMIN'].includes(currentRole)) {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Denied (403)</h2>
        <p className="text-xs text-slate-400">
          Only organization <strong>OWNER</strong> and <strong>ADMIN</strong> roles are authorized to view security audit trails.
        </p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const uniqueActions = Array.from(new Set(auditLogs.map((l) => l.action)));

  const actionColors: Record<string, string> = {
    USER_REGISTERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    USER_LOGGED_IN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MEMBER_INVITED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    INVITATION_ACCEPTED: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    MEMBER_ROLE_CHANGED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    MEMBER_REMOVED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    PROJECT_CREATED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    PROJECT_UPDATED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    PROJECT_ARCHIVED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    TASK_CREATED: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    TASK_UPDATED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    TASK_STATUS_CHANGED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CUSTOMER_CREATED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    CUSTOMER_UPDATED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    CUSTOMER_ARCHIVED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    PLAN_UPGRADED: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    PLAN_DOWNGRADED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    LIMIT_EXCEEDED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Audit Logs</h1>
        <p className="text-xs text-slate-400">
          Immutable event log tracking authentication, membership changes, plan modifications, and workspace operations (AC-05)
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit descriptions, actors, or entity types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Actions ({auditLogs.length})</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action Type</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Description</th>
              <th className="p-4">Entity</th>
              <th className="p-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                  No audit events found matching filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        actionColors[log.action] || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-semibold text-white">{log.actorName}</span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-sm truncate">{log.description}</td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {log.entityType}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setInspectLog(log)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-400 transition"
                      title="Inspect JSON Metadata"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* JSON Metadata Inspector Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Audit Event Details</h3>
              </div>
              <button onClick={() => setInspectLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              <p>
                <strong>Event ID:</strong> <span className="font-mono text-slate-400">{inspectLog.id}</span>
              </p>
              <p>
                <strong>Action:</strong> <span className="text-indigo-400 font-semibold">{inspectLog.action}</span>
              </p>
              <p>
                <strong>Actor:</strong> {inspectLog.actorName} (ID: <span className="font-mono text-[11px] text-slate-400">{inspectLog.actorUserId}</span>)
              </p>
              <p>
                <strong>Description:</strong> {inspectLog.description}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date(inspectLog.createdAt).toISOString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-slate-400 text-[10px] uppercase">JSON Representation:</p>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-48">
                {JSON.stringify(inspectLog, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
