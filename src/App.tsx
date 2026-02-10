import { useState, useCallback, useEffect } from 'react';
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
import RoleSelectionPage from './pages/RoleSelectionPage';
import MyWorldPage from './pages/MyWorldPage';
import AlertsPage from './pages/AlertsPage';
import TeamsPage from './pages/TeamsPage';
import OnCallPage from './pages/OnCallPage';
import EscalationPoliciesPage from './pages/EscalationPoliciesPage';
import SchedulesPage from './pages/SchedulesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationsListPage from './pages/IntegrationsListPage';
import StatusPage from './pages/StatusPage';
import AIOpsPage from './pages/AIOpsPage';
import ResponsePlaysPage from './pages/ResponsePlaysPage';
import SettingsPage from './pages/SettingsPage';
import RundeckPage from './pages/RundeckPage';
import GuidedTourOverlay from './components/GuidedTourOverlay';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import { TermFlowProvider } from './components/TermFlowContext';
import {
  getOnboarding, saveOnboarding, resetOnboarding,
  ADMIN_TOUR_STEPS, USER_TOUR_STEPS,
  type OnboardingState, type OnboardingRole, type AdminPath, type UserPath,
} from './data/onboardingStore';
import { clearDemoEntries, resetStore } from './data/store';

function App() {
  const [onboarding, setOnboarding] = useState<OnboardingState>(getOnboarding);
  const [, setStoreVersion] = useState(0);

  useEffect(() => {
    const onStoreUpdate = () => setStoreVersion(v => v + 1);
    window.addEventListener('pd-store-updated', onStoreUpdate);
    const onUnload = () => clearDemoEntries();
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('pd-store-updated', onStoreUpdate);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  const updateOnboarding = useCallback((state: OnboardingState) => {
    setOnboarding(state);
    saveOnboarding(state);
  }, []);

  const selectRole = useCallback((role: OnboardingRole, adminPath?: AdminPath, userPath?: UserPath) => {
    const tourId = role === 'admin'
      ? (adminPath || 'full-setup')
      : (userPath || 'responder');

    const next: OnboardingState = {
      ...onboarding,
      role,
      adminPath: adminPath || null,
      userPath: userPath || null,
      started: true,
      dismissed: true,
      guidedTour: {
        active: true,
        tourId,
        currentStepIndex: 0,
        completedTours: [...onboarding.guidedTour.completedTours],
      },
    };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const handleReset = useCallback(() => {
    resetStore();
    const fresh = resetOnboarding();
    setOnboarding(fresh);
  }, []);

  const tourSteps = (() => {
    const tour = onboarding.guidedTour;
    if (!tour.active || !tour.tourId) return null;
    const adminSteps = ADMIN_TOUR_STEPS[tour.tourId];
    if (adminSteps) return adminSteps;
    const userSteps = USER_TOUR_STEPS[tour.tourId];
    if (userSteps) return userSteps;
    return null;
  })();

  const handleTourNext = useCallback(() => {
    const next = { ...onboarding };
    next.guidedTour = { ...next.guidedTour, currentStepIndex: next.guidedTour.currentStepIndex + 1 };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const handleTourPrev = useCallback(() => {
    const next = { ...onboarding };
    next.guidedTour = { ...next.guidedTour, currentStepIndex: Math.max(0, next.guidedTour.currentStepIndex - 1) };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const handleTourSkip = useCallback(() => {
    const next = { ...onboarding };
    next.guidedTour = { ...next.guidedTour, active: false };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  const handleTourComplete = useCallback(() => {
    const next = { ...onboarding };
    const tourId = next.guidedTour.tourId;
    next.guidedTour = {
      active: false,
      tourId: null,
      currentStepIndex: 0,
      completedTours: tourId ? [...next.guidedTour.completedTours, tourId] : next.guidedTour.completedTours,
    };
    updateOnboarding(next);
  }, [onboarding, updateOnboarding]);

  if (!onboarding.role) {
    return <RoleSelectionPage onSelect={selectRole} />;
  }

  return (
    <HashRouter>
      <TermFlowProvider tourActive={!!(tourSteps && onboarding.guidedTour.active)}>
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
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/automation/rundeck" element={<RundeckPage />} />
            <Route path="/oncall" element={<OnCallPage />} />
            <Route path="/escalation-policies" element={<EscalationPoliciesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/integrations" element={<IntegrationsListPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/aiops" element={<AIOpsPage />} />
            <Route path="/response-plays" element={<ResponsePlaysPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>

        {tourSteps && onboarding.guidedTour.active && (
          <GuidedTourOverlay
            steps={tourSteps}
            currentStepIndex={onboarding.guidedTour.currentStepIndex}
            onNext={handleTourNext}
            onPrev={handleTourPrev}
            onSkip={handleTourSkip}
            onComplete={handleTourComplete}
          />
        )}

        <KnowledgeBasePanel />
      </TermFlowProvider>
    </HashRouter>
  );
}

export default App;
