import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ReceiptText } from 'lucide-react';
import { InvoiceDraft, LineItem } from '../types';
import { calculateTotals, formatCurrency, validateDraft } from '../utils/calculation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface EditorProps {
  draft: InvoiceDraft | null;
  updateDraft: (draft: InvoiceDraft) => void;
}

export const Editor: React.FC<EditorProps> = ({ draft, updateDraft }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'items'>('info');

  if (!draft) return null;

  const handleBuyerChange = (field: string, value: string) => {
    const updated = { ...draft, buyer: { ...draft.buyer, [field]: value } };
    updateDraft(validateDraft(updated));
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: any) => {
    const updatedItems = draft.items.map(item => {
      if (item.id === itemId) {
        const newItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          newItem.supplyAmount = (newItem.qty || 0) * (newItem.unitPrice || 0);
          newItem.vatAmount = Math.floor(newItem.supplyAmount * 0.1);
        }
        return newItem;
      }
      return item;
    });
    
    const totals = calculateTotals(updatedItems);
    updateDraft(validateDraft({ ...draft, items: updatedItems, ...totals }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(), name: '', spec: '', qty: 1, unitPrice: 0, supplyAmount: 0, vatAmount: 0
    };
    updateDraft(validateDraft({ ...draft, items: [...draft.items, newItem] }));
    setActiveTab('items');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-3 text-gray-400 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold text-gray-300 tracking-tight mb-0.5">기록 수정하기</p>
          <h1 className="font-extrabold text-sm text-gray-900">{draft.buyer.name || '내역 상세'}</h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="max-w-xl mx-auto px-6 mt-6 space-y-6">
        {/* 총액 요약 카드 */}
        <Card className="bg-black text-white border-none shadow-xl shadow-black/10 !p-7">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-gray-500 text-xs font-bold mb-1.5">최종 합계 금액</p>
              <p className="text-3xl font-black">{formatCurrency(draft.totalAmount)}<span className="text-lg font-bold text-gray-500 ml-1.5">원</span></p>
            </div>
            <div className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-white/80">
              {draft.billingType || '청구'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-white/30 text-[11px] font-bold mb-1">공급가액</p>
              <p className="font-bold text-base">{formatCurrency(draft.totalSupplyAmount)}</p>
            </div>
            <div>
              <p className="text-white/30 text-[11px] font-bold mb-1">부가세</p>
              <p className="font-bold text-base text-blue-400">{formatCurrency(draft.totalVatAmount)}</p>
            </div>
          </div>
        </Card>

        {/* 탭 전환 */}
        <div className="flex p-1.5 bg-gray-200/50 rounded-2xl">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'info' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            거래처 정보
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${activeTab === 'items' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            품목 리스트
          </button>
        </div>

        {/* 탭별 내용 */}
        {activeTab === 'info' ? (
          <div className="space-y-4">
            <Card title="사업자 정보">
              <div className="space-y-6">
                <InputField label="사업자 등록 번호" value={draft.buyer.bizNo || ''} onChange={(v) => handleBuyerChange('bizNo', v)} placeholder="000-00-00000" />
                <InputField label="상호 (업체명)" value={draft.buyer.name || ''} onChange={(v) => handleBuyerChange('name', v)} />
                <InputField label="대표자 성명" value={draft.buyer.ceoName || ''} onChange={(v) => handleBuyerChange('ceoName', v)} />
              </div>
            </Card>
            <Card title="날짜 정보">
               <InputField label="발행 일자" value={draft.issueDate || ''} onChange={(v) => updateDraft(validateDraft({ ...draft, issueDate: v }))} type="date" />
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {draft.items.map((item, idx) => (
              <Card key={item.id} className="relative group border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-black text-gray-400 italic">
                    {idx + 1}번째 품목
                  </span>
                  <button onClick={() => updateDraft(validateDraft({ ...draft, items: draft.items.filter(i => i.id !== item.id) }))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-gray-300 mb-1.5 ml-1">품목명</label>
                    <input 
                      className="w-full text-lg font-extrabold text-gray-900 bg-transparent border-b border-gray-100 focus:border-blue-500 outline-none pb-2"
                      placeholder="무엇을 팔았나요?"
                      value={item.name || ''}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1.5 ml-1">수량</label>
                      <input type="number" className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-base font-bold outline-none border border-transparent focus:border-blue-100" value={item.qty || 0} onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1.5 ml-1">단가</label>
                      <input type="number" className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-base font-bold outline-none border border-transparent focus:border-blue-100" value={item.unitPrice || 0} onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <button onClick={addItem} className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[28px] text-gray-400 font-extrabold text-[15px] hover:border-gray-400 hover:text-gray-500 transition-all flex flex-col items-center gap-3 bg-white/50">
              <Plus size={28} />
              여기를 눌러 품목 추가
            </button>
          </div>
        )}
      </div>

      {/* 하단 저장 버튼 */}
      <div className="fixed bottom-8 left-6 right-6 max-w-xl mx-auto">
        <Button fullWidth onClick={() => navigate('/')} className="h-16 rounded-2xl text-[17px] font-black shadow-2xl shadow-black/20">
          이 내용으로 저장 완료
        </Button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="group">
    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-tighter mb-2 ml-1">{label}</label>
    <input 
      type={type}
      className="w-full bg-gray-50 rounded-xl px-4 py-4 text-base font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white border border-transparent focus:border-blue-200 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);