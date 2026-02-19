import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileDown, Trash2, Edit2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { InvoiceDraft } from '../types';
import { formatCurrency } from '../utils/calculation';
import { generateHomeTaxExcel } from '../utils/hometax'; // Import shared util
import { Button } from '../components/Button';

interface HomeProps {
  drafts: InvoiceDraft[];
  deleteDraft: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ drafts, deleteDraft }) => {
  const navigate = useNavigate();

  const totalAmount = drafts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  const handleBulkExport = () => {
    if (drafts.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    // Use the shared utility
    generateHomeTaxExcel(drafts);
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">세금계산서 장부</h1>
            <p className="text-gray-500 text-sm mt-1">
                {drafts.length > 0 
                  ? `총 ${drafts.length}건의 발급 대기 내역이 있습니다.` 
                  : '아직 등록된 내역이 없습니다.'}
            </p>
        </div>
        <Button size="sm" onClick={() => navigate('/upload')}>
            <Plus size={18} className="mr-1" /> 추가하기
        </Button>
      </div>

      {/* Summary Card */}
      {drafts.length > 0 && (
          <div className="bg-blue-600 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-blue-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100 font-medium">총 발급 예정 금액</span>
                <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">VAT 포함</span>
            </div>
            <div className="text-3xl font-bold">
                {formatCurrency(totalAmount)}원
            </div>
            <div className="mt-4 pt-4 border-t border-blue-500 flex justify-between items-center">
                <div className="text-sm text-blue-100 flex items-center gap-1">
                    <CheckCircle size={14} /> 
                    <span>홈택스 공식 양식 (100건 이하)</span>
                </div>
                <button 
                    onClick={handleBulkExport}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                    <FileDown size={16} />
                    일괄 엑셀 다운로드
                </button>
            </div>
          </div>
      )}

      {/* Empty State */}
      {drafts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">등록된 내역이 없어요</h3>
              <p className="text-gray-500 text-sm mb-6">종이 영수증이나 거래명세표를 찍어보세요.</p>
              <Button onClick={() => navigate('/upload')}>
                  <Plus size={18} className="mr-1" /> 첫 계산서 만들기
              </Button>
          </div>
      )}

      {/* Draft List */}
      <div className="space-y-4">
        {drafts.map((draft) => (
            <div key={draft.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group relative">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mr-2">
                            {draft.issueDate}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${draft.billingType === '영수' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {draft.billingType || '청구'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate(`/draft/${draft.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="flex justify-between items-end" onClick={() => navigate(`/draft/${draft.id}`)}>
                    <div className="cursor-pointer">
                        <h3 className="font-bold text-gray-900 text-lg mb-0.5">
                            {draft.buyer.name || '(거래처 미입력)'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {draft.items[0]?.name || '품목 없음'} 
                            {draft.items.length > 1 && ` 외 ${draft.items.length - 1}건`}
                        </p>
                    </div>
                    <div className="text-right cursor-pointer">
                        <p className="font-bold text-lg text-gray-900">
                            {formatCurrency(draft.totalAmount)}원
                        </p>
                        {draft.warnings.length > 0 && (
                            <div className="flex items-center gap-1 justify-end text-xs text-orange-600 mt-1">
                                <AlertCircle size={12} />
                                <span>확인 필요 {draft.warnings.length}건</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};