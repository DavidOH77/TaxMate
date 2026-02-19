
import React from 'react';
import { InvoiceDraft } from '../types';
import { formatCurrency, formatBizNo } from '../utils/calculation';

interface TaxInvoiceFormProps {
  draft: InvoiceDraft;
  id?: string;
}

export const TaxInvoiceForm: React.FC<TaxInvoiceFormProps> = ({ draft, id = "tax-invoice-form" }) => {
  const { supplier, buyer, items, issueDate, totalSupplyAmount, totalVatAmount, totalAmount } = draft;
  
  // 날짜 쪼개기
  const [year, month, day] = (issueDate || '').split('-');

  return (
    <div id={id} className="w-[800px] bg-white p-6 border-[3px] border-blue-600 text-[11px] font-medium leading-tight text-gray-900 mx-auto">
      {/* Header */}
      <div className="flex border-b-[3px] border-blue-600">
        <div className="flex-1 flex items-center justify-center border-r-[3px] border-blue-600 py-4">
          <h1 className="text-3xl font-black tracking-[0.5em] text-blue-600 ml-[0.5em]">세금계산서</h1>
          <span className="text-xs font-bold text-blue-600">(공급자 보관용)</span>
        </div>
        <div className="w-48 flex flex-col">
          <div className="flex border-b border-blue-600">
            <div className="w-16 bg-blue-50 border-r border-blue-600 p-1 text-center font-bold">권</div>
            <div className="flex-1 p-1"></div>
            <div className="w-16 bg-blue-50 border-l border-r border-blue-600 p-1 text-center font-bold">호</div>
            <div className="flex-1 p-1"></div>
          </div>
          <div className="flex flex-1">
             <div className="w-16 bg-blue-50 border-r border-blue-600 p-1 text-center font-bold flex items-center justify-center">일련번호</div>
             <div className="flex-1 p-1"></div>
          </div>
        </div>
      </div>

      {/* Parties Info */}
      <div className="flex border-b-[3px] border-blue-600">
        {/* Supplier (Left) */}
        <div className="w-[25px] bg-blue-50 border-r border-blue-600 flex items-center justify-center font-bold text-center py-2 leading-tight">
          공<br/>급<br/>자
        </div>
        <div className="flex-1 grid grid-cols-12 border-r-[3px] border-blue-600">
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center flex items-center justify-center font-bold">등록번호</div>
          <div className="col-span-10 border-b border-blue-600 p-2 text-lg font-black tracking-widest flex items-center justify-center">
            {formatBizNo(supplier.bizNo)}
          </div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">상호<br/>(법인명)</div>
          <div className="col-span-4 border-b border-r border-blue-600 p-2 flex items-center font-bold">{supplier.name}</div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">성명<br/>(대표자)</div>
          <div className="col-span-4 border-b border-blue-600 p-2 flex items-center font-bold">{supplier.ceoName}</div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">사업장<br/>주소</div>
          <div className="col-span-10 border-b border-blue-600 p-2 font-bold">{supplier.address}</div>
          <div className="col-span-2 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">업태</div>
          <div className="col-span-4 border-r border-blue-600 p-2 font-bold"></div>
          <div className="col-span-2 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">종목</div>
          <div className="col-span-4 p-2 font-bold"></div>
        </div>

        {/* Buyer (Right) */}
        <div className="w-[25px] bg-blue-50 border-r border-blue-600 flex items-center justify-center font-bold text-center py-2 leading-tight">
          공<br/>급<br/>받<br/>는<br/>자
        </div>
        <div className="flex-1 grid grid-cols-12">
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center flex items-center justify-center font-bold">등록번호</div>
          <div className="col-span-10 border-b border-blue-600 p-2 text-lg font-black tracking-widest flex items-center justify-center">
            {formatBizNo(buyer.bizNo)}
          </div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">상호<br/>(법인명)</div>
          <div className="col-span-4 border-b border-r border-blue-600 p-2 flex items-center font-bold">{buyer.name}</div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">성명<br/>(대표자)</div>
          <div className="col-span-4 border-b border-blue-600 p-2 flex items-center font-bold">{buyer.ceoName}</div>
          <div className="col-span-2 bg-blue-50 border-b border-r border-blue-600 p-2 text-center font-bold">사업장<br/>주소</div>
          <div className="col-span-10 border-b border-blue-600 p-2 font-bold">{buyer.address}</div>
          <div className="col-span-2 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">업태</div>
          <div className="col-span-4 border-r border-blue-600 p-2 font-bold"></div>
          <div className="col-span-2 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">종목</div>
          <div className="col-span-4 p-2 font-bold"></div>
        </div>
      </div>

      {/* Middle Totals */}
      <div className="grid grid-cols-10 border-b-[3px] border-blue-600">
        <div className="col-span-2 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">작성일자</div>
        <div className="col-span-4 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">공급가액</div>
        <div className="col-span-3 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">세액</div>
        <div className="col-span-1 bg-blue-50 p-2 text-center font-bold">비고</div>
        
        <div className="col-span-2 border-r border-blue-600 flex items-center justify-center gap-2 font-black text-[13px] py-2">
          <span>{year}</span>
          <span>{month}</span>
          <span>{day}</span>
        </div>
        <div className="col-span-4 border-r border-blue-600 px-4 flex items-center justify-end font-black text-lg py-2">
          {formatCurrency(totalSupplyAmount)}
        </div>
        <div className="col-span-3 border-r border-blue-600 px-4 flex items-center justify-end font-black text-lg py-2">
          {formatCurrency(totalVatAmount)}
        </div>
        <div className="col-span-1 py-2 px-1 text-[9px] break-all"></div>
      </div>

      {/* Items List */}
      <div className="border-b-[3px] border-blue-600">
        <div className="grid grid-cols-12 bg-blue-50 border-b border-blue-600 font-bold text-center py-1">
          <div className="col-span-1 border-r border-blue-600">월.일</div>
          <div className="col-span-4 border-r border-blue-600">품목</div>
          <div className="col-span-1 border-r border-blue-600">규격</div>
          <div className="col-span-1 border-r border-blue-600">수량</div>
          <div className="col-span-1 border-r border-blue-600">단가</div>
          <div className="col-span-2 border-r border-blue-600">공급가액</div>
          <div className="col-span-1 border-r border-blue-600">세액</div>
          <div className="col-span-1">비고</div>
        </div>
        {[...Array(4)].map((_, i) => {
          const item = items[i];
          return (
            <div key={i} className="grid grid-cols-12 border-b border-blue-600 min-h-[28px] items-center text-center">
              <div className="col-span-1 border-r border-blue-600 py-1">{item ? `${month}.${day}` : ''}</div>
              <div className="col-span-4 border-r border-blue-600 py-1 px-2 text-left font-bold">{item?.name || ''}</div>
              <div className="col-span-1 border-r border-blue-600 py-1">{item?.spec || ''}</div>
              <div className="col-span-1 border-r border-blue-600 py-1">{item?.qty ? formatCurrency(item.qty) : ''}</div>
              <div className="col-span-1 border-r border-blue-600 py-1 text-right px-1">{item?.unitPrice ? formatCurrency(item.unitPrice) : ''}</div>
              <div className="col-span-2 border-r border-blue-600 py-1 text-right px-2 font-bold">{item?.supplyAmount ? formatCurrency(item.supplyAmount) : ''}</div>
              <div className="col-span-1 border-r border-blue-600 py-1 text-right px-2 font-bold">{item?.vatAmount ? formatCurrency(item.vatAmount) : ''}</div>
              <div className="col-span-1 py-1"></div>
            </div>
          );
        })}
      </div>

      {/* Footer Totals */}
      <div className="grid grid-cols-12 border-b border-blue-600">
        <div className="col-span-3 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">합계금액</div>
        <div className="col-span-1 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">현금</div>
        <div className="col-span-1 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">수표</div>
        <div className="col-span-1 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">어음</div>
        <div className="col-span-1 bg-blue-50 border-r border-blue-600 p-2 text-center font-bold">외상미수금</div>
        <div className="col-span-5 bg-blue-50 p-2 text-center font-bold text-sm">
          이 금액을 <span className="underline decoration-[3px] underline-offset-4 mx-2 font-black text-lg text-blue-600">{draft.billingType || '청구'}</span> 함
        </div>
        
        <div className="col-span-3 border-r border-blue-600 p-2 text-right font-black text-lg">
          {formatCurrency(totalAmount)}
        </div>
        <div className="col-span-1 border-r border-blue-600 p-2"></div>
        <div className="col-span-1 border-r border-blue-600 p-2"></div>
        <div className="col-span-1 border-r border-blue-600 p-2"></div>
        <div className="col-span-1 border-r border-blue-600 p-2"></div>
        <div className="col-span-5 flex items-center justify-center">
           <span className="text-gray-300 italic font-bold">Sejeong Tax Assistant</span>
        </div>
      </div>
    </div>
  );
};
