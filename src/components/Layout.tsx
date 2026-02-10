import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Bell,
  Search,
  ChevronDown,
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
  Zap,
  BarChart3,
  Users,
  Shield,
  Clock,
  Layers,
  AlertTriangle,
  Plug,
  Activity,
  Bot,
  Globe,
  Crosshair,
  Home,
  RotateCcw,
} from 'lucide-react';
import type { OnboardingRole } from '../data/onboardingStore';
import TermTooltip from './TermTooltip';

interface LayoutProps {
  onboardingRole?: OnboardingRole;
  onReset?: () => void;
}

const NAV_ITEMS = [
  { label: 'Incidents', path: '/', icon: AlertTriangle, adminOnly: true, tourId: 'nav-incidents' },
  { label: 'My World', path: '/my-world', icon: Home, userOnly: true, tourId: 'nav-my-world' },
  { label: 'Incidents', path: '/incidents', icon: AlertTriangle, userOnly: true, tourId: 'nav-incidents' },
  { label: 'Operations Console', path: '/operations', icon: Crosshair, tourId: 'nav-operations' },
  { label: 'Alerts', path: '/alerts', icon: Bell, tourId: 'nav-alerts' },
  {
    label: 'Services', icon: Layers, tourId: 'nav-services', children: [
      { label: 'Service Directory', path: '/services' },
      { label: 'Business Services', path: '/business-services' },
      { label: 'Service Graph', path: '/service-graph' },
    ]
  },
  {
    label: 'People', icon: Users, tourId: 'nav-people', children: [
      { label: 'Users', path: '/users' },
      { label: 'Teams', path: '/teams' },
    ]
  },
  {
    label: 'Automation', icon: Zap, tourId: 'nav-automation', children: [
      { label: 'Incident Workflows', path: '/automation/workflows' },
      { label: 'Event Orchestration', path: '/automation/orchestration' },
      { label: 'Rundeck Actions', path: '/automation/rundeck' },
    ]
  },
  { label: 'On-Call', path: '/oncall', icon: Clock, tourId: 'nav-oncall' },
  { label: 'Escalation Policies', path: '/escalation-policies', icon: Shield, tourId: 'nav-escalation' },
  { label: 'Schedules', path: '/schedules', icon: Clock, tourId: 'nav-schedules' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, tourId: 'nav-analytics' },
  { label: 'Integrations', path: '/integrations', icon: Plug, tourId: 'nav-integrations' },
  { label: 'Status', path: '/status', icon: Globe, tourId: 'nav-status' },
  { label: 'AIOps', path: '/aiops', icon: Bot, tourId: 'nav-aiops' },
  { label: 'Response Plays', path: '/response-plays', icon: Activity, tourId: 'nav-response-plays' },
];

const SIDEBAR_TERM_MAP: Record<string, string> = {
  'Incidents': 'incident',
  'Alerts': 'incident',
  'Services': 'service',
  'On-Call': 'on-call',
  'Escalation Policies': 'escalation-policy',
  'Schedules': 'schedule',
  'Analytics': 'mtta',
  'Integrations': 'integration',
  'AIOps': 'aiops',
  'Response Plays': 'response-play',
  'Automation': 'workflow',
  'Operations Console': 'incident',
};

