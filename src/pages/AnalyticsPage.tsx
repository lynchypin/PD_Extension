import { useState } from 'react';
import { getStore } from '../data/store';
import { BarChart3, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PERIOD_OPTIONS = ['7 days', '30 days', '90 days'] as const;

const METRICS = {
  '7 days': { mtta: '3m 12s', mttr: '47m', totalIncidents: 28, p1Count: 4, resolvedPct: 92, change: { mtta: -15, mttr: -8, incidents: 12 } },
  '30 days': { mtta: '4m 05s', mttr: '1h 02m', totalIncidents: 112, p1Count: 14, resolvedPct: 95, change: { mtta: -22, mttr: -12, incidents: -5 } },
  '90 days': { mtta: '5m 30s', mttr: '1h 18m', totalIncidents: 347, p1Count: 41, resolvedPct: 97, change: { mtta: -10, mttr: -18, incidents: 3 } },
};

const TEAM_STATS = [
  { team: 'SRE', incidents: 45, mtta: '2m 10s', mttr: '35m', onCallHours: 168 },
  { team: 'Platform Engineering', incidents: 38, mtta: '3m 45s', mttr: '52m', onCallHours: 120 },
  { team: 'Backend Services', incidents: 22, mtta: '4m 20s', mttr: '1h 05m', onCallHours: 80 },
  { team: 'Frontend', incidents: 12, mtta: '6m 15s', mttr: '45m', onCallHours: 40 },
  { team: 'Data Engineering', incidents: 8, mtta: '5m 00s', mttr: '38m', onCallHours: 40 },
];

const HOURLY_DATA = [2, 1, 0, 0, 0, 1, 3, 5, 8, 12, 10, 7, 6, 8, 11, 9, 7, 5, 4, 3, 2, 1, 1, 2];

const SERVICE_HEALTH = [
  { name: 'Database Cluster', incidents: 8, trend: 'up' as const },
  { name: 'API Gateway', incidents: 6, trend: 'up' as const },
  { name: 'Payment Gateway', incidents: 5, trend: 'down' as const },
  { name: 'Web Application', incidents: 4, trend: 'down' as const },
  { name: 'Notification Service', incidents: 3, trend: 'stable' as const },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<keyof typeof METRICS>('30 days');
  const m = METRICS[period];
  const maxHourly = Math.max(...HOURLY_DATA);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Incident analytics, response metrics, and team performance.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {PERIOD_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md ${period === p ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="MTTA" value={m.mtta} change={m.change.mtta} icon={<Clock size={16} className="text-blue-600" />} goodDown />
        <MetricCard label="MTTR" value={m.mttr} change={m.change.mttr} icon={<CheckCircle size={16} className="text-green-600" />} goodDown />
        <MetricCard label="Total Incidents" value={String(m.totalIncidents)} change={m.change.incidents} icon={<AlertTriangle size={16} className="text-orange-600" />} goodDown />
        <MetricCard label="P1 Incidents" value={String(m.p1Count)} change={0} icon={<AlertTriangle size={16} className="text-red-600" />} goodDown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Incidents by Hour (Last 24h)</h3>
          <div className="flex items-end gap-1 h-32">
            {HOURLY_DATA.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#06ac38]/70 rounded-t hover:bg-[#06ac38] transition-colors"
                  style={{ height: `${(val / maxHourly) * 100}%`, minHeight: val > 0 ? 4 : 0 }}
                  title={`${i}:00 — ${val} incidents`}
                />
                {i % 4 === 0 && <span className="text-[9px] text-gray-400">{i}:00</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Services by Incidents</h3>
          <div className="space-y-3">
            {SERVICE_HEALTH.map(svc => (
              <div key={svc.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">{svc.name}</div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-[#06ac38] h-1.5 rounded-full" style={{ width: `${(svc.incidents / SERVICE_HEALTH[0].incidents) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900">{svc.incidents}</span>
                  {svc.trend === 'up' && <ArrowUpRight size={12} className="text-red-500" />}
                  {svc.trend === 'down' && <ArrowDownRight size={12} className="text-green-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-5 border-b">
          <h3 className="text-sm font-semibold text-gray-900">Team Performance</h3>
        </div>
        <div className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-2.5 border-b bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span>Team</span>
          <span>Incidents</span>
          <span>MTTA</span>
          <span>MTTR</span>
          <span>On-Call Hours</span>
        </div>
        {TEAM_STATS.map(row => (
          <div key={row.team} className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-3 border-b last:border-0 hover:bg-gray-50 items-center">
            <span className="text-sm font-medium text-gray-900">{row.team}</span>
            <span className="text-sm text-gray-700">{row.incidents}</span>
            <span className="text-sm text-gray-700">{row.mtta}</span>
            <span className="text-sm text-gray-700">{row.mttr}</span>
            <span className="text-sm text-gray-700">{row.onCallHours}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon, goodDown }: { label: string; value: string; change: number; icon: React.ReactNode; goodDown?: boolean }) {
  const isGood = goodDown ? change <= 0 : change >= 0;
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {change !== 0 && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
          {change < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          {Math.abs(change)}% vs previous period
        </div>
      )}
    </div>
  );
}