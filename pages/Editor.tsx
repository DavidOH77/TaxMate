import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, AlertCircle, Save, X } from 'lucide-react';
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'info' | 'items'>('info');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for missing fields passed from Upload page
    const state = location.state as { missingFields?: string[] };
    if (state?.missingFields && state.missingFields.length > 0) {
      setToastMessage(`${state.missingFields.join(', ')} 정보가 누락되었습니다.`);
      
      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => setToastMessage(null), 4000);
      
      // Clear state so it doesn't reappear on refresh (though standard browser refresh clears state usually)
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!draft) return null;

  const handleBuyerChange = (field: string, value: string) => {
    const updated = { ...draft, buyer: { ...draft.buyer, [field]: value } };
    updateDraft(validateDraft(updated));
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: any) => {
    const updatedItems = draft.items.map(item => {
      if (item.id === itemId) {
        const newItem = { ...item, [field]: value };
        // Auto calc logic
        if (field === 'qty' || field === 'unitPrice') {
          newItem.supplyAmount = (newItem.qty || 0) * (newItem.unitPrice || 0);
          newItem.vatAmount = Math.floor(newItem.supplyAmount * 0.1);
        }
        return newItem;
      }
      return item;
    });
    
    // Recalculate totals
    const { totalSupplyAmount, totalVatAmount, totalAmount } = calculateTotals(updatedItems);
    
    const updatedDraft = { 
      ...draft, 
      items: updatedItems,
      totalSupplyAmount,
      totalVatAmount,
      totalAmount
    };
    updateDraft(validateDraft(updatedDraft));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      name: '',
      spec: '',
      qty: 1,
      unitPrice: 0,
      supplyAmount: 0,
      vatAmount: 0
    };
    const updated = { ...draft, items: [...draft.items, newItem] };
    updateDraft(validateDraft(updated));
    setActiveTab('items');
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = draft.items.filter(i => i.id !== itemId);
    const totals = calculateTotals(updatedItems);
    const updated = { ...draft, items: updatedItems, ...totals };
    updateDraft(validateDraft(updated));
  };

  const warningCount = draft.warnings.length;

  return (
    <div className="pb-24 max-w-2xl mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce-in">
          <div className="bg-gray-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-[#F2F4F6] z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-600 hover:bg-gray-200 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-gray-900">내용 확인 및 수정</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 space-y-4">
        {/* Warning Banner */}
        {warningCount > 0 && (
          <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-pulse">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">확인이 필요한 항목이 {warningCount}개 있어요.</p>
              <p className="text-orange-600 text-xs mt-1">입력란의 붉은 테두리를 확인해주세요.</p>
            </div>
          </div>
        )}

        {/* Summary Card (Always Visible) */}
        <Card className="bg-blue-600 text-white border-none">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">합계 금액</p>
              <p className="text-3xl font-bold">{formatCurrency(draft.totalAmount)}원</p>
            </div>
            <div className="bg-blue-500 px-3 py-1 rounded-lg text-xs font-semibold">
              {draft.billingType || '청구'}
            </div>
          </div>
          <div className="flex gap-4 text-sm text-blue-100">
            <div>
              <span className="opacity-70 mr-2">공급가액</span>
              <span className="font-medium">{formatCurrency(draft.totalSupplyAmount)}</span>
            </div>
            <div>
              <span className="opacity-70 mr-2">세액</span>
              <span className="font-medium">{formatCurrency(draft.totalVatAmount)}</span>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-xl">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'info' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            거래처 정보
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'items' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            품목 ({draft.items.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'info' ? (
          <div className="space-y-4">
            <Card title="받는 분 (공급받는 자)">
              <div className="space-y-4">
                <InputField 
                  label="사업자번호" 
                  value={draft.buyer.bizNo || ''} 
                  onChange={(v) => handleBuyerChange('bizNo', v)}
                  error={hasError(draft, 'buyer.bizNo')}
                  placeholder="000-00-00000"
                />
                <InputField 
                  label="상호 (법인명)" 
                  value={draft.buyer.name || ''} 
                  onChange={(v) => handleBuyerChange('name', v)}
                  error={hasError(draft, 'buyer.name')}
                />
                <InputField 
                  label="대표자명" 
                  value={draft.buyer.ceoName || ''} 
                  onChange={(v) => handleBuyerChange('ceoName', v)}
                />
                <InputField 
                  label="이메일" 
                  value={draft.buyer.email || ''} 
                  onChange={(v) => handleBuyerChange('email', v)}
                  type="email"
                />
              </div>
            </Card>
            <Card title="작성 일자">
               <InputField 
                  label="발행일" 
                  value={draft.issueDate || ''} 
                  onChange={(v) => {
                    const updated = { ...draft, issueDate: v };
                    updateDraft(validateDraft(updated));
                  }}
                  type="date"
                />
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {draft.items.map((item, idx) => (
              <Card key={item.id} className="relative">
                <div className="absolute top-4 right-4">
                  <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">품목명</label>
                      <input 
                        className={`w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none ${hasError(draft, `items[${idx}].name`) ? 'ring-1 ring-red-500' : ''}`}
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 shrink-0">
                      <label className="block text-xs text-gray-500 mb-1">수량</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-right outline-none"
                        value={item.qty || 0}
                        onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">단가</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-right outline-none"
                        value={item.unitPrice || 0}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">공급가액</span>
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(item.supplyAmount)}원</span>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="secondary" fullWidth onClick={addItem} className="py-4 border-dashed border-2">
              <Plus size={18} className="mr-2" /> 품목 추가하기
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-2xl mx-auto">
        <Button fullWidth onClick={() => navigate('/')} className="bg-gray-900 hover:bg-black text-white">
          <Save size={18} className="mr-2" />
          저장하고 목록으로
        </Button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, error, type = 'text', placeholder = '' }: any) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input 
      type={type}
      className={`w-full bg-gray-50 rounded-lg px-3 py-2.5 text-base text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'ring-1 ring-red-500 bg-red-50' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {error && <p className="text-xs text-red-500 mt-1">확인이 필요합니다</p>}
  </div>
);

const hasError = (draft: InvoiceDraft, path: string) => {
  return draft.warnings.some(w => w.fieldPath === path);
};