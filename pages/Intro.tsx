
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Plus, User, BookOpen, FileSearch } from 'lucide-react';
import { ServiceGuide } from '../components/ServiceGuide';
import { BrandStory } from '../components/BrandStory';
import { Logo } from '../components/Logo';

export const Intro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-[#F9FAFB] pb-40">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 h-24 flex items-center shadow-sm transition-all">
        <Logo size={24} showTagline={true} />
      </header>

      <main className="px-6 pt-4 space-y-10">
        <ServiceGuide />
        <BrandStory />

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[10px] font-black tracking-widest uppercase italic">Tax Organizing Service: SEJEONG</p>
        </footer>
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

        <button onClick={() => navigate('/intro')} className="flex flex-col items-center gap-1 text-white w-12">
          <BookOpen size={20} fill="currentColor" />
          <span className="text-[9px] font-black">소개</span>
        </button>
        <button onClick={() => navigate('/my-info')} className="flex flex-col items-center gap-1 text-gray-500 w-12">
          <User size={20} />
          <span className="text-[9px] font-black">내정보</span>
        </button>
      </nav>
    </div>
  );
};
