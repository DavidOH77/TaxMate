export interface Party {
  bizNo: string | null;
  name: string | null; // 상호
  ceoName?: string | null;
  address?: string | null;
  email?: string | null;
}

export interface LineItem {
  id: string; // Internal ID for UI
  name: string | null;
  spec?: string | null;
  qty: number | null;
  unitPrice: number | null;
  supplyAmount: number | null;
  vatAmount: number | null;
}

export interface Warning {
  code: string;
  message: string;
  fieldPath?: string;
}

export interface InvoiceDraft {
  id: string;
  issueDate: string | null; // YYYY-MM-DD
  supplier: Party; // 내 정보
  buyer: Party; // 거래처 정보
  items: LineItem[];
  billingType: '청구' | '영수' | null;
  totalSupplyAmount: number | null;
  totalVatAmount: number | null;
  totalAmount: number | null;
  confidence: number;
  warnings: Warning[];
  originalFileName?: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export interface AppState {
  currentDraft: InvoiceDraft | null;
  status: ProcessingStatus;
  useAI: boolean;
  myInfo: Party;
}