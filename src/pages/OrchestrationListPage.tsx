import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore, type Orchestration } from '../data/store';
import { Search, Plus, MoreHorizontal, GitBranch, Globe, Layers, Clock, ChevronRight } from 'lucide-react';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function OrchestrationListPage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'global' | 'service'>('All');

  const filtered = useMemo(() => {
    return store.orchestrations.filter(o => {
      if (typeFilter !== 'All' && o.type !== typeFilter) return false;
      if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [store.orchestrations, searchQuery, typeFilter]);

  const globalCount = store.orchestrations.filter(o => o.type === 'global').length;
  const serviceCount = store.orchestrations.filter(o => o.type === 'service').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Event Orchestration</h1>
          <p className="text-sm text-gray-500 mt-1">{globalCount} global · {serviceCount} service orchestrations</p>
        </div>
        <Link to="/automation/orchestration/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">
          <Plus size={16} /> New Orchestration
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <GitBranch size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Event Orchestration helps you route and transform events</p>
            <p className="text-xs text-blue-700 mt-1">Create rules to route events to the right services, set severity, suppress noise, and transform event data before it creates incidents.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search orchestrations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="All">All Types</option>
            <option value="global">Global</option>
            <option value="service">Service</option>
          </select>
        </div>

        <div className="divide-y">
          {filtered.map(orch => {
            const service = orch.serviceId ? store.services.find(s => s.id === orch.serviceId) : null;
            return (
              <Link key={orch.id} to={`/automation/orchestration/${orch.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${orch.type === 'global' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                  {orch.type === 'global' ? <Globe size={20} className="text-purple-600" /> : <Layers size={20} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{orch.name}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${orch.type === 'global' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{orch.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{orch.description}</p>
                  {service && <p className="text-xs text-gray-400 mt-0.5">Service: {service.name}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">{orch.rules.length} rules</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {timeAgo(orch.updatedAt)}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <GitBranch size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No orchestrations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
