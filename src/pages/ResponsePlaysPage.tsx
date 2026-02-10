import { useState } from 'react';
import { Activity, Play, Users, Plus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const RESPONSE_PLAYS = [
  {
    id: 'rp-1',
    name: 'Major Incident Response',
    description: 'Mobilize the full incident response team for P1/P2 incidents. Pages all responders and opens a bridge call.',
    responders: ['Sarah Chen', 'Mike Johnson', 'Emily Davis'],
    subscribers: ['Rachel Taylor', 'James Wilson'],
    conferenceUrl: 'https://meet.example.com/major-incident',
    status: 'active' as const,
    lastRun: '2025-02-10T14:25:00Z',
    runCount: 12,
  },
  {
    id: 'rp-2',
    name: 'Database Emergency',
    description: 'Engage DBA team and SRE leads for critical database incidents. Includes runbook link.',
    responders: ['Mike Johnson', 'Sarah Chen'],
    subscribers: ['Emily Davis'],
    conferenceUrl: 'https://meet.example.com/db-emergency',
    status: 'active' as const,
    lastRun: '2025-02-09T18:00:00Z',
    runCount: 5,
  },
  {
    id: 'rp-3',
    name: 'Customer-Facing Outage',
    description: 'Notify customer support leadership and begin status page updates for customer-impacting incidents.',
    responders: ['Lisa Anderson', 'David Brown'],
    subscribers: ['Rachel Taylor', 'Emily Davis', 'James Wilson'],
    conferenceUrl: null,
    status: 'active' as const,
    lastRun: '2025-01-28T10:30:00Z',
    runCount: 8,
  },
  {
    id: 'rp-4',
    name: 'Security Incident',
    description: 'Engage security team and begin forensic investigation protocol for security-related incidents.',
    responders: ['Sarah Chen', 'Mike Johnson'],
    subscribers: ['Emily Davis', 'Rachel Taylor'],
    conferenceUrl: 'https://meet.example.com/security',
    status: 'inactive' as const,
    lastRun: null,
    runCount: 0,
  },
];

export default function ResponsePlaysPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const filtered = filter === 'all' ? RESPONSE_PLAYS : RESPONSE_PLAYS.filter(rp => rp.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Response Plays</h1>
          <p className="text-sm text-gray-500 mt-1">Pre-defined incident response actions to mobilize responders and coordinate response.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> New Response Play
        </button>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {(['all', 'active', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md capitalize ${filter === f ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(rp => (
          <div key={rp.id} className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rp.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Activity size={18} className={rp.status === 'active' ? 'text-green-600' : 'text-gray-400'} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{rp.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 max-w-lg">{rp.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rp.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {rp.status}
                </span>
                <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium">
                  <Play size={10} /> Run
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span>Responders: {rp.responders.join(', ')}</span>
              </div>
              {rp.subscribers.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  <span>{rp.subscribers.length} subscriber{rp.subscribers.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>Run {rp.runCount} time{rp.runCount !== 1 ? 's' : ''}</span>
              </div>
              {rp.lastRun && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={12} />
                  <span>Last: {new Date(rp.lastRun).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}