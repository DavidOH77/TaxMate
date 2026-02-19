import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Editor } from './pages/Editor';
import { Home } from './pages/Home';
import { InvoiceDraft, Party } from './types';
import { MOCK_MY_INFO } from './constants';

const App: React.FC = () => {
  // Load drafts from LocalStorage on init
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(() => {
    const saved = localStorage.getItem('taxmate_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  const [myInfo, setMyInfo] = useState<Party>(() => {
    const saved = localStorage.getItem('taxmate_my_info');
    return saved ? JSON.parse(saved) : MOCK_MY_INFO;
  });

  // Persist drafts whenever they change
  useEffect(() => {
    localStorage.setItem('taxmate_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Persist myInfo
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
      return [draft, ...prev]; // Newest first
    });
  };

  const deleteDraft = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setDrafts(prev => prev.filter(d => d.id !== id));
    }
  };

  const getDraft = (id: string) => drafts.find(d => d.id === id) || null;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-gray-900 font-sans">
      <HashRouter>
        <Routes>
          <Route 
            path="/" 
            element={<Home drafts={drafts} deleteDraft={deleteDraft} />} 
          />
          <Route 
            path="/upload" 
            element={<Upload onSave={saveDraft} myInfo={myInfo} />} 
          />
          <Route 
            path="/draft/:id" 
            element={
              <DraftLoader 
                getDraft={getDraft} 
                saveDraft={saveDraft} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

// Helper component to extract ID and pass specific draft
const DraftLoader = ({ getDraft, saveDraft }: { getDraft: (id: string) => InvoiceDraft | null, saveDraft: (d: InvoiceDraft) => void }) => {
  const { id } = useParams();
  const draft = id ? getDraft(id) : null;
  
  if (!draft) return <Navigate to="/" replace />;

  return <Editor draft={draft} updateDraft={saveDraft} />;
};

export default App;