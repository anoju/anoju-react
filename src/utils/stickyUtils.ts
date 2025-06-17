// src/utils/stickyUtils.ts
// 스크롤 방향에 따른 sticky 높이 계산 함수
export function getStickyHeightForScroll(targetY: number): number {
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
  const htmlElement = document.documentElement;
  
  // 스크롤 방향 결정
  const isScrollingDown = targetY > currentScrollY;
  
  if (isScrollingDown) {
    // 아래로 스크롤: hideScrolling 요소들이 숨겨질 수 있으므로 min-height 사용
    const minHeight = htmlElement.style.getPropertyValue('--sticky-min-height');
    return parseInt(minHeight) || 0;
  } else {
    // 위로 스크롤: hideScrolling 요소들이 보여질 수 있으므로 max-height 사용
    const maxHeight = htmlElement.style.getPropertyValue('--sticky-max-height');
    return parseInt(maxHeight) || 0;
  }
}
