
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileDown, ChevronRight, ReceiptText, Sparkles, Home as HomeIcon, User, BookOpen, Edit3, Scan, FileSearch, X, Calendar, CheckCircle2, Circle, Trash2, AlertTriangle } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { generateHomeTaxExcel } from '../utils/hometax';
import { Logo } from '../components/Logo';
import { Card } from '../components/Card';

interface HomeProps {
  drafts: InvoiceDraft[];
  deleteDraft: (id: string) => void;
  onSave: (draft: InvoiceDraft) => void;
}

export const Home: React.FC<HomeProps> = ({ drafts, deleteDraft, onSave }) => {
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStep, setExportStep] = useState<'period' | 'selection'>('period');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  const [customRange, setCustomRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const hasDrafts = drafts.length > 0;
  const totalAmount = drafts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteDraft(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const getFilteredDrafts = (mode: 'all' | 'thisMonth' | 'lastMonth' | 'custom') => {
    const now = new Date();
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    if (mode === 'thisMonth') return drafts.filter(d => d.issueDate?.startsWith(thisMonthStr));
    if (mode === 'lastMonth') return drafts.filter(d => d.issueDate?.startsWith(lastMonthStr));
    if (mode === 'custom') {
      return drafts.filter(d => d.issueDate && d.issueDate >= customRange.start && d.issueDate <= customRange.end);
    }
    return drafts;
  };

  const [currentFilterMode, setCurrentFilterMode] = useState<'all' | 'thisMonth' | 'lastMonth' | 'custom'>('all');
  const filteredDrafts = useMemo(() => getFilteredDrafts(currentFilterMode), [drafts, currentFilterMode, customRange]);

  const openSelectionStep = (mode: 'all' | 'thisMonth' | 'lastMonth' | 'custom') => {
    const targetDrafts = getFilteredDrafts(mode);
    if (targetDrafts.length === 0) {
      alert('그 기간에는 쓴 장부가 없네요.');
      return;
    }
    setCurrentFilterMode(mode);
    setSelectedIds(targetDrafts.map(d => d.id));
    setExportStep('selection');
  };

  const handleFinalExport = () => {
    const toExport = drafts.filter(d => selectedIds.includes(d.id));
    if (toExport.length === 0) {
      alert('내보낼 장부를 선택해 주세요.');
      return;
    }
    generateHomeTaxExcel(toExport);
    setIsExportModalOpen(false);
    setExportStep('period');
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-[#F9FAFB] pb-44">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-24 flex items-center shadow-sm">
        <Logo size={24} showTagline={true} />
      </header>

      <main className="px-6 pt-8 space-y-12">
        {!hasDrafts ? (
          <section className="py-10 space-y-6">
            <div className="px-1 text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">세금계산서 장부 만들기</h1>
              <p className="text-gray-500 text-[15px] font-bold leading-relaxed italic">아직 적어둔 내역이 없네요.<br/>첫 번째 장부를 지금 바로 만들어보세요.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => navigate('/upload')} className="flex items-center gap-6 bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-left group">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shrink-0"><Scan size={32} /></div>
                <div><span className="font-black text-[20px] block mb-1">사진으로 장부 만들기</span><span className="text-[12px] font-bold opacity-70">명세표를 찍으면 비서가 대신 적어줘요</span></div>
              </button>
              <button onClick={() => navigate('/draft/new')} className="flex items-center gap-6 bg-white p-8 rounded-[40px] text-gray-900 border-2 border-gray-100 shadow-sm active:scale-95 transition-all text-left group">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0"><Edit3 size={32} className="text-gray-400" /></div>
                <div><span className="font-black text-[20px] block mb-1">직접 손으로 쓰기</span><span className="text-[12px] font-bold text-gray-400">빈 종이에 내용을 직접 입력해요</span></div>
              </button>
            </div>
          </section>
        ) : (
          <>
            <section>
              <div className="mb-4 px-1"><h1 className="text-xl font-black text-gray-900 tracking-tight">이번 달 장부 정산</h1></div>
              <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden !p-0">
                <div className="p-8 pb-6 relative z-10">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles size={14} className="text-blue-500 fill-blue-500" />
                    <span className="text-[13px] font-black text-blue-500 tracking-tight">받아야 할 총 금액 (세액 포함)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(totalAmount)}</h2>
                    <span className="text-xl font-bold text-gray-400">원</span>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-2 relative z-10">
                   <button onClick={() => { setExportStep('period'); setIsExportModalOpen(true); }} className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-black/10 hover:bg-black">
                    <FileDown size={18} /> 홈택스용 엑셀파일 받기
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full -mr-16 -mt-16 blur-3xl" />
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-[17px] font-black text-gray-900">최근 쓴 장부들</h2>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{drafts.length}건</span>
              </div>
              <div className="space-y-3">
                {drafts.slice(0, 5).map((draft) => (
                  <div key={draft.id} className="relative group">
                    <Card onClick={() => navigate(`/draft/${draft.id}`)} className="!p-5 hover:border-blue-200 transition-all border-gray-100 shadow-sm pr-16">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><ReceiptText size={20} /></div>
                          <div>
                            <h3 className="font-black text-gray-900 text-[15px] truncate max-w-[120px]">{draft.buyer.name || '거래처명 없음'}</h3>
                            <p className="text-[11px] font-bold text-gray-300">{draft.issueDate?.replace(/-/g, '.')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-gray-900 text-[16px]">{formatCurrency(draft.totalAmount)}원</p>
                          <ChevronRight size={16} className="text-gray-200" />
                        </div>
                      </div>
                    </Card>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteTargetId(draft.id); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 active:bg-red-100 transition-all shadow-sm border border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* 엑셀 발급 모달 */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-xl bg-white rounded-[40px] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-3">
                {exportStep === 'selection' && (
                  <button onClick={() => setExportStep('period')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900"><ChevronRight size={24} className="rotate-180" /></button>
                )}
                <h3 className="text-xl font-black text-gray-900">{exportStep === 'period' ? '언제 쓴 장부인가요?' : '내용이 맞는지 확인하세요'}</h3>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900"><X size={28} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {exportStep === 'period' ? (
                <div className="space-y-4 pb-4">
                  <ExportOption title="이번 달 장부" subtitle="최근에 작성한 내역" count={getFilteredDrafts('thisMonth').length} onClick={() => openSelectionStep('thisMonth')} icon={<Calendar size={20} className="text-blue-500" />} highlight />
                  <ExportOption title="지난 달 장부" subtitle="한 달 전 작성한 내역" count={getFilteredDrafts('lastMonth').length} onClick={() => openSelectionStep('lastMonth')} icon={<Calendar size={20} className="text-gray-400" />} />
                  <ExportOption title="전체 장부" subtitle="지금까지 쓴 모든 내역" count={drafts.length} onClick={() => openSelectionStep('all')} icon={<FileDown size={20} className="text-gray-400" />} />
                </div>
              ) : (
                <div className="space-y-2 pb-6">
                  <p className="text-[12px] font-bold text-gray-400 mb-4 px-2 italic">홈택스에 올릴 항목만 체크해 주세요.</p>
                  {filteredDrafts.map((d) => (
                    <div key={d.id} onClick={() => toggleSelection(d.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedIds.includes(d.id) ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-50 opacity-60'}`}>
                      <div className="shrink-0">{selectedIds.includes(d.id) ? <CheckCircle2 className="text-blue-500" /> : <Circle className="text-gray-200" />}</div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[14px] font-black text-gray-900 truncate">{d.buyer.name || '거래처명 없음'}</p>
                        <p className="text-[10px] font-bold text-gray-400">{d.issueDate} • {formatCurrency(d.totalAmount)}원</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-6 shrink-0 flex gap-3">
              <button onClick={() => setIsExportModalOpen(false)} className="flex-1 h-16 bg-gray-100 text-gray-500 rounded-2xl font-black text-[15px] active:scale-95 transition-all">닫기</button>
              {exportStep === 'selection' && (
                <button onClick={handleFinalExport} className="flex-[2] h-16 bg-blue-600 text-white rounded-2xl font-black text-[15px] active:scale-95 transition-all shadow-lg shadow-blue-500/20">{selectedIds.length}건 엑셀 파일 받기</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[30px] flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">정말 지우시겠습니까?</h3>
            <p className="text-[15px] font-bold text-gray-500 leading-relaxed mb-10 italic">삭제된 장부 내역은 다시 되돌릴 수 없습니다.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteTargetId(null)} className="flex-1 h-16 bg-gray-100 text-gray-500 rounded-2xl font-black text-[16px] active:scale-95 transition-all">취소</button>
              <button onClick={confirmDelete} className="flex-[1.5] h-16 bg-red-500 text-white rounded-2xl font-black text-[16px] active:scale-95 transition-all shadow-lg shadow-red-500/20">네, 지울게요</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto h-20 bg-gray-900 rounded-[32px] shadow-2xl shadow-black/20 flex items-center justify-between px-6 z-50 border border-white/10 backdrop-blur-lg">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-white w-12"><HomeIcon size={20} fill="currentColor" /><span className="text-[9px] font-black">장부홈</span></button>
        <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-gray-500 w-12"><FileSearch size={20} /><span className="text-[9px] font-black">사진보관함</span></button>
        <button onClick={() => navigate('/create')} className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-90 transition-all -translate-y-3 border-4 border-gray-900"><Plus size={32} strokeWidth={4} /></button>
        <button onClick={() => navigate('/intro')} className="flex flex-col items-center gap-1 text-gray-500 w-12"><BookOpen size={20} /><span className="text-[9px] font-black">도움말</span></button>
        <button onClick={() => navigate('/my-info')} className="flex flex-col items-center gap-1 text-gray-500 w-12"><User size={20} /><span className="text-[9px] font-black">내정보</span></button>
      </nav>
    </div>
  );
};

const ExportOption = ({ title, subtitle, count, onClick, icon, highlight }: any) => (
  <button onClick={onClick} disabled={count === 0} className={`w-full flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all text-left group active:scale-[0.98] ${count === 0 ? 'bg-gray-50 border-gray-50 opacity-40 cursor-not-allowed' : highlight ? 'bg-blue-50 border-blue-100 hover:border-blue-400' : 'bg-white border-gray-100 hover:border-gray-900'}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${count === 0 ? 'bg-gray-100' : highlight ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>{icon}</div>
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between mb-0.5">
        <span className={`text-[15px] font-black ${count === 0 ? 'text-gray-400' : 'text-gray-900'}`}>{title}</span>
        <span className={`text-[12px] font-black ${count === 0 ? 'text-gray-300' : highlight ? 'text-blue-600' : 'text-gray-400'}`}>{count}건</span>
      </div>
      <p className="text-[10px] font-bold text-gray-400 truncate">{subtitle}</p>
    </div>
  </button>
);
