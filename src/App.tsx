import { useState } from 'react';
import './App.css';

interface Item {
  id: string;
  type: 'door' | 'option';
  name: string;
  unit: string;
  width: number;
  height: number;
  quantity: number;
  unitPrice: number;
  remarks: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', type: 'door', name: '기본형 스피드 도어', unit: 'SET', width: 3000, height: 3000, quantity: 1, unitPrice: 2500000, remarks: '' }
  ]);

  const [provider, setProvider] = useState({
    name: '주미산업',
    brandTagline: 'Industrial Solution Specialist',
    representative: '송제홍외 1명',
    address: '경기도 안산시 단원구 산단로 325, 3층 F-340호',
    contact: 'Tel: 02-3439-1888 / HP: 010-4857-9660 / Fax: 02-6442-1886',
    businessNo: '213-02-52092'
  });

  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [quoteNumber, setQuoteNumber] = useState(`SD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-01`);
  const [greeting, setGreeting] = useState('평소 베풀어 주신 각별한 성원에 감사드리며,\n아래와 같이 견적을 제출하오니 검토 부탁드립니다.');
  const [remarks, setRemarks] = useState('※ 납기일: 발주 후 30일 이내\n※ 결제조건: 선금 50%, 잔금 설치 후 즉시\n※ 부가세 포함 금액입니다.');

  const addItem = (type: 'door' | 'option') => {
    const newItem: Item = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: type === 'door' ? '스피드 도어 품목' : '옵션 항목 추가',
      unit: 'SET',
      width: 0,
      height: 0,
      quantity: 1,
      unitPrice: 0,
      remarks: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handlePrint = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // requestAnimationFrame으로 blur 처리 완료 후 인쇄 실행 (모바일 호환성)
    requestAnimationFrame(() => {
      window.print();
    });
  };

  const subtotal = calculateSubtotal();
  const vat = Math.floor(subtotal * 0.1);
  const total = subtotal + vat;

  return (
    <div className="container">
      <div className="quotation-card no-print">
        <h1>견적서 작성</h1>
        
        <div className="form-section">
          <h3>공급자 정보</h3>
          <div className="grid">
            <input type="text" placeholder="상호" value={provider.name} onChange={e => setProvider({...provider, name: e.target.value})} />
            <input type="text" placeholder="영문 상호 / 태그라인" value={provider.brandTagline} onChange={e => setProvider({...provider, brandTagline: e.target.value})} />
            <input type="text" placeholder="대표자" value={provider.representative} onChange={e => setProvider({...provider, representative: e.target.value})} />
            <input type="text" placeholder="사업자번호" value={provider.businessNo} onChange={e => setProvider({...provider, businessNo: e.target.value})} />
            <input type="text" placeholder="주소" value={provider.address} onChange={e => setProvider({...provider, address: e.target.value})} />
            <input type="text" placeholder="연락처" value={provider.contact} onChange={e => setProvider({...provider, contact: e.target.value})} />
          </div>
        </div>

        <div className="form-section">
          <h3>수요자 및 견적 정보</h3>
          <div className="grid">
            <input type="text" placeholder="고객명/업체명" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
            <input type="text" placeholder="연락처" value={customer.contact} onChange={e => setCustomer({...customer, contact: e.target.value})} />
            <input type="date" value={customer.date} onChange={e => {
              const newDate = e.target.value;
              setCustomer({...customer, date: newDate});
              setQuoteNumber(`SD-${newDate.replace(/-/g, '')}-01`);
            }} />
            <input type="text" placeholder="견적서 번호" value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} />
          </div>
          <textarea 
            className="remarks-input" 
            placeholder="상단에 표시될 고객사 안내 문구를 입력하세요."
            value={greeting}
            onChange={e => setGreeting(e.target.value)}
            rows={2}
          />
        </div>

        <div className="items-section">
          <h3>품목 관리 - 스피드도어</h3>
          <table>
            <thead>
              <tr>
                <th>품명</th>
                <th style={{ width: '80px' }}>단위</th>
                <th>가로(mm)</th>
                <th>세로(mm)</th>
                <th>수량</th>
                <th>단가</th>
                <th>비고</th>
                <th>소계</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.type === 'door').map(item => (
                <tr key={item.id}>
                  <td><input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} /></td>
                  <td><input type="text" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} /></td>
                  <td><input type="number" value={item.width} onChange={e => updateItem(item.id, 'width', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.height} onChange={e => updateItem(item.id, 'height', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="text" value={item.remarks} placeholder="비고" onChange={e => updateItem(item.id, 'remarks', e.target.value)} /></td>
                  <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  <td><button onClick={() => removeItem(item.id)} className="btn-delete">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addItem('door')} className="btn-add">+ 스피드도어 추가</button>
        </div>

        <div className="items-section">
          <h3>품목 관리 - 옵션항목</h3>
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>품명</th>
                <th style={{ width: '8%' }}>단위</th>
                <th style={{ width: '8%' }}>수량</th>
                <th style={{ width: '15%' }}>단가</th>
                <th style={{ width: '22%' }}>비고</th>
                <th style={{ width: '17%', textAlign: 'right', paddingRight: '20px' }}>소계</th>
                <th style={{ width: '5%' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.type === 'option').map(item => (
                <tr key={item.id}>
                  <td><input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} /></td>
                  <td><input type="text" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} /></td>
                  <td><input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="text" className="wide-input" value={item.remarks} placeholder="옵션 비고" onChange={e => updateItem(item.id, 'remarks', e.target.value)} /></td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  <td><button onClick={() => removeItem(item.id)} className="btn-delete">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addItem('option')} className="btn-add">+ 옵션항목 추가</button>
        </div>

        <div className="form-section">
          <h3>특이사항 및 비고</h3>
          <textarea 
            className="remarks-input" 
            placeholder="견적서 하단에 표시될 특이사항을 입력하세요."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={4}
          />
        </div>

        <div className="summary-section">
          <div className="row"><span>공급가액:</span> <span>{subtotal.toLocaleString()}원</span></div>
          <div className="row"><span>부가세(10%):</span> <span>{vat.toLocaleString()}원</span></div>
          <div className="row total"><span>합계금액:</span> <span>{total.toLocaleString()}원</span></div>
        </div>

        <button type="button" onClick={handlePrint} className="btn-print">PDF 저장 / 인쇄하기</button>
        <p className="print-tip">※ 페이지 주소와 시간 등이 출력되면 인쇄설정의 <strong>머리글/바닥글</strong> 체크를 해제해주세요.</p>
      </div>

      <div className="print-only quotation-sheet">
        <div className="sheet-border-top" />
        <header className="sheet-header">
          <div className="header-top">
            <div className="company-branding">
              <h2 className="brand-name">{provider.name}</h2>
              <p className="brand-tagline">{provider.brandTagline}</p>
            </div>
            <div className="doc-title-wrapper">
              <h1 className="doc-title">견 적 서</h1>
              <div className="doc-number">{quoteNumber}</div>
            </div>
          </div>
          
          <div className="header-bottom">
            <div className="client-box">
              <div className="label">RECIPIENT</div>
              <div className="client-name">{customer.name || '(상호를 입력하세요)'} <span className="honorific">귀하</span></div>
              <div className="client-contact">{customer.contact}</div>
              <div className="quote-intro">
                {greeting.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
            </div>
            <div className="provider-box">
              <div className="label">SENDER</div>
              <div className="provider-details">
                <div className="row"><span className="p-label">등록번호</span> {provider.businessNo}</div>
                <div className="row"><span className="p-label">상 호</span> {provider.name}</div>
                <div className="row"><span className="p-label">대 표 자</span> {provider.representative}</div>
                <div className="row"><span className="p-label">주 소</span> {provider.address}</div>
                <div className="row"><span className="p-label">연 락 처</span> {provider.contact}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="total-bar">
          <div className="total-label">견적 총 합계액 <span className="small">(VAT포함)</span></div>
          <div className="total-value">
            <span className="currency">KRW</span>
            <span className="amount">{total.toLocaleString()}</span>
          </div>
          <div className="issue-date">발행일: {customer.date}</div>
        </section>

        <table className="sheet-table">
          <thead>
            <tr>
              <th className="w-no">NO</th>
              <th className="w-desc">품명 및 규격</th>
              <th className="w-unit-name">단위</th>
              <th className="w-qty">수량</th>
              <th className="w-unit">단가</th>
              <th className="w-amount">금액</th>
              <th className="w-remarks">비고</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td className="center">{idx + 1}</td>
                <td className="desc-text">
                  {item.name} 
                  {item.type === 'door' && <br/>}
                  {item.type === 'door' && <small className="dim">{item.width} x {item.height} mm</small>}
                </td>
                <td className="center">{item.unit}</td>
                <td className="center">{item.quantity}</td>
                <td className="right">{item.unitPrice.toLocaleString()}</td>
                <td className="right">{(item.quantity * item.unitPrice).toLocaleString()}</td>
                <td className="center small-text">{item.remarks}</td>
              </tr>
            ))}
            {[...Array(Math.max(0, 10 - items.length))].map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                <td className="center">{items.length + i + 1}</td><td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sheet-footer">
          <div className="footer-left">
            <div className="remarks-box">
              <div className="label">SPECIAL NOTES / REMARKS</div>
              <div className="remarks-content">
                {remarks.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </div>
          <div className="footer-right">
            <div className="calc-row">
              <span className="c-label">공급가액 합계 (Subtotal)</span>
              <span className="c-value">{subtotal.toLocaleString()}</span>
            </div>
            <div className="calc-row">
              <span className="c-label">부가가치세 (VAT 10%)</span>
              <span className="c-value">{vat.toLocaleString()}</span>
            </div>
            <div className="calc-total">
              <span className="c-label">총 합계금액 (TOTAL)</span>
              <span className="c-value">₩ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="sheet-final">
          <p>견적 유효기간: 발행일로부터 15일</p>
          <div className="signature-area">
            <p>위와 같이 견적 하오니, 긍정적인 검토 부탁드립니다.</p>
            <div className="sign-box">{customer.date.split('-')[0]}년 {customer.date.split('-')[1]}월 {customer.date.split('-')[2]}일</div>
          </div>
        </div>

        <div className="sheet-strengths-page">
          <div className="strengths-header">
            <h3>해피게이트 문번 강점</h3>
            <div className="header-line" />
          </div>
          <div className="strengths-content">
            <ul className="strengths-list">
              <li><span className="bullet">01</span><p>1980년 아시아 최초로 개발된 스피드도어 전문 기업으로 업계를 선도하고 있는 기업입니다.</p></li>
              <li><span className="bullet">02</span><p>전국 A/S 망 구축으로 문제 발생시 빠른 처리가 가능합니다.</p></li>
              <li><span className="bullet">03</span><p>차 후 A/S 발생시 합리적인 수리비청구로 유지관리비용이 저렴합니다.</p></li>
              <li><span className="bullet">04</span><p>BLDC모터 사용으로 설치시 타사 대비 월등히 작은 크기로 공간활용성증대, 전력소비절감, 저소음 개폐가 가능합니다.</p></li>
              <li><span className="bullet">05</span><p>합리적인 이전 설치 비용으로 공장 리모델링 시에도 부담없이 이동이 가능합니다.</p></li>
              <li><span className="bullet">06</span><p>고장력강 파이프를 사용하여 충격에도 쉽게 변형되지 않고, 강풍에도 견고하게 버틸 수 있습니다.</p></li>
              <li><span className="bullet">07</span><p>재난 주관 방송사인 KBS에 재난 발생 피해를 막기 위해 설치하는 비상탈출문으로 보도된 제품을 보유하고 있습니다.</p></li>
            </ul>
            <div className="strengths-image">
              <img src="/image.webp" alt="Happy Gate Strength" />
            </div>
          </div>
          <div className="strengths-footer"><p>{provider.name}</p></div>
        </div>
      </div>
    </div>
  );
}

export default App;
