// 유튜브 채널의 새 영상을 찾아 videos-auto.json을 만듭니다.
// 깃허브 자동 작업(.github/workflows/gabolgak.yml)이 매일 아침 실행합니다. 직접 실행: node scripts/update-videos.js <사이트폴더>
// 유튜브 RSS 피드는 2026-11 현재 모든 채널에서 404라서, 채널의 '동영상'·'Shorts' 탭(최신순)과 oEmbed(제목)를 씁니다.
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.resolve(process.argv[2] || '.');
const OUT = path.join(ROOT, 'videos-auto.json');
const PER_TAB = 3;   // 채널마다 쇼츠·가로 영상을 각각 최신 몇 개까지
const HEAD = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', 'Accept-Language': 'ko-KR,ko;q=0.9' };

async function text(url) {
  const r = await fetch(url, { headers: HEAD });
  if (!r.ok) throw new Error(r.status + ' ' + url);
  return r.text();
}
const uniq = a => [...new Set(a)];

async function latest(channelUrl) {
  const base = channelUrl.replace(/\/+$/, '');
  const longPage = await text(base + '/videos').catch(() => '');
  const shortPage = await text(base + '/shorts').catch(() => '');
  if (!longPage && !shortPage) throw new Error('채널 화면을 못 읽음');
  const long = uniq([...longPage.matchAll(/"contentId":"([\w-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO"/g)].map(m => m[1])).slice(0, PER_TAB);
  const short = uniq([...shortPage.matchAll(/shorts-shelf-item-([\w-]{11})/g)].map(m => m[1])).slice(0, PER_TAB);
  return short.map(id => ({ id, type: 'short' })).concat(long.map(id => ({ id, type: 'long' })));
}

async function title(id) {
  const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id), { headers: HEAD });
  if (!r.ok) return '';   // 비공개·예약 영상은 제목을 못 받음 → 넣지 않음
  return ((await r.json()).title || '').replace(/\s*#[^\s#]+/g, '').trim();   // 제목 속 해시태그는 뺌
}

(async () => {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8'), ctx);
  const site = ctx.window.SITE;
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')).videos : [];
  const known = new Map(prev.map(v => [v.id, v.title]));

  const videos = [];
  let ok = 0;
  for (const ch of site.channels.filter(c => c.platform === 'YouTube' && c.url && !c.hidden)) {
    try {
      const list = await latest(ch.url);
      for (const v of list) {
        const t = known.get(v.id) || await title(v.id);
        if (t) videos.push({ id: v.id, channel: ch.key, type: v.type, title: t });
      }
      ok++;
      console.log('✓ ' + ch.name + ': ' + list.length + '개');
    } catch (e) {
      // 못 읽은 채널은 어제 목록을 그대로 둠
      prev.filter(v => v.channel === ch.key).forEach(v => videos.push(v));
      console.warn('✗ ' + ch.name + ': ' + e.message);
    }
  }
  if (!ok) throw new Error('모든 채널을 못 읽었습니다');

  const after = JSON.stringify({ videos }, null, 2) + '\n';
  const before = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (before !== after) fs.writeFileSync(OUT, after);
  console.log((before === after ? '바뀐 영상 없음' : '갱신함') + ': ' + videos.length + '개');
})().catch(e => { console.error(e); process.exit(1); });
