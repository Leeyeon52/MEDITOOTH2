import React, { useState, useEffect } from 'react';

interface TreatmentRecord {
  id: string;
  date: string; // ISO 문자열
  thumbnailUrl: string;
  keywords: string[]; // ['충치', '잇몸']
  summary: string;
  details: string;
}

const mockData: TreatmentRecord[] = [
  {
    id: '1',
    date: '2025-06-28T14:00:00Z',
    thumbnailUrl: '/images/sample1.jpg',
    keywords: ['충치'],
    summary: '충치 치료 완료',
    details: '상세 내용입니다...',
  },
  // ... 더미 데이터
];

const TreatmentHistory: React.FC = () => {
  const [records, setRecords] = useState<TreatmentRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TreatmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<{start?: string; end?: string}>({});
  const [selectedRecord, setSelectedRecord] = useState<TreatmentRecord | null>(null);

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // 실제 API 호출 시 여기에 fetch/axios 넣기
      const sortedData = [...mockData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(sortedData);
      setFilteredRecords(sortedData);
      setLoading(false);
    }, 1000);
  }, []);

  // 검색 및 필터링 처리
  useEffect(() => {
    let filtered = [...records];
    if (searchKeyword.trim()) {
      filtered = filtered.filter(record =>
        record.keywords.some(k => k.includes(searchKeyword.trim()))
      );
    }
    if (dateRange.start) {
      filtered = filtered.filter(record => new Date(record.date) >= new Date(dateRange.start!));
    }
    if (dateRange.end) {
      filtered = filtered.filter(record => new Date(record.date) <= new Date(dateRange.end!));
    }
    setFilteredRecords(filtered);
  }, [searchKeyword, dateRange, records]);

  if (loading) return <div>로딩 중...</div>;

  if (selectedRecord) {
    return (
      <div>
        <button onClick={() => setSelectedRecord(null)}>목록으로 돌아가기</button>
        <h2>진단 내역 상세 보기</h2>
        <p>날짜: {new Date(selectedRecord.date).toLocaleDateString()}</p>
        <img src={selectedRecord.thumbnailUrl} alt="진단 이미지" style={{width: '200px'}} />
        <p>요약: {selectedRecord.summary}</p>
        <p>상세 내용: {selectedRecord.details}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>이전 진단 내역</h1>

      <div>
        <input
          type="text"
          placeholder="키워드 검색 (예: 충치, 잇몸)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <input
          type="date"
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          value={dateRange.start || ''}
        />
        <input
          type="date"
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          value={dateRange.end || ''}
        />
      </div>

      <ul>
        {filteredRecords.length === 0 && <li>검색 결과가 없습니다.</li>}
        {filteredRecords.map(record => (
          <li key={record.id} style={{cursor: 'pointer'}} onClick={() => setSelectedRecord(record)}>
            <img src={record.thumbnailUrl} alt="썸네일" style={{width: 80, height: 80, objectFit: 'cover', marginRight: 10}} />
            <span>{new Date(record.date).toLocaleDateString()}</span>
            <span> - {record.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TreatmentHistory;
