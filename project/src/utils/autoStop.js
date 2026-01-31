const STOP_URL = '/vboard/finish';

// 用一个标记防止重复发送（pagehide / beforeunload / visibilitychange 都可能触发）
let sent = false;

function sendStopOnce() {
  if (sent) return;
  sent = true;

  // sendBeacon 需要一个 Body(Blob/FormData/ArrayBufferView等)，给个最小 JSON 就行
  const body = new Blob(['{}'], { type: 'application/json' });
  navigator.sendBeacon(STOP_URL, body);
}

export function installAutoStop() {
  // pagehide 是最推荐的（在移动端/微信里也靠谱）
  window.addEventListener('pagehide', sendStopOnce, { passive: true });

  // 兜底：标签页变隐藏时也尝试一次
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendStopOnce();
  });

  // 再兜底：某些旧浏览器只触发 beforeunload
  window.addEventListener('beforeunload', sendStopOnce, { passive: true });
}
