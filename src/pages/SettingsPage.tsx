import { useState } from 'react';
import { Settings, Key, Shield, CreditCard, Globe, Users, Bell, Lock, ChevronRight, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';

const TABS = ['General', 'API Access', 'SSO & Security', 'Notifications', 'Billing'] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('General');
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your PagerDuty account configuration.</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 flex-shrink-0 space-y-0.5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${activeTab === tab ? 'bg-[#06ac38]/10 text-[#06ac38] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-2xl">
          {activeTab === 'General' && (
            <div className="space-y-6">
              <Section title="Account Details" icon={<Settings size={16} />}>
                <Field label="Account Name" value="Acme Corp Engineering" />
                <Field label="Account Subdomain" value="acme-corp" suffix=".pagerduty.com" />
                <Field label="Account Owner" value="Sarah Chen (sarah.chen@example.com)" />
                <Field label="Time Zone" value="America/Los_Angeles (PST)" />
                <Field label="Date Format" value="MM/DD/YYYY" />
              </Section>

              <Section title="Account Limits" icon={<Users size={16} />}>
                <div className="grid grid-cols-3 gap-4">
                  <LimitCard label="Users" used={8} total={50} />
                  <LimitCard label="Services" used={10} total={100} />
                  <LimitCard label="Integrations" used={10} total={200} />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'API Access' && (
            <div className="space-y-6">
              <Section title="API Keys" icon={<Key size={16} />}>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">REST API Key</div>
                      <div className="text-xs text-gray-500">Full access to the PagerDuty REST API v2</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowKey(!showKey)} className="text-gray-400 hover:text-gray-600">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600"><Copy size={14} /></button>
                    </div>
                  </div>
                  <code className="text-xs bg-white border rounded px-2 py-1.5 block font-mono text-gray-700">
                    {showKey ? 'u+bGxpYWJsZV9rZXlfZXhhbXBsZV8xMjM0NTY3ODkw' : '••••••••••••••••••••••••••••••••••••'}
                  </code>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Events API v2 Integration Key</div>
                      <div className="text-xs text-gray-500">Used to send events directly to the Events API</div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><Copy size={14} /></button>
                  </div>
                  <code className="text-xs bg-white border rounded px-2 py-1.5 block font-mono text-gray-700 mt-2">
                    R0XXXXXXXXXXXXXXXXXXXXXX
                  </code>
                </div>
              </Section>

              <Section title="Webhooks" icon={<Globe size={16} />}>
                <div className="text-sm text-gray-600 mb-3">Configure webhooks to receive HTTP callbacks when events occur in your account.</div>
                <button className="text-sm text-[#06ac38] hover:text-[#048a2d] font-medium flex items-center gap-1">
                  Add Webhook Endpoint <ExternalLink size={12} />
                </button>
              </Section>
            </div>
          )}

          {activeTab === 'SSO & Security' && (
            <div className="space-y-6">
              <Section title="Single Sign-On" icon={<Lock size={16} />}>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <div className="text-sm font-medium text-gray-900">SAML 2.0 SSO</div>
                    <div className="text-xs text-gray-500">Not configured</div>
                  </div>
                  <button className="text-sm text-[#06ac38] font-medium">Configure</button>
                </div>
              </Section>

              <Section title="Security Settings" icon={<Shield size={16} />}>
                <ToggleRow label="Require two-factor authentication" description="All users must have 2FA enabled" enabled={true} />
                <ToggleRow label="Session timeout" description="Auto-logout after 30 minutes of inactivity" enabled={true} />
                <ToggleRow label="IP allowlist" description="Restrict access to specific IP ranges" enabled={false} />
                <ToggleRow label="Audit logging" description="Track all user actions for compliance" enabled={true} />
              </Section>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <Section title="Default Notification Rules" icon={<Bell size={16} />}>
                <div className="space-y-2">
                  <NotifRule method="Push notification" delay="Immediately" />
                  <NotifRule method="Email" delay="After 1 minute" />
                  <NotifRule method="SMS" delay="After 5 minutes" />
                  <NotifRule method="Phone call" delay="After 10 minutes" />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div className="space-y-6">
              <Section title="Current Plan" icon={<CreditCard size={16} />}>
                <div className="bg-[#06ac38]/5 border border-[#06ac38]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Business Plan</div>
                      <div className="text-sm text-gray-500">8 full users · 1 stakeholder</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">$399<span className="text-sm font-normal text-gray-500">/mo</span></div>
                      <div className="text-xs text-gray-400">Billed annually</div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">{icon} {title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}{suffix && <span className="text-gray-400">{suffix}</span>}</span>
    </div>
  );
}

function LimitCard({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = (used / total) * 100;
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-lg font-bold text-gray-900">{used}<span className="text-sm text-gray-400">/{total}</span></div>
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-[#06ac38] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ToggleRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <div className="text-sm text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${enabled ? 'bg-[#06ac38]' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
      </div>
    </div>
  );
}

function NotifRule({ method, delay }: { method: string; delay: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-700">{method}</span>
      <span className="text-xs text-gray-500">{delay}</span>
    </div>
  );
}