import { useState } from 'react';
import { getStore } from '../data/store';
import { Shield, ChevronDown, ChevronRight, Clock, Users, Plus, ArrowRight } from 'lucide-react';

export default function EscalationPoliciesPage() {
  const store = getStore();
  const [expanded, setExpanded] = useState<string | null>(store.escalationPolicies[0]?.id || null);
  const userMap = Object.fromEntries(store.users.map(u => [u.id, u]));
  const teamMap = Object.fromEntries(store.teams.map(t => [t.id, t]));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Escalation Policies</h1>
          <p className="text-sm text-gray-500 mt-1">Define how incidents escalate through your team when not acknowledged.</p>
        </div>
        <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 font-medium">
          <Plus size={14} /> New Escalation Policy
        </button>
      </div>

      <div className="space-y-3">
        {store.escalationPolicies.map(ep => {
          const team = teamMap[ep.teamId];
          const isExpanded = expanded === ep.id;
          const serviceCount = store.services.filter(s => s.escalationPolicyId === ep.id).length;

          return (
            <div key={ep.id} className="bg-white rounded-lg border">
              <button
                onClick={() => setExpanded(isExpanded ? null : ep.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-[#06ac38]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-[#06ac38]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{ep.name}</div>
                  <div className="text-xs text-gray-500">{ep.description}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{team?.name || 'Unknown Team'}</div>
                    <div className="text-xs text-gray-400">{serviceCount} service{serviceCount !== 1 ? 's' : ''} · {ep.rules.length} level{ep.rules.length !== 1 ? 's' : ''}</div>
                  </div>
                  {ep.repeatEnabled && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Repeats ×{ep.numLoops}
                    </span>
                  )}
                  {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 pb-4">
                  <div className="flex items-start gap-4 pt-4">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Escalation Rules</div>
                      <div className="space-y-3">
                        {ep.rules.map((rule, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                              L{rule.level}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                {rule.targets.map(targetId => {
                                  const user = userMap[targetId];
                                  if (!user) return null;
                                  return (
                                    <div key={targetId} className="flex items-center gap-1.5 bg-white border rounded-full px-2 py-1">
                                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                                      <span className="text-xs font-medium text-gray-700">{user.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Clock size={10} />
                                Escalate after {rule.escalationDelayMinutes} minutes if not acknowledged
                              </div>
                            </div>
                            {i < ep.rules.length - 1 && (
                              <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-48 flex-shrink-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Services Using This</div>
                      <div className="space-y-1.5">
                        {store.services.filter(s => s.escalationPolicyId === ep.id).map(svc => (
                          <div key={svc.id} className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1.5">
                            {svc.name}
                          </div>
                        ))}
                        {serviceCount === 0 && (
                          <div className="text-xs text-gray-400 italic">No services assigned</div>
                        )}
                      </div>
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