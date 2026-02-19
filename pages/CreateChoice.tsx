
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scan, Edit3, ShieldCheck } from 'lucide-react';
import { Card } from '../components/Card';
import { EMPTY_DRAFT } from '../constants';
import { InvoiceDraft } from '../types';

interface CreateChoiceProps {
  onSave: (draft: InvoiceDraft) => void;
}

export const CreateChoice: React.FC<CreateChoiceProps> = ({ onSave }) => {
  const navigate = useNavigate();

  const handleManualCreate = () => {
    navigate('/draft/new');
  };

  return (
    <div className="w-full min-h-screen flex flex-col px-6 py-10 bg-white">
      <header className="mb-12">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={28} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-3 leading-tight">
            어떤 방법으로<br/>장부를 만드실까요?
          </h1>
          <p className="text-gray-500 text-[15px] font-bold leading-relaxed">
            종이 문서가 있다면 AI 등록을,<br/>새로 작성하신다면 직접 발급을 선택하세요.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/upload')}
            className="w-full flex items-center gap-6 bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all text-left group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Scan size={32} />
            </div>
            <div>
              <span className="font-black text-[20px] block mb-1 text-white">종이 문서 AI 등록</span>
              <span className="text-[13px] font-bold text-white/70 block leading-tight">거래명세표나 영수증을 사진 찍어<br/>내용을 자동으로 가져옵니다.</span>
            </div>
          </button>

          <button 
            onClick={handleManualCreate}
            className="w-full flex items-center gap-6 bg-white p-8 rounded-[40px] text-gray-900 border-2 border-gray-100 shadow-sm active:scale-[0.98] transition-all text-left group"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Edit3 size={32} className="text-gray-400" />
            </div>
            <div>
              <span className="font-black text-[20px] block mb-1 text-gray-900">세금계산서 직접 발급</span>
              <span className="text-[13px] font-bold text-gray-400 block leading-tight">아무것도 없는 상태에서<br/>빈 양식에 직접 내용을 입력합니다.</span>
            </div>
          </button>
        </div>
      </div>

      <footer className="mt-auto pt-10 flex items-center justify-center gap-2 text-gray-300">
        <ShieldCheck size={16} />
        <span className="text-[11px] font-extrabold tracking-tight uppercase">Sejeong AI Smart Assistant</span>
      </footer>
    </div>
  );
};
