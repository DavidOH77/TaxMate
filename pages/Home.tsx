import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileDown, ChevronRight, ReceiptText, Sparkles, Download } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { generateHomeTaxExcel } from '../utils/hometax';
import { downloadSvgAsPng } from '../utils/image';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { Card } from '../components/Card';
import { ServiceGuide } from '../components/ServiceGuide';
import { BrandStory } from '../components/BrandStory';

interface HomeProps {
  drafts: InvoiceDraft[];
  deleteDraft: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ drafts, deleteDraft }) => {
  const navigate = useNavigate();
  const totalAmount = drafts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  const handleBulkExport = () => {
    if (drafts.length === 0) return;
    generateHomeTaxExcel(drafts);
  };

  const handleLogoDownload = () => {
    downloadSvgAsPng('app-logo-svg', '세정_로고');
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 min-h-screen bg-[#F9FAFB]">
      {/* 상단 네비게이션 */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Logo size={24} />
          <button 
            onClick={handleLogoDownload}
            title="로고 이미지 저장"
            className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm"
          >
            <Download size={14} />
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500 font-bold">내 정보</Button>
          <button 
            onClick={() => navigate('/upload')}
            className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* 메인 자산 섹션 */}
      <section className="mb-10">
        <Card className="bg-white !p-8 border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-blue-500 fill-blue-500" />
            <span className="text-xs font-bold text-blue-500 tracking-tight">발행 가능한 금액</span>
          </div>
          <div className="flex items-baseline gap-1 mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
              {formatCurrency(totalAmount)}
            </h1>
            <span className="text-xl font-bold text-gray-400">원</span>
          </div>
          
          <div className="flex gap-3">
            <Button 
              fullWidth 
              variant="primary" 
              onClick={() => navigate('/upload')}
              className="rounded-2xl h-14 text-base font-bold"
            >
              <ReceiptText size={20} className="mr-2" /> 새 내역 추가하기
            </Button>
            {drafts.length > 0 && (
              <Button 
                variant="secondary" 
                onClick={handleBulkExport} 
                className="w-14 h-14 !p-0 rounded-2xl border border-gray-100"
              >
                <FileDown size={22} className="text-gray-600" />
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* 리스트 섹션 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-5 px-1">
          <h2 className="text-[15px] font-extrabold text-gray-900">최근 장부 기록</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            총 {drafts.length}건
          </span>
        </div>

        {drafts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-bold">아직 기록된 내역이 없어요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <Card 
                key={draft.id} 
                onClick={() => navigate(`/draft/${draft.id}`)}
                className="!p-5 hover:border-blue-200 transition-all group border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${draft.warnings.length > 0 ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                      <ReceiptText size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[16px] mb-1">
                        {draft.buyer.name || '미등록 업체'}
                      </h3>
                      <p className="text-xs font-bold text-gray-300">
                        {draft.issueDate?.replace(/-/g, '.')} 작성
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">
                        {formatCurrency(draft.totalAmount)}
                      </p>
                      {draft.warnings.length > 0 && (
                        <p className="text-[10px] font-bold text-orange-400">내용 확인 필요</p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-200 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 서비스 가이드 */}
      <ServiceGuide />

      {/* 브랜드 스토리 추가 */}
      <BrandStory />

      {/* 하단 정보 */}
      <footer className="mt-24 pb-10 text-center border-t border-gray-100 pt-10">
        <p className="text-[11px] text-gray-400 font-black tracking-tight mb-2 uppercase italic">세정 · 세금을 쉽게 정리하다</p>
        <p className="text-[10px] text-gray-200 font-bold tracking-tighter">Powered by Gemini Pro Vision AI</p>
      </footer>
    </div>
  );
};