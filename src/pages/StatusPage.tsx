import { getStore } from '../data/store';
import { Globe, CheckCircle, AlertTriangle, XCircle, Wrench, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  active: { label: 'Operational', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, dot: 'bg-green-500' },
  warning: { label: 'Degraded', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle, dot: 'bg-yellow-500' },
  critical: { label: 'Major Outage', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle, dot: 'bg-red-500' },
  maintenance: { label: 'Under Maintenance', color: 'text-blue-600', bg: 'bg-blue-100', icon: Wrench, dot: 'bg-blue-500' },
  disabled: { label: 'Disabled', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock, dot: 'bg-gray-400' },
};

const RECENT_EVENTS = [
  { time: '14:25', type: 'incident' as const, message: 'Database connection pool exhausted — P1 triggered on Database Cluster' },
  { time: '14:00', type: 'incident' as const, message: 'API Gateway 502 errors spike — P1 triggered on API Gateway' },
  { time: '12:30', type: 'incident' as const, message: 'Payment processing latency above threshold — acknowledged' },
  { time: '10:30', type: 'resolved' as const, message: 'CDN cache invalidation failure — resolved' },
  { time: '09:00', type: 'maintenance' as const, message: 'CDN & Static Assets — maintenance window started' },
];

export default function StatusPage() {
  const store = getStore();
  const operational = store.services.filter(s => s.status === 'active').length;
  const degraded = store.services.filter(s => s.status === 'warning').length;
  const critical = store.services.filter(s => s.status === 'critical').length;
  const maint = store.services.filter(s => s.status === 'maintenance').length;

  const overallStatus = critical > 0 ? 'critical' : degraded > 0 ? 'warning' : 'active';
  const overallConfig = STATUS_CONFIG[overallStatus];
  const OverallIcon = overallConfig.icon;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Status Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time status of all services across your organization.</p>
      </div>

      <div className={`rounded-xl border-2 p-6 mb-6 ${overallStatus === 'active' ? 'border-green-200 bg-green-50' : overallStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center gap-3">
          <OverallIcon size={28} className={overallConfig.color} />
          <div>
            <div className={`text-lg font-semibold ${overallConfig.color}`}>
              {overallStatus === 'active' ? 'All Systems Operational' : overallStatus === 'warning' ? 'Partial System Degradation' : 'Major System Outage'}
            </div>
            <div className="text-sm text-gray-600 mt-0.5">
              {operational} operational · {degraded} degraded · {critical} outage · {maint} maintenance
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Services</h2>
          <div className="bg-white rounded-lg border divide-y">
            {store.services.map(svc => {
              const cfg = STATUS_CONFIG[svc.status];
              const Icon = cfg.icon;
              const uptime = svc.status === 'critical' ? '98.7%' : svc.status === 'warning' ? '99.5%' : '99.99%';
              return (
                <div key={svc.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{svc.name}</div>
                    <div className="text-xs text-gray-500">{svc.team}</div>
                  </div>
                  <div className="text-xs text-gray-400">{uptime} uptime</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${cfg.bg} ${cfg.color}`}>
                    <Icon size={10} /> {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Events</h2>
          <div className="bg-white rounded-lg border divide-y">
            {RECENT_EVENTS.map((evt, i) => (
              <div key={i} className="p-3 hover:bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${evt.type === 'incident' ? 'bg-red-500' : evt.type === 'resolved' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="text-[11px] text-gray-400 font-medium">{evt.time}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{evt.message}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">30-Day Summary</h3>
            <div className="flex gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const rand = Math.random();
                const color = rand > 0.95 ? 'bg-red-400' : rand > 0.9 ? 'bg-yellow-400' : 'bg-green-400';
                return <div key={i} className={`flex-1 h-6 rounded-sm ${color}`} title={`Day ${30 - i}`} />;
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">30 days ago</span>
              <span className="text-[10px] text-gray-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}