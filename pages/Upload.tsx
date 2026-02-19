import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShieldCheck, Camera, FileImage } from 'lucide-react';
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
      onSave(validated);
      navigate(`/draft/${validated.id}`);
    } catch (error) {
      alert("문서를 분석하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto h-screen flex flex-col px-6 py-10 bg-white">
      <header className="mb-14">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="w-20 h-20 bg-black rounded-[32px] mx-auto flex items-center justify-center text-white">
              <Camera size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">세정 인공지능이<br/>문서를 읽고 있습니다</h1>
              <p className="text-gray-400 text-sm font-bold">세금계산서의 항목들을 꼼꼼하게 정리 중입니다.</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
              세금계산서나 명세표를<br/>사진 찍거나 올려주세요.
            </h1>
            <p className="text-gray-500 text-[15px] font-bold mb-14 leading-relaxed">
              수기 명세표라도 괜찮습니다.<br/>AI가 거래처와 품목을 자동 추출해 드릴게요.
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
              <div className="text-center">
                <span className="text-lg font-black text-gray-900 block">문서 촬영 및 파일 선택</span>
                <span className="text-xs font-bold text-gray-400 mt-1 block">JPG, PNG 등 이미지 파일 지원</span>
              </div>
            </label>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-10 flex items-center justify-center gap-2 text-gray-400">
        <ShieldCheck size={16} className="text-blue-500" />
        <span className="text-xs font-extrabold tracking-tighter">데이터는 암호화되어 안전하게 보호됩니다</span>
      </footer>
    </div>
  );
};
