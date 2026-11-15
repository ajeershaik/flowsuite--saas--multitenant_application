import React, { useState } from 'react';
import {
  Code2,
  Lock,
  Globe,
  CheckCircle2,
  Server,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  role: string;
  authRequired: boolean;
  requestBody?: string;
  responseBody: string;
}

const API_ENDPOINTS: Record<string, EndpointSpec[]> = {
  Authentication: [
    {
      method: 'POST',
      path: '/api/auth/register',
      summary: 'Register user, auto-create organization on Free plan with OWNER role',
      role: 'PUBLIC',
      authRequired: false,
      requestBody: '{\n  "name": "Alice Founder",\n  "email": "alice@acme.com",\n  "password": "SecurePassword123!",\n  "organizationName": "Acme Corp"\n}',
      responseBody: '{\n  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",\n  "refreshToken": "d5a8...",\n  "tokenType": "Bearer",\n  "expiresIn": 900,\n  "user": { "id": "...", "name": "Alice", "role": "OWNER" },\n  "organization": { "id": "...", "name": "Acme Corp", "planName": "Free" }\n}',
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Authenticate with email/password; rate-limited via Redis for failed attempts',
      role: 'PUBLIC',
      authRequired: false,
      requestBody: '{\n  "email": "alice@acme.com",\n  "password": "SecurePassword123!"\n}',
      responseBody: '{\n  "accessToken": "eyJhbGci...",\n  "refreshToken": "...",\n  "user": { ... },\n  "organization": { ... }\n}',
    },
    {
      method: 'POST',
      path: '/api/auth/refresh-token',
      summary: 'Rotate and exchange refresh token for new access and refresh token',
      role: 'PUBLIC',
      authRequired: false,
      requestBody: '{\n  "refreshToken": "uuid-token-string"\n}',
      responseBody: '{\n  "accessToken": "new-jwt-token",\n  "refreshToken": "rotated-uuid-token"\n}',
    },
  ],
  'Projects & Tasks': [
    {
      method: 'GET',
      path: '/api/projects',
      summary: 'List tenant projects. Admins/Managers see all; Members see assigned projects only',
      role: 'MEMBER / MANAGER / ADMIN / OWNER',
      authRequired: true,
      responseBody: '{\n  "content": [\n    {\n      "id": "proj-1",\n      "name": "Portal V2",\n      "status": "ACTIVE",\n      "totalTasks": 8,\n      "completedTasks": 5\n    }\n  ],\n  "totalElements": 1\n}',
    },
    {
      method: 'POST',
      path: '/api/projects',
      summary: 'Create project. Checks dynamic project limits (AC-03: Free max 2 projects)',
      role: 'MANAGER / ADMIN / OWNER',
      authRequired: true,
      requestBody: '{\n  "name": "Customer Portal V2",\n  "description": "Redesign billing view",\n  "memberIds": ["user-1", "user-2"]\n}',
      responseBody: '{\n  "id": "proj-2",\n  "name": "Customer Portal V2",\n  "status": "ACTIVE"\n}',
    },
    {
      method: 'PATCH',
      path: '/api/tasks/{id}/status',
      summary: 'Update task status (TODO, IN_PROGRESS, DONE). Members can update assigned tasks',
      role: 'ALL (Members: assigned tasks)',
      authRequired: true,
      requestBody: '{\n  "status": "DONE"\n}',
      responseBody: '{\n  "id": "task-1",\n  "status": "DONE",\n  "completedAt": "2026-11-08T00:45:00Z"\n}',
    },
  ],
  'Subscriptions & Payment Gateway Abstraction': [
    {
      method: 'GET',
      path: '/api/plans',
      summary: 'Get active plans with dynamic limits (Free ₹0, Starter ₹499, Pro ₹999)',
      role: 'PUBLIC / AUTH',
      authRequired: false,
      responseBody: '[\n  {\n    "id": "plan-free",\n    "name": "Free",\n    "priceMonthly": 0,\n    "seatLimit": 3,\n    "projectLimit": 2,\n    "apiRequestLimit": 1000,\n    "featureFlags": { "ADVANCED_ANALYTICS": false }\n  }\n]',
    },
    {
      method: 'GET',
      path: '/api/billing/gateway-status',
      summary: 'Check if external payment gateway credentials are provided or pending mentor confirmation',
      role: 'PUBLIC / AUTH',
      authRequired: false,
      responseBody: '{\n  "configured": false,\n  "gatewayName": "STRIPE",\n  "message": "Payment gateway credentials pending mentor confirmation. Paid checkout is disabled."\n}',
    },
    {
      method: 'POST',
      path: '/api/billing/checkout-session',
      summary: 'Initiate payment session via PaymentGateway interface (Gracefully disabled if unconfigured)',
      role: 'OWNER',
      authRequired: true,
      requestBody: '{\n  "planId": "plan-starter",\n  "successUrl": "https://flowsuite.io/billing?success=true",\n  "cancelUrl": "https://flowsuite.io/billing"\n}',
      responseBody: '{\n  "sessionId": "cs_test_...",\n  "checkoutUrl": "https://checkout.stripe.com/..."\n}',
    },
    {
      method: 'POST',
      path: '/api/stripe/webhooks',
      summary: 'Verified HMAC-SHA256 signature event handler (idempotent)',
      role: 'STRIPE WEBHOOK',
      authRequired: false,
      responseBody: '{\n  "status": "success"\n}',
    },
  ],
  'Audit Logs & Usage': [
    {
      method: 'GET',
      path: '/api/usage/dashboard',
      summary: 'Get seats, projects, API requests, and check ADVANCED_ANALYTICS entitlement',
      role: 'ADMIN / OWNER',
      authRequired: true,
      responseBody: '{\n  "seatsUsed": 3,\n  "seatLimit": 3,\n  "projectsUsed": 2,\n  "projectLimit": 2,\n  "apiRequestsUsed": 342,\n  "hasAdvancedAnalytics": false\n}',
    },
    {
      method: 'GET',
      path: '/api/audit-logs',
      summary: 'Paginated audit trail filtered by action, actor, and date range',
      role: 'ADMIN / OWNER',
      authRequired: true,
      responseBody: '{\n  "content": [\n    {\n      "action": "PROJECT_CREATED",\n      "actorName": "Alice Owner",\n      "description": "Created project Portal V2",\n      "createdAt": "2026-11-08T00:10:00Z"\n    }\n  ]\n}',
    },
  ],
};

