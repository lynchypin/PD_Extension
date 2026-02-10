const ONBOARDING_KEY = 'pd-onboarding';
const TERMINOLOGY_KEY = 'pd-terminology-dismissed';
const TOUR_KEY = 'pd-guided-tour';
const TERM_FLOW_KEY = 'pd-term-flow';

export type OnboardingRole = 'admin' | 'user' | null;

export type AdminPath = 'full-setup' | 'quick-start' | 'import-existing' | null;
export type UserPath = 'responder' | 'stakeholder' | 'manager' | null;

export interface AdminSetupStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  completed: boolean;
  dependencies: string[];
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'sms';
  value: string;
  verified: boolean;
}

export interface NotificationPreference {
  highUrgency: { push: boolean; sms: boolean; phone: boolean; email: boolean };
  lowUrgency: { push: boolean; sms: boolean; phone: boolean; email: boolean };
}

export interface AdminSetupData {
  teamName: string;
  teamDescription: string;
  teamMembers: string[];
  services: { name: string; description: string; teamId: string }[];
  integrations: { name: string; type: string; serviceId: string }[];
  escalationPolicy: { name: string; levels: { targets: string[]; delayMinutes: number }[] };
  schedule: { name: string; timezone: string; rotation: string };
  notificationDefaults: NotificationPreference;
  testAlertSent: boolean;
}

export interface UserSetupData {
  contactMethods: ContactMethod[];
  notificationPrefs: NotificationPreference;
  onCallReviewed: boolean;
  profileName: string;
  profileTimezone: string;
}

export interface GuidedTourStep {
  id: string;
  targetSelector: string;
  title: string;
  body: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
  action?: string;
  termId?: string;
}

export interface GuidedTourState {
  active: boolean;
  tourId: string | null;
  currentStepIndex: number;
  completedTours: string[];
}

export interface OnboardingState {
  role: OnboardingRole;
  adminPath: AdminPath;
  userPath: UserPath;
  started: boolean;
  dismissed: boolean;
  currentStep: number;
  adminSteps: AdminSetupStep[];
  adminData: AdminSetupData;
  userData: UserSetupData;
  guidedTour: GuidedTourState;
}

const DEFAULT_ADMIN_STEPS: AdminSetupStep[] = [
  { id: 'team', label: 'Define Your Team', description: 'Create your first team and invite members', icon: 'Users', estimatedMinutes: 3, completed: false, dependencies: [] },
  { id: 'services', label: 'Create Services', description: 'Define the services your team owns and monitors', icon: 'Layers', estimatedMinutes: 5, completed: false, dependencies: ['team'] },
  { id: 'integrations', label: 'Connect Integrations', description: 'Connect your monitoring tools to send alerts to PagerDuty', icon: 'Plug', estimatedMinutes: 5, completed: false, dependencies: ['services'] },
  { id: 'escalation', label: 'Set Up Escalation Policy', description: 'Define how incidents escalate through your team', icon: 'Shield', estimatedMinutes: 3, completed: false, dependencies: ['team'] },
  { id: 'schedule', label: 'Create On-Call Schedule', description: 'Set up on-call rotations for your team', icon: 'Clock', estimatedMinutes: 4, completed: false, dependencies: ['team'] },
  { id: 'notifications', label: 'Configure Notifications', description: 'Set up how your team gets notified about incidents', icon: 'Bell', estimatedMinutes: 2, completed: false, dependencies: [] },
  { id: 'test', label: 'Send Test Alert', description: 'Verify your setup by sending a test alert end-to-end', icon: 'Zap', estimatedMinutes: 1, completed: false, dependencies: ['services', 'escalation'] },
];

function defaultState(): OnboardingState {
  return {
    role: null,
    adminPath: null,
    userPath: null,
    started: false,
    dismissed: false,
    currentStep: 0,
    adminSteps: DEFAULT_ADMIN_STEPS.map(s => ({ ...s })),
    adminData: {
      teamName: '',
      teamDescription: '',
      teamMembers: [],
      services: [],
      integrations: [],
      escalationPolicy: { name: '', levels: [] },
      schedule: { name: '', timezone: 'America/Los_Angeles', rotation: 'weekly' },
      notificationDefaults: {
        highUrgency: { push: true, sms: true, phone: true, email: true },
        lowUrgency: { push: true, sms: false, phone: false, email: true },
      },
      testAlertSent: false,
    },
    userData: {
      contactMethods: [],
      notificationPrefs: {
        highUrgency: { push: true, sms: true, phone: true, email: true },
        lowUrgency: { push: true, sms: false, phone: false, email: true },
      },
      onCallReviewed: false,
      profileName: '',
      profileTimezone: 'America/Los_Angeles',
    },
    guidedTour: {
      active: false,
      tourId: null,
      currentStepIndex: 0,
      completedTours: [],
    },
  };
}

export function getOnboarding(): OnboardingState {
  const raw = localStorage.getItem(ONBOARDING_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as OnboardingState;
      if (!parsed.guidedTour) {
        parsed.guidedTour = { active: false, tourId: null, currentStepIndex: 0, completedTours: [] };
      }
      if (parsed.adminPath === undefined) parsed.adminPath = null;
      if (parsed.userPath === undefined) parsed.userPath = null;
      return parsed;
    } catch { /* corrupted */ }
  }
  return defaultState();
}

export function saveOnboarding(state: OnboardingState) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
}

