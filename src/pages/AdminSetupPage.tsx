import { useState } from 'react';
import {
  Users, Layers, Plug, Shield, Clock, Bell, Zap,
  Check, Lock, ChevronRight, ArrowRight, X, Plus,
  Trash2, Play, CheckCircle, AlertTriangle, Globe,
} from 'lucide-react';
import {
  type OnboardingState, type AdminSetupStep,
  isStepUnlocked, getCompletionPercent, saveOnboarding,
} from '../data/onboardingStore';
import { getStore } from '../data/store';

const ICON_MAP: Record<string, typeof Users> = {
  Users, Layers, Plug, Shield, Clock, Bell, Zap,
};

const TIMEZONES = [
  'America/Los_Angeles', 'America/Denver', 'America/Chicago',
  'America/New_York', 'UTC', 'Europe/London', 'Europe/Berlin',
  'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney',
];

const INTEGRATION_TYPES = [
  { name: 'Datadog', type: 'Events API v2' },
  { name: 'AWS CloudWatch', type: 'Amazon CloudWatch' },
  { name: 'New Relic', type: 'New Relic' },
  { name: 'Prometheus', type: 'Events API v2' },
  { name: 'Grafana', type: 'Events API v2' },
  { name: 'Sentry', type: 'Sentry' },
  { name: 'Slack', type: 'Slack V2' },
  { name: 'Jira Cloud', type: 'Jira Cloud' },
  { name: 'GitHub', type: 'GitHub' },
  { name: 'Email', type: 'Email' },
  { name: 'Custom Events API', type: 'Events API v2' },
];

interface Props {
  state: OnboardingState;
  onUpdate: (state: OnboardingState) => void;
  onFinish: () => void;
}

