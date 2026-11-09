// 유튜브 채널의 새 영상을 찾아 videos-auto.js에 적습니다.
// GitHub Actions가 하루 한 번 실행합니다. (.github/workflows/update-videos.yml)
// 채널 목록은 content.js의 channels 중 platform이 "YouTube"인 것을 그대로 씁니다.

import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const ROOT = new URL("..", import.meta.url);
const OUT = new URL("videos-auto.js", ROOT);
const PER_CHANNEL = 5;   // 채널마다 확인할 최신 영상 수
const KEEP = 40;         // videos-auto.js에 남겨 둘 최대 영상 수
const UA = "Mozilla/5.0 (compatible; site-video-updater)";

async function loadScript(file, key) {
  const code = await readFile(new URL(file, ROOT), "utf8").catch(() => "");
  const ctx = { window: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window[key];
}

async function get(url, opts = {}) {
  const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "ko-KR,ko;q=0.9" }, ...opts });
  return res;
}

async function channelId(url) {
  const m = url.match(/\/channel\/(UC[\w-]{22})/);
  if (m) return m[1];
  const res = await get(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  const id = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/)?.[1]
    || html.match(/"externalId":"(UC[\w-]{22})"/)?.[1]
    || html.match(/"channelId":"(UC[\w-]{22})"/)?.[1];
  if (!id) throw new Error(`${url} → 채널 ID를 찾지 못함`);
  return id;
}

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1],
    title: decode(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").trim(),
    published: e.match(/<published>([^<]+)<\/published>/)?.[1] ?? "",
  })).filter((v) => v.id);
}

async function isShort(v) {
  try {
    const res = await get(`https://www.youtube.com/shorts/${v.id}`, { redirect: "manual" });
    if (res.status === 200) return true;
    if (res.status >= 300 && res.status < 400) return false;
  } catch {}
  return /#shorts?\b/i.test(v.title);
}

async function main() {
  const site = await loadScript("content.js", "SITE");
  const prev = (await loadScript("videos-auto.js", "SITE_AUTO"))?.videos ?? [];
  const known = new Map(prev.map((v) => [v.id, v]));
  const manual = new Set(site.videos.map((v) => v.id));
  let failed = 0;

  for (const ch of site.channels.filter((c) => c.platform === "YouTube" && c.url && !c.hidden)) {
    try {
      const id = await channelId(ch.url);
      const res = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);
      if (!res.ok) throw new Error(`피드 HTTP ${res.status}`);
      const items = parseFeed(await res.text()).slice(0, PER_CHANNEL);
      for (const v of items) {
        if (manual.has(v.id)) continue;
        const old = known.get(v.id);
        const type = old?.type ?? ((await isShort(v)) ? "short" : "long");
        known.set(v.id, { id: v.id, channel: ch.key, type, title: v.title, published: v.published });
      }
      console.log(`✓ ${ch.name}: ${items.length}개 확인`);
    } catch (e) {
      failed++;
      console.warn(`✗ ${ch.name}: ${e.message}`);
    }
  }

  const videos = [...known.values()]
    .filter((v) => !manual.has(v.id))
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, KEEP);

  const body = "/* 자동 생성 파일입니다. 직접 고치지 마세요. (scripts/update-videos.mjs)\n" +
    "   영상을 숨기려면 content.js의 videos에 { id: \"영상번호\", hidden: true } 를 넣으세요. */\n" +
    "window.SITE_AUTO = " + JSON.stringify({ videos }, null, 2) + ";\n";
  const before = await readFile(OUT, "utf8").catch(() => "");
  if (before !== body) {
    await writeFile(OUT, body);
    console.log(`videos-auto.js 갱신: ${videos.length}개`);
  } else {
    console.log("변경 없음");
  }
  if (failed && failed === site.channels.filter((c) => c.platform === "YouTube").length) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