export function resetOnboarding(): OnboardingState {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(TERMINOLOGY_KEY);
  localStorage.removeItem(TOUR_KEY);
  localStorage.removeItem(TERM_FLOW_KEY);
  return defaultState();
}

export function isStepUnlocked(step: AdminSetupStep, allSteps: AdminSetupStep[]): boolean {
  if (step.dependencies.length === 0) return true;
  return step.dependencies.every(depId => {
    const dep = allSteps.find(s => s.id === depId);
    return dep?.completed ?? false;
  });
}

export function getCompletionPercent(steps: AdminSetupStep[]): number {
  if (steps.length === 0) return 0;
  return Math.round((steps.filter(s => s.completed).length / steps.length) * 100);
}

export interface TerminologyEntry {
  term: string;
  definition: string;
  learnMoreUrl?: string;
}

export function getDismissedTerms(): Record<string, 'once' | 'forever'> {
  const raw = localStorage.getItem(TERMINOLOGY_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* */ }
  }
  return {};
}

export function dismissTerm(termId: string, mode: 'once' | 'forever') {
  const current = getDismissedTerms();
  current[termId] = mode;
  localStorage.setItem(TERMINOLOGY_KEY, JSON.stringify(current));
}

export function resetDismissedTerms() {
  localStorage.removeItem(TERMINOLOGY_KEY);
}

export const ADMIN_TOUR_STEPS: Record<string, GuidedTourStep[]> = {
  'full-setup': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Welcome to PagerDuty', body: 'This guided tour will walk you through setting up your organization step by step, right here in the real interface.', placement: 'bottom' },
    { id: 'nav-services', targetSelector: '[data-tour="nav-services"]', title: 'Start with Services', body: 'Services represent the applications and infrastructure your team owns. Create your first service to begin routing alerts.', placement: 'right', route: '/services', termId: 'service' },
    { id: 'create-service', targetSelector: '[data-tour="create-service-btn"]', title: 'Create a Service', body: 'Click here to create your first service. You\'ll name it, assign a team, and connect an integration.', placement: 'bottom', termId: 'service' },
    { id: 'nav-integrations', targetSelector: '[data-tour="nav-integrations"]', title: 'Connect Your Tools', body: 'Integrations let monitoring tools like Datadog, CloudWatch, or Nagios send alerts into PagerDuty automatically.', placement: 'right', route: '/integrations', termId: 'integration' },
    { id: 'nav-escalation', targetSelector: '[data-tour="nav-escalation"]', title: 'Escalation Policies', body: 'Define who gets notified and in what order when an incident is triggered. This ensures no alert goes unanswered.', placement: 'right', route: '/escalation-policies', termId: 'escalation-policy' },
    { id: 'nav-schedules', targetSelector: '[data-tour="nav-schedules"]', title: 'On-Call Schedules', body: 'Create rotation schedules so your team shares the on-call responsibility fairly.', placement: 'right', route: '/schedules', termId: 'schedule' },
    { id: 'nav-incidents', targetSelector: '[data-tour="nav-incidents"]', title: 'Incidents Dashboard', body: 'This is your command center. All triggered, acknowledged, and resolved incidents appear here.', placement: 'right', route: '/', termId: 'incident' },
    { id: 'new-incident', targetSelector: '[data-tour="new-incident-btn"]', title: 'Test Your Setup', body: 'Try creating a manual incident to see the full lifecycle: trigger, acknowledge, and resolve.', placement: 'bottom', termId: 'acknowledge' },
  ],
  'quick-start': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Quick Start Tour', body: 'Let\'s get you up and running fast. We\'ll hit the essentials: one service, one escalation policy, and a test incident.', placement: 'bottom' },
    { id: 'nav-services', targetSelector: '[data-tour="nav-services"]', title: 'Create a Service', body: 'Start by creating a service. This is the core building block - it represents what you\'re monitoring.', placement: 'right', route: '/services', termId: 'service' },
    { id: 'nav-escalation', targetSelector: '[data-tour="nav-escalation"]', title: 'Set Up Escalation', body: 'Quick - create a simple escalation policy. Even a single-person policy works to start.', placement: 'right', route: '/escalation-policies', termId: 'escalation-policy' },
    { id: 'new-incident', targetSelector: '[data-tour="new-incident-btn"]', title: 'Fire a Test Incident', body: 'Create a test incident to see the whole flow. You\'re ready to go!', placement: 'bottom', route: '/', termId: 'incident' },
  ],
  'import-existing': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Import & Configure', body: 'Looks like you already have a setup in mind. Let\'s tour the key areas so you know where everything lives.', placement: 'bottom' },
    { id: 'nav-integrations', targetSelector: '[data-tour="nav-integrations"]', title: 'Integrations Hub', body: 'Connect your existing monitoring stack here. PagerDuty supports 700+ integrations out of the box.', placement: 'right', route: '/integrations', termId: 'integration' },
    { id: 'nav-services', targetSelector: '[data-tour="nav-services"]', title: 'Service Directory', body: 'Map your existing services here. You can organize them by team and configure each independently.', placement: 'right', route: '/services', termId: 'service' },
    { id: 'nav-people', targetSelector: '[data-tour="nav-people"]', title: 'People & Teams', body: 'Import your org structure. Invite team members and organize them into teams.', placement: 'right', route: '/users', termId: 'team' },
    { id: 'nav-automation', targetSelector: '[data-tour="nav-automation"]', title: 'Automation', body: 'Set up event orchestration to route and transform alerts from your existing tools.', placement: 'right', route: '/automation/orchestration', termId: 'event-orchestration' },
    { id: 'nav-incidents', targetSelector: '[data-tour="nav-incidents"]', title: 'Ready to Go', body: 'Once your integrations are connected, incidents will flow in here automatically.', placement: 'right', route: '/', termId: 'incident' },
  ],
};

