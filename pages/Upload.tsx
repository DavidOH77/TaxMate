
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShieldCheck, Camera, FileImage, Scan } from 'lucide-react';
import { MOCK_DRAFT, EMPTY_DRAFT } from '../constants';
import { processWithGemini } from '../services/geminiService';
import { validateDraft } from '../utils/calculation';
import { InvoiceDraft, Party } from '../types';

interface UploadProps {
  onSave: (draft: InvoiceDraft) => void;
  myInfo: Party;
}

export const Upload: React.FC<UploadProps> = ({ onSave, myInfo }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleProcess = async (file: File) => {
    setLoading(true);
    try {
      const hasApiKey = !!process.env.API_KEY;
      let draftData: InvoiceDraft;

      if (hasApiKey) {
        const extracted = await processWithGemini(file, process.env.API_KEY!);
        draftData = {
          ...EMPTY_DRAFT,
          ...extracted,
          id: crypto.randomUUID(),
          issueDate: extracted.issueDate || new Date().toISOString().split('T')[0],
          supplier: myInfo,
          warnings: [],
          originalFileName: file.name,
          items: (extracted.items || []).map((item, idx) => ({ 
             id: idx.toString(),
             name: item.name || null,
             spec: item.spec || null,
             qty: item.qty || null,
             unitPrice: item.unitPrice || null,
             supplyAmount: item.supplyAmount || null,
             vatAmount: item.vatAmount || null
          })) as any
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        draftData = { ...MOCK_DRAFT, id: crypto.randomUUID(), supplier: myInfo };
      }
      
      const validated = validateDraft(draftData);
      navigate(`/draft/${validated.id}`, { state: { tempDraft: validated } });
    } catch (error) {
      alert("비서가 내용을 읽다가 조금 헷갈려 하네요. 다시 한 번만 선명하게 찍어주세요!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col px-6 py-10 bg-white">
      <header className="mb-14">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[32px] mx-auto flex items-center justify-center text-white shadow-xl">
              <Scan size={32} className="animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">세정 비서가 꼼꼼하게<br/>내용을 읽고 있어요</h1>
              <p className="text-gray-400 text-sm font-bold">장부에 예쁘게 적을 준비 중입니다.</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm px-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
              종이 명세표를<br/>찍어만 주세요.
            </h1>
            <p className="text-gray-500 text-[15px] font-bold mb-14 leading-relaxed">
              거래처명부터 합계 금액까지<br/>비서가 알아서 장부에 적어드립니다.
            </p>
            
            <label className="group relative block w-full aspect-square border-2 border-dashed border-gray-200 rounded-[40px] cursor-pointer hover:border-black hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-6 bg-gray-50/50 shadow-inner">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleProcess(e.target.files[0])} 
              />
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Camera size={28} />
                </div>
                <div className="w-16 h-16 bg-blue-500 text-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <FileImage size={28} />
                </div>
              </div>
              <div className="text-center px-4">
                <span className="text-lg font-black text-gray-900 block">사진 찍기 / 앨범에서 선택</span>
                <span className="text-xs font-bold text-gray-400 mt-1 block">휘갈겨 쓴 글씨도 잘 읽어요</span>
              </div>
            </label>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-10 flex items-center justify-center gap-2 text-gray-400">
        <ShieldCheck size={16} className="text-blue-500" />
        <span className="text-xs font-extrabold tracking-tighter">사장님 소중한 정보, 아무도 못 보게 꽉 잠가뒀어요</span>
      </footer>
    </div>
  );
};
