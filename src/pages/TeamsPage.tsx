import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStore } from '../data/store';
import { Users, ChevronRight, Shield, Clock, Layers, Plus } from 'lucide-react';

export default function TeamsPage() {
  const store = getStore();
  const [search, setSearch] = useState('');

  const filtered = store.teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
          <p className="text-sm text-gray-500 mt-1">Manage teams and their members, services, and escalation policies.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> New Team
        </button>
      </div>

      <input
        type="text"
        placeholder="Search teams..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#06ac38]/30 focus:border-[#06ac38]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(team => {
          const teamServices = store.services.filter(s => s.teamId === team.id);
          const teamEps = store.escalationPolicies.filter(ep => ep.teamId === team.id);
          const teamMembers = store.users.filter(u => u.teams.includes(team.name));
          const activeIncidents = store.incidents.filter(i =>
            teamServices.some(s => s.id === i.serviceId) && i.status !== 'resolved'
          );

          return (
            <div key={team.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#06ac38]/10 rounded-lg flex items-center justify-center">
                      <Users size={18} className="text-[#06ac38]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-xs text-gray-500">{team.description}</p>
                    </div>
                  </div>
                  {activeIncidents.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {activeIncidents.length} active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Users size={12} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{teamMembers.length}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Members</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Layers size={12} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{teamServices.length}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Services</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Shield size={12} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{teamEps.length}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Policies</div>
                  </div>
                </div>

                <div className="mt-4 flex -space-x-2">
                  {teamMembers.slice(0, 5).map(u => (
                    <img
                      key={u.id}
                      src={u.avatar}
                      alt={u.name}
                      title={u.name}
                      className="w-7 h-7 rounded-full border-2 border-white"
                    />
                  ))}
                  {teamMembers.length > 5 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                      +{teamMembers.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t px-5 py-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-400">{teamServices.map(s => s.name).join(', ') || 'No services'}</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}