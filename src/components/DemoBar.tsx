import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Role } from '../types';
import { ShieldCheck, Building2, UserCheck, AlertCircle, RefreshCw, Lock, Sparkles } from 'lucide-react';

export const DemoBar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    allOrgs,
    currentOrg,
    currentRole,
    switchTenant,
    switchRole,
    activePlan,
    createProject,
    openGatewayNoticeModal,
  } = useWorkspace();

  const handleTestLimit = () => {
    // Attempt to create a project to test AC-03
    createProject({
      name: 'Over-Limit Verification Project ' + Math.floor(Math.random() * 100),
      description: 'Triggering plan limit check to demonstrate AC-03 quota enforcement.',
    });
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 shadow-inner flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-white font-semibold flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          FlowSuite Evaluator Console
        </span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden md:inline">Instant Multi-Tenancy & RBAC Verification</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Tenant Switcher (AC-01) */}
        <div className="flex items-center bg-slate-800 rounded px-2 py-1 border border-slate-700">
          <Building2 className="w-3 h-3 text-sky-400 mr-1.5" />
          <span className="text-slate-400 mr-1">Tenant:</span>
          <select
            value={currentOrg?.id}
            onChange={(e) => switchTenant(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {allOrgs.map((org) => (
              <option key={org.id} value={org.id} className="bg-slate-800 text-white">
                {org.name} ({org.id === 'org-acme' ? 'Tenant A' : 'Tenant B'})
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher (AC-02) */}
        <div className="flex items-center bg-slate-800 rounded px-2 py-1 border border-slate-700">
          <UserCheck className="w-3 h-3 text-purple-400 mr-1.5" />
          <span className="text-slate-400 mr-1">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => switchRole(e.target.value as Role)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="OWNER" className="bg-slate-800 text-amber-300">OWNER (Full Access)</option>
            <option value="ADMIN" className="bg-slate-800 text-blue-300">ADMIN (Team & Projects)</option>
            <option value="MANAGER" className="bg-slate-800 text-emerald-300">MANAGER (Projects & Tasks)</option>
            <option value="MEMBER" className="bg-slate-800 text-slate-300">MEMBER (Assigned Work Only)</option>
          </select>
        </div>

        {/* Fast Action Buttons */}
        <button
          onClick={handleTestLimit}
          title="Attempts to exceed Free plan 2-project quota (AC-03)"
          className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2 py-1 rounded transition"
        >
          <AlertCircle className="w-3 h-3" />
          Test Limit (AC-03)
        </button>

        {/* Gateway Status Badge & Navigation */}
        <button
          onClick={() => onNavigate('plans-billing')}
          title="Payment Gateway Status: Awaiting Mentor Selection (AC-04)"
          className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded transition"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Gateway: Unconfigured (AC-04)</span>
        </button>

        <button
          onClick={() => onNavigate('audit-logs')}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1 rounded transition"
        >
          <RefreshCw className="w-3 h-3 text-teal-400" />
          Audit Logs (AC-05)
        </button>
      </div>
    </div>
  );
};
