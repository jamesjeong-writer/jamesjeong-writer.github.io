// '오늘의 가볼각' 최신 글을 네이버 블로그 공개 RSS에서 읽어 gabolgak.json과 대표 사진을 만듭니다.
// 깃허브 자동 작업(.github/workflows/gabolgak.yml)이 매일 아침 실행합니다. 직접 실행: node scripts/update-gabolgak.js <사이트폴더>
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const BLOG = 'thebetterlove', COUNT = 4;
const ROOT = path.resolve(process.argv[2] || '.');
const IMG_DIR = path.join(ROOT, 'img', 'gabolgak');
const HEAD = { 'User-Agent': 'Mozilla/5.0 (jamesjeong-writer.github.io updater)', 'Referer': 'https://blog.naver.com/' };

const unwrap = s => (s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
const unescape = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const pick = (xml, tag) => unwrap((xml.match(new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>')) || [])[1]);
const plain = html => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

async function get(url, as) {
  const r = await fetch(url, { headers: HEAD });
  if (!r.ok) throw new Error(r.status + ' ' + url);
  return as === 'buf' ? Buffer.from(await r.arrayBuffer()) : r.text();
}

(async () => {
  const rss = await get('https://rss.blog.naver.com/' + BLOG + '.xml');
  const items = (rss.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, COUNT);
  if (!items.length) throw new Error('RSS에 글이 없습니다');
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const posts = [];
  for (const it of items) {
    const url = pick(it, 'link').split('?')[0];
    const logNo = url.split('/').pop();
    const title = plain(pick(it, 'title'));
    let summary = plain(pick(it, 'description'));
    if (summary.startsWith(title)) summary = summary.slice(title.length).trim();
    if (summary.length > 70) summary = summary.slice(0, 70).trim() + '…';
    const d = new Date(pick(it, 'pubDate'));
    const kst = new Date(d.getTime() + 9 * 3600e3);

    // 대표 사진: 글 화면의 og:image (네이버는 다른 사이트에서 바로 띄우면 막으므로 사본을 저장)
    let img = '';
    try {
      const page = await get('https://blog.naver.com/PostView.naver?blogId=' + BLOG + '&logNo=' + logNo);
      const src = unescape((page.match(/property="og:image" content="([^"]+)"/) || [])[1] || '');
      if (src) {
        const file = logNo + '.jpg';
        const out = path.join(IMG_DIR, file);
        if (!fs.existsSync(out)) {
          // 네이버 사진은 한 가지 크기(수백 KB)뿐이라 ffmpeg로 640픽셀 jpg로 줄임, ffmpeg가 없으면 원본 그대로
          const tmp = out + '.src';
          fs.writeFileSync(tmp, await get(src, 'buf'));
          try {
            execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-vf', "scale='min(640,iw)':-2", '-q:v', '4', out]);
            fs.unlinkSync(tmp);
          } catch (e) { fs.renameSync(tmp, out); }
        }
        img = 'img/gabolgak/' + file;
      }
    } catch (e) { console.warn('사진 못 받음', logNo, e.message); }

    posts.push({ title, summary, url, img, date: (kst.getUTCMonth() + 1) + '월 ' + kst.getUTCDate() + '일' });
  }

  // 목록에서 빠진 옛 사진은 지움
  const keep = new Set(posts.map(p => p.img.split('/').pop()));
  for (const f of fs.readdirSync(IMG_DIR)) if (!keep.has(f)) fs.unlinkSync(path.join(IMG_DIR, f));

  const json = { blog: '오늘의 가볼각', posts };
  const file = path.join(ROOT, 'gabolgak.json');
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const after = JSON.stringify(json, null, 2) + '\n';
  if (before !== after) fs.writeFileSync(file, after);
  console.log((before === after ? '바뀐 글 없음' : '갱신함') + ': ' + posts.map(p => p.title).join(' / '));
})().catch(e => { console.error(e); process.exit(1); });
