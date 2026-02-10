import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, EyeOff, Check } from 'lucide-react';
import { TERMINOLOGY, TERM_DEMO_FIELDS, getDismissedTerms, dismissTerm } from '../data/onboardingStore';
import { addDemoEntry } from '../data/store';
import { useTermFlow } from './TermFlowContext';

interface Props {
  termId: string;
  children: React.ReactNode;
  inline?: boolean;
}

export default function TermTooltip({ termId, children, inline }: Props) {
  const [dismissed, setDismissed] = useState<'once' | 'forever' | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [fieldChecked, setFieldChecked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const entry = TERMINOLOGY[termId];
  const demoField = TERM_DEMO_FIELDS[termId];
  const { openTermId, activeTermId, isFirstLogin, advanceTerm, requestOpen, requestClose } = useTermFlow();

  const isOpen = openTermId === termId;
  const isActiveFlowStep = isFirstLogin && activeTermId === termId;

  useEffect(() => {
    const d = getDismissedTerms();
    if (d[termId]) setDismissed(d[termId]);
  }, [termId]);

  if (!entry || dismissed === 'forever') {
    return <>{children}</>;
  }

  const handleClose = () => {
    requestClose(termId);
    if (isActiveFlowStep) {
      advanceTerm(termId);
    }
  };

  const handleDismiss = (mode: 'once' | 'forever') => {
    dismissTerm(termId, mode);
    setDismissed(mode);
    requestClose(termId);
    if (isFirstLogin) {
      advanceTerm(termId);
    }
  };

  const handleFieldSubmit = () => {
    if (demoField) {
      const val = demoField.type === 'checkbox' ? 'true' : fieldValue.trim();
      if (val) addDemoEntry(termId, val);
    }
    requestClose(termId);
    if (isFirstLogin) {
      advanceTerm(termId);
    }
    setFieldValue('');
    setFieldChecked(false);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOpen) {
      requestClose(termId);
    } else {
      requestOpen(termId);
    }
  };

  const fieldFilled = demoField?.type === 'checkbox' ? fieldChecked : fieldValue.trim().length > 0;

  return (
    <span ref={ref} className={`relative ${inline ? 'inline' : 'inline-flex items-center'}`}>
      {children}
      {dismissed !== 'once' && (
        <span
          role="button"
          tabIndex={0}
          onClick={handleIconClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleIconClick(e as unknown as React.MouseEvent); }}
          className={`inline-flex items-center ml-1 transition-colors align-middle cursor-pointer ${
            isActiveFlowStep
              ? 'text-[#06ac38] animate-pulse'
              : isOpen
                ? 'text-[#06ac38]'
                : 'text-gray-400 hover:text-[#06ac38]'
          }`}
          title={`What is "${entry.term}"?`}
        >
          <HelpCircle size={13} />
        </span>
      )}

      {isOpen && (
        <div
          className={`absolute z-[8000] bg-white rounded-xl shadow-xl border w-80 left-0 mt-1 ${
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

            {demoField && (
              <div className="mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Try it: {demoField.label}
                </label>
                {demoField.type === 'text' && (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      placeholder={demoField.placeholder}
                      className="flex-1 text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#06ac38] focus:border-[#06ac38]"
                      onKeyDown={(e) => { if (e.key === 'Enter' && fieldFilled) handleFieldSubmit(); }}
                    />
                    <button
                      onClick={handleFieldSubmit}
                      disabled={!fieldFilled}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                        fieldFilled
                          ? 'bg-[#06ac38] text-white hover:bg-[#059c32]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Check size={12} />
                    </button>
                  </div>
                )}
                {demoField.type === 'select' && (
                  <div className="flex gap-1.5">
                    <select
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="flex-1 text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#06ac38] focus:border-[#06ac38] bg-white"
                    >
                      <option value="">{demoField.placeholder}</option>
                      {demoField.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <button
                      onClick={handleFieldSubmit}
                      disabled={!fieldFilled}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                        fieldFilled
                          ? 'bg-[#06ac38] text-white hover:bg-[#059c32]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Check size={12} />
                    </button>
                  </div>
                )}
                {demoField.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fieldChecked}
                      onChange={(e) => {
                        setFieldChecked(e.target.checked);
                        if (e.target.checked) {
                          setTimeout(handleFieldSubmit, 400);
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#06ac38] focus:ring-[#06ac38]"
                    />
                    <span className="text-xs text-gray-700">Enable</span>
                  </label>
                )}
              </div>
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
