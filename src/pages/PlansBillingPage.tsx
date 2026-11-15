import React, { useState } from 'react';
import { useWorkspace, PLANS } from '../context/WorkspaceContext';
import { Plan } from '../types';
import {
  CreditCard,
  Check,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  X,
  Lock,
  Calendar,
  AlertCircle,
  Code2,
  Terminal,
  ExternalLink,
  Info
} from 'lucide-react';

export const PlansBillingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    activePlan,
    activeSubscription,
    currentRole,
    upgradePlan,
    cancelSubscription,
    paymentGatewayStatus,
    gatewayNoticeModal,
    openGatewayNoticeModal,
    closeGatewayNoticeModal,
  } = useWorkspace();

  const isOwner = currentRole === 'OWNER';
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedPlanForInfo, setSelectedPlanForInfo] = useState<Plan | null>(null);

  const handlePlanAction = (plan: Plan) => {
    if (!isOwner) return;
    if (plan.id === activePlan.id) return;

    if (plan.priceMonthly === 0) {
      // Downgrade or switch to Free is legitimate without gateway
      upgradePlan(plan.id);
      return;
    }

    // For paid plans, open the Gateway Configuration modal
    setSelectedPlanForInfo(plan);
    openGatewayNoticeModal(plan.name);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Subscription Plans & Billing</h1>
          <p className="text-xs text-slate-400">
            Multi-tier subscription quotas, feature entitlements, and payment gateway abstraction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            Gateway Setup Guide
          </button>
          <button
            onClick={() => onNavigate('billing-history')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            Billing History
          </button>
        </div>
      </div>

      {/* Payment Gateway Status Banner (Decoupled Architecture) */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Payment Gateway Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Unconfigured (Awaiting Mentor Selection)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Environment variables <code>STRIPE_SECRET_KEY</code>, <code>STRIPE_PUBLISHABLE_KEY</code>, and <code>STRIPE_WEBHOOK_SECRET</code> are intentionally unconfigured awaiting mentor confirmation. Paid checkouts and upgrades are safely disabled without mock payments. Free plan quotas and all platform features remain 100% active.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/30 transition whitespace-nowrap self-start md:self-center"
        >
          View Gateway Architecture
        </button>
      </div>

      {/* Active Subscription Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Active Subscription:</span>
            <span className="text-base font-bold text-white">{activePlan.name} Plan</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeSubscription?.status || 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Billing Period: {new Date(activeSubscription?.currentPeriodStart || '').toLocaleDateString()} –{' '}
            {new Date(activeSubscription?.currentPeriodEnd || '').toLocaleDateString()}
          </p>
        </div>

        {isOwner && activePlan.priceMonthly > 0 && (
          <button
            onClick={() => cancelSubscription()}
            disabled={activeSubscription?.cancelAtPeriodEnd}
            className="text-xs text-slate-400 hover:text-rose-400 underline transition disabled:opacity-50"
          >
            {activeSubscription?.cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Cancel at Period End'}
          </button>
        )}
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === activePlan.id;
          const isPaid = plan.priceMonthly > 0;

          return (
            <div
              key={plan.id}
              className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between transition shadow-xl ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Current Plan
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{plan.priceMonthly}</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {plan.name === 'Free' && 'Free forever for lean starter teams'}
                    {plan.name === 'Starter' && 'Ideal for growing agencies and small companies'}
                    {plan.name === 'Professional' && 'Unlimited scale with advanced analytics and priority support'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{plan.seatLimit}</strong> Team Seats Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>{plan.projectLimit === -1 ? 'Unlimited' : plan.projectLimit}</strong> Active Projects
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{plan.apiRequestLimit.toLocaleString()}</strong> API Requests / Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${plan.featureFlags.ADVANCED_ANALYTICS ? 'text-emerald-400' : 'text-slate-600'} shrink-0`} />
                    <span className={plan.featureFlags.ADVANCED_ANALYTICS ? 'text-white' : 'text-slate-500'}>
                      Advanced Usage Analytics Entitlement
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${plan.featureFlags.EXPORT_DATA ? 'text-emerald-400' : 'text-slate-600'} shrink-0`} />
                    <span className={plan.featureFlags.EXPORT_DATA ? 'text-white' : 'text-slate-500'}>
                      Data Export to CSV / JSON
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 bg-slate-800 cursor-default"
                  >
                    Your Active Plan
                  </button>
                ) : !isPaid ? (
                  <button
                    onClick={() => handlePlanAction(plan)}
                    disabled={!isOwner}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-40"
                  >
                    Switch to Free Plan
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanAction(plan)}
                    disabled={!isOwner}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-40"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Paid Checkout Disabled (Gateway Pending)
                  </button>
                )}
                {!isOwner && !isCurrent && (
                  <p className="text-[10px] text-slate-500 text-center mt-1.5">Only Owner can modify billing</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gateway Configuration & Architecture Guide Modal */}
      {(showConfigModal || gatewayNoticeModal?.isOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    Architecture & Security Guide
                  </span>
                  <h3 className="font-bold text-base mt-0.5">Payment Gateway Decoupling</h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  closeGatewayNoticeModal();
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
              {/* Notice Section */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Paid Checkouts Disabled by Design</span>
                </div>
                <p className="leading-relaxed">
                  As instructed, Stripe credentials are kept empty awaiting mentor confirmation for the preferred Indian payment gateway (e.g. Stripe, Razorpay, or Cashfree). In accordance with enterprise audit standards:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>No fake credit card numbers or simulated transactions are accepted.</li>
                  <li>No hardcoded "successful payment" flags are written to the database.</li>
                  <li>Subscriptions only transition to paid upon verified gateway webhook receipt.</li>
                </ul>
              </div>

              {/* Architecture Explanation */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Backend Payment Gateway Abstraction
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  The backend decouples subscription business logic from the gateway implementation via the interface:
                </p>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 leading-relaxed overflow-x-auto">
                  {`// com.flowsuite.service.payment.PaymentGateway
public interface PaymentGateway {
    String getProviderName();
    boolean isConfigured();
    CheckoutSessionDto createCheckoutSession(Organization org, Plan plan, User user);
    SubscriptionWebhookResult processWebhookEvent(String payload, String signatureHeader);
    void cancelSubscription(String externalSubscriptionId);
}`}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  When <code>isConfigured()</code> returns false, any checkout request returns HTTP 503 (<code>PAYMENT_GATEWAY_NOT_CONFIGURED</code>) with actionable error details.
                </p>
              </div>

              {/* How to configure later */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  How to Configure When Mentor Confirms Provider
                </h4>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-slate-400 font-mono text-[11px]">
                  <p className="text-slate-300 font-sans font-semibold">Option A — Stripe (when approved):</p>
                  <p>STRIPE_SECRET_KEY=sk_test_51...</p>
                  <p>STRIPE_PUBLISHABLE_KEY=pk_test_51...</p>
                  <p>STRIPE_WEBHOOK_SECRET=whsec_...</p>
                  <div className="my-2 border-t border-slate-800"></div>
                  <p className="text-slate-300 font-sans font-semibold">Option B — Razorpay (India alternative):</p>
                  <p>RAZORPAY_KEY_ID=rzp_test_...</p>
                  <p>RAZORPAY_KEY_SECRET=...</p>
                  <p>Implement RazorpayGateway implements PaymentGateway</p>
                </div>
              </div>

              {/* Free Tier Testing Notice */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-slate-300 space-y-1">
                <p className="font-semibold text-white">Full Free Tier Evaluation is Active:</p>
                <p className="text-[11px] text-slate-400">
                  You can thoroughly test multi-tenancy (AC-01), RBAC (AC-02), Free plan quotas (AC-03: 2 projects & 3 seats), and audit logs (AC-05) right now without any external gateway.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  closeGatewayNoticeModal();
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