export const USER_TOUR_STEPS: Record<string, GuidedTourStep[]> = {
  'responder': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Welcome, Responder', body: 'You\'re on the front lines. Let\'s make sure you\'re set up to receive and handle incidents effectively.', placement: 'bottom' },
    { id: 'my-world', targetSelector: '[data-tour="nav-my-world"]', title: 'Your Dashboard', body: 'My World is your personal hub. See your incidents, on-call status, and services at a glance.', placement: 'right', route: '/my-world', termId: 'on-call' },
    { id: 'profile', targetSelector: '[data-tour="user-avatar"]', title: 'Contact Methods', body: 'Set up your phone, email, and SMS so PagerDuty can reach you when you\'re on call.', placement: 'left', route: '/users/user-1', termId: 'contact-method' },
    { id: 'incidents', targetSelector: '[data-tour="nav-incidents"]', title: 'Incident Queue', body: 'When an incident is assigned to you, acknowledge it quickly, then work to resolve it.', placement: 'right', route: '/incidents', termId: 'incident' },
    { id: 'oncall', targetSelector: '[data-tour="nav-oncall"]', title: 'On-Call Schedule', body: 'Check when you\'re on call. You can also set up overrides if you need to swap shifts.', placement: 'right', route: '/oncall', termId: 'schedule' },
  ],
  'stakeholder': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Welcome, Stakeholder', body: 'You\'re here to stay informed. Let\'s show you how to track incidents and service health without getting paged.', placement: 'bottom' },
    { id: 'status', targetSelector: '[data-tour="nav-status"]', title: 'Status Dashboard', body: 'The Status page gives you a real-time view of all services and any ongoing incidents.', placement: 'right', route: '/status', termId: 'status-dashboard' },
    { id: 'services', targetSelector: '[data-tour="nav-services"]', title: 'Service Health', body: 'See which services are healthy and which are impacted. Click any service for details.', placement: 'right', route: '/services', termId: 'service' },
    { id: 'analytics', targetSelector: '[data-tour="nav-analytics"]', title: 'Analytics & Reports', body: 'Track trends, MTTA, MTTR, and team performance over time.', placement: 'right', route: '/analytics', termId: 'mtta' },
  ],
  'manager': [
    { id: 'welcome', targetSelector: '[data-tour="pd-logo"]', title: 'Welcome, Team Manager', body: 'You\'re managing a team of responders. Let\'s tour the tools that help you oversee schedules, workload, and performance.', placement: 'bottom' },
    { id: 'people', targetSelector: '[data-tour="nav-people"]', title: 'Your Team', body: 'Manage team members, roles, and contact methods from the People section.', placement: 'right', route: '/users', termId: 'team' },
    { id: 'schedules', targetSelector: '[data-tour="nav-schedules"]', title: 'Schedules', body: 'Review and adjust on-call schedules. Make sure coverage is fair and complete.', placement: 'right', route: '/schedules', termId: 'schedule' },
    { id: 'escalation', targetSelector: '[data-tour="nav-escalation"]', title: 'Escalation Policies', body: 'Ensure incidents always reach the right person. Review your team\'s escalation chains.', placement: 'right', route: '/escalation-policies', termId: 'escalation-policy' },
    { id: 'analytics', targetSelector: '[data-tour="nav-analytics"]', title: 'Team Analytics', body: 'Monitor your team\'s incident load, response times, and burnout indicators.', placement: 'right', route: '/analytics', termId: 'mtta' },
    { id: 'incidents', targetSelector: '[data-tour="nav-incidents"]', title: 'Incident Overview', body: 'Keep an eye on active incidents across your team\'s services.', placement: 'right', route: '/incidents', termId: 'incident' },
  ],
};

export interface KBArticle {
  id: string;
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  relatedTerms?: string[];
}

