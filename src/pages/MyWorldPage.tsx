import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Clock, Users, Activity, AlertTriangle, CheckCircle,
  ChevronRight, Bell, Calendar, Layers, ArrowRight, Phone,
  Zap, BarChart3, ExternalLink,
} from 'lucide-react';
import { getStore } from '../data/store';
import { getOnboarding } from '../data/onboardingStore';

export default function MyWorldPage() {
  const store = getStore();
  const onboarding = getOnboarding();
  const currentUser = store.users[0];
  const userTeams = store.teams.filter(t => t.members.includes(currentUser.id));
  const userServices = store.services.filter(s => userTeams.some(t => t.id === s.teamId));
  const userSchedules = store.schedules.filter(s => s.users.includes(currentUser.id));
  const activeIncidents = store.incidents.filter(i => i.status !== 'resolved');
  const myIncidents = store.incidents.filter(i => i.assigneeId === currentUser.id && i.status !== 'resolved');
  const isOnCall = userSchedules.length > 0;

  const [showSetupBanner, setShowSetupBanner] = useState(
    onboarding.role === 'user' && onboarding.userData.contactMethods.length === 0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {onboarding.userData.profileName || currentUser.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening across your services.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isOnCall ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <Phone size={14} />
            {isOnCall ? 'On-Call Now' : 'Not On-Call'}
          </div>
        </div>
      </div>

      {showSetupBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-900">Complete your profile setup</div>
              <div className="text-xs text-blue-700">Add contact methods so you can receive incident notifications.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/users/user-1" className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
              Complete Setup <ArrowRight size={14} />
            </Link>
            <button onClick={() => setShowSetupBanner(false)} className="text-blue-400 hover:text-blue-600 text-xs ml-2">Dismiss</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-sm text-gray-500">My Incidents</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{myIncidents.length}</div>
          <div className="text-xs text-gray-400 mt-1">assigned to you</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-orange-500" />
            <span className="text-sm text-gray-500">Active Incidents</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{activeIncidents.length}</div>
          <div className="text-xs text-gray-400 mt-1">across all services</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-blue-500" />
            <span className="text-sm text-gray-500">My Services</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{userServices.length}</div>
          <div className="text-xs text-gray-400 mt-1">you're responsible for</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-purple-500" />
            <span className="text-sm text-gray-500">Schedules</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{userSchedules.length}</div>
          <div className="text-xs text-gray-400 mt-1">on-call rotations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                My Open Incidents
              </h2>
              <Link to="/" className="text-sm text-[#06ac38] hover:underline flex items-center gap-1">
                View all <ExternalLink size={12} />
              </Link>
            </div>
            {myIncidents.length > 0 ? (
              <div className="divide-y">
                {myIncidents.map(inc => (
                  <div key={inc.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full ${
                      inc.status === 'triggered' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{inc.title}</div>
                      <div className="text-xs text-gray-500">{inc.service} · #{inc.number}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inc.status === 'triggered' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inc.status}
                    </span>
                    {inc.priority && (
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{inc.priority}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-600">All clear!</div>
                <div className="text-xs text-gray-400">No incidents assigned to you right now.</div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                Service Health
              </h2>
              <Link to="/services" className="text-sm text-[#06ac38] hover:underline flex items-center gap-1">
                All services <ExternalLink size={12} />
              </Link>
            </div>
            <div className="divide-y">
              {userServices.map(svc => (
                <Link key={svc.id} to={`/services/${svc.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    svc.status === 'critical' ? 'bg-red-500' : svc.status === 'warning' ? 'bg-yellow-500' : svc.status === 'maintenance' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{svc.name}</div>
                    <div className="text-xs text-gray-500">{svc.team} · Last incident {svc.lastIncident}</div>
                  </div>
                  <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${
                    svc.status === 'active' ? 'bg-green-100 text-green-700' :
                    svc.status === 'critical' ? 'bg-red-100 text-red-700' :
                    svc.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{svc.status}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-xl">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-purple-500" />
                On-Call Status
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {isOnCall ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <div className="font-medium text-green-800">You're currently on-call</div>
                    <div className="text-xs text-green-600 mt-1">Next handoff: Tomorrow 9:00 AM</div>
                  </div>
                  {userSchedules.map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-700">{s.name}</span>
                      <span className="text-xs text-gray-400">{s.timezone}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-sm text-gray-500">You're not on any active on-call rotation.</div>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Your Teams
              </h2>
            </div>
            <div className="divide-y">
              {userTeams.map(team => (
                <div key={team.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{team.name}</div>
                    <div className="text-xs text-gray-500">{team.memberCount} members</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                Quick Actions
              </h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: 'Trigger new incident', path: '/', icon: AlertTriangle },
                { label: 'View analytics', path: '/analytics', icon: BarChart3 },
                { label: 'Edit notification rules', path: '/users/user-1', icon: Bell },
                { label: 'Manage schedules', path: '/schedules', icon: Calendar },
              ].map(a => (
                <Link
                  key={a.label}
                  to={a.path}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <a.icon size={14} className="text-gray-400" />
                  {a.label}
                  <ChevronRight size={12} className="text-gray-300 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
