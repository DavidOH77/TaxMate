
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Plus, User, Building2, UserCircle, MapPin, Mail, Sparkles, BookOpen, FileSearch } from 'lucide-react';
import { Party } from '../types';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

interface MyInfoProps {
  myInfo: Party;
  setMyInfo: (info: Party) => void;
}

export const MyInfo: React.FC<MyInfoProps> = ({ myInfo, setMyInfo }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Party>({ ...myInfo });

  const handleSave = () => {
    setMyInfo(formData);
    alert('사장님의 소중한 정보가 안전하게 저장되었습니다.');
    navigate('/');
  };

  const updateField = (field: keyof Party, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-[#F9FAFB] pb-40">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-24 flex items-center shadow-sm transition-all">
        <Logo size={24} showTagline={true} />
      </header>

      <main className="px-6 pt-8 space-y-10">
        <section className="space-y-6">
          <div className="px-1 flex items-center justify-between">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">내 사업자 정보</h1>
            <span className="text-[11px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md italic">공급자 정보</span>
          </div>

          <Card className="space-y-8 border-none shadow-sm !p-8">
            <InputField 
              icon={<Building2 size={18} />} 
              label="상호 (업체명)" 
              value={formData.name || ''} 
              onChange={(v: string) => updateField('name', v)} 
              placeholder="예: 세정상사"
            />
            <InputField 
              icon={<Sparkles size={18} />} 
              label="사업자 등록번호" 
              value={formData.bizNo || ''} 
              onChange={(v: string) => updateField('bizNo', v)} 
              placeholder="예: 000-00-00000"
            />
            <InputField 
              icon={<UserCircle size={18} />} 
              label="대표자 성명" 
              value={formData.ceoName || ''} 
              onChange={(v: string) => updateField('ceoName', v)} 
              placeholder="예: 홍길동"
            />
            <InputField 
              icon={<MapPin size={18} />} 
              label="사업장 주소" 
              value={formData.address || ''} 
              onChange={(v: string) => updateField('address', v)} 
              placeholder="도로명 주소 입력"
            />
            <InputField 
              icon={<Mail size={18} />} 
              label="이메일 주소" 
              value={formData.email || ''} 
              onChange={(v: string) => updateField('email', v)} 
              placeholder="예: boss@company.com"
            />
          </Card>
        </section>

        <section className="px-2">
          <Button 
            fullWidth 
            onClick={handleSave} 
            className="h-16 rounded-2xl text-[16px] font-black shadow-xl shadow-blue-600/10 bg-blue-600 hover:bg-blue-700"
          >
            위 내용으로 내 정보 저장하기
          </Button>
          <p className="mt-6 text-center text-[12px] font-bold text-gray-300 px-6 leading-relaxed">
            여기에 입력한 정보는 세금계산서 생성 시<br/>'공급자' 정보로 자동 입력됩니다.
          </p>
        </section>
      </main>

      <nav className="fixed bottom-8 left-6 right-6 max-w-lg mx-auto h-20 bg-gray-900 rounded-[32px] shadow-2xl shadow-black/20 flex items-center justify-between px-6 z-50 border border-white/10 backdrop-blur-lg">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <HomeIcon size={20} />
          <span className="text-[9px] font-black">장부홈</span>
        </button>
        <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <FileSearch size={20} />
          <span className="text-[9px] font-black">증빙매칭</span>
        </button>
        
        <button 
          onClick={() => navigate('/create')} 
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 active:scale-90 transition-all -translate-y-2 border-4 border-gray-900"
        >
          <Plus size={32} strokeWidth={4} />
        </button>

        <button onClick={() => navigate('/intro')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <BookOpen size={20} />
          <span className="text-[9px] font-black">소개</span>
        </button>
        <button onClick={() => navigate('/my-info')} className="flex flex-col items-center gap-1 text-white w-12">
          <User size={20} fill="currentColor" />
          <span className="text-[9px] font-black">내정보</span>
        </button>
      </nav>
    </div>
  );
};

const InputField = ({ icon, label, value, onChange, placeholder }: any) => (
  <div className="group">
    <label className="block text-[13px] font-black text-gray-400 uppercase tracking-tight mb-2.5 ml-1 flex items-center gap-2">
      {icon && <span className="text-gray-300 group-focus-within:text-blue-500 transition-colors">{icon}</span>}
      {label}
    </label>
    <input 
      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-[15px] font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all placeholder:text-gray-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
