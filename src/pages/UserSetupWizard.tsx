import { useState } from 'react';
import {
  Phone, Mail, MessageSquare, Check, ArrowRight, ArrowLeft,
  CheckCircle, Bell, Clock, ChevronRight, Shield, Users,
  Calendar, Smartphone,
} from 'lucide-react';
import type { OnboardingState, ContactMethod } from '../data/onboardingStore';
import { getStore } from '../data/store';

const TIMEZONES = [
  'America/Los_Angeles', 'America/Denver', 'America/Chicago',
  'America/New_York', 'UTC', 'Europe/London', 'Europe/Berlin',
  'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney',
];

interface Props {
  state: OnboardingState;
  onUpdate: (state: OnboardingState) => void;
  onFinish: () => void;
}

function Step1ContactMethods({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const d = state.userData;

  const addContact = (type: 'email' | 'phone' | 'sms', value: string) => {
    if (!value.trim()) return;
    const cm: ContactMethod = { type, value: value.trim(), verified: false };
    const next = { ...state, userData: { ...d, contactMethods: [...d.contactMethods, cm] } };
    onUpdate(next);
    if (type === 'email') setEmail('');
    if (type === 'phone' || type === 'sms') setPhone('');
  };

  const verify = (i: number) => {
    const methods = [...d.contactMethods];
    methods[i] = { ...methods[i], verified: true };
    onUpdate({ ...state, userData: { ...d, contactMethods: methods } });
  };

  const remove = (i: number) => {
    onUpdate({ ...state, userData: { ...d, contactMethods: d.contactMethods.filter((_, idx) => idx !== i) } });
  };

  const iconMap = { email: Mail, phone: Phone, sms: MessageSquare };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Contact Methods</h3>
        <p className="text-sm text-gray-500">Add the ways PagerDuty can reach you during an incident.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          value={d.profileName}
          onChange={e => onUpdate({ ...state, userData: { ...d, profileName: e.target.value } })}
          placeholder="Your full name"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select
          value={d.profileTimezone}
          onChange={e => onUpdate({ ...state, userData: { ...d, profileTimezone: e.target.value } })}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
        >
          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addContact('email', email)}
              placeholder="you@company.com"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
            />
            <button onClick={() => addContact('email', email)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 rounded-lg text-sm">Add</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone / SMS</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addContact('phone', phone)}
              placeholder="+1 (555) 123-4567"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#06ac38] focus:border-[#06ac38] outline-none"
            />
            <button onClick={() => { addContact('phone', phone); addContact('sms', phone); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 rounded-lg text-sm">Add</button>
          </div>
        </div>
      </div>

      {d.contactMethods.length > 0 && (
        <div className="border rounded-lg divide-y">
          {d.contactMethods.map((cm, i) => {
            const Icon = iconMap[cm.type];
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Icon size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700 flex-1">{cm.value}</span>
                <span className="text-xs text-gray-400 capitalize">{cm.type}</span>
                {cm.verified ? (
                  <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Verified</span>
                ) : (
                  <button onClick={() => verify(i)} className="text-xs text-[#06ac38] hover:underline">Verify</button>
                )}
                <button onClick={() => remove(i)} className="text-xs text-gray-400 hover:text-red-600">Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step2Notifications({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const d = state.userData;
  const prefs = d.notificationPrefs;

  const toggle = (urgency: 'highUrgency' | 'lowUrgency', channel: 'push' | 'sms' | 'phone' | 'email') => {
    const next = {
      ...state,
      userData: {
        ...d,
        notificationPrefs: {
          ...prefs,
          [urgency]: { ...prefs[urgency], [channel]: !prefs[urgency][channel] },
        },
      },
    };
    onUpdate(next);
  };

  const channels: ('push' | 'sms' | 'phone' | 'email')[] = ['push', 'sms', 'phone', 'email'];
  const icons: Record<string, typeof Bell> = { push: Smartphone, sms: MessageSquare, phone: Phone, email: Mail };
  const labels: Record<string, string> = { push: 'Push', sms: 'SMS', phone: 'Phone Call', email: 'Email' };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Choose how you want to be notified for different urgency levels.</p>
      </div>

      {(['highUrgency', 'lowUrgency'] as const).map(urgency => (
        <div key={urgency}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${urgency === 'highUrgency' ? 'bg-red-500' : 'bg-yellow-400'}`} />
            <span className="text-sm font-semibold text-gray-800">
              {urgency === 'highUrgency' ? 'High Urgency Incidents' : 'Low Urgency Incidents'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {channels.map(ch => {
              const Icon = icons[ch];
              const active = prefs[urgency][ch];
              return (
                <button
                  key={ch}
                  onClick={() => toggle(urgency, ch)}
                  className={`border-2 rounded-xl p-4 text-center transition-all ${
                    active ? 'border-[#06ac38] bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} className={`mx-auto mb-2 ${active ? 'text-[#06ac38]' : 'text-gray-400'}`} />
                  <div className={`text-sm font-medium ${active ? 'text-green-800' : 'text-gray-500'}`}>{labels[ch]}</div>
                  {active && <CheckCircle size={14} className="text-[#06ac38] mx-auto mt-1" />}
                </button>
              );
            })}
          </div>
          {urgency === 'highUrgency' && (
            <p className="text-xs text-gray-400 mt-2">Recommended: Enable all channels for high-urgency incidents so you never miss a critical alert.</p>
          )}
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
        <Bell size={14} className="inline mr-1" />
        A test notification will be sent to your verified contact methods when you complete setup.
      </div>
    </div>
  );
}

function Step3OnCall({ state, onUpdate }: { state: OnboardingState; onUpdate: (s: OnboardingState) => void }) {
  const store = getStore();
  const currentUser = store.users[0];
  const userSchedules = store.schedules.filter(s => s.users.includes(currentUser.id));
  const userTeams = store.teams.filter(t => t.members.includes(currentUser.id));
  const userServices = store.services.filter(s => userTeams.some(t => t.id === s.teamId));

  const markReviewed = () => {
    onUpdate({ ...state, userData: { ...state.userData, onCallReviewed: true } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Your On-Call Overview</h3>
        <p className="text-sm text-gray-500">Review your current on-call assignments and team memberships.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <Shield size={24} className="text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{userSchedules.length}</div>
          <div className="text-sm text-green-700">On-Call Schedules</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <Users size={24} className="text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{userTeams.length}</div>
          <div className="text-sm text-blue-700">Teams</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <Calendar size={24} className="text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{userServices.length}</div>
          <div className="text-sm text-purple-700">Services</div>
        </div>
      </div>

      {userSchedules.length > 0 ? (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Your Schedules</div>
          <div className="border rounded-lg divide-y">
            {userSchedules.map(sched => {
              const team = store.teams.find(t => t.id === sched.teamId);
              return (
                <div key={sched.id} className="flex items-center gap-3 px-4 py-3">
                  <Clock size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{sched.name}</div>
                    <div className="text-xs text-gray-500">{team?.name || 'Unknown Team'} · {sched.timezone}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You haven't been added to any on-call schedules yet. Your admin will set this up.
        </div>
      )}

      {userServices.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Services You're Responsible For</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {userServices.slice(0, 6).map(svc => (
              <div key={svc.id} className="border rounded-lg px-3 py-2.5 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  svc.status === 'critical' ? 'bg-red-500' : svc.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="text-sm text-gray-700">{svc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!state.userData.onCallReviewed && (
        <button
          onClick={markReviewed}
          className="text-sm text-[#06ac38] hover:underline flex items-center gap-1"
        >
          <Check size={14} /> I've reviewed my on-call setup
        </button>
      )}
    </div>
  );
}

export default function UserSetupWizard({ state, onUpdate, onFinish }: Props) {
  const [step, setStep] = useState(state.currentStep || 0);
  const steps = ['Contact Methods', 'Notifications', 'On-Call Review'];
  const totalSteps = steps.length;

  const nextStep = () => {
    const nextIdx = Math.min(step + 1, totalSteps - 1);
    setStep(nextIdx);
    const next = { ...state, currentStep: nextIdx };
    onUpdate(next);
  };

  const prevStep = () => {
    const prevIdx = Math.max(step - 1, 0);
    setStep(prevIdx);
    const next = { ...state, currentStep: prevIdx };
    onUpdate(next);
  };

  const canFinish = state.userData.contactMethods.length > 0 || step < totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#f0f4f1]">
      <div className="bg-[#25352c] text-white px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#06ac38] rounded-lg flex items-center justify-center font-bold text-lg">PD</div>
            <div>
              <h1 className="text-xl font-bold">Personal Setup</h1>
              <p className="text-gray-300 text-sm">Get ready to respond to incidents in under 2 minutes.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < step ? 'bg-[#06ac38] text-white' : i === step ? 'bg-white text-[#25352c]' : 'bg-white/20 text-white/60'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i === step ? 'text-white font-medium' : 'text-white/60'}`}>{s}</span>
                {i < totalSteps - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-[#06ac38]' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8">
          {step === 0 && <Step1ContactMethods state={state} onUpdate={onUpdate} />}
          {step === 1 && <Step2Notifications state={state} onUpdate={onUpdate} />}
          {step === 2 && <Step3OnCall state={state} onUpdate={onUpdate} />}
        </div>

        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <button onClick={prevStep} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              Finish Setup <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <button onClick={onFinish} className="text-xs text-gray-400 hover:text-gray-600">
            Skip and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
