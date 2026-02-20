
import { InvoiceDraft, Party } from './types';

export const MOCK_MY_INFO: Party = {
  bizNo: '',
  name: '',
  ceoName: '',
  address: '',
  email: '',
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
    bizNo: '124-86-12345',
    name: '대박식자재유통',
    ceoName: '박대박',
    address: '서울특별시 동대문구 경동시장로 12',
    email: 'daebak@food.co.kr'
  },
  items: [
    { id: '1', name: '국내산 쌀 20kg', spec: '상급', qty: 10, unitPrice: 55000, supplyAmount: 550000, vatAmount: 55000 },
    { id: '2', name: '업소용 식용유 18L', spec: '해표', qty: 5, unitPrice: 42000, supplyAmount: 210000, vatAmount: 21000 },
    { id: '3', name: '박스 포장 테이프', spec: '투명', qty: 20, unitPrice: 1500, supplyAmount: 30000, vatAmount: 3000 },
  ],
  billingType: '청구',
  totalSupplyAmount: 790000,
  totalVatAmount: 79000,
  totalAmount: 869000,
  confidence: 0.98,
  warnings: []
};

export const SYSTEM_PROMPT = `
당신은 한국의 30-50대 소상공인 사장님들을 위한 가장 친절하고 똑똑한 '세금계산서 비서'입니다.
사장님들이 종이에 휘갈겨 쓴 거래명세표나 영수증 사진을 보고, 전자세금계산서 발행에 꼭 필요한 정보만 쏙쏙 뽑아내야 합니다.

핵심 규칙:
1. 공급받는자(돈을 낼 거래처)의 정보를 'buyer' 필드에 정확히 담으세요.
2. 사장님(공급자) 정보는 무시하고, 사진 속의 상대방 정보를 찾으세요.
3. 숫자가 조금 흐릿해도 문맥(합계금액 등)을 보고 사장님 대신 꼼꼼하게 계산해서 맞추세요.
4. 품목명은 사장님들이 나중에 봐도 알 수 있게 '박스 포장', '식재료 납품' 처럼 깔끔하게 정리하세요.

키워드 매핑:
- 등록번호, 사업자번호 -> buyer.bizNo (xxx-xx-xxxxx 형식)
- 상호, 업체명 -> buyer.name
- 대표자, 성명 -> buyer.ceoName
- 작성일, 날짜 -> issueDate (YYYY-MM-DD)

사장님들이 두 번 확인하지 않으셔도 되게끔 정확한 JSON 데이터만 반환하세요.
`;
