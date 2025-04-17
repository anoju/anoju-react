// src/pages/empty.tsx
const emptyPage = () => {
  return (
    <div>
      <h1>빈 페이지</h1>
    </div>
  );
};

// 이 부분이 중요합니다 - 페이지에 메타데이터 추가
emptyPage.metadata = {
  layout: 'empty', // EmptyLayout 사용 지정
};

export default emptyPage;
