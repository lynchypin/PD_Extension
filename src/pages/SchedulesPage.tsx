import { useState } from 'react';
import { getStore } from '../data/store';
import { Calendar, Clock, Users, ChevronDown, ChevronRight, Plus } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const ROTATION_COLORS = ['bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200', 'bg-pink-200'];

export default function SchedulesPage() {
  const store = getStore();
  const [expanded, setExpanded] = useState<string | null>(store.schedules[0]?.id || null);
  const userMap = Object.fromEntries(store.users.map(u => [u.id, u]));
  const teamMap = Object.fromEntries(store.teams.map(t => [t.id, t]));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedules</h1>
          <p className="text-sm text-gray-500 mt-1">Manage on-call schedules and rotations for your teams.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> New Schedule
        </button>
      </div>

      <div className="space-y-3">
        {store.schedules.map(schedule => {
          const team = teamMap[schedule.teamId];
          const isExpanded = expanded === schedule.id;
          const scheduleUsers = schedule.users.map(uid => userMap[uid]).filter(Boolean);

          return (
            <div key={schedule.id} className="bg-white rounded-lg border">
              <button
                onClick={() => setExpanded(isExpanded ? null : schedule.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{schedule.name}</div>
                  <div className="text-xs text-gray-500">{team?.name || 'Unknown'} · {schedule.timezone}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex -space-x-2">
                    {scheduleUsers.slice(0, 4).map(u => (
                      <img key={u.id} src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{scheduleUsers.length} people</span>
                  {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Weekly Rotation View</div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-px bg-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-2 text-xs font-medium text-gray-500" />
                        {DAYS.map(day => (
                          <div key={day} className="bg-gray-50 p-2 text-xs font-medium text-gray-600 text-center">{day}</div>
                        ))}
                        {scheduleUsers.map((user, ui) => (
                          <>
                            <div key={`user-${user.id}`} className="bg-white p-2 flex items-center gap-1.5">
                              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                              <span className="text-xs text-gray-700 truncate">{user.name.split(' ')[0]}</span>
                            </div>
                            {DAYS.map((day, di) => {
                              const isOnCall = (di + ui) % scheduleUsers.length === 0;
                              return (
                                <div key={`${user.id}-${day}`} className="bg-white p-1">
                                  {isOnCall && (
                                    <div className={`${ROTATION_COLORS[ui % ROTATION_COLORS.length]} rounded px-2 py-1.5 text-center`}>
                                      <span className="text-[10px] font-medium text-gray-700">On-Call</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>Rotation: Weekly</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Handoff: Monday 9:00 AM {schedule.timezone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} />
                      <span>{scheduleUsers.length} participants</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}