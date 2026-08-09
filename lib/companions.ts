import type { Localized } from "./i18n";

// ============================================================
// 本地陪玩（Local Companion）数据 —— Ximi Private Travel
// 十二座城市 · 每城三位真人地陪 + 包车车型
// 照片全部为 AI 生成的亚洲面孔肖像（public/images/companions/*.png）
// ============================================================

export interface Companion {
  id: string;
  name: string;
  cnName?: string;
  emoji: string;
  photo?: string;
  age?: number;
  gender: "female" | "male";
  years: number;
  languages: string[];
  tags: Localized[];
  intro: Localized;
  halfDayUSD: number;
  fullDayUSD: number;
}

export interface CharterOption {
  id: string;
  type: Localized;
  model: string;
  seats: number;
  emoji: string;
  perDayUSD: number;
  note: Localized;
}

export interface CompanionCity {
  slug: string;
  emoji: string;
  image?: string;
  from: string;
  to: string;
  name: Localized;
  tagline: Localized;
  blurb: Localized;
  highlights: Localized[];
  companions: Companion[];
  charter: CharterOption[];
}

export interface ServiceMode {
  id: "companion" | "charter";
  emoji: string;
  title: Localized;
  desc: Localized;
}

export const serviceModes: ServiceMode[] = [
  {
    id: "companion",
    emoji: "🧑‍🤝‍🧑",
    title: { en: "Local Companion", zh: "地陪陪伴" },
    desc: {
      en: "A local friend walks the whole day with you — ordering food, translating, queueing, taking your photos. A strange city stops feeling strange.",
      zh: "在地地陪像朋友一样全程陪同，点菜、翻译、排队、拍照都交给他，陌生的城市也能走得自在安心。",
    },
  },
  {
    id: "charter",
    emoji: "🚗",
    title: { en: "Private Car & Driver", zh: "包车游" },
    desc: {
      en: "A licensed driver plus a comfortable car, door to door all day. Best for families, small groups, or anyone who is done with taxi queues.",
      zh: "专业司机 + 舒适车辆全天候接送，适合家庭出游、多人结伴，或想省去交通烦恼的旅人。",
    },
  },
];

export const trustPoints: { emoji: string; title: Localized; desc: Localized }[] = [
  {
    emoji: "🪪",
    title: { en: "Real, verified people", zh: "真人地陪实名认证" },
    desc: {
      en: "Every companion is ID-verified. The photo and the experience you see are the person who actually shows up.",
      zh: "每位地陪都经过实名核实，照片与经历真实可查，不是头像广告。",
    },
  },
  {
    emoji: "💬",
    title: { en: "Talk to us directly", zh: "直接联系不经手金流" },
    desc: {
      en: "Message us on WhatsApp and settle the plan and the price with the companion directly. We never hold your money.",
      zh: "WhatsApp 直接与我们沟通报价与行程，我们不代收任何费用。",
    },
  },
  {
    emoji: "🗺️",
    title: { en: "Free custom itinerary", zh: "免费客制化行程" },
    desc: {
      en: "Tell us what you like and how long you have. We plan the route around you — no herded group tours.",
      zh: "依照你的喜好与时间量身规划专属路线，不赶鸭子上架。",
    },
  },
  {
    emoji: "🌍",
    title: { en: "Built for foreign travellers", zh: "懂外国旅人的痛点" },
    desc: {
      en: "Payment apps, SIM cards, high-speed rail, ordering without a menu in English — the everyday friction, handled.",
      zh: "支付软件、电话卡、高铁购票、没有英文菜单的点餐——这些日常摩擦，我们全帮你搞定。",
    },
  },
];

