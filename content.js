/*
  정이헌의 서재 — 사이트 내용 파일
  글·링크·영상을 바꾸려면 이 파일만 고치면 됩니다. (클팀장에게 말로 부탁해도 됩니다)
  - 값이 빈칸("")이면 공개 화면에서 그 칸이 자동으로 숨겨집니다.
  - 영상은 videos 목록에 { id, channel, type } 한 줄을 추가하면 썸네일이 자동으로 붙습니다.
    id = 유튜브 주소의 영상 번호, type = "short"(쇼츠, 세로) 또는 "long"(가로)
  - hidden: true 를 넣으면 지우지 않고 숨길 수 있습니다.
*/
window.SITE = {
  siteName: "정이헌의 서재",
  author: "정이헌",
  authorAlt: "제임스정",
  eyebrow: "글과 이야기가 머무는 곳",
  headline: ["사람의 마음을 읽고,", "세상의 이야기를 담습니다."],
  subline: "문학과 심리, 자연의 신비, 음악과 일상의 발견을 만나보세요.",
  email: ["imperialwhisky", "gmail.com"],

  books: [
    {
      slug: "basket",
      title: "허락하지 않는 사람을 인생의 바구니에 담지 마라",
      subtitle: "상간심리학",
      byline: "제임스정 · 부크크 · 2026년 10월 8일 · 전자책(EPUB 3.0)",
      covers: [
        { src: "img/cover-basket.webp", alt: "꽃과 털실이 담긴 바구니 그림 표지, 허락하지 않는 사람을 인생의 바구니에 담지 마라" },
        { src: "img/cover-locks.webp", alt: "강가 철망에 걸린 낡은 자물쇠와 붉은 천 사진 표지, 허락하지 않는 사람을 인생의 바구니에 담지 마라" }
      ],
      intro: [
        "외도를 심판하지 않고, 그 선택 밑바닥의 외로움과 결핍, 애착 방식, 금지된 관계가 주는 자극을 들여다본 책입니다.",
        "외도한 배우자와 상간자는 물론 배신당한 배우자와 아이들의 마음까지 6부 20장에 담고, 반복되는 심리와 관계의 흐름을 재구성한 사례 16편을 더했습니다.",
        "관계를 다시 세울 수도, 떠날 수도 있습니다. 어느 쪽이든 배신당한 사람의 잘못은 아니라는 점을 분명히 합니다."
      ],
      topics: ["외도의 심리적 기원", "결핍과 애착", "관계에 얽힌 사람들의 심리", "배신 이후의 회복"],
      forWhom: "외도가 왜 일어나는지 알고 싶은 사람, 경계 앞에서 흔들리는 사람, 배신 이후 스스로를 탓하는 사람",
      excerpt: "",
      notice: "'상간심리학'은 저자가 만든 표현으로, 정립된 학문 분야나 진단명이 아닙니다. 심리·법률 관련 내용은 일반적인 해설이며, 개별 상황에 대한 전문 상담을 대신하지 않습니다.",
      stores: [
        { name: "부크크", url: "https://bookk.co.kr/bookStore/6ac613d0b2d61e4d7a2564a2" },
        { name: "예스24", url: "https://www.yes24.com/product/goods/198003979" }
      ],
      upcoming: false
    },
    {
      slug: "leave",
      title: "하고싶은 일을 두고 이대로 떠날 수 없다",
      subtitle: "",
      byline: "고유출판사 · 2024",
      covers: [],
      intro: [],
      topics: [],
      forWhom: "",
      excerpt: "",
      notice: "",
      stores: [],
      upcoming: false
    }
  ],

  channels: [
    { key: "writer", name: "일상의 변덕을 관통하라", topic: "문학과 인간 심리, 책 이야기", platform: "YouTube", url: "https://www.youtube.com/@jeongiheon-writer", cover: "yt:8Vy5biBazGw" },
    { key: "earth", name: "지구의 미스터리 흔적", topic: "자연과 지형의 신비", platform: "YouTube", url: "https://www.youtube.com/@earthmysterytraces", cover: "yt:7eh5ZOqqKuE" },
    { key: "mood", name: "Mood & Glow", topic: "음악과 편안한 감상", platform: "YouTube", url: "https://www.youtube.com/@moodandglow", cover: "yt:CnnERTdRFxU" },
    { key: "love", name: "열심히사랑하기", topic: "삶과 사람 이야기", platform: "YouTube", url: "https://www.youtube.com/@삶으로떠오르기", cover: "yt:aTwwm91SwPc" },
    { key: "hodu", name: "우리 마을 이장님은 호두", topic: "애니메이션", platform: "YouTube", url: "https://www.youtube.com/@우리마을이장님은호두", cover: "yt:6ziUXgC6XaU" },
    { key: "insta", name: "인스타그램", topic: "릴스와 이미지", platform: "Instagram", url: "https://www.instagram.com/jamesjeong_writer/", cover: "img/insta-1.webp" }
  ],

  videos: [
    { id: "8Vy5biBazGw", channel: "writer", type: "short", title: "몸이 가기 전에 마음이 먼저 이사합니다" },
    { id: "6CidVB-IGSo", channel: "writer", type: "short", title: "불륜에는 권태기가 없다" },
    { id: "_AGkawHQcAE", channel: "writer", type: "short", title: "\"딱 10cm만 넘은 건데 뭐\" — 외도는 이렇게 시작됩니다" },
    { id: "rrvNdw48arc", channel: "earth", type: "short", title: "세상에, 이게 황소의 관이라고? 40톤 돌 상자 세라페움" },
    { id: "7eh5ZOqqKuE", channel: "earth", type: "short", title: "세상에 이런 일이! 바위를 통째로 판 카일라사 사원" },
    { id: "aTwwm91SwPc", channel: "love", type: "short", title: "최불암, 국민 아버지가 지킨 41년의 약속" },
    { id: "EViOSx5fIug", channel: "mood", type: "long", title: "한 바퀴 더 | 늦은 밤 드라이브, 시티팝 감성 발라드" },
    { id: "Eqd5aXnl5D8", channel: "mood", type: "long", title: "주머니 속의 봄 | 슈베르트 《겨울 나그네》 감성 창작 가곡 · 제3곡" },
    { id: "CnnERTdRFxU", channel: "mood", type: "long", title: "비 오는 밤 한옥 아궁이 장작 타는 소리 3시간" },
    { id: "FF6mYfaoiUs", channel: "mood", type: "long", title: "비 오는 밤, 텐트 안에서 듣는 빗소리와 모닥불 1시간" },
    { id: "6ziUXgC6XaU", channel: "hodu", type: "long", title: "이장님 밥은 누가 줘? 할머니 셋의 밥 전쟁 | 3화" },
    { id: "iyb7-U_W_HQ", channel: "hodu", type: "long", title: "아기 강아지가 이장님이 되었어요 | 2화" },
    { id: "3lJ7qfEy-Cs", channel: "hodu", type: "long", title: "비 오는 날, 평상 아래 강아지가 들어왔어요 | 1화" }
  ],

  blogs: [
    { name: "열심히사랑하기", about: "삶과 사람에 대해 오래 써 온 글", url: "https://blog.naver.com/mischamaisky" },
    { name: "오늘의 가볼각", about: "주말에 가볼 만한 곳과 행사 소식", url: "https://blog.naver.com/thebetterlove" }
  ],
  posts: [
    { blog: "열심히사랑하기", title: "우문우답. 40", summary: "\"나를 죽이지 못한 고통은 나를 더욱더 강하게 만든다.\" 니체의 말이다. 오랜 세월을 살아오면서…", img: "img/blog-223910270779.webp", alt: "턱을 괸 채 생각에 잠긴 니체의 흑백 사진", url: "https://blog.naver.com/mischamaisky/223910270779" },
    { blog: "열심히사랑하기", title: "우문우답. 39", summary: "사거리 건물 2층에 위치하고 있다. 온화한 날씨이다 보니 하루 종일 전면 폴딩 도어를 열어 둔 채 영업을…", img: "img/blog-223879591216.webp", alt: "최후의 심판을 그린 옛 제단화", url: "https://blog.naver.com/mischamaisky/223879591216" },
    { blog: "열심히사랑하기", title: "우문우답. 37", summary: "시절인연이라는 말이 있다. 만나고 헤어짐이 다 때가 있다는 것으로 풀이할 수 있다…", img: "img/blog-223823889150.webp", alt: "꽃이 만개한 나무 아래 산책길 흑백 사진", url: "https://blog.naver.com/mischamaisky/223823889150" },
    { blog: "오늘의 가볼각", title: "경북｜11월 6~8일, 구미에서 즐기는 따뜻한 라면 나들이", summary: "익숙한 라면도 여행지에서 만나면 새로운…", img: "img/blog-224462116452.webp", alt: "구미라면축제 안내 그림, 김이 오르는 라면 한 그릇", url: "https://blog.naver.com/thebetterlove/224462116452" }
  ],

  insta: [
    { img: "img/insta-1.webp", alt: "인스타그램 릴스 커버, 몸은 안 갔잖아", url: "https://www.instagram.com/jamesjeong_writer/" }
  ],

  about: {
    lead: ["가까이에서, 때로는 멀리서.", "삶과 사람을 바라봅니다."],
    bio: [
      "2014년 현대시문학 신인상으로 등단했습니다.",
      "2024년 『하고싶은 일을 두고 이대로 떠날 수 없다』(고유출판사)를, 2026년 『허락하지 않는 사람을 인생의 바구니에 담지 마라』(부크크)를 펴냈습니다.",
      "네이버 블로그 '열심히사랑하기'를 오랫동안 운영하며 삶과 사람에 대한 글을 써 왔습니다."
    ],
    direction: "\"사람은 왜 자신이 가진 것을 버리고 다른 곳을 바라보는가.\" 사람들의 선택과 상처를 지켜보며 오래 붙들어 온 이 질문을 글과 영상, 음악으로 이어 갑니다.",
    publisher: ""
  }
};
