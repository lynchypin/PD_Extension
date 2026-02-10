import { useState } from 'react';
import { Shield, User, ArrowRight, ArrowLeft, Zap, Upload, Eye, Briefcase, UserCheck } from 'lucide-react';
import type { OnboardingRole, AdminPath, UserPath } from '../data/onboardingStore';

interface Props {
  onSelect: (role: OnboardingRole, adminPath?: AdminPath, userPath?: UserPath) => void;
}

const ADMIN_PATHS: { id: AdminPath; icon: typeof Shield; label: string; desc: string; time: string; bullets: string[] }[] = [
  {
    id: 'full-setup',
    icon: Shield,
    label: 'Full Guided Setup',
    desc: 'Walk through every step on the real UI with an interactive overlay guide. Best for first-time PagerDuty admins.',
    time: '~15 min',
    bullets: ['Step-by-step overlay tour', 'Create services, policies & schedules', 'Send a test incident end-to-end'],
  },
  {
    id: 'quick-start',
    icon: Zap,
    label: 'Quick Start',
    desc: 'Hit the essentials fast: one service, one escalation policy, one test incident. Perfect if you want to explore on your own.',
    time: '~5 min',
    bullets: ['Minimal guided steps', 'Get one service running', 'Fire a test incident'],
  },
  {
    id: 'import-existing',
    icon: Upload,
    label: 'I Have an Existing Setup',
    desc: 'Already know the ropes? Get a fast orientation of where everything lives in the UI so you can import your config.',
    time: '~3 min',
    bullets: ['Quick UI orientation tour', 'Locate integrations & import tools', 'Jump straight to configuration'],
  },
];

const USER_PATHS: { id: UserPath; icon: typeof User; label: string; desc: string; time: string; bullets: string[] }[] = [
  {
    id: 'responder',
    icon: UserCheck,
    label: 'Incident Responder',
    desc: 'You\'re on the front lines. Get set up to receive pages, acknowledge incidents, and manage your on-call schedule.',
    time: '~5 min',
    bullets: ['Set up contact methods & notifications', 'Learn incident acknowledge/resolve flow', 'Check your on-call schedule'],
  },
  {
    id: 'stakeholder',
    icon: Eye,
    label: 'Stakeholder / Observer',
    desc: 'You need visibility into service health and incident status without being paged. Great for managers, execs, or support.',
    time: '~3 min',
    bullets: ['Tour the status dashboard', 'Understand service health views', 'Learn analytics & reporting'],
  },
  {
    id: 'manager',
    icon: Briefcase,
    label: 'Team Manager',
    desc: 'You manage a team of responders. Learn to oversee schedules, review workload, and ensure healthy incident response.',
    time: '~5 min',
    bullets: ['Review team management tools', 'Understand schedule & escalation setup', 'Monitor team analytics & load'],
  },
];

export default function RoleSelectionPage({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [phase, setPhase] = useState<'role' | 'admin-path' | 'user-path'>('role');
  const [selectedRole, setSelectedRole] = useState<OnboardingRole>(null);

  const handleRoleClick = (role: 'admin' | 'user') => {
    setSelectedRole(role);
    setPhase(role === 'admin' ? 'admin-path' : 'user-path');
  };

  const handleAdminPath = (path: AdminPath) => {
    onSelect('admin', path, null);
  };

  const handleUserPath = (path: UserPath) => {
    onSelect('user', null, path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2e22] via-[#25352c] to-[#1a2e22] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#06ac38] rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-6">PD</div>
          {phase === 'role' && (
            <>
              <h1 className="text-4xl font-bold text-white mb-3">Welcome to PagerDuty</h1>
              <p className="text-lg text-gray-300">Let's get you set up. How will you be using PagerDuty?</p>
            </>
          )}
          {phase === 'admin-path' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Choose Your Setup Path</h1>
              <p className="text-gray-300">How would you like to get started as an administrator?</p>
            </>
          )}
          {phase === 'user-path' && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">What's Your Role?</h1>
              <p className="text-gray-300">This helps us tailor the guided tour to what matters most to you.</p>
            </>
          )}
        </div>

        {phase === 'role' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onMouseEnter={() => setHovered('admin')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRoleClick('admin')}
              className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-8 text-left transition-all duration-200 ${
                hovered === 'admin' ? 'border-[#06ac38] bg-white/15 scale-[1.02]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                hovered === 'admin' ? 'bg-[#06ac38]' : 'bg-white/10'
              }`}>
                <Shield size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">I'm an Administrator</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I'm setting up PagerDuty for my organization. I need to create teams, services, integrations, and on-call schedules.
              </p>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                hovered === 'admin' ? 'text-[#06ac38]' : 'text-gray-400'
              }`}>
                Choose setup path <ArrowRight size={16} className={`transition-transform ${hovered === 'admin' ? 'translate-x-1' : ''}`} />
              </div>
            </button>

            <button
              onMouseEnter={() => setHovered('user')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRoleClick('user')}
              className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-8 text-left transition-all duration-200 ${
                hovered === 'user' ? 'border-[#06ac38] bg-white/15 scale-[1.02]' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                hovered === 'user' ? 'bg-[#06ac38]' : 'bg-white/10'
              }`}>
                <User size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">I'm a Responder / User</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I've been invited to PagerDuty. I need to set up my profile and learn the tools relevant to my role.
              </p>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                hovered === 'user' ? 'text-[#06ac38]' : 'text-gray-400'
              }`}>
                Choose your role <ArrowRight size={16} className={`transition-transform ${hovered === 'user' ? 'translate-x-1' : ''}`} />
              </div>
            </button>
          </div>
        )}

        {phase === 'admin-path' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {ADMIN_PATHS.map((p) => (
                <button
                  key={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleAdminPath(p.id)}
                  className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-6 text-left transition-all duration-200 ${
                    hovered === p.id ? 'border-[#06ac38] bg-white/15 scale-[1.02]' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    hovered === p.id ? 'bg-[#06ac38]' : 'bg-white/10'
                  }`}>
                    <p.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">{p.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-[#06ac38] mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    hovered === p.id ? 'text-[#06ac38]' : 'text-gray-400'
                  }`}>
                    Start <ArrowRight size={14} className={`transition-transform ${hovered === p.id ? 'translate-x-1' : ''}`} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">{p.time}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPhase('role'); setSelectedRole(null); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mt-6 mx-auto transition-colors"
            >
              <ArrowLeft size={14} /> Back to role selection
            </button>
          </>
        )}

        {phase === 'user-path' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {USER_PATHS.map((p) => (
                <button
                  key={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleUserPath(p.id)}
                  className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-6 text-left transition-all duration-200 ${
                    hovered === p.id ? 'border-[#06ac38] bg-white/15 scale-[1.02]' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    hovered === p.id ? 'bg-[#06ac38]' : 'bg-white/10'
                  }`}>
                    <p.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">{p.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-[#06ac38] mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    hovered === p.id ? 'text-[#06ac38]' : 'text-gray-400'
                  }`}>
                    Start <ArrowRight size={14} className={`transition-transform ${hovered === p.id ? 'translate-x-1' : ''}`} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">{p.time}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPhase('role'); setSelectedRole(null); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mt-6 mx-auto transition-colors"
            >
              <ArrowLeft size={14} /> Back to role selection
            </button>
          </>
        )}

        <p className="text-center text-gray-500 text-xs mt-8">
          You can always change your setup or access these options later from Settings.
        </p>
      </div>
    </div>
  );
}
