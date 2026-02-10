import { useState } from 'react';
import { getStore } from '../data/store';
import { Plug, Search, ExternalLink, Plus, Grid, List, Layers } from 'lucide-react';

const VENDOR_COLORS: Record<string, string> = {
  Datadog: 'bg-purple-100 text-purple-700',
  AWS: 'bg-orange-100 text-orange-700',
  Slack: 'bg-pink-100 text-pink-700',
  PagerDuty: 'bg-green-100 text-green-700',
  Atlassian: 'bg-blue-100 text-blue-700',
  'New Relic': 'bg-teal-100 text-teal-700',
  GitHub: 'bg-gray-100 text-gray-700',
  Prometheus: 'bg-red-100 text-red-700',
  Grafana: 'bg-yellow-100 text-yellow-800',
  Sentry: 'bg-indigo-100 text-indigo-700',
};

const AVAILABLE_INTEGRATIONS = [
  { name: 'ServiceNow', category: 'ITSM', description: 'Sync incidents with ServiceNow tickets' },
  { name: 'Zendesk', category: 'Customer Support', description: 'Create PD incidents from Zendesk tickets' },
  { name: 'Terraform', category: 'Infrastructure', description: 'Manage PD resources as code' },
  { name: 'Microsoft Teams', category: 'Chat', description: 'Incident notifications in MS Teams' },
  { name: 'Splunk', category: 'Monitoring', description: 'Alert on Splunk search results' },
  { name: 'Dynatrace', category: 'APM', description: 'Send Dynatrace problems to PagerDuty' },
];

export default function IntegrationsListPage() {
  const store = getStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const serviceMap = Object.fromEntries(store.services.map(s => [s.id, s]));
  const filtered = store.integrations.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage integrations that send events into PagerDuty from your monitoring tools.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> Add Integration
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]/30 focus:border-[#06ac38]"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow' : ''}`}><Grid size={14} /></button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow' : ''}`}><List size={14} /></button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Active Integrations ({filtered.length})</h2>
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(integ => {
              const service = serviceMap[integ.serviceId];
              const colorClass = VENDOR_COLORS[integ.vendor] || 'bg-gray-100 text-gray-700';
              return (
                <div key={integ.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Plug size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{integ.name}</div>
                        <div className="text-xs text-gray-500">{integ.type}</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5" title="Active" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                    <Layers size={10} />
                    <span>{service?.name || 'Unknown Service'}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Vendor: {integ.vendor}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-[1fr_140px_140px_120px_100px] gap-4 px-4 py-2.5 border-b bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span>Integration</span>
              <span>Type</span>
              <span>Service</span>
              <span>Vendor</span>
              <span>Status</span>
            </div>
            {filtered.map(integ => {
              const service = serviceMap[integ.serviceId];
              return (
                <div key={integ.id} className="grid grid-cols-[1fr_140px_140px_120px_100px] gap-4 px-4 py-3 border-b last:border-0 hover:bg-gray-50 items-center">
                  <span className="text-sm font-medium text-gray-900">{integ.name}</span>
                  <span className="text-sm text-gray-600">{integ.type}</span>
                  <span className="text-sm text-gray-600">{service?.name || '—'}</span>
                  <span className="text-sm text-gray-600">{integ.vendor}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 rounded-full px-2 py-0.5 w-fit">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_INTEGRATIONS.map(ai => (
            <div key={ai.name} className="bg-white rounded-lg border border-dashed p-4 hover:border-[#06ac38] hover:bg-green-50/30 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{ai.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{ai.description}</div>
                  <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">{ai.category}</span>
                </div>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-[#06ac38]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}