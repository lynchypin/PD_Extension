import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, BookOpen, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { GuidedTourStep } from '../data/onboardingStore';
import { TERMINOLOGY, TERM_DEMO_FIELDS } from '../data/onboardingStore';

interface Props {
  steps: GuidedTourStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

interface TooltipPos {
  top: number;
  left: number;
  arrowSide: 'top' | 'bottom' | 'left' | 'right';
  spotlightRect: DOMRect | null;
}

export default function GuidedTourOverlay({ steps, currentStepIndex, onNext, onPrev, onSkip, onComplete }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pos, setPos] = useState<TooltipPos>({ top: 0, left: 0, arrowSide: 'top', spotlightRect: null });
  const [visible, setVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [fieldValue, setFieldValue] = useState('');
  const [fieldChecked, setFieldChecked] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastNavigatedRef = useRef<string | null>(null);

  const step = steps[currentStepIndex];
  const isLast = currentStepIndex === steps.length - 1;
  const isFirst = currentStepIndex === 0;

  const termEntry = step?.termId ? TERMINOLOGY[step.termId] : null;
  const demoField = step?.termId ? TERM_DEMO_FIELDS[step.termId] : null;
  const fieldFilled = demoField?.type === 'checkbox' ? fieldChecked : fieldValue.trim().length > 0;

  useEffect(() => {
    setFieldValue('');
    setFieldChecked(false);
  }, [currentStepIndex]);

  const positionTooltip = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.targetSelector);
    if (!el) {
      setPos({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 200, arrowSide: 'top', spotlightRect: null });
      setVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const gap = 16;
    const tooltipW = 380;
    const tooltipH = 280;

    let top = 0;
    let left = 0;
    let arrowSide: TooltipPos['arrowSide'] = 'top';

    switch (step.placement) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        arrowSide = 'top';
        break;
      case 'top':
        top = rect.top - tooltipH - gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        arrowSide = 'bottom';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.right + gap;
        arrowSide = 'left';
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.left - tooltipW - gap;
        arrowSide = 'right';
        break;
    }

    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tooltipH - 12));

    setPos({ top, left, arrowSide, spotlightRect: rect });
    setVisible(true);
  }, [step]);

  useEffect(() => {
    if (!step) return;
    if (step.route && location.pathname !== step.route) {
      if (lastNavigatedRef.current === step.route) return;
      setVisible(false);
      setTransitioning(true);
      lastNavigatedRef.current = step.route;
      navigate(step.route);
      return;
    }
    lastNavigatedRef.current = null;
    setTransitioning(false);
    const timer = setTimeout(positionTooltip, 200);
    return () => clearTimeout(timer);
  }, [step, location.pathname, navigate, positionTooltip]);

  useEffect(() => {
    if (!transitioning) return;
    const fallback = setTimeout(() => setTransitioning(false), 2000);
    return () => clearTimeout(fallback);
  }, [transitioning]);

  useEffect(() => {
    const handler = () => positionTooltip();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [positionTooltip]);

  const handleFieldSubmit = () => {
    setFieldValue('');
    setFieldChecked(false);
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleLearnMore = () => {
    window.dispatchEvent(new CustomEvent('pd-open-kb'));
  };

  if (!step) return null;

  if (transitioning) {
    return (
      <div className="fixed inset-0 bg-black/40 z-[9998] flex items-center justify-center transition-opacity">
        <div className="text-white text-sm animate-pulse">Navigating...</div>
      </div>
    );
  }

  const sr = pos.spotlightRect;

  return (
    <>
      <svg className="fixed inset-0 z-[9998]" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {sr && (
              <rect
                x={sr.left - 6}
                y={sr.top - 6}
                width={sr.width + 12}
                height={sr.height + 12}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.35)" mask="url(#tour-mask)" style={{ pointerEvents: 'none' }} />
      </svg>

      {sr && (
        <div
          className="fixed z-[9999] rounded-lg ring-2 ring-[#06ac38] ring-offset-2 pointer-events-none transition-all duration-300"
          style={{
            top: sr.top - 6,
            left: sr.left - 6,
            width: sr.width + 12,
            height: sr.height + 12,
          }}
        />
      )}

      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-[10000] bg-white rounded-xl shadow-2xl border border-gray-200 w-[380px] transition-all duration-300"
          style={{ top: pos.top, left: pos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`absolute w-3 h-3 bg-white border rotate-45 ${
            pos.arrowSide === 'top' ? '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t' :
            pos.arrowSide === 'bottom' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b' :
            pos.arrowSide === 'left' ? '-left-1.5 top-1/2 -translate-y-1/2 border-l border-b' :
            '-right-1.5 top-1/2 -translate-y-1/2 border-r border-t'
          }`} />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#06ac38] rounded-lg flex items-center justify-center">
                  <MapPin size={14} className="text-white" />
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 p-0.5">
                <X size={16} />
              </button>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>

            {termEntry ? (
              <>
                <p className="text-sm text-gray-600 leading-relaxed mb-1">{termEntry.definition}</p>
                <button
                  onClick={handleLearnMore}
                  className="inline-flex items-center gap-1 text-xs text-[#06ac38] hover:text-[#048a2d] font-medium mb-3"
                >
                  <BookOpen size={11} /> Learn more
                </button>

                {demoField && (
                  <div className="mb-4 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
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
              </>
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{step.body}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStepIndex ? 'w-6 bg-[#06ac38]' :
                      i < currentStepIndex ? 'w-1.5 bg-[#06ac38]/40' : 'w-1.5 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button
                    onClick={onPrev}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                {isFirst && (
                  <button
                    onClick={onSkip}
                    className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5"
                  >
                    Skip tour
                  </button>
                )}
                {isLast ? (
                  <button
                    onClick={onComplete}
                    className="flex items-center gap-1.5 text-sm bg-[#06ac38] hover:bg-[#059c32] text-white px-4 py-1.5 rounded-lg font-medium"
                  >
                    <CheckCircle2 size={14} /> Finish
                  </button>
                ) : (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-1.5 text-sm bg-[#06ac38] hover:bg-[#059c32] text-white px-4 py-1.5 rounded-lg font-medium"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}