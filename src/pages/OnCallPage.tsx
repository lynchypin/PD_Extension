import { getStore } from '../data/store';
import { Clock, Phone, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const ON_CALL_NOW = [
  { scheduleId: 'sched-1', scheduleName: 'Platform Primary', userId: 'user-1', shiftStart: '2025-02-10T08:00:00Z', shiftEnd: '2025-02-10T20:00:00Z', level: 1 },
  { scheduleId: 'sched-2', scheduleName: 'SRE 24/7', userId: 'user-2', shiftStart: '2025-02-10T00:00:00Z', shiftEnd: '2025-02-11T00:00:00Z', level: 1 },
  { scheduleId: 'sched-2', scheduleName: 'SRE 24/7', userId: 'user-7', shiftStart: '2025-02-10T00:00:00Z', shiftEnd: '2025-02-11T00:00:00Z', level: 2 },
  { scheduleId: 'sched-3', scheduleName: 'Backend Weekday', userId: 'user-4', shiftStart: '2025-02-10T09:00:00Z', shiftEnd: '2025-02-10T17:00:00Z', level: 1 },
];

const UPCOMING_SHIFTS = [
  { scheduleName: 'Platform Primary', userId: 'user-2', start: '2025-02-10T20:00:00Z', end: '2025-02-11T08:00:00Z' },
  { scheduleName: 'SRE 24/7', userId: 'user-8', start: '2025-02-11T00:00:00Z', end: '2025-02-12T00:00:00Z' },
  { scheduleName: 'Backend Weekday', userId: 'user-6', start: '2025-02-11T09:00:00Z', end: '2025-02-11T17:00:00Z' },
];

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function timeUntil(dateStr: string) {
  const diff = Math.floor((new Date(dateStr).getTime() - Date.now()) / 1000);
  if (diff < 0) return 'now';
  if (diff < 3600) return `in ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `in ${Math.floor(diff / 3600)}h`;
  return `in ${Math.floor(diff / 86400)}d`;
}

export default function OnCallPage() {
  const store = getStore();
  const userMap = Object.fromEntries(store.users.map(u => [u.id, u]));

  const myActiveIncidents = store.incidents.filter(i => i.status !== 'resolved');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">On-Call</h1>
        <p className="text-sm text-gray-500 mt-1">See who is currently on-call across all schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Currently On-Call
          </h2>

          <div className="bg-white rounded-lg border divide-y">
            {ON_CALL_NOW.map((entry, i) => {
              const user = userMap[entry.userId];
              if (!user) return null;
              const userIncidents = myActiveIncidents.filter(inc => inc.assigneeId === entry.userId);
              return (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Level {entry.level}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{entry.scheduleName}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-500">{formatTime(entry.shiftStart)} – {formatTime(entry.shiftEnd)}</div>
                    {userIncidents.length > 0 ? (
                      <span className="text-xs text-red-600 flex items-center justify-end gap-1 mt-0.5">
                        <AlertTriangle size={10} /> {userIncidents.length} active incident{userIncidents.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 flex items-center justify-end gap-1 mt-0.5">
                        <CheckCircle size={10} /> No incidents
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mt-6">Upcoming Shifts</h2>
          <div className="bg-white rounded-lg border divide-y">
            {UPCOMING_SHIFTS.map((shift, i) => {
              const user = userMap[shift.userId];
              if (!user) return null;
              return (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{shift.scheduleName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{formatDate(shift.start)} · {formatTime(shift.start)} – {formatTime(shift.end)}</div>
                    <div className="text-xs text-blue-600 mt-0.5">{timeUntil(shift.start)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your On-Call Status</h2>
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">You are on-call</div>
                <div className="text-xs text-gray-500">Platform Primary</div>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Current shift</span>
                <span className="text-gray-900 font-medium">8:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ends in</span>
                <span className="text-gray-900 font-medium">5h 30m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next shift</span>
                <span className="text-gray-900 font-medium">Feb 12, 8:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Escalation level</span>
                <span className="text-gray-900 font-medium">Level 1 (Primary)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield size={14} className="text-gray-400" /> Coverage Gaps
            </h3>
            <div className="text-center py-4">
              <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">No coverage gaps</div>
              <div className="text-xs text-gray-400 mt-1">All schedules are fully covered for the next 7 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}