const ONBOARDING_KEY = 'pd-onboarding';

export type OnboardingRole = 'admin' | 'user' | null;

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

export interface OnboardingState {
  role: OnboardingRole;
  started: boolean;
  dismissed: boolean;
  currentStep: number;
  adminSteps: AdminSetupStep[];
  adminData: AdminSetupData;
  userData: UserSetupData;
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
  };
}

export function getOnboarding(): OnboardingState {
  const raw = localStorage.getItem(ONBOARDING_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as OnboardingState;
    } catch { /* corrupted */ }
  }
  return defaultState();
}

export function saveOnboarding(state: OnboardingState) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
}

export function resetOnboarding(): OnboardingState {
  localStorage.removeItem(ONBOARDING_KEY);
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
