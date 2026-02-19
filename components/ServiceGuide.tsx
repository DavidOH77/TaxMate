
import React from 'react';
import { Camera, FileSpreadsheet, MousePointerClick, ShieldCheck } from 'lucide-react';
import { Card } from './Card';

export const ServiceGuide: React.FC = () => {
  const steps = [
    {
      icon: <Camera className="text-blue-500" size={24} />,
      title: "1. 사진 촬영 및 업로드",
      desc: "수기 거래명세표나 세금계산서를 촬영하거나 이미지 파일을 올려주세요. AI가 데이터를 즉시 추출합니다."
    },
    {
      icon: <MousePointerClick className="text-purple-500" size={24} />,
      title: "2. 추출 정보 검토",
      desc: "공급받는자 정보와 품목별 수량/단가가 맞는지 확인하세요. AI가 오타까지 잡아냅니다."
    },
    {
      icon: <FileSpreadsheet className="text-green-500" size={24} />,
      title: "3. 홈택스용 파일 생성",
      desc: "국세청 업로드 규격에 맞춘 엑셀 파일을 다운로드하여 번거로운 수동 입력을 끝내세요."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-[17px] font-black text-gray-900 mb-1">세정은 어떻게 도와주나요?</h2>
        <p className="text-xs font-bold text-gray-400">사장님의 장부 정리 시간을 90% 이상 줄여드립니다.</p>
      </div>
      
      <div className="grid gap-3">
        {steps.map((step, idx) => (
          <Card key={idx} className="!p-5 border-none bg-white shadow-sm flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl flex-shrink-0">
              {step.icon}
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 text-sm mb-1">{step.title}</h4>
              <p className="text-[12px] font-bold text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 rounded-[28px] p-6 flex items-center gap-4 border border-blue-100/50">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-[13px] font-black text-blue-900 mb-0.5">강력한 데이터 보안</p>
          <p className="text-[11px] font-bold text-blue-700/70">사장님의 소중한 거래처 정보는 암호화되어 안전하게 보호됩니다.</p>
        </div>
      </div>
    </div>
  );
};