// ============================================================
// 十二城地陪阵容
// ============================================================
export const companionCities: CompanionCity[] = [
  // ────────────────────────────────────────────────────────
  // 1. 北京 BEIJING
  // ────────────────────────────────────────────────────────
  {
    slug: "beijing",
    emoji: "🏯",
    image: "/images/cities/beijing.jpg",
    from: "#1b2440",
    to: "#c79a2b",
    name: { en: "Beijing", zh: "北京" },
    tagline: {
      en: "Imperial axis by day, hutong smoke by night",
      zh: "白天皇城中轴，夜里胡同烟火",
    },
    blurb: {
      en: "The Forbidden City, the Great Wall and a thousand grey alleys in between. Beijing rewards the people who know which gate to enter from.",
      zh: "故宫、长城，还有中间那一千条灰色胡同。北京只奖励知道该从哪个门进的人。",
    },
    highlights: [
      { en: "Forbidden City & Mutianyu Great Wall, booked and timed for you", zh: "故宫与慕田峪长城，预约与时间点全帮你算好" },
      { en: "Hutong food crawl locals actually eat", zh: "本地人真在吃的胡同扫街" },
      { en: "798 art district & Gulou indie shops", zh: "798 艺术区与鼓楼小店" },
    ],
    companions: [
      {
        id: "bj-lina",
        photo: "/images/companions/beijing_lina.png",
        name: "Lina", cnName: "李娜", emoji: "🧣",
        gender: "female", age: 28, years: 5,
        languages: ["English", "中文"],
        tags: [{ en: "History nerd", zh: "历史控" }, { en: "Photo taking", zh: "会拍照" }, { en: "Hutong food", zh: "胡同美食" }],
        intro: {
          en: "Grew up three streets from the Drum Tower. Studied museum curation, now spends her weekends dragging friends to obscure Ming-dynasty gates. She will make the Forbidden City make sense.",
          zh: "在鼓楼边上长大，学博物馆策展出身，周末的爱好是拉着朋友去看没人知道的明代城门。她能把故宫讲成一个你听得懂的故事。",
        },
        halfDayUSD: 85, fullDayUSD: 160,
      },
      {
        id: "bj-marcus",
        photo: "/images/companions/beijing_marcus.png",
        name: "Marcus", cnName: "王喆", emoji: "🎒",
        gender: "male", age: 31, years: 6,
        languages: ["English", "中文", "Deutsch"],
        tags: [{ en: "Great Wall hiking", zh: "长城徒步" }, { en: "Driving", zh: "可自驾" }, { en: "Craft beer", zh: "精酿啤酒" }],
        intro: {
          en: "Has walked eleven different sections of the Great Wall, including the wild unrestored ones. Also knows every craft beer bar inside the second ring road.",
          zh: "走过十一段长城，包括没修的野长城。同时熟悉二环内每一家精酿酒吧。这平衡挺好的。",
        },
        halfDayUSD: 90, fullDayUSD: 170,
      },
      {
        id: "bj-yuki",
        photo: "/images/companions/beijing_yuki.png",
        name: "Yuki", cnName: "陈雨", emoji: "☕",
        gender: "female", age: 25, years: 3,
        languages: ["English", "中文", "日本語"],
        tags: [{ en: "Coffee & indie shops", zh: "咖啡小店" }, { en: "Shopping", zh: "陪逛街" }, { en: "Solo travellers", zh: "擅长一人游" }],
        intro: {
          en: "A slow-travel person in a fast city. Best if you want a quiet Beijing — courtyard cafés, independent bookstores, and no queueing at 7am.",
          zh: "快城市里的慢性子。如果你想要一个安静的北京——四合院咖啡、独立书店、不用早上七点排队——找她准没错。",
        },
        halfDayUSD: 80, fullDayUSD: 150,
      },
    ],
    charter: [
      { id: "bj-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Toyota Camry / VW Passat", seats: 3, emoji: "🚙", perDayUSD: 150, note: { en: "Couples or solo · city + airport runs", zh: "情侣或一人 · 市区与接送机" } },
      { id: "bj-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8 / Toyota Alphard", seats: 6, emoji: "🚐", perDayUSD: 205, note: { en: "Families with luggage · Great Wall day trips", zh: "带行李的家庭 · 长城一日游" } },
      { id: "bj-van", type: { en: "Group Van", zh: "团体中巴" }, model: "Mercedes Sprinter", seats: 14, emoji: "🚌", perDayUSD: 290, note: { en: "Groups of 7-14 · multi-stop routes", zh: "7-14 人团 · 多点串联路线" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 2. 上海 SHANGHAI
  // ────────────────────────────────────────────────────────
  {
    slug: "shanghai",
    emoji: "🌃",
    image: "/images/cities/shanghai.jpg",
    from: "#141b33",
    to: "#c78f2b",
    name: { en: "Shanghai", zh: "上海" },
    tagline: { en: "Neon on the Bund, plane trees in the lanes", zh: "外滩的霓虹，梧桐区的清晨" },
    blurb: {
      en: "The most future-facing city in China, hiding a very old one inside it. Ten minutes from a skyline photo you are eating breakfast on a plastic stool.",
      zh: "中国最未来的城市，里面藏着一座很老的城。离天际线大片十分钟，你就坐在塑料凳上吃早饭了。",
    },
    highlights: [
      { en: "Bund & Pudong skyline at the right hour", zh: "外滩与陆家嘴，卡准最好的光" },
      { en: "Former French Concession walking loops", zh: "前法租界梧桐区漫步路线" },
      { en: "Shengjian, xiaolong, and a proper old-Shanghai dinner", zh: "生煎、小笼，与一顿正经本帮菜" },
    ],
    companions: [
      {
        id: "sh-vivian",
        photo: "/images/companions/shanghai_vivian.png",
        name: "Vivian", cnName: "顾维", emoji: "🕶️",
        gender: "female", age: 30, years: 7,
        languages: ["English", "中文", "Français"],
        tags: [{ en: "Architecture walks", zh: "建筑漫步" }, { en: "Nightlife", zh: "夜生活" }, { en: "Fine dining", zh: "餐厅预订" }],
        intro: {
          en: "Worked in a Bund heritage building for four years, so she knows which lobbies you are allowed to walk into. Excellent at getting tables that are supposedly full.",
          zh: "在外滩老建筑里上过四年班，所以她知道哪些大堂是可以走进去的。以及，特别擅长订到「已经满了」的餐厅。",
        },
        halfDayUSD: 95, fullDayUSD: 180,
      },
      {
        id: "sh-leo",
        photo: "/images/companions/xian_kevin.png",
        name: "Leo", cnName: "周乐", emoji: "📷",
        gender: "male", age: 27, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "Street photography", zh: "街拍摄影" }, { en: "Coffee", zh: "咖啡地图" }, { en: "Citywalk", zh: "城市漫步" }],
        intro: {
          en: "Semi-pro street photographer. Brings his own camera and sends you the edited shots after — the closest thing to a free photoshoot you will get.",
          zh: "半职业街拍摄影师，自带相机，结束后把修好的图发给你——大概是你能拿到的最划算的一次写真。",
        },
        halfDayUSD: 85, fullDayUSD: 165,
      },
      {
        id: "sh-anna",
        photo: "/images/companions/shanghai_anna.png",
        name: "Anna", cnName: "苏安", emoji: "🍜",
        gender: "female", age: 34, years: 8,
        languages: ["English", "中文", "Español"],
        tags: [{ en: "Families & kids", zh: "亲子家庭" }, { en: "Local food", zh: "本帮美食" }, { en: "Water towns", zh: "水乡近郊" }],
        intro: {
          en: "Mother of two, which means she has already stress-tested every kid-friendly route in this city. Also the person to ask about Zhujiajiao versus Wuzhen.",
          zh: "两个孩子的妈，意味着这城市所有亲子路线她都实测过了。朱家角还是乌镇，问她就对了。",
        },
        halfDayUSD: 90, fullDayUSD: 170,
      },
    ],
    charter: [
      { id: "sh-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Toyota Camry / Honda Accord", seats: 3, emoji: "🚙", perDayUSD: 155, note: { en: "City routes & Pudong airport", zh: "市区路线与浦东机场" } },
      { id: "sh-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 210, note: { en: "Water town day trips with luggage", zh: "带行李的水乡一日游" } },
      { id: "sh-lux", type: { en: "Executive", zh: "行政级" }, model: "Mercedes E-Class / BMW 5", seats: 3, emoji: "🖤", perDayUSD: 265, note: { en: "Business trips & special occasions", zh: "商务出行与重要场合" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 3. 成都 CHENGDU
  // ────────────────────────────────────────────────────────
  {
    slug: "chengdu",
    emoji: "🐼",
    image: "/images/cities/chengdu.jpg",
    from: "#1d3326",
    to: "#c7a52b",
    name: { en: "Chengdu", zh: "成都" },
    tagline: { en: "Pandas, mahjong, and nobody in a hurry", zh: "熊猫、麻将，和没人赶时间" },
    blurb: {
      en: "The city that invented doing nothing properly. Come for the pandas, stay because you accidentally spent four hours in a teahouse.",
      zh: "一座把「什么都不干」做到极致的城市。为熊猫而来，然后不小心在茶馆坐了四个小时。",
    },
    highlights: [
      { en: "Panda base at feeding hour, not tourist hour", zh: "熊猫基地卡投喂时间，不是游客时间" },
      { en: "Hole-in-the-wall hotpot the guidebooks miss", zh: "攻略上没有的苍蝇馆子火锅" },
      { en: "Day loop to Dujiangyan & Mount Qingcheng", zh: "都江堰与青城山一日环线" },
    ],
    companions: [
      {
        id: "cd-mia",
        photo: "/images/companions/chengdu_mia.png",
        name: "Mia", cnName: "何苗", emoji: "🌶️",
        gender: "female", age: 26, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "Hotpot expert", zh: "火锅专家" }, { en: "Teahouse life", zh: "茶馆日常" }, { en: "Night markets", zh: "夜市" }],
        intro: {
          en: "Can order a hotpot at exactly the spice level a foreigner can survive, which is a rarer skill than it sounds. Knows the teahouse where the old men still get their ears cleaned.",
          zh: "能把火锅点到外国人刚好扛得住的辣度——这技能比听起来稀有。她知道那家还有老师傅采耳的茶馆。",
        },
        halfDayUSD: 80, fullDayUSD: 150,
      },
      {
        id: "cd-david",
        photo: "/images/companions/chengdu_david.png",
        name: "David", cnName: "邓伟", emoji: "🚗",
        gender: "male", age: 36, years: 9,
        languages: ["English", "中文"],
        tags: [{ en: "Driver + guide", zh: "司机兼向导" }, { en: "Day trips", zh: "近郊一日游" }, { en: "Sichuan opera", zh: "川剧变脸" }],
        intro: {
          en: "Nine years driving the Sichuan mountain roads. Doubles as your guide, so on longer day trips you are paying one person instead of two.",
          zh: "跑了九年川西山路，兼职当向导，所以长途一日游你只用付一个人的钱。",
        },
        halfDayUSD: 85, fullDayUSD: 160,
      },
      {
        id: "cd-sunny",
        photo: "/images/companions/chengdu_sunny.png",
        name: "Sunny", cnName: "罗珊", emoji: "🎋",
        gender: "female", age: 29, years: 5,
        languages: ["English", "中文", "한국어"],
        tags: [{ en: "Panda volunteering", zh: "熊猫志愿者" }, { en: "Hanfu photos", zh: "汉服写真" }, { en: "Solo travellers", zh: "擅长一人游" }],
        intro: {
          en: "Volunteered at the panda base for two seasons, so she knows exactly when the bears are awake and where the crowd is not. Also arranges hanfu shoots.",
          zh: "在熊猫基地做过两季志愿者，所以她知道熊猫什么时候醒着、人群在哪一侧。也能安排汉服写真。",
        },
        halfDayUSD: 82, fullDayUSD: 155,
      },
    ],
    charter: [
      { id: "cd-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Toyota Camry", seats: 3, emoji: "🚙", perDayUSD: 130, note: { en: "City + panda base runs", zh: "市区与熊猫基地" } },
      { id: "cd-suv", type: { en: "Mountain SUV", zh: "越野 SUV" }, model: "Toyota Highlander", seats: 5, emoji: "🏔️", perDayUSD: 175, note: { en: "Qingcheng / Bipenggou mountain roads", zh: "青城山 / 毕棚沟山路" } },
      { id: "cd-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 185, note: { en: "Family day trips", zh: "家庭一日游" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 4. 西安 XI'AN
  // ────────────────────────────────────────────────────────
  {
    slug: "xian",
    emoji: "🏛️",
    image: "/images/cities/xian.jpg",
    from: "#33241b",
    to: "#c78b2b",
    name: { en: "Xi'an", zh: "西安" },
    tagline: { en: "Thirteen dynasties and the best street food in China", zh: "十三朝古都，与全中国最好的街头小吃" },
    blurb: {
      en: "The eastern end of the Silk Road. Terracotta Army in the morning, lamb skewers and a beer on the city wall at night.",
      zh: "丝绸之路的东端。早上兵马俑，晚上城墙边上撸串喝啤酒。",
    },
    highlights: [
      { en: "Terracotta Army route with zero wasted queueing", zh: "兵马俑不排冤枉队的动线" },
      { en: "City wall cycling on the best stretch", zh: "城墙骑行最好的一段" },
      { en: "Muslim Quarter vs Yongxing Square — what to eat where", zh: "回民街与永兴坊，各吃什么" },
    ],
    companions: [
      {
        id: "xa-omar",
        photo: "/images/companions/xian_omar.png",
        name: "Omar", cnName: "马海", emoji: "🥘",
        gender: "male", age: 33, years: 7,
        languages: ["English", "中文", "العربية"],
        tags: [{ en: "Halal food", zh: "清真美食" }, { en: "Silk Road history", zh: "丝路历史" }, { en: "Muslim Quarter", zh: "回民街" }],
        intro: {
          en: "Third-generation Hui family from the Muslim Quarter. Takes you to the stalls his grandmother approves of, not the ones on the main tourist street.",
          zh: "回民街三代回族人家。他带你去的是他奶奶认可的摊子，不是主街上给游客的那些。",
        },
        halfDayUSD: 80, fullDayUSD: 150,
      },
      {
        id: "xa-grace",
        photo: "/images/companions/xian_grace.png",
        name: "Grace", cnName: "白薇", emoji: "🏹",
        gender: "female", age: 29, years: 5,
        languages: ["English", "中文"],
        tags: [{ en: "Archaeology", zh: "考古背景" }, { en: "Terracotta Army", zh: "兵马俑" }, { en: "Museums", zh: "博物馆" }],
        intro: {
          en: "Archaeology degree from Northwest University. The Terracotta Army goes from 'a lot of statues' to genuinely astonishing when she explains it.",
          zh: "西北大学考古专业出身。经她一讲，兵马俑会从「好多雕像」变成真正让你震住的东西。",
        },
        halfDayUSD: 85, fullDayUSD: 158,
      },
      {
        id: "xa-kevin",
        photo: "/images/companions/shanghai_leo.png",
        name: "Kevin", cnName: "秦凯", emoji: "🚲",
        gender: "male", age: 24, years: 3,
        languages: ["English", "中文"],
        tags: [{ en: "City wall cycling", zh: "城墙骑行" }, { en: "Night food crawl", zh: "深夜扫街" }, { en: "Young travellers", zh: "年轻旅人" }],
        intro: {
          en: "Local student energy, very cheap, very fun. Best for backpackers who want the late-night skewer version of Xi'an rather than the museum version.",
          zh: "本地学生的那股劲儿，便宜又好玩。想要深夜烧烤版西安而不是博物馆版西安的背包客，选他。",
        },
        halfDayUSD: 75, fullDayUSD: 150,
      },
    ],
    charter: [
      { id: "xa-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "VW Passat", seats: 3, emoji: "🚙", perDayUSD: 125, note: { en: "City + Terracotta Army", zh: "市区与兵马俑" } },
      { id: "xa-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 175, note: { en: "Family or 4-6 people", zh: "家庭或 4-6 人" } },
      { id: "xa-van", type: { en: "Group Van", zh: "团体中巴" }, model: "Mercedes Sprinter", seats: 14, emoji: "🚌", perDayUSD: 260, note: { en: "Huashan or Famen Temple long days", zh: "华山 / 法门寺长线" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 5. 杭州 HANGZHOU
  // ────────────────────────────────────────────────────────
  {
    slug: "hangzhou",
    emoji: "🍵",
    image: "/images/cities/hangzhou.jpg",
    from: "#16302b",
    to: "#c7b02b",
    name: { en: "Hangzhou", zh: "杭州" },
    tagline: { en: "A lake, a tea hill, and a very soft pace", zh: "一片湖，一座茶山，和很软的节奏" },
    blurb: {
      en: "Chinese poets have been writing about West Lake for a thousand years and they were not exaggerating. Bring comfortable shoes.",
      zh: "中国诗人写了一千年西湖，他们没夸张。穿双好走的鞋来。",
    },
    highlights: [
      { en: "West Lake walking + boat loop of the Ten Scenes", zh: "西湖十景步行加游船环线" },
      { en: "Longjing tea village, picking season timed right", zh: "龙井茶村，采茶季卡准时间" },
      { en: "Xitang or Wuzhen — we'll tell you which suits you", zh: "西塘还是乌镇，我们帮你选" },
    ],
    companions: [
      {
        id: "hz-tina",
        photo: "/images/companions/hangzhou_tina.png",
        name: "Tina", cnName: "叶婷", emoji: "🍃",
        gender: "female", age: 31, years: 6,
        languages: ["English", "中文"],
        tags: [{ en: "Tea ceremony", zh: "茶道" }, { en: "West Lake", zh: "西湖" }, { en: "Slow travel", zh: "慢旅行" }],
        intro: {
          en: "Her family still owns a small Longjing plot up the hill. Tea with her is not a tourist performance, it is just tea in someone's house.",
          zh: "她家在山上还有一小片龙井茶园。跟她喝茶不是给游客看的表演，就是在别人家里喝茶。",
        },
        halfDayUSD: 82, fullDayUSD: 155,
      },
      {
        id: "hz-jason",
        photo: "/images/companions/hangzhou_jason.png",
        name: "Jason", cnName: "吴劲", emoji: "🚴",
        gender: "male", age: 28, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "Cycling routes", zh: "骑行路线" }, { en: "Water towns", zh: "水乡" }, { en: "Photography", zh: "摄影" }],
        intro: {
          en: "Rides the lake loop most mornings. Will get you on a bike and out to the quiet western side where the tour buses do not go.",
          zh: "基本每天早上绕湖骑一圈。他会让你上车，骑到旅游大巴到不了的西侧安静地带。",
        },
        halfDayUSD: 80, fullDayUSD: 150,
      },
      {
        id: "hz-coco",
        photo: "/images/companions/hangzhou_coco.png",
        name: "Coco", cnName: "沈可", emoji: "👘",
        gender: "female", age: 25, years: 3,
        languages: ["English", "中文", "日本語"],
        tags: [{ en: "Hanfu & photo shoots", zh: "汉服写真" }, { en: "Cafés", zh: "咖啡" }, { en: "Shopping", zh: "陪逛" }],
        intro: {
          en: "Runs a small hanfu rental on the side. If your Hangzhou plan is essentially 'take beautiful photos and drink things', she is your person.",
          zh: "副业开了个小汉服租赁店。如果你的杭州计划本质上就是「拍好看的照片、喝点东西」，找她。",
        },
        halfDayUSD: 78, fullDayUSD: 152,
      },
    ],
    charter: [
      { id: "hz-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Toyota Camry", seats: 3, emoji: "🚙", perDayUSD: 130, note: { en: "Lake loop & tea villages", zh: "环湖与茶村" } },
      { id: "hz-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 180, note: { en: "Wuzhen / Xitang day trips", zh: "乌镇 / 西塘一日游" } },
      { id: "hz-suv", type: { en: "SUV", zh: "SUV" }, model: "Honda CR-V", seats: 5, emoji: "🚘", perDayUSD: 150, note: { en: "Mountain temples & Moganshan", zh: "山中古寺与莫干山" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 6. 大理 DALI
  // ────────────────────────────────────────────────────────
  {
    slug: "dali",
    emoji: "⛰️",
    image: "/images/cities/dali.jpg",
    from: "#1b2c33",
    to: "#c7702b",
    name: { en: "Dali", zh: "大理" },
    tagline: { en: "Wind, flowers, snow and moon — and no schedule", zh: "风花雪月，以及没有行程表" },
    blurb: {
      en: "Where Chinese people go when they quit their jobs. A lake the size of a sea, a mountain behind it, and villages that have not decided to become cities.",
      zh: "中国人辞职之后会去的地方。一片海那么大的湖，背后一座山，还有一些没打算变成城市的村子。",
    },
    highlights: [
      { en: "Erhai Lake drive or cycle, the good half", zh: "洱海环线自驾或骑行，好走的那半边" },
      { en: "Cangshan hiking entrances that are actually worth it", zh: "苍山真正值得爬的那几个入口" },
      { en: "Where to stay: old town vs Caicun vs Shuanglang", zh: "住哪儿：古城 / 才村 / 双廊怎么选" },
    ],
    companions: [
      {
        id: "dl-amy",
        photo: "/images/companions/dali_amy.png",
        name: "Amy", cnName: "杨阿玫", emoji: "🌺",
        gender: "female", age: 27, years: 4,
        languages: ["English", "中文", "白语"],
        tags: [{ en: "Bai ethnic culture", zh: "白族文化" }, { en: "Tie-dye workshops", zh: "扎染体验" }, { en: "Village markets", zh: "赶集" }],
        intro: {
          en: "Bai ethnic, born in Xizhou. Takes you to the market days in the villages around the lake — the ones that happen on a rotating schedule only locals track.",
          zh: "白族，喜洲人。她带你去环湖村子的赶集日——那种只有本地人才记得住的轮转日程。",
        },
        halfDayUSD: 75, fullDayUSD: 150,
      },
      {
        id: "dl-river",
        photo: "/images/companions/dali_river.png",
        name: "River", cnName: "赵川", emoji: "🏍️",
        gender: "male", age: 30, years: 5,
        languages: ["English", "中文"],
        tags: [{ en: "Erhai loop driving", zh: "洱海环线" }, { en: "Cangshan hiking", zh: "苍山徒步" }, { en: "Sunset spots", zh: "日落机位" }],
        intro: {
          en: "Moved here from Shenzhen six years ago and never went back. Knows every unmarked pull-over on the Erhai loop where the light is good.",
          zh: "六年前从深圳搬来就没回去过。洱海环线上每个没标记但光线很好的停车点，他都知道。",
        },
        halfDayUSD: 78, fullDayUSD: 155,
      },
      {
        id: "dl-nina",
        photo: "/images/companions/dali_nina.png",
        name: "Nina", cnName: "林霓", emoji: "🎸",
        gender: "female", age: 33, years: 6,
        languages: ["English", "中文", "Deutsch"],
        tags: [{ en: "Live music bars", zh: "live 小酒馆" }, { en: "Coffee & bookshops", zh: "咖啡与书店" }, { en: "Long-stay advice", zh: "长住建议" }],
        intro: {
          en: "Ran a guesthouse in the old town for four years. If you are thinking about staying in Dali for a month instead of three days, talk to her.",
          zh: "在古城开过四年客栈。如果你在考虑在大理待一个月而不是三天，跟她聊聊。",
        },
        halfDayUSD: 77, fullDayUSD: 150,
      },
    ],
    charter: [
      { id: "dl-suv", type: { en: "Lake-loop SUV", zh: "环湖 SUV" }, model: "Honda CR-V / Toyota RAV4", seats: 5, emoji: "🚘", perDayUSD: 135, note: { en: "Erhai loop with photo stops", zh: "洱海环线含拍照停靠" } },
      { id: "dl-mpv", type: { en: "Business MPV", zh: "商务 MPV" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 170, note: { en: "Dali → Lijiang / Shaxi transfers", zh: "大理往丽江 / 沙溪转场" } },
      { id: "dl-conv", type: { en: "Open-top Classic", zh: "敞篷老爷车" }, model: "Vintage convertible", seats: 3, emoji: "🚗", perDayUSD: 195, note: { en: "The Erhai photo cliché, done well", zh: "洱海经典机位，但拍得好看" } },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ★ 新增六城（2026年扩展）
  // ══════════════════════════════════════════════════════

  // ────────────────────────────────────────────────────────
  // 7. 桂林 GUILIN
  // ────────────────────────────────────────────────────────
  {
    slug: "guilin",
    emoji: "🏞️",
    image: "/images/cities/guilin.jpg",
    from: "#1a3a2e",
    to: "#c7a040",
    name: { en: "Guilin", zh: "桂林" },
    tagline: { en: "Karst peaks, Li River poetry, and cormorant fishermen", zh: "喀斯特峰林、漓江诗意、鸬鹚渔夫" },
    blurb: {
      en: "The landscape on every Chinese painting scroll comes alive here. Limestone peaks rising from emerald water, fishermen on bamboo rafts, and sunsets that make you put your camera down and just breathe.",
      zh: "中国画卷上的风景在这里活过来了。翡翠水面上升起的石灰岩峰林、竹筏上的渔夫、还有让你放下相机深呼吸的日落。",
    },
    highlights: [
      { en: "Li River bamboo raft at dawn — zero crowds", zh: "漓江竹筏日出——零游客" },
      { en: "Yangshuo rock climbing or Moon Hill hike", zh: "阳朔攀岩或月亮山徒步" },
      { en: "Longji Rice Terraces: mirrors or harvest gold?", zh: "龙脊梯田：镜面还是金黄？" },
    ],
    companions: [
      {
        id: "gl-ling",
        photo: "/images/companions/guilin_ling.png",
        name: "Ling", cnName: "林小溪", emoji: "🌊",
        gender: "female", age: 26, years: 3,
        languages: ["English", "中文"],
        tags: [{ en: "Li River rafting", zh: "漓江竹筏" }, { en: "Zhuang culture", zh: "壮族文化" }, { en: "Photography spots", zh: "摄影机位" }],
        intro: {
          en: "Grew up in a fishing village along the Li River. She knows which bends have the best reflections at sunrise and which raft docks actually give you an authentic experience, not a staged one.",
          zh: "在漓江边的渔村里长大。她知道哪段河湾日出倒影最美、哪个竹筏码头是真正原生态的而不是摆拍的。",
        },
        halfDayUSD: 72, fullDayUSD: 140,
      },
      {
        id: "gl-wei",
        photo: "/images/companions/guilin_wei.png",
        name: "Wei", cnName: "韦志强", emoji: "🎣",
        gender: "male", age: 32, years: 7,
        languages: ["English", "中文"],
        tags: [{ en: "Cormorant fishing heritage", zh: "鸬鹚捕鱼传承" }, { en: "River routes", zh: "漓江航线" }, { en: "Local cuisine", zh: "桂林米粉" }],
        intro: {
          en: "His grandfather was one of the last real cormorant fishermen on the Li River. Wei carries that heritage — he can take you to spots where tourism hasn't reached yet, and his family makes the best Guilin rice noodles you'll ever taste.",
          zh: "祖父曾是漓江最后一批真正的鸬鹚渔夫之一。韦带着这份传承——他能带你到旅游还没到达的地方，而他家的桂林米粉是你能吃到的最好的。",
        },
        halfDayUSD: 78, fullDayUSD: 148,
      },
      {
        id: "gl-mei",
        photo: "/images/companions/guilin_mei.png",
        name: "Mei", cnName: "梅子", emoji: "🧗",
        gender: "female", age: 24, years: 2,
        languages: ["English", "中文"],
        tags: [{ en: "Rock climbing", zh: "攀岩" }, { en: "Adventure travel", zh: "户外探险" }, { en: "Youth backpackers", zh: "年轻背包客" }],
        intro: {
          en: "Came to Yangshuo for a weekend, stayed for two years. Certified rock climber who can get beginners safely up their first outdoor route. Also knows every hidden café in Yangshuo West Street.",
          zh: "来阳朔度个周末，一待就是两年。持证攀岩教练，能带新手安全完成第一条野外线路。也熟知阳朔西街每一家隐藏的咖啡馆。",
        },
        halfDayUSD: 68, fullDayUSD: 130,
      },
    ],
    charter: [
      { id: "gl-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Honda Civic", seats: 3, emoji: "🚙", perDayUSD: 120, note: { en: "City + Elephant Trunk Hill", zh: "市区与象鼻山" } },
      { id: "gl-suv", type: { en: "SUV", zh: "SUV" }, model: "Toyota RAV4", seats: 5, emoji: "🚘", perDayUSD: 160, note: { en: "Longji Rice Terraces day trip", zh: "龙脊梯田一日游" } },
      { id: "gl-van", type: { en: "Tour Van", zh: "旅游中巴" }, model: "Kingstar", seats: 14, emoji: "🚌", perDayUSD: 240, note: { en: "Guilin → Yangshuo → Longji multi-day", zh: "桂林→阳朔→龙脊多日" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 8. 张家界 ZHANGJIAJIE
  // ────────────────────────────────────────────────────────
  {
    slug: "zhangjiajie",
    emoji: "⛰️",
    image: "/images/cities/zhangjiajie.jpg",
    from: "#1a2a1e",
    to: "#c7a030",
    name: { en: "Zhangjiajie", zh: "张家界" },
    tagline: { en: "Avatar mountains, glass cliffs, and clouds under your feet", zh: "阿凡达山、玻璃栈道、云海脚下" },
    blurb: {
      en: "The movie Avatar didn't invent these mountains — it copied them. Thousands of sandstone pillars rising from a sea of clouds, with glass walkways bolted to the cliff faces. This is what 3D looks like before the glasses.",
      zh: "《阿凡达》没有发明这些山——它只是抄了这里。数千根石柱从云海中升起，悬崖面上钉着玻璃栈道。这就是戴 3D 眼镜之前的样子。",
    },
    highlights: [
      { en: "Tianmen Mountain: 999 steps or the world's longest cable car?", zh: "天门山：999级台阶还是世界最长索道？" },
      { en: "Yuanjiajie (Avatar) at golden hour — skip the crowds", zh: "袁家界（阿凡达）黄金时段——避开人潮" },
      { en: "Glass skywalk: conquer your fear of heights", zh: "玻璃栈道：征服恐高症" },
    ],
    companions: [
      {
        id: "zj-feng",
        photo: "/images/companions/zhangjiajie_feng.png",
        name: "Feng", cnName: "峰哥", emoji: "⛰️",
        gender: "male", age: 35, years: 10,
        languages: ["English", "中文"],
        tags: [{ en: "Mountain hiking", zh: "山地徒步" }, { en: "Photography guidance", zh: "摄影指导" }, { en: "Off-beaten paths", zh: "小众路线" }],
        intro: {
          en: "Has hiked every trail in Wulingyuan, some of them before they were officially trails. Knows which viewpoints the tour buses skip and where to catch the sea of clouds when everyone else is stuck in line below.",
          zh: "武陵源每一条徒步道他都走过，有些在正式开放之前就走了。他知道旅游大巴会跳过哪些观景点、别人还在下面排队时哪里能看到云海。",
        },
        halfDayUSD: 88, fullDayUSD: 165,
      },
      {
        id: "zj-xiang",
        photo: "/images/companions/zhangjiajie_xiang.png",
        name: "Xiang", cnName: "向晴", emoji: "📸",
        gender: "female", age: 28, years: 5,
        languages: ["English", "中文"],
        tags: [{ en: "Landscape photography", zh: "风光摄影" }, { en: "Sunrise chasing", zh: "追日出" }, { en: "Tujia culture", zh: "土家族文化" }],
        intro: {
          en: "Professional landscape photographer who moved here for the light. She knows exactly when each pillar gets its 'golden moment' and can help you capture the shot that makes your Instagram explode.",
          zh: "为了这里的光搬来的职业风光摄影师。她精确知道每根石柱什么时候迎来它的「黄金时刻」，能帮你拍到让 Instagram 爆掉的那张。",
        },
        halfDayUSD: 82, fullDayUSD: 158,
      },
      {
        id: "zj-tuo",
        photo: "/images/companions/zhangjiajie_tuo.png",
        name: "Tuo", cnName: "阿托", emoji: "🎭",
        gender: "male", age: 29, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "Tujia ethnic culture", zh: "土家族文化" }, { en: "Local homestays", zh: "当地民宿" }, { en: "Traditional cuisine", zh: "土家美食" }],
        intro: {
          en: "Born Tujia minority in a village most tourists never reach. He bridges the gap between the commercial park experience and the real mountain culture — home-cooked meals, folk songs, and stories his grandmother told him.",
          zh: "土生土长的土家族人，来自大多数游客到不了的山村。他在商业景区体验和真正的大山文化之间搭桥——家常饭、民歌、还有奶奶讲给他的故事。",
        },
        halfDayUSD: 75, fullDayUSD: 145,
      },
    ],
    charter: [
      { id: "zj-suv", type: { en: "Mountain SUV", zh: "山地 SUV" }, model: "Mitsubishi Outlander", seats: 5, emoji: "🚘", perDayUSD: 170, note: { en: "Wulingyuan scenic area transport", zh: "武陵源景区交通" } },
      { id: "zj-mpv", type: { en: "MPV", zh: "商务车" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 190, note: { en: "Multi-park day trip", zh: "多景区一日游" } },
      { id: "zj-van", type: { en: "Group Van", zh: "团体中巴" }, model: "Kingstar", seats: 17, emoji: "🚌", perDayUSD: 250, note: { en: "Groups 10+ · custom itinerary", zh: "10人以上团·定制路线" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 9. 丽江 LIJIANG
  // ────────────────────────────────────────────────────────
  {
    slug: "lijiang",
    emoji: "🏔️",
    image: "/images/cities/lijiang.jpg",
    from: "#2a2520",
    to: "#c7b040",
    name: { en: "Lijiang", zh: "丽江" },
    tagline: { en: "Ancient Naxi kingdom, Jade Dragon Snow Mountain, and eternal spring", zh: "纳西古国、玉龙雪山、四季如春" },
    blurb: {
      en: "Where the Naxi people created their own pictographic writing system still in use today. Cobblestone streets, flowing canals, and a snow-capped giant watching over everything. Altitude: 2,400m. Pace: nonexistent.",
      zh: "纳西人在这里创造了至今仍在使用的象形文字体系。鹅卵石街道、潺潺渠流、还有一座雪顶巨人俯瞰一切。海拔 2400 米。节奏：不存在的。",
    },
    highlights: [
      { en: "Jade Dragon Snow Mountain: glacier or meadow route?", zh: "玉龙雪山：冰川线还是草甸线？" },
      { en: "Lijiang Old Town at dawn before the tour buses arrive", zh: "旅游大巴到来之前的古城清晨" },
      { en: "Baisha murals & Shuhe quieter old town alternative", zh: "白沙壁画与束河更安静的古城替代方案" },
    ],
    companions: [
      {
        id: "lj-naxi",
        photo: "/images/companions/lijiang_naxi.png",
        name: "Naxi", cnName: "纳西姑娘", emoji: "💎",
        gender: "female", age: 30, years: 6,
        languages: ["English", "中文", "纳西语基础"],
        tags: [{ en: "Naxi Dongba culture", zh: "纳西东巴文化" }, { en: "Traditional music", zh: "古乐" }, { en: "Silver craftsmanship", zh: "银器工艺" }],
        intro: {
          en: "Her grandmother is one of the last living Dongba priests (yes, women can be too in her family). She can take you beyond the souvenir shops to where Naxi culture is actually lived — village ceremonies, traditional music, and the pictographic script in action.",
          zh: "她的奶奶是现存最后的东巴祭司之一（是的，在她家女性也可以）。她能带你越过纪念品商店，到达纳西文化真正被生活着的地方——村落仪式、传统音乐、以及正在使用中的象形文字。",
        },
        halfDayUSD: 80, fullDayUSD: 155,
      },
      {
        id: "lj-chen",
        photo: "/images/companions/lijiang_chen.png",
        name: "Chen", cnName: "陈雪山", emoji: "🏔️",
        gender: "male", age: 27, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "High-altitude trekking", zh: "高海拔徒步" }, { en: "Snow mountain guide", zh: "雪山向导" }, { en: "Acclimatization tips", zh: "高原适应建议" }],
        intro: {
          en: "Grew up in a village at 3,200m elevation near Jade Dragon Snow Mountain. He knows how to read the weather on the peak, which trails are safe each season, and how to help you acclimate without ruining your first day with altitude sickness.",
          zh: "在玉龙雪山海拔 3200 米的村庄长大。他能读懂山顶的天气、每季哪些步道安全、以及如何帮你适应高原反应而不让第一天就废掉。",
        },
        halfDayUSD: 85, fullDayUSD: 160,
      },
      {
        id: "lj-yun",
        photo: "/images/companions/lijiang_yun.png",
        name: "Yun", cnName: "云姑娘", emoji: "🏡",
        gender: "female", age: 25, years: 3,
        languages: ["English", "中文"],
        tags: [{ en: "Boutique inns & cafes", zh: "精品民宿与咖啡" }, { en: "Old town lifestyle", zh: "古城生活方式" }, { en: "Relaxation & wellness", zh: "休闲养生" }],
        intro: {
          en: "Runs a 6-room boutique inn her parents built with their own hands. She embodies the Lijiang vibe — wake up to mountain views, spend the afternoon in a café with a book, and end the day at a Naxi hot pot restaurant where everyone knows your name.",
          zh: "经营父母亲手盖的 6 间精品民宿。她就是丽江的化身——醒来见山景、下午在咖啡馆看书、晚上在每个人都认识你的纳西火锅餐厅结束一天。",
        },
        halfDayUSD: 75, fullDayUSD: 145,
      },
    ],
    charter: [
      { id: "lj-suv", type: { en: "SUV", zh: "SUV" }, model: "Toyota RAV4", seats: 5, emoji: "🚘", perDayUSD: 155, note: { en: "Snow mountain transfer + old town", zh: "雪山接送+古城" } },
      { id: "lj-mpv", type: { en: "MPV", zh: "商务车" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 185, note: { en: "Lijiang → Tiger Leaping Gorge → Shangri-La", zh: "丽江→虎跳峡→香格里拉" } },
      { id: "lj-4wd", type: { en: "4WD Off-road", zh: "越野车" }, model: "Jeep Wrangler", seats: 4, emoji: "🚙", perDayUSD: 220, note: { en: "Ring road around Jade Dragon Snow Mountain", zh: "玉龙雪山环线" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 10. 三亚 SANYA
  // ────────────────────────────────────────────────────────
  {
    slug: "sanya",
    emoji: "🏖️",
    image: "/images/cities/sanya.jpg",
    from: "#0a3a50",
    to: "#c7d040",
    name: { en: "Sanya", zh: "三亚" },
    tagline: { en: "China's Hawaii — tropical beaches, endless summer", zh: "中国的夏威夷——热带海滩、永恒夏日" },
    blurb: {
      en: "The southernmost point of China where winter doesn't exist. Yalong Bay's powder sand, Wuzhizhou Island's postcard waters, and sunset seafood feasts that cost less than a taxi ride home. This is where Chinese people go to pretend they're on vacation forever.",
      zh: "中国最南端，冬天不存在的地方。亚龙湾的细沙、蜈支洲岛的明信片海水、还有比打车回家还便宜的日落海鲜大餐。这是中国人来假装永远在度假的地方。",
    },
    highlights: [
      { en: "Yalong Bay vs Haitang Bay: which beach for you?", zh: "亚龙湾 vs 海棠湾：哪个沙滩适合你？" },
      { en: "Wuzhizhou Island: water sports paradise", zh: "蜈支洲岛：水上运动天堂" },
      { en: "Nanshan Buddhism Culture Zone or tropical forest park?", zh: "南山佛教文化区还是热带森林公园？" },
    ],
    companions: [
      {
        id: "sy-hai",
        photo: "/images/companions/sanya_hai.png",
        name: "Hai", cnName: "海哥", emoji: "🤿",
        gender: "male", age: 33, years: 8,
        languages: ["English", "中文"],
        tags: [{ en: "Scuba diving", zh: "潜水" }, { en: "Yachting & sailing", zh: "游艇帆船" }, { en: "Fishing charters", zh: "海钓包船" }],
        intro: {
          en: "PADI instructor since 2018 with over 2,000 logged dives around Hainan's coast. Whether you want your first discover scuba experience or a certified fun dive to see sea turtles and coral reefs, Hai is the guy who makes sure you're safe while having the time of your life.",
          zh: "2018 年起 PADI 教练，海南沿海记录超过 2000 次潜水。无论你是第一次体验潜水还是持证 Fun Dive 去看海龟珊瑚礁，海哥都能确保你在玩命的同时平安无事。",
        },
        halfDayUSD: 95, fullDayUSD: 180,
      },
      {
        id: "sy-lan",
        photo: "/images/companions/sanya_lan.png",
        name: "Lan", cnName: "椰妹", emoji: "🥥",
        gender: "female", age: 26, years: 4,
        languages: ["English", "中文"],
        tags: [{ en: "Beach resorts & spas", zh: "海滩度假村与SPA" }, { en: "Island photography", zh: "海岛摄影" }, { en: "Seafood markets", zh: "海鲜市场" }],
        intro: {
          en: "Born and raised in Sanya, she knows every resort's secret beach access points, which seafood market restaurants don't rip off tourists, and where to find the best coconut ice cream (hint: not in the tourist area). Your go-to for a perfect beach day without the crowds.",
          zh: "三亚土生土长，她知道每个度假村的秘密海滩入口、哪家海鲜市场餐厅不宰客、以及哪里的椰子冰最好吃（提示：不在景区）。完美海滩日又不挤人的不二人选。",
        },
        halfDayUSD: 78, fullDayUSD: 150,
      },
      {
        id: "sy-yang",
        photo: "/images/companions/sanya_yang.png",
        name: "Yang", cnName: "阳光", emoji: "⛵",
        gender: "male", age: 30, years: 5,
        languages: ["English", "中文"],
        tags: [{ en: "Yacht cruises", zh: "游艇出海" }, { en: "Sunset sailing", zh: "日落帆船" }, { en: "Island hopping", zh: "跳岛游" }],
        intro: {
          en: "Licensed yacht captain who can take you from Sanya Bay to Wuzhizhou, Daxiao Dongdao, or even the remote islands most charters won't go to. Sunset sails with champagne, fishing stops where the big ones bite, and he knows all the hidden coves.",
          zh: "持证游艇船长，能带你从三亚湾出发去蜈支洲、大小洞天甚至多数船家不去的远海岛屿。香槟日落航行、到大鱼咬钩的钓鱼停泊点，还有他都知道的隐秘小海湾。",
        },
        halfDayUSD: 120, fullDayUSD: 220,
      },
    ],
    charter: [
      { id: "sy-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Toyota Camry", seats: 3, emoji: "🚙", perDayUSD: 140, note: { en: "City + airport runs", zh: "市区与接送机" } },
      { id: "sy-suv", type: { en: "SUV", zh: "SUV" }, model: "Honda CR-V", seats: 5, emoji: "🚘", perDayUSD: 165, note: { en: "Beach & resort transfers", zh: "海滩与度假村接送" } },
      { id: "sy-yacht", type: { en: "Yacht Charter", zh: "游艇包船" }, model: "46ft Motor Yacht", seats: 10, emoji: "⛵", perDayUSD: 800, note: { en: "Half-day cruise with crew", zh: "半日巡航含船员" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 11. 哈尔滨 HARBIN
  // ────────────────────────────────────────────────────────
  {
    slug: "harbin",
    emoji: "❄️",
    image: "/images/cities/harbin.jpg",
    from: "#1a2030",
    to: "#c8c040",
    name: { en: "Harbin", zh: "哈尔滨" },
    tagline: { en: "Ice sculptures, Russian architecture, and the coldest warmth in China", zh: "冰雕、俄式建筑、中国最冷的温暖" },
    blurb: {
      en: "China's ice capital where -30°C is just conversation starter. The world's largest ice festival, European-style architecture from a century of Russian influence, and the hottest (literally) grilled red sausage on frozen streets. Paradox is the local specialty.",
      zh: "中国的冰城，零下 30 度只是聊天开场白。全球最大冰雪节、百年俄式影响下的欧式建筑、以及在冻僵的街道上滋滋冒油的最热烤红肠。矛盾是这里的特产。",
    },
    highlights: [
      { en: "Harbin Ice & Snow World: night illumination is magical", zh: "冰雪大世界：夜晚亮灯时才魔幻" },
      { en: "Central Street & Saint Sophia Cathedral: Russian heritage walk", zh: "中央大街与圣索菲亚教堂：俄式遗产漫步" },
      { en: "Volga Manor or Siberian Tiger Park: day trip options", zh: "伏尔加庄园或东北虎林园：一日游选择" },
    ],
    companions: [
      {
        id: "hb-bing",
        photo: "/images/companions/harbin_bing.png",
        name: "Bing", cnName: "冰儿", emoji: "❄️",
        gender: "female", age: 27, years: 4,
        languages: ["English", "中文", "Русский基础"],
        tags: [{ en: "Ice sculpture & winter festivals", zh: "冰雕与冰雪节" }, { en: "Russian Quarter history", zh: "俄式街区历史" }, { en: "Winter photography", zh: "冬季摄影" }],
        intro: {
          en: "Ice sculpture artist who has exhibited at the Harbin Ice Festival for three consecutive years. She can explain how they build a cathedral from frozen water, take you to the best photo spots before the crowds arrive, and recommend which hot drink saves your fingers from frostbite.",
          zh: "连续三年在哈尔滨冰雪节参展的冰雕艺术家。她能解释如何用冻水建起一座大教堂、在人潮前带你去最佳拍照点、以及推荐哪种热饮能救你的手指免于冻伤。",
        },
        halfDayUSD: 75, fullDayUSD: 145,
      },
      {
        id: "hb-song",
        photo: "/images/companions/harbin_song.png",
        name: "Song", cnName: "宋北", emoji: "🕌",
        gender: "male", age: 31, years: 6,
        languages: ["English", "中文"],
        tags: [{ en: "Russian architecture & history", zh: "俄式建筑与历史" }, { en: "Jewish heritage sites", zh: "犹太遗址" }, { en: "Dongbei food culture", zh: "东北饮食文化" }],
        intro: {
          en: "History buff who can tell you why Harbin looks more like Moscow than most Russian cities. Leads walking tours through the former Jewish district, explains the railway history that built this city, and knows exactly which guobaorou (stewed pork) restaurant serves the authentic Northeast flavor.",
          zh: "历史爱好者，能告诉你为什么哈尔滨看起来比大多数俄罗斯城市还像莫斯科。带领步行游览前犹太旧居区、解释修筑这座城市的铁路史、并且精确知道哪家锅包肉馆有正宗东北味。",
        },
        halfDayUSD: 78, fullDayUSD: 148,
      },
      {
        id: "hb-xue",
        photo: "/images/companions/harbin_xue.png",
        name: "Xue", cnName: "雪姐", emoji: "🧥",
        gender: "female", age: 35, years: 9,
        languages: ["English", "中文", "日本語"],
        tags: [{ en: "Winter fashion & styling", zh: "冬季穿搭造型" }, { en: "Luxury shopping & spa", zh: "奢华购物与SPA" }, { en: "Fine dining recommendations", zh: "高端餐饮推荐" }],
        intro: {
          en: "Fashion consultant who knows how to look chic at -20°C without freezing. Can guide you through Harbin's emerging designer boutiques, book the best hot spring spa experience, and reserve tables at the restaurants where the city's elite actually dine.",
          zh: "时尚顾问，知道如何在零下 20 度穿得时髦又不冻僵。能带你逛哈尔滨新兴的设计师买手店、预订最好的温泉 SPA 体验、以及在这座城市精英真正用餐的餐厅预留位置。",
        },
        halfDayUSD: 88, fullDayUSD: 168,
      },
    ],
    charter: [
      { id: "hb-sedan", type: { en: "Heated Comfort Sedan", zh: "暖风舒适轿车" }, model: "Audi A4L / VW Magotan", seats: 3, emoji: "🚙", perDayUSD: 145, note: { en: "Heated seats essential in winter", zh: "冬季必备加热座椅" } },
      { id: "hb-suv", type: { en: "AWD SUV", zh: "四驱 SUV" }, model: "Subaru Forester / Toyota RAV4", seats: 5, emoji: "🚘", perDayUSD: 175, note: { en: "Ice road capable · Yabuli Ski Resort", zh: "可走冰路·亚布力滑雪场" } },
      { id: "hb-mpv", type: { en: "Heated MPV", zh: "暖风商务车" }, model: "Buick GL8 Avenir", seats: 6, emoji: "🚐", perDayUSD: 195, note: { en: "Ski equipment transport · warm interior", zh: "滑雪装备运送·车内保暖" } },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 12. 厦门 XIAMEN
  // ────────────────────────────────────────────────────────
  {
    slug: "xiamen",
    emoji: "🏝️",
    image: "/images/cities/xiamen.jpg",
    from: "#1a3540",
    to: "#c7c840",
    name: { en: "Xiamen", zh: "厦门" },
    tagline: { en: "Gulangyu pianos, Minnan seafood, and eternal spring breeze", zh: "鼓浪屿钢琴、闽南海鲜、永恒春风" },
    blurb: {
      en: "Where Fujian meets the sea — colonial architecture on car-free Gulangyu island, the world's best oyster omelette, and a pace of life that makes Shanghai feel like New York. Come for the seafood, stay for the afternoon tea culture that defines southern Fujian elegance.",
      zh: "福建与大海相遇的地方——无车鼓浪屿岛上的殖民建筑、全世界最好吃的蚝煎、一种让上海感觉像纽约的生活节奏。为海鲜而来，因定义了闽南优雅的下午茶文化而留下。",
    },
    highlights: [
      { en: "Gulangyu Island: pianos, colonial villas, car-free wandering", zh: "鼓浪屿岛：钢琴、别墅、无车漫游" },
      { en: "Shapowei artistic zone or Nanputuo Temple morning chant", zh: "沙坡尾艺术区或南普陀寺晨钟" },
      { en: "Seafood feast: oyster omelette, satay noodles, dragon fruit juice", zh: "海鲜盛宴：蚝煎、沙茶面、火龙果汁" },
    ],
    companions: [
      {
        id: "xm-min",
        photo: "/images/companions/xiamen_min.png",
        name: "Min", cnName: "闽妹子", emoji: "🍵",
        gender: "female", age: 28, years: 5,
        languages: ["English", "中文", "閩南語"],
        tags: [{ en: "Fujian tea ceremony", zh: "福建茶艺" }, { en: "Minnan architecture & culture", zh: "闽南建筑与文化" }, { en: "Traditional opera", zh: "歌仔戏/高甲戏" }],
        intro: {
          en: "Certified tea master whose family has grown Tieguanyin (Iron Goddess) oolong tea for four generations. She can take you beyond the tourist tea houses to a genuine gongfu tea session in a Qing-era teahouse where the tea is literally grown by her uncle.",
          zh: "持证茶艺师，家族种铁观音已经四代了。她能带你越过游客茶楼，在清代老茶馆来一场正宗功夫茶——那里的茶真的是她叔叔种的。",
        },
        halfDayUSD: 80, fullDayUSD: 152,
      },
      {
        id: "xm-gu",
        photo: "/images/companions/xiamen_gu.png",
        name: "Gu", cnName: "鼓浪屿", emoji: "🎹",
        gender: "male", age: 26, years: 3,
        languages: ["English", "中文"],
        tags: [{ en: "Gulangyu piano museums & history", zh: "鼓浪屿钢琴博物馆与历史" }, { en: "Music & arts scene", zh: "音乐与艺术圈" }, { en: "Coastal cycling routes", zh: "海滨骑行路线" }],
        intro: {
          en: "Music school graduate who leads the most interesting Gulangyu tours — not the checklist route, but the one that takes you inside piano museums during rehearsal hours, to the hidden rooftop cafés with sea views, and tells you which colonial villa was built for which concubine (seriously).",
          zh: "音乐学校毕业，带最有意思的鼓浪屿游览——不是打卡路线，而是排练时间带你进钢琴博物馆、去有海景的天台隐秘咖啡馆、还告诉你哪栋洋房是为哪位姨太太建的（真的）。",
        },
        halfDayUSD: 75, fullDayUSD: 145,
      },
      {
        id: "xm-amoy",
        photo: "/images/companions/xiamen_amoy.png",
        name: "Amoy", cnName: "阿萌", emoji: "🦐",
        gender: "female", age: 24, years: 2,
        languages: ["English", "中文", "閩南語"],
        tags: [{ en: "Seafood & street food", zh: "海鲜与街头小吃" }, { en: "Night markets", zh: "夜市" }, { en: "Young & fun vibes", zh: "年轻有趣氛围" }],
        intro: {
          en: "Born in Siming District, she knows which seafood restaurant locals actually eat at (not the one your hotel recommends), where to find the best oyster omelette at 3am after clubbing, and why you should never order milk tea at certain bubble tea chains. The friendliest food guide in Xiamen.",
          zh: "思明区本地人，知道当地人真正去吃的是哪家海鲜餐厅（不是酒店推荐的那家）、凌晨 3 点蹦迪后去哪找最好吃的蚝煎、以及为什么某些奶茶连锁店的奶茶你绝对不该点。厦门最友好的美食向导。",
        },
        halfDayUSD: 70, fullDayUSD: 135,
      },
    ],
    charter: [
      { id: "xm-sedan", type: { en: "Comfort Sedan", zh: "舒适轿车" }, model: "Honda Accord", seats: 3, emoji: "🚙", perDayUSD: 135, note: { en: "City + ferry terminal", zh: "市区与码头" } },
      { id: "xm-mpv", type: { en: "MPV", zh: "商务车" }, model: "Buick GL8", seats: 6, emoji: "🚐", perDayUSD: 175, note: { en: "Gulangyu day trip + Quanzhou extension", zh: "鼓浪屿一日游+泉州延伸" } },
      { id: "xm-ferry", type: { en: "Ferry Tickets Arranged", zh: "代订船票" }, model: "Gulangyu Ferry", seats: 20, emoji: "⛴", perDayUSD: 30, note: { en: "Round-trip ferry + island transport", zh: "往返船票+岛上交通" } },
    ],
  },
];

export function getCompanionCity(slug: string): CompanionCity | undefined {
  return companionCities.find((c) => c.slug === slug);
}

export const allCompanions = companionCities.flatMap((c) =>
  c.companions.map((p) => ({ ...p, citySlug: c.slug, cityName: c.name }))
);
