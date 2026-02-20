
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Download, X, Calculator, Receipt, Search, History, ChevronRight, AlertCircle, Save, Check, FileText } from 'lucide-react';
import { InvoiceDraft, LineItem, Party } from '../types';
import { calculateTotals, formatCurrency, validateDraft, formatBizNo } from '../utils/calculation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TaxInvoiceForm } from '../components/TaxInvoiceForm';
import html2canvas from 'https://esm.sh/html2canvas@1.4.1';

interface EditorProps {
  draft: InvoiceDraft;
  isNew: boolean;
  updateDraft: (draft: InvoiceDraft) => void;
  deleteDraft: (id: string) => void;
  allDrafts: InvoiceDraft[];
}

export const Editor: React.FC<EditorProps> = ({ draft, isNew, updateDraft, deleteDraft, allDrafts }) => {
  const navigate = useNavigate();
  const [localDraft, setLocalDraft] = useState<InvoiceDraft>({ ...draft });
  const [activeTab, setActiveTab] = useState<'items' | 'info'>('items');
  const [showPreview, setShowPreview] = useState(false);
  const [showBuyerHistory, setShowBuyerHistory] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const uniqueBuyers = useMemo(() => {
    const buyerMap = new Map<string, Party>();
    allDrafts.forEach(d => {
      if (d.buyer && d.buyer.name) {
        const key = d.buyer.bizNo || d.buyer.name;
        if (!buyerMap.has(key)) buyerMap.set(key, d.buyer);
      }
    });
    return Array.from(buyerMap.values());
  }, [allDrafts]);

  const handleBuyerChange = (field: string, value: string) => {
    const updated = { ...localDraft, buyer: { ...localDraft.buyer, [field]: value } };
    setLocalDraft(validateDraft(updated));
  };

  const selectPreviousBuyer = (prevBuyer: Party) => {
    const updated = { ...localDraft, buyer: { ...prevBuyer } };
    setLocalDraft(validateDraft(updated));
    setShowBuyerHistory(false);
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: any) => {
    const updatedItems = localDraft.items.map(item => {
      if (item.id === itemId) {
        const newItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          newItem.supplyAmount = Number(newItem.qty || 0) * Number(newItem.unitPrice || 0);
          newItem.vatAmount = Math.floor(newItem.supplyAmount * 0.1);
        }
        return newItem;
      }
      return item;
    });
    const totals = calculateTotals(updatedItems);
    setLocalDraft(validateDraft({ ...localDraft, items: updatedItems, ...totals }));
  };

  const addItem = () => {
    const newItem: LineItem = { id: crypto.randomUUID(), name: '', spec: '', qty: 1, unitPrice: 0, supplyAmount: 0, vatAmount: 0 };
    setLocalDraft(validateDraft({ ...localDraft, items: [...localDraft.items, newItem] }));
  };

  const handleFinalSave = () => {
    updateDraft(localDraft);
    navigate('/');
  };

  const confirmDelete = () => {
    deleteDraft(localDraft.id);
    navigate('/');
  };

  const handleSaveImage = async () => {
    const element = document.getElementById('tax-invoice-form');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 3 });
      const link = document.createElement('a');
      link.download = `세금계산서_${localDraft.buyer.name || '미등록'}_${localDraft.issueDate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('이미지 저장 중 문제가 생겼습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-72 relative">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-6 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 -ml-3 text-gray-400 hover:text-gray-900 transition-colors"><ArrowLeft size={28} /></button>
        <div className="text-center">
          <h1 className="font-black text-[16px] text-gray-900">{isNew ? '장부 새로 적기' : (localDraft.buyer.name || '장부 고치기')}</h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="px-6 mt-8 space-y-8">
        <Card className="bg-white border-2 border-blue-100 shadow-xl shadow-blue-600/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[13px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-tighter">자동 합계 계산</span>
              <div className="flex flex-col items-end gap-1">
                <select value={localDraft.billingType || '청구'} onChange={(e) => setLocalDraft(validateDraft({ ...localDraft, billingType: e.target.value as any }))} className="bg-gray-900 px-3 py-1.5 rounded-xl text-[12px] font-black text-white outline-none border-none cursor-pointer shadow-md">
                  <option value="청구">청구 (돈 주세요)</option>
                  <option value="영수">영수 (돈 받았습니다)</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col items-end mb-8">
              <p className="text-gray-400 text-xs font-bold mb-1">총 합계 (세액 포함)</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(localDraft.totalAmount)} <span className="text-lg text-gray-400">원</span></h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div><p className="text-[11px] font-bold text-gray-400 mb-1">물건 값</p><p className="font-black text-[16px] text-gray-900">{formatCurrency(localDraft.totalSupplyAmount)}</p></div>
              <div><p className="text-[11px] font-bold text-gray-400 mb-1">세금 (10%)</p><p className="font-black text-[16px] text-blue-600">{formatCurrency(localDraft.totalVatAmount)}</p></div>
            </div>
          </div>
        </Card>

        <div className="flex p-1 bg-gray-200/50 rounded-2xl">
          <button onClick={() => setActiveTab('items')} className={`flex-1 py-3 text-[14px] font-black rounded-xl transition-all ${activeTab === 'items' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>물건 목록</button>
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-[14px] font-black rounded-xl transition-all ${activeTab === 'info' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>거래처 정보</button>
        </div>

        {activeTab === 'items' ? (
          <div className="space-y-6">
            {localDraft.items.map((item, idx) => (
              <Card key={item.id} className="relative border-2 border-gray-50 hover:border-blue-100 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded">{idx + 1}번 물건</span>
                  <button onClick={() => setLocalDraft(validateDraft({ ...localDraft, items: localDraft.items.filter(i => i.id !== item.id) }))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
                <div className="space-y-6">
                  <InputField label="어떤 물건인가요?" value={item.name || ''} onChange={(v: string) => handleItemChange(item.id, 'name', v)} placeholder="예: 쌀 20kg" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="수량" type="number" value={String(item.qty || '')} onChange={(v: string) => handleItemChange(item.id, 'qty', v)} />
                    <InputField label="개당 가격" type="number" value={String(item.unitPrice || '')} onChange={(v: string) => handleItemChange(item.id, 'unitPrice', v)} />
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-[11px] font-black text-blue-400">품목 합계</span>
                    <span className="font-black text-blue-600">{formatCurrency(item.supplyAmount)}원</span>
                  </div>
                </div>
              </Card>
            ))}
            <button onClick={addItem} className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-black hover:border-blue-500 hover:text-blue-500 transition-all flex flex-col items-center gap-2 bg-white shadow-sm">
              <Plus size={24} /> 물건 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end px-1"><button onClick={() => setShowBuyerHistory(true)} className="flex items-center gap-1.5 text-[12px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl active:scale-95 transition-all"><History size={14} /> 전에 거래했던 분 불러오기</button></div>
            <Card title="돈 받을 분(거래처) 정보">
              <div className="space-y-6">
                <InputField label="상호 (업체명)" value={localDraft.buyer.name || ''} onChange={(v: string) => handleBuyerChange('name', v)} placeholder="예: 대박상사" />
                <InputField label="사업자 번호" value={localDraft.buyer.bizNo || ''} onChange={(v: string) => handleBuyerChange('bizNo', v)} placeholder="000-00-00000" />
                <InputField label="대표자 성함" value={localDraft.buyer.ceoName || ''} onChange={(v: string) => handleBuyerChange('ceoName', v)} />
                <InputField label="사업장 주소" value={localDraft.buyer.address || ''} onChange={(v: string) => handleBuyerChange('address', v)} />
              </div>
            </Card>
            <Card title="발행 날짜">
               <InputField label="언제 발행하나요?" value={localDraft.issueDate || ''} onChange={(v: string) => setLocalDraft(validateDraft({ ...localDraft, issueDate: v }))} type="date" />
            </Card>
          </div>
        )}

        {!isNew && (
          <div className="pt-10 pb-4 border-t border-gray-100 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <AlertCircle size={14} />
              <span className="text-[11px] font-bold">이 장부 내역이 더 이상 필요 없으신가요?</span>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-8 py-3 rounded-2xl bg-white border-2 border-red-50 text-red-400 text-[13px] font-black flex items-center gap-2 mx-auto active:bg-red-50 transition-colors"
            >
              <Trash2 size={16} /> 장부 지우기
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 z-40 max-w-xl mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[40px]">
        <button 
          onClick={() => setShowPreview(true)} 
          className="w-full h-14 bg-gray-100 text-gray-700 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <FileText size={18} className="text-gray-400" /> 종이 세금계산서로 미리보기
        </button>
        <button 
          onClick={handleFinalSave} 
          className="w-full h-18 bg-blue-600 text-white rounded-2xl font-black text-[18px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-500/20 py-5"
        >
          <Check size={26} strokeWidth={3} /> 다 적었습니다! 장부에 저장
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[30px] flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">정말 지우시겠습니까?</h3>
            <p className="text-[15px] font-bold text-gray-500 leading-relaxed mb-10 italic">
              삭제된 장부는 복구가 불가능합니다.<br/>
              거래처와 금액을 다시 한 번 확인해 주세요.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-16 bg-gray-100 text-gray-500 rounded-2xl font-black text-[16px] active:scale-95 transition-all">취소</button>
              <button onClick={confirmDelete} className="flex-[1.5] h-16 bg-red-500 text-white rounded-2xl font-black text-[16px] active:scale-95 transition-all shadow-lg shadow-red-500/20">네, 지울게요</button>
            </div>
          </div>
        </div>
      )}

      {showBuyerHistory && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-xl bg-white rounded-t-[40px] p-8 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black text-gray-900">최근 거래처 선택</h3><button onClick={() => setShowBuyerHistory(false)} className="p-2 text-gray-400"><X size={24} /></button></div>
            <div className="flex-1 overflow-auto space-y-3 pb-8">
              {uniqueBuyers.length === 0 ? <div className="text-center py-20"><p className="text-gray-400 font-bold">아직 거래 내역이 없네요.</p></div> : uniqueBuyers.map((buyer, idx) => (
                <button key={idx} onClick={() => selectPreviousBuyer(buyer)} className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50/50 hover:border-blue-500 hover:bg-blue-50/30 text-left flex items-center justify-between group transition-all">
                  <div><p className="text-[16px] font-black text-gray-900 mb-1">{buyer.name}</p><p className="text-[12px] font-bold text-gray-400">{formatBizNo(buyer.bizNo)}</p></div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
            <Button fullWidth variant="secondary" onClick={() => setShowBuyerHistory(false)}>닫기</Button>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div><h3 className="text-xl font-black text-gray-900">종이 양식 미리보기</h3><p className="text-[11px] font-bold text-gray-400 mt-0.5">국세청 표준 양식 그대로 보여드려요.</p></div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleSaveImage} className="gap-2 h-12 rounded-xl"><Download size={18} /> 사진으로 저장</Button>
                <button onClick={() => setShowPreview(false)} className="p-3 text-gray-300 hover:text-gray-900 transition-colors"><X size={28} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-10 bg-gray-100/50"><div className="min-w-[800px] flex justify-center"><TaxInvoiceForm draft={localDraft} /></div></div>
            <div className="p-6 bg-white border-t border-gray-100 text-center"><p className="text-xs font-bold text-gray-400 mb-4">사진으로 저장하면 카톡으로 편하게 보낼 수 있습니다.</p><Button fullWidth onClick={() => setShowPreview(false)} className="h-14">확인했습니다</Button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="group">
    <label className="block text-[12px] font-black text-gray-400 uppercase tracking-tight mb-2 ml-1">{label}</label>
    <input 
      type={type} 
      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-[15px] font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all placeholder:text-gray-300" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  </div>
);
