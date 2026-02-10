import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getTermFlowState, saveTermFlowState, ROUTE_TERM_SEQUENCES,
  type TermFlowState,
} from '../data/onboardingStore';

interface TermFlowContextValue {
  activeTermId: string | null;
  openTermId: string | null;
  isFirstLogin: boolean;
  advanceTerm: (termId: string) => void;
  requestOpen: (termId: string) => void;
  requestClose: (termId: string) => void;
}

const TermFlowContext = createContext<TermFlowContextValue>({
  activeTermId: null,
  openTermId: null,
  isFirstLogin: false,
  advanceTerm: () => {},
  requestOpen: () => {},
  requestClose: () => {},
});

export function useTermFlow() {
  return useContext(TermFlowContext);
}

export function TermFlowProvider({ children, tourActive }: { children: React.ReactNode; tourActive?: boolean }) {
  const location = useLocation();
  const [flowState, setFlowState] = useState<TermFlowState>(getTermFlowState);
  const [openTermId, setOpenTermId] = useState<string | null>(null);
  const tourWasActive = useRef(!!tourActive);

  const persist = useCallback((next: TermFlowState) => {
    setFlowState(next);
    saveTermFlowState(next);
  }, []);

  const pathBase = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return '/';
    if (parts[0] === 'users' && parts[1]) return '/users';
    if (parts[0] === 'services' && parts[1]) return '/services';
    return '/' + parts.join('/');
  }, [location.pathname]);

  const sequence = ROUTE_TERM_SEQUENCES[pathBase] || [];

  const activeTermId = useMemo(() => {
    if (flowState.completed) return null;
    for (const termId of sequence) {
      if (!flowState.shownTerms.includes(termId)) {
        return termId;
      }
    }
    return null;
  }, [flowState.completed, flowState.shownTerms, sequence]);

  useEffect(() => {
    if (tourActive) {
      tourWasActive.current = true;
      return;
    }
    if (tourWasActive.current) {
      tourWasActive.current = false;
      return;
    }
    if (activeTermId && !flowState.completed) {
      const timer = setTimeout(() => setOpenTermId(activeTermId), 350);
      return () => clearTimeout(timer);
    }
  }, [activeTermId, flowState.completed, tourActive]);

  useEffect(() => {
    setOpenTermId(null);
  }, [location.pathname]);

  const advanceTerm = useCallback((termId: string) => {
    setFlowState(prev => {
      if (prev.shownTerms.includes(termId)) return prev;
      const next: TermFlowState = {
        ...prev,
        shownTerms: [...prev.shownTerms, termId],
      };
      saveTermFlowState(next);
      return next;
    });
    setOpenTermId(null);
  }, []);

  const requestOpen = useCallback((termId: string) => {
    setOpenTermId(termId);
  }, []);

  const requestClose = useCallback((termId: string) => {
    setOpenTermId(prev => prev === termId ? null : prev);
  }, []);

  useEffect(() => {
    if (flowState.completed) return;
    const allRoutes = Object.values(ROUTE_TERM_SEQUENCES);
    const allTermIds = new Set(allRoutes.flat());
    const allShown = [...allTermIds].every(t => flowState.shownTerms.includes(t));
    if (allShown) {
      persist({ ...flowState, completed: true });
    }
  }, [flowState, persist]);

  const value = useMemo<TermFlowContextValue>(() => ({
    activeTermId,
    openTermId,
    isFirstLogin: !flowState.completed,
    advanceTerm,
    requestOpen,
    requestClose,
  }), [activeTermId, openTermId, flowState.completed, advanceTerm, requestOpen, requestClose]);

  return (
    <TermFlowContext.Provider value={value}>
      {children}
    </TermFlowContext.Provider>
  );
}
