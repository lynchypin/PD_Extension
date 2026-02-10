import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStore, saveStore, type Workflow, type WorkflowAction } from '../data/store';
import {
  ChevronRight, Plus, Trash2, GripVertical, Settings, Zap, Play,
  X, Search, ArrowLeft, AlertTriangle, CheckCircle, XCircle, ChevronDown,
  MessageSquare, Mail, Users, FileText, Globe, Terminal, Bell, GitBranch,
} from 'lucide-react';

const ACTION_CATALOG = [
  { category: 'PagerDuty', items: [
    { type: 'Add Responders', icon: Users, description: 'Add responders from an escalation policy or specific users' },
    { type: 'Add Note', icon: FileText, description: 'Add a note to the incident timeline' },
    { type: 'Set Priority', icon: AlertTriangle, description: 'Set or change the incident priority' },
    { type: 'Run Response Play', icon: Play, description: 'Execute a predefined response play' },
    { type: 'Reassign', icon: Users, description: 'Reassign the incident to a different user or EP' },
    { type: 'Set Urgency', icon: Bell, description: 'Change the urgency level of the incident' },
  ]},
  { category: 'Slack', items: [
    { type: 'Send Slack Message', icon: MessageSquare, description: 'Post a message to a Slack channel' },
    { type: 'Create Slack Channel', icon: MessageSquare, description: 'Create a dedicated Slack channel for the incident' },
  ]},
  { category: 'Jira Cloud', items: [
    { type: 'Create Jira Issue', icon: FileText, description: 'Create a new Jira issue for tracking' },
    { type: 'Update Jira Issue', icon: FileText, description: 'Update an existing linked Jira issue' },
  ]},
  { category: 'Email', items: [
    { type: 'Send Email', icon: Mail, description: 'Send an email notification' },
  ]},
  { category: 'Statuspage', items: [
    { type: 'Update Status Page', icon: Globe, description: 'Post or update a status page incident' },
  ]},
  { category: 'Rundeck', items: [
    { type: 'Run Job', icon: Terminal, description: 'Execute a Rundeck automation job' },
  ]},
  { category: 'Webhooks', items: [
    { type: 'Send Webhook', icon: GitBranch, description: 'Send a custom webhook to an external endpoint' },
  ]},
];

const TRIGGER_TYPES = [
  { value: 'incident', label: 'When incident is created', description: 'Runs automatically when a new incident is triggered' },
  { value: 'manual', label: 'Manual trigger', description: 'Runs only when manually invoked by a responder' },
  { value: 'conditional', label: 'When conditions are met', description: 'Runs when specified conditions match on an incident' },
];

