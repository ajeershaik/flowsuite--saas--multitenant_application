import React from 'react';
import { PLANS } from '../context/WorkspaceContext';
import {
  Layers,
  ShieldCheck,
  Zap,
  Users,
  Check,
  ArrowRight,
  Database,
  Lock,
  BarChart,
  CreditCard
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FlowSuite</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 transition"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-4xl mx-auto space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant SaaS Workspace Platform • Core Module v1.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              One Workspace. Multiple Tenants.
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Absolute Data Isolation.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              FlowSuite empowers organizations to manage teams, customers, projects, tasks, and Stripe billing
              with dynamic plan entitlements and row-level multi-tenant security.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                Launch Free Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Explore Live Demo
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 border-t border-slate-800/80 bg-slate-900/30 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-2 mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Engineered for Multi-Tenant Excellence</h2>
              <p className="text-sm text-slate-400">Built strictly according to the FlowSuite Core Module PRD</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Row-Level Tenant Isolation</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every project, task, customer, and membership is scoped by organization ID. Cross-tenant leakage is strictly blocked.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Four-Tier Server-Side RBAC</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Distinct permissions for Owner, Admin, Manager, and Member. Members see only assigned work; Owners control billing.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Dynamic Plan Entitlements</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Plan quotas for seats, projects, and API requests are resolved from the database. Integrated with Stripe test sandbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 px-6 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Transparent Pricing</span>
              <h2 className="text-3xl font-extrabold text-white">Choose the plan that fits your team</h2>
              <p className="text-slate-400 text-sm">All plans include complete multi-tenant data isolation and RBAC security.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-slate-900 border rounded-2xl p-8 flex flex-col justify-between transition ${
                    plan.name === 'Starter'
                      ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 relative ring-1 ring-indigo-500'
                      : 'border-slate-800'
                  }`}
                >
                  {plan.name === 'Starter' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">₹{plan.priceMonthly}</span>
                        <span className="text-xs text-slate-400 font-medium">/month</span>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-800 pt-6 text-sm text-slate-300">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>{plan.seatLimit}</strong> Team Seats</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>{plan.projectLimit === -1 ? 'Unlimited' : plan.projectLimit}</strong> Active Projects
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>{plan.apiRequestLimit.toLocaleString()}</strong> API Requests / mo</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className={`w-4 h-4 ${plan.featureFlags.ADVANCED_ANALYTICS ? 'text-emerald-400' : 'text-slate-600'} shrink-0`} />
                        <span className={plan.featureFlags.ADVANCED_ANALYTICS ? 'text-white' : 'text-slate-500'}>
                          Advanced Analytics Entitlement
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Audit Log History</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onNavigate('register')}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                        plan.name === 'Starter'
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {plan.name === 'Free' ? 'Get Started' : 'Subscribe via Stripe'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900 py-8 px-6 text-xs text-slate-500 text-center">
        <p>© 2026 FlowSuite Multi-Tenant SaaS Platform • Option C Java 21 Spring Boot + React Architecture</p>
      </footer>
    </div>
  );
};
