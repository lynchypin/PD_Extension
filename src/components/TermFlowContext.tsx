import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getTermFlowState, saveTermFlowState, ROUTE_TERM_SEQUENCES,
  type TermFlowState,
} from '../data/onboardingStore';

interface TermFlowContextValue {
  activeTermId: string | null;
  isFirstLogin: boolean;
  advanceTerm: (termId: string) => void;
}

const TermFlowContext = createContext<TermFlowContextValue>({
  activeTermId: null,
  isFirstLogin: false,
  advanceTerm: () => {},
});

export function useTermFlow() {
  return useContext(TermFlowContext);
}

export function TermFlowProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [flowState, setFlowState] = useState<TermFlowState>(getTermFlowState);

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
    isFirstLogin: !flowState.completed,
    advanceTerm,
  }), [activeTermId, flowState.completed, advanceTerm]);

  return (
    <TermFlowContext.Provider value={value}>
      {children}
    </TermFlowContext.Provider>
  );
}
