export interface Incident {
  id: string;
  number: number;
  title: string;
  status: 'triggered' | 'acknowledged' | 'resolved';
  urgency: 'high' | 'low';
  service: string;
  serviceId: string;
  assignee: string;
  assigneeId: string;
  escalationPolicy: string;
  createdAt: string;
  updatedAt: string;
  priority?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'warning' | 'critical' | 'maintenance' | 'disabled';
  team: string;
  teamId: string;
  escalationPolicy: string;
  escalationPolicyId: string;
  lastIncident: string;
  integrationCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Responder' | 'Observer' | 'Restricted Access' | 'Full Stakeholder' | 'Limited Stakeholder';
  title: string;
  department: string;
  location: string;
  timezone: string;
  avatar: string;
  phone: string;
  smsPhone: string;
  license: 'Full User' | 'Stakeholder';
  status: 'active' | 'invited' | 'disabled';
  teams: string[];
  createdAt: string;
  lastLogin: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: string[];
}

export interface EscalationPolicy {
  id: string;
  name: string;
  description: string;
  teamId: string;
  rules: { level: number; targets: string[]; escalationDelayMinutes: number }[];
  repeatEnabled: boolean;
  numLoops: number;
}

export interface Schedule {
  id: string;
  name: string;
  timezone: string;
  teamId: string;
  users: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  serviceId: string;
  vendor: string;
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  triggerType: 'incident' | 'manual' | 'conditional';
  triggerCondition?: string;
  actions: WorkflowAction[];
  teamId: string;
  serviceId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  runCount: number;
}

export interface WorkflowAction {
  id: string;
  type: string;
  package: string;
  config: Record<string, string>;
  order: number;
}

