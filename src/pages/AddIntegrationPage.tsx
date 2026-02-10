import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStore } from '../data/store';
import { Search, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';

const INTEGRATION_CATALOG = [
  { id: 'datadog', name: 'Datadog', vendor: 'Datadog', type: 'Events API v2', category: 'Monitoring', description: 'Receive events from Datadog monitoring platform', icon: '📊' },
  { id: 'cloudwatch', name: 'Amazon CloudWatch', vendor: 'AWS', type: 'CloudWatch', category: 'Monitoring', description: 'Receive alarms from AWS CloudWatch', icon: '☁️' },
  { id: 'newrelic', name: 'New Relic', vendor: 'New Relic', type: 'New Relic', category: 'Monitoring', description: 'Receive alerts from New Relic', icon: '🔍' },
  { id: 'prometheus', name: 'Prometheus', vendor: 'Prometheus', type: 'Events API v2', category: 'Monitoring', description: 'Receive alerts from Prometheus Alertmanager', icon: '🔥' },
  { id: 'grafana', name: 'Grafana', vendor: 'Grafana', type: 'Events API v2', category: 'Monitoring', description: 'Receive alerts from Grafana', icon: '📈' },
  { id: 'nagios', name: 'Nagios', vendor: 'Nagios', type: 'Nagios', category: 'Monitoring', description: 'Receive alerts from Nagios monitoring', icon: '🔧' },
  { id: 'splunk', name: 'Splunk', vendor: 'Splunk', type: 'Splunk', category: 'Monitoring', description: 'Receive alerts from Splunk', icon: '📋' },
  { id: 'slack', name: 'Slack', vendor: 'Slack', type: 'Slack V2', category: 'ChatOps', description: 'Bi-directional Slack integration', icon: '💬' },
  { id: 'msteams', name: 'Microsoft Teams', vendor: 'Microsoft', type: 'MS Teams', category: 'ChatOps', description: 'Bi-directional Microsoft Teams integration', icon: '👥' },
  { id: 'jira', name: 'Jira Cloud', vendor: 'Atlassian', type: 'Jira Cloud', category: 'Ticketing', description: 'Create and sync Jira tickets with incidents', icon: '🎫' },
  { id: 'servicenow', name: 'ServiceNow', vendor: 'ServiceNow', type: 'ServiceNow', category: 'Ticketing', description: 'Bi-directional ServiceNow integration', icon: '🎯' },
  { id: 'github', name: 'GitHub', vendor: 'GitHub', type: 'GitHub', category: 'Development', description: 'Receive events from GitHub', icon: '🐙' },
  { id: 'sentry', name: 'Sentry', vendor: 'Sentry', type: 'Sentry', category: 'Development', description: 'Receive error alerts from Sentry', icon: '🐛' },
  { id: 'email', name: 'Email', vendor: 'PagerDuty', type: 'Email', category: 'Email', description: 'Create incidents via email', icon: '📧' },
  { id: 'eventsapiv2', name: 'Events API V2', vendor: 'PagerDuty', type: 'Events API v2', category: 'API', description: 'Send events via the Events API', icon: '🔌' },
  { id: 'zendesk', name: 'Zendesk', vendor: 'Zendesk', type: 'Zendesk', category: 'Customer Service', description: 'Create incidents from Zendesk tickets', icon: '🎧' },
  { id: 'terraform', name: 'Terraform', vendor: 'HashiCorp', type: 'Terraform', category: 'Infrastructure', description: 'Manage PagerDuty resources with Terraform', icon: '🏗️' },
  { id: 'ansible', name: 'Ansible', vendor: 'Red Hat', type: 'Ansible', category: 'Automation', description: 'Trigger Ansible playbooks from incidents', icon: '⚙️' },
];

const CATEGORIES = ['All', 'Monitoring', 'ChatOps', 'Ticketing', 'Development', 'Email', 'API', 'Customer Service', 'Infrastructure', 'Automation'];

export default function AddIntegrationPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const store = getStore();
  const service = store.services.find(s => s.id === serviceId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let list = INTEGRATION_CATALOG;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.vendor.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (activeCategory !== 'All') {
      list = list.filter(i => i.category === activeCategory);
    }
    return list;
  }, [searchQuery, activeCategory]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/services" className="hover:text-gray-700">Services</Link>
        <ChevronRight size={14} />
        <Link to={`/services/${serviceId}`} className="hover:text-gray-700">{service?.name || 'Service'}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">Add Integration</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-semibold text-gray-900">Add Integration</h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex">
          <div className="w-48 border-r p-4 flex-shrink-0">
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                    activeCategory === cat ? 'bg-green-50 text-[#06ac38] font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(integration => (
                <button
                  key={integration.id}
                  onClick={() => navigate(`/services/${serviceId}`)}
                  className="text-left border rounded-lg p-4 hover:bg-gray-50 hover:border-[#06ac38] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                      <div className="text-xs text-gray-500">{integration.vendor}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{integration.description}</p>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No integrations found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