export const ApiExplorerPage: React.FC<{ onNavigate?: (page: string) => void }> = () => {
  const [openGroup, setOpenGroup] = useState<string>('Subscriptions & Payment Gateway Abstraction');
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec | null>(
    API_ENDPOINTS['Subscriptions & Payment Gateway Abstraction'][1]
  );

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    POST: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">OpenAPI / Swagger REST Specification</h1>
          <p className="text-xs text-slate-400">
            Interactive schema documentation for FlowSuite Spring Boot 3.3.5 backend API endpoints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            OpenAPI 3.0 Standard
          </span>
        </div>
      </div>

      {/* Payment Gateway Abstraction Banner */}
      <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl flex items-start gap-3 shadow-lg">
        <CreditCard className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-white">Payment Gateway Abstraction Layer Active</p>
          <p className="text-slate-300 leading-relaxed">
            Subscription business logic is cleanly decoupled from payment providers via the <code>PaymentGateway</code> interface.
            When <code>STRIPE_SECRET_KEY</code> is unconfigured (awaiting mentor confirmation), paid checkout endpoints gracefully return HTTP 503 (<code>PAYMENT_GATEWAY_NOT_CONFIGURED</code>) while plan catalogs, entitlement resolution, and Free tier switching remain 100% active.
          </p>
        </div>
      </div>

      {/* Explorer Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Endpoint Groups</h3>

          <div className="space-y-2">
            {Object.entries(API_ENDPOINTS).map(([group, endpoints]) => {
              const isOpen = openGroup === group;
              return (
                <div key={group} className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenGroup(isOpen ? '' : group)}
                    className="w-full flex items-center justify-between p-3 bg-slate-950/60 hover:bg-slate-950 text-xs font-semibold text-white transition text-left"
                  >
                    <span>{group}</span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-2 space-y-1 bg-slate-900/60">
                      {endpoints.map((ep) => (
                        <button
                          key={ep.method + ep.path}
                          onClick={() => setSelectedEndpoint(ep)}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition ${
                            selectedEndpoint?.path === ep.path && selectedEndpoint?.method === ep.method
                              ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${methodColors[ep.method]}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-[11px] truncate">{ep.path}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Endpoint Inspector */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {selectedEndpoint ? (
            <div className="space-y-5 text-xs">
              <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-slate-800">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${methodColors[selectedEndpoint.method]}`}>
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-white">{selectedEndpoint.path}</span>
              </div>

              <div className="space-y-2">
                <p className="text-slate-300 text-xs">{selectedEndpoint.summary}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Role Requirement: <strong>{selectedEndpoint.role}</strong>
                  </span>
                  <span>•</span>
                  <span>Auth: {selectedEndpoint.authRequired ? 'Bearer JWT Required' : 'Public Endpoint'}</span>
                </div>
              </div>

              {selectedEndpoint.requestBody && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Request JSON Body:
                  </span>
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                    {selectedEndpoint.requestBody}
                  </pre>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Success Response (HTTP 200 / 201):
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  {selectedEndpoint.responseBody}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Standard Error Response (HTTP 400 / 403 / 503):
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                  {`{\n  "timestamp": "2026-11-08T00:50:00Z",\n  "status": 503,\n  "errorCode": "PAYMENT_GATEWAY_NOT_CONFIGURED",\n  "message": "Payment gateway credentials pending mentor confirmation.",\n  "path": "${selectedEndpoint.path}"\n}`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Select an endpoint to inspect its specification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
