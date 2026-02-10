import { useState } from 'react';
import { Bot, Zap, GitMerge, BarChart3, ToggleLeft, ToggleRight, AlertTriangle, TrendingDown } from 'lucide-react';

const AI_FEATURES = [
  {
    id: 'noise-reduction',
    name: 'Intelligent Alert Grouping',
    description: 'Automatically groups related alerts into a single incident to reduce noise.',
    enabled: true,
    stats: { grouped: 847, saved: '72%', lastWeek: 142 },
  },
  {
    id: 'similar-incidents',
    name: 'Similar Incidents',
    description: 'Surfaces past incidents with similar characteristics to accelerate resolution.',
    enabled: true,
    stats: { matched: 234, accuracy: '89%', lastWeek: 18 },
  },
  {
    id: 'change-correlation',
    name: 'Change Correlation',
    description: 'Correlates incidents with recent deployments and infrastructure changes.',
    enabled: false,
    stats: { correlated: 56, accuracy: '78%', lastWeek: 0 },
  },
  {
    id: 'auto-pause',
    name: 'Auto-Pause Transient Alerts',
    description: 'Holds alerts for a short period and auto-resolves if they recover, reducing noise from flapping services.',
    enabled: true,
    stats: { paused: 312, autoResolved: '45%', lastWeek: 28 },
  },
  {
    id: 'predicted-escalation',
    name: 'Predicted Escalation',
    description: 'Predicts which incidents are likely to escalate based on historical patterns.',
    enabled: false,
    stats: { predictions: 89, accuracy: '82%', lastWeek: 0 },
  },
];

const RECENT_GROUPINGS = [
  { group: 'Database connection pool alerts', count: 4, services: ['Database Cluster'], time: '14m ago' },
  { group: 'API Gateway 5xx error alerts', count: 3, services: ['API Gateway', 'Payment Gateway'], time: '45m ago' },
  { group: 'Kafka consumer lag alerts', count: 6, services: ['Data Pipeline', 'Search Service'], time: '2h ago' },
  { group: 'SSL certificate expiration warnings', count: 2, services: ['API Gateway', 'Web Application'], time: '5h ago' },
];

export default function AIOpsPage() {
  const [features, setFeatures] = useState(AI_FEATURES);

  const toggle = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AIOps</h1>
          <p className="text-sm text-gray-500 mt-1">Configure intelligent alert grouping, noise reduction, and event intelligence.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
          <Bot size={14} />
          <span className="font-medium">AI Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingDown size={14} /> <span className="text-xs font-medium uppercase">Noise Reduced</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">72%</div>
          <div className="text-xs text-green-600 mt-1">847 alerts grouped this month</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <GitMerge size={14} /> <span className="text-xs font-medium uppercase">Auto-Grouped</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">142</div>
          <div className="text-xs text-gray-500 mt-1">alerts grouped this week</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <BarChart3 size={14} /> <span className="text-xs font-medium uppercase">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">89%</div>
          <div className="text-xs text-gray-500 mt-1">grouping accuracy rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">AI Features</h2>
          {features.map(feature => (
            <div key={feature.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${feature.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Zap size={16} className={feature.enabled ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{feature.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-md">{feature.description}</div>
                  </div>
                </div>
                <button onClick={() => toggle(feature.id)} className="flex-shrink-0">
                  {feature.enabled ? (
                    <ToggleRight size={28} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Groupings</h2>
          <div className="bg-white rounded-lg border divide-y">
            {RECENT_GROUPINGS.map((g, i) => (
              <div key={i} className="p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{g.group}</span>
                  <span className="text-[11px] text-gray-400">{g.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-purple-50 text-purple-700 rounded px-1.5 py-0.5 font-medium">{g.count} alerts merged</span>
                  <span className="text-xs text-gray-500">{g.services.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}