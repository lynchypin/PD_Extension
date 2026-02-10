import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore, type Workflow } from '../data/store';
import { Search, Plus, MoreHorizontal, Zap, Clock, CheckCircle, XCircle, ChevronDown, Play, Filter } from 'lucide-react';

const TEMPLATES = [
  { id: 't1', name: 'Notify Slack Channel', description: 'Send a message to a Slack channel when an incident is triggered', icon: '💬' },
  { id: 't2', name: 'Create Conference Bridge', description: 'Automatically create a Zoom or Teams bridge for P1 incidents', icon: '📞' },
  { id: 't3', name: 'Add Responders from EP', description: 'Add additional responders from an escalation policy', icon: '👥' },
  { id: 't4', name: 'Create Jira Ticket', description: 'Auto-create a Jira issue for tracking', icon: '🎫' },
  { id: 't5', name: 'Update Status Page', description: 'Post an update to your status page component', icon: '📊' },
  { id: 't6', name: 'Run Diagnostic Script', description: 'Execute a Rundeck job to gather diagnostics', icon: '🔧' },
];

function StatusBadge({ status }: { status: Workflow['status'] }) {
  if (status === 'active') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Active</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"><XCircle size={12} /> Inactive</span>;
}

function TriggerBadge({ type }: { type: Workflow['triggerType'] }) {
  const styles: Record<string, string> = {
    incident: 'bg-blue-100 text-blue-800',
    manual: 'bg-purple-100 text-purple-800',
    conditional: 'bg-amber-100 text-amber-800',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function WorkflowsPage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'inactive'>('All');
  const [showTemplates, setShowTemplates] = useState(true);

  const filtered = useMemo(() => {
    return store.workflows.filter(w => {
      if (statusFilter !== 'All' && w.status !== statusFilter) return false;
      if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase()) && !w.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [store.workflows, searchQuery, statusFilter]);

  const activeCount = store.workflows.filter(w => w.status === 'active').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Incident Workflows</h1>
          <p className="text-sm text-gray-500 mt-1">{store.workflows.length} workflows · {activeCount} active</p>
        </div>
        <Link to="/automation/workflows/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">
          <Plus size={16} /> New Workflow
        </Link>
      </div>

      {showTemplates && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Start from a template</h2>
            <button onClick={() => setShowTemplates(false)} className="text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <Link key={t.id} to="/automation/workflows/new" className="bg-white border rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all group">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search workflows..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3">Trigger</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Run</th>
              <th className="px-4 py-3">Runs</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/automation/workflows/${w.id}`} className="text-blue-600 hover:text-blue-800 font-medium">{w.name}</Link>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{w.description}</p>
                </td>
                <td className="px-4 py-3"><TriggerBadge type={w.triggerType} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {w.actions.slice(0, 3).map(a => (
                      <span key={a.id} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{a.package}</span>
                    ))}
                    {w.actions.length > 3 && <span className="text-xs text-gray-400">+{w.actions.length - 3}</span>}
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                <td className="px-4 py-3 text-gray-500">{timeAgo(w.lastRun)}</td>
                <td className="px-4 py-3 text-gray-500">{w.runCount}</td>
                <td className="px-4 py-3 text-gray-500">{timeAgo(w.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><Play size={14} /></button>
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><MoreHorizontal size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Zap size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No workflows found</p>
          </div>
        )}

        <div className="p-4 border-t text-sm text-gray-500">
          Showing {filtered.length} of {store.workflows.length} workflows
        </div>
      </div>
    </div>
  );
}
