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
import MyWorldPage from './pages/MyWorldPage';
import GuidedTourOverlay from './components/GuidedTourOverlay';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import { TermFlowProvider } from './components/TermFlowContext';
import {
  getOnboarding, saveOnboarding, resetOnboarding,
  ADMIN_TOUR_STEPS, USER_TOUR_STEPS,
  type OnboardingState, type OnboardingRole, type AdminPath, type UserPath,
} from './data/onboardingStore';

function App() {
  const [onboarding, setOnboarding] = useState<OnboardingState>(getOnboarding);

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
      <TermFlowProvider>
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
