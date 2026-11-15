import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Project } from '../types';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Archive,
  Edit,
  ArrowRight,
  X,
  AlertTriangle
} from 'lucide-react';

export const ProjectsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    projects,
    members,
    currentRole,
    activePlan,
    createProject,
    updateProject,
    archiveProject,
    customers,
  } = useWorkspace();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const isOwnerOrAdminOrManager = ['OWNER', 'ADMIN', 'MANAGER'].includes(currentRole);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setName('');
    setDescription('');
    setSelectedMemberIds([]);
    setSelectedCustomerId('');
    setIsModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const res = createProject({
      name,
      description,
      memberIds: selectedMemberIds,
      customerId: selectedCustomerId || undefined,
    });

    if (res.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects Management</h1>
          <p className="text-xs text-slate-400">
            {currentRole === 'MEMBER'
              ? 'Projects assigned directly to your account (Tenant isolated)'
              : 'Workspace deliverables, deadlines, and assigned contributors'}
          </p>
        </div>

        {isOwnerOrAdminOrManager && (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition self-start"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        )}
      </div>

      {/* Plan Quota Reminder Bar */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-indigo-400" />
          <span>
            Current Quota: <strong>{projects.length}</strong> of{' '}
            <strong>{activePlan.projectLimit === -1 ? 'Unlimited' : activePlan.projectLimit}</strong> allowable projects on{' '}
            <strong className="text-indigo-400">{activePlan.name} Plan</strong>.
          </span>
        </div>
        {activePlan.name === 'Free' && projects.length >= 2 && (
          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Limit reached (Upgrade to Starter)
          </span>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'No projects match your search query.' : 'Create your first project to start organizing tasks and collaborating.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const assignedMembers = members.filter((m) => project.assignedMemberIds.includes(m.userId));

            return (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {project.status}
                    </span>
                    {isOwnerOrAdminOrManager && (
                      <button
                        onClick={() => archiveProject(project.id)}
                        title="Archive Project"
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{project.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{project.startDate || 'No start date'}</span>
                    </div>
                    <span>Created by: {project.creatorName || 'Team'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-1.5">
                      {assignedMembers.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          title={m.user.name}
                          className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase"
                        >
                          {m.user.name.substring(0, 2)}
                        </div>
                      ))}
                      {assignedMembers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[9px] font-medium text-slate-300">
                          +{assignedMembers.length - 3}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate('tasks')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                      View Tasks
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Create New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App V2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Goals, deliverables, and scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Link to Customer CRM (Optional)</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="">No Customer Associated</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || 'Individual'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Assign Team Members</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {members.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(m.userId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMemberIds((prev) => [...prev, m.userId]);
                          } else {
                            setSelectedMemberIds((prev) => prev.filter((id) => id !== m.userId));
                          }
                        }}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>{m.user.name} ({m.role})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
