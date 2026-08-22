(() => {
  const frame = document.querySelector('[data-responsive-artboard]');
  if (!frame) return;

  const artboard = frame.querySelector('.artboard');
  if (!artboard) return;

  const width = Number(frame.dataset.artboardWidth || 1440);
  const height = Number(frame.dataset.artboardHeight || 1024);

  const updateScale = () => {
    const viewport = window.visualViewport;
    const viewportWidth = viewport ? viewport.width : window.innerWidth;
    const viewportHeight = viewport ? viewport.height : window.innerHeight;
    const isIntroPortfolio = artboard.classList.contains('A2-Portfolio');
    const isPortraitTablet =
      viewportWidth >= 600 &&
      viewportWidth <= 1024 &&
      viewportHeight > viewportWidth;
    const isPortraitPhone =
      viewportWidth < 600 &&
      viewportHeight > viewportWidth;
    const displayWidth = (isPortraitPhone || isPortraitTablet) ? height : width;
    const displayHeight = (isPortraitPhone || isPortraitTablet) ? width : height;
    const scaleByWidth = viewportWidth / displayWidth;
    const scaleByHeight = viewportHeight / displayHeight;

    /* Intro phone phủ kín màn hình; các trang book phone giữ trọn bố cục tablet. */
    const scale = isPortraitPhone && isIntroPortfolio
      ? Math.max(scaleByWidth, scaleByHeight)
      : Math.min(scaleByWidth, scaleByHeight);
    const horizontalGap = Math.max(0, viewportWidth - displayWidth * scale);
    const verticalGap = Math.max(0, viewportHeight - displayHeight * scale);
    const leftInset = frame.dataset.align === 'left'
      ? Math.min(24, horizontalGap)
      : horizontalGap / 2;
    const bottomInset = frame.dataset.alignY === 'bottom'
      ? Math.min(24, verticalGap)
      : verticalGap / 2;

    artboard.style.setProperty('--artboard-scale', String(scale));
    artboard.style.setProperty('--artboard-rotation', '0deg');
    artboard.style.setProperty('--artboard-offset-x', `${leftInset - horizontalGap / 2}px`);
    artboard.style.setProperty('--artboard-offset-y', `${verticalGap / 2 - bottomInset}px`);

    /*
      Artwork Intro trên desktop phủ theo chiều cao và neo sang phải.
      Tablet phủ theo chiều ngang và neo xuống đáy. Phone scale cả bố cục
      tablet để chữ và hình luôn có cùng tương quan.
      Phần chữ vẫn giữ nguyên vị trí trên artboard.
    */
    const isPortraitIntro = isPortraitPhone || isPortraitTablet;
    const introArtworkScale = isPortraitPhone
      ? 1
      : isPortraitTablet
        ? viewportWidth / (displayWidth * scale)
        : viewportHeight / (height * scale);
    const introArtworkOffsetX = isPortraitIntro ? 0 : horizontalGap / (2 * scale);
    const introArtworkOffsetY = isPortraitTablet ? bottomInset / scale : 0;
    artboard.style.setProperty('--intro-artwork-scale', String(introArtworkScale));
    artboard.style.setProperty('--intro-artwork-offset-x', `${introArtworkOffsetX}px`);
    artboard.style.setProperty('--intro-artwork-offset-y', `${introArtworkOffsetY}px`);

    /* Phone dùng lại toàn bộ quy tắc sắp xếp dọc đã thiết kế cho tablet. */
    artboard.classList.toggle('is-portrait-tablet', isPortraitTablet || isPortraitPhone);
    artboard.classList.toggle('is-portrait-phone', isPortraitPhone);
  };

  updateScale();
  window.addEventListener('resize', updateScale, { passive: true });
  window.addEventListener('orientationchange', updateScale, { passive: true });
  window.visualViewport?.addEventListener('resize', updateScale, { passive: true });
})();
