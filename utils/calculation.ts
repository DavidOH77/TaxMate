import { InvoiceDraft, LineItem, Warning } from '../types';

export const calculateTotals = (items: LineItem[]) => {
  const totalSupply = items.reduce((acc, item) => acc + (item.supplyAmount || 0), 0);
  const totalVat = items.reduce((acc, item) => acc + (item.vatAmount || 0), 0);
  return {
    totalSupplyAmount: totalSupply,
    totalVatAmount: totalVat,
    totalAmount: totalSupply + totalVat
  };
};

export const validateDraft = (draft: InvoiceDraft): InvoiceDraft => {
  const warnings: Warning[] = [];

  // Check Totals
  const calcs = calculateTotals(draft.items);
  if (Math.abs((draft.totalAmount || 0) - calcs.totalAmount) > 10) {
    warnings.push({
      code: 'TOTAL_MISMATCH',
      message: '합계 금액이 품목 합계와 일치하지 않습니다.',
      fieldPath: 'totalAmount'
    });
  }

  // Check Buyer Info
  if (!draft.buyer.name) warnings.push({ code: 'MISSING_BUYER_NAME', message: '거래처명이 없습니다.', fieldPath: 'buyer.name' });
  if (!draft.buyer.bizNo) warnings.push({ code: 'MISSING_BIZ_NO', message: '사업자번호가 없습니다.', fieldPath: 'buyer.bizNo' });

  // Check Items
  if (draft.items.length === 0) {
    warnings.push({ code: 'NO_ITEMS', message: '품목이 없습니다.' });
  }

  draft.items.forEach((item, idx) => {
    if (!item.name) warnings.push({ code: 'MISSING_ITEM_NAME', message: `${idx + 1}번 품목명이 없습니다.`, fieldPath: `items[${idx}].name` });
    if ((item.qty || 0) <= 0) warnings.push({ code: 'INVALID_QTY', message: `${idx + 1}번 수량을 확인해주세요.`, fieldPath: `items[${idx}].qty` });
  });

  return { ...draft, warnings };
};

export const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '0';
  return new Intl.NumberFormat('ko-KR').format(val);
};

export const formatBizNo = (val: string | null) => {
    if (!val) return '';
    return val.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
};