export const KNOWLEDGE_BASE: Record<string, KBArticle> = {
  '/': {
    id: 'incidents-overview',
    title: 'Understanding Incidents',
    summary: 'Incidents are the core unit of work in PagerDuty. They represent an event that requires human attention and action.',
    sections: [
      { heading: 'What is an Incident?', content: 'An incident is a disruption or degradation of a service that needs immediate attention. Incidents can be triggered automatically by monitoring tools or created manually.' },
      { heading: 'Incident Lifecycle', content: 'Incidents flow through three states: Triggered (new, needs attention), Acknowledged (someone is working on it), and Resolved (issue is fixed). Each transition can trigger notifications.' },
      { heading: 'Urgency Levels', content: 'High urgency incidents page responders immediately via phone, SMS, and push. Low urgency incidents send less intrusive notifications like email.' },
      { heading: 'Priority Levels', content: 'P1 (Critical) through P5 (Informational) help teams triage and prioritize which incidents to address first. Priority is separate from urgency.' },
    ],
    relatedTerms: ['incident', 'acknowledge', 'resolve', 'urgency', 'priority'],
  },
  '/incidents': {
    id: 'incidents-overview',
    title: 'Understanding Incidents',
    summary: 'Incidents are the core unit of work in PagerDuty. They represent an event that requires human attention and action.',
    sections: [
      { heading: 'What is an Incident?', content: 'An incident is a disruption or degradation of a service that needs immediate attention. Incidents can be triggered automatically by monitoring tools or created manually.' },
      { heading: 'Incident Lifecycle', content: 'Incidents flow through three states: Triggered (new, needs attention), Acknowledged (someone is working on it), and Resolved (issue is fixed). Each transition can trigger notifications.' },
      { heading: 'Urgency Levels', content: 'High urgency incidents page responders immediately via phone, SMS, and push. Low urgency incidents send less intrusive notifications like email.' },
      { heading: 'Priority Levels', content: 'P1 (Critical) through P5 (Informational) help teams triage and prioritize which incidents to address first. Priority is separate from urgency.' },
    ],
    relatedTerms: ['incident', 'acknowledge', 'resolve', 'urgency', 'priority'],
  },
  '/my-world': {
    id: 'my-world',
    title: 'My World Dashboard',
    summary: 'Your personalized command center showing everything relevant to you.',
    sections: [
      { heading: 'What You See', content: 'My World aggregates your open incidents, on-call status, service health, and team information into a single view.' },
      { heading: 'On-Call Status', content: 'Quickly see if you\'re currently on call and for which schedules. Plan your availability accordingly.' },
      { heading: 'Quick Actions', content: 'Common tasks like acknowledging incidents or checking schedules are one click away from this dashboard.' },
    ],
    relatedTerms: ['on-call', 'incident'],
  },
  '/services': {
    id: 'services-overview',
    title: 'Services in PagerDuty',
    summary: 'Services represent the applications, components, and infrastructure your team is responsible for.',
    sections: [
      { heading: 'What is a Service?', content: 'A service is a discrete piece of functionality or infrastructure. Examples: "Payment API", "Login Database", "Checkout Web App". Each service has its own integrations, escalation policy, and incident history.' },
      { heading: 'Service Ownership', content: 'Each service is owned by a team. The owning team is responsible for maintaining the service and responding to its incidents.' },
      { heading: 'Integrations', content: 'Services receive alerts through integrations. Connect monitoring tools like Datadog, New Relic, or CloudWatch to route their alerts to the right service.' },
      { heading: 'Service Health', content: 'Services show a health status based on recent incident activity. Green means no active incidents; red means a critical incident is open.' },
    ],
    relatedTerms: ['service', 'integration', 'escalation-policy', 'team'],
  },
  '/operations': {
    id: 'operations-console',
    title: 'Operations Console',
    summary: 'A real-time operational view designed for NOC teams and incident commanders.',
    sections: [
      { heading: 'Purpose', content: 'The Operations Console provides a high-level, real-time view of all active incidents across your organization. It\'s designed for wallboards and NOC (Network Operations Center) environments.' },
      { heading: 'Filtering', content: 'Filter by team, service, urgency, or priority to focus on what matters most to your operational context.' },
    ],
    relatedTerms: ['incident', 'service', 'urgency'],
  },
  '/users': {
    id: 'users-overview',
    title: 'Users & Teams',
    summary: 'Manage the people in your PagerDuty organization and how they\'re organized.',
    sections: [
      { heading: 'User Roles', content: 'Users can be Admins (full access), Managers (team-level control), Responders (handle incidents), or Stakeholders (view-only). Each role determines what actions they can take.' },
      { heading: 'Contact Methods', content: 'Each user configures how PagerDuty reaches them: email, phone, SMS, or push notifications. Multiple methods ensure critical alerts always get through.' },
      { heading: 'Teams', content: 'Teams group users who share responsibility for a set of services. Teams can have their own schedules, escalation policies, and dashboards.' },
    ],
    relatedTerms: ['user', 'team', 'contact-method', 'notification-rule'],
  },
  '/oncall': {
    id: 'oncall-overview',
    title: 'On-Call Management',
    summary: 'On-call schedules determine who is responsible for responding to incidents at any given time.',
    sections: [
      { heading: 'How On-Call Works', content: 'On-call schedules define rotation patterns (daily, weekly, custom) that automatically assign a primary responder. When an incident triggers, the on-call person is notified first.' },
      { heading: 'Overrides', content: 'Need to swap shifts? Create an override to temporarily change who\'s on call without modifying the permanent schedule.' },
      { heading: 'Layers', content: 'Schedules can have multiple layers (e.g., primary and secondary) to provide backup coverage.' },
    ],
    relatedTerms: ['on-call', 'schedule', 'override', 'escalation-policy'],
  },
  '/escalation-policies': {
    id: 'escalation-overview',
    title: 'Escalation Policies',
    summary: 'Escalation policies define the chain of responsibility when an incident isn\'t acknowledged.',
    sections: [
      { heading: 'How Escalation Works', content: 'When an incident triggers, the first level of the escalation policy is notified. If no one acknowledges within the timeout period, it escalates to the next level. This continues until someone responds or all levels are exhausted.' },
      { heading: 'Levels', content: 'Each level can target on-call schedules, specific users, or both. Timeout between levels is configurable (typically 5-30 minutes).' },
      { heading: 'Repeat Policy', content: 'If all levels are exhausted without acknowledgment, the policy can optionally repeat from the beginning.' },
    ],
    relatedTerms: ['escalation-policy', 'on-call', 'acknowledge', 'timeout'],
  },
  '/schedules': {
    id: 'schedules-overview',
    title: 'On-Call Schedules',
    summary: 'Schedules automate who is on call and when, ensuring 24/7 coverage.',
    sections: [
      { heading: 'Rotation Types', content: 'Daily rotations hand off at a set time each day. Weekly rotations change on a specific day. Custom rotations allow any interval.' },
      { heading: 'Schedule Layers', content: 'Stack multiple rotation layers for complex coverage patterns. Higher layers take priority over lower ones.' },
      { heading: 'Timezone Handling', content: 'Schedules respect timezone settings, which is critical for distributed teams spanning multiple regions.' },
    ],
    relatedTerms: ['schedule', 'on-call', 'rotation', 'override'],
  },
  '/analytics': {
    id: 'analytics-overview',
    title: 'Analytics & Reporting',
    summary: 'Track incident metrics, team performance, and identify patterns to improve reliability.',
    sections: [
      { heading: 'Key Metrics', content: 'MTTA (Mean Time to Acknowledge) and MTTR (Mean Time to Resolve) are the primary indicators of incident response health.' },
      { heading: 'Incident Volume', content: 'Track how many incidents occur over time, broken down by service, team, or priority. Spot trends before they become problems.' },
      { heading: 'Team Workload', content: 'Understand how incident load is distributed across team members. Prevent burnout by ensuring fair rotation.' },
    ],
    relatedTerms: ['mtta', 'mttr', 'incident'],
  },
  '/integrations': {
    id: 'integrations-overview',
    title: 'Integrations',
    summary: 'Connect PagerDuty with your monitoring, ticketing, and communication tools.',
    sections: [
      { heading: 'Inbound Integrations', content: 'Monitoring tools (Datadog, CloudWatch, Prometheus, etc.) send alerts to PagerDuty through inbound integrations. Each integration generates a unique routing key.' },
      { heading: 'Outbound Integrations', content: 'PagerDuty can send notifications to Slack, Microsoft Teams, Jira, and more when incidents are created or updated.' },
      { heading: 'Event Orchestration', content: 'Use event orchestration rules to transform, route, suppress, or enrich events before they become incidents.' },
    ],
    relatedTerms: ['integration', 'event-orchestration', 'routing-key', 'webhook'],
  },
  '/automation/workflows': {
    id: 'workflows-overview',
    title: 'Incident Workflows',
    summary: 'Automate common incident response actions with configurable workflows.',
    sections: [
      { heading: 'What Are Workflows?', content: 'Workflows are automated sequences of actions triggered by incident events. For example: when a P1 incident triggers, automatically create a Slack channel, page the on-call team, and open a Zoom bridge.' },
      { heading: 'Triggers', content: 'Workflows can be triggered by incident creation, acknowledgment, escalation, or custom conditions.' },
      { heading: 'Actions', content: 'Available actions include sending notifications, running scripts, creating conference bridges, updating status pages, and more.' },
    ],
    relatedTerms: ['workflow', 'incident', 'automation'],
  },
  '/automation/orchestration': {
    id: 'orchestration-overview',
    title: 'Event Orchestration',
    summary: 'Route, transform, and act on events before they become incidents.',
    sections: [
      { heading: 'How It Works', content: 'Event orchestration applies rules to incoming events. Rules can modify event severity, route to different services, suppress noise, or add context — all before an incident is created.' },
      { heading: 'Rule Sets', content: 'Organize rules into ordered sets. Rules are evaluated top-to-bottom; the first matching rule wins.' },
      { heading: 'Use Cases', content: 'Common patterns: suppress known-noisy alerts during maintenance windows, auto-resolve flapping alerts, enrich events with runbook URLs.' },
    ],
    relatedTerms: ['event-orchestration', 'routing', 'suppression', 'service'],
  },
  '/status': {
    id: 'status-overview',
    title: 'Status Dashboard',
    summary: 'Public-facing and internal views of your service health.',
    sections: [
      { heading: 'Purpose', content: 'The Status Dashboard provides a high-level view of operational health. Share it with stakeholders to keep them informed without requiring PagerDuty access.' },
      { heading: 'Business Services', content: 'Business services represent customer-facing capabilities (e.g., "Checkout", "Search") and aggregate the health of their underlying technical services.' },
    ],
    relatedTerms: ['status-dashboard', 'business-service', 'service'],
  },
  '/aiops': {
    id: 'aiops-overview',
    title: 'AIOps',
    summary: 'Machine learning-powered noise reduction and intelligent alert grouping.',
    sections: [
      { heading: 'Intelligent Grouping', content: 'AIOps automatically groups related alerts into a single incident, reducing noise and helping responders focus on root causes rather than symptoms.' },
      { heading: 'Noise Reduction', content: 'Machine learning models identify patterns in your alert data and suppress duplicate or low-signal events.' },
      { heading: 'Past Incidents', content: 'When a new incident triggers, AIOps surfaces similar past incidents to help responders diagnose and resolve faster.' },
    ],
    relatedTerms: ['aiops', 'alert-grouping', 'noise-reduction'],
  },
  '/response-plays': {
    id: 'response-plays-overview',
    title: 'Response Plays',
    summary: 'Pre-built mobilization plans for major incidents.',
    sections: [
      { heading: 'What is a Response Play?', content: 'A response play is a saved set of actions you can execute during a major incident. Think of it as a "break glass" button that mobilizes the right people and tools instantly.' },
      { heading: 'Common Plays', content: 'Examples: "Major Incident" play that pages all leads and opens a war room. "Customer Impact" play that notifies stakeholders and updates the status page.' },
    ],
    relatedTerms: ['response-play', 'incident', 'mobilization'],
  },
  '/service-graph': {
    id: 'service-graph-overview',
    title: 'Service Graph',
    summary: 'Visualize dependencies between your services.',
    sections: [
      { heading: 'Purpose', content: 'The Service Graph shows how your services relate to each other. Understanding dependencies helps you assess blast radius during incidents.' },
      { heading: 'Dependencies', content: 'Define upstream and downstream dependencies between services. When a dependency has an active incident, dependent services are flagged.' },
    ],
    relatedTerms: ['service', 'dependency', 'blast-radius'],
  },
  '/business-services': {
    id: 'business-services-overview',
    title: 'Business Services',
    summary: 'Map technical services to business capabilities that stakeholders understand.',
    sections: [
      { heading: 'What Are Business Services?', content: 'Business services represent customer-facing capabilities like "Checkout", "Search", or "Login". They aggregate the health of underlying technical services into a business context.' },
      { heading: 'Impact Mapping', content: 'When a technical service has an incident, the associated business service shows the business impact. This helps prioritize based on customer value.' },
    ],
    relatedTerms: ['business-service', 'service', 'impact'],
  },
  '/settings': {
    id: 'settings-overview',
    title: 'Account Settings',
    summary: 'Configure your PagerDuty account, notification rules, and preferences.',
    sections: [
      { heading: 'Profile', content: 'Update your name, timezone, and bio. Your timezone affects how on-call schedules display and when you receive notifications.' },
      { heading: 'Notification Rules', content: 'Configure how you\'re notified for high vs. low urgency incidents. Set delays between notification methods for a cascading alert pattern.' },
      { heading: 'Contact Methods', content: 'Add and verify email addresses, phone numbers, and SMS numbers. PagerDuty verifies each method before using it for alerts.' },
    ],
    relatedTerms: ['notification-rule', 'contact-method', 'timezone'],
  },
  '/teams': {
    id: 'teams-overview',
    title: 'Teams',
    summary: 'Organize your responders into teams that own services and share on-call responsibilities.',
    sections: [
      { heading: 'What is a Team?', content: 'A team is a group of users who share responsibility for one or more services. Teams have their own escalation policies, schedules, and dashboards.' },
      { heading: 'Team Ownership', content: 'Each service is owned by a team. When an incident triggers on a service, the owning team\'s escalation policy determines who gets notified.' },
      { heading: 'Managing Members', content: 'Add or remove members, assign roles within the team (manager, responder), and configure team-level notification rules.' },
    ],
    relatedTerms: ['team', 'service', 'escalation-policy'],
  },
  '/alerts': {
    id: 'alerts-overview',
    title: 'Alerts',
    summary: 'Alerts are the raw signals from your monitoring tools that can trigger or group into incidents.',
    sections: [
      { heading: 'Alerts vs Incidents', content: 'An alert is a single signal from a monitoring integration. Multiple related alerts can be grouped into a single incident via alert grouping rules.' },
      { heading: 'Alert Grouping', content: 'Intelligent alert grouping reduces noise by combining related alerts. Grouping can be time-based, content-based, or powered by AIOps machine learning.' },
      { heading: 'Suppression', content: 'Suppress alerts that match certain patterns to prevent them from creating incidents, useful during maintenance windows or for known-noisy sources.' },
    ],
    relatedTerms: ['alert-grouping', 'noise-reduction', 'suppression', 'incident'],
  },
  '/automation/rundeck': {
    id: 'rundeck-overview',
    title: 'Rundeck Automation',
    summary: 'Run automated diagnostics and remediation actions directly from PagerDuty.',
    sections: [
      { heading: 'What is Rundeck?', content: 'Rundeck is an operations automation platform integrated with PagerDuty. It allows responders to run pre-defined jobs like restarting services, gathering diagnostics, or executing runbooks.' },
      { heading: 'Automated Diagnostics', content: 'Attach diagnostic jobs to services so responders can gather context with a single click when an incident triggers.' },
      { heading: 'Self-Healing', content: 'Configure automated remediation that runs when specific incident conditions are met, reducing MTTR without human intervention.' },
    ],
    relatedTerms: ['workflow', 'incident', 'service'],
  },
};

