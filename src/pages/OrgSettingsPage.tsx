import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Building, ShieldAlert, Trash2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export const OrgSettingsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentOrg, currentRole, updateOrgName, deleteOrg } = useWorkspace();
  const [orgName, setOrgName] = useState(currentOrg?.name || '');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  const isOwner = currentRole === 'OWNER';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    updateOrgName(orgName);
    setFeedback('Organization name updated successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = () => {
    if (!isOwner) return;
    if (deleteConfirmationInput !== currentOrg?.name) return;

    deleteOrg();
    setIsDeleteModalOpen(false);
    onNavigate('landing');
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
        <p className="text-xs text-slate-400">
          Manage workspace branding, tenant identification, and administrative lifecycle
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">General Information</h2>
            <p className="text-xs text-slate-400">Primary workspace name and metadata</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Organization Name</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={!isOwner && currentRole !== 'ADMIN'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Tenant ID</label>
              <input
                type="text"
                disabled
                value={currentOrg?.id}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Unique Slug</label>
              <input
                type="text"
                disabled
                value={currentOrg?.slug}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-[11px]"
              />
            </div>
          </div>

          {(isOwner || currentRole === 'ADMIN') && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition text-xs"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone: Delete Workspace */}
      <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-500/10">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Danger Zone</h2>
            <p className="text-xs text-slate-400">Irreversible tenant destruction actions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-white">Delete this Organization</p>
            <p className="text-slate-400 text-[11px]">
              Permanently marks this tenant organization as deleted. Only the verified <strong>OWNER</strong> role can perform this operation.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={!isOwner}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Confirm Workspace Deletion</h3>
              <p className="text-slate-400 text-xs">
                To confirm, please type <strong className="text-rose-400 font-mono">{currentOrg?.name}</strong> below:
              </p>
            </div>

            <input
              type="text"
              placeholder={currentOrg?.name}
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-rose-500"
            />

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmationInput !== currentOrg?.name}
                className="px-4 py-2 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 transition"
              >
                I understand, delete organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
