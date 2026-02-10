import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, Clock, AlertTriangle, UserPlus, CheckCircle, X, Shield, Hash } from 'lucide-react';

interface Notification {
  id: string;
  type: 'slack' | 'oncall' | 'assignment' | 'resolved' | 'escalation' | 'mention';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: 'slack' | 'clock' | 'alert' | 'assign' | 'check' | 'shield' | 'mention';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'slack',
    title: 'New message in #inc-1847-db-connection',
    body: 'Mike Johnson: Running pg_stat_activity to check for idle connections. Seeing 340/350 pool slots used.',
    time: '2m ago',
    read: false,
    icon: 'slack',
  },
  {
    id: 'n2',
    type: 'assignment',
    title: 'Assigned to incident #1847',
    body: 'Database connection pool exhausted — P1 High Urgency on Database Cluster',
    time: '5m ago',
    read: false,
    icon: 'assign',
  },
  {
    id: 'n3',
    type: 'oncall',
    title: 'On-call shift starting soon',
    body: 'Your SRE 24/7 on-call shift starts in 2 hours (4:00 PM PST). Make sure notifications are enabled.',
    time: '12m ago',
    read: false,
    icon: 'clock',
  },
  {
    id: 'n4',
    type: 'escalation',
    title: 'Incident #1846 escalated to you',
    body: 'API Gateway 502 errors spike — not acknowledged after 15 min. You are Level 2 on Platform Default.',
    time: '25m ago',
    read: true,
    icon: 'shield',
  },
  {
    id: 'n5',
    type: 'slack',
    title: 'New message in #inc-1845-payment-latency',
    body: 'James Wilson: Confirmed root cause — upstream provider throttling. Engaging vendor support.',
    time: '35m ago',
    read: true,
    icon: 'slack',
  },
  {
    id: 'n6',
    type: 'resolved',
    title: 'Incident #1843 resolved',
    body: 'CDN cache invalidation failure — resolved by David Brown. Duration: 1h 30m.',
    time: '1h ago',
    read: true,
    icon: 'check',
  },
  {
    id: 'n7',
    type: 'mention',
    title: 'You were mentioned in a note',
    body: 'Emily Davis mentioned you in incident #1844: "@Sarah can you check the replica lag on shard-3?"',
    time: '2h ago',
    read: true,
    icon: 'mention',
  },
  {
    id: 'n8',
    type: 'oncall',
    title: 'On-call handoff completed',
    body: 'You are no longer on-call for Platform Primary. Mike Johnson is now primary responder.',
    time: '6h ago',
    read: true,
    icon: 'clock',
  },
  {
    id: 'n9',
    type: 'slack',
    title: 'New message in #incident-response',
    body: 'Rachel Taylor: Postmortem for incident #1841 (auth memory leak) has been scheduled for Thursday 2 PM.',
    time: '8h ago',
    read: true,
    icon: 'slack',
  },
];

const ICON_MAP = {
  slack: { icon: Hash, bg: 'bg-purple-100', color: 'text-purple-600' },
  clock: { icon: Clock, bg: 'bg-blue-100', color: 'text-blue-600' },
  alert: { icon: AlertTriangle, bg: 'bg-red-100', color: 'text-red-600' },
  assign: { icon: UserPlus, bg: 'bg-orange-100', color: 'text-orange-600' },
  check: { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' },
  shield: { icon: Shield, bg: 'bg-red-100', color: 'text-red-600' },
  mention: { icon: MessageSquare, bg: 'bg-indigo-100', color: 'text-indigo-600' },
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="hover:bg-white/10 p-1.5 rounded relative"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 z-[8000] overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-[#06ac38] hover:text-[#048a2d] font-medium">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-100">
            {notifications.map(n => {
              const iconCfg = ICON_MAP[n.icon];
              const IconComponent = iconCfg.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 ${
                    !n.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconCfg.bg}`}>
                    <IconComponent size={14} className={iconCfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm leading-tight ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {n.title}
                      </span>
                      <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t bg-gray-50 text-center">
            <button className="text-xs text-[#06ac38] hover:text-[#048a2d] font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}