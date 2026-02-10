import { useLocation } from 'react-router-dom';

const PAGE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  '/alerts': { title: 'Alerts', description: 'View and manage alerts across all services.' },
  '/business-services': { title: 'Business Services', description: 'Map technical services to business-facing services.' },
  '/teams': { title: 'Teams', description: 'Manage teams and their members, services, and escalation policies.' },
  '/automation/workflows': { title: 'Incident Workflows', description: 'Create automated workflows that run during incident response.' },
  '/automation/orchestration': { title: 'Event Orchestration', description: 'Route and transform events before they create incidents.' },
  '/automation/rundeck': { title: 'Rundeck Actions', description: 'Run automated diagnostics and remediation from incidents.' },
  '/oncall': { title: 'On-Call', description: 'View who is currently on-call across all schedules.' },
  '/escalation-policies': { title: 'Escalation Policies', description: 'Define how incidents escalate through your team.' },
  '/schedules': { title: 'Schedules', description: 'Manage on-call schedules and rotations.' },
  '/analytics': { title: 'Analytics', description: 'View incident analytics, MTTA, MTTR, and team performance metrics.' },
  '/integrations': { title: 'Integrations', description: 'Manage account-level integrations and extensions.' },
  '/status': { title: 'Status Dashboard', description: 'View the real-time status of all services.' },
  '/aiops': { title: 'AIOps', description: 'Configure intelligent alert grouping, noise reduction, and event intelligence.' },
  '/response-plays': { title: 'Response Plays', description: 'Pre-defined incident response actions to mobilize responders.' },
  '/settings': { title: 'Account Settings', description: 'Manage account settings, API keys, SSO, and billing.' },
};

export default function PlaceholderPage() {
  const location = useLocation();
  const page = PAGE_DESCRIPTIONS[location.pathname] || { title: 'Page', description: 'This page is part of the PagerDuty replica.' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{page.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{page.description}</p>
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          This section is part of the full PagerDuty replica. It will be built out with full interactivity in the next iteration.
        </p>
      </div>
    </div>
  );
}
