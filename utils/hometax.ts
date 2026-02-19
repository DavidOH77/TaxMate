import * as XLSX from 'xlsx';
import { InvoiceDraft } from '../types';

/**
 * 홈택스 [전자세금계산서-일반(영세율) - 100건 이하] 엑셀 양식 생성
 * - 데이터는 7행부터 시작 (Row Index 6)
 * - 외국인(주민번호 13자리) 자동 감지 및 처리 로직 포함
 */
export const generateHomeTaxExcel = (drafts: InvoiceDraft[]) => {
  // 1. 홈택스 공식 헤더 (Row 6 in Excel / Index 5 in Array)
  // PDF 스크린샷의 텍스트와 순서를 정확히 따름
  const headerRow = [
    '전자(세금)계산서 종류\n(01:일반, 02:영세율)', // A
    '작성일자',              // B
    '공급자 등록번호\n("-" 없이 입력)', // C
    '공급자\n종사업장번호',   // D
    '공급자 상호',           // E
    '공급자 성명',           // F
    '공급자 사업장주소',     // G
    '공급자 업태',           // H
    '공급자 종목',           // I
    '공급자 이메일',         // J
    '공급받는자 등록번호\n("-" 없이 입력)',   // K
    '공급받는자\n종사업장번호', // L
    '공급받는자 상호',       // M
    '공급받는자 성명',       // N
    '공급받는자 사업장주소', // O
    '공급받는자 업태',       // P
    '공급받는자 종목',       // Q
    '공급받는자 이메일1',    // R
    '공급받는자 이메일2',    // S
    '공급가액\n합계',        // T
    '세액\n합계',            // U
    '비고',                  // V
    // 품목 1
    '일자1\n(2자리, 작성\n년월 제외)', '품목1', '규격1', '수량1', '단가1', '공급가액1', '세액1', '품목비고1',
    // 품목 2
    '일자2\n(2자리, 작성\n년월 제외)', '품목2', '규격2', '수량2', '단가2', '공급가액2', '세액2', '품목비고2',
    // 품목 3
    '일자3\n(2자리, 작성\n년월 제외)', '품목3', '규격3', '수량3', '단가3', '공급가액3', '세액3', '품목비고3',
    // 품목 4
    '일자4\n(2자리, 작성\n년월 제외)', '품목4', '규격4', '수량4', '단가4', '공급가액4', '세액4', '품목비고4',
    // 결제정보
    '현금', '수표', '어음', '외상미수금', 
    '영수(01),\n청구(02)' // 영수/청구 구분
  ];

  // 2. 상단 안내문구 (Rows 1-5 / Index 0-4)
  // 데이터 시작 위치(7행)를 맞추기 위한 Padding 겸 안내
  const titleRows = [
    ['엑셀 업로드 양식(전자세금계산서-일반(영세율)) - 100건 이하'], // Row 1
    ['○ 필수항목(주황색)은 반드시 입력하셔야 합니다.'],            // Row 2
    ['○ 7행부터 데이터를 입력하세요.'],                           // Row 3
    [''],                                                         // Row 4
    ['']                                                          // Row 5
  ];

  // 3. 데이터 매핑
  const dataRows = drafts.map(draft => {
    const bizNoSupplier = (draft.supplier.bizNo || '').replace(/[^0-9]/g, '');
    let bizNoBuyer = (draft.buyer.bizNo || '').replace(/[^0-9]/g, '');
    const dateClean = (draft.issueDate || '').replace(/-/g, ''); // YYYYMMDD
    
    // [중요] 외국인/주민번호 처리 로직
    // 홈택스 규칙: 외국인(주민번호)인 경우 등록번호에 '9999999999999' 입력 후
    // 실제 주민번호/여권번호는 '비고'란에 입력
    let remarks = '';
    if (bizNoBuyer.length === 13) {
      remarks = bizNoBuyer; // 실제 번호를 비고로 이동
      bizNoBuyer = '9999999999999'; // 고정값
    }

    // 품목 데이터 (최대 4개)
    const itemCells: string[] = [];
    const maxItems = 4;
    
    for (let i = 0; i < maxItems; i++) {
      const item = draft.items[i];
      if (item) {
        const day = draft.issueDate ? draft.issueDate.split('-')[2] : '';
        itemCells.push(
          day,                          // 일자
          item.name || '',              // 품목명
          item.spec || '',              // 규격
          String(item.qty || 0),        // 수량
          String(item.unitPrice || 0),  // 단가
          String(item.supplyAmount || 0),// 공급가액
          String(item.vatAmount || 0),  // 세액
          ''                            // 품목비고
        );
      } else {
        itemCells.push('', '', '', '', '', '', '', '');
      }
    }

    return [
      '01',                     // 전자세금계산서 종류 (01:일반)
      dateClean,                // 작성일자
      bizNoSupplier,            // 공급자 등록번호
      '',                       // 공급자 종사업장번호
      draft.supplier.name || '',// 공급자 상호
      draft.supplier.ceoName || '', // 공급자 성명
      draft.supplier.address || '', // 공급자 사업장주소
      '',                       // 공급자 업태
      '',                       // 공급자 종목
      draft.supplier.email || '', // 공급자 이메일
      bizNoBuyer,               // 공급받는자 등록번호 (Logic applied)
      '',                       // 공급받는자 종사업장번호
      draft.buyer.name || '',   // 공급받는자 상호
      draft.buyer.ceoName || '',// 공급받는자 성명
      draft.buyer.address || '',// 공급받는자 사업장주소
      '',                       // 공급받는자 업태
      '',                       // 공급받는자 종목
      draft.buyer.email || '',  // 공급받는자 이메일1
      '',                       // 공급받는자 이메일2
      String(draft.totalSupplyAmount || 0), // 공급가액 합계
      String(draft.totalVatAmount || 0),    // 세액 합계
      remarks,                  // 비고 (외국인 번호 포함)
      ...itemCells,             // 품목 1~4
      '', '', '', '',           // 현금/수표/어음/외상
      draft.billingType === '영수' ? '01' : '02' // 영수/청구
    ];
  });

  // 4. 시트 조합
  // Title(5 rows) + Header(1 row) + Data(N rows)
  const wsData = [...titleRows, headerRow, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 5. 셀 서식 강제 적용 (Text Format)
  // 홈택스 업로드 시 숫자 변환 오류 방지
  Object.keys(ws).forEach(key => {
    if (key.startsWith('!')) return;
    if (ws[key].v !== undefined) {
      ws[key].t = 's'; // Type = String
      ws[key].v = String(ws[key].v);
    }
  });

  // 6. 엑셀 파일 생성 및 다운로드
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "엑셀업로드양식");
  
  const fileName = `홈택스_업로드용_${drafts.length}건_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