export default function Layout({ onboardingRole, onReset }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/' && onboardingRole !== 'user') return location.pathname === '/';
    if (path === '/my-world') return location.pathname === '/my-world' || (onboardingRole === 'user' && location.pathname === '/');
    if (path === '/incidents') return location.pathname === '/incidents' || location.pathname.startsWith('/incidents/');
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const filteredNav = NAV_ITEMS.filter(item => {
    if ('adminOnly' in item && item.adminOnly && onboardingRole === 'user') return false;
    if ('userOnly' in item && item.userOnly && onboardingRole !== 'user') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <header className="bg-[#25352c] text-white h-14 flex items-center px-4 z-50 flex-shrink-0">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-3 hover:bg-white/10 p-1.5 rounded">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to={onboardingRole === 'user' ? '/my-world' : '/'} className="flex items-center gap-2 mr-6" data-tour="pd-logo">
          <div className="w-8 h-8 bg-[#06ac38] rounded flex items-center justify-center font-bold text-sm">PD</div>
          <span className="font-semibold text-sm hidden sm:block">PagerDuty</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm flex-1">
          {onboardingRole === 'user' && (
            <Link to="/my-world" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname === '/my-world' || location.pathname === '/' ? 'bg-white/15' : ''}`}>My World</Link>
          )}
          <Link to={onboardingRole === 'user' ? '/incidents' : '/'} className={`px-3 py-1.5 rounded hover:bg-white/10 ${(onboardingRole !== 'user' && location.pathname === '/') || location.pathname.startsWith('/incidents') ? 'bg-white/15' : ''}`}>Incidents</Link>
          <Link to="/services" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname.startsWith('/services') ? 'bg-white/15' : ''}`}>Services</Link>
          <Link to="/users" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname.startsWith('/users') ? 'bg-white/15' : ''}`}>People</Link>
          <Link to="/automation/workflows" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname.startsWith('/automation') ? 'bg-white/15' : ''}`}>Automation</Link>
          <Link to="/analytics" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname.startsWith('/analytics') ? 'bg-white/15' : ''}`}>Analytics</Link>
          <Link to="/integrations" className={`px-3 py-1.5 rounded hover:bg-white/10 ${location.pathname.startsWith('/integrations') ? 'bg-white/15' : ''}`}>Integrations</Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:bg-white/10 p-1.5 rounded">
            <Search size={18} />
          </button>
          <button className="hover:bg-white/10 p-1.5 rounded relative">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">2</span>
          </button>
          <button className="bg-[#06ac38] hover:bg-[#059c32] text-white text-sm px-3 py-1.5 rounded flex items-center gap-1" data-tour="new-incident-btn">
            <Plus size={14} /> New Incident
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="hover:bg-white/10 p-1.5 rounded"
              title="Reset onboarding"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <Link to="/settings" className="hover:bg-white/10 p-1.5 rounded">
            <Settings size={18} />
          </Link>
          <button className="hover:bg-white/10 p-1.5 rounded">
            <HelpCircle size={18} />
          </button>
          <Link to="/users/user-1" className="w-8 h-8 rounded-full bg-[#0D47A1] flex items-center justify-center text-xs font-bold ml-1" data-tour="user-avatar">SC</Link>
        </div>
      </header>

      {searchOpen && (
        <div className="bg-white border-b shadow-sm p-3 flex items-center gap-2 z-40">
          <Search size={16} className="text-gray-400" />
          <input autoFocus type="text" placeholder="Search incidents, services, users..." className="flex-1 outline-none text-sm" />
          <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-56 bg-white border-r flex-shrink-0 overflow-y-auto">
            <nav className="py-2">
              {filteredNav.map((item) => {
                const termId = SIDEBAR_TERM_MAP[item.label];
                return (
                  <div key={item.label + (item.path || '')} data-tour={item.tourId}>
                    {'children' in item && item.children ? (
                      <>
                        <button
                          onClick={() => toggleMenu(item.label)}
                          className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-left ${
                            item.children.some(c => isActive(c.path)) ? 'text-[#06ac38] font-medium' : 'text-gray-700'
                          }`}
                        >
                          <item.icon size={16} />
                          <span className="flex-1">
                            {termId ? (
                              <TermTooltip termId={termId} inline>{item.label}</TermTooltip>
                            ) : item.label}
                          </span>
                          <ChevronDown size={14} className={`transition-transform ${openMenus[item.label] ? 'rotate-180' : ''}`} />
                        </button>
                        {openMenus[item.label] && (
                          <div className="ml-8">
                            {item.children.map(child => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`block px-3 py-1.5 text-sm hover:bg-gray-100 rounded ${
                                  isActive(child.path) ? 'text-[#06ac38] font-medium bg-green-50' : 'text-gray-600'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path!}
                        className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 ${
                          isActive(item.path) ? 'text-[#06ac38] font-medium bg-green-50' : 'text-gray-700'
                        }`}
                      >
                        <item.icon size={16} />
                        <span>
                          {termId ? (
                            <TermTooltip termId={termId} inline>{item.label}</TermTooltip>
                          ) : item.label}
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {onboardingRole && (
              <div className="border-t mx-3 mt-2 pt-2 pb-3">
                <div className="px-1 py-1 text-[10px] uppercase tracking-wider text-gray-400 font-medium">Session</div>
                <div className="px-1 py-1 text-xs text-gray-500">
                  Role: <span className="capitalize font-medium text-gray-700">{onboardingRole}</span>
                </div>
                {onReset && (
                  <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 px-1 py-1 text-xs text-gray-500 hover:text-red-600"
                  >
                    <RotateCcw size={11} /> Reset Onboarding
                  </button>
                )}
              </div>
            )}
          </aside>
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
