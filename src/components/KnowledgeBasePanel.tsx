import { useState, useEffect } from 'react';
import { BookOpen, X, ChevronRight, ExternalLink, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { KNOWLEDGE_BASE, TERMINOLOGY } from '../data/onboardingStore';

export default function KnowledgeBasePanel() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  const pathBase = '/' + location.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const article = KNOWLEDGE_BASE[location.pathname] || KNOWLEDGE_BASE[pathBase] || KNOWLEDGE_BASE['/'];
  const relatedTerms = article?.relatedTerms?.map(id => TERMINOLOGY[id]).filter(Boolean) || [];

  useEffect(() => {
    setExpandedSection(null);
    setShowTerms(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('pd-open-kb', handler);
    return () => window.removeEventListener('pd-open-kb', handler);
  }, []);

  if (!article) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[7000] w-14 h-14 bg-[#25352c] hover:bg-[#2d4035] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 group"
          title="Knowledge Base"
        >
          <BookOpen size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#06ac38] rounded-full text-[10px] font-bold flex items-center justify-center">
            ?
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[7000] w-[400px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in">
          <div className="bg-[#25352c] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <BookOpen size={18} />
              <span className="font-semibold text-sm">Knowledge Base</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1 rounded">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 pt-4 pb-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                Current Page
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{article.summary}</p>
            </div>

            <div className="px-5 pb-3">
              {article.sections.map((section, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                    className="w-full flex items-center justify-between py-3 text-left group"
                  >
                    <span className="text-sm font-medium text-gray-800 group-hover:text-[#06ac38]">
                      {section.heading}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`text-gray-400 transition-transform ${expandedSection === i ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {expandedSection === i && (
                    <div className="pb-3 -mt-1">
                      <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {relatedTerms.length > 0 && (
              <div className="px-5 pb-4">
                <button
                  onClick={() => setShowTerms(!showTerms)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 font-medium uppercase tracking-wider mb-2"
                >
                  <HelpCircle size={12} />
                  Related Terms ({relatedTerms.length})
                  <ChevronRight size={12} className={`transition-transform ${showTerms ? 'rotate-90' : ''}`} />
                </button>
                {showTerms && (
                  <div className="space-y-2">
                    {relatedTerms.map((t) => (
                      <div key={t.term} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-800 mb-0.5">{t.term}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{t.definition}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t px-5 py-3 bg-gray-50 flex-shrink-0">
            <a
              href="https://support.pagerduty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#06ac38] transition-colors"
            >
              <ExternalLink size={12} />
              View full PagerDuty documentation
            </a>
          </div>
        </div>
      )}
    </>
  );
}
