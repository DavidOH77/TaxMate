
import React from 'react';
import { Heart, Quote } from 'lucide-react';
import { Card } from './Card';

export const BrandStory: React.FC = () => {
  return (
    <div className="mt-20 px-1">
      <Card className="bg-[#FDFCF6] border-2 border-[#F3EFE0] !p-10 relative overflow-hidden rounded-[40px] shadow-sm">
        {/* 장식용 따뜻한 배경 요소 */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Quote className="text-orange-200 mb-6" size={40} fill="currentColor" />
          
          <h3 className="text-[20px] font-black text-gray-900 mb-8 leading-tight tracking-tight">
            "독수리 타법으로 고생하시던<br/>
            어머니를 위해 시작했습니다."
          </h3>
          
          {/* 글자 크기를 서비스 가이드와 맞춤 (text-[12px]) */}
          <div className="space-y-5 text-[12px] font-bold text-gray-500 leading-relaxed tracking-normal">
            <p>
              매일 밤, 장사를 마치고 불 켜진 식탁 앞에 앉아 
              <span className="text-gray-900 border-b-2 border-orange-200 px-0.5 mx-0.5">서툰 독수리 타법</span>으로 
              세금계산서를 일일이 입력하시던 어머니의 모습을 보았습니다.
            </p>
            <p>
              컴퓨터가 낯선 사장님들에게는 이 당연한 과정이 
              얼마나 큰 고단함인지 그때 알게 되었습니다. 
            </p>
            <p className="text-gray-700 font-black">
              세정은 그 고단함을 조금이라도 덜어드리기 위해 태어났습니다. 
              내부 기술은 복잡하고 정교하지만, 사장님이 쓰시는 방법은{" "}
              <span className="text-blue-600">세상에서 가장 쉬워야 한다</span>는 고집 하나로 만들었습니다.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-gray-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-50">
                <Heart size={18} className="text-red-400 fill-red-400" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">세정 팀 드림</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
