import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  X,
  User,
  ArrowRight,
  Kanban,
  List
} from 'lucide-react';

export const TasksPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const {
    tasks,
    projects,
    members,
    currentRole,
    currentUser,
    createTask,
    updateTaskStatus,
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isOwnerOrAdminOrManager = ['OWNER', 'ADMIN', 'MANAGER'].includes(currentRole);

  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'ALL' && t.projectId !== selectedProjectId) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    createTask({
      projectId,
      title,
      description,
      priority,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const priorityColors: Record<TaskPriority, string> = {
    LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    URGENT: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const statusColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'TODO', label: 'To Do', color: 'border-slate-700' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-indigo-500/50' },
    { id: 'DONE', label: 'Completed', color: 'border-emerald-500/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks Management</h1>
          <p className="text-xs text-slate-400">
            {currentRole === 'MEMBER'
              ? 'Tasks assigned directly to you (Click status pills to update your progress)'
              : 'Collaborative task workflows, priorities, and deadlines'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isOwnerOrAdminOrManager && (
            <button
              onClick={() => {
                if (projects.length > 0) {
                  setProjectId(projects[0].id);
                  setIsModalOpen(true);
                }
              }}
              disabled={projects.length === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
        </div>
      </div>

      {/* Project Selector Filter */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-slate-400">Filter by Project:</span>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Projects ({projects.length})</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{col.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
                      const canUpdateStatus = isOwnerOrAdminOrManager || (currentRole === 'MEMBER' && task.assignedTo === currentUser?.id);

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg space-y-3 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>

                            {/* Status changer buttons */}
                            {canUpdateStatus && (
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                {col.id !== 'TODO' && (
                                  <button
                                    onClick={() => updateTaskStatus(task.id, 'TODO')}
                                    title="Move to Todo"
                                    className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                                  >
                                    To Do
                                  </button>
                                )}
                                {col.id !== 'IN_PROGRESS' && (
                                  <button
                                    onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                                    title="Move to In Progress"
                                    className="text-[10px] text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/10"
                                  >
                                    Progress
                                  </button>
                                )}
                                {col.id !== 'DONE' && (
                                  <button
                                    onClick={() => updateTaskStatus(task.id, 'DONE')}
                                    title="Mark Completed"
                                    className="text-[10px] text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/10"
                                  >
                                    Done
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                          )}

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              <span className="truncate max-w-[100px]">{task.assigneeName || 'Unassigned'}</span>
                            </div>

                            {task.dueDate && (
                              <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                                <Calendar className="w-3 h-3" />
                                <span>{task.dueDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4">Task Name</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">{task.description}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        task.status === 'DONE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{task.assigneeName || 'Unassigned'}</td>
                  <td className="p-4 text-slate-400">{task.dueDate || '—'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateTaskStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
                        className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white transition"
                      >
                        {task.status === 'DONE' ? 'Reopen' : 'Mark Done'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Create New Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project *</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Webhook Signature Validator"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Assignee</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.userId}>
                        {m.user.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
