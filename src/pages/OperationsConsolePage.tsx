import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore, type Incident } from '../data/store';
import {
  Search, Filter, X, ChevronDown, AlertTriangle, CheckCircle, Clock,
  User, MoreHorizontal, SlidersHorizontal, Bell, FileText, Activity,
  Bot, ExternalLink, MessageSquare, ArrowUpRight, Phone, Tag,
} from 'lucide-react';

function StatusBadge({ status }: { status: Incident['status'] }) {
  const styles: Record<string, string> = {
    triggered: 'bg-red-100 text-red-800',
    acknowledged: 'bg-amber-100 text-amber-800',
    resolved: 'bg-green-100 text-green-800',
  };
  const icons: Record<string, React.ReactNode> = {
    triggered: <AlertTriangle size={12} />,
    acknowledged: <Clock size={12} />,
    resolved: <CheckCircle size={12} />,
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function UrgencyDot({ urgency }: { urgency: 'high' | 'low' }) {
  return <span className={`w-2 h-2 rounded-full inline-block ${urgency === 'high' ? 'bg-red-500' : 'bg-blue-400'}`} />;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
      {label}
      <button onClick={onRemove} className="hover:text-blue-600"><X size={12} /></button>
    </span>
  );
}

function IncidentDetailSidebar({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const store = getStore();
  const [activeTab, setActiveTab] = useState<'info' | 'alerts' | 'timeline' | 'sre_agent'>('info');
  const user = store.users.find(u => u.id === incident.assigneeId);

  const DETAIL_TABS = [
    { key: 'info', label: 'Info', icon: FileText },
    { key: 'alerts', label: 'Alerts', icon: Bell },
    { key: 'timeline', label: 'Timeline', icon: Activity },
    { key: 'sre_agent', label: 'SRE Agent', icon: Bot },
  ] as const;

  const timelineEntries = [
    { time: incident.createdAt, action: 'Incident triggered', actor: 'System', type: 'trigger' },
    ...(incident.status !== 'triggered' ? [{ time: incident.updatedAt, action: `Acknowledged by ${incident.assignee}`, actor: incident.assignee, type: 'ack' }] : []),
    ...(incident.status === 'resolved' ? [{ time: incident.updatedAt, action: `Resolved by ${incident.assignee}`, actor: incident.assignee, type: 'resolve' }] : []),
  ];

  return (
    <div className="w-96 border-l bg-white flex flex-col h-full flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge status={incident.status} />
          <span className="text-xs text-gray-400">#{incident.number}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><ExternalLink size={14} /></button>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
      </div>

      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{incident.title}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><UrgencyDot urgency={incident.urgency} /> {incident.urgency}</span>
          {incident.priority && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">{incident.priority}</span>}
          <span>{timeAgo(incident.createdAt)}</span>
        </div>
      </div>

      <div className="border-b">
        <div className="flex">
          {DETAIL_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium border-b-2 ${activeTab === tab.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Icon size={12} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Service</p>
              <Link to={`/services/${incident.serviceId}`} className="text-sm text-blue-600 hover:text-blue-800">{incident.service}</Link>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                {user && <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />}
                <Link to={`/users/${incident.assigneeId}`} className="text-sm text-blue-600 hover:text-blue-800">{incident.assignee}</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Escalation Policy</p>
              <p className="text-sm text-gray-700">{incident.escalationPolicy}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Urgency</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${incident.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{incident.urgency}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Created</p>
              <p className="text-sm text-gray-700">{new Date(incident.createdAt).toLocaleString()}</p>
            </div>
            <div className="pt-3 border-t space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><User size={14} /> Reassign</button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Phone size={14} /> Add Responders</button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><MessageSquare size={14} /> Add Note</button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Tag size={14} /> Set Priority</button>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-500" />
                <p className="text-sm font-medium text-gray-900">{incident.title}</p>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Source: {incident.service}</p>
                <p>Severity: {incident.urgency === 'high' ? 'Critical' : 'Warning'}</p>
                <p>Created: {timeAgo(incident.createdAt)}</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400">1 alert on this incident</p>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-0">
            {timelineEntries.map((entry, i) => (
              <div key={i} className="flex gap-3 pb-4">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${entry.type === 'trigger' ? 'bg-red-500' : entry.type === 'ack' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  {i < timelineEntries.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-400">{new Date(entry.time).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sre_agent' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-purple-600" />
                <p className="text-sm font-medium text-purple-900">SRE Agent Analysis</p>
              </div>
              <p className="text-xs text-purple-700">AI-powered incident analysis and suggested remediation actions.</p>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Suggested Actions</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</span>
                  <p className="text-gray-700">Check {incident.service} health endpoints and recent deployments</p>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</span>
                  <p className="text-gray-700">Review related alerts from the past 24 hours</p>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</span>
                  <p className="text-gray-700">Check similar past incidents for resolution patterns</p>
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Similar Past Incidents</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="hover:text-blue-600 cursor-pointer">• Database connection pool exhausted (3 days ago) - Resolved by increasing pool size</p>
                <p className="hover:text-blue-600 cursor-pointer">• API response time degradation (1 week ago) - Resolved by scaling instances</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OperationsConsolePage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [filters, setFilters] = useState<{
    status: string[];
    urgency: string[];
    service: string[];
    assignee: string[];
    priority: string[];
  }>({ status: [], urgency: [], service: [], assignee: [], priority: [] });

  const activeFilterCount = Object.values(filters).flat().length;

  const filteredIncidents = useMemo(() => {
    return store.incidents.filter(inc => {
      if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.number.toString().includes(searchQuery)) return false;
      if (filters.status.length && !filters.status.includes(inc.status)) return false;
      if (filters.urgency.length && !filters.urgency.includes(inc.urgency)) return false;
      if (filters.service.length && !filters.service.includes(inc.serviceId)) return false;
      if (filters.assignee.length && !filters.assignee.includes(inc.assigneeId)) return false;
      if (filters.priority.length && !filters.priority.includes(inc.priority || '')) return false;
      return true;
    });
  }, [store.incidents, searchQuery, filters]);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => setFilters({ status: [], urgency: [], service: [], assignee: [], priority: [] });

  const services = [...new Set(store.incidents.map(i => i.serviceId))].map(sid => store.services.find(s => s.id === sid)).filter(Boolean);
  const assignees = [...new Set(store.incidents.map(i => i.assigneeId))].map(uid => store.users.find(u => u.id === uid)).filter(Boolean);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">Operations Console</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{filteredIncidents.length} incidents</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search incidents by title or number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm ${showFilters ? 'bg-green-50 border-green-300 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {filters.status.map(s => <FilterChip key={s} label={`Status: ${s}`} onRemove={() => toggleFilter('status', s)} />)}
              {filters.urgency.map(u => <FilterChip key={u} label={`Urgency: ${u}`} onRemove={() => toggleFilter('urgency', u)} />)}
              {filters.service.map(s => { const svc = store.services.find(sv => sv.id === s); return <FilterChip key={s} label={`Service: ${svc?.name || s}`} onRemove={() => toggleFilter('service', s)} />; })}
              {filters.assignee.map(a => { const usr = store.users.find(u => u.id === a); return <FilterChip key={a} label={`Assignee: ${usr?.name || a}`} onRemove={() => toggleFilter('assignee', a)} />; })}
              {filters.priority.map(p => <FilterChip key={p} label={`Priority: ${p}`} onRemove={() => toggleFilter('priority', p)} />)}
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800">Clear all</button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="bg-white border-b p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
                {['triggered', 'acknowledged', 'resolved'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                    <input type="checkbox" checked={filters.status.includes(s)} onChange={() => toggleFilter('status', s)} className="accent-green-600 rounded" />
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Urgency</p>
                {['high', 'low'].map(u => (
                  <label key={u} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                    <input type="checkbox" checked={filters.urgency.includes(u)} onChange={() => toggleFilter('urgency', u)} className="accent-green-600 rounded" />
                    <span className="capitalize">{u}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Service</p>
                {services.map(s => s && (
                  <label key={s.id} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                    <input type="checkbox" checked={filters.service.includes(s.id)} onChange={() => toggleFilter('service', s.id)} className="accent-green-600 rounded" />
                    <span className="truncate">{s.name}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Assignee</p>
                {assignees.map(a => a && (
                  <label key={a.id} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                    <input type="checkbox" checked={filters.assignee.includes(a.id)} onChange={() => toggleFilter('assignee', a.id)} className="accent-green-600 rounded" />
                    <span className="truncate">{a.name}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Priority</p>
                {['P1', 'P2', 'P3'].map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                    <input type="checkbox" checked={filters.priority.includes(p)} onChange={() => toggleFilter('priority', p)} className="accent-green-600 rounded" />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(inc => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <tr key={inc.id} onClick={() => setSelectedIncident(isSelected ? null : inc)} className={`border-b cursor-pointer ${isSelected ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3"><UrgencyDot urgency={inc.urgency} /></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 truncate max-w-xs">{inc.title}</p>
                      <p className="text-xs text-gray-400">#{inc.number} · {inc.escalationPolicy}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{inc.service}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(() => { const u = store.users.find(u => u.id === inc.assigneeId); return u ? <img src={u.avatar} alt="" className="w-5 h-5 rounded-full" /> : null; })()}
                        <span className="text-gray-600">{inc.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {inc.priority ? <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">{inc.priority}</span> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{timeAgo(inc.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredIncidents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No incidents match your filters</p>
            </div>
          )}
        </div>
      </div>

      {selectedIncident && (
        <IncidentDetailSidebar incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      )}
    </div>
  );
}
