import { useState } from 'react';
import { getStore } from '../data/store';
import { AlertTriangle, CheckCircle, Clock, Filter, ChevronDown, ExternalLink } from 'lucide-react';

const MOCK_ALERTS = [
  { id: 'alert-1', summary: 'CPU usage above 95% on db-primary-01', severity: 'critical' as const, status: 'triggered' as const, service: 'Database Cluster', serviceId: 'svc-5', integration: 'Datadog', createdAt: '2025-02-10T14:20:00Z', incidentKey: 'inc-1' },
  { id: 'alert-2', summary: 'HTTP 502 rate exceeded threshold (>5% of requests)', severity: 'critical' as const, status: 'triggered' as const, service: 'API Gateway', serviceId: 'svc-3', integration: 'New Relic APM', createdAt: '2025-02-10T13:55:00Z', incidentKey: 'inc-2' },
  { id: 'alert-3', summary: 'Payment processing p99 latency > 2000ms', severity: 'error' as const, status: 'acknowledged' as const, service: 'Payment Gateway', serviceId: 'svc-1', integration: 'Datadog', createdAt: '2025-02-10T12:28:00Z', incidentKey: 'inc-3' },
  { id: 'alert-4', summary: 'Elasticsearch replication lag > 30s on cluster-east', severity: 'warning' as const, status: 'acknowledged' as const, service: 'Search Service', serviceId: 'svc-7', integration: 'Prometheus', createdAt: '2025-02-10T10:55:00Z', incidentKey: 'inc-4' },
  { id: 'alert-5', summary: 'CloudFront cache hit ratio dropped below 80%', severity: 'warning' as const, status: 'resolved' as const, service: 'CDN & Static Assets', serviceId: 'svc-8', integration: 'CloudWatch', createdAt: '2025-02-10T08:50:00Z', incidentKey: 'inc-5' },
  { id: 'alert-6', summary: 'SMTP relay queue depth > 10,000 messages', severity: 'error' as const, status: 'resolved' as const, service: 'Notification Service', serviceId: 'svc-6', integration: 'Datadog', createdAt: '2025-02-09T21:55:00Z', incidentKey: 'inc-6' },
  { id: 'alert-7', summary: 'Memory usage > 90% on auth-service-pod-3', severity: 'critical' as const, status: 'resolved' as const, service: 'User Authentication', serviceId: 'svc-2', integration: 'Prometheus', createdAt: '2025-02-09T17:50:00Z', incidentKey: 'inc-7' },
  { id: 'alert-8', summary: 'JS bundle parse error rate spike in production', severity: 'error' as const, status: 'resolved' as const, service: 'Web Application', serviceId: 'svc-4', integration: 'Sentry', createdAt: '2025-02-09T14:55:00Z', incidentKey: 'inc-8' },
  { id: 'alert-9', summary: 'Kafka consumer group lag > 50,000 on topic: events-raw', severity: 'warning' as const, status: 'resolved' as const, service: 'Data Pipeline', serviceId: 'svc-9', integration: 'Prometheus', createdAt: '2025-02-09T09:55:00Z', incidentKey: 'inc-9' },
  { id: 'alert-10', summary: 'Grafana dashboard API timeout on /api/dashboards', severity: 'info' as const, status: 'resolved' as const, service: 'Monitoring Stack', serviceId: 'svc-10', integration: 'Grafana Alerts', createdAt: '2025-02-08T13:50:00Z', incidentKey: 'inc-10' },
  { id: 'alert-11', summary: 'Disk usage > 85% on /data volume (db-replica-02)', severity: 'warning' as const, status: 'triggered' as const, service: 'Database Cluster', serviceId: 'svc-5', integration: 'CloudWatch', createdAt: '2025-02-10T14:10:00Z', incidentKey: null },
  { id: 'alert-12', summary: 'SSL certificate expiring in 7 days (api.example.com)', severity: 'info' as const, status: 'triggered' as const, service: 'API Gateway', serviceId: 'svc-3', integration: 'PagerDuty Email', createdAt: '2025-02-10T09:00:00Z', incidentKey: null },
];

const SEVERITY_STYLES = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  error: 'bg-orange-100 text-orange-800 border-orange-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

const STATUS_STYLES = {
  triggered: 'bg-red-100 text-red-800',
  acknowledged: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AlertsPage() {
  const [tab, setTab] = useState<'all' | 'triggered' | 'acknowledged' | 'resolved'>('all');
  const store = getStore();

  const filtered = tab === 'all' ? MOCK_ALERTS : MOCK_ALERTS.filter(a => a.status === tab);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <p className="text-sm text-gray-500 mt-1">Raw monitoring alerts from your integrations before they become incidents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <Filter size={14} /> Filter <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {(['all', 'triggered', 'acknowledged', 'resolved'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm rounded-md capitalize ${tab === t ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t} ({t === 'all' ? MOCK_ALERTS.length : MOCK_ALERTS.filter(a => a.status === t).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-[1fr_100px_120px_140px_120px_80px] gap-4 px-4 py-2.5 border-b bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span>Alert</span>
          <span>Severity</span>
          <span>Status</span>
          <span>Service</span>
          <span>Integration</span>
          <span>Time</span>
        </div>
        {filtered.map(alert => (
          <div key={alert.id} className="grid grid-cols-[1fr_100px_120px_140px_120px_80px] gap-4 px-4 py-3 border-b last:border-0 hover:bg-gray-50 items-center">
            <div>
              <div className="text-sm text-gray-900 font-medium">{alert.summary}</div>
              {alert.incidentKey && (
                <span className="text-xs text-[#06ac38] flex items-center gap-1 mt-0.5">
                  <ExternalLink size={10} /> Linked to {alert.incidentKey}
                </span>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border w-fit ${SEVERITY_STYLES[alert.severity]}`}>
              {alert.severity}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded w-fit ${STATUS_STYLES[alert.status]}`}>
              {alert.status === 'triggered' && <AlertTriangle size={10} />}
              {alert.status === 'acknowledged' && <Clock size={10} />}
              {alert.status === 'resolved' && <CheckCircle size={10} />}
              {alert.status}
            </span>
            <span className="text-sm text-gray-600 truncate">{alert.service}</span>
            <span className="text-xs text-gray-500">{alert.integration}</span>
            <span className="text-xs text-gray-400">{timeAgo(alert.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}