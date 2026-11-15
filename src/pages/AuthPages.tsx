import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Role } from '../types';
import {
  Layers,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface AuthPagesProps {
  initialView?: 'login' | 'register' | 'forgot-password' | 'accept-invite';
  onNavigate: (page: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialView = 'login', onNavigate }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password' | 'accept-invite'>(initialView);
  const { login, register, acceptInvitation, invitations, currentOrg } = useWorkspace();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [inviteToken, setInviteToken] = useState(invitations[0]?.token || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !orgName) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    register(name, email, orgName);
    onNavigate('dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email);
    if (ok) {
      onNavigate('dashboard');
    } else {
      // Default to entering demo workspace
      onNavigate('dashboard');
    }
  };

  const handleQuickLogin = (userEmail: string, role: Role) => {
    login(userEmail, role);
    onNavigate('dashboard');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({
      type: 'success',
      text: 'If an account exists for this email, password reset instructions have been logged to the server console.',
    });
  };

  const handleAcceptInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken || !name || !password) {
      setMessage({ type: 'error', text: 'Please fill in token, your name, and password.' });
      return;
    }
    const ok = acceptInvitation(inviteToken, name);
    if (ok) {
      setMessage({ type: 'success', text: 'Invitation accepted! You have joined the workspace.' });
      setTimeout(() => onNavigate('dashboard'), 1500);
    } else {
      setMessage({ type: 'error', text: 'Invalid or expired invitation token.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 cursor-pointer group mb-2"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">FlowSuite</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {view === 'register' && 'Create your SaaS workspace'}
            {view === 'login' && 'Welcome back to FlowSuite'}
            {view === 'forgot-password' && 'Reset your password'}
            {view === 'accept-invite' && 'Accept Workspace Invitation'}
          </h2>
          <p className="text-xs text-slate-400">
            {view === 'register' && 'Starts automatically on the Free plan with OWNER privileges'}
            {view === 'login' && 'Sign in to access your tenant-isolated workspace'}
            {view === 'forgot-password' && 'Enter your verified account email to receive a reset token'}
            {view === 'accept-invite' && 'Enter your invitation token to connect to your team'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workspace / Organization Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alice Founder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="alice@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
              >
                Create Workspace & Launch
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="alice@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast RBAC Profile Selectors */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 text-center">
                  Quick-Sign-In as Demo Roles:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('alice@acme.com', 'OWNER')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-left transition"
                  >
                    <p className="text-[11px] font-bold text-amber-300">Alice (Owner)</p>
                    <p className="text-[9px] text-slate-400">Full Access + Billing</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('alex.admin@acme.com', 'ADMIN')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-blue-500/30 text-left transition"
                  >
                    <p className="text-[11px] font-bold text-blue-300">Alex (Admin)</p>
                    <p className="text-[9px] text-slate-400">Team & Projects</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('maria.manager@acme.com', 'MANAGER')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-left transition"
                  >
                    <p className="text-[11px] font-bold text-emerald-300">Maria (Manager)</p>
                    <p className="text-[9px] text-slate-400">Projects & Tasks</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('mike.member@acme.com', 'MEMBER')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition"
                  >
                    <p className="text-[11px] font-bold text-slate-300">Mike (Member)</p>
                    <p className="text-[9px] text-slate-400">Assigned Tasks Only</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot-password' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
              >
                Send Password Reset Token
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 block"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* ACCEPT INVITATION VIEW */}
          {view === 'accept-invite' && (
            <form onSubmit={handleAcceptInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Invitation Token</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="inv_xxxx"
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Set Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
              >
                Accept & Join Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Toggle View Links */}
          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            {view === 'login' && (
              <>
                <span>Don't have a workspace?</span>
                <button
                  onClick={() => setView('register')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Create one free
                </button>
              </>
            )}
            {view === 'register' && (
              <>
                <span>Already registered?</span>
                <button
                  onClick={() => setView('login')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Sign in
                </button>
              </>
            )}
            {view !== 'accept-invite' && (
              <span className="text-slate-600">•</span>
            )}
            {view !== 'accept-invite' && (
              <button
                onClick={() => setView('accept-invite')}
                className="text-slate-400 hover:text-white"
              >
                Have an invite token?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
