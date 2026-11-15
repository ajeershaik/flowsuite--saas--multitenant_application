import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FolderKanban,
  CheckSquare,
  Users2,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    currentOrg,
    currentUser,
    currentRole,
    activePlan,
    projects,
    tasks,
    customers,
    members,
    auditLogs,
    createProject,
  } = useWorkspace();

  const isOwner = currentRole === 'OWNER';
  const isAdmin = currentRole === 'ADMIN';
  const isManager = currentRole === 'MANAGER';
  const isMember = currentRole === 'MEMBER';

  // Quota computations
  const seatLimit = activePlan.seatLimit;
  const projectLimit = activePlan.projectLimit;
  const seatsUsed = members.length;
  const projectsUsed = projects.length;

  const projectPct = projectLimit === -1 ? 0 : Math.min(100, Math.round((projectsUsed / projectLimit) * 100));
  const seatPct = seatLimit === -1 ? 0 : Math.min(100, Math.round((seatsUsed / seatLimit) * 100));

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'DONE').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {currentUser?.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {currentRole}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Workspace: <strong className="text-slate-200">{currentOrg?.name}</strong> • Plan: <strong className="text-indigo-300">{activePlan.name}</strong> (₹{activePlan.priceMonthly}/mo)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(isOwner || isAdmin || isManager) && (
            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          )}

          {isOwner && activePlan.name !== 'Professional' && (
            <button
              onClick={() => onNavigate('plans-billing')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects KPI */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition cursor-pointer shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isMember ? 'Assigned Projects' : 'Active Projects'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{projectsUsed}</span>
            <span className="text-xs text-slate-400 font-medium">
              Limit: {projectLimit === -1 ? 'Unlimited' : projectLimit}
            </span>
          </div>
          {/* Progress bar */}
          {projectLimit !== -1 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    projectPct >= 100 ? 'bg-rose-500' : projectPct >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${projectPct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-right text-slate-500">{projectPct}% utilized</p>
            </div>
          )}
        </div>

        {/* Tasks KPI */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition cursor-pointer shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks & Work</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{tasks.length}</span>
            <span className="text-xs text-emerald-400 font-medium">{completedTasks} completed</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500">{pendingTasks} pending completion</p>
        </div>

        {/* Team Seats KPI */}
        <div
          onClick={() => onNavigate('members')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition cursor-pointer shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Seats</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{seatsUsed}</span>
            <span className="text-xs text-slate-400 font-medium">Limit: {seatLimit} seats</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                seatPct >= 100 ? 'bg-rose-500' : seatPct >= 80 ? 'bg-amber-500' : 'bg-purple-500'
              }`}
              style={{ width: `${seatPct}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-right text-slate-500">{seatPct}% quota consumed</p>
        </div>

        {/* Customers KPI */}
        <div
          onClick={() => (isOwner || isAdmin || isManager) && onNavigate('customers')}
          className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 transition shadow-lg space-y-3 ${
            isMember ? 'opacity-60 cursor-not-allowed' : 'hover:border-slate-700 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CRM Clients</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{customers.length}</span>
            <span className="text-xs text-slate-400 font-medium">Active accounts</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            <span>{isMember ? 'Restricted for Member role' : 'Tenant Isolated'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Active Projects</h2>
              <p className="text-xs text-slate-400">Current ongoing deliverables and deadlines</p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400">No active projects found in this workspace.</p>
              </div>
            ) : (
              projects.slice(0, 4).map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const completed = projectTasks.filter((t) => t.status === 'DONE').length;
                const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

                return (
                  <div
                    key={project.id}
                    onClick={() => onNavigate('projects')}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{project.name}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{project.description || 'No description provided.'}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-white">{progress}%</p>
                        <p className="text-[10px] text-slate-400">{completed}/{projectTasks.length} tasks</p>
                      </div>
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Recent Activity</h2>
                <p className="text-xs text-slate-400">Immutable workspace audit logs</p>
              </div>
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => onNavigate('audit-logs')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  History
                </button>
              )}
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-indigo-400">{log.action}</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 leading-tight">{log.description}</p>
                  <p className="text-[10px] text-slate-500">Actor: {log.actorName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Plan Limit Warning Box */}
          {activePlan.name === 'Free' && isOwner && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Free Plan Limit Caution</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                You have created {projectsUsed} of 2 allowable projects. Upgrading to Starter expands project limit to 20 and seats to 10.
              </p>
              <button
                onClick={() => onNavigate('plans-billing')}
                className="w-full mt-1 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition text-center block"
              >
                Upgrade to Starter (₹499)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
