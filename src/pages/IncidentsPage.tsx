import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore, type Incident } from '../data/store';
import TermTooltip from '../components/TermTooltip';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  User,
} from 'lucide-react';

const STATUS_TABS = ['Triggered', 'Acknowledged', 'Resolved', 'All'] as const;

function StatusBadge({ status }: { status: Incident['status'] }) {
  const styles = {
    triggered: 'bg-red-100 text-red-800 border-red-200',
    acknowledged: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
  };
  const icons = {
    triggered: <AlertTriangle size={12} />,
    acknowledged: <Clock size={12} />,
    resolved: <CheckCircle size={12} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${styles[status]}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: 'high' | 'low' }) {
  return urgency === 'high' ? (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-800">High</span>
  ) : (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">Low</span>
  );
}

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const colors: Record<string, string> = {
    P1: 'bg-red-600 text-white',
    P2: 'bg-orange-500 text-white',
    P3: 'bg-yellow-500 text-white',
    P4: 'bg-blue-500 text-white',
    P5: 'bg-gray-500 text-white',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-bold rounded ${colors[priority] || 'bg-gray-400 text-white'}`}>
      {priority}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function IncidentsPage() {
  const store = getStore();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncidents, setSelectedIncidents] = useState<Set<string>>(new Set());

  const filteredIncidents = useMemo(() => {
    let list = store.incidents;
    if (activeTab !== 'All') {
      list = list.filter(i => i.status === activeTab.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.service.toLowerCase().includes(q) || String(i.number).includes(q));
    }
    return list;
  }, [store.incidents, activeTab, searchQuery]);

  const counts = useMemo(() => ({
    Triggered: store.incidents.filter(i => i.status === 'triggered').length,
    Acknowledged: store.incidents.filter(i => i.status === 'acknowledged').length,
    Resolved: store.incidents.filter(i => i.status === 'resolved').length,
    All: store.incidents.length,
  }), [store.incidents]);

  const toggleSelect = (id: string) => {
    setSelectedIncidents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIncidents.size === filteredIncidents.length) {
      setSelectedIncidents(new Set());
    } else {
      setSelectedIncidents(new Set(filteredIncidents.map(i => i.id)));
    }
  };

  const onCallNow = store.users.slice(0, 3);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            <TermTooltip termId="incident" inline>Incidents</TermTooltip>
          </h1>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <Filter size={14} /> Filter <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-0 border-b mb-4">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#06ac38] text-[#06ac38]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{counts[tab as keyof typeof counts]}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38] focus:border-transparent"
          />
        </div>

        {selectedIncidents.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center gap-3">
            <span className="text-sm text-blue-700 font-medium">{selectedIncidents.size} selected</span>
            <button className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Acknowledge</button>
            <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Resolve</button>
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Reassign</button>
            <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Snooze</button>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">More <ChevronDown size={12} /></button>
          </div>
        )}

        <div className="bg-white rounded-lg border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-10 px-3 py-3 text-left">
                  <input type="checkbox" checked={selectedIncidents.size === filteredIncidents.length && filteredIncidents.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <TermTooltip termId="priority" inline>Priority</TermTooltip>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <TermTooltip termId="service" inline>Service</TermTooltip>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <TermTooltip termId="urgency" inline>Urgency</TermTooltip>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredIncidents.map(incident => (
                <tr key={incident.id} className={`hover:bg-gray-50 ${selectedIncidents.has(incident.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIncidents.has(incident.id)} onChange={() => toggleSelect(incident.id)} className="rounded" />
                  </td>
                  <td className="px-3 py-3 text-gray-500 font-mono text-xs">{incident.number}</td>
                  <td className="px-3 py-3"><PriorityBadge priority={incident.priority} /></td>
                  <td className="px-3 py-3"><StatusBadge status={incident.status} /></td>
                  <td className="px-3 py-3">
                    <Link to={`/incidents/${incident.id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                      {incident.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link to={`/services/${incident.serviceId}`} className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                      {incident.service} <ArrowUpRight size={10} />
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link to={`/users/${incident.assigneeId}`} className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600">
                      <User size={14} className="text-gray-400" /> {incident.assignee}
                    </Link>
                  </td>
                  <td className="px-3 py-3"><UrgencyBadge urgency={incident.urgency} /></td>
                  <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">{timeAgo(incident.createdAt)}</td>
                  <td className="px-3 py-3">
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredIncidents.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-8 text-center text-gray-500">No incidents found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredIncidents.length} of {store.incidents.length} incidents</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <span className="px-3 py-1 bg-[#06ac38] text-white rounded text-xs">1</span>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      <aside className="w-72 border-l bg-white p-4 hidden lg:block flex-shrink-0">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Currently On Call</h3>
        <div className="space-y-3 mb-6">
          {onCallNow.map(user => (
            <Link key={user.id} to={`/users/${user.id}`} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.teams[0]}</div>
              </div>
            </Link>
          ))}
        </div>

        <h3 className="font-semibold text-sm text-gray-900 mb-3">Active Services</h3>
        <div className="space-y-2">
          {store.services.filter(s => s.status === 'critical' || s.status === 'warning').map(svc => (
            <Link key={svc.id} to={`/services/${svc.id}`} className="block p-2 rounded hover:bg-gray-50 border">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${svc.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium text-gray-900">{svc.name}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 ml-4">Last incident: {svc.lastIncident}</div>
            </Link>
          ))}
        </div>

        <h3 className="font-semibold text-sm text-gray-900 mt-6 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{counts.Triggered}</div>
            <div className="text-xs text-red-700">Triggered</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{counts.Acknowledged}</div>
            <div className="text-xs text-yellow-700">Acknowledged</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center col-span-2">
            <div className="text-2xl font-bold text-green-600">{counts.Resolved}</div>
            <div className="text-xs text-green-700">Resolved Today</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