export const TERMINOLOGY: Record<string, TerminologyEntry> = {
  'incident': {
    term: 'Incident',
    definition: 'A disruption or degradation that needs human attention. Incidents are triggered by alerts from monitoring tools or created manually. They flow through states: Triggered, Acknowledged, Resolved.',
  },
  'acknowledge': {
    term: 'Acknowledge',
    definition: 'When a responder signals they\'re aware of and working on an incident. Acknowledging stops further escalation notifications temporarily.',
  },
  'resolve': {
    term: 'Resolve',
    definition: 'Marking an incident as fixed. This stops all notifications and closes the incident. Resolved incidents can be re-triggered if the issue recurs.',
  },
  'service': {
    term: 'Service',
    definition: 'A discrete piece of functionality (e.g., "Payment API" or "User Database") that your team owns and monitors. Services connect integrations to escalation policies.',
  },
  'integration': {
    term: 'Integration',
    definition: 'A connection between a monitoring tool and PagerDuty. Inbound integrations (like Datadog or CloudWatch) send alerts in. Outbound integrations (like Slack) send notifications out.',
  },
  'escalation-policy': {
    term: 'Escalation Policy',
    definition: 'A set of rules defining who to notify about an incident and in what order. If the first person doesn\'t respond, it escalates to the next level.',
  },
  'on-call': {
    term: 'On-Call',
    definition: 'Being the designated responder for a service during a specific time window. On-call schedules rotate this responsibility across team members.',
  },
  'schedule': {
    term: 'Schedule',
    definition: 'An automated rotation that determines who is on call and when. Schedules can be daily, weekly, or custom, and support multiple layers for backup coverage.',
  },
  'override': {
    term: 'Override',
    definition: 'A temporary change to an on-call schedule. Use overrides when someone needs to swap shifts or cover for a teammate without changing the permanent rotation.',
  },
  'urgency': {
    term: 'Urgency',
    definition: 'Determines how aggressively PagerDuty notifies responders. High urgency = immediate phone/SMS/push. Low urgency = email or delayed notification.',
  },
  'priority': {
    term: 'Priority',
    definition: 'A label (P1-P5) indicating the severity and business impact of an incident. P1 is critical/customer-impacting. P5 is informational.',
  },
  'team': {
    term: 'Team',
    definition: 'A group of users who share responsibility for a set of services. Teams have their own escalation policies, schedules, and dashboards.',
  },
  'contact-method': {
    term: 'Contact Method',
    definition: 'A verified way for PagerDuty to reach you: email, phone call, SMS, or push notification. You can configure multiple methods for redundancy.',
  },
  'notification-rule': {
    term: 'Notification Rule',
    definition: 'Defines when and how you\'re contacted about incidents. Example: "Immediately notify via push, then call after 1 minute if not acknowledged."',
  },
  'mtta': {
    term: 'MTTA (Mean Time to Acknowledge)',
    definition: 'The average time between when an incident is triggered and when someone acknowledges it. Lower MTTA means faster initial response.',
  },
  'mttr': {
    term: 'MTTR (Mean Time to Resolve)',
    definition: 'The average time between when an incident is triggered and when it\'s resolved. This is the key metric for overall incident response effectiveness.',
  },
  'event-orchestration': {
    term: 'Event Orchestration',
    definition: 'A rules engine that processes incoming events before they become incidents. Use it to route events, suppress noise, transform payloads, or add automation.',
  },
  'routing-key': {
    term: 'Routing Key',
    definition: 'A unique identifier that directs events from a monitoring integration to the correct PagerDuty service. Each integration on a service gets its own routing key.',
  },
  'webhook': {
    term: 'Webhook',
    definition: 'An HTTP callback that PagerDuty sends to an external URL when certain events occur (e.g., incident triggered). Used for custom integrations.',
  },
  'workflow': {
    term: 'Incident Workflow',
    definition: 'An automated sequence of actions (like creating a Slack channel or paging a team) that runs when specific incident conditions are met.',
  },
  'alert-grouping': {
    term: 'Alert Grouping',
    definition: 'A feature that automatically combines related alerts into a single incident. Reduces noise by preventing the same problem from creating dozens of separate incidents.',
  },
  'noise-reduction': {
    term: 'Noise Reduction',
    definition: 'Machine learning that identifies and suppresses duplicate or low-value alerts. Helps responders focus on real issues rather than alert storms.',
  },
  'business-service': {
    term: 'Business Service',
    definition: 'A customer-facing capability (e.g., "Checkout" or "Search") that maps to one or more technical services. Helps stakeholders understand impact in business terms.',
  },
  'response-play': {
    term: 'Response Play',
    definition: 'A pre-configured mobilization plan for major incidents. One click to assemble the right people, open communication channels, and notify stakeholders.',
  },
  'suppression': {
    term: 'Suppression',
    definition: 'Preventing specific events from creating incidents. Used for known-noisy alerts, maintenance windows, or events that don\'t require human intervention.',
  },
  'timeout': {
    term: 'Escalation Timeout',
    definition: 'The time PagerDuty waits for someone to acknowledge at one escalation level before moving to the next. Typically 5-30 minutes.',
  },
  'status-dashboard': {
    term: 'Status Dashboard',
    definition: 'A page showing the current operational health of your services. Can be shared with internal stakeholders or made public for customers.',
  },
  'dependency': {
    term: 'Service Dependency',
    definition: 'A relationship between services where one depends on another. If an upstream dependency has an incident, downstream services may be affected.',
  },
  'blast-radius': {
    term: 'Blast Radius',
    definition: 'The extent of impact when a service goes down. Understanding dependencies helps assess blast radius — which other services and customers are affected.',
  },
  'rotation': {
    term: 'Rotation',
    definition: 'The pattern by which on-call responsibility shifts between team members. Common rotations: daily (every 24h), weekly (every 7 days), or custom intervals.',
  },
  'mobilization': {
    term: 'Mobilization',
    definition: 'Rapidly assembling the right people and resources to respond to a major incident. Response plays automate this process.',
  },
  'impact': {
    term: 'Business Impact',
    definition: 'The effect an incident has on customers or revenue. Business services help map technical incidents to their real-world business impact.',
  },
  'aiops': {
    term: 'AIOps',
    definition: 'Artificial Intelligence for IT Operations. In PagerDuty, this means ML-powered features like intelligent alert grouping, noise reduction, and similar incident suggestions.',
  },
};

