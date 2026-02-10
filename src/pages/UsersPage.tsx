import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStore } from '../data/store';
import { Search, Filter, ChevronDown, MoreHorizontal, Plus, Download, Upload } from 'lucide-react';

export default function UsersPage() {
  const store = getStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [licenseFilter, setLicenseFilter] = useState('All');

  const filteredUsers = useMemo(() => {
    let list = store.users;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'All') list = list.filter(u => u.role === roleFilter);
    if (licenseFilter !== 'All') list = list.filter(u => u.license === licenseFilter);
    return list;
  }, [store.users, searchQuery, roleFilter, licenseFilter]);

  const totalLicenses = store.users.filter(u => u.license === 'Full User').length;
  const stakeholderLicenses = store.users.filter(u => u.license === 'Stakeholder').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalLicenses} Full Users · {stakeholderLicenses} Stakeholders · {store.users.length} Total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-600 border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center gap-1">
            <Download size={14} /> Export
          </button>
          <button className="text-sm text-gray-600 border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center gap-1">
            <Upload size={14} /> Import
          </button>
          <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1">
            <Plus size={14} /> Add Users
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Find users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              <option value="All">All Roles</option>
              <option>Owner</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Responder</option>
              <option>Observer</option>
              <option>Restricted Access</option>
            </select>
            <select value={licenseFilter} onChange={e => setLicenseFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06ac38]">
              <option value="All">All Licenses</option>
              <option>Full User</option>
              <option>Stakeholder</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teams</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/users/${user.id}`} className="flex items-center gap-2">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium text-gray-900 hover:text-blue-600">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.title}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${
                    user.role === 'Owner' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'Manager' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${user.license === 'Full User' ? 'text-green-700' : 'text-gray-500'}`}>{user.license}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.teams.slice(0, 2).map(t => (
                      <span key={t} className="inline-flex items-center px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{t}</span>
                    ))}
                    {user.teams.length > 2 && <span className="text-xs text-gray-400">+{user.teams.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    user.status === 'active' ? 'text-green-600' : user.status === 'invited' ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'active' ? 'bg-green-500' : user.status === 'invited' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredUsers.length} users</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <span className="px-3 py-1 bg-[#06ac38] text-white rounded text-xs">1</span>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
