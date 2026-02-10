import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStore } from '../data/store';
import {
  ChevronRight, Activity, Plug, Settings, GitBranch,
  AlertTriangle, CheckCircle, Clock, Plus, ExternalLink,
  MoreHorizontal, Edit2, Trash2, Zap, XCircle, Wrench, Ban,
  FileText,
} from 'lucide-react';

const TABS = ['Activity', 'Custom Fields', 'Integrations', 'Workflows', 'Settings', 'Service Dependencies'];

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'active': return <CheckCircle size={20} className="text-green-500" />;
    case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />;
    case 'critical': return <XCircle size={20} className="text-red-500" />;
    case 'maintenance': return <Wrench size={20} className="text-blue-500" />;
    case 'disabled': return <Ban size={20} className="text-gray-400" />;
    default: return <CheckCircle size={20} className="text-green-500" />;
  }
}

function ActivityTab({ serviceId }: { serviceId: string }) {
  const store = getStore();
  const incidents = store.incidents.filter(i => i.serviceId === serviceId);
  const openIncidents = incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          Open Incidents ({openIncidents.length})
        </h3>
        {openIncidents.length > 0 ? (
          <div className="space-y-2">
            {openIncidents.map(inc => (
              <Link key={inc.id} to={`/incidents/${inc.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${inc.status === 'triggered' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">#{inc.number} {inc.title}</div>
                    <div className="text-xs text-gray-500">Assigned to {inc.assignee}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${inc.status === 'triggered' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {inc.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No open incidents</p>
        )}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Changes</h3>
        <div className="space-y-3">
          {[
            { action: 'Integration "Datadog" added', time: '2 days ago', user: 'Sarah Chen' },
            { action: 'Escalation policy updated', time: '5 days ago', user: 'Mike Johnson' },
            { action: 'Service description updated', time: '1 week ago', user: 'Emily Davis' },
          ].map((change, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="text-sm text-gray-700">{change.action}</div>
                <div className="text-xs text-gray-500">by {change.user}</div>
              </div>
              <span className="text-xs text-gray-400">{change.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          Resolved Incidents ({resolvedIncidents.length})
        </h3>
        {resolvedIncidents.length > 0 ? (
          <div className="space-y-2">
            {resolvedIncidents.map(inc => (
              <Link key={inc.id} to={`/incidents/${inc.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">#{inc.number} {inc.title}</div>
                  <div className="text-xs text-gray-500">Resolved by {inc.assignee}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">resolved</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No resolved incidents</p>
        )}
      </div>
    </div>
  );
}

function CustomFieldsTab() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Custom Fields</h3>
        <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Field</button>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Environment', value: 'Production', type: 'Single Select' },
          { name: 'Region', value: 'US-West-2', type: 'Text' },
          { name: 'Tier', value: 'Tier 1', type: 'Single Select' },
          { name: 'Cost Center', value: 'ENG-001', type: 'Text' },
        ].map((field, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">{field.name}</div>
              <div className="text-xs text-gray-500">{field.type}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{field.value}</span>
              <button className="text-gray-400 hover:text-gray-600"><Edit2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsTab({ serviceId }: { serviceId: string }) {
  const store = getStore();
  const integrations = store.integrations.filter(i => i.serviceId === serviceId);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Integrations ({integrations.length})</h3>
          <button onClick={() => navigate(`/services/${serviceId}/integrations/add`)} className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Plus size={14} /> Add Integration
          </button>
        </div>
        <div className="space-y-2">
          {integrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plug size={20} className="text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                  <div className="text-xs text-gray-500">{integration.type} · {integration.vendor}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
              </div>
            </div>
          ))}
          {integrations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Plug size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No integrations configured</p>
              <button onClick={() => navigate(`/services/${serviceId}/integrations/add`)} className="mt-2 text-sm text-[#06ac38] hover:text-[#059c32]">Add your first integration</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Email Integration</h3>
        <p className="text-sm text-gray-500 mb-3">Send emails to this address to create incidents on this service:</p>
        <div className="flex items-center gap-2">
          <code className="text-sm bg-gray-100 px-3 py-1.5 rounded font-mono text-gray-700 flex-1">service-{serviceId}@example.pagerduty.com</code>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32]">Copy</button>
        </div>
      </div>
    </div>
  );
}

function WorkflowsTab() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Incident Workflows</h3>
        <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Workflow</button>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Auto-acknowledge on monitoring recovery', trigger: 'When monitoring resolves', enabled: true },
          { name: 'Page SRE lead for P1 incidents', trigger: 'When incident priority is P1', enabled: true },
          { name: 'Create Jira ticket', trigger: 'When incident is acknowledged', enabled: false },
        ].map((wf, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Zap size={16} className={wf.enabled ? 'text-yellow-500' : 'text-gray-300'} />
              <div>
                <div className="text-sm font-medium text-gray-900">{wf.name}</div>
                <div className="text-xs text-gray-500">{wf.trigger}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${wf.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {wf.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ serviceId }: { serviceId: string }) {
  const store = getStore();
  const service = store.services.find(s => s.id === serviceId)!;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input type="text" defaultValue={service.name} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea defaultValue={service.description} rows={3} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escalation Policy</label>
            <select defaultValue={service.escalationPolicyId} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              {store.escalationPolicies.map(ep => (
                <option key={ep.id} value={ep.id}>{ep.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="mt-4 bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg">Save Changes</button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Assign and Notify</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700">Auto-resolve incidents</span>
              <p className="text-xs text-gray-500">Automatically resolve incidents when recovery events are received</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700">Alert grouping</span>
              <p className="text-xs text-gray-500">Group related alerts into a single incident</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700">Transient alerts</span>
              <p className="text-xs text-gray-500">Auto-resolve alerts that resolve quickly</p>
            </div>
            <input type="checkbox" className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Incident Urgency</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="radio" name="urgency" defaultChecked className="text-[#06ac38] focus:ring-[#06ac38]" />
            <div>
              <span className="text-sm text-gray-700">High urgency (notify responders immediately)</span>
            </div>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="urgency" className="text-[#06ac38] focus:ring-[#06ac38]" />
            <div>
              <span className="text-sm text-gray-700">Low urgency (notify using low-urgency rules)</span>
            </div>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="urgency" className="text-[#06ac38] focus:ring-[#06ac38]" />
            <div>
              <span className="text-sm text-gray-700">Dynamic (based on time of day or support hours)</span>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 border-red-200">
        <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-3">These actions are irreversible. Proceed with caution.</p>
        <div className="flex gap-2">
          <button className="text-sm border border-yellow-500 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-50">Disable Service</button>
          <button className="text-sm border border-red-500 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50">Delete Service</button>
        </div>
      </div>
    </div>
  );
}

function ServiceDependenciesTab({ serviceId }: { serviceId: string }) {
  const store = getStore();
  const service = store.services.find(s => s.id === serviceId)!;
  const otherServices = store.services.filter(s => s.id !== serviceId).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Dependencies</h3>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Dependency</button>
        </div>

        <div className="relative py-8">
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs text-gray-500 font-medium uppercase">Depends On</div>
              {otherServices.slice(0, 2).map(s => (
                <Link key={s.id} to={`/services/${s.id}`} className="border rounded-lg p-3 hover:bg-gray-50 w-40 text-center">
                  <div className="text-sm font-medium text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.team}</div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <div className="text-gray-300">→</div>
            </div>

            <div className="border-2 border-[#06ac38] rounded-lg p-4 text-center bg-green-50 w-48">
              <div className="text-sm font-bold text-gray-900">{service.name}</div>
              <div className="text-xs text-gray-500">{service.team}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-gray-300">→</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="text-xs text-gray-500 font-medium uppercase">Used By</div>
              {otherServices.slice(2, 3).map(s => (
                <Link key={s.id} to={`/services/${s.id}`} className="border rounded-lg p-3 hover:bg-gray-50 w-40 text-center">
                  <div className="text-sm font-medium text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.team}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const store = getStore();
  const service = store.services.find(s => s.id === serviceId);
  const [activeTab, setActiveTab] = useState('Activity');

  if (!service) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <Link to="/services" className="text-[#06ac38] hover:text-[#059c32]">Back to Services</Link>
        </div>
      </div>
    );
  }

  const ep = store.escalationPolicies.find(e => e.id === service.escalationPolicyId);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/services" className="hover:text-gray-700">Services</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{service.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StatusIcon status={service.status} />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{service.name}</h1>
            <p className="text-sm text-gray-500">{service.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1">
            <Edit2 size={14} /> Edit
          </button>
          <button className="text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
        <span>Team: <Link to="/teams" className="text-blue-600 hover:text-blue-800">{service.team}</Link></span>
        <span>Escalation: <span className="text-gray-700">{service.escalationPolicy}</span></span>
        <span>Integrations: <span className="text-gray-700">{service.integrationCount}</span></span>
      </div>

      <div className="border-b mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#06ac38] text-[#06ac38]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Activity' && <ActivityTab serviceId={service.id} />}
      {activeTab === 'Custom Fields' && <CustomFieldsTab />}
      {activeTab === 'Integrations' && <IntegrationsTab serviceId={service.id} />}
      {activeTab === 'Workflows' && <WorkflowsTab />}
      {activeTab === 'Settings' && <SettingsTab serviceId={service.id} />}
      {activeTab === 'Service Dependencies' && <ServiceDependenciesTab serviceId={service.id} />}
    </div>
  );
}
