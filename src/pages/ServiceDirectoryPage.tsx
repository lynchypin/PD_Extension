import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore } from '../data/store';
import { Search, Filter, Plus, MoreHorizontal, ChevronDown, ArrowUpRight, CheckCircle, AlertTriangle, XCircle, Wrench, Ban } from 'lucide-react';

function ServiceStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'active': return <CheckCircle size={16} className="text-green-500" />;
    case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
    case 'critical': return <XCircle size={16} className="text-red-500" />;
    case 'maintenance': return <Wrench size={16} className="text-blue-500" />;
    case 'disabled': return <Ban size={16} className="text-gray-400" />;
    default: return <CheckCircle size={16} className="text-green-500" />;
  }
}

export default function ServiceDirectoryPage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const teams = useMemo(() => [...new Set(store.services.map(s => s.team))], [store.services]);

  const filteredServices = useMemo(() => {
    let list = store.services;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    if (teamFilter !== 'All') list = list.filter(s => s.team === teamFilter);
    if (statusFilter !== 'All') list = list.filter(s => s.status === statusFilter);
    return list;
  }, [store.services, searchQuery, teamFilter, statusFilter]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Directory</h1>
          <p className="text-sm text-gray-500 mt-1">{store.services.length} services</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1">
          <Plus size={14} /> New Service
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              <option value="All">All Teams</option>
              {teams.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="maintenance">Maintenance</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">On Call Now</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalation Policy</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Incident</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Integrations</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standards</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredServices.map(service => {
              const ep = store.escalationPolicies.find(e => e.id === service.escalationPolicyId);
              const onCallUser = ep ? store.users.find(u => u.id === ep.rules[0]?.targets[0]) : null;
              const standards = Math.floor(Math.random() * 3) + 3;
              const totalStandards = 5;
              return (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/services/${service.id}`} className="flex items-center gap-2">
                      <ServiceStatusIcon status={service.status} />
                      <div>
                        <div className="font-medium text-gray-900 hover:text-blue-600">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{service.team}</span>
                  </td>
                  <td className="px-4 py-3">
                    {onCallUser ? (
                      <Link to={`/users/${onCallUser.id}`} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600">
                        <img src={onCallUser.avatar} alt="" className="w-5 h-5 rounded-full" />
                        {onCallUser.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{service.escalationPolicy}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{service.lastIncident}</td>
                  <td className="px-4 py-3">
                    <Link to={`/services/${service.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {service.integrationCount} integration{service.integrationCount !== 1 ? 's' : ''}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#06ac38] rounded-full" style={{ width: `${(standards / totalStandards) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{standards}/{totalStandards}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredServices.length} services</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <span className="px-3 py-1 bg-[#06ac38] text-white rounded text-xs">1</span>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
