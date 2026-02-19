
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Plus, User, BookOpen, FileSearch, ArrowLeft, Camera, Edit3, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';

interface HistoryProps {
  drafts: InvoiceDraft[];
}

export const History: React.FC<HistoryProps> = ({ drafts }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-[#F9FAFB] pb-44">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-24 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">증빙 매칭 보관함</h1>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-6">
        <div className="px-1">
          <p className="text-gray-500 text-[14px] font-bold leading-relaxed">
            내가 찍은 사진이 어떤 장부로 변했는지<br/>매칭된 내역을 한눈에 확인하세요.
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-[15px] font-bold">보관된 증빙이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <Card 
                key={draft.id} 
                className="!p-0 overflow-hidden border-none shadow-sm group hover:shadow-md transition-shadow"
                onClick={() => navigate(`/draft/${draft.id}`)}
              >
                <div className="flex min-h-[110px]">
                  {/* 왼쪽: 증빙 소스 아이콘 섹션 */}
                  <div className={`w-24 flex flex-col items-center justify-center gap-1 ${draft.originalFileName ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {draft.originalFileName ? <Camera size={24} /> : <Edit3 size={24} />}
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {draft.originalFileName ? 'AI 등록' : '직접 입력'}
                    </span>
                  </div>
                  
                  {/* 오른쪽: 상세 정보 */}
                  <div className="flex-1 p-5 bg-white flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-gray-900 text-[16px] mb-0.5">
                          {draft.buyer.name || '거래처명 없음'}
                        </h3>
                        <p className="text-[11px] font-bold text-gray-400">
                          {draft.issueDate?.replace(/-/g, '.')}
                        </p>
                      </div>
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${draft.originalFileName ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                        <span className="text-[10px] font-black text-gray-400 truncate max-w-[100px]">
                          {draft.originalFileName ? draft.originalFileName : '수동 작성'}
                        </span>
                      </div>
                      <p className="font-black text-gray-900 text-[16px]">
                        {formatCurrency(draft.totalAmount)}원
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto h-20 bg-gray-900 rounded-[32px] shadow-2xl shadow-black/20 flex items-center justify-between px-6 z-50 border border-white/10 backdrop-blur-lg">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <HomeIcon size={20} />
          <span className="text-[9px] font-black">장부홈</span>
        </button>
        <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-white w-12">
          <FileSearch size={20} fill="currentColor" />
          <span className="text-[9px] font-black">증빙매칭</span>
        </button>
        
        <button 
          onClick={() => navigate('/create')} 
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-90 transition-all -translate-y-3 border-4 border-gray-900"
        >
          <Plus size={32} strokeWidth={4} />
        </button>

        <button onClick={() => navigate('/intro')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <BookOpen size={20} />
          <span className="text-[9px] font-black">소개</span>
        </button>
        <button onClick={() => navigate('/my-info')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <User size={20} />
          <span className="text-[9px] font-black">내정보</span>
        </button>
      </nav>
    </div>
  );
};