function StepTeam({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const [memberEmail, setMemberEmail] = useState('');
  const d = state.adminData;

  const addMember = () => {
    if (memberEmail.trim()) {
      const next = { ...state, adminData: { ...d, teamMembers: [...d.teamMembers, memberEmail.trim()] } };
      onUpdate(next);
      setMemberEmail('');
    }
  };

  const removeMember = (i: number) => {
    const next = { ...state, adminData: { ...d, teamMembers: d.teamMembers.filter((_, idx) => idx !== i) } };
    onUpdate(next);
  };

  const canComplete = d.teamName.trim().length > 0;

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'team' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
        <input
          type="text"
          value={d.teamName}
          onChange={e => onUpdate({ ...state, adminData: { ...d, teamName: e.target.value } })}
          placeholder="e.g. Platform Engineering"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={d.teamDescription}
          onChange={e => onUpdate({ ...state, adminData: { ...d, teamDescription: e.target.value } })}
          placeholder="What does this team do?"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Invite Team Members</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMember()}
            placeholder="colleague@company.com"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
          />
          <button onClick={addMember} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-1">
            <Plus size={14} /> Add
          </button>
        </div>
        {d.teamMembers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {d.teamMembers.map((m, i) => (
              <span key={i} className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                {m}
                <button onClick={() => removeMember(i)} className="hover:text-red-600"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={complete}
        disabled={!canComplete}
        className="bg-[#06ac38] hover:bg-[#059c32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> Complete Step
      </button>
    </div>
  );
}

function StepServices({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const d = state.adminData;

  const add = () => {
    if (name.trim()) {
      const next = { ...state, adminData: { ...d, services: [...d.services, { name: name.trim(), description: desc.trim(), teamId: 'new-team' }] } };
      onUpdate(next);
      setName('');
      setDesc('');
    }
  };

  const remove = (i: number) => {
    const next = { ...state, adminData: { ...d, services: d.services.filter((_, idx) => idx !== i) } };
    onUpdate(next);
  };

  const canComplete = d.services.length > 0;

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'services' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Services represent the things your team owns and monitors (APIs, databases, applications, etc.).</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Payment API"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder="What does this service do?"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
            />
            <button onClick={add} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-1">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
      {d.services.length > 0 && (
        <div className="border rounded-lg divide-y">
          {d.services.map((svc, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div>
                <span className="font-medium text-gray-900">{svc.name}</span>
                {svc.description && <span className="text-gray-500 ml-2">- {svc.description}</span>}
              </div>
              <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={complete}
        disabled={!canComplete}
        className="bg-[#06ac38] hover:bg-[#059c32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> Complete Step
      </button>
    </div>
  );
}

function StepIntegrations({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const d = state.adminData;

  const toggle = (intName: string, intType: string) => {
    const exists = d.integrations.find(i => i.name === intName);
    const next = exists
      ? { ...state, adminData: { ...d, integrations: d.integrations.filter(i => i.name !== intName) } }
      : { ...state, adminData: { ...d, integrations: [...d.integrations, { name: intName, type: intType, serviceId: '' }] } };
    onUpdate(next);
  };

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'integrations' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select the monitoring and collaboration tools you want to connect.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INTEGRATION_TYPES.map(it => {
          const selected = d.integrations.some(i => i.name === it.name);
          return (
            <button
              key={it.name}
              onClick={() => toggle(it.name, it.type)}
              className={`border rounded-lg px-3 py-2.5 text-sm text-left transition-all ${
                selected ? 'border-[#06ac38] bg-green-50 text-green-800' : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {selected && <CheckCircle size={14} className="text-[#06ac38]" />}
                <span className="font-medium">{it.name}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{it.type}</div>
            </button>
          );
        })}
      </div>
      <button
        onClick={complete}
        className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> {d.integrations.length === 0 ? 'Skip for Now' : 'Complete Step'}
      </button>
    </div>
  );
}

function StepEscalation({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const d = state.adminData;
  const ep = d.escalationPolicy;

  const addLevel = () => {
    const next = {
      ...state,
      adminData: {
        ...d,
        escalationPolicy: {
          ...ep,
          levels: [...ep.levels, { targets: [], delayMinutes: 30 }],
        },
      },
    };
    onUpdate(next);
  };

  const removeLevel = (i: number) => {
    const next = {
      ...state,
      adminData: {
        ...d,
        escalationPolicy: {
          ...ep,
          levels: ep.levels.filter((_, idx) => idx !== i),
        },
      },
    };
    onUpdate(next);
  };

  const updateDelay = (i: number, val: number) => {
    const levels = [...ep.levels];
    levels[i] = { ...levels[i], delayMinutes: val };
    onUpdate({ ...state, adminData: { ...d, escalationPolicy: { ...ep, levels } } });
  };

  const canComplete = ep.name.trim().length > 0 && ep.levels.length > 0;

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'escalation' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Define how incidents escalate when they aren't acknowledged in time.</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
        <input
          type="text"
          value={ep.name}
          onChange={e => onUpdate({ ...state, adminData: { ...d, escalationPolicy: { ...ep, name: e.target.value } } })}
          placeholder="e.g. Default Escalation"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Levels</label>
        {ep.levels.map((level, i) => (
          <div key={i} className="flex items-center gap-3 mb-2 bg-gray-50 rounded-lg p-3">
            <div className="w-8 h-8 bg-[#06ac38] text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Level {i + 1}</div>
              <div className="text-xs text-gray-500">
                {i === 0 ? 'Notify immediately' : `Escalate after ${level.delayMinutes} minutes`}
              </div>
            </div>
            {i > 0 && (
              <select
                value={level.delayMinutes}
                onChange={e => updateDelay(i, Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 15, 30, 60].map(v => <option key={v} value={v}>{v} min</option>)}
              </select>
            )}
            <button onClick={() => removeLevel(i)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={addLevel} className="text-sm text-[#06ac38] hover:text-[#059c32] flex items-center gap-1 mt-1">
          <Plus size={14} /> Add Level
        </button>
      </div>
      <button
        onClick={complete}
        disabled={!canComplete}
        className="bg-[#06ac38] hover:bg-[#059c32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> Complete Step
      </button>
    </div>
  );
}

function StepSchedule({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const d = state.adminData;
  const sched = d.schedule;

  const canComplete = sched.name.trim().length > 0;

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'schedule' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Create an on-call rotation so your team is always covered.</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
        <input
          type="text"
          value={sched.name}
          onChange={e => onUpdate({ ...state, adminData: { ...d, schedule: { ...sched, name: e.target.value } } })}
          placeholder="e.g. Primary On-Call"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            value={sched.timezone}
            onChange={e => onUpdate({ ...state, adminData: { ...d, schedule: { ...sched, timezone: e.target.value } } })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation Type</label>
          <select
            value={sched.rotation}
            onChange={e => onUpdate({ ...state, adminData: { ...d, schedule: { ...sched, rotation: e.target.value } } })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <Globe size={14} className="inline mr-1" />
        Team members from "{state.adminData.teamName || 'your team'}" will be automatically added to this rotation.
        {state.adminData.teamMembers.length > 0 && (
          <span className="font-medium"> ({state.adminData.teamMembers.length} members)</span>
        )}
      </div>
      <button
        onClick={complete}
        disabled={!canComplete}
        className="bg-[#06ac38] hover:bg-[#059c32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> Complete Step
      </button>
    </div>
  );
}

function StepNotifications({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const d = state.adminData;
  const prefs = d.notificationDefaults;

  const toggle = (urgency: 'highUrgency' | 'lowUrgency', channel: 'push' | 'sms' | 'phone' | 'email') => {
    const next = {
      ...state,
      adminData: {
        ...d,
        notificationDefaults: {
          ...prefs,
          [urgency]: { ...prefs[urgency], [channel]: !prefs[urgency][channel] },
        },
      },
    };
    onUpdate(next);
  };

  const complete = () => {
    const next = { ...state };
    next.adminSteps = next.adminSteps.map(s => s.id === 'notifications' ? { ...s, completed: true } : s);
    onUpdate(next);
  };

  const channels: ('push' | 'sms' | 'phone' | 'email')[] = ['push', 'sms', 'phone', 'email'];
  const labels: Record<string, string> = { push: 'Push Notification', sms: 'SMS', phone: 'Phone Call', email: 'Email' };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Set default notification rules for your team. Members can customize their own preferences later.</p>
      {(['highUrgency', 'lowUrgency'] as const).map(urgency => (
        <div key={urgency} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${urgency === 'highUrgency' ? 'bg-red-500' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {urgency === 'highUrgency' ? 'High Urgency' : 'Low Urgency'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {channels.map(ch => (
              <button
                key={ch}
                onClick={() => toggle(urgency, ch)}
                className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                  prefs[urgency][ch]
                    ? 'border-[#06ac38] bg-green-50 text-green-800'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {prefs[urgency][ch] && <CheckCircle size={12} className="inline mr-1 text-[#06ac38]" />}
                {labels[ch]}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={complete}
        className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Check size={14} /> Complete Step
      </button>
    </div>
  );
}

function StepTestAlert({ state, onUpdate, onFinish }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void; onFinish: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(state.adminData.testAlertSent);
  const [showTrace, setShowTrace] = useState(false);

  const sendTest = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setShowTrace(true);
      const next = { ...state, adminData: { ...state.adminData, testAlertSent: true } };
      next.adminSteps = next.adminSteps.map(s => s.id === 'test' ? { ...s, completed: true } : s);
      onUpdate(next);
    }, 2000);
  };

  const store = getStore();
  const targetService = state.adminData.services[0]?.name || store.services[0]?.name || 'Test Service';

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Send a test alert to verify your entire setup works end-to-end.</p>
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="text-sm font-medium text-gray-700 mb-2">Test Alert Details</div>
        <div className="text-sm text-gray-600 space-y-1">
          <div><span className="text-gray-500">Service:</span> {targetService}</div>
          <div><span className="text-gray-500">Escalation:</span> {state.adminData.escalationPolicy.name || 'Default'}</div>
          <div><span className="text-gray-500">Summary:</span> [TEST] Onboarding verification alert</div>
        </div>
      </div>
      {!sent ? (
        <button
          onClick={sendTest}
          disabled={sending}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending test alert...
            </>
          ) : (
            <>
              <Play size={14} /> Send Test Alert
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
            <CheckCircle size={16} className="text-green-600" />
            Test alert sent successfully!
          </div>
          {showTrace && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="text-sm font-medium text-gray-700">Alert Flow Trace</div>
              {[
                { label: 'Event received', detail: 'Events API v2', time: '0ms', status: 'ok' },
                { label: 'Orchestration rules evaluated', detail: 'Global Event Orchestration', time: '12ms', status: 'ok' },
                { label: `Routed to service`, detail: targetService, time: '15ms', status: 'ok' },
                { label: 'Incident created', detail: '#TEST-001', time: '45ms', status: 'ok' },
                { label: 'Escalation policy triggered', detail: state.adminData.escalationPolicy.name || 'Default', time: '48ms', status: 'ok' },
                { label: 'Notification sent', detail: 'Push + Email', time: '120ms', status: 'ok' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-gray-700">{step.label}</span>
                    <span className="text-gray-500 ml-2">{step.detail}</span>
                  </div>
                  <span className="text-xs text-gray-400">{step.time}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onFinish}
            className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <ArrowRight size={14} /> Go to PagerDuty Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminSetupPage({ state, onUpdate, onFinish }: Props) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const percent = getCompletionPercent(state.adminSteps);
  const allDone = percent === 100;

  const renderStepContent = (step: AdminSetupStep) => {
    switch (step.id) {
      case 'team': return <StepTeam state={state} onUpdate={onUpdate} />;
      case 'services': return <StepServices state={state} onUpdate={onUpdate} />;
      case 'integrations': return <StepIntegrations state={state} onUpdate={onUpdate} />;
      case 'escalation': return <StepEscalation state={state} onUpdate={onUpdate} />;
      case 'schedule': return <StepSchedule state={state} onUpdate={onUpdate} />;
      case 'notifications': return <StepNotifications state={state} onUpdate={onUpdate} />;
      case 'test': return <StepTestAlert state={state} onUpdate={onUpdate} onFinish={onFinish} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="bg-[#25352c] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#06ac38] rounded-lg flex items-center justify-center font-bold text-lg">PD</div>
            <div>
              <h1 className="text-2xl font-bold">Setup Your PagerDuty Instance</h1>
              <p className="text-gray-300 text-sm mt-0.5">Complete these steps to get your organization ready for incident management.</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">{state.adminSteps.filter(s => s.completed).length} of {state.adminSteps.length} steps completed</span>
              <span className="font-medium">{percent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div className="bg-[#06ac38] h-2.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {allDone && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-green-900">Setup Complete!</div>
                <div className="text-sm text-green-700">Your PagerDuty instance is ready. You can always come back to adjust settings.</div>
              </div>
            </div>
            <button
              onClick={onFinish}
              className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight size={14} />
            </button>
          </div>
        )}

        <div className="space-y-3">
          {state.adminSteps.map((step) => {
            const Icon = ICON_MAP[step.icon] || Zap;
            const unlocked = isStepUnlocked(step, state.adminSteps);
            const isExpanded = expandedStep === step.id;

            return (
              <div
                key={step.id}
                className={`bg-white rounded-xl border transition-all ${
                  step.completed ? 'border-green-200' : unlocked ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 opacity-60'
                }`}
              >
                <button
                  onClick={() => unlocked && !step.completed && setExpandedStep(isExpanded ? null : step.id)}
                  disabled={!unlocked || step.completed}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    step.completed ? 'bg-green-100' : unlocked ? 'bg-gray-100' : 'bg-gray-50'
                  }`}>
                    {step.completed ? (
                      <Check size={20} className="text-green-600" />
                    ) : !unlocked ? (
                      <Lock size={18} className="text-gray-400" />
                    ) : (
                      <Icon size={20} className="text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${step.completed ? 'text-green-700' : unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    <div className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.completed ? 'Completed' : step.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">~{step.estimatedMinutes} min</span>
                    {!step.completed && unlocked && (
                      <ChevronRight size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    )}
                  </div>
                </button>

                {isExpanded && unlocked && !step.completed && (
                  <div className="px-5 pb-5 pt-0 border-t">
                    <div className="pt-4">
                      {renderStepContent(step)}
                    </div>
                  </div>
                )}

                {step.completed && step.id === 'team' && state.adminData.teamName && (
                  <div className="px-5 pb-3 pt-0">
                    <div className="bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                      <CheckCircle size={12} />
                      Team "{state.adminData.teamName}" created
                      {state.adminData.teamMembers.length > 0 && ` with ${state.adminData.teamMembers.length} members`}
                    </div>
                  </div>
                )}
                {step.completed && step.id === 'services' && state.adminData.services.length > 0 && (
                  <div className="px-5 pb-3 pt-0">
                    <div className="bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                      <CheckCircle size={12} />
                      {state.adminData.services.length} service{state.adminData.services.length !== 1 ? 's' : ''} created
                    </div>
                  </div>
                )}
                {step.completed && step.id === 'integrations' && (
                  <div className="px-5 pb-3 pt-0">
                    <div className="bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                      <CheckCircle size={12} />
                      {state.adminData.integrations.length > 0
                        ? `${state.adminData.integrations.length} integration${state.adminData.integrations.length !== 1 ? 's' : ''} connected`
                        : 'Skipped - you can add integrations later'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!allDone && (
          <div className="mt-6 text-center">
            <button
              onClick={onFinish}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip setup and explore PagerDuty
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
