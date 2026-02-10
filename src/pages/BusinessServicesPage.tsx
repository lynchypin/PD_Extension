import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore, saveStore, type BusinessService } from '../data/store';
import {
  Search, Plus, MoreHorizontal, Briefcase, ChevronRight, CheckCircle,
  AlertTriangle, XCircle, Wrench, X, Users, Layers, ExternalLink,
} from 'lucide-react';

function StatusBadge({ status }: { status: BusinessService['status'] }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    operational: { bg: 'bg-green-100', text: 'text-green-800', label: 'Operational', icon: <CheckCircle size={12} /> },
    degraded: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Degraded', icon: <AlertTriangle size={12} /> },
    disrupted: { bg: 'bg-red-100', text: 'text-red-800', label: 'Disrupted', icon: <XCircle size={12} /> },
    under_maintenance: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Maintenance', icon: <Wrench size={12} /> },
  };
  const c = config[status] || config.operational;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.icon} {c.label}</span>;
}

function CreateBusinessServiceModal({ onClose, onSave }: { onClose: () => void; onSave: (bs: BusinessService) => void }) {
  const store = getStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownerTeamId, setOwnerTeamId] = useState(store.teams[0]?.id || '');
  const [pocId, setPocId] = useState(store.users[0]?.id || '');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSave = () => {
    const team = store.teams.find(t => t.id === ownerTeamId);
    const poc = store.users.find(u => u.id === pocId);
    onSave({
      id: `bs-${Date.now()}`,
      name,
      description,
      owner: team?.name || '',
      ownerTeamId,
      pointOfContact: poc?.name || '',
      pointOfContactId: pocId,
      status: 'operational',
      supportingServices: selectedServices,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleService = (svcId: string) => {
    setSelectedServices(prev => prev.includes(svcId) ? prev.filter(s => s !== svcId) : [...prev, svcId]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Business Service</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Online Checkout" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this business service do?" rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Owner Team</label>
              <select value={ownerTeamId} onChange={e => setOwnerTeamId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {store.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Point of Contact</label>
              <select value={pocId} onChange={e => setPocId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {store.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Supporting Technical Services</label>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {store.services.map(s => (
                <label key={s.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                  <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} className="accent-green-600 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.team}</p>
                  </div>
                </label>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={!name} className="px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820] disabled:opacity-50 disabled:cursor-not-allowed">Create Service</button>
        </div>
      </div>
    </div>
  );
}

export default function BusinessServicesPage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return store.businessServices.filter(bs => {
      if (searchQuery && !bs.name.toLowerCase().includes(searchQuery.toLowerCase()) && !bs.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [store.businessServices, searchQuery]);

  const handleCreate = (bs: BusinessService) => {
    store.businessServices.push(bs);
    saveStore(store);
    setShowCreate(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Business Services</h1>
          <p className="text-sm text-gray-500 mt-1">{store.businessServices.length} business services</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">
          <Plus size={16} /> New Business Service
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Briefcase size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Business Services map technical services to business impact</p>
            <p className="text-xs text-blue-700 mt-1">Group your technical services into business-facing services to understand business impact during incidents and communicate status to stakeholders.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search business services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
        </div>

        <div className="divide-y">
          {filtered.map(bs => {
            const supportingNames = bs.supportingServices.map(sid => store.services.find(s => s.id === sid)?.name).filter(Boolean);
            const poc = store.users.find(u => u.id === bs.pointOfContactId);

            return (
              <div key={bs.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{bs.name}</p>
                      <StatusBadge status={bs.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">{bs.description}</p>
                    <div className="flex items-center gap-4 mt-2 ml-6 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {bs.owner}</span>
                      {poc && <span className="flex items-center gap-1">Contact: {poc.name}</span>}
                      <span className="flex items-center gap-1"><Layers size={12} /> {bs.supportingServices.length} services</span>
                    </div>
                    {supportingNames.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 ml-6 flex-wrap">
                        {supportingNames.map(name => (
                          <span key={name} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><MoreHorizontal size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No business services found</p>
          </div>
        )}
      </div>

      {showCreate && <CreateBusinessServiceModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
    </div>
  );
}
