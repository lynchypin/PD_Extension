import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStore, saveStore, type User } from '../data/store';
import {
  Mail, Phone, MapPin, Clock, Shield, Users, Calendar,
  Bell, Edit2, ChevronRight, Plus, Trash2, Globe,
} from 'lucide-react';
import TermTooltip from '../components/TermTooltip';

const TABS = ['My Profile', 'Contact Information', 'Notification Rules', 'User Settings', 'Permissions & Teams', 'On-Call Shifts', 'Subscriptions'];

function MyProfileTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-6">
          <img src={user.avatar} alt="" className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.title}</p>
              </div>
              <button className="text-sm text-gray-600 border rounded-lg px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1">
                <Edit2 size={14} /> Edit Profile
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" /> {user.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400" /> {user.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} className="text-gray-400" /> {user.timezone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={14} className="text-gray-400" /> {user.role}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe size={14} className="text-gray-400" /> {user.department}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          <TermTooltip termId="team" inline>Teams</TermTooltip>
        </h3>
        <div className="space-y-2">
          {user.teams.map(team => (
            <Link key={team} to="/teams" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{team}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Acknowledged incident #1845', time: '2 hours ago' },
            { action: 'Resolved incident #1842', time: '5 hours ago' },
            { action: 'Was assigned to incident #1845', time: '6 hours ago' },
            { action: 'Joined team "Platform Engineering"', time: '3 days ago' },
            { action: 'Updated notification rules', time: '1 week ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
              <span className="text-gray-700">{activity.action}</span>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactInfoTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            <TermTooltip termId="contact-method" inline>Contact Methods</TermTooltip>
          </h3>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Contact Method</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Phone size={16} className="text-blue-600" /></div>
              <div>
                <div className="text-sm font-medium text-gray-900">Voice</div>
                <div className="text-xs text-gray-500">{user.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">Edit</button>
              <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Phone size={16} className="text-green-600" /></div>
              <div>
                <div className="text-sm font-medium text-gray-900">SMS</div>
                <div className="text-xs text-gray-500">{user.smsPhone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">Edit</button>
              <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><Mail size={16} className="text-purple-600" /></div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">Edit</button>
              <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 1.5h9l2 4.5-2 4.5h-9l-2-4.5 2-4.5z" fill="#E6A817"/></svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Slack</div>
                <div className="text-xs text-gray-500">@{user.name.toLowerCase().replace(' ', '.')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationRulesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              <TermTooltip termId="notification-rule" inline>High-Urgency Notifications</TermTooltip>
            </h3>
            <p className="text-xs text-gray-500">How you want to be notified for high-urgency incidents</p>
          </div>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Rule</button>
        </div>
        <div className="space-y-2">
          {[
            { method: 'Push notification', delay: 'Immediately', icon: Bell },
            { method: 'Phone call', delay: 'After 1 minute', icon: Phone },
            { method: 'SMS', delay: 'After 2 minutes', icon: Phone },
            { method: 'Email', delay: 'After 5 minutes', icon: Mail },
          ].map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <rule.icon size={16} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{rule.method}</div>
                  <div className="text-xs text-gray-500">{rule.delay}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">Edit</button>
                <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Low-Urgency Notifications</h3>
            <p className="text-xs text-gray-500">How you want to be notified for low-urgency incidents</p>
          </div>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Rule</button>
        </div>
        <div className="space-y-2">
          {[
            { method: 'Email', delay: 'Immediately', icon: Mail },
            { method: 'Push notification', delay: 'After 5 minutes', icon: Bell },
          ].map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <rule.icon size={16} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{rule.method}</div>
                  <div className="text-xs text-gray-500">{rule.delay}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-500 hover:text-gray-700 border rounded px-2 py-1">Edit</button>
                <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Incident Status Updates</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
            <span className="text-sm text-gray-700">When an incident I'm assigned to is acknowledged</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
            <span className="text-sm text-gray-700">When an incident I'm assigned to is resolved</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
            <span className="text-sm text-gray-700">When an incident I'm assigned to is escalated</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
            <span className="text-sm text-gray-700">When an incident I'm assigned to is reassigned</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function UserSettingsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input type="text" defaultValue={user.name} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" defaultValue={user.title} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select defaultValue={user.timezone} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              <option>America/Los_Angeles</option>
              <option>America/Denver</option>
              <option>America/Chicago</option>
              <option>America/New_York</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" defaultValue={user.location} className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]" />
          </div>
        </div>
        <button className="mt-4 bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg">Save Changes</button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Web App Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable desktop notifications</span>
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Play notification sounds</span>
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show incident count in browser tab</span>
            <input type="checkbox" defaultChecked className="rounded text-[#06ac38] focus:ring-[#06ac38]" />
          </label>
        </div>
      </div>
    </div>
  );
}

function PermissionsTeamsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Base Role</h3>
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
          <Shield size={20} className="text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">{user.role}</div>
            <div className="text-xs text-gray-500">
              {user.role === 'Owner' && 'Full access to all account settings and features'}
              {user.role === 'Admin' && 'Can manage users, services, and most account settings'}
              {user.role === 'Manager' && 'Can manage teams and services they belong to'}
              {user.role === 'Responder' && 'Can respond to and manage incidents'}
              {user.role === 'Observer' && 'Read-only access to incidents and services'}
              {user.role === 'Restricted Access' && 'Limited access based on team membership'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Team Memberships</h3>
          <button className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add to Team</button>
        </div>
        <div className="space-y-2">
          {user.teams.map(team => (
            <div key={team} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{team}</div>
                  <div className="text-xs text-gray-500">Member</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs border rounded px-2 py-1">
                  <option>Member</option>
                  <option>Manager</option>
                </select>
                <button className="text-xs text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">License</h3>
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
          <div>
            <div className="text-sm font-medium text-gray-900">{user.license}</div>
            <div className="text-xs text-gray-500">
              {user.license === 'Full User' ? 'Can be on-call and respond to incidents' : 'Can view incidents and subscribe to updates'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnCallShiftsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Current On-Call</h3>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Calendar size={16} />
            <span className="text-sm font-medium">Currently on call for Platform Primary</span>
          </div>
          <div className="text-xs text-green-700 mt-1 ml-6">Until Feb 14, 2025 at 9:00 AM PST</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Shifts</h3>
        <div className="space-y-2">
          {[
            { schedule: 'Platform Primary', start: 'Feb 17, 2025 9:00 AM', end: 'Feb 21, 2025 9:00 AM' },
            { schedule: 'SRE 24/7', start: 'Feb 24, 2025 12:00 AM', end: 'Mar 3, 2025 12:00 AM' },
            { schedule: 'Platform Primary', start: 'Mar 10, 2025 9:00 AM', end: 'Mar 14, 2025 9:00 AM' },
          ].map((shift, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">{shift.schedule}</div>
                <div className="text-xs text-gray-500">{shift.start} — {shift.end}</div>
              </div>
              <button className="text-xs text-[#06ac38] hover:text-[#059c32]">Create Override</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Schedule Memberships</h3>
        <div className="space-y-2">
          {['Platform Primary', 'SRE 24/7'].map(sched => (
            <Link key={sched} to="/schedules" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{sched}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscriptionsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Incident Subscriptions</h3>
        <p className="text-sm text-gray-500 mb-4">Subscribe to incidents on specific services to receive updates without being assigned.</p>
        <div className="space-y-2">
          {[
            { service: 'Payment Gateway', type: 'All incidents' },
            { service: 'Database Cluster', type: 'High-urgency only' },
            { service: 'API Gateway', type: 'All incidents' },
          ].map((sub, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">{sub.service}</div>
                <div className="text-xs text-gray-500">{sub.type}</div>
              </div>
              <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1"><Plus size={14} /> Add Subscription</button>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const store = getStore();
  const user = store.users.find(u => u.id === userId);
  const [activeTab, setActiveTab] = useState('My Profile');

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-4">The user you're looking for doesn't exist.</p>
          <Link to="/users" className="text-[#06ac38] hover:text-[#059c32]">Back to Users</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/users" className="hover:text-gray-700">People</Link>
        <ChevronRight size={14} />
        <Link to="/users" className="hover:text-gray-700">Users</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900">{user.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.title} · {user.email}</p>
        </div>
      </div>

      <div className="border-b mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#06ac38] text-[#06ac38]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'My Profile' && <MyProfileTab user={user} />}
      {activeTab === 'Contact Information' && <ContactInfoTab user={user} />}
      {activeTab === 'Notification Rules' && <NotificationRulesTab />}
      {activeTab === 'User Settings' && <UserSettingsTab user={user} />}
      {activeTab === 'Permissions & Teams' && <PermissionsTeamsTab user={user} />}
      {activeTab === 'On-Call Shifts' && <OnCallShiftsTab user={user} />}
      {activeTab === 'Subscriptions' && <SubscriptionsTab />}
    </div>
  );
}
