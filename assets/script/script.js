document.querySelectorAll('.js-details').forEach(details => {
  const summary = details.querySelector('.js-summary');
  const content = details.querySelector('.js-content');

  content.style.maxHeight = '0'; // 初期設定

  summary.addEventListener('click', (event) => {
    event.preventDefault(); // デフォルトの挙動を防ぐ

    if (details.open) {
      // 閉じる処理
      details.classList.add('closing');
      content.style.maxHeight = `${content.scrollHeight}px`; // 現在の高さを設定
      requestAnimationFrame(() => {
        content.style.maxHeight = '0'; // アニメーション開始
      });
    } else {
      // 開く処理
      details.classList.add('opening');
      details.open = true; // `open`属性を即時適用
      content.style.maxHeight = '0'; // 高さをリセット
      requestAnimationFrame(() => {
        content.style.maxHeight = `${content.scrollHeight}px`; // アニメーション開始
      });
    }
  });

  content.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'max-height') {
      if (details.classList.contains('closing')) {
        details.open = false; // アニメーション完了後に閉じる
        details.classList.remove('closing');
      } else if (details.classList.contains('opening')) {
        details.classList.remove('opening');
        content.style.maxHeight = 'none'; // 開いた後に高さを無制限に
      }
    }
  });
});
