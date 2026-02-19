
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Download, CheckCircle, ArrowLeft, ExternalLink, Info, ShieldCheck, Zap, Monitor } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { generateHomeTaxExcel } from '../utils/hometax';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface ExportProps {
  draft: InvoiceDraft | null;
}

export const Export: React.FC<ExportProps> = ({ draft }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!draft || draft.id !== id) navigate('/');
  }, [draft, id, navigate]);

  if (!draft) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`복사되었습니다: ${text}`);
  };

  const handleExcelDownload = () => {
    generateHomeTaxExcel([draft]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-40">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-6 flex items-center">
        <button onClick={() => navigate(`/draft/${id}`)} className="p-2 -ml-3 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="flex-1 text-center font-black text-[16px] text-gray-900">홈택스 전송 준비</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 mt-10 space-y-10">
        <section className="text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[36px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
            <CheckCircle size={44} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">정리가 끝났습니다!</h2>
          <p className="text-gray-500 text-[15px] font-bold leading-relaxed">
            귀찮은 홈택스 수동 입력은 이제 그만.<br/>
            엑셀 파일로 한 번에 끝내거나 바로 복사하세요.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Zap size={18} className="text-blue-500 fill-blue-500" />
            <h3 className="text-[17px] font-black text-gray-900">1. 가장 빠른 방법: 엑셀 업로드</h3>
          </div>
          <Card className="border-2 border-blue-100 bg-white !p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Download size={20} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-[15px] mb-1">홈택스 전용 엑셀 다운로드</p>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed">국세청 규격에 맞춘 파일입니다. 그대로 올리기만 하세요.</p>
                </div>
              </div>
              
              <Button fullWidth onClick={handleExcelDownload} className="h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                엑셀 파일 받기
              </Button>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Monitor size={14} />
                  <span className="text-[11px] font-black uppercase tracking-tight">홈택스 업로드 경로</span>
                </div>
                <p className="text-[13px] font-bold text-gray-700">
                  [조회/발급] → [전자세금계산서] → [일괄발급] → [일괄작성 및 일괄발급]
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Copy size={18} className="text-gray-400" />
            <h3 className="text-[17px] font-black text-gray-900">2. 건별로 직접 입력할 때</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CopyItem label="사업자 번호" value={(draft.buyer.bizNo || '').replace(/-/g, '')} onCopy={copyToClipboard} />
            <CopyItem label="상호" value={draft.buyer.name} onCopy={copyToClipboard} />
            <CopyItem label="공급가액" value={String(draft.totalSupplyAmount)} displayValue={formatCurrency(draft.totalSupplyAmount)} onCopy={copyToClipboard} />
            <CopyItem label="세액" value={String(draft.totalVatAmount)} displayValue={formatCurrency(draft.totalVatAmount)} onCopy={copyToClipboard} />
          </div>
        </section>

        <footer className="pt-10 pb-10 text-center">
          <a 
            href="https://www.hometax.go.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-black text-blue-600 hover:underline"
          >
            홈택스 홈페이지로 이동 <ExternalLink size={16} />
          </a>
        </footer>
      </div>
    </div>
  );
};

const CopyItem = ({ label, value, displayValue, onCopy }: any) => (
  <button 
    onClick={() => value && onCopy(value)}
    className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm text-left active:scale-95 transition-all hover:border-blue-200 group"
  >
    <span className="block text-[11px] font-black text-gray-400 uppercase tracking-tight mb-2 group-hover:text-blue-500 transition-colors">{label}</span>
    <span className="block font-black text-gray-900 text-[16px] truncate">
      {displayValue || value || '-'}
    </span>
  </button>
);
