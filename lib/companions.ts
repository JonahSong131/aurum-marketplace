import type { Localized } from "./i18n";

// ============================================================
// 本地陪玩（Local Companion）数据 —— AURUM
// 六座城市 · 每城一支真人地陪阵容 + 包车车型
// 说明：下面的地陪资料是可直接替换的模板，把 name/intro/photo/rate
// 换成你实际合作的地陪即可，页面会自动重排。
// ============================================================

export interface Companion {
  id: string;
  name: string; // 对外展示名（英文名优先，方便外国客人称呼）
  cnName?: string; // 中文名/昵称
  emoji: string; // 头像占位（没有真人照片时用）
  photo?: string; // 真人照片路径，放 public/images/companions/xxx.jpg
  age?: number;
  gender: "female" | "male";
  years: number; // 带客年数
  languages: string[]; // 可沟通语言
  tags: Localized[]; // 擅长标签
  intro: Localized;
  halfDayUSD: number; // 半天 4 小时
  fullDayUSD: number; // 整天 8 小时
}

export interface CharterOption {
  id: string;
  type: Localized; // 车型
  model: string; // 参考车款
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

// ---------------------------------------------------------------
// 服务方式（两种陪伴形态）
// ---------------------------------------------------------------
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

// ---------------------------------------------------------------
// 为什么选我们
// ---------------------------------------------------------------
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

// ---------------------------------------------------------------
// 六城地陪阵容
// ---------------------------------------------------------------
export const companionCities: CompanionCity[] = [
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
        photo: "/images/companions/beijing_lina.jpg",
        name: "Lina",
        cnName: "李娜",
        emoji: "🧣",
        gender: "female",
        age: 28,
        years: 5,
        languages: ["English", "中文"],
        tags: [
          { en: "History nerd", zh: "历史控" },
          { en: "Photo taking", zh: "会拍照" },
          { en: "Hutong food", zh: "胡同美食" },
        ],
        intro: {
          en: "Grew up three streets from the Drum Tower. Studied museum curation, now spends her weekends dragging friends to obscure Ming-dynasty gates. She will make the Forbidden City make sense.",
          zh: "在鼓楼边上长大，学博物馆策展出身，周末的爱好是拉着朋友去看没人知道的明代城门。她能把故宫讲成一个你听得懂的故事。",
        },
        halfDayUSD: 65,
        fullDayUSD: 110,
      },
      {
        id: "bj-marcus",
        photo: "/images/companions/beijing_marcus.jpg",
        name: "Marcus",
        cnName: "王喆",
        emoji: "🎒",
        gender: "male",
        age: 31,
        years: 6,
        languages: ["English", "中文", "Deutsch"],
        tags: [
          { en: "Great Wall hiking", zh: "长城徒步" },
          { en: "Driving", zh: "可自驾" },
          { en: "Craft beer", zh: "精酿啤酒" },
        ],
        intro: {
          en: "Has walked eleven different sections of the Great Wall, including the wild unrestored ones. Also knows every craft beer bar inside the second ring road. Good balance, honestly.",
          zh: "走过十一段长城，包括没修的野长城。同时熟悉二环内每一家精酿酒吧。这平衡挺好的。",
        },
        halfDayUSD: 70,
        fullDayUSD: 120,
      },
      {
        id: "bj-yuki",
        photo: "/images/companions/beijing_yuki.jpg",
        name: "Yuki",
        cnName: "陈雨",
        emoji: "☕",
        gender: "female",
        age: 25,
        years: 3,
        languages: ["English", "中文", "日本語"],
        tags: [
          { en: "Coffee & indie shops", zh: "咖啡小店" },
          { en: "Shopping", zh: "陪逛街" },
          { en: "Solo travellers", zh: "擅长一人游" },
        ],
        intro: {
          en: "A slow-travel person in a fast city. Best if you want a quiet Beijing — courtyard cafés, independent bookstores, and no queueing at 7am.",
          zh: "快城市里的慢性子。如果你想要一个安静的北京——四合院咖啡、独立书店、不用早上七点排队——找她准没错。",
        },
        halfDayUSD: 55,
        fullDayUSD: 95,
      },
    ],
    charter: [
      {
        id: "bj-sedan",
        type: { en: "Comfort Sedan", zh: "舒适轿车" },
        model: "Toyota Camry / VW Passat",
        seats: 3,
        emoji: "🚙",
        perDayUSD: 150,
        note: { en: "Couples or solo · city + airport runs", zh: "情侣或一人 · 市区与接送机" },
      },
      {
        id: "bj-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8 / Toyota Alphard",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 205,
        note: { en: "Families with luggage · Great Wall day trips", zh: "带行李的家庭 · 长城一日游" },
      },
      {
        id: "bj-van",
        type: { en: "Group Van", zh: "团体中巴" },
        model: "Mercedes Sprinter",
        seats: 14,
        emoji: "🚌",
        perDayUSD: 290,
        note: { en: "Groups of 7-14 · multi-stop routes", zh: "7-14 人团 · 多点串联路线" },
      },
    ],
  },

  {
    slug: "shanghai",
    emoji: "🌃",
    image: "/images/cities/shanghai.jpg",
    from: "#141b33",
    to: "#c78f2b",
    name: { en: "Shanghai", zh: "上海" },
    tagline: {
      en: "Neon on the Bund, plane trees in the lanes",
      zh: "外滩的霓虹，梧桐区的清晨",
    },
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
        photo: "/images/companions/shanghai_vivian.jpg",
        name: "Vivian",
        cnName: "顾维",
        emoji: "🕶️",
        gender: "female",
        age: 30,
        years: 7,
        languages: ["English", "中文", "Français"],
        tags: [
          { en: "Architecture walks", zh: "建筑漫步" },
          { en: "Nightlife", zh: "夜生活" },
          { en: "Fine dining", zh: "餐厅预订" },
        ],
        intro: {
          en: "Worked in a Bund heritage building for four years, so she knows which lobbies you are allowed to walk into. Excellent at getting tables that are supposedly full.",
          zh: "在外滩老建筑里上过四年班，所以她知道哪些大堂是可以走进去的。以及，特别擅长订到「已经满了」的餐厅。",
        },
        halfDayUSD: 75,
        fullDayUSD: 130,
      },
      {
        id: "sh-leo",
        photo: "/images/companions/shanghai_leo.jpg",
        name: "Leo",
        cnName: "周乐",
        emoji: "📷",
        gender: "male",
        age: 27,
        years: 4,
        languages: ["English", "中文"],
        tags: [
          { en: "Street photography", zh: "街拍摄影" },
          { en: "Coffee", zh: "咖啡地图" },
          { en: "Citywalk", zh: "城市漫步" },
        ],
        intro: {
          en: "Semi-pro street photographer. Brings his own camera and sends you the edited shots after — the closest thing to a free photoshoot you will get.",
          zh: "半职业街拍摄影师，自带相机，结束后把修好的图发给你——大概是你能拿到的最划算的一次写真。",
        },
        halfDayUSD: 65,
        fullDayUSD: 115,
      },
      {
        id: "sh-anna",
        photo: "/images/companions/shanghai_anna.jpg",
        name: "Anna",
        cnName: "苏安",
        emoji: "🍜",
        gender: "female",
        age: 34,
        years: 8,
        languages: ["English", "中文", "Español"],
        tags: [
          { en: "Families & kids", zh: "亲子家庭" },
          { en: "Local food", zh: "本帮美食" },
          { en: "Water towns", zh: "水乡近郊" },
        ],
        intro: {
          en: "Mother of two, which means she has already stress-tested every kid-friendly route in this city. Also the person to ask about Zhujiajiao versus Wuzhen.",
          zh: "两个孩子的妈，意味着这城市所有亲子路线她都实测过了。朱家角还是乌镇，问她就对了。",
        },
        halfDayUSD: 70,
        fullDayUSD: 120,
      },
    ],
    charter: [
      {
        id: "sh-sedan",
        type: { en: "Comfort Sedan", zh: "舒适轿车" },
        model: "Toyota Camry / Honda Accord",
        seats: 3,
        emoji: "🚙",
        perDayUSD: 155,
        note: { en: "City routes & Pudong airport", zh: "市区路线与浦东机场" },
      },
      {
        id: "sh-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 210,
        note: { en: "Water town day trips with luggage", zh: "带行李的水乡一日游" },
      },
      {
        id: "sh-lux",
        type: { en: "Executive", zh: "行政级" },
        model: "Mercedes E-Class / BMW 5",
        seats: 3,
        emoji: "🖤",
        perDayUSD: 265,
        note: { en: "Business trips & special occasions", zh: "商务出行与重要场合" },
      },
    ],
  },

  {
    slug: "chengdu",
    emoji: "🐼",
    image: "/images/cities/chengdu.jpg",
    from: "#1d3326",
    to: "#c7a52b",
    name: { en: "Chengdu", zh: "成都" },
    tagline: {
      en: "Pandas, mahjong, and nobody in a hurry",
      zh: "熊猫、麻将，和没人赶时间",
    },
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
        photo: "/images/companions/guide_bella.jpg",
        name: "Mia",
        cnName: "何苗",
        emoji: "🌶️",
        gender: "female",
        age: 26,
        years: 4,
        languages: ["English", "中文"],
        tags: [
          { en: "Hotpot expert", zh: "火锅专家" },
          { en: "Teahouse life", zh: "茶馆日常" },
          { en: "Night markets", zh: "夜市" },
        ],
        intro: {
          en: "Can order a hotpot at exactly the spice level a foreigner can survive, which is a rarer skill than it sounds. Knows the teahouse where the old men still get their ears cleaned.",
          zh: "能把火锅点到外国人刚好扛得住的辣度——这技能比听起来稀有。她知道那家还有老师傅采耳的茶馆。",
        },
        halfDayUSD: 55,
        fullDayUSD: 95,
      },
      {
        id: "cd-david",
        photo: "/images/companions/guide_jessie.jpg",
        name: "David",
        cnName: "邓伟",
        emoji: "🚗",
        gender: "male",
        age: 36,
        years: 9,
        languages: ["English", "中文"],
        tags: [
          { en: "Driver + guide", zh: "司机兼向导" },
          { en: "Day trips", zh: "近郊一日游" },
          { en: "Sichuan opera", zh: "川剧变脸" },
        ],
        intro: {
          en: "Nine years driving the Sichuan mountain roads. Doubles as your guide, so on longer day trips you are paying one person instead of two.",
          zh: "跑了九年川西山路，兼职当向导，所以长途一日游你只用付一个人的钱。",
        },
        halfDayUSD: 60,
        fullDayUSD: 105,
      },
      {
        id: "cd-sunny",
        photo: "/images/companions/guide_pipiwan_avatar.jpg",
        name: "Sunny",
        cnName: "罗珊",
        emoji: "🎋",
        gender: "female",
        age: 29,
        years: 5,
        languages: ["English", "中文", "한국어"],
        tags: [
          { en: "Panda volunteering", zh: "熊猫志愿者" },
          { en: "Hanfu photos", zh: "汉服写真" },
          { en: "Solo travellers", zh: "擅长一人游" },
        ],
        intro: {
          en: "Volunteered at the panda base for two seasons, so she knows exactly when the bears are awake and where the crowd is not. Also arranges hanfu shoots.",
          zh: "在熊猫基地做过两季志愿者，所以她知道熊猫什么时候醒着、人群在哪一侧。也能安排汉服写真。",
        },
        halfDayUSD: 55,
        fullDayUSD: 98,
      },
    ],
    charter: [
      {
        id: "cd-sedan",
        type: { en: "Comfort Sedan", zh: "舒适轿车" },
        model: "Toyota Camry",
        seats: 3,
        emoji: "🚙",
        perDayUSD: 130,
        note: { en: "City + panda base runs", zh: "市区与熊猫基地" },
      },
      {
        id: "cd-suv",
        type: { en: "Mountain SUV", zh: "越野 SUV" },
        model: "Toyota Highlander",
        seats: 5,
        emoji: "🏔️",
        perDayUSD: 175,
        note: { en: "Qingcheng / Bipenggou mountain roads", zh: "青城山 / 毕棚沟山路" },
      },
      {
        id: "cd-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 185,
        note: { en: "Family day trips", zh: "家庭一日游" },
      },
    ],
  },

  {
    slug: "xian",
    emoji: "🏛️",
    image: "/images/cities/xian.jpg",
    from: "#33241b",
    to: "#c78b2b",
    name: { en: "Xi'an", zh: "西安" },
    tagline: {
      en: "Thirteen dynasties and the best street food in China",
      zh: "十三朝古都，与全中国最好的街头小吃",
    },
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
        photo: "/images/companions/xian_omar.jpg",
        name: "Omar",
        cnName: "马海",
        emoji: "🥘",
        gender: "male",
        age: 33,
        years: 7,
        languages: ["English", "中文", "العربية"],
        tags: [
          { en: "Halal food", zh: "清真美食" },
          { en: "Silk Road history", zh: "丝路历史" },
          { en: "Muslim Quarter", zh: "回民街" },
        ],
        intro: {
          en: "Third-generation Hui family from the Muslim Quarter. Takes you to the stalls his grandmother approves of, not the ones on the main tourist street.",
          zh: "回民街三代回族人家。他带你去的是他奶奶认可的摊子，不是主街上给游客的那些。",
        },
        halfDayUSD: 55,
        fullDayUSD: 95,
      },
      {
        id: "xa-grace",
        photo: "/images/companions/xian_grace.jpg",
        name: "Grace",
        cnName: "白薇",
        emoji: "🏹",
        gender: "female",
        age: 29,
        years: 5,
        languages: ["English", "中文"],
        tags: [
          { en: "Archaeology", zh: "考古背景" },
          { en: "Terracotta Army", zh: "兵马俑" },
          { en: "Museums", zh: "博物馆" },
        ],
        intro: {
          en: "Archaeology degree from Northwest University. The Terracotta Army goes from 'a lot of statues' to genuinely astonishing when she explains it.",
          zh: "西北大学考古专业出身。经她一讲，兵马俑会从「好多雕像」变成真正让你震住的东西。",
        },
        halfDayUSD: 60,
        fullDayUSD: 100,
      },
      {
        id: "xa-kevin",
        photo: "/images/companions/xian_kevin.jpg",
        name: "Kevin",
        cnName: "秦凯",
        emoji: "🚲",
        gender: "male",
        age: 24,
        years: 3,
        languages: ["English", "中文"],
        tags: [
          { en: "City wall cycling", zh: "城墙骑行" },
          { en: "Night food crawl", zh: "深夜扫街" },
          { en: "Young travellers", zh: "年轻旅人" },
        ],
        intro: {
          en: "Local student energy, very cheap, very fun. Best for backpackers who want the late-night skewer version of Xi'an rather than the museum version.",
          zh: "本地学生的那股劲儿，便宜又好玩。想要深夜烧烤版西安而不是博物馆版西安的背包客，选他。",
        },
        halfDayUSD: 40,
        fullDayUSD: 75,
      },
    ],
    charter: [
      {
        id: "xa-sedan",
        type: { en: "Comfort Sedan", zh: "舒适轿车" },
        model: "VW Passat",
        seats: 3,
        emoji: "🚙",
        perDayUSD: 125,
        note: { en: "City + Terracotta Army", zh: "市区与兵马俑" },
      },
      {
        id: "xa-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 175,
        note: { en: "Family or 4-6 people", zh: "家庭或 4-6 人" },
      },
      {
        id: "xa-van",
        type: { en: "Group Van", zh: "团体中巴" },
        model: "Mercedes Sprinter",
        seats: 14,
        emoji: "🚌",
        perDayUSD: 260,
        note: { en: "Huashan or Famen Temple long days", zh: "华山 / 法门寺长线" },
      },
    ],
  },

  {
    slug: "hangzhou",
    emoji: "🍵",
    image: "/images/cities/hangzhou.jpg",
    from: "#16302b",
    to: "#c7b02b",
    name: { en: "Hangzhou", zh: "杭州" },
    tagline: {
      en: "A lake, a tea hill, and a very soft pace",
      zh: "一片湖，一座茶山，和很软的节奏",
    },
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
        photo: "/images/companions/hangzhou_tina.jpg",
        name: "Tina",
        cnName: "叶婷",
        emoji: "🍃",
        gender: "female",
        age: 31,
        years: 6,
        languages: ["English", "中文"],
        tags: [
          { en: "Tea ceremony", zh: "茶道" },
          { en: "West Lake", zh: "西湖" },
          { en: "Slow travel", zh: "慢旅行" },
        ],
        intro: {
          en: "Her family still owns a small Longjing plot up the hill. Tea with her is not a tourist performance, it is just tea in someone's house.",
          zh: "她家在山上还有一小片龙井茶园。跟她喝茶不是给游客看的表演，就是在别人家里喝茶。",
        },
        halfDayUSD: 55,
        fullDayUSD: 98,
      },
      {
        id: "hz-jason",
        photo: "/images/companions/hangzhou_jason.jpg",
        name: "Jason",
        cnName: "吴劲",
        emoji: "🚴",
        gender: "male",
        age: 28,
        years: 4,
        languages: ["English", "中文"],
        tags: [
          { en: "Cycling routes", zh: "骑行路线" },
          { en: "Water towns", zh: "水乡" },
          { en: "Photography", zh: "摄影" },
        ],
        intro: {
          en: "Rides the lake loop most mornings. Will get you on a bike and out to the quiet western side where the tour buses do not go.",
          zh: "基本每天早上绕湖骑一圈。他会让你上车，骑到旅游大巴到不了的西侧安静地带。",
        },
        halfDayUSD: 55,
        fullDayUSD: 95,
      },
      {
        id: "hz-coco",
        photo: "/images/companions/hangzhou_coco.jpg",
        name: "Coco",
        cnName: "沈可",
        emoji: "👘",
        gender: "female",
        age: 25,
        years: 3,
        languages: ["English", "中文", "日本語"],
        tags: [
          { en: "Hanfu & photo shoots", zh: "汉服写真" },
          { en: "Cafés", zh: "咖啡" },
          { en: "Shopping", zh: "陪逛" },
        ],
        intro: {
          en: "Runs a small hanfu rental on the side. If your Hangzhou plan is essentially 'take beautiful photos and drink things', she is your person.",
          zh: "副业开了个小汉服租赁店。如果你的杭州计划本质上就是「拍好看的照片、喝点东西」，找她。",
        },
        halfDayUSD: 50,
        fullDayUSD: 90,
      },
    ],
    charter: [
      {
        id: "hz-sedan",
        type: { en: "Comfort Sedan", zh: "舒适轿车" },
        model: "Toyota Camry",
        seats: 3,
        emoji: "🚙",
        perDayUSD: 130,
        note: { en: "Lake loop & tea villages", zh: "环湖与茶村" },
      },
      {
        id: "hz-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 180,
        note: { en: "Wuzhen / Xitang day trips", zh: "乌镇 / 西塘一日游" },
      },
      {
        id: "hz-suv",
        type: { en: "SUV", zh: "SUV" },
        model: "Honda CR-V",
        seats: 5,
        emoji: "🚘",
        perDayUSD: 150,
        note: { en: "Mountain temples & Moganshan", zh: "山中古寺与莫干山" },
      },
    ],
  },

  {
    slug: "dali",
    emoji: "⛰️",
    image: "/images/cities/dali.jpg",
    from: "#1b2c33",
    to: "#c7702b",
    name: { en: "Dali", zh: "大理" },
    tagline: {
      en: "Wind, flowers, snow and moon — and no schedule",
      zh: "风花雪月，以及没有行程表",
    },
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
        photo: "/images/companions/dali_amy.jpg",
        name: "Amy",
        cnName: "杨阿玫",
        emoji: "🌺",
        gender: "female",
        age: 27,
        years: 4,
        languages: ["English", "中文", "白语"],
        tags: [
          { en: "Bai ethnic culture", zh: "白族文化" },
          { en: "Tie-dye workshops", zh: "扎染体验" },
          { en: "Village markets", zh: "赶集" },
        ],
        intro: {
          en: "Bai ethnic, born in Xizhou. Takes you to the market days in the villages around the lake — the ones that happen on a rotating schedule only locals track.",
          zh: "白族，喜洲人。她带你去环湖村子的赶集日——那种只有本地人才记得住的轮转日程。",
        },
        halfDayUSD: 45,
        fullDayUSD: 85,
      },
      {
        id: "dl-river",
        photo: "/images/companions/dali_river.jpg",
        name: "River",
        cnName: "赵川",
        emoji: "🏍️",
        gender: "male",
        age: 30,
        years: 5,
        languages: ["English", "中文"],
        tags: [
          { en: "Erhai loop driving", zh: "洱海环线" },
          { en: "Cangshan hiking", zh: "苍山徒步" },
          { en: "Sunset spots", zh: "日落机位" },
        ],
        intro: {
          en: "Moved here from Shenzhen six years ago and never went back. Knows every unmarked pull-over on the Erhai loop where the light is good.",
          zh: "六年前从深圳搬来就没回去过。洱海环线上每个没标记但光线很好的停车点，他都知道。",
        },
        halfDayUSD: 50,
        fullDayUSD: 90,
      },
      {
        id: "dl-nina",
        photo: "/images/companions/dali_nina.jpg",
        name: "Nina",
        cnName: "林霓",
        emoji: "🎸",
        gender: "female",
        age: 33,
        years: 6,
        languages: ["English", "中文", "Deutsch"],
        tags: [
          { en: "Live music bars", zh: "live 小酒馆" },
          { en: "Coffee & bookshops", zh: "咖啡与书店" },
          { en: "Long-stay advice", zh: "长住建议" },
        ],
        intro: {
          en: "Ran a guesthouse in the old town for four years. If you are thinking about staying in Dali for a month instead of three days, talk to her.",
          zh: "在古城开过四年客栈。如果你在考虑在大理待一个月而不是三天，跟她聊聊。",
        },
        halfDayUSD: 50,
        fullDayUSD: 88,
      },
    ],
    charter: [
      {
        id: "dl-suv",
        type: { en: "Lake-loop SUV", zh: "环湖 SUV" },
        model: "Honda CR-V / Toyota RAV4",
        seats: 5,
        emoji: "🚘",
        perDayUSD: 135,
        note: { en: "Erhai loop with photo stops", zh: "洱海环线含拍照停靠" },
      },
      {
        id: "dl-mpv",
        type: { en: "Business MPV", zh: "商务 MPV" },
        model: "Buick GL8",
        seats: 6,
        emoji: "🚐",
        perDayUSD: 170,
        note: { en: "Dali → Lijiang / Shaxi transfers", zh: "大理往丽江 / 沙溪转场" },
      },
      {
        id: "dl-conv",
        type: { en: "Open-top Classic", zh: "敞篷老爷车" },
        model: "Vintage convertible",
        seats: 3,
        emoji: "🚗",
        perDayUSD: 195,
        note: { en: "The Erhai photo cliché, done well", zh: "洱海经典机位，但拍得好看" },
      },
    ],
  },
];

export function getCompanionCity(slug: string): CompanionCity | undefined {
  return companionCities.find((c) => c.slug === slug);
}

export const allCompanions = companionCities.flatMap((c) =>
  c.companions.map((p) => ({ ...p, citySlug: c.slug, cityName: c.name }))
);
