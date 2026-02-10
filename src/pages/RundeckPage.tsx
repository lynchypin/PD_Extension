import { useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, Terminal, Plus, Search } from 'lucide-react';

const RUNDECK_ACTIONS = [
  {
    id: 'rd-1',
    name: 'Restart Service Pods',
    description: 'Rolling restart of all pods for a specified Kubernetes service',
    project: 'infrastructure',
    status: 'success' as const,
    lastRun: '2025-02-10T13:15:00Z',
    duration: '45s',
    runCount: 34,
  },
  {
    id: 'rd-2',
    name: 'Clear Redis Cache',
    description: 'Flush the Redis cache for a specific namespace. Use with caution.',
    project: 'infrastructure',
    status: 'success' as const,
    lastRun: '2025-02-09T20:30:00Z',
    duration: '12s',
    runCount: 18,
  },
  {
    id: 'rd-3',
    name: 'Database Connection Pool Reset',
    description: 'Reset connection pool and terminate idle connections on the primary database',
    project: 'database',
    status: 'running' as const,
    lastRun: '2025-02-10T14:28:00Z',
    duration: '—',
    runCount: 7,
  },
  {
    id: 'rd-4',
    name: 'Collect Thread Dump',
    description: 'Capture thread dumps from JVM services for debugging hung processes',
    project: 'diagnostics',
    status: 'success' as const,
    lastRun: '2025-02-10T11:00:00Z',
    duration: '8s',
    runCount: 22,
  },
  {
    id: 'rd-5',
    name: 'Scale Deployment',
    description: 'Scale a Kubernetes deployment up or down to a specified replica count',
    project: 'infrastructure',
    status: 'failed' as const,
    lastRun: '2025-02-08T16:45:00Z',
    duration: '2m 10s',
    runCount: 11,
  },
  {
    id: 'rd-6',
    name: 'Run Health Check Suite',
    description: 'Execute comprehensive health checks across all services and report status',
    project: 'diagnostics',
    status: 'success' as const,
    lastRun: '2025-02-10T08:00:00Z',
    duration: '1m 30s',
    runCount: 89,
  },
];

const STATUS_STYLES = {
  success: { label: 'Success', bg: 'bg-green-100', color: 'text-green-700', icon: CheckCircle },
  running: { label: 'Running', bg: 'bg-blue-100', color: 'text-blue-700', icon: Clock },
  failed: { label: 'Failed', bg: 'bg-red-100', color: 'text-red-700', icon: AlertTriangle },
};

export default function RundeckPage() {
  const [search, setSearch] = useState('');
  const filtered = RUNDECK_ACTIONS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rundeck Actions</h1>
          <p className="text-sm text-gray-500 mt-1">Run automated diagnostics and remediation directly from PagerDuty.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> Create Action
        </button>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search actions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]/30 focus:border-[#06ac38]"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(action => {
          const st = STATUS_STYLES[action.status];
          const StIcon = st.icon;
          return (
            <div key={action.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Terminal size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{action.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{action.project}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {action.duration}</span>
                      <span>Run {action.runCount} times</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${st.bg} ${st.color}`}>
                    <StIcon size={10} /> {st.label}
                  </span>
                  <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium">
                    <Play size={10} /> Run
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}