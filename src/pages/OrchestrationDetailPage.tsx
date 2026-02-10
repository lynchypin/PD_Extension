import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStore, saveStore, type OrchestrationRule } from '../data/store';
import {
  ChevronRight, ArrowLeft, Plus, Trash2, Edit2, Copy, Globe, Layers,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  GripVertical, ToggleLeft, ToggleRight, Key, Settings, GitBranch, X,
} from 'lucide-react';

const TABS_GLOBAL = ['Overview', 'Integrations', 'Global Orchestration'];
const TABS_SERVICE = ['Overview', 'Integrations', 'Service Orchestration'];

function RuleCard({ rule, index, onToggle, onDelete }: { rule: OrchestrationRule; index: number; onToggle: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg ${rule.disabled ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center gap-3 p-4">
        <GripVertical size={14} className="text-gray-300 cursor-grab" />
        <span className="text-xs font-mono text-gray-400 w-6">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{rule.label}</p>
            {rule.disabled && <span className="px-1.5 py-0.5 bg-gray-200 rounded text-xs text-gray-500">Disabled</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">{rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={onToggle} className="p-1.5 rounded hover:bg-gray-100">
            {rule.disabled ? <ToggleLeft size={16} className="text-gray-400" /> : <ToggleRight size={16} className="text-green-600" />}
          </button>
          <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t pt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Conditions (match ALL)</p>
            <div className="space-y-1">
              {rule.conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2 text-xs">
                  <span className="font-mono text-blue-600">{c.field}</span>
                  <span className="text-gray-400">{c.operator}</span>
                  <span className="font-mono text-green-600">"{c.value}"</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Actions</p>
            <div className="space-y-1">
              {rule.actions.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-green-50 rounded px-3 py-2 text-xs">
                  <span className="font-medium text-green-800">{a.type.replace(/_/g, ' ')}</span>
                  <span className="text-green-600">→ {a.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewRuleModal({ onSave, onClose }: { onSave: (rule: OrchestrationRule) => void; onClose: () => void }) {
  const [label, setLabel] = useState('');
  const [condField, setCondField] = useState('event.source');
  const [condOp, setCondOp] = useState('contains');
  const [condVal, setCondVal] = useState('');
  const [actionType, setActionType] = useState('route_to');
  const [actionVal, setActionVal] = useState('');

  const handleSave = () => {
    onSave({
      id: `or-${Date.now()}`,
      label: label || 'New Rule',
      conditions: [{ field: condField, operator: condOp, value: condVal }],
      actions: [{ type: actionType, value: actionVal }],
      order: 0,
      disabled: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">New Event Rule</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Rule Label</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., Route database alerts" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Condition</p>
            <div className="flex items-center gap-2">
              <select value={condField} onChange={e => setCondField(e.target.value)} className="border rounded px-2 py-1.5 text-sm flex-1">
                <option value="event.source">event.source</option>
                <option value="event.severity">event.severity</option>
                <option value="event.summary">event.summary</option>
                <option value="event.component">event.component</option>
                <option value="event.class">event.class</option>
                <option value="event.custom_details.environment">event.custom_details.environment</option>
              </select>
              <select value={condOp} onChange={e => setCondOp(e.target.value)} className="border rounded px-2 py-1.5 text-sm">
                <option value="contains">contains</option>
                <option value="equals">equals</option>
                <option value="matches">matches</option>
                <option value="does_not_contain">does not contain</option>
              </select>
              <input type="text" value={condVal} onChange={e => setCondVal(e.target.value)} placeholder="value" className="border rounded px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Action</p>
            <div className="flex items-center gap-2">
              <select value={actionType} onChange={e => setActionType(e.target.value)} className="border rounded px-2 py-1.5 text-sm flex-1">
                <option value="route_to">Route to Service</option>
                <option value="set_priority">Set Priority</option>
                <option value="set_severity">Set Severity</option>
                <option value="suppress">Suppress</option>
                <option value="dedupe_key">Set Dedup Key</option>
              </select>
              <input type="text" value={actionVal} onChange={e => setActionVal(e.target.value)} placeholder="value" className="border rounded px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-green-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">Create Rule</button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ orch }: { orch: ReturnType<typeof getStore>['orchestrations'][0] }) {
  const store = getStore();
  const service = orch.serviceId ? store.services.find(s => s.id === orch.serviceId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex"><dt className="w-32 text-gray-500">Type</dt><dd className="capitalize">{orch.type}</dd></div>
            <div className="flex"><dt className="w-32 text-gray-500">Description</dt><dd>{orch.description}</dd></div>
            {service && <div className="flex"><dt className="w-32 text-gray-500">Service</dt><dd><Link to={`/services/${service.id}`} className="text-blue-600 hover:text-blue-800">{service.name}</Link></dd></div>}
            <div className="flex"><dt className="w-32 text-gray-500">Rules</dt><dd>{orch.rules.length} ({orch.rules.filter(r => !r.disabled).length} active)</dd></div>
            <div className="flex"><dt className="w-32 text-gray-500">Created</dt><dd>{new Date(orch.createdAt).toLocaleDateString()}</dd></div>
            <div className="flex"><dt className="w-32 text-gray-500">Last Updated</dt><dd>{new Date(orch.updatedAt).toLocaleDateString()}</dd></div>
          </dl>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rule Summary</h3>
          <div className="space-y-2">
            {orch.rules.map((rule, i) => (
              <div key={rule.id} className="flex items-center gap-3 text-sm">
                <span className="text-xs font-mono text-gray-400 w-6">{i + 1}</span>
                <span className={rule.disabled ? 'text-gray-400 line-through' : 'text-gray-900'}>{rule.label}</span>
                <span className="text-xs text-gray-400 ml-auto">{rule.conditions.length} conditions → {rule.actions.length} actions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Rules</span>
              <span className="font-medium">{orch.rules.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Active Rules</span>
              <span className="font-medium text-green-600">{orch.rules.filter(r => !r.disabled).length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Disabled Rules</span>
              <span className="font-medium text-gray-400">{orch.rules.filter(r => r.disabled).length}</span>
            </div>
          </div>
        </div>
        {orch.integrationKey && (
          <div className="bg-white border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Integration Key</h3>
            <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
              <Key size={14} className="text-gray-400" />
              <code className="text-xs text-gray-600 flex-1 truncate">{orch.integrationKey}</code>
              <button className="text-xs text-blue-600 hover:text-blue-800"><Copy size={12} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IntegrationsTab({ orch }: { orch: ReturnType<typeof getStore>['orchestrations'][0] }) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Integration Keys</h3>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs text-gray-600 hover:bg-gray-50"><Plus size={12} /> New Key</button>
      </div>
      {orch.integrationKey ? (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Default Integration Key</p>
              <p className="text-xs text-gray-500 mt-1">Send events to this orchestration using the Events API v2</p>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
          </div>
          <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded px-3 py-2">
            <Key size={14} className="text-gray-400" />
            <code className="text-xs text-gray-600 flex-1">{orch.integrationKey}</code>
            <button className="text-xs text-blue-600 hover:text-blue-800">Copy</button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Key size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No integration keys configured</p>
          <p className="text-xs mt-1">Create an integration key to send events to this orchestration</p>
        </div>
      )}
    </div>
  );
}

function RulesTab({ orchId }: { orchId: string }) {
  const store = getStore();
  const orch = store.orchestrations.find(o => o.id === orchId)!;
  const [showNewRule, setShowNewRule] = useState(false);

  const handleToggle = (ruleIndex: number) => {
    orch.rules[ruleIndex].disabled = !orch.rules[ruleIndex].disabled;
    saveStore(store);
  };

  const handleDelete = (ruleIndex: number) => {
    orch.rules.splice(ruleIndex, 1);
    saveStore(store);
  };

  const handleAddRule = (rule: OrchestrationRule) => {
    rule.order = orch.rules.length + 1;
    orch.rules.push(rule);
    saveStore(store);
    setShowNewRule(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Rules</h3>
          <p className="text-xs text-gray-500 mt-0.5">Rules are evaluated from top to bottom. The first matching rule will be applied.</p>
        </div>
        <button onClick={() => setShowNewRule(true)} className="inline-flex items-center gap-2 px-3 py-2 bg-[#25352c] text-white rounded-lg text-sm font-medium hover:bg-[#1a2820]">
          <Plus size={14} /> New Rule
        </button>
      </div>

      <div className="space-y-2">
        {orch.rules.map((rule, i) => (
          <RuleCard key={rule.id} rule={rule} index={i} onToggle={() => handleToggle(i)} onDelete={() => handleDelete(i)} />
        ))}
      </div>

      {orch.rules.length === 0 && (
        <div className="text-center py-12 bg-white border rounded-lg text-gray-500">
          <GitBranch size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No rules configured</p>
          <p className="text-xs mt-1">Add rules to route and transform events</p>
        </div>
      )}

      <div className="mt-4 border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center"><span className="text-xs font-bold text-gray-500">∞</span></div>
          <div>
            <p className="text-sm font-medium text-gray-600">Catch-All Rule</p>
            <p className="text-xs text-gray-400">Events that don't match any rule above will use default routing</p>
          </div>
        </div>
      </div>

      {showNewRule && <NewRuleModal onSave={handleAddRule} onClose={() => setShowNewRule(false)} />}
    </div>
  );
}

export default function OrchestrationDetailPage() {
  const { orchestrationId } = useParams();
  const store = getStore();
  const orch = store.orchestrations.find(o => o.id === orchestrationId);

  const tabs = orch?.type === 'global' ? TABS_GLOBAL : TABS_SERVICE;
  const [activeTab, setActiveTab] = useState(tabs[0]);

  if (!orch) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Orchestration Not Found</h2>
          <Link to="/automation/orchestration" className="text-sm text-blue-600 hover:text-blue-800">Back to Orchestrations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/automation/orchestration" className="hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={14} /> Event Orchestration</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{orch.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${orch.type === 'global' ? 'bg-purple-100' : 'bg-blue-100'}`}>
            {orch.type === 'global' ? <Globe size={20} className="text-purple-600" /> : <Layers size={20} className="text-blue-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{orch.name}</h1>
            <p className="text-sm text-gray-500">{orch.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Settings size={14} /> Settings</button>
        </div>
      </div>

      <div className="border-b mb-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' && <OverviewTab orch={orch} />}
      {activeTab === 'Integrations' && <IntegrationsTab orch={orch} />}
      {(activeTab === 'Global Orchestration' || activeTab === 'Service Orchestration') && <RulesTab orchId={orch.id} />}
    </div>
  );
}
