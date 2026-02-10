import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import IncidentsPage from './pages/IncidentsPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import ServiceDirectoryPage from './pages/ServiceDirectoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AddIntegrationPage from './pages/AddIntegrationPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';
import OrchestrationListPage from './pages/OrchestrationListPage';
import OrchestrationDetailPage from './pages/OrchestrationDetailPage';
import OperationsConsolePage from './pages/OperationsConsolePage';
import BusinessServicesPage from './pages/BusinessServicesPage';
import ServiceGraphPage from './pages/ServiceGraphPage';
import PlaceholderPage from './pages/PlaceholderPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import AdminSetupPage from './pages/AdminSetupPage';
import UserSetupWizard from './pages/UserSetupWizard';
import MyWorldPage from './pages/MyWorldPage';
import {
  getOnboarding, saveOnboarding, resetOnboarding,
  type OnboardingState, type OnboardingRole,
} from './data/onboardingStore';

function App() {
  const [onboarding, setOnboarding] = useState<OnboardingState>(getOnboarding);

  const updateOnboarding = useCallback((state: OnboardingState) => {
    setOnboarding(state);
    saveOnboarding(state);
  }, []);

  const selectRole = useCallback((role: OnboardingRole) => {
    const next = { ...onboarding, role, started: true };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const finishOnboarding = useCallback(() => {
    const next = { ...onboarding, dismissed: true };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const handleReset = useCallback(() => {
    const fresh = resetOnboarding();
    setOnboarding(fresh);
  }, []);

  if (!onboarding.role) {
    return <RoleSelectionPage onSelect={selectRole} />;
  }

  if (onboarding.role === 'admin' && !onboarding.dismissed) {
    return <AdminSetupPage state={onboarding} onUpdate={updateOnboarding} onFinish={finishOnboarding} />;
  }

  if (onboarding.role === 'user' && !onboarding.dismissed) {
    return <UserSetupWizard state={onboarding} onUpdate={updateOnboarding} onFinish={finishOnboarding} />;
  }

  const homePath = onboarding.role === 'user' ? '/my-world' : '/';

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout onboardingRole={onboarding.role} onReset={handleReset} />}>
          {onboarding.role === 'user' ? (
            <Route path="/" element={<Navigate to="/my-world" replace />} />
          ) : (
            <Route path="/" element={<IncidentsPage />} />
          )}
          <Route path="/my-world" element={<MyWorldPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:incidentId" element={<IncidentsPage />} />
          <Route path="/operations" element={<OperationsConsolePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/services" element={<ServiceDirectoryPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/services/:serviceId/integrations/add" element={<AddIntegrationPage />} />
          <Route path="/service-graph" element={<ServiceGraphPage />} />
          <Route path="/business-services" element={<BusinessServicesPage />} />
          <Route path="/automation/workflows" element={<WorkflowsPage />} />
          <Route path="/automation/workflows/new" element={<WorkflowBuilderPage />} />
          <Route path="/automation/workflows/:workflowId" element={<WorkflowBuilderPage />} />
          <Route path="/automation/orchestration" element={<OrchestrationListPage />} />
          <Route path="/automation/orchestration/:orchestrationId" element={<OrchestrationDetailPage />} />
          <Route path="/alerts" element={<PlaceholderPage />} />
          <Route path="/teams" element={<PlaceholderPage />} />
          <Route path="/automation/rundeck" element={<PlaceholderPage />} />
          <Route path="/oncall" element={<PlaceholderPage />} />
          <Route path="/escalation-policies" element={<PlaceholderPage />} />
          <Route path="/schedules" element={<PlaceholderPage />} />
          <Route path="/analytics" element={<PlaceholderPage />} />
          <Route path="/integrations" element={<PlaceholderPage />} />
          <Route path="/status" element={<PlaceholderPage />} />
          <Route path="/aiops" element={<PlaceholderPage />} />
          <Route path="/response-plays" element={<PlaceholderPage />} />
          <Route path="/settings" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