function ActionCard({ action, index, onRemove }: { action: WorkflowAction; index: number; onRemove: () => void }) {
  const catalogItem = ACTION_CATALOG.flatMap(c => c.items).find(i => i.type === action.type);
  const Icon = catalogItem?.icon || Zap;

  return (
    <div className="bg-white border rounded-lg p-4 flex items-start gap-3 group">
      <GripVertical size={16} className="text-gray-300 mt-1 cursor-grab" />
      <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-green-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{index + 1}</span>
          <p className="text-sm font-medium text-gray-900">{action.type}</p>
          <span className="text-xs text-gray-400">({action.package})</span>
        </div>
        <div className="mt-2 space-y-1">
          {Object.entries(action.config).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 min-w-[80px]">{key}:</span>
              <input type="text" defaultValue={value} className="flex-1 border rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={onRemove} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function ActionCatalogModal({ onSelect, onClose }: { onSelect: (type: string, pkg: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ACTION_CATALOG.map(cat => ({
    ...cat,
    items: cat.items.filter(i => {
      if (activeCategory !== 'All' && cat.category !== activeCategory) return false;
      if (search && !i.type.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Action</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search actions..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {['All', ...ACTION_CATALOG.map(c => c.category)].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filtered.map(cat => (
            <div key={cat.category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{cat.category}</h3>
              <div className="space-y-1">
                {cat.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.type} onClick={() => onSelect(item.type, cat.category)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-gray-600" /></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.type}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilderPage() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const store = getStore();
  const isNew = workflowId === 'new';
  const workflow = isNew ? null : store.workflows.find(w => w.id === workflowId);

  const [activeTab, setActiveTab] = useState<'builder' | 'settings'>('builder');
  const [showCatalog, setShowCatalog] = useState(false);
  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  const [triggerType, setTriggerType] = useState<string>(workflow?.triggerType || 'incident');
  const [triggerCondition, setTriggerCondition] = useState(workflow?.triggerCondition || '');
  const [actions, setActions] = useState<WorkflowAction[]>(workflow?.actions || []);
  const [status, setStatus] = useState<'active' | 'inactive'>(workflow?.status || 'inactive');

  if (!isNew && !workflow) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Workflow Not Found</h2>
          <Link to="/automation/workflows" className="text-sm text-blue-600 hover:text-blue-800">Back to Workflows</Link>
        </div>
      </div>
    );
  }

  const handleAddAction = (type: string, pkg: string) => {
    const newAction: WorkflowAction = {
      id: `wa-${Date.now()}`,
      type,
      package: pkg,
      config: {},
      order: actions.length + 1,
    };
    setActions([...actions, newAction]);
    setShowCatalog(false);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const wf: Workflow = {
      id: isNew ? `wf-${Date.now()}` : workflow!.id,
      name,
      description,
      status,
      triggerType: triggerType as Workflow['triggerType'],
      triggerCondition,
      actions,
      teamId: workflow?.teamId || 'team-1',
      createdBy: workflow?.createdBy || 'user-1',
      createdAt: workflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRun: workflow?.lastRun,
      runCount: workflow?.runCount || 0,
    };
    if (isNew) {
      store.workflows.push(wf);
    } else {
      const idx = store.workflows.findIndex(w => w.id === workflow!.id);
      store.workflows[idx] = wf;
    }
    saveStore(store);
    navigate('/automation/workflows');
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/automation/workflows" className="hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={14} /> Workflows</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{isNew ? 'New Workflow' : workflow?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Workflow name..." className="text-2xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder-gray-300" />
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a description..." className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1 placeholder-gray-300" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <button onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${status === 'active' ? 'bg-green-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {!isNew && (
            <button className="inline-flex items-center gap-1 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Play size={14} /> Test Run
            </button>
          )}
          <button onClick={handleSave} className="px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">Save Workflow</button>
        </div>
      </div>

      <div className="border-b mb-6">
        <div className="flex gap-0">
          {(['builder', 'settings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium border-b-2 capitalize ${activeTab === tab ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'builder' ? (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Trigger</h3>
            </div>
            <div className="space-y-3">
              {TRIGGER_TYPES.map(tt => (
                <label key={tt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${triggerType === tt.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="trigger" value={tt.value} checked={triggerType === tt.value} onChange={() => setTriggerType(tt.value)} className="mt-0.5 accent-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tt.label}</p>
                    <p className="text-xs text-gray-500">{tt.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {triggerType === 'conditional' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800 mb-2">Condition Expression</p>
                <input type="text" value={triggerCondition} onChange={e => setTriggerCondition(e.target.value)} placeholder="e.g., incident.priority matches P1 AND incident.service matches Database Cluster" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            )}
            {triggerType === 'incident' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-2">Filter (optional)</p>
                <input type="text" value={triggerCondition} onChange={e => setTriggerCondition(e.target.value)} placeholder="e.g., incident.urgency matches high" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-gray-300" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings size={18} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900">Actions</h3>
              <span className="text-xs text-gray-400">({actions.length})</span>
            </div>
            <div className="space-y-3">
              {actions.map((action, i) => (
                <div key={action.id}>
                  <ActionCard action={action} index={i} onRemove={() => handleRemoveAction(i)} />
                  {i < actions.length - 1 && (
                    <div className="flex items-center justify-center"><div className="w-px h-4 bg-gray-300" /></div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setShowCatalog(true)} className="mt-3 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors">
              <Plus size={16} /> Add Action
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Team</label>
                <select className="border rounded-lg px-3 py-2 text-sm w-full" defaultValue={workflow?.teamId || 'team-1'}>
                  {store.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Service (optional)</label>
                <select className="border rounded-lg px-3 py-2 text-sm w-full" defaultValue={workflow?.serviceId || ''}>
                  <option value="">All Services</option>
                  {store.services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Execution Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-green-600" />
                <span className="text-sm text-gray-700">Allow manual execution by responders</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="accent-green-600" />
                <span className="text-sm text-gray-700">Continue execution if an action fails</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-green-600" />
                <span className="text-sm text-gray-700">Log execution details to incident timeline</span>
              </label>
            </div>
          </div>
          {!isNew && (
            <div className="bg-white border border-red-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-3">Permanently delete this workflow. This action cannot be undone.</p>
              <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Delete Workflow</button>
            </div>
          )}
        </div>
      )}

      {showCatalog && <ActionCatalogModal onSelect={handleAddAction} onClose={() => setShowCatalog(false)} />}
    </div>
  );
}
