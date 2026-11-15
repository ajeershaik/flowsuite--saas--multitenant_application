import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  BarChart3,
  Users,
  FolderKanban,
  Activity,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';

export const UsagePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    currentOrg,
    activePlan,
    activeSubscription,
    members,
    projects,
    apiRequestsCount,
    currentRole,
  } = useWorkspace();

  const isOwner = currentRole === 'OWNER';

  // Quota Computations
  const seatsUsed = members.length;
  const seatLimit = activePlan.seatLimit;
  const seatPct = seatLimit === -1 ? 0 : Math.min(100, Math.round((seatsUsed / seatLimit) * 100));

  const projectsUsed = projects.length;
  const projectLimit = activePlan.projectLimit;
  const projectPct = projectLimit === -1 ? 0 : Math.min(100, Math.round((projectsUsed / projectLimit) * 100));

  const apiUsed = apiRequestsCount;
  const apiLimit = activePlan.apiRequestLimit;
  const apiPct = Math.min(100, Math.round((apiUsed / apiLimit) * 100));

  // Entitlement Check: ADVANCED_ANALYTICS resolved from featureFlags
  const hasAdvancedAnalytics = Boolean(activePlan.featureFlags.ADVANCED_ANALYTICS);

  // Mock 7-day data
  const weeklyData = [
    { day: 'Mon', count: 45, tasks: 2 },
    { day: 'Tue', count: 78, tasks: 4 },
    { day: 'Wed', count: 62, tasks: 3 },
    { day: 'Thu', count: 91, tasks: 5 },
    { day: 'Fri', count: 110, tasks: 7 },
    { day: 'Sat', count: 32, tasks: 1 },
    { day: 'Sun', count: 48, tasks: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Usage Quotas & Analytics</h1>
          <p className="text-xs text-slate-400">
            Real-time tracking of team seats, active projects, and monthly API request consumption
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Plan Tier:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {activePlan.name} (₹{activePlan.priceMonthly}/mo)
          </span>
        </div>
      </div>

      {/* 3 Main Quota Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seats Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Team Seats</h3>
                <p className="text-[10px] text-slate-500">Allocated user licenses</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400">{seatPct}%</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{seatsUsed}</span>
            <span className="text-xs text-slate-400 font-medium">Cap: {seatLimit} seats</span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                seatPct >= 100 ? 'bg-rose-500' : seatPct >= 80 ? 'bg-amber-500' : 'bg-purple-500'
              }`}
              style={{ width: `${seatPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {seatLimit - seatsUsed > 0 ? `${seatLimit - seatsUsed} seats remaining` : 'Seat capacity maxed'}
          </p>
        </div>

        {/* Projects Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Projects Quota</h3>
                <p className="text-[10px] text-slate-500">Active workspace deliverables</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-400">
              {projectLimit === -1 ? 'Unlimited' : `${projectPct}%`}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{projectsUsed}</span>
            <span className="text-xs text-slate-400 font-medium">
              Limit: {projectLimit === -1 ? 'Unlimited' : projectLimit}
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                projectPct >= 100 ? 'bg-rose-500' : projectPct >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${projectLimit === -1 ? 15 : projectPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {projectLimit === -1 ? 'Unlimited creation allowed' : `${projectLimit - projectsUsed} slots available`}
          </p>
        </div>

        {/* API Requests Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Monthly API Requests</h3>
                <p className="text-[10px] text-slate-500">Atomic Redis counter</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-400">{apiPct}%</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{apiUsed.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">Limit: {apiLimit.toLocaleString()}</span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${apiPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {(apiLimit - apiUsed).toLocaleString()} requests remaining this month
          </p>
        </div>
      </div>

      {/* Advanced Analytics Entitlement Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Advanced Team Analytics & Work Velocity</h2>
              {hasAdvancedAnalytics ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Entitlement Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked (Requires ADVANCED_ANALYTICS)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Resolved dynamically via named entitlement (PRD Section 6.5)
            </p>
          </div>

          {!hasAdvancedAnalytics && isOwner && (
            <button
              onClick={() => onNavigate('plans-billing')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to Professional (₹999)
            </button>
          )}
        </div>

        {hasAdvancedAnalytics ? (
          /* High-Fidelity Chart when Entitlement is granted */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-7 gap-3 pt-6 border-t border-slate-800">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-950/80 rounded-xl p-2 h-44 flex flex-col justify-end items-center border border-slate-800/80">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-lg transition-all duration-500 relative group"
                      style={{ height: `${Math.round((item.count / 120) * 100)}%` }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition">
                        {item.count} reqs
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">Average Velocity</p>
                <p className="text-base font-bold text-white mt-1">4.2 Tasks / Day</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">Completion Ratio</p>
                <p className="text-base font-bold text-emerald-400 mt-1">87.5%</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">API Burst Health</p>
                <p className="text-base font-bold text-sky-400 mt-1">99.98% Healthy</p>
              </div>
            </div>
          </div>
        ) : (
          /* Upgrade Pitch when Entitlement is NOT active */
          <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-3">
            <Lock className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Unlock Advanced Analytics</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              The <strong>ADVANCED_ANALYTICS</strong> feature flag is reserved for the <strong>Professional Plan</strong>.
              Upgrade to visualize team work velocity, API request throughput histograms, and priority health metrics.
            </p>
            {isOwner && (
              <button
                onClick={() => onNavigate('plans-billing')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
              >
                Upgrade to Professional (₹999/mo)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