export interface Orchestration {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'service';
  serviceId?: string;
  rules: OrchestrationRule[];
  integrationKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrchestrationRule {
  id: string;
  label: string;
  conditions: { field: string; operator: string; value: string }[];
  actions: { type: string; value: string }[];
  order: number;
  disabled: boolean;
}

export interface BusinessService {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerTeamId: string;
  pointOfContact: string;
  pointOfContactId: string;
  status: 'operational' | 'degraded' | 'disrupted' | 'under_maintenance';
  supportingServices: string[];
  createdAt: string;
  updatedAt: string;
}

const AVATARS = [
  'https://ui-avatars.com/api/?name=Sarah+Chen&background=0D47A1&color=fff',
  'https://ui-avatars.com/api/?name=Mike+Johnson&background=1B5E20&color=fff',
  'https://ui-avatars.com/api/?name=Emily+Davis&background=E65100&color=fff',
  'https://ui-avatars.com/api/?name=James+Wilson&background=4A148C&color=fff',
  'https://ui-avatars.com/api/?name=Lisa+Anderson&background=880E4F&color=fff',
  'https://ui-avatars.com/api/?name=David+Brown&background=004D40&color=fff',
  'https://ui-avatars.com/api/?name=Rachel+Taylor&background=BF360C&color=fff',
  'https://ui-avatars.com/api/?name=Alex+Martinez&background=1A237E&color=fff',
];

function generateSeedData() {
  const teams: Team[] = [
    { id: 'team-1', name: 'Platform Engineering', description: 'Core platform infrastructure team', memberCount: 5, members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'] },
    { id: 'team-2', name: 'Backend Services', description: 'API and backend services team', memberCount: 4, members: ['user-3', 'user-4', 'user-6', 'user-7'] },
    { id: 'team-3', name: 'Frontend', description: 'Web and mobile frontend team', memberCount: 3, members: ['user-5', 'user-6', 'user-8'] },
    { id: 'team-4', name: 'SRE', description: 'Site Reliability Engineering', memberCount: 4, members: ['user-1', 'user-2', 'user-7', 'user-8'] },
    { id: 'team-5', name: 'Data Engineering', description: 'Data pipeline and analytics team', memberCount: 3, members: ['user-3', 'user-5', 'user-7'] },
  ];

  const users: User[] = [
    { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Owner', title: 'VP of Engineering', department: 'Engineering', location: 'San Francisco, CA', timezone: 'America/Los_Angeles', avatar: AVATARS[0], phone: '+1 (555) 123-4567', smsPhone: '+1 (555) 123-4567', license: 'Full User', status: 'active', teams: ['Platform Engineering', 'SRE'], createdAt: '2023-01-15T08:00:00Z', lastLogin: '2025-02-10T14:30:00Z' },
    { id: 'user-2', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Admin', title: 'Senior SRE', department: 'Engineering', location: 'New York, NY', timezone: 'America/New_York', avatar: AVATARS[1], phone: '+1 (555) 234-5678', smsPhone: '+1 (555) 234-5678', license: 'Full User', status: 'active', teams: ['Platform Engineering', 'SRE'], createdAt: '2023-02-20T08:00:00Z', lastLogin: '2025-02-10T12:15:00Z' },
    { id: 'user-3', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Manager', title: 'Engineering Manager', department: 'Engineering', location: 'Austin, TX', timezone: 'America/Chicago', avatar: AVATARS[2], phone: '+1 (555) 345-6789', smsPhone: '+1 (555) 345-6789', license: 'Full User', status: 'active', teams: ['Platform Engineering', 'Backend Services', 'Data Engineering'], createdAt: '2023-03-10T08:00:00Z', lastLogin: '2025-02-09T18:45:00Z' },
    { id: 'user-4', name: 'James Wilson', email: 'james.wilson@example.com', role: 'Responder', title: 'Backend Engineer', department: 'Engineering', location: 'Seattle, WA', timezone: 'America/Los_Angeles', avatar: AVATARS[3], phone: '+1 (555) 456-7890', smsPhone: '+1 (555) 456-7890', license: 'Full User', status: 'active', teams: ['Platform Engineering', 'Backend Services'], createdAt: '2023-04-05T08:00:00Z', lastLogin: '2025-02-10T09:30:00Z' },
    { id: 'user-5', name: 'Lisa Anderson', email: 'lisa.anderson@example.com', role: 'Responder', title: 'Frontend Engineer', department: 'Engineering', location: 'Denver, CO', timezone: 'America/Denver', avatar: AVATARS[4], phone: '+1 (555) 567-8901', smsPhone: '+1 (555) 567-8901', license: 'Full User', status: 'active', teams: ['Platform Engineering', 'Frontend', 'Data Engineering'], createdAt: '2023-05-15T08:00:00Z', lastLogin: '2025-02-08T16:00:00Z' },
    { id: 'user-6', name: 'David Brown', email: 'david.brown@example.com', role: 'Responder', title: 'Full Stack Developer', department: 'Engineering', location: 'Chicago, IL', timezone: 'America/Chicago', avatar: AVATARS[5], phone: '+1 (555) 678-9012', smsPhone: '+1 (555) 678-9012', license: 'Full User', status: 'active', teams: ['Backend Services', 'Frontend'], createdAt: '2023-06-20T08:00:00Z', lastLogin: '2025-02-10T11:00:00Z' },
    { id: 'user-7', name: 'Rachel Taylor', email: 'rachel.taylor@example.com', role: 'Observer', title: 'Product Manager', department: 'Product', location: 'Remote', timezone: 'America/New_York', avatar: AVATARS[6], phone: '+1 (555) 789-0123', smsPhone: '+1 (555) 789-0123', license: 'Full User', status: 'active', teams: ['Backend Services', 'SRE', 'Data Engineering'], createdAt: '2023-07-10T08:00:00Z', lastLogin: '2025-02-07T13:20:00Z' },
    { id: 'user-8', name: 'Alex Martinez', email: 'alex.martinez@example.com', role: 'Restricted Access', title: 'Junior Developer', department: 'Engineering', location: 'Portland, OR', timezone: 'America/Los_Angeles', avatar: AVATARS[7], phone: '+1 (555) 890-1234', smsPhone: '+1 (555) 890-1234', license: 'Stakeholder', status: 'invited', teams: ['Frontend', 'SRE'], createdAt: '2025-01-05T08:00:00Z', lastLogin: '' },
  ];

  const escalationPolicies: EscalationPolicy[] = [
    { id: 'ep-1', name: 'Platform Default', description: 'Default escalation for platform services', teamId: 'team-1', rules: [{ level: 1, targets: ['user-1', 'user-2'], escalationDelayMinutes: 30 }, { level: 2, targets: ['user-3'], escalationDelayMinutes: 15 }], repeatEnabled: true, numLoops: 3 },
    { id: 'ep-2', name: 'Backend Critical', description: 'Critical backend escalation path', teamId: 'team-2', rules: [{ level: 1, targets: ['user-4', 'user-6'], escalationDelayMinutes: 15 }, { level: 2, targets: ['user-3', 'user-1'], escalationDelayMinutes: 10 }], repeatEnabled: true, numLoops: 5 },
    { id: 'ep-3', name: 'Frontend Alerts', description: 'Frontend service escalation', teamId: 'team-3', rules: [{ level: 1, targets: ['user-5', 'user-6'], escalationDelayMinutes: 30 }], repeatEnabled: false, numLoops: 0 },
    { id: 'ep-4', name: 'SRE On-Call', description: 'SRE team on-call rotation', teamId: 'team-4', rules: [{ level: 1, targets: ['user-2', 'user-7'], escalationDelayMinutes: 10 }, { level: 2, targets: ['user-1'], escalationDelayMinutes: 5 }], repeatEnabled: true, numLoops: 10 },
  ];

  const services: Service[] = [
    { id: 'svc-1', name: 'Payment Gateway', description: 'Handles all payment processing and transactions', status: 'active', team: 'Platform Engineering', teamId: 'team-1', escalationPolicy: 'Platform Default', escalationPolicyId: 'ep-1', lastIncident: '2 hours ago', integrationCount: 4, createdAt: '2023-01-20T08:00:00Z' },
    { id: 'svc-2', name: 'User Authentication', description: 'Authentication and authorization service', status: 'active', team: 'Backend Services', teamId: 'team-2', escalationPolicy: 'Backend Critical', escalationPolicyId: 'ep-2', lastIncident: '1 day ago', integrationCount: 3, createdAt: '2023-01-25T08:00:00Z' },
    { id: 'svc-3', name: 'API Gateway', description: 'Central API gateway and rate limiting', status: 'warning', team: 'Platform Engineering', teamId: 'team-1', escalationPolicy: 'Platform Default', escalationPolicyId: 'ep-1', lastIncident: '30 minutes ago', integrationCount: 5, createdAt: '2023-02-01T08:00:00Z' },
    { id: 'svc-4', name: 'Web Application', description: 'Main customer-facing web application', status: 'active', team: 'Frontend', teamId: 'team-3', escalationPolicy: 'Frontend Alerts', escalationPolicyId: 'ep-3', lastIncident: '3 days ago', integrationCount: 2, createdAt: '2023-02-15T08:00:00Z' },
    { id: 'svc-5', name: 'Database Cluster', description: 'Primary PostgreSQL database cluster', status: 'critical', team: 'SRE', teamId: 'team-4', escalationPolicy: 'SRE On-Call', escalationPolicyId: 'ep-4', lastIncident: '5 minutes ago', integrationCount: 6, createdAt: '2023-01-10T08:00:00Z' },
    { id: 'svc-6', name: 'Notification Service', description: 'Email, SMS, and push notification delivery', status: 'active', team: 'Backend Services', teamId: 'team-2', escalationPolicy: 'Backend Critical', escalationPolicyId: 'ep-2', lastIncident: '5 days ago', integrationCount: 3, createdAt: '2023-03-01T08:00:00Z' },
    { id: 'svc-7', name: 'Search Service', description: 'Elasticsearch-based search infrastructure', status: 'active', team: 'Platform Engineering', teamId: 'team-1', escalationPolicy: 'Platform Default', escalationPolicyId: 'ep-1', lastIncident: '2 weeks ago', integrationCount: 2, createdAt: '2023-03-15T08:00:00Z' },
    { id: 'svc-8', name: 'CDN & Static Assets', description: 'Content delivery and static asset hosting', status: 'maintenance', team: 'SRE', teamId: 'team-4', escalationPolicy: 'SRE On-Call', escalationPolicyId: 'ep-4', lastIncident: '1 month ago', integrationCount: 1, createdAt: '2023-04-01T08:00:00Z' },
    { id: 'svc-9', name: 'Data Pipeline', description: 'ETL and real-time data processing', status: 'active', team: 'Data Engineering', teamId: 'team-5', escalationPolicy: 'Platform Default', escalationPolicyId: 'ep-1', lastIncident: '4 days ago', integrationCount: 4, createdAt: '2023-04-15T08:00:00Z' },
    { id: 'svc-10', name: 'Monitoring Stack', description: 'Internal monitoring and alerting infrastructure', status: 'active', team: 'SRE', teamId: 'team-4', escalationPolicy: 'SRE On-Call', escalationPolicyId: 'ep-4', lastIncident: '1 week ago', integrationCount: 7, createdAt: '2023-01-05T08:00:00Z' },
  ];

  const incidents: Incident[] = [
    { id: 'inc-1', number: 1847, title: 'Database connection pool exhausted', status: 'triggered', urgency: 'high', service: 'Database Cluster', serviceId: 'svc-5', assignee: 'Mike Johnson', assigneeId: 'user-2', escalationPolicy: 'SRE On-Call', createdAt: '2025-02-10T14:25:00Z', updatedAt: '2025-02-10T14:25:00Z', priority: 'P1' },
    { id: 'inc-2', number: 1846, title: 'API Gateway 502 errors spike', status: 'triggered', urgency: 'high', service: 'API Gateway', serviceId: 'svc-3', assignee: 'Sarah Chen', assigneeId: 'user-1', escalationPolicy: 'Platform Default', createdAt: '2025-02-10T14:00:00Z', updatedAt: '2025-02-10T14:10:00Z', priority: 'P1' },
    { id: 'inc-3', number: 1845, title: 'Payment processing latency above threshold', status: 'acknowledged', urgency: 'high', service: 'Payment Gateway', serviceId: 'svc-1', assignee: 'James Wilson', assigneeId: 'user-4', escalationPolicy: 'Platform Default', createdAt: '2025-02-10T12:30:00Z', updatedAt: '2025-02-10T13:00:00Z', priority: 'P2' },
    { id: 'inc-4', number: 1844, title: 'Search index replication lag', status: 'acknowledged', urgency: 'low', service: 'Search Service', serviceId: 'svc-7', assignee: 'Emily Davis', assigneeId: 'user-3', escalationPolicy: 'Platform Default', createdAt: '2025-02-10T11:00:00Z', updatedAt: '2025-02-10T11:45:00Z' },
    { id: 'inc-5', number: 1843, title: 'CDN cache invalidation failure', status: 'resolved', urgency: 'low', service: 'CDN & Static Assets', serviceId: 'svc-8', assignee: 'David Brown', assigneeId: 'user-6', escalationPolicy: 'SRE On-Call', createdAt: '2025-02-10T09:00:00Z', updatedAt: '2025-02-10T10:30:00Z' },
    { id: 'inc-6', number: 1842, title: 'Email notification delivery delays', status: 'resolved', urgency: 'high', service: 'Notification Service', serviceId: 'svc-6', assignee: 'Lisa Anderson', assigneeId: 'user-5', escalationPolicy: 'Backend Critical', createdAt: '2025-02-09T22:00:00Z', updatedAt: '2025-02-10T01:15:00Z', priority: 'P2' },
    { id: 'inc-7', number: 1841, title: 'Authentication service memory leak', status: 'resolved', urgency: 'high', service: 'User Authentication', serviceId: 'svc-2', assignee: 'Mike Johnson', assigneeId: 'user-2', escalationPolicy: 'Backend Critical', createdAt: '2025-02-09T18:00:00Z', updatedAt: '2025-02-09T20:30:00Z', priority: 'P1' },
    { id: 'inc-8', number: 1840, title: 'Web app JavaScript bundle error in production', status: 'resolved', urgency: 'high', service: 'Web Application', serviceId: 'svc-4', assignee: 'Lisa Anderson', assigneeId: 'user-5', escalationPolicy: 'Frontend Alerts', createdAt: '2025-02-09T15:00:00Z', updatedAt: '2025-02-09T16:00:00Z', priority: 'P3' },
    { id: 'inc-9', number: 1839, title: 'Data pipeline Kafka consumer lag', status: 'resolved', urgency: 'low', service: 'Data Pipeline', serviceId: 'svc-9', assignee: 'Rachel Taylor', assigneeId: 'user-7', escalationPolicy: 'Platform Default', createdAt: '2025-02-09T10:00:00Z', updatedAt: '2025-02-09T12:00:00Z' },
    { id: 'inc-10', number: 1838, title: 'Monitoring dashboard unresponsive', status: 'resolved', urgency: 'low', service: 'Monitoring Stack', serviceId: 'svc-10', assignee: 'Alex Martinez', assigneeId: 'user-8', escalationPolicy: 'SRE On-Call', createdAt: '2025-02-08T14:00:00Z', updatedAt: '2025-02-08T15:30:00Z' },
  ];

  const schedules: Schedule[] = [
    { id: 'sched-1', name: 'Platform Primary', timezone: 'America/Los_Angeles', teamId: 'team-1', users: ['user-1', 'user-2', 'user-4'] },
    { id: 'sched-2', name: 'SRE 24/7', timezone: 'UTC', teamId: 'team-4', users: ['user-2', 'user-7', 'user-8'] },
    { id: 'sched-3', name: 'Backend Weekday', timezone: 'America/New_York', teamId: 'team-2', users: ['user-3', 'user-4', 'user-6'] },
  ];

  const integrations: Integration[] = [
    { id: 'int-1', name: 'Datadog', type: 'Events API v2', serviceId: 'svc-5', vendor: 'Datadog', createdAt: '2023-01-20T08:00:00Z' },
    { id: 'int-2', name: 'CloudWatch', type: 'Amazon CloudWatch', serviceId: 'svc-5', vendor: 'AWS', createdAt: '2023-01-20T08:00:00Z' },
    { id: 'int-3', name: 'Slack Integration', type: 'Slack V2', serviceId: 'svc-1', vendor: 'Slack', createdAt: '2023-02-01T08:00:00Z' },
    { id: 'int-4', name: 'PagerDuty Email', type: 'Email', serviceId: 'svc-1', vendor: 'PagerDuty', createdAt: '2023-01-20T08:00:00Z' },
    { id: 'int-5', name: 'Jira Integration', type: 'Jira Cloud', serviceId: 'svc-3', vendor: 'Atlassian', createdAt: '2023-03-01T08:00:00Z' },
    { id: 'int-6', name: 'New Relic APM', type: 'New Relic', serviceId: 'svc-3', vendor: 'New Relic', createdAt: '2023-02-15T08:00:00Z' },
    { id: 'int-7', name: 'GitHub Actions', type: 'GitHub', serviceId: 'svc-4', vendor: 'GitHub', createdAt: '2023-04-01T08:00:00Z' },
    { id: 'int-8', name: 'Prometheus', type: 'Events API v2', serviceId: 'svc-10', vendor: 'Prometheus', createdAt: '2023-01-10T08:00:00Z' },
    { id: 'int-9', name: 'Grafana Alerts', type: 'Events API v2', serviceId: 'svc-10', vendor: 'Grafana', createdAt: '2023-01-10T08:00:00Z' },
    { id: 'int-10', name: 'Sentry', type: 'Sentry', serviceId: 'svc-4', vendor: 'Sentry', createdAt: '2023-04-01T08:00:00Z' },
  ];

  const workflows: Workflow[] = [
    { id: 'wf-1', name: 'Notify Slack on P1 Incident', description: 'Posts to #incidents-critical channel when a P1 incident is triggered', status: 'active', triggerType: 'incident', triggerCondition: 'incident.priority matches P1', actions: [{ id: 'wa-1', type: 'Send Slack Message', package: 'Slack', config: { channel: '#incidents-critical', message: 'P1 Incident: {{incident.title}}' }, order: 1 }, { id: 'wa-2', type: 'Add Responders', package: 'PagerDuty', config: { escalation_policy: 'SRE On-Call' }, order: 2 }], teamId: 'team-4', createdBy: 'user-1', createdAt: '2024-06-15T08:00:00Z', updatedAt: '2025-01-20T14:00:00Z', lastRun: '2025-02-10T14:25:00Z', runCount: 47 },
    { id: 'wf-2', name: 'Auto-Create Jira Ticket', description: 'Creates a Jira ticket for all high-urgency incidents', status: 'active', triggerType: 'incident', triggerCondition: 'incident.urgency matches high', actions: [{ id: 'wa-3', type: 'Create Jira Issue', package: 'Jira Cloud', config: { project: 'OPS', issue_type: 'Bug' }, order: 1 }], teamId: 'team-1', createdBy: 'user-3', createdAt: '2024-08-01T08:00:00Z', updatedAt: '2025-02-01T10:00:00Z', lastRun: '2025-02-10T14:00:00Z', runCount: 123 },
    { id: 'wf-3', name: 'Page Engineering Manager', description: 'Escalate to engineering manager after 30 mins unacknowledged', status: 'active', triggerType: 'conditional', triggerCondition: 'incident.status matches triggered AND incident.created_at older_than 30m', actions: [{ id: 'wa-4', type: 'Add Responders', package: 'PagerDuty', config: { users: 'Emily Davis' }, order: 1 }, { id: 'wa-5', type: 'Send Email', package: 'Email', config: { to: 'emily.davis@example.com', subject: 'Escalation: {{incident.title}}' }, order: 2 }], teamId: 'team-2', createdBy: 'user-2', createdAt: '2024-09-10T08:00:00Z', updatedAt: '2024-12-15T16:00:00Z', lastRun: '2025-02-09T18:15:00Z', runCount: 31 },
    { id: 'wf-4', name: 'Post-Incident Review Reminder', description: 'Sends a reminder to create a postmortem after incident resolution', status: 'active', triggerType: 'incident', triggerCondition: 'incident.status matches resolved', actions: [{ id: 'wa-6', type: 'Send Slack Message', package: 'Slack', config: { channel: '#postmortems', message: 'Incident {{incident.number}} resolved. Please create a postmortem.' }, order: 1 }], teamId: 'team-4', createdBy: 'user-1', createdAt: '2024-07-20T08:00:00Z', updatedAt: '2025-01-05T09:00:00Z', lastRun: '2025-02-10T10:30:00Z', runCount: 89 },
    { id: 'wf-5', name: 'Database Incident Runbook', description: 'Attaches database runbook and notifies DBA team', status: 'inactive', triggerType: 'incident', triggerCondition: 'incident.service matches Database Cluster', actions: [{ id: 'wa-7', type: 'Add Note', package: 'PagerDuty', config: { content: 'DB Runbook: https://wiki.example.com/db-runbook' }, order: 1 }, { id: 'wa-8', type: 'Send Slack Message', package: 'Slack', config: { channel: '#dba-team', message: 'DB incident triggered: {{incident.title}}' }, order: 2 }], teamId: 'team-4', serviceId: 'svc-5', createdBy: 'user-2', createdAt: '2024-10-01T08:00:00Z', updatedAt: '2025-02-05T11:00:00Z', runCount: 0 },
    { id: 'wf-6', name: 'Status Page Update', description: 'Automatically update status page when incidents affect customer-facing services', status: 'active', triggerType: 'incident', triggerCondition: 'incident.service matches Payment Gateway OR incident.service matches Web Application', actions: [{ id: 'wa-9', type: 'Update Status Page', package: 'Statuspage', config: { component: 'auto', status: 'degraded_performance' }, order: 1 }], teamId: 'team-1', createdBy: 'user-1', createdAt: '2024-11-15T08:00:00Z', updatedAt: '2025-01-30T13:00:00Z', lastRun: '2025-02-10T12:30:00Z', runCount: 15 },
  ];

  const orchestrations: Orchestration[] = [
    { id: 'orch-1', name: 'Global Event Orchestration', description: 'Routes all incoming events to appropriate services', type: 'global', integrationKey: 'R0XXXXXXXXXXXXXXXXXXXXXX', rules: [{ id: 'or-1', label: 'Route database alerts', conditions: [{ field: 'event.source', operator: 'contains', value: 'database' }, { field: 'event.severity', operator: 'equals', value: 'critical' }], actions: [{ type: 'route_to', value: 'svc-5' }, { type: 'set_priority', value: 'P1' }], order: 1, disabled: false }, { id: 'or-2', label: 'Route API alerts', conditions: [{ field: 'event.source', operator: 'contains', value: 'api-gateway' }], actions: [{ type: 'route_to', value: 'svc-3' }], order: 2, disabled: false }, { id: 'or-3', label: 'Suppress test events', conditions: [{ field: 'event.custom_details.environment', operator: 'equals', value: 'test' }], actions: [{ type: 'suppress', value: 'true' }], order: 3, disabled: false }, { id: 'or-4', label: 'Deduplicate monitoring alerts', conditions: [{ field: 'event.source', operator: 'contains', value: 'prometheus' }], actions: [{ type: 'dedupe_key', value: '{{event.source}}-{{event.component}}' }], order: 4, disabled: true }], createdAt: '2024-03-01T08:00:00Z', updatedAt: '2025-02-08T10:00:00Z' },
    { id: 'orch-2', name: 'Database Cluster Orchestration', description: 'Handles event routing for database service', type: 'service', serviceId: 'svc-5', rules: [{ id: 'or-5', label: 'Connection pool alerts', conditions: [{ field: 'event.summary', operator: 'contains', value: 'connection pool' }], actions: [{ type: 'set_severity', value: 'critical' }, { type: 'set_priority', value: 'P1' }], order: 1, disabled: false }, { id: 'or-6', label: 'Replication lag warnings', conditions: [{ field: 'event.summary', operator: 'contains', value: 'replication lag' }], actions: [{ type: 'set_severity', value: 'warning' }], order: 2, disabled: false }], createdAt: '2024-05-15T08:00:00Z', updatedAt: '2025-01-15T14:00:00Z' },
    { id: 'orch-3', name: 'API Gateway Orchestration', description: 'Event processing for API Gateway service', type: 'service', serviceId: 'svc-3', rules: [{ id: 'or-7', label: 'Rate limit events', conditions: [{ field: 'event.summary', operator: 'contains', value: 'rate limit' }], actions: [{ type: 'set_severity', value: 'info' }, { type: 'suppress', value: 'true' }], order: 1, disabled: false }], createdAt: '2024-06-01T08:00:00Z', updatedAt: '2025-02-01T09:00:00Z' },
  ];

  const businessServices: BusinessService[] = [
    { id: 'bs-1', name: 'Online Payments', description: 'Customer-facing payment processing and checkout experience', owner: 'Platform Engineering', ownerTeamId: 'team-1', pointOfContact: 'Sarah Chen', pointOfContactId: 'user-1', status: 'operational', supportingServices: ['svc-1', 'svc-2', 'svc-3'], createdAt: '2024-01-15T08:00:00Z', updatedAt: '2025-02-01T10:00:00Z' },
    { id: 'bs-2', name: 'Customer Portal', description: 'Self-service customer portal and account management', owner: 'Frontend', ownerTeamId: 'team-3', pointOfContact: 'Lisa Anderson', pointOfContactId: 'user-5', status: 'operational', supportingServices: ['svc-2', 'svc-4', 'svc-7'], createdAt: '2024-02-01T08:00:00Z', updatedAt: '2025-01-28T14:00:00Z' },
    { id: 'bs-3', name: 'Data Analytics Platform', description: 'Internal and external analytics and reporting', owner: 'Data Engineering', ownerTeamId: 'team-5', pointOfContact: 'Emily Davis', pointOfContactId: 'user-3', status: 'degraded', supportingServices: ['svc-5', 'svc-9', 'svc-10'], createdAt: '2024-03-10T08:00:00Z', updatedAt: '2025-02-10T08:00:00Z' },
    { id: 'bs-4', name: 'Notification Platform', description: 'All customer communication channels including email, SMS, and push', owner: 'Backend Services', ownerTeamId: 'team-2', pointOfContact: 'David Brown', pointOfContactId: 'user-6', status: 'operational', supportingServices: ['svc-6', 'svc-2'], createdAt: '2024-04-20T08:00:00Z', updatedAt: '2025-02-05T16:00:00Z' },
    { id: 'bs-5', name: 'Infrastructure & Monitoring', description: 'Core infrastructure, CDN, and monitoring services', owner: 'SRE', ownerTeamId: 'team-4', pointOfContact: 'Mike Johnson', pointOfContactId: 'user-2', status: 'under_maintenance', supportingServices: ['svc-5', 'svc-8', 'svc-10'], createdAt: '2024-01-05T08:00:00Z', updatedAt: '2025-02-10T12:00:00Z' },
  ];

  return { incidents, services, users, teams, escalationPolicies, schedules, integrations, workflows, orchestrations, businessServices };
}

const STORAGE_KEY = 'pd-extension-data';

export function getStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ReturnType<typeof generateSeedData>;
      if (!parsed.workflows || !parsed.orchestrations || !parsed.businessServices) {
        const fresh = generateSeedData();
        parsed.workflows = parsed.workflows || fresh.workflows;
        parsed.orchestrations = parsed.orchestrations || fresh.orchestrations;
        parsed.businessServices = parsed.businessServices || fresh.businessServices;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // corrupted, regenerate
    }
  }
  const data = generateSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function saveStore(data: ReturnType<typeof generateSeedData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DEMO_ENTRIES_KEY);
  return getStore();
}

const DEMO_ENTRIES_KEY = 'pd-demo-entries';

function trackDemoId(id: string) {
  const raw = localStorage.getItem(DEMO_ENTRIES_KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  ids.push(id);
  localStorage.setItem(DEMO_ENTRIES_KEY, JSON.stringify(ids));
}

export function addDemoEntry(termId: string, value: string): boolean {
  const store = getStore();
  const now = new Date().toISOString();
  const uid = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  switch (termId) {
    case 'service': {
      const svc: Service = {
        id: uid, name: value, description: `Created during onboarding demo`,
        status: 'active', team: store.teams[0]?.name || 'Default', teamId: store.teams[0]?.id || 'team-1',
        escalationPolicy: store.escalationPolicies[0]?.name || 'Default',
        escalationPolicyId: store.escalationPolicies[0]?.id || 'ep-1',
        lastIncident: 'Never', integrationCount: 0, createdAt: now,
      };
      store.services.unshift(svc);
      trackDemoId(uid);
      break;
    }
    case 'incident': {
      const svc = store.services[0];
      const assignee = store.users[0];
      const maxNum = Math.max(...store.incidents.map(i => i.number), 1847);
      const inc: Incident = {
        id: uid, number: maxNum + 1, title: value, status: 'triggered', urgency: 'high',
        service: svc?.name || 'Unknown', serviceId: svc?.id || 'svc-1',
        assignee: assignee?.name || 'You', assigneeId: assignee?.id || 'user-1',
        escalationPolicy: svc?.escalationPolicy || 'Default',
        createdAt: now, updatedAt: now, priority: 'P2',
      };
      store.incidents.unshift(inc);
      trackDemoId(uid);
      break;
    }
    case 'acknowledge': {
      const triggered = store.incidents.find(i => i.status === 'triggered');
      if (triggered) {
        triggered.status = 'acknowledged';
        triggered.updatedAt = now;
      }
      break;
    }
    case 'resolve': {
      const ackd = store.incidents.find(i => i.status === 'acknowledged') ||
                   store.incidents.find(i => i.status === 'triggered');
      if (ackd) {
        ackd.status = 'resolved';
        ackd.updatedAt = now;
      }
      break;
    }
    case 'team': {
      const team: Team = {
        id: uid, name: value, description: 'Created during onboarding demo',
        memberCount: 1, members: [store.users[0]?.id || 'user-1'],
      };
      store.teams.unshift(team);
      trackDemoId(uid);
      break;
    }
    case 'escalation-policy': {
      const ep: EscalationPolicy = {
        id: uid, name: value, description: 'Created during onboarding demo',
        teamId: store.teams[0]?.id || 'team-1',
        rules: [{ level: 1, targets: [store.users[0]?.id || 'user-1'], escalationDelayMinutes: 30 }],
        repeatEnabled: false, numLoops: 0,
      };
      store.escalationPolicies.unshift(ep);
      trackDemoId(uid);
      break;
    }
    case 'schedule':
    case 'on-call': {
      const sched: Schedule = {
        id: uid, name: value, timezone: 'America/Los_Angeles',
        teamId: store.teams[0]?.id || 'team-1',
        users: [store.users[0]?.id || 'user-1', store.users[1]?.id || 'user-2'],
      };
      store.schedules.unshift(sched);
      trackDemoId(uid);
      break;
    }
    case 'integration': {
      const integ: Integration = {
        id: uid, name: `${value} Integration`, type: 'Events API v2',
        serviceId: store.services[0]?.id || 'svc-1', vendor: value, createdAt: now,
      };
      store.integrations.unshift(integ);
      const svc = store.services.find(s => s.id === integ.serviceId);
      if (svc) svc.integrationCount++;
      trackDemoId(uid);
      break;
    }
    case 'workflow': {
      const wf: Workflow = {
        id: uid, name: value, description: 'Created during onboarding demo',
        status: 'active', triggerType: 'incident',
        actions: [{ id: `${uid}-a1`, type: 'Send Notification', package: 'PagerDuty', config: { message: 'Auto-generated' }, order: 1 }],
        teamId: store.teams[0]?.id || 'team-1',
        createdBy: store.users[0]?.id || 'user-1',
        createdAt: now, updatedAt: now, runCount: 0,
      };
      store.workflows.unshift(wf);
      trackDemoId(uid);
      break;
    }
    case 'event-orchestration': {
      const orch: Orchestration = {
        id: uid, name: value, description: 'Created during onboarding demo',
        type: 'global', rules: [{ id: `${uid}-r1`, label: value, conditions: [{ field: 'event.source', operator: 'contains', value: '*' }], actions: [{ type: 'route_to', value: store.services[0]?.id || 'svc-1' }], order: 1, disabled: false }],
        createdAt: now, updatedAt: now,
      };
      store.orchestrations.unshift(orch);
      trackDemoId(uid);
      break;
    }
    case 'business-service': {
      const bs: BusinessService = {
        id: uid, name: value, description: 'Created during onboarding demo',
        owner: store.teams[0]?.name || 'Default', ownerTeamId: store.teams[0]?.id || 'team-1',
        pointOfContact: store.users[0]?.name || 'You', pointOfContactId: store.users[0]?.id || 'user-1',
        status: 'operational', supportingServices: [store.services[0]?.id || 'svc-1'],
        createdAt: now, updatedAt: now,
      };
      store.businessServices.unshift(bs);
      trackDemoId(uid);
      break;
    }
    case 'urgency': {
      const svc = store.services[0];
      if (svc) {
        svc.description = `${svc.description} [Default urgency: ${value}]`;
      }
      break;
    }
    case 'priority': {
      const inc = store.incidents[0];
      if (inc) inc.priority = value;
      break;
    }
    default:
      return false;
  }

  saveStore(store);
  window.dispatchEvent(new CustomEvent('pd-store-updated'));
  return true;
}

export function clearDemoEntries() {
  const raw = localStorage.getItem(DEMO_ENTRIES_KEY);
  if (!raw) return;
  const ids: string[] = JSON.parse(raw);
  if (!ids.length) return;
  const idSet = new Set(ids);
  const store = getStore();

  store.incidents = store.incidents.filter(e => !idSet.has(e.id));
  store.services = store.services.filter(e => !idSet.has(e.id));
  store.teams = store.teams.filter(e => !idSet.has(e.id));
  store.escalationPolicies = store.escalationPolicies.filter(e => !idSet.has(e.id));
  store.schedules = store.schedules.filter(e => !idSet.has(e.id));
  store.integrations = store.integrations.filter(e => !idSet.has(e.id));
  store.workflows = store.workflows.filter(e => !idSet.has(e.id));
  store.orchestrations = store.orchestrations.filter(e => !idSet.has(e.id));
  store.businessServices = store.businessServices.filter(e => !idSet.has(e.id));

  saveStore(store);
  localStorage.removeItem(DEMO_ENTRIES_KEY);
}
