import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Zap, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { MOCK_DRAFT, EMPTY_DRAFT } from '../constants';
import { processWithGemini } from '../services/geminiService';
import { validateDraft } from '../utils/calculation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InvoiceDraft, Party } from '../types';

interface UploadProps {
  onSave: (draft: InvoiceDraft) => void;
  myInfo: Party;
}

export const Upload: React.FC<UploadProps> = ({ onSave, myInfo }) => {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);

  const handleProcess = async (file: File) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let draftData: InvoiceDraft;

      // Check if API Key exists in the environment
      const hasApiKey = !!process.env.API_KEY;

      if (useAI && hasApiKey) {
        // Assert API key presence as it is checked by hasApiKey
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
        console.log("Using Mock Data (No API Key or AI Disabled)");
        await new Promise(resolve => setTimeout(resolve, 1500));
        draftData = { 
          ...MOCK_DRAFT, 
          id: crypto.randomUUID(),
          supplier: myInfo,
          originalFileName: file.name 
        };
      }
      
      const validated = validateDraft(draftData);
      onSave(validated); // Save to App state

      // Check for missing critical fields to notify user
      const missingFields = validated.warnings
        .map(w => {
          if (w.code === 'MISSING_BIZ_NO') return '사업자번호';
          if (w.code === 'MISSING_BUYER_NAME') return '상호';
          if (w.code === 'NO_ITEMS') return '품목';
          if (w.code === 'TOTAL_MISMATCH') return '금액 합계';
          return null;
        })
        .filter((v, i, a) => v && a.indexOf(v) === i); // Unique filter

      navigate(`/draft/${validated.id}`, { state: { missingFields } });

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "문서 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcess(e.dataTransfer.files[0]);
    }
  }, [useAI]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcess(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col justify-center px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-1" /> 목록으로
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">세금계산서<br/>추가하기</h1>
        <p className="text-gray-500">거래명세표, 영수증 사진을 올려주세요.</p>
      </div>

      <div className="mb-6 flex justify-center">
        <button 
          onClick={() => setUseAI(!useAI)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${useAI ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <Zap size={16} className={useAI ? 'fill-blue-700' : ''} />
          {useAI ? 'AI 자동 분석 (ON)' : '체험 모드 (Mock)'}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card className={`
        relative border-2 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center gap-4 cursor-pointer
        ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
      `}>
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept="image/*,.pdf,.xlsx,.csv"
          onChange={onFileChange}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          disabled={loading}
        />
        
        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-bold text-gray-800">문서를 분석하고 있어요</p>
            <p className="text-sm text-gray-500 mt-1">
              {useAI ? '글자를 읽어내고 정리 중입니다...' : '잠시만 기다려주세요...'}
            </p>
          </div>
        ) : (
          <>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors ${useAI ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <UploadIcon size={32} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">
                사진/파일 업로드
              </p>
              <p className="text-sm text-gray-500 mt-1">또는 여기로 드래그하세요</p>
            </div>
          </>
        )}
      </Card>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={14} />
        <span>개인정보는 안전하게 보호됩니다 (로컬 처리)</span>
      </div>
    </div>
  );
};