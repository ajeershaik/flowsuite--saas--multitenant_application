import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { User, Shield, Building, Key, CheckCircle2, Mail, Calendar } from 'lucide-react';

export const ProfilePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, currentOrg, currentRole } = useWorkspace();
  const [name, setName] = useState(currentUser?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Profile credentials updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400">
          Personal identification, role assignments, and security credentials
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-extrabold text-white uppercase shadow-lg shadow-indigo-600/20">
            {currentUser?.name?.substring(0, 2) || 'US'}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{currentUser?.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentUser?.email}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                ROLE: {currentRole}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{currentOrg?.name}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={currentUser?.email}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">Single organization bound account email</p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" />
              Update Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 chars"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition text-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
