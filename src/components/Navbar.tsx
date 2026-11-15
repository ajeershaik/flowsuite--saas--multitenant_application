import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Layers,
  ChevronDown,
  User,
  LogOut,
  Plus,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Navbar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentOrg, currentUser, currentRole, activePlan, activeSubscription, logout } = useWorkspace();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const roleColors: Record<string, string> = {
    OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MANAGER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEMBER: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const planColors: Record<string, string> = {
    Free: 'bg-slate-800 text-slate-300 border-slate-700',
    Starter: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Professional: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Workspace Name */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              FlowSuite
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                SaaS
              </span>
            </span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Current Org Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-white">{currentOrg?.name}</span>
          <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] border ${planColors[activePlan.name]}`}>
            {activePlan.name} Plan
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleColors[currentRole]}`}
          title={`Active RBAC Authority: ROLE_${currentRole}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{currentRole}</span>
        </div>

        {/* Quick Upgrade button for Free tier */}
        {activePlan.name === 'Free' && currentRole === 'OWNER' && (
          <button
            onClick={() => onNavigate('plans-billing')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/20 transition"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Upgrade Plan
          </button>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-1.5 pr-3 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {currentUser?.name?.substring(0, 2) || 'US'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{currentUser?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Authenticated Tenant Scoped</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                My Profile & Credentials
              </button>

              <button
                onClick={() => {
                  onNavigate('org-settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2 transition"
              >
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Organization Settings
              </button>

              <div className="my-1 border-t border-slate-800"></div>

              <button
                onClick={() => {
                  logout();
                  setProfileDropdownOpen(false);
                  onNavigate('login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
