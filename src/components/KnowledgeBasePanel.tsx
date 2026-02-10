import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, ExternalLink, HelpCircle, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KNOWLEDGE_BASE, TERMINOLOGY, type KBArticle } from '../data/onboardingStore';

const ALL_ARTICLES = Object.entries(KNOWLEDGE_BASE).reduce<Record<string, KBArticle>>((acc, [path, article]) => {
  if (!acc[article.id]) acc[article.id] = { ...article, _path: path } as KBArticle & { _path: string };
  return acc;
}, {});

export default function KnowledgeBasePanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [browseAll, setBrowseAll] = useState(false);

  const pathBase = '/' + location.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
  const article = KNOWLEDGE_BASE[location.pathname] || KNOWLEDGE_BASE[pathBase] || KNOWLEDGE_BASE['/'];
  const relatedTerms = article?.relatedTerms?.map(id => TERMINOLOGY[id]).filter(Boolean) || [];

  useEffect(() => {
    setShowTerms(false);
    setBrowseAll(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('pd-open-kb', handler);
    return () => window.removeEventListener('pd-open-kb', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const allArticles = Object.values(ALL_ARTICLES) as (KBArticle & { _path?: string })[];

  return createPortal(
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[7000] w-14 h-14 bg-[#25352c] hover:bg-[#2d4035] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group"
          title="Knowledge Base"
        >
          <BookOpen size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#06ac38] rounded-full text-[10px] font-bold flex items-center justify-center shadow">
            ?
          </span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[7000]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30 transition-opacity" />

          <div
            className="absolute top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#25352c] text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Knowledge Base</div>
                  <div className="text-[11px] text-white/60">PagerDuty Concepts & Help</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setBrowseAll(false)}
                className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                  !browseAll ? 'text-[#06ac38] border-b-2 border-[#06ac38] bg-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Current Page
              </button>
              <button
                onClick={() => setBrowseAll(true)}
                className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                  browseAll ? 'text-[#06ac38] border-b-2 border-[#06ac38] bg-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Browse All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!browseAll && article ? (
                <div className="px-6 py-5">
                  <div className="text-[10px] uppercase tracking-widest text-[#06ac38] font-semibold mb-2">
                    {article.id.replace(/-/g, ' ')}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{article.summary}</p>

                  <div className="space-y-5">
                    {article.sections.map((section, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#06ac38]/10 text-[#06ac38] rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          {section.heading}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed ml-7">{section.content}</p>
                      </div>
                    ))}
                  </div>

                  {relatedTerms.length > 0 && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowTerms(!showTerms)}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-wider mb-3"
                      >
                        <HelpCircle size={13} />
                        Related Terminology ({relatedTerms.length})
                        <ChevronRight size={12} className={`transition-transform ${showTerms ? 'rotate-90' : ''}`} />
                      </button>
                      {showTerms && (
                        <div className="space-y-2">
                          {relatedTerms.map((t) => (
                            <div key={t.term} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                              <div className="text-xs font-semibold text-blue-900 mb-0.5">{t.term}</div>
                              <div className="text-xs text-blue-700/70 leading-relaxed">{t.definition}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : browseAll ? (
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">All Topics</h3>
                  <div className="space-y-2">
                    {allArticles.map((a) => {
                      const targetPath = Object.entries(KNOWLEDGE_BASE).find(([, v]) => v.id === a.id)?.[0];
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            if (targetPath) navigate(targetPath);
                            setBrowseAll(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                            article?.id === a.id
                              ? 'border-[#06ac38] bg-green-50'
                              : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900">{a.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.summary}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  No article available for this page.
                </div>
              )}
            </div>

            <div className="border-t px-6 py-3 bg-gray-50 flex-shrink-0">
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
        </div>
      )}
    </>,
    document.body
  );
}