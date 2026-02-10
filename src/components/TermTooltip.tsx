import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, EyeOff, ChevronRight } from 'lucide-react';
import { TERMINOLOGY, getDismissedTerms, dismissTerm } from '../data/onboardingStore';
import { useTermFlow } from './TermFlowContext';

interface Props {
  termId: string;
  children: React.ReactNode;
  inline?: boolean;
}

export default function TermTooltip({ termId, children, inline }: Props) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<'once' | 'forever' | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const hasAutoOpened = useRef(false);

  const entry = TERMINOLOGY[termId];
  const { activeTermId, isFirstLogin, advanceTerm } = useTermFlow();
  const isActiveFlowStep = isFirstLogin && activeTermId === termId;

  useEffect(() => {
    const d = getDismissedTerms();
    if (d[termId]) setDismissed(d[termId]);
  }, [termId]);

  useEffect(() => {
    if (isActiveFlowStep && !hasAutoOpened.current && dismissed !== 'forever') {
      hasAutoOpened.current = true;
      const timer = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(timer);
    }
  }, [isActiveFlowStep, dismissed]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          popRef.current && !popRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!entry || dismissed === 'forever') {
    return <>{children}</>;
  }

  const handleClose = () => {
    setOpen(false);
    if (isActiveFlowStep) {
      advanceTerm(termId);
    }
  };

  const handleDismiss = (mode: 'once' | 'forever') => {
    dismissTerm(termId, mode);
    setDismissed(mode);
    setOpen(false);
    if (isFirstLogin) {
      advanceTerm(termId);
    }
  };

  return (
    <span ref={ref} className={`relative ${inline ? 'inline' : 'inline-flex items-center'}`}>
      {children}
      {dismissed !== 'once' && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(!open); }}
          className={`inline-flex items-center ml-1 transition-colors align-middle ${
            isActiveFlowStep
              ? 'text-[#06ac38] animate-pulse'
              : 'text-gray-400 hover:text-[#06ac38]'
          }`}
          title={`What is "${entry.term}"?`}
        >
          <HelpCircle size={13} />
        </button>
      )}

      {open && (
        <div
          ref={popRef}
          className={`absolute z-[8000] bg-white rounded-xl shadow-xl border w-72 left-0 mt-1 ${
            isActiveFlowStep ? 'border-[#06ac38] ring-1 ring-[#06ac38]/20' : 'border-gray-200'
          }`}
          style={{ top: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  isActiveFlowStep ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <HelpCircle size={12} className={isActiveFlowStep ? 'text-[#06ac38]' : 'text-blue-600'} />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  isActiveFlowStep ? 'text-[#06ac38]' : 'text-blue-600'
                }`}>
                  {isActiveFlowStep ? 'Quick Tip' : 'Terminology'}
                </span>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{entry.term}</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">{entry.definition}</p>

            {isActiveFlowStep && (
              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-1 text-xs bg-[#06ac38] hover:bg-[#059c32] text-white rounded-lg py-1.5 mb-2 font-medium"
              >
                Got it <ChevronRight size={12} />
              </button>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleDismiss('once')}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600"
              >
                <X size={10} /> Dismiss
              </button>
              <button
                onClick={() => handleDismiss('forever')}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500"
              >
                <EyeOff size={10} /> Don't show again
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
