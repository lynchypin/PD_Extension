import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, EyeOff } from 'lucide-react';
import { TERMINOLOGY, getDismissedTerms, dismissTerm } from '../data/onboardingStore';

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

  const entry = TERMINOLOGY[termId];

  useEffect(() => {
    const d = getDismissedTerms();
    if (d[termId]) setDismissed(d[termId]);
  }, [termId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!entry || dismissed === 'forever') {
    return <>{children}</>;
  }

  const handleDismiss = (mode: 'once' | 'forever') => {
    dismissTerm(termId, mode);
    setDismissed(mode);
    setOpen(false);
  };

  return (
    <span ref={ref} className={`relative ${inline ? 'inline' : 'inline-flex items-center'}`}>
      {children}
      {dismissed !== 'once' && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(!open); }}
          className="inline-flex items-center ml-1 text-gray-400 hover:text-[#06ac38] transition-colors align-middle"
          title={`What is "${entry.term}"?`}
        >
          <HelpCircle size={13} />
        </button>
      )}

      {open && (
        <div
          ref={popRef}
          className="absolute z-[8000] bg-white rounded-xl shadow-xl border border-gray-200 w-72 left-0 mt-1"
          style={{ top: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <HelpCircle size={12} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Terminology</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{entry.term}</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">{entry.definition}</p>
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
