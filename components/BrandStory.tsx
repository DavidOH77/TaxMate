import React from 'react';
import { Heart, Quote } from 'lucide-react';
import { Card } from './Card';

export const BrandStory: React.FC = () => {
  return (
    <div className="mt-16 px-1">
      <Card className="bg-[#FDFCF6] border-[#F3EFE0] !p-8 relative overflow-hidden">
        {/* 장식용 따뜻한 배경 요소 */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100/30 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <Quote className="text-orange-200 mb-4" size={32} fill="currentColor" />
          
          <h3 className="text-[17px] font-black text-gray-900 mb-4 leading-snug">
            "독수리 타법으로 고생하시던<br/>
            어머니를 위해 시작했습니다."
          </h3>
          
          <div className="space-y-4 text-[13px] font-bold text-gray-600 leading-relaxed">
            <p>
              매일 밤, 장사를 마치고 불 켜진 식탁 앞에 앉아 
              <span className="text-gray-900 border-b-2 border-orange-200 px-0.5">서툰 독수리 타법</span>으로 세금계산서를 일일이 입력하시던 
              어머니의 모습을 보았습니다.
            </p>
            <p>
              컴퓨터가 낯선 사장님들에게는 이 당연한 과정이 
              얼마나 큰 고단함인지 알게 되었습니다. 
            </p>
            <p className="text-gray-900">
              세정은 그 고단함을 덜어드리기 위해 태어났습니다. 
              기술은 복잡하지만, 사장님이 쓰시는 방법은 
              <span className="text-blue-600">세상에서 가장 쉬워야 한다</span>는 고집으로 만들었습니다.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                <Heart size={14} className="text-red-400 fill-red-400" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">세정 팀 드림</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};