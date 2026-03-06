import { useState } from 'react';
import './App.css';

interface Item {
  id: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  unitPrice: number;
}

function App() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: '기본형 스피드 도어', width: 3000, height: 3000, quantity: 1, unitPrice: 2500000 }
  ]);

  const [provider, setProvider] = useState({
    name: '스피드도어 솔루션',
    representative: '홍길동',
    address: '서울시 강남구 테헤란로 123',
    contact: '02-1234-5678',
    businessNo: '123-45-67890'
  });

  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    date: new Date().toISOString().split('T')[0]
  });

  const addItem = () => {
    const newItem: Item = {
      id: Math.random().toString(36).substr(2, 9),
      name: '스피드 도어 옵션 추가',
      width: 0,
      height: 0,
      quantity: 1,
      unitPrice: 0
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
            <input type="text" placeholder="대표자" value={provider.representative} onChange={e => setProvider({...provider, representative: e.target.value})} />
            <input type="text" placeholder="사업자번호" value={provider.businessNo} onChange={e => setProvider({...provider, businessNo: e.target.value})} />
            <input type="text" placeholder="주소" value={provider.address} onChange={e => setProvider({...provider, address: e.target.value})} />
            <input type="text" placeholder="연락처" value={provider.contact} onChange={e => setProvider({...provider, contact: e.target.value})} />
          </div>
        </div>

        <div className="form-section">
          <h3>수요자 정보</h3>
          <div className="grid">
            <input type="text" placeholder="고객명/업체명" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
            <input type="text" placeholder="연락처" value={customer.contact} onChange={e => setCustomer({...customer, contact: e.target.value})} />
            <input type="date" value={customer.date} onChange={e => setCustomer({...customer, date: e.target.value})} />
          </div>
        </div>

        <div className="items-section">
          <h3>품목 관리</h3>
          <table>
            <thead>
              <tr>
                <th>품명</th>
                <th>가로(mm)</th>
                <th>세로(mm)</th>
                <th>수량</th>
                <th>단가</th>
                <th>소계</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} /></td>
                  <td><input type="number" value={item.width} onChange={e => updateItem(item.id, 'width', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.height} onChange={e => updateItem(item.id, 'height', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} /></td>
                  <td><input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)} /></td>
                  <td>{(item.quantity * item.unitPrice).toLocaleString()}원</td>
                  <td><button onClick={() => removeItem(item.id)} className="btn-delete">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addItem} className="btn-add">+ 품목 추가</button>
        </div>

        <div className="summary-section">
          <div className="row"><span>공급가액:</span> <span>{subtotal.toLocaleString()}원</span></div>
          <div className="row"><span>부가세(10%):</span> <span>{vat.toLocaleString()}원</span></div>
          <div className="row total"><span>합계금액:</span> <span>{total.toLocaleString()}원</span></div>
        </div>

        <button onClick={() => window.print()} className="btn-print">PDF 저장 / 인쇄하기</button>
      </div>

      {/* 출력용 프리뷰 */}
      <div className="print-only quotation-sheet">
        <header>
          <h1>견 적 서</h1>
          <div className="quote-meta">
            <p>날짜: {customer.date}</p>
            <p>번호: SD-{customer.date.replace(/-/g, '')}-01</p>
          </div>
        </header>

        <section className="parties">
          <div className="customer-info">
            <p className="to-whom">귀하: {customer.name || '____________'}</p>
            <p>아래와 같이 견적합니다.</p>
            <div className="total-display">합계금액: ₩{total.toLocaleString()} (VAT포함)</div>
          </div>
          <div className="provider-info">
            <table>
              <tbody>
                <tr><th>사업자번호</th><td>{provider.businessNo}</td></tr>
                <tr><th>상 호</th><td>{provider.name}</td></tr>
                <tr><th>대 표 자</th><td>{provider.representative} (인)</td></tr>
                <tr><th>연 락 처</th><td>{provider.contact}</td></tr>
                <tr><th>주 소</th><td className="small-text">{provider.address}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <table className="items-table">
          <thead>
            <tr>
              <th>품명 및 규격 (W*H)</th>
              <th>수량</th>
              <th>단가</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name} ({item.width} x {item.height})</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toLocaleString()}</td>
                <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
            {/* 빈 행 채우기 (디자인용) */}
            {[...Array(Math.max(0, 8 - items.length))].map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                <td>&nbsp;</td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>공급가액</td>
              <td colSpan={2}>{subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={2}>부가세</td>
              <td colSpan={2}>{vat.toLocaleString()}</td>
            </tr>
            <tr className="grand-total">
              <td colSpan={2}>총 합 계</td>
              <td colSpan={2}>₩{total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <footer className="remarks">
          <p>※ 특이사항: 납기일 - 발주 후 7일 이내 / 결제조건 - 선금 50%, 잔금 설치 후 즉시</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
