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
    <div className="min-h-screen bg-[#F9FAFB] pb-40">
      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-6 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-3 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <div className="text-center">
          <p className="text-[12px] font-black text-gray-400 tracking-widest mb-1">기록 수정하기</p>
          <h1 className="font-black text-[16px] text-gray-900">{draft.buyer.name || '내역 상세'}</h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="max-w-xl mx-auto px-6 mt-8 space-y-10">
        {/* 총액 요약 카드 - 가독성 및 여백 강화 */}
        <Card className="bg-white border-2 border-blue-50 shadow-[0_12px_40px_rgba(0,0,0,0.06)] !p-10">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-3">
              <p className="text-gray-500 text-[14px] font-black tracking-tight">최종 합계 금액</p>
              <div className="flex items-center gap-3">
                <span className="text-gray-900 text-2xl font-black">원</span>
              </div>
            </div>
            <div className="bg-blue-600 px-5 py-2 rounded-2xl text-[12px] font-black text-white shadow-lg shadow-blue-500/20">
              {draft.billingType || '청구'}
            </div>
          </div>
          
          <div className="flex flex-col items-end mb-10">
            <h2 className="text-5xl font-black text-blue-600 tracking-tighter">
              {formatCurrency(draft.totalAmount)}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-gray-50">
            <div className="space-y-1">
              <p className="text-gray-400 text-[12px] font-bold">공급가액</p>
              <p className="font-black text-[18px] text-gray-900">{formatCurrency(draft.totalSupplyAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-[12px] font-bold">부가세</p>
              <p className="font-black text-[18px] text-gray-900">{formatCurrency(draft.totalVatAmount)}</p>
            </div>
          </div>
        </Card>

        {/* 탭 전환 - 여백 확대 */}
        <div className="flex p-2 bg-gray-200/60 rounded-3xl">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-4 text-[14px] font-black rounded-2xl transition-all ${activeTab === 'info' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500'}`}
          >
            거래처 정보
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-4 text-[14px] font-black rounded-2xl transition-all ${activeTab === 'items' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500'}`}
          >
            품목 리스트
          </button>
        </div>

        {/* 탭별 내용 */}
        {activeTab === 'info' ? (
          <div className="space-y-6">
            <Card title="사업자 상세 정보" className="!p-8">
              <div className="space-y-8">
                <InputField label="사업자 등록 번호" value={draft.buyer.bizNo || ''} onChange={(v: string) => handleBuyerChange('bizNo', v)} placeholder="000-00-00000" />
                <InputField label="상호 (업체명)" value={draft.buyer.name || ''} onChange={(v: string) => handleBuyerChange('name', v)} />
                <InputField label="대표자 성명" value={draft.buyer.ceoName || ''} onChange={(v: string) => handleBuyerChange('ceoName', v)} />
              </div>
            </Card>
            <Card title="날짜 및 기간" className="!p-8">
               <InputField label="발행 일자" value={draft.issueDate || ''} onChange={(v: string) => updateDraft(validateDraft({ ...draft, issueDate: v }))} type="date" />
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {draftsItems(draft, handleItemChange, updateDraft)}
            <button onClick={addItem} className="w-full py-12 border-4 border-dashed border-gray-100 rounded-[40px] text-gray-400 font-black text-[16px] hover:border-blue-100 hover:text-blue-500 transition-all flex flex-col items-center gap-4 bg-white shadow-sm">
              <Plus size={32} />
              여기를 눌러 품목 추가
            </button>
          </div>
        )}
      </div>

      {/* 하단 저장 버튼 */}
      <div className="fixed bottom-10 left-6 right-6 max-w-xl mx-auto z-30">
        <Button fullWidth onClick={() => navigate('/')} className="h-20 rounded-[28px] text-[19px] font-black shadow-2xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700">
          기록 저장 완료하기
        </Button>
      </div>
    </div>
  );
};

const draftsItems = (draft: any, handleItemChange: any, updateDraft: any) => (
  draft.items.map((item: any, idx: number) => (
    <Card key={item.id} className="relative group border-2 border-gray-50 !p-8">
      <div className="flex justify-between items-center mb-8">
        <span className="px-4 py-1.5 bg-blue-50 rounded-xl text-[12px] font-black text-blue-600">
          {idx + 1}번째 품목
        </span>
        <button onClick={() => updateDraft(validateDraft({ ...draft, items: draft.items.filter((i: any) => i.id !== item.id) }))} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
          <Trash2 size={22} />
        </button>
      </div>
      <div className="space-y-8">
        <div className="relative">
          <label className="block text-[12px] font-black text-gray-400 mb-3 ml-1">품목명</label>
          <input 
            className="w-full text-xl font-black text-gray-900 bg-transparent border-b-2 border-gray-100 focus:border-blue-600 outline-none pb-3 px-1"
            placeholder="무엇을 팔았나요?"
            value={item.name || ''}
            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-black text-gray-400 mb-3 ml-1">수량</label>
            <input type="number" className="w-full bg-gray-50 rounded-2xl px-5 py-5 text-lg font-black outline-none border-2 border-transparent focus:border-blue-100" value={item.qty || 0} onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-[12px] font-black text-gray-400 mb-3 ml-1">단가</label>
            <input type="number" className="w-full bg-gray-50 rounded-2xl px-5 py-5 text-lg font-black outline-none border-2 border-transparent focus:border-blue-100" value={item.unitPrice || 0} onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))} />
          </div>
        </div>
      </div>
    </Card>
  ))
);

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="group">
    <label className="block text-[12px] font-black text-gray-400 uppercase tracking-wider mb-3 ml-1">{label}</label>
    <input 
      type={type}
      className="w-full bg-gray-50 rounded-2xl px-6 py-5 text-[17px] font-black text-gray-900 outline-none focus:ring-8 focus:ring-blue-600/5 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);