export interface TermFlowState {
  completed: boolean;
  shownTerms: string[];
}

export function getTermFlowState(): TermFlowState {
  const raw = localStorage.getItem(TERM_FLOW_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* */ }
  }
  return { completed: false, shownTerms: [] };
}

export function saveTermFlowState(state: TermFlowState) {
  localStorage.setItem(TERM_FLOW_KEY, JSON.stringify(state));
}

export const ROUTE_TERM_SEQUENCES: Record<string, string[]> = {
  '/': ['incident', 'priority', 'urgency', 'service'],
  '/incidents': ['incident', 'priority', 'urgency', 'service'],
  '/my-world': ['incident', 'on-call'],
  '/services': ['service', 'team', 'on-call', 'escalation-policy', 'integration'],
  '/users': ['contact-method', 'notification-rule', 'team'],
  '/escalation-policies': ['escalation-policy', 'timeout'],
  '/schedules': ['schedule', 'rotation', 'override'],
  '/oncall': ['on-call', 'schedule', 'override'],
  '/integrations': ['integration', 'routing-key', 'webhook'],
  '/automation/workflows': ['workflow'],
  '/automation/orchestration': ['event-orchestration', 'suppression', 'noise-reduction'],
  '/analytics': ['mtta', 'mttr'],
  '/status': ['status-dashboard'],
  '/business-services': ['business-service', 'dependency', 'blast-radius', 'impact'],
  '/service-graph': ['dependency', 'blast-radius'],
  '/aiops': ['aiops', 'alert-grouping', 'noise-reduction'],
  '/response-plays': ['response-play', 'mobilization'],
  '/operations': ['incident', 'acknowledge', 'resolve'],
};

export interface TermDemoField {
  label: string;
  placeholder: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
}

export const TERM_DEMO_FIELDS: Record<string, TermDemoField> = {
  'incident': { label: 'Incident title', placeholder: 'e.g. Database CPU spike', type: 'text' },
  'acknowledge': { label: 'Ack message', placeholder: 'e.g. Looking into it', type: 'text' },
  'resolve': { label: 'Resolution note', placeholder: 'e.g. Restarted service', type: 'text' },
  'service': { label: 'Service name', placeholder: 'e.g. payment-api', type: 'text' },
  'integration': { label: 'Integration type', placeholder: 'Choose one…', type: 'select', options: ['Datadog', 'CloudWatch', 'Prometheus', 'Splunk'] },
  'escalation-policy': { label: 'Policy name', placeholder: 'e.g. Engineering On-Call', type: 'text' },
  'on-call': { label: 'On-call name', placeholder: 'e.g. weekend-rotation', type: 'text' },
  'schedule': { label: 'Schedule name', placeholder: 'e.g. US-East Rotation', type: 'text' },
  'override': { label: 'Override reason', placeholder: 'e.g. Covering for Alice', type: 'text' },
  'urgency': { label: 'Default urgency', placeholder: 'Choose one…', type: 'select', options: ['High', 'Low', 'Dynamic'] },
  'priority': { label: 'Priority label', placeholder: 'e.g. P1 - Critical', type: 'text' },
  'team': { label: 'Team name', placeholder: 'e.g. Platform Engineering', type: 'text' },
  'contact-method': { label: 'Contact email', placeholder: 'e.g. me@company.com', type: 'text' },
  'notification-rule': { label: 'Notify after (min)', placeholder: 'e.g. 0', type: 'text' },
  'mtta': { label: 'Target MTTA (min)', placeholder: 'e.g. 5', type: 'text' },
  'mttr': { label: 'Target MTTR (min)', placeholder: 'e.g. 30', type: 'text' },
  'event-orchestration': { label: 'Rule name', placeholder: 'e.g. Route DB alerts', type: 'text' },
  'routing-key': { label: 'Key label', placeholder: 'e.g. prod-alerts', type: 'text' },
  'webhook': { label: 'Webhook URL', placeholder: 'https://…', type: 'text' },
  'workflow': { label: 'Workflow name', placeholder: 'e.g. Auto-page SRE', type: 'text' },
  'alert-grouping': { label: 'Grouping window', placeholder: 'Choose one…', type: 'select', options: ['5 min', '15 min', '30 min', '1 hour'] },
  'noise-reduction': { label: 'Enable noise reduction', placeholder: '', type: 'checkbox' },
  'business-service': { label: 'Business service', placeholder: 'e.g. Checkout Flow', type: 'text' },
  'response-play': { label: 'Play name', placeholder: 'e.g. Major Incident', type: 'text' },
  'suppression': { label: 'Suppress pattern', placeholder: 'e.g. test-alert-*', type: 'text' },
  'timeout': { label: 'Timeout (min)', placeholder: 'e.g. 30', type: 'text' },
  'status-dashboard': { label: 'Dashboard name', placeholder: 'e.g. Public Status', type: 'text' },
  'dependency': { label: 'Depends on', placeholder: 'e.g. auth-service', type: 'text' },
  'blast-radius': { label: 'Affected services', placeholder: 'e.g. 3', type: 'text' },
  'rotation': { label: 'Rotation type', placeholder: 'Choose one…', type: 'select', options: ['Daily', 'Weekly', 'Custom'] },
  'mobilization': { label: 'Mobilize team', placeholder: 'e.g. Incident Commanders', type: 'text' },
  'impact': { label: 'Impact level', placeholder: 'Choose one…', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
  'aiops': { label: 'Enable AIOps', placeholder: '', type: 'checkbox' },
};
