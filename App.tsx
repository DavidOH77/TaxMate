
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Editor } from './pages/Editor';
import { Home } from './pages/Home';
import { MyInfo } from './pages/MyInfo';
import { Intro } from './pages/Intro';
import { CreateChoice } from './pages/CreateChoice';
import { History } from './pages/History';
import { InvoiceDraft, Party } from './types';
import { MOCK_MY_INFO, EMPTY_DRAFT } from './constants';

const App: React.FC = () => {
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(() => {
    const saved = localStorage.getItem('taxmate_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  const [myInfo, setMyInfo] = useState<Party>(() => {
    const saved = localStorage.getItem('taxmate_my_info');
    return saved ? JSON.parse(saved) : MOCK_MY_INFO;
  });

  useEffect(() => {
    localStorage.setItem('taxmate_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('taxmate_my_info', JSON.stringify(myInfo));
  }, [myInfo]);

  const saveDraft = (draft: InvoiceDraft) => {
    setDrafts(prev => {
      const idx = prev.findIndex(d => d.id === draft.id);
      if (idx >= 0) {
        const newDrafts = [...prev];
        newDrafts[idx] = draft;
        return newDrafts;
      }
      return [draft, ...prev];
    });
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const getDraft = (id: string) => drafts.find(d => d.id === id) || null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto min-h-screen bg-[#F9FAFB] shadow-[0_0_50px_rgba(0,0,0,0.05)] relative">
        <HashRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Home drafts={drafts} deleteDraft={deleteDraft} onSave={saveDraft} />} 
            />
            <Route 
              path="/upload" 
              element={<Upload onSave={saveDraft} myInfo={myInfo} />} 
            />
            <Route 
              path="/create" 
              element={<CreateChoice onSave={saveDraft} />} 
            />
            <Route 
              path="/history" 
              element={<History drafts={drafts} />} 
            />
            <Route 
              path="/intro" 
              element={<Intro />} 
            />
            <Route 
              path="/my-info" 
              element={<MyInfo myInfo={myInfo} setMyInfo={setMyInfo} />} 
            />
            <Route 
              path="/draft/:id" 
              element={
                <DraftLoader 
                  getDraft={getDraft} 
                  saveDraft={saveDraft} 
                  deleteDraft={deleteDraft}
                  allDrafts={drafts}
                  myInfo={myInfo}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

const DraftLoader = ({ getDraft, saveDraft, deleteDraft, allDrafts, myInfo }: { 
  getDraft: (id: string) => InvoiceDraft | null, 
  saveDraft: (d: InvoiceDraft) => void, 
  deleteDraft: (id: string) => void, 
  allDrafts: InvoiceDraft[],
  myInfo: Party
}) => {
  const { id } = useParams();
  const location = useLocation();
  
  // AI 업로드 후 전달받은 임시 데이터가 있는 경우
  const tempDraft = location.state?.tempDraft;

  // 새 장부인 경우
  if (id === 'new') {
    const newDraft = tempDraft || { ...EMPTY_DRAFT, id: crypto.randomUUID(), supplier: myInfo };
    return <Editor draft={newDraft} isNew={true} updateDraft={saveDraft} deleteDraft={deleteDraft} allDrafts={allDrafts} />;
  }

  // AI 업로드는 항상 'new' 혹은 고유 ID로 오지만, 목록에 없는 경우 신규 취급
  const existingDraft = id ? getDraft(id) : null;
  const draft = existingDraft || tempDraft;

  if (!draft) return <Navigate to="/" replace />;
  
  return <Editor draft={draft} isNew={!existingDraft} updateDraft={saveDraft} deleteDraft={deleteDraft} allDrafts={allDrafts} />;
};

export default App;
