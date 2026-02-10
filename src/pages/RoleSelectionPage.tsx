import { useState } from 'react';
import { Shield, User, ArrowRight, RotateCcw } from 'lucide-react';
import type { OnboardingRole } from '../data/onboardingStore';

interface Props {
  onSelect: (role: OnboardingRole) => void;
}

export default function RoleSelectionPage({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2e22] via-[#25352c] to-[#1a2e22] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#06ac38] rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-6">PD</div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome to PagerDuty</h1>
          <p className="text-lg text-gray-300">Let's get you set up. How will you be using PagerDuty?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onMouseEnter={() => setHovered('admin')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('admin')}
            className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-8 text-left transition-all duration-200 group ${
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
            <ul className="space-y-2 mb-6">
              {['Define teams & invite members', 'Create services & connect integrations', 'Set up escalation policies & schedules', 'Configure notifications', 'Send a test alert to verify setup'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#06ac38] mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              hovered === 'admin' ? 'text-[#06ac38]' : 'text-gray-400'
            }`}>
              Start admin setup <ArrowRight size={16} className={`transition-transform ${hovered === 'admin' ? 'translate-x-1' : ''}`} />
            </div>
            <div className="absolute top-4 right-4 bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full">~20 min</div>
          </button>

          <button
            onMouseEnter={() => setHovered('user')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('user')}
            className={`relative bg-white/10 backdrop-blur border-2 rounded-2xl p-8 text-left transition-all duration-200 group ${
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
              I've been invited to PagerDuty. I need to set up my contact info, notification preferences, and review my on-call schedule.
            </p>
            <ul className="space-y-2 mb-6">
              {['Add & verify contact methods', 'Set notification preferences', 'Review your on-call schedule', 'See your assigned services'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#06ac38] mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              hovered === 'user' ? 'text-[#06ac38]' : 'text-gray-400'
            }`}>
              Start personal setup <ArrowRight size={16} className={`transition-transform ${hovered === 'user' ? 'translate-x-1' : ''}`} />
            </div>
            <div className="absolute top-4 right-4 bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full">~2 min</div>
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          You can always change your setup or access these options later from Settings.
        </p>
      </div>
    </div>
  );
}
