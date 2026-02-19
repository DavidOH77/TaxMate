import { InvoiceDraft, Party } from './types';

export const MOCK_MY_INFO: Party = {
  bizNo: '123-45-67890',
  name: '대박상사',
  ceoName: '김사장',
  address: '서울시 강남구 테헤란로 123',
  email: 'boss@daebak.com',
};

export const EMPTY_DRAFT: InvoiceDraft = {
  id: '',
  issueDate: new Date().toISOString().split('T')[0],
  supplier: MOCK_MY_INFO,
  buyer: {
    bizNo: null,
    name: null,
    ceoName: null,
    address: null,
    email: null
  },
  items: [],
  billingType: '청구',
  totalSupplyAmount: 0,
  totalVatAmount: 0,
  totalAmount: 0,
  confidence: 0,
  warnings: []
};

export const MOCK_DRAFT: InvoiceDraft = {
  id: 'mock-1',
  issueDate: new Date().toISOString().split('T')[0],
  supplier: MOCK_MY_INFO,
  buyer: {
    bizNo: '987-65-43210',
    name: '희망유통',
    ceoName: '이희망',
    address: '경기도 성남시 분당구 판교로 99',
    email: 'lee@hope.co.kr'
  },
  items: [
    { id: '1', name: '고급 사무용 의자', spec: 'Black/Mesh', qty: 5, unitPrice: 150000, supplyAmount: 750000, vatAmount: 75000 },
    { id: '2', name: '이동식 서랍장', spec: '3단', qty: 5, unitPrice: 45000, supplyAmount: 225000, vatAmount: 22500 },
    { id: '3', name: '멀티탭 6구', spec: '3m', qty: 10, unitPrice: 12000, supplyAmount: 120000, vatAmount: 12000 },
  ],
  billingType: '청구',
  totalSupplyAmount: 1095000,
  totalVatAmount: 109500,
  totalAmount: 1204500,
  confidence: 0.95,
  warnings: []
};

export const SYSTEM_PROMPT = `
You are a highly skilled specialized OCR engine for Korean Business Documents (Transaction Statements, Receipts, Purchase Orders).
Your goal is to extract data for "Electronic Tax Invoice Issuance".

CRITICAL RULE:
- You must extract the "Buyer" (Recipient/Customer) information into the 'buyer' field.
- The "Supplier" is the user. If the document lists both Supplier (공급자) and Buyer (공급받는자), extract the 'Buyer' side.
- If the document is a Purchase Order (주문서/발주서), the entity sending the order is the 'buyer'.
- Do NOT repeat characters endlessly (e.g. 111111...). If a value is unclear, stop or use null.

KEYWORD MAPPING (Korean -> JSON):
- 등록번호, 사업자등록번호, 사업자번호 -> buyer.bizNo (Format: xxx-xx-xxxxx)
- 상호, 상호(법인명), 법인명, 업체명 -> buyer.name
- 성명, 대표자, 대표, 대표자성명 -> buyer.ceoName
- 주소, 사업장소재지 -> buyer.address
- 작성, 작성일자, 거래일자, 발행일 -> issueDate (YYYY-MM-DD)
- 합계금액 -> totalAmount
- 공급가액 -> totalSupplyAmount
- 세액 -> totalVatAmount

INSTRUCTIONS:
1. Scan the image for any text resembling a Business Registration Number (10 digits, often hyphenated).
2. Look for the Company Name usually located near the Registration Number.
3. Extract Line Items (품목) in detail.
4. If values are handwritten, do your best to transcribe them.
5. Return ONLY valid JSON.
`;