import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Download, CheckCircle, ArrowLeft, ExternalLink, Info, ShieldCheck, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { generateHomeTaxExcel } from '../utils/hometax'; // Import shared util
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface ExportProps {
  draft: InvoiceDraft | null;
}

export const Export: React.FC<ExportProps> = ({ draft }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!draft || draft.id !== id) navigate('/');
  }, [draft, id, navigate]);

  if (!draft) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`복사되었습니다: ${text}`);
  };

  const handleExcelDownload = () => {
    generateHomeTaxExcel([draft]); // Treat as single item list
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(`/draft/${id}`)} className="flex items-center text-gray-500 mb-6 hover:text-gray-900">
        <ArrowLeft size={20} className="mr-1" /> 수정화면으로
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">준비 완료!</h1>
        <p className="text-gray-500 mt-2">
          홈택스 발급 화면에 바로 입력하거나<br/>
          엑셀 파일을 다운로드하세요.
        </p>
        
        <a 
          href="https://www.hometax.go.kr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 font-medium mt-4 hover:underline"
        >
          홈택스 바로가기 <ExternalLink size={14} />
        </a>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. 건별 발급용 (복사하기)</h2>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
              <Info size={14} />
              <span>건별 입력 시 <b>'등록번호'</b>와 <b>'금액'</b>이 가장 중요해요.</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CopyCard label="등록번호 (하이픈제거)" value={(draft.buyer.bizNo || '').replace(/-/g, '')} onCopy={copyToClipboard} highlight />
            <CopyCard label="상호" value={draft.buyer.name} onCopy={copyToClipboard} />
            <CopyCard label="공급가액" value={String(draft.totalSupplyAmount)} displayValue={formatCurrency(draft.totalSupplyAmount)} onCopy={copyToClipboard} highlight />
            <CopyCard label="세액" value={String(draft.totalVatAmount)} displayValue={formatCurrency(draft.totalVatAmount)} onCopy={copyToClipboard} highlight />
            <CopyCard label="작성일자" value={(draft.issueDate || '').replace(/-/g, '')} onCopy={copyToClipboard} />
            <CopyCard label="대표자명" value={draft.buyer.ceoName} onCopy={copyToClipboard} />
          </div>
        </section>

        <section>
           <h2 className="text-lg font-bold text-gray-800 mb-3">2. 홈택스 파일 생성</h2>
           <Card className="flex flex-col gap-3 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">100건 이하 양식 파일</p>
                  <p className="text-xs text-gray-500">
                    자동으로 데이터가 7행부터 시작되며,<br/>
                    모든 셀 서식이 '텍스트'로 설정됩니다.
                  </p>
                </div>
                <Button size="sm" variant="primary" onClick={handleExcelDownload}>
                  <Download size={16} className="mr-2" /> 엑셀 다운로드
                </Button>
              </div>
              <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg flex items-start gap-2">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <span>
                  <b>TIP:</b> 공급받는자 번호가 주민번호(13자리)인 경우, 
                  자동으로 번호는 <b>999...9</b>로 변경되고 실제 번호는 <b>비고란</b>에 기재됩니다.
                </span>
              </div>
           </Card>
        </section>
      </div>

       <div className="mt-12 text-center">
        <Button variant="ghost" onClick={() => navigate('/')}>처음으로 돌아가기</Button>
      </div>
    </div>
  );
};

const CopyCard = ({ label, value, displayValue, onCopy, highlight }: any) => (
  <div 
    onClick={() => value && onCopy(value)}
    className={`
      bg-white p-4 rounded-xl border transition-all cursor-pointer active:scale-95 flex flex-col justify-between h-24
      ${highlight ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}
    `}
  >
    <span className={`text-xs ${highlight ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>{label}</span>
    <div className="flex items-end justify-between">
      <span className={`font-bold text-lg truncate ${!value ? 'text-gray-300' : 'text-gray-800'}`}>
        {displayValue || value || '-'}
      </span>
      <Copy size={16} className={`${highlight ? 'text-blue-500' : 'text-gray-400'} mb-1`} />
    </div>
  </div>
);