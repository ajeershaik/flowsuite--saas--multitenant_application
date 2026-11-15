import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Customer } from '../types';
import {
  Users2,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  Archive,
  Edit,
  FolderKanban,
  X,
  FileText
} from 'lucide-react';

export const CustomersPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { customers, projects, currentRole, createCustomer, updateCustomer, archiveCustomer } = useWorkspace();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const isOwnerOrAdminOrManager = ['OWNER', 'ADMIN', 'MANAGER'].includes(currentRole);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenModal = (cust?: Customer) => {
    if (cust) {
      setEditingCustomer(cust);
      setName(cust.name);
      setEmail(cust.email || '');
      setPhone(cust.phone || '');
      setCompany(cust.company || '');
      setAddress(cust.address || '');
      setNotes(cust.notes || '');
      setSelectedProjectIds(cust.associatedProjectIds || []);
    } else {
      setEditingCustomer(null);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setAddress('');
      setNotes('');
      setSelectedProjectIds([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        email,
        phone,
        company,
        address,
        notes,
        associatedProjectIds: selectedProjectIds,
      });
    } else {
      createCustomer({
        name,
        email,
        phone,
        company,
        address,
        notes,
        projectIds: selectedProjectIds,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer CRM</h1>
          <p className="text-xs text-slate-400">
            Client contacts, enterprise relationships, and linked project deliverables
          </p>
        </div>

        {isOwnerOrAdminOrManager && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition self-start"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Users2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Customers Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'No customer records match your filter.' : 'Add client records to link them with ongoing workspace projects.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => {
            const linkedProjects = projects.filter((p) => cust.associatedProjectIds?.includes(p.id));

            return (
              <div
                key={cust.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{cust.name}</h3>
                      {cust.company && (
                        <p className="text-xs font-medium text-indigo-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5" />
                          {cust.company}
                        </p>
                      )}
                    </div>
                    {isOwnerOrAdminOrManager && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenModal(cust)}
                          title="Edit Customer"
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => archiveCustomer(cust.id)}
                          title="Archive Customer"
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    {cust.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}
                    {cust.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cust.phone}</span>
                      </div>
                    )}
                    {cust.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cust.address}</span>
                      </div>
                    )}
                  </div>

                  {cust.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      "{cust.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs">
                  <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1.5">
                    Linked Projects ({linkedProjects.length})
                  </p>
                  {linkedProjects.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">No associated projects</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedProjects.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-medium"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">
                {editingCustomer ? 'Edit Customer Record' : 'Add New Customer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Customer / Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Billing terms, contact notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Link to Workspace Projects</label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {projects.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedProjectIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjectIds((prev) => [...prev, p.id]);
                          } else {
                            setSelectedProjectIds((prev) => prev.filter((id) => id !== p.id));
                          }
                        }}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
