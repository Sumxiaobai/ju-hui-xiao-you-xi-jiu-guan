const appRoot = document.getElementById("app");

const STORAGE_KEYS = {
  players: "party-tavern-players",
  soundEnabled: "party-tavern-sound-enabled",
  showBonus: "party-tavern-show-bonus",
  session: "party-tavern-room-session",
};

const VIEW_TITLES = {
  lobby: "进入房间",
  home: "主页",
  truth: "真心话",
  dare: "大冒险",
  tod: "真心话大冒险",
  cards: "纸牌小游戏",
  players: "自定义玩家设置",
};

const LEVELS = ["全部", "轻松", "搞笑", "微刺激"];
const DEFAULT_PLAYER_COUNT = 4;
const ROOM_MEMBER_TTL = 35000;
const ROOM_HEARTBEAT_MS = 12000;
const HOLD_EM_MAX_PLAYERS = 8;
const FIREBASE_SDK_VERSION = window.PARTY_TAVERN_FIREBASE?.sdkVersion || "12.5.0";
const DEFAULT_FIREBASE_COLLECTION = "partyRooms";

const HOME_MODULES = [
  {
    route: "truth",
    badge: "真",
    title: "真心话",
    description: "随机点名并抽题，支持轻松、搞笑、微刺激三档题库筛选。",
    buttonText: "开始真心话",
  },
  {
    route: "dare",
    badge: "冒",
    title: "大冒险",
    description: "现场能立刻执行的任务卡，氛围热起来但不过火。",
    buttonText: "开始大冒险",
  },
  {
    route: "tod",
    badge: "选",
    title: "真心话大冒险",
    description: "随机抽人后现场二选一，也能交给命运随机分配。",
    buttonText: "开始二选一",
  },
  {
    route: "cards",
    badge: "牌",
    title: "纸牌小游戏",
    description: "六种扑克牌玩法集中在一页，适合多人围着屏幕快速玩。",
    buttonText: "进入纸牌中心",
  },
  {
    route: "players",
    badge: "人",
    title: "自定义玩家设置",
    description: "添加名字、删除名字、随机点名，游戏会自动读取玩家列表。",
    buttonText: "设置玩家",
  },
];

const TRUTH_SOURCE = {
  轻松: [
    "今天来之前你最期待什么？",
    "最近一次让你瞬间开心的小事是什么？",
    "在场谁最会活跃气氛？",
    "你最常点的外卖是什么？",
    "你小时候最想学会的技能是什么？",
    "最近最想去哪个城市玩？",
    "你最离不开的手机 App 是哪个？",
    "你觉得自己最适合当哪种聚会担当？",
    "最近循环播放的一首歌是什么？",
    "你最擅长做的一道家常菜是什么？",
    "如果明天放假，你最想怎么过？",
    "你最喜欢的一部喜剧作品是什么？",
    "你小时候的外号是什么？",
    "你最想拥有哪种超能力，但只限日常生活？",
    "最近一次忍不住大笑是因为什么？",
    "你最不想在聚会里负责的事是什么？",
    "如果让你立刻推荐一部电影，会选哪部？",
    "你最想和朋友一起尝试的活动是什么？",
    "你觉得自己聊天时最大的优点是什么？",
    "最近一次被美食治愈是什么时候？",
    "你最喜欢别人怎么称呼你？",
    "你觉得今天谁最像气氛组？",
  ],
  搞笑: [
    "你做过最离谱的口误是什么？",
    "你有没有把消息发错群或发错人过？最尴尬的一次是什么？",
    "如果现在要给自己取个搞笑艺名，会叫什么？",
    "你最像哪种动物？为什么？",
    "如果你是一道下酒菜，你觉得自己是什么？",
    "你模仿过谁说话最像？",
    "你做过最中二的一件事是什么？",
    "你有没有假装很懂其实完全不懂的时候？",
    "如果你的生活是一档综艺，标题叫什么？",
    "你最社死的一次拍照经历是什么？",
    "你会给自己的起床状态打几分？",
    "如果让你开一家奇怪的小店，会卖什么？",
    "你手机里最舍不得删的一张搞笑照片是什么类型？",
    "你最常用的拖延理由是什么？",
    "你有没有因为嘴快而后悔过？说的是哪次？",
    "你会用哪句话形容自己点奶茶时的犹豫？",
    "你最像朋友口中的哪种“典型人物”？",
    "如果你突然成了网红，你觉得会因为什么出圈？",
    "你最奇怪但真实的小习惯是什么？",
    "如果让你为今天这桌人起一个组合名，会叫什么？",
    "你最怕被朋友公开的黑历史是什么类型？",
    "你觉得自己喝到微醺时最明显的表现是什么？",
  ],
  微刺激: [
    "在场谁最有可能突然来一场说走就走的旅行？",
    "如果只能把秘密告诉在场一个人，你会选谁？",
    "在场谁的第一印象和现在反差最大？",
    "如果让你夸在场一个人最吸引人的一点，你会夸谁什么？",
    "在场谁最像会偷偷准备惊喜的人？",
    "如果要把一项家务外包给在场某位朋友，你最信任谁？",
    "你最近一次嘴硬心软是什么时候？",
    "在场谁最适合当旅行搭子？",
    "如果要找人陪你熬夜聊天到三点，你会选谁？",
    "你最近有没有故意装作不在意，其实很在意的事？",
    "你更容易先主动道歉还是等对方开口？",
    "在场谁最可能突然脱口而出真话？",
    "你最近一次小小吃醋是因为什么？",
    "你会把心事先告诉朋友还是自己消化？",
    "在场谁最适合和你一起创业？为什么？",
    "如果让你现在给一位朋友发“谢谢你”，你会发给谁？",
    "你最怕别人误解你的哪一点？",
    "你有没有默默关注某个人很久却一直没开口？",
    "在场谁最可能在关键时刻最靠谱？",
    "如果今晚结束后只能单独再约一个人继续聊天，你会选谁？",
    "你做决定时更看感觉还是更看现实？",
    "你最近一次想重来一次的决定是什么？",
  ],
};

const DARE_SOURCE = {
  轻松: [
    "和任意一人碰杯并说一句“今晚辛苦了”。",
    "用一句话总结今天的自己。",
    "做一个你最标准的比心动作保持 3 秒。",
    "对左手边的人说一句真诚夸奖。",
    "用播音腔念出菜单上你最想点的一样东西。",
    "模拟主持人介绍今晚这场聚会。",
    "选一个字，用三种语气说出来。",
    "和全桌一起倒数三二一举杯。",
    "用一句台词邀请大家继续玩下一轮。",
    "站起来向全场行一个夸张但礼貌的谢幕礼。",
    "说出三种适合今晚的祝酒词。",
    "用最温柔的语气提醒大家适度饮酒。",
    "指定一位朋友，模仿对方平时最有辨识度的动作。",
    "用三个词形容右手边的人。",
    "给大家表演一个无声版“我很开心”。",
    "把“今晚很热闹”用开心、严肃、神秘三种语气说一遍。",
    "用一句广告词推销这次聚会。",
    "现场设计一个大家都能跟着做的庆祝手势。",
    "说一个你最近学会的小技能。",
    "对着空气做一个“胜利合影”姿势。",
    "用一句话感谢组织这次聚会的人。",
    "选一位朋友，和对方同步击掌三次。",
  ],
  搞笑: [
    "模仿一个经典表情包 5 秒。",
    "用电视剧旁白口吻介绍自己。",
    "假装自己是天气预报员播报今晚氛围。",
    "用动物叫声表达“我饿了”。",
    "模仿手机低电量时的状态演 5 秒。",
    "假装是外卖员送来今晚的快乐。",
    "用夸张语气念出“再来一轮”。",
    "模仿你起床后第一分钟的样子。",
    "站起来走一圈，假装自己在走红毯。",
    "用 5 秒演出“看到烤串上桌的反应”。",
    "给桌上某样东西起一个高级时尚新品名。",
    "用古装剧台词向大家申请再玩一轮。",
    "假装你是短视频博主，给今晚拍一条口播。",
    "用一种奇怪但清晰的节奏说出自己的名字三遍。",
    "模仿你最熟悉的一位同事或同学打招呼。",
    "用“全是感情，没有技巧”的状态表演碰杯。",
    "给在场所有人起一个两字绰号。",
    "用 AI 机器人口吻夸一下今晚的气氛。",
    "对着屏幕摆一个“我准备好了”封面姿势。",
    "用新闻联播语气宣布“零食已经到位”。",
    "模仿侦探发现最后一串肉被抢走的反应。",
    "用夸张配音讲述你刚刚拿到的这道任务。",
  ],
  微刺激: [
    "给在场一位朋友发一条“今晚见到你很开心”的消息，截图可免喝，否则喝一口。",
    "和右手边的人对视 3 秒，谁先笑谁举杯。",
    "认真夸在场一位朋友三句，不能重复意思。",
    "把手机最近一张风景照展示 3 秒，如果没有就喝一口。",
    "用一句话回答“你最近最需要的鼓励是什么”。",
    "让左手边的人给你指定一个口头禅，你接下来一轮说话要带上它。",
    "选一位朋友和你一起完成一个同步碰杯动作。",
    "把你最近想做但还没做的一件事大声说出来。",
    "给自己定一个今晚结束前能完成的小目标并说出来。",
    "让在场一位朋友为你起一个今晚限定昵称，你要接受到下一轮。",
    "对任意一人说一句“下次还约”。",
    "用三句话做一个真诚版自我介绍。",
    "让大家投票，你今天最像哪种聚会角色。",
    "说出一个你想改掉的小毛病。",
    "和一位朋友交换座位一轮。",
    "把下一轮发言机会让给别人，并为对方鼓掌。",
    "对全场说一句你平时不太好意思说的感谢。",
    "请一位朋友替你选“喝一口”或“表演一个庆祝动作”，你执行。",
    "说出今晚在场你最想一起合照的人。",
    "给自己一个 10 秒钟的“人生建议”演讲。",
    "说出一个你最近偷偷在努力的方向。",
    "让全场帮你选一个表情，你保持 5 秒。",
  ],
};

const REWARD_BANK = [
  "下一轮你可以拥有一次免喝权。",
  "指定一位朋友替你完成下一次碰杯动作。",
  "全场为你鼓掌三下，你原地接受夸夸。",
  "你可以决定下一位抽题的人。",
  "本轮你有权把一个小任务改成一句祝酒词。",
  "任选一位朋友和你一起获得“轻松过关”资格。",
  "你可以点一首背景歌并让大家跟着哼两句。",
  "下一次抽到喝酒指令时，你可以改成回答一个轻松问题。",
  "获得一次“换题不换人”机会。",
  "你可以让在场一位朋友给你一句今日夸奖。",
  "得到“氛围官”称号，下一轮由你喊开始。",
  "你可以发起一次全体碰杯，不用额外加罚。",
];

const PENALTY_BANK = [
  "喝一小口，并分享一个今天的小确幸。",
  "说一句真诚祝酒词后再继续下一轮。",
  "原地做一个庆祝手势并保持 3 秒。",
  "向左手边的人夸一句今晚状态最好看的地方。",
  "用主持人口吻喊出“下一轮开始”。",
  "给自己起一个今晚限定昵称，维持到下一轮结束。",
  "用一句话总结此刻的心情。",
  "和任意一位朋友碰杯一次，气氛补满。",
  "说出一个最近在追的内容，不限综艺或影视。",
  "给全场做一个无声版开心表情。",
  "下一轮发言前先说“我准备好了”。",
  "模仿自己最困的时候 3 秒钟。",
];

const ATMOSPHERE_TIPS = [
  "轮流发言会让每个人都更有参与感，别急着抢答。",
  "任务和惩罚都可以适度调整，现场舒服最重要。",
  "如果有人不想做某项任务，可以改成喝一小口或换题。",
  "尽量给每位朋友都留到出场机会，气氛会更顺。",
  "保持节奏很重要，卡住时就直接点“下一题”继续。",
  "文明玩笑比用力起哄更高级，大家都会更放松。",
  "喝酒只是点缀，开心聊天和互动才是今晚主角。",
  "轮到别人发言时多一点认真听，下一轮会更好玩。",
];

const ROULETTE_CARDS = [
  { id: "roulette-1", title: "禁词令", detail: "接下来一轮里不能说“我”，谁先说谁喝一小口。", tag: "口头规则" },
  { id: "roulette-2", title: "反手规则", detail: "下一次碰杯或拿杯子时，必须用非惯用手完成。", tag: "动作规则" },
  { id: "roulette-3", title: "指定喝", detail: "你指定一位朋友喝一小口，并说一句理由，但理由必须温柔。", tag: "点名互动" },
  { id: "roulette-4", title: "免喝卡", detail: "你本轮拥有一次免喝权，可以自己留着，也可以送人。", tag: "幸运牌" },
  { id: "roulette-5", title: "交换座位", detail: "和距离你最远的一位朋友交换座位一轮。", tag: "位置变化" },
  { id: "roulette-6", title: "静音十秒", detail: "未来 10 秒只能用手势表达，不能说话。", tag: "气氛小挑战" },
  { id: "roulette-7", title: "夸夸接力", detail: "从你开始顺时针，每人夸下一位朋友一句。", tag: "暖场互动" },
  { id: "roulette-8", title: "下一轮翻倍", detail: "你下一次若被点到喝酒，数量自动加一口。", tag: "风险加成" },
  { id: "roulette-9", title: "自救卡", detail: "你可以把下一次任务转送给任意一位朋友。", tag: "策略牌" },
  { id: "roulette-10", title: "口头禅", detail: "下一轮每次发言前都要先说“我宣布”。", tag: "口头规则" },
  { id: "roulette-11", title: "节奏拍手", detail: "抽到后全体先拍手三下，再继续下一轮。", tag: "集体动作" },
  { id: "roulette-12", title: "快问快答", detail: "任意一位朋友问你一个问题，你必须在 5 秒内回答。", tag: "快节奏" },
  { id: "roulette-13", title: "合作牌", detail: "你选一位搭档，本轮之后的下一项任务由你们一起完成。", tag: "双人互动" },
  { id: "roulette-14", title: "沉默观察员", detail: "直到下一轮开始前，你只能点头或摇头回应。", tag: "表情模式" },
  { id: "roulette-15", title: "幸运转移", detail: "把你的下一次喝酒任务转送给左手边的人。", tag: "转移规则" },
  { id: "roulette-16", title: "右手边优先", detail: "下一次碰杯时，你必须先和右手边的朋友碰。", tag: "顺序规则" },
  { id: "roulette-17", title: "祝酒官", detail: "下一次全体举杯时，由你负责喊今晚口号。", tag: "氛围担当" },
  { id: "roulette-18", title: "反客为主", detail: "接下来由你指定下一位抽牌或抽题的人。", tag: "控制权" },
];

const BIG_SISTER_RULES = {
  K: {
    title: "大姐令",
    detail: "抽到的人成为本轮“大姐”。直到下一张 K 出现前，所有人和你说话前要先喊一声“姐”，忘记的人喝一小口。",
    persistent: true,
    effectText: "说话前先喊姐",
  },
  Q: {
    title: "副手牌",
    detail: "指定一位朋友当你的副手。你下一次被点任务或喝酒时，对方要陪你一起完成。",
    persistent: true,
    effectText: "副手陪同执行",
  },
  J: {
    title: "审问牌",
    detail: "你可以连续对任意一位朋友发出 3 个快问快答问题，对方必须立刻回答。",
  },
  A: {
    title: "反转牌",
    detail: "你可以宣布一条临时规则生效一轮，例如“发言前先说收到”，或废除当前一条持续规则。",
    persistent: true,
    effectText: "临时口头规则",
  },
  10: {
    title: "话题炸弹",
    detail: "你说出一个轻松话题，全场顺时针每人都要答一句，卡住的人喝一小口。",
  },
  9: {
    title: "九秒应答",
    detail: "指定一位朋友在 9 秒内说出 3 个关键词，超时就喝一小口。",
  },
  8: {
    title: "交换视角",
    detail: "和任意一位朋友交换座位一轮，或者互换一个今晚限定昵称。",
  },
  7: {
    title: "跟手挑战",
    detail: "你做一个动作，全场在 3 秒内跟上，最慢的人喝一小口。",
    persistent: true,
    effectText: "跟手动作延续到下轮开始",
  },
  6: {
    title: "六字夸夸",
    detail: "你必须用六个字夸一位朋友，卡壳就喝一小口。",
  },
  5: {
    title: "五选一",
    detail: "从真心话、碰杯、表演动作、唱一句、副手协助中选五选一执行。",
  },
  4: {
    title: "四拍节奏",
    detail: "带全场拍四下节奏，谁乱拍谁喝一小口。",
  },
  3: {
    title: "三人联盟",
    detail: "你指定另外两位朋友组成三人小队，下一次其中任意一人被点任务，其余两人要陪同。",
    persistent: true,
    effectText: "三人小队陪同一次",
  },
  2: {
    title: "小姐回响",
    detail: "沿用小姐牌的轻量版规则：指定一位朋友回答一个轻微真心话，不想答就喝一小口。",
  },
};

const BIG_SISTER_SUIT_HINTS = {
  "♠": "黑桃附加：动作要果断，拖太久就加一口小惩罚。",
  "♥": "红桃附加：这张更偏向真诚互动，完成后可以指定下一位抽牌人。",
  "♣": "梅花附加：这张更偏向现场表演，投入一点会更有节目效果。",
  "♦": "方块附加：这张更偏向幸运加成，执行顺利可以获得一次免喝权。",
};

const SUITS = [
  { symbol: "♠", name: "黑桃", color: "black" },
  { symbol: "♥", name: "红桃", color: "red" },
  { symbol: "♣", name: "梅花", color: "black" },
  { symbol: "♦", name: "方块", color: "red" },
];

const RANKS = [
  { label: "A", value: 14 },
  { label: "K", value: 13 },
  { label: "Q", value: 12 },
  { label: "J", value: 11 },
  { label: "10", value: 10 },
  { label: "9", value: 9 },
  { label: "8", value: 8 },
  { label: "7", value: 7 },
  { label: "6", value: 6 },
  { label: "5", value: 5 },
  { label: "4", value: 4 },
  { label: "3", value: 3 },
  { label: "2", value: 2 },
];

const LUCKY_RULES = {
  A: { title: "A 指定一人", detail: "指定任意一位朋友回答一个轻松问题；如果跳过，就喝一小口。" },
  K: { title: "K 全体举杯", detail: "全体一起举杯说一句“今晚快乐”，最慢跟上的人喝一口。" },
  Q: { title: "Q 自我挑战", detail: "你自己选择回答一个真心话，或者直接喝两小口。" },
  J: { title: "J 左边的人", detail: "左手边的朋友要用一句台词夸今晚气氛，不愿意就喝一口。" },
  10: { title: "10 小目标", detail: "说出一个最近最想完成的小目标，说完即可过关。" },
  9: { title: "9 秒快答", detail: "9 秒内说出三种下酒菜或零食，超时喝一口。" },
  8: { title: "8 碰杯卡", detail: "你要立刻和任意一位朋友碰杯，并互夸一句。" },
  7: { title: "7 字词挑战", detail: "说出 7 个和聚会相关的词，卡住就喝一口。" },
  6: { title: "6 秒姿势", detail: "摆一个 6 秒钟的搞笑姿势，让全场给你评分。" },
  5: { title: "5 指令", detail: "全体同时伸手比 5，最慢的人喝一口。" },
  4: { title: "4 字形容", detail: "用四个字形容今晚的气氛，不能重复别人说过的。" },
  3: { title: "3 件开心事", detail: "说出最近让你开心的三件小事，说完直接过关。" },
  2: { title: "2 人同盟", detail: "指定一位朋友和你一起喊一句今晚口号，然后一起碰杯。" },
};

const LUCKY_SUIT_HINTS = {
  "♥": "红桃彩蛋：更偏向真诚互动，执行顺利的话，你可以指定下一位抽牌人。",
  "♠": "黑桃彩蛋：更偏向快节奏，动作要果断，拖太久容易被现场起哄。",
  "♣": "梅花彩蛋：更偏向现场任务，做得越投入越有节目效果。",
  "♦": "方块彩蛋：更偏向好运加成，完成后你可以要求现场给一句夸奖。",
};

const KING_RULES = {
  K: { title: "国王点将", detail: "指定两位朋友互夸一句，然后一起喝一小口。" },
  Q: { title: "女王礼仪", detail: "直到下一轮结束，发言前要先说“请”。忘记的人喝一口。" },
  J: { title: "快问快答", detail: "你指定一位朋友，在 5 秒内回答你的问题。" },
  A: { title: "自由卡", detail: "你可以选择自己免喝一次，或指定一位朋友喝一小口。" },
  10: { title: "组队碰杯", detail: "找一位搭档一起碰杯，并喊出今晚口号。" },
  9: { title: "数字挑战", detail: "9 秒内说出 3 个旅行城市，失败喝一口。" },
  8: { title: "传递好运", detail: "指定一位朋友获得下一次免喝权。" },
  7: { title: "左右开弓", detail: "和左右两边的人同时碰杯，如果做不到就喝一口。" },
  6: { title: "六秒表演", detail: "做一个 6 秒庆祝动作，现场评分过半就算成功。" },
  5: { title: "五字赞美", detail: "用五个字夸今晚气氛，不能卡壳。" },
  4: { title: "四拍节奏", detail: "带大家拍手四下，节奏错的人喝一口。" },
  3: { title: "三选一", detail: "自己选真心话、表演一个动作，或喝一小口。" },
  2: { title: "双人任务", detail: "指定一位朋友和你一起完成一个击掌动作。" },
};

const KING_RULE_ORDER = ["K", "Q", "J", "A", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const BIG_SISTER_RULE_ORDER = ["K", "Q", "J", "A", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

const TRUTH_BANK = buildBank(TRUTH_SOURCE, "truth");
const DARE_BANK = buildBank(DARE_SOURCE, "dare");

const state = createInitialState();

let audioContext = null;
let roomHeartbeatTimer = null;
let roomSyncTimer = null;
const firebaseRuntime = createFirebaseRuntime();

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("input", handleInput);
window.addEventListener("storage", handleStorageSync);
window.addEventListener("beforeunload", handleBeforeUnload);

initializeApp();

function initializeApp() {
  state.bonusResult = getRandomBonusResult();
  primeCardGames();

  if (state.session.joined && state.session.roomCode && state.session.nickname) {
    attachToRoom(state.session.nickname, state.session.roomCode, { silent: true, restoreShared: true });
  } else if (state.roomDraft.roomCode) {
    replaceRoomUrl(state.roomDraft.roomCode);
  }

  renderApp();
}

function createInitialState() {
  const session = createSessionState();
  return {
    session,
    roomDraft: {
      nickname: session.nickname || "",
      roomCode: session.roomCode || getRoomCodeFromUrl(),
    },
    roomNotice: "",
    view: "home",
    players: loadStorage(STORAGE_KEYS.players, []),
    playerDraft: "",
    spotlightPlayer: "",
    soundEnabled: loadStorage(STORAGE_KEYS.soundEnabled, false),
    showBonus: loadStorage(STORAGE_KEYS.showBonus, true),
    bonusResult: null,
    tipIndex: Math.floor(Math.random() * ATMOSPHERE_TIPS.length),
    truth: createPromptSession(),
    dare: createPromptSession(),
    combo: createComboSession(),
    cards: createCardCenterState(),
    room: createRoomRuntimeState(),
  };
}

function createSessionState() {
  const saved = loadStorage(STORAGE_KEYS.session, null);
  return {
    memberId: saved?.memberId || generateId("member"),
    nickname: saved?.nickname || "",
    roomCode: saved?.roomCode || "",
    joinedAt: saved?.joinedAt || 0,
    joined: Boolean(saved?.joined && saved?.roomCode && saved?.nickname),
  };
}

function createRoomRuntimeState() {
  return {
    code: "",
    syncMode: getDefaultRoomSyncMode(),
    members: [],
    lastUpdatedAt: 0,
    lastSharedHash: "",
    connectionState: hasFirebaseConfig() ? "idle" : "local",
    remoteError: "",
  };
}

function getFirebaseOptions() {
  return window.PARTY_TAVERN_FIREBASE || {};
}

function getFirebaseCollectionName() {
  return getFirebaseOptions().collection || DEFAULT_FIREBASE_COLLECTION;
}

function hasFirebaseConfig() {
  const config = getFirebaseOptions().config;
  return Boolean(config?.apiKey && config?.projectId && config?.appId);
}

function createFirebaseRuntime() {
  return {
    enabled: hasFirebaseConfig(),
    scripts: new Map(),
    initPromise: null,
    firebase: null,
    app: null,
    auth: null,
    db: null,
    user: null,
    roomUnsubscribe: null,
    membersUnsubscribe: null,
    roomRef: null,
    membersRef: null,
    roomCode: "",
    connected: false,
    joinToken: "",
    authMode: "pending",
  };
}

function getDefaultRoomSyncMode() {
  return hasFirebaseConfig() ? "Firebase 实时房间待连接" : "浏览器本地房间";
}

function isFirebaseRoomActive() {
  return firebaseRuntime.connected && firebaseRuntime.roomCode === state.room.code;
}

function isFirebaseGuestMode() {
  return firebaseRuntime.authMode === "guest";
}

function getRoomSyncEngineText() {
  if (isFirebaseRoomActive()) {
    return isFirebaseGuestMode() ? "Firebase 实时同步（游客模式）" : "Firebase 匿名登录 + Firestore 实时同步";
  }
  if (hasFirebaseConfig() && state.room.connectionState === "connecting") {
    return "正在建立 Firebase 实时连接";
  }
  if (hasFirebaseConfig() && state.room.connectionState === "error") {
    return "Firebase 连接失败，已自动降级到本地房间";
  }
  return "浏览器本地房间（无后端）";
}

function getJoinedRoomSubtitle() {
  if (!state.session.joined) {
    return "先输入昵称登录并创建或加入房间，再一起进入同一个游戏大厅。";
  }

  if (isFirebaseRoomActive()) {
    return isFirebaseGuestMode()
      ? `当前房间 ${state.room.code} 已接入 Firebase 实时同步，不同手机或电脑进入同一房间后会共享内容。当前使用的是轻量游客模式。`
      : `当前房间 ${state.room.code} 已接入 Firebase 实时同步，不同手机或电脑进入同一房间后会共享内容。`;
  }

  if (hasFirebaseConfig() && state.room.connectionState === "connecting") {
    return `当前房间 ${state.room.code} 正在连接 Firebase 实时房间，连接完成后会自动切换成跨设备同步。`;
  }

  if (hasFirebaseConfig() && state.room.connectionState === "error") {
    return `当前房间 ${state.room.code} 已回退到浏览器本地房间模式。${state.room.remoteError || "请检查 Firebase 配置与权限。"}`;
  }

  return `当前房间 ${state.room.code} 正在使用浏览器本地房间模式，同浏览器标签页可以同步内容。`;
}

function getLobbyModeDescription() {
  if (hasFirebaseConfig()) {
    return "已检测到 Firebase 配置：进入房间后会用匿名身份登录，并通过 Firestore 在不同设备之间实时同步。题库和规则仍然全部写在前端文件里。";
  }
  return "当前默认是纯前端本地房间模式：题库和规则都写在文件里，不需要数据库就能跑；按项目里的 FIREBASE_SETUP.md 填入配置后，就能升级成真正跨设备同步。";
}

function getDatabaseStatusText() {
  if (isFirebaseRoomActive() || (hasFirebaseConfig() && state.room.connectionState === "connecting")) {
    return isFirebaseGuestMode()
      ? "已接入 Firestore，用于保存房间共享状态与成员在线信息；当前使用游客模式，不依赖 Firebase Authentication。"
      : "已接入 Firestore，用于保存房间共享状态与成员在线信息。";
  }
  if (hasFirebaseConfig() && state.room.connectionState === "error") {
    return "Firebase 已配置，但当前连接失败；请检查授权域名、匿名登录和 Firestore 规则。";
  }
  return "当前未接数据库，仍可本地玩；按项目里的 FIREBASE_SETUP.md 配置后即可升级成跨设备同步。";
}

function createPromptSession() {
  return {
    level: "全部",
    currentPlayer: "",
    currentItem: null,
    usedIds: new Set(),
    exhausted: false,
  };
}

function createComboSession() {
  return {
    level: "全部",
    currentPlayer: "",
    choice: "",
    currentItem: null,
    truthUsedIds: new Set(),
    dareUsedIds: new Set(),
    feedback: "先随机点一位朋友，再决定是真心话还是大冒险。",
  };
}

function createCardCenterState() {
  return {
    activeTab: "lucky",
    lucky: {
      deck: shuffleArray(createDeck()),
      currentCard: null,
      currentRule: null,
    },
    highLow: createHighLowGame(),
    roulette: {
      deck: shuffleArray([...ROULETTE_CARDS]),
      currentRule: null,
    },
    king: {
      deck: shuffleArray(createDeck()),
      currentCard: null,
      currentRule: null,
      showRules: false,
    },
    holdem: createHoldemGame(),
    bigSister: createBigSisterGame(),
  };
}

function createHighLowGame() {
  const deck = shuffleArray(createDeck());
  return {
    deck,
    currentCard: deck.pop(),
    previousCard: null,
    score: 0,
    streak: 0,
    rounds: 0,
    feedback: "先看当前这张牌，猜下一张会更大、更小还是相等。",
    tone: "neutral",
    lastGuess: "",
  };
}

function createHoldemGame(previous = {}) {
  return {
    stage: "idle",
    handNumber: previous.handNumber || 0,
    dealerIndex: previous.dealerIndex || 0,
    deck: [],
    communityCards: [],
    players: [],
    showdown: null,
    feedback: "点击“发新一局”，系统会按当前房间玩家发底牌。为了适合聚会使用，默认是公开主持模式。",
  };
}

function createBigSisterGame() {
  return {
    deck: shuffleArray(createDeck()),
    currentCard: null,
    currentRule: null,
    currentPlayer: "",
    turnIndex: 0,
    history: [],
    activeEffects: [],
    showRules: false,
  };
}

function primeCardGames() {
  if (!state.cards.lucky.currentCard) {
    drawLuckyCard({ render: false });
  }
  if (!state.cards.roulette.currentRule) {
    drawRouletteCard({ render: false });
  }
  if (!state.cards.king.currentCard) {
    drawKingCard({ render: false });
  }
  if (!state.cards.bigSister.currentCard) {
    drawBigSisterCard({ render: false });
  }
}

function buildBank(source, prefix) {
  return Object.entries(source).flatMap(([level, list]) =>
    list.map((text, index) => ({
      id: `${prefix}-${level}-${index + 1}`,
      level,
      text,
    })),
  );
}

function loadStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // 本地不可写时静默降级
  }
}

function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${suit.symbol}-${rank.label}`,
      suit: suit.symbol,
      suitName: suit.name,
      color: suit.color,
      rank: rank.label,
      value: rank.value,
    })),
  );
}

function shuffleArray(list) {
  const cloned = [...list];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
}

function pickRandom(list) {
  if (!list.length) {
    return null;
  }
  return list[Math.floor(Math.random() * list.length)];
}

function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`;
}

function normalizeRoomCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function getRoomStorageKey(code) {
  return `party-tavern-room-${code}`;
}

function getRoomCodeFromUrl() {
  try {
    const url = new URL(window.location.href);
    return normalizeRoomCode(url.searchParams.get("room") || "");
  } catch (error) {
    return "";
  }
}

function replaceRoomUrl(code = "") {
  try {
    const url = new URL(window.location.href);
    if (code) {
      url.searchParams.set("room", code);
    } else {
      url.searchParams.delete("room");
    }
    history.replaceState({}, "", url.toString());
  } catch (error) {
    // file:// 或老环境下忽略
  }
}

function loadExternalScript(src) {
  if (firebaseRuntime.scripts.has(src)) {
    return firebaseRuntime.scripts.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find((script) => script.src === src);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.externalSrc = src;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        reject(new Error(`无法加载外部脚本：${src}`));
      },
      { once: true },
    );

    if (!existing) {
      document.head.appendChild(script);
    }
  });

  firebaseRuntime.scripts.set(src, promise);
  return promise;
}

async function ensureFirebaseServices() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (firebaseRuntime.initPromise) {
    return firebaseRuntime.initPromise;
  }

  firebaseRuntime.initPromise = (async () => {
    const baseUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    await loadExternalScript(`${baseUrl}/firebase-app-compat.js`);
    await loadExternalScript(`${baseUrl}/firebase-auth-compat.js`);
    await loadExternalScript(`${baseUrl}/firebase-firestore-compat.js`);

    if (!window.firebase) {
      throw new Error("Firebase SDK 未正确加载。");
    }

    firebaseRuntime.firebase = window.firebase;
    const config = getFirebaseOptions().config;
    firebaseRuntime.app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(config);
    firebaseRuntime.auth = firebaseRuntime.app.auth();
    firebaseRuntime.db = firebaseRuntime.app.firestore();

    if (firebaseRuntime.auth.currentUser) {
      firebaseRuntime.user = firebaseRuntime.auth.currentUser;
      firebaseRuntime.authMode = "anonymous";
    } else {
      try {
        const credential = await firebaseRuntime.auth.signInAnonymously();
        firebaseRuntime.user = credential.user || firebaseRuntime.auth.currentUser;
        firebaseRuntime.authMode = "anonymous";
      } catch (error) {
        if (!shouldAllowFirebaseGuestMode(error)) {
          throw error;
        }
        firebaseRuntime.user = null;
        firebaseRuntime.authMode = "guest";
      }
    }

    return firebaseRuntime;
  })().catch((error) => {
    firebaseRuntime.initPromise = null;
    throw error;
  });

  return firebaseRuntime.initPromise;
}

function shouldAllowFirebaseGuestMode(error) {
  const code = error?.code || "";
  const message = String(error?.message || "");
  return (
    code.includes("auth/configuration-not-found") ||
    code.includes("auth/operation-not-allowed") ||
    code.includes("auth/unauthorized-domain") ||
    message.includes("CONFIGURATION_NOT_FOUND") ||
    message.includes("operation-not-allowed") ||
    message.includes("authorized domain")
  );
}

function formatFirebaseError(error) {
  const code = error?.code || "";
  const message = String(error?.message || "");

  if (window.location.protocol === "file:") {
    return "请通过 GitHub Pages 或本地静态服务器访问，file:// 环境无法完成 Firebase 匿名登录。";
  }
  if (code.includes("auth/operation-not-allowed")) {
    return "请在 Firebase 控制台开启匿名登录。";
  }
  if (code.includes("auth/configuration-not-found") || message.includes("CONFIGURATION_NOT_FOUND")) {
    return "请到 Firebase 控制台的 Authentication 里先点“开始使用”，再在登录方式中开启匿名登录。";
  }
  if (code.includes("auth/unauthorized-domain") || message.includes("authorized domain")) {
    return "请把当前站点域名加入 Firebase 授权域名。";
  }
  if (code.includes("permission-denied") || message.includes("Missing or insufficient permissions")) {
    return "请检查 Firestore 安全规则，匿名用户当前没有读写权限。";
  }
  if (code.includes("unavailable") || message.includes("offline")) {
    return "当前网络不可用，暂时无法连接 Firebase。";
  }
  return "请检查 firebase-config.js、匿名登录和 Firestore 配置是否完整。";
}

function clearFirebaseRoomBindings() {
  if (firebaseRuntime.roomUnsubscribe) {
    firebaseRuntime.roomUnsubscribe();
    firebaseRuntime.roomUnsubscribe = null;
  }
  if (firebaseRuntime.membersUnsubscribe) {
    firebaseRuntime.membersUnsubscribe();
    firebaseRuntime.membersUnsubscribe = null;
  }
  firebaseRuntime.roomRef = null;
  firebaseRuntime.membersRef = null;
  firebaseRuntime.roomCode = "";
  firebaseRuntime.connected = false;
}

function cleanupFirebaseRoomSession(options = {}) {
  const { deletePresence = false, roomCode = firebaseRuntime.roomCode || state.room.code } = options;
  const memberId = state.session.memberId;
  const db = firebaseRuntime.db;
  const collectionName = getFirebaseCollectionName();
  const presenceRef = deletePresence && db && roomCode ? db.collection(collectionName).doc(roomCode).collection("members").doc(memberId) : null;

  clearFirebaseRoomBindings();
  firebaseRuntime.joinToken = generateId("room-leave");

  if (presenceRef) {
    presenceRef.delete().catch(() => {});
  }
}

function handleFirebaseRoomSnapshot(snapshot) {
  if (!state.session.joined || !state.room.code || !snapshot.exists) {
    return;
  }

  const data = snapshot.data() || {};
  const shared = data.shared || null;
  const nextHash = shared ? JSON.stringify(shared) : "";

  state.room.lastUpdatedAt = data.updatedAt || Date.now();
  if (nextHash && nextHash !== state.room.lastSharedHash) {
    applySharedState(shared);
    state.room.lastSharedHash = nextHash;
  }

  renderApp();
}

function handleFirebaseMembersSnapshot(snapshot) {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  const nextMembers = pruneRoomMembers(snapshot.docs.map((doc) => doc.data() || {})).sort(
    (left, right) => left.joinedAt - right.joinedAt,
  );
  state.room.members = nextMembers;
  renderApp();
}

async function writeFirebasePresence() {
  if (!isFirebaseRoomActive() || !firebaseRuntime.membersRef) {
    return;
  }

  await firebaseRuntime.membersRef.doc(state.session.memberId).set(getCurrentMemberPresence(), { merge: true });
}

async function syncFirebaseSharedState(options = {}) {
  if (!isFirebaseRoomActive() || !firebaseRuntime.roomRef) {
    return;
  }

  const { force = false, preserveShared = false } = options;

  if (preserveShared) {
    await writeFirebasePresence();
    return;
  }

  const shared = serializeSharedState();
  const sharedHash = JSON.stringify(shared);
  if (!force && sharedHash === state.room.lastSharedHash) {
    return;
  }

  const updatedAt = Date.now();
  await firebaseRuntime.roomRef.set(
    {
      code: state.room.code,
      ownerId: state.session.memberId,
      syncMode: "Firebase 实时房间",
      updatedAt,
      shared,
    },
    { merge: true },
  );

  state.room.lastUpdatedAt = updatedAt;
  state.room.lastSharedHash = sharedHash;
}

async function connectFirebaseRoom(options = {}) {
  const { restoreShared = true } = options;
  if (!hasFirebaseConfig() || !state.session.joined || !state.room.code) {
    return false;
  }

  const joinToken = generateId("room-join");
  const roomCode = state.room.code;
  firebaseRuntime.joinToken = joinToken;
  state.room.connectionState = "connecting";
  state.room.syncMode = "Firebase 实时房间连接中";
  state.room.remoteError = "";
  renderApp();

  try {
    await ensureFirebaseServices();
    if (firebaseRuntime.joinToken !== joinToken || !state.session.joined || state.room.code !== roomCode) {
      return false;
    }

    const roomRef = firebaseRuntime.db.collection(getFirebaseCollectionName()).doc(roomCode);
    const membersRef = roomRef.collection("members");
    const roomSnapshot = await roomRef.get();

    if (firebaseRuntime.joinToken !== joinToken || !state.session.joined || state.room.code !== roomCode) {
      return false;
    }

    clearFirebaseRoomBindings();
    firebaseRuntime.roomRef = roomRef;
    firebaseRuntime.membersRef = membersRef;
    firebaseRuntime.roomCode = roomCode;
    firebaseRuntime.connected = true;

    if (restoreShared && roomSnapshot.exists && roomSnapshot.data()?.shared) {
      const remoteShared = roomSnapshot.data().shared;
      const remoteHash = JSON.stringify(remoteShared);
      if (remoteHash && remoteHash !== state.room.lastSharedHash) {
        applySharedState(remoteShared);
        state.room.lastSharedHash = remoteHash;
      }
      state.room.lastUpdatedAt = roomSnapshot.data()?.updatedAt || Date.now();
    } else if (!roomSnapshot.exists) {
      const initialShared = serializeSharedState();
      const updatedAt = Date.now();
      await roomRef.set(
        {
          code: roomCode,
          ownerId: state.session.memberId,
          syncMode: "Firebase 实时房间",
          updatedAt,
          shared: initialShared,
        },
        { merge: true },
      );
      state.room.lastUpdatedAt = updatedAt;
      state.room.lastSharedHash = JSON.stringify(initialShared);
    }

    firebaseRuntime.roomUnsubscribe = roomRef.onSnapshot(
      (snapshot) => handleFirebaseRoomSnapshot(snapshot),
      (error) => {
        state.room.connectionState = "error";
        state.room.syncMode = "浏览器本地房间";
        state.room.remoteError = formatFirebaseError(error);
        cleanupFirebaseRoomSession();
        renderApp();
      },
    );

    firebaseRuntime.membersUnsubscribe = membersRef.onSnapshot(
      (snapshot) => handleFirebaseMembersSnapshot(snapshot),
      (error) => {
        state.room.connectionState = "error";
        state.room.syncMode = "浏览器本地房间";
        state.room.remoteError = formatFirebaseError(error);
        cleanupFirebaseRoomSession();
        renderApp();
      },
    );

    state.room.connectionState = "connected";
    state.room.syncMode = "Firebase 实时房间";
    await writeFirebasePresence();
    state.room.members = upsertRoomMember(state.room.members, getCurrentMemberPresence());
    state.roomNotice = `已进入房间 ${roomCode}，当前为 Firebase 实时同步模式。${isFirebaseGuestMode() ? "当前使用游客模式，不依赖单独登录。" : ""}`;
    renderApp();
    return true;
  } catch (error) {
    state.room.connectionState = "error";
    state.room.syncMode = "浏览器本地房间";
    state.room.remoteError = formatFirebaseError(error);
    state.roomNotice = `已进入房间 ${roomCode}，但云同步未接通，已自动切回本地房间。${state.room.remoteError}`;
    cleanupFirebaseRoomSession();
    renderApp();
    return false;
  }
}

function getCurrentRoomSnapshot() {
  if (!state.room.code) {
    return null;
  }
  return loadStorage(getRoomStorageKey(state.room.code), null);
}

function createDefaultRoomSnapshot(code) {
  return {
    code,
    syncMode: state.room.syncMode,
    ownerId: state.session.memberId,
    updatedAt: 0,
    members: [],
    shared: serializeSharedState(),
  };
}

function pruneRoomMembers(members) {
  const threshold = Date.now() - ROOM_MEMBER_TTL;
  return (members || []).filter((member) => member.lastSeenAt >= threshold);
}

function getCurrentMemberPresence() {
  return {
    id: state.session.memberId,
    nickname: state.session.nickname,
    joinedAt: state.session.joinedAt || Date.now(),
    lastSeenAt: Date.now(),
  };
}

function upsertRoomMember(members, member) {
  const nextMembers = pruneRoomMembers(members).filter((item) => item.id !== member.id);
  nextMembers.push(member);
  nextMembers.sort((left, right) => left.joinedAt - right.joinedAt);
  return nextMembers;
}

function serializePromptSession(session) {
  return {
    level: session.level,
    currentPlayer: session.currentPlayer,
    currentItem: session.currentItem,
    usedIds: [...session.usedIds],
    exhausted: session.exhausted,
  };
}

function deserializePromptSession(raw) {
  return {
    level: raw?.level || "全部",
    currentPlayer: raw?.currentPlayer || "",
    currentItem: raw?.currentItem || null,
    usedIds: new Set(raw?.usedIds || []),
    exhausted: Boolean(raw?.exhausted),
  };
}

function serializeComboSession(session) {
  return {
    level: session.level,
    currentPlayer: session.currentPlayer,
    choice: session.choice,
    currentItem: session.currentItem,
    truthUsedIds: [...session.truthUsedIds],
    dareUsedIds: [...session.dareUsedIds],
    feedback: session.feedback,
  };
}

function deserializeComboSession(raw) {
  return {
    level: raw?.level || "全部",
    currentPlayer: raw?.currentPlayer || "",
    choice: raw?.choice || "",
    currentItem: raw?.currentItem || null,
    truthUsedIds: new Set(raw?.truthUsedIds || []),
    dareUsedIds: new Set(raw?.dareUsedIds || []),
    feedback: raw?.feedback || "先随机点一位朋友，再决定是真心话还是大冒险。",
  };
}

function serializeCardsState(cards) {
  return {
    activeTab: cards.activeTab,
    lucky: cards.lucky,
    highLow: cards.highLow,
    roulette: cards.roulette,
    king: cards.king,
    holdem: cards.holdem,
    bigSister: cards.bigSister,
  };
}

function deserializeCardsState(raw) {
  const defaults = createCardCenterState();
  return {
    activeTab: raw?.activeTab || defaults.activeTab,
    lucky: raw?.lucky || defaults.lucky,
    highLow: raw?.highLow || defaults.highLow,
    roulette: raw?.roulette || defaults.roulette,
    king: raw?.king || defaults.king,
    holdem: raw?.holdem || defaults.holdem,
    bigSister: raw?.bigSister || defaults.bigSister,
  };
}

function serializeSharedState() {
  return {
    view: state.view,
    players: [...state.players],
    showBonus: state.showBonus,
    bonusResult: state.bonusResult,
    tipIndex: state.tipIndex,
    truth: serializePromptSession(state.truth),
    dare: serializePromptSession(state.dare),
    combo: serializeComboSession(state.combo),
    cards: serializeCardsState(state.cards),
  };
}

function applySharedState(shared) {
  if (!shared) {
    return;
  }

  state.view = shared.view || "home";
  state.players = [...(shared.players || [])];
  state.showBonus = typeof shared.showBonus === "boolean" ? shared.showBonus : state.showBonus;
  state.bonusResult = shared.bonusResult || state.bonusResult || getRandomBonusResult();
  state.tipIndex = Number.isInteger(shared.tipIndex) ? shared.tipIndex : state.tipIndex;
  state.truth = deserializePromptSession(shared.truth);
  state.dare = deserializePromptSession(shared.dare);
  state.combo = deserializeComboSession(shared.combo);
  state.cards = deserializeCardsState(shared.cards);
  primeCardGames();
  normalizeGamePlayers({ resetHoldem: false });
}

function attachToRoom(nickname, roomCode, options = {}) {
  const { silent = false, restoreShared = true } = options;
  const normalizedNickname = nickname.trim().slice(0, 14);
  const normalizedCode = normalizeRoomCode(roomCode || generateRoomCode());

  if (!normalizedNickname) {
    state.roomNotice = "先输入一个昵称，再进入房间。";
    renderApp();
    return;
  }

  if (!normalizedCode) {
    state.roomNotice = "房间号需要是 1 到 6 位字母或数字。";
    renderApp();
    return;
  }

  state.session.nickname = normalizedNickname;
  state.session.roomCode = normalizedCode;
  state.session.joinedAt = Date.now();
  state.session.joined = true;
  saveStorage(STORAGE_KEYS.session, state.session);

  state.room.code = normalizedCode;
  state.room.members = [];
  state.room.lastSharedHash = "";
  state.room.lastUpdatedAt = 0;
  state.room.connectionState = hasFirebaseConfig() ? "connecting" : "local";
  state.room.syncMode = hasFirebaseConfig() ? "Firebase 实时房间连接中" : "浏览器本地房间";
  state.room.remoteError = "";

  const currentSnapshot = loadStorage(getRoomStorageKey(normalizedCode), null);
  const snapshot = currentSnapshot || createDefaultRoomSnapshot(normalizedCode);

  if (restoreShared && snapshot.shared) {
    applySharedState(snapshot.shared);
  }

  const nextSnapshot = {
    ...snapshot,
    code: normalizedCode,
    syncMode: state.room.syncMode,
    ownerId: snapshot.ownerId || state.session.memberId,
    members: upsertRoomMember(snapshot.members, getCurrentMemberPresence()),
    shared: restoreShared && snapshot.shared ? snapshot.shared : serializeSharedState(),
    updatedAt: Date.now(),
  };

  saveStorage(getRoomStorageKey(normalizedCode), nextSnapshot);

  state.room.members = nextSnapshot.members;
  state.room.lastUpdatedAt = nextSnapshot.updatedAt;
  state.room.lastSharedHash = JSON.stringify(nextSnapshot.shared);
  state.roomDraft.nickname = normalizedNickname;
  state.roomDraft.roomCode = normalizedCode;
  state.roomNotice = silent ? "" : `已进入房间 ${normalizedCode}。${hasFirebaseConfig() ? "正在连接实时同步…" : "当前为浏览器本地房间模式。"}`;

  replaceRoomUrl(normalizedCode);
  startRoomHeartbeat();

  if (hasFirebaseConfig()) {
    connectFirebaseRoom({ restoreShared });
  }
}

function leaveRoom() {
  cleanupFirebaseRoomSession({ deletePresence: true, roomCode: state.room.code });

  if (state.session.joined && state.room.code) {
    const snapshot = getCurrentRoomSnapshot() || createDefaultRoomSnapshot(state.room.code);
    const nextMembers = pruneRoomMembers(snapshot.members).filter((member) => member.id !== state.session.memberId);
    const nextSnapshot = {
      ...snapshot,
      members: nextMembers,
      updatedAt: Date.now(),
    };
    saveStorage(getRoomStorageKey(state.room.code), nextSnapshot);
  }

  stopRoomHeartbeat();
  state.session.joined = false;
  state.session.roomCode = "";
  saveStorage(STORAGE_KEYS.session, state.session);
  state.room = createRoomRuntimeState();
  state.roomDraft.roomCode = "";
  state.roomNotice = "已退出房间。";
  replaceRoomUrl("");
  renderApp();
}

function startRoomHeartbeat() {
  stopRoomHeartbeat();
  roomHeartbeatTimer = window.setInterval(() => {
    syncRoomSnapshot({ force: true, preserveShared: true });
  }, ROOM_HEARTBEAT_MS);
}

function stopRoomHeartbeat() {
  if (roomHeartbeatTimer) {
    clearInterval(roomHeartbeatTimer);
    roomHeartbeatTimer = null;
  }
}

function queueRoomSync(options = {}) {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  if (roomSyncTimer) {
    clearTimeout(roomSyncTimer);
  }

  roomSyncTimer = window.setTimeout(() => {
    syncRoomSnapshot(options);
  }, 0);
}

function syncLocalRoomSnapshot(options = {}) {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  const { force = false, preserveShared = false } = options;
  const existing = getCurrentRoomSnapshot() || createDefaultRoomSnapshot(state.room.code);
  const shared = preserveShared && existing.shared ? existing.shared : serializeSharedState();
  const sharedHash = JSON.stringify(shared);
  const nextMembers = upsertRoomMember(existing.members, getCurrentMemberPresence());
  const membersHash = JSON.stringify(nextMembers);
  const currentMembersHash = JSON.stringify(state.room.members);

  if (!force && sharedHash === state.room.lastSharedHash && membersHash === currentMembersHash) {
    return;
  }

  const nextSnapshot = {
    ...existing,
    code: state.room.code,
    syncMode: state.room.syncMode,
    ownerId: existing.ownerId || state.session.memberId,
    members: nextMembers,
    shared,
    updatedAt: Date.now(),
  };

  saveStorage(getRoomStorageKey(state.room.code), nextSnapshot);
  state.room.members = nextMembers;
  state.room.lastUpdatedAt = nextSnapshot.updatedAt;
  state.room.lastSharedHash = sharedHash;
}

function syncRoomSnapshot(options = {}) {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  if (isFirebaseRoomActive()) {
    syncFirebaseSharedState(options).catch(() => {});
    syncLocalRoomSnapshot(options);
    return;
  }

  syncLocalRoomSnapshot(options);
}

function handleStorageSync(event) {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  if (isFirebaseRoomActive()) {
    return;
  }

  if (event.key !== getRoomStorageKey(state.room.code) || !event.newValue) {
    return;
  }

  try {
    const snapshot = JSON.parse(event.newValue);
    if (!snapshot || snapshot.updatedAt <= state.room.lastUpdatedAt) {
      return;
    }

    const nextMembers = pruneRoomMembers(snapshot.members);
    const nextHash = JSON.stringify(snapshot.shared || {});
    const shouldApplyShared = nextHash && nextHash !== state.room.lastSharedHash;

    state.room.members = nextMembers;
    state.room.lastUpdatedAt = snapshot.updatedAt;

    if (shouldApplyShared) {
      applySharedState(snapshot.shared);
      state.room.lastSharedHash = nextHash;
    }

    renderApp();
  } catch (error) {
    // 非法房间数据忽略
  }
}

function handleBeforeUnload() {
  if (!state.session.joined || !state.room.code) {
    return;
  }

  cleanupFirebaseRoomSession({ deletePresence: true, roomCode: state.room.code });

  const snapshot = getCurrentRoomSnapshot();
  if (!snapshot) {
    return;
  }

  const nextSnapshot = {
    ...snapshot,
    members: pruneRoomMembers(snapshot.members).filter((member) => member.id !== state.session.memberId),
    updatedAt: Date.now(),
  };

  try {
    localStorage.setItem(getRoomStorageKey(state.room.code), JSON.stringify(nextSnapshot));
  } catch (error) {
    // 忽略
  }
}

function getRoomMemberNames() {
  return state.room.members.map((member) => member.nickname).filter(Boolean);
}

function getEffectivePlayers(minCount = DEFAULT_PLAYER_COUNT) {
  const sharedNames = Array.from(new Set([...getRoomMemberNames(), ...state.players]));
  if (sharedNames.length) {
    return sharedNames;
  }
  return Array.from({ length: minCount }, (_, index) => `玩家${index + 1}`);
}

function getTablePlayers(minCount = 2, maxCount = HOLD_EM_MAX_PLAYERS) {
  return getEffectivePlayers(Math.max(minCount, DEFAULT_PLAYER_COUNT)).slice(0, maxCount);
}

function getRandomPlayer(excludeName = "") {
  const players = getEffectivePlayers();
  if (players.length === 1) {
    return players[0];
  }
  const pool = players.filter((name) => name !== excludeName);
  return pickRandom(pool.length ? pool : players);
}

function getPromptBank(gameKey) {
  if (gameKey === "truth") {
    return TRUTH_BANK;
  }
  if (gameKey === "dare") {
    return DARE_BANK;
  }
  return [];
}

function getPromptSession(gameKey) {
  if (gameKey === "truth") {
    return state.truth;
  }
  return state.dare;
}

function getAvailableItems(bank, level, usedIds) {
  return bank.filter((item) => {
    const levelMatched = level === "全部" || item.level === level;
    return levelMatched && !usedIds.has(item.id);
  });
}

function getBankSummary(bank, level, usedIds) {
  const total = bank.filter((item) => level === "全部" || item.level === level).length;
  const used = bank.filter((item) => usedIds.has(item.id) && (level === "全部" || item.level === level)).length;
  return {
    total,
    used,
    remaining: Math.max(total - used, 0),
  };
}

function drawPrompt(gameKey, options = {}) {
  const { render = true } = options;
  const session = getPromptSession(gameKey);
  const bank = getPromptBank(gameKey);

  if (!session.currentPlayer) {
    session.currentPlayer = getRandomPlayer();
  }

  const availableItems = getAvailableItems(bank, session.level, session.usedIds);
  if (!availableItems.length) {
    session.currentItem = null;
    session.exhausted = true;
    if (render) {
      renderApp();
    }
    return;
  }

  const nextItem = pickRandom(availableItems);
  session.currentItem = nextItem;
  session.usedIds.add(nextItem.id);
  session.exhausted = false;
  playUiTone("soft");
  if (render) {
    renderApp();
  }
}

function ensurePromptModuleReady(gameKey) {
  const session = getPromptSession(gameKey);
  if (!session.currentPlayer) {
    session.currentPlayer = getRandomPlayer();
  }
  if (!session.currentItem && !session.exhausted) {
    drawPrompt(gameKey, { render: false });
  }
}

function changePromptPlayer(gameKey) {
  const session = getPromptSession(gameKey);
  session.currentPlayer = getRandomPlayer(session.currentPlayer);
  playUiTone("soft");
  renderApp();
}

function setPromptLevel(gameKey, level) {
  const session = gameKey === "combo" ? state.combo : getPromptSession(gameKey);
  session.level = level;

  if (gameKey === "combo") {
    if (session.choice) {
      drawComboItem(session.choice, { render: true });
    } else {
      renderApp();
    }
    return;
  }

  const bank = getPromptBank(gameKey);
  const availableItems = getAvailableItems(bank, session.level, session.usedIds);
  if (!availableItems.length) {
    session.currentItem = null;
    session.exhausted = true;
  } else if (!session.currentItem || (level !== "全部" && session.currentItem.level !== level)) {
    drawPrompt(gameKey, { render: true });
    return;
  } else {
    session.exhausted = false;
  }

  renderApp();
}

function restartPromptModule(gameKey) {
  const session = getPromptSession(gameKey);
  session.usedIds.clear();
  session.currentPlayer = getRandomPlayer();
  session.currentItem = null;
  session.exhausted = false;
  drawPrompt(gameKey);
}

function ensureComboReady() {
  if (!state.combo.currentPlayer) {
    state.combo.currentPlayer = getRandomPlayer();
  }
}

function drawComboItem(choice, options = {}) {
  const { render = true } = options;
  const bank = choice === "truth" ? TRUTH_BANK : DARE_BANK;
  const usedIds = choice === "truth" ? state.combo.truthUsedIds : state.combo.dareUsedIds;
  const availableItems = getAvailableItems(bank, state.combo.level, usedIds);

  if (!availableItems.length) {
    state.combo.choice = choice;
    state.combo.currentItem = null;
    state.combo.feedback = `${choice === "truth" ? "真心话" : "大冒险"}当前筛选强度已经抽完了，点“重新开始”就能洗回本模块题库。`;
    if (render) {
      renderApp();
    }
    return;
  }

  const nextItem = pickRandom(availableItems);
  usedIds.add(nextItem.id);
  state.combo.choice = choice;
  state.combo.currentItem = nextItem;
  state.combo.feedback = choice === "truth" ? "选好了真心话，看看这一题会不会让全场起哄。" : "大冒险已就位，轮到你现场发挥了。";
  playUiTone(choice === "truth" ? "soft" : "success");
  if (render) {
    renderApp();
  }
}

function rerollComboPlayer() {
  state.combo.currentPlayer = getRandomPlayer(state.combo.currentPlayer);
  state.combo.choice = "";
  state.combo.currentItem = null;
  state.combo.feedback = "换了一位新玩家，重新选择真心话或大冒险吧。";
  playUiTone("soft");
  renderApp();
}

function resetComboChoice() {
  state.combo.choice = "";
  state.combo.currentItem = null;
  state.combo.feedback = "可以重新决定是真心话还是大冒险。";
  renderApp();
}

function restartComboModule() {
  state.combo.truthUsedIds.clear();
  state.combo.dareUsedIds.clear();
  state.combo.currentPlayer = getRandomPlayer();
  state.combo.choice = "";
  state.combo.currentItem = null;
  state.combo.feedback = "本模块已经重新开始，题库与玩家都洗新了。";
  renderApp();
}

function randomizeComboChoice() {
  const choice = Math.random() > 0.5 ? "truth" : "dare";
  drawComboItem(choice);
}

function drawLuckyCard(options = {}) {
  const { render = true } = options;
  if (!state.cards.lucky.deck.length) {
    state.cards.lucky.deck = shuffleArray(createDeck());
  }
  const card = state.cards.lucky.deck.pop();
  state.cards.lucky.currentCard = card;
  state.cards.lucky.currentRule = {
    ...LUCKY_RULES[card.rank],
    suitHint: LUCKY_SUIT_HINTS[card.suit],
  };
  playUiTone("success");
  if (render) {
    renderApp();
  }
}

function resetLuckyDeck() {
  state.cards.lucky.deck = shuffleArray(createDeck());
  drawLuckyCard();
}

function makeHighLowGuess(guess) {
  const game = state.cards.highLow;
  if (!game.deck.length) {
    game.deck = shuffleArray(createDeck());
  }

  const previousCard = game.currentCard;
  const nextCard = game.deck.pop();
  const relation =
    nextCard.value === previousCard.value ? "equal" : nextCard.value > previousCard.value ? "higher" : "lower";
  const isCorrect = relation === guess;

  game.previousCard = previousCard;
  game.currentCard = nextCard;
  game.rounds += 1;
  game.lastGuess = guess;

  if (isCorrect) {
    if (guess === "equal") {
      game.score += 2;
      game.feedback = "居然真的相等，难度最高的一种被你猜中了。全场为你鼓掌一次。";
    } else {
      game.score += 1;
      game.feedback = `猜对了，下一张确实是${relation === "higher" ? "更大" : "更小"}。你可以指定一位朋友说一句祝酒词。`;
    }
    game.streak += 1;
    game.tone = "win";
    playUiTone("success");
  } else {
    game.score = Math.max(0, game.score - 1);
    game.streak = 0;
    game.tone = "lose";
    game.feedback =
      relation === "equal"
        ? "结果竟然是相等，这种最难猜。小惩罚：喝一小口或分享一个冷知识。"
        : `没猜中，下一张其实是${relation === "higher" ? "更大" : "更小"}。小惩罚：你喝一小口，或者做个庆祝动作也行。`;
    playUiTone("alert");
  }

  renderApp();
}

function resetHighLowGame() {
  state.cards.highLow = createHighLowGame();
  playUiTone("soft");
  renderApp();
}

function drawRouletteCard(options = {}) {
  const { render = true } = options;
  if (!state.cards.roulette.deck.length) {
    state.cards.roulette.deck = shuffleArray([...ROULETTE_CARDS]);
  }
  state.cards.roulette.currentRule = state.cards.roulette.deck.pop();
  playUiTone("soft");
  if (render) {
    renderApp();
  }
}

function resetRouletteDeck() {
  state.cards.roulette.deck = shuffleArray([...ROULETTE_CARDS]);
  drawRouletteCard();
}

function drawKingCard(options = {}) {
  const { render = true } = options;
  if (!state.cards.king.deck.length) {
    state.cards.king.deck = shuffleArray(createDeck());
  }
  const card = state.cards.king.deck.pop();
  state.cards.king.currentCard = card;
  state.cards.king.currentRule = KING_RULES[card.rank];
  playUiTone("soft");
  if (render) {
    renderApp();
  }
}

function resetKingDeck() {
  state.cards.king.deck = shuffleArray(createDeck());
  drawKingCard();
}

function startHoldemHand() {
  const playerNames = getTablePlayers(2, HOLD_EM_MAX_PLAYERS);
  const deck = shuffleArray(createDeck());
  const dealerIndex = state.cards.holdem.players.length
    ? (state.cards.holdem.dealerIndex + 1) % playerNames.length
    : 0;

  state.cards.holdem = {
    ...createHoldemGame({
      handNumber: state.cards.holdem.handNumber + 1,
      dealerIndex,
    }),
    handNumber: state.cards.holdem.handNumber + 1,
    dealerIndex,
    stage: "preflop",
    deck,
    communityCards: [],
    players: playerNames.map((name) => ({
      id: generateId("holdem-player"),
      name,
      holeCards: [deck.pop(), deck.pop()],
      revealed: false,
      bestHand: null,
    })),
    feedback: `第 ${state.cards.holdem.handNumber + 1} 局已发底牌。庄位是 ${playerNames[dealerIndex]}，点击“下一阶段”继续翻公共牌。`,
  };

  playUiTone("success");
  renderApp();
}

function advanceHoldemStage() {
  const game = state.cards.holdem;

  if (game.stage === "idle" || game.stage === "showdown") {
    startHoldemHand();
    return;
  }

  if (game.stage === "preflop") {
    game.communityCards.push(game.deck.pop(), game.deck.pop(), game.deck.pop());
    game.stage = "flop";
    game.feedback = "翻牌圈已发出 3 张公共牌。现在可以看看谁的牌势开始成型。";
  } else if (game.stage === "flop") {
    game.communityCards.push(game.deck.pop());
    game.stage = "turn";
    game.feedback = "转牌已翻开。桌面局势更清晰了，继续观察谁最像暗藏大牌。";
  } else if (game.stage === "turn") {
    game.communityCards.push(game.deck.pop());
    game.stage = "river";
    game.feedback = "河牌已落地。想直接看结果的话，可以摊牌了。";
  } else if (game.stage === "river") {
    runHoldemShowdown();
    return;
  }

  playUiTone("soft");
  renderApp();
}

function toggleHoldemReveal(index) {
  const player = state.cards.holdem.players[index];
  if (!player) {
    return;
  }
  player.revealed = !player.revealed;
  renderApp();
}

function revealAllHoldemCards() {
  state.cards.holdem.players.forEach((player) => {
    player.revealed = true;
  });
  renderApp();
}

function resetHoldemGame() {
  state.cards.holdem = createHoldemGame({
    handNumber: state.cards.holdem.handNumber,
    dealerIndex: state.cards.holdem.dealerIndex,
  });
  renderApp();
}

function runHoldemShowdown() {
  const game = state.cards.holdem;
  if (game.communityCards.length < 5) {
    return;
  }

  let bestResult = null;
  const results = game.players.map((player) => {
    const evaluated = evaluateBestHoldemHand([...player.holeCards, ...game.communityCards]);
    player.revealed = true;
    player.bestHand = evaluated;
    if (!bestResult || compareEvaluatedHands(evaluated, bestResult) > 0) {
      bestResult = evaluated;
    }
    return {
      name: player.name,
      result: evaluated,
    };
  });

  const winners = results.filter((entry) => compareEvaluatedHands(entry.result, bestResult) === 0);
  game.stage = "showdown";
  game.showdown = {
    winners,
    summaries: results,
  };
  game.feedback =
    winners.length > 1
      ? `平分胜利：${winners.map((winner) => winner.name).join("、")} 同时拿下 ${bestResult.name}。`
      : `${winners[0].name} 拿下这一局，牌型是 ${bestResult.name}。`;
  playUiTone("success");
  renderApp();
}

function drawBigSisterCard(options = {}) {
  const { render = true } = options;
  const game = state.cards.bigSister;
  if (!game.deck.length) {
    game.deck = shuffleArray(createDeck());
  }

  const playerNames = getEffectivePlayers();
  const currentPlayer = playerNames[game.turnIndex % playerNames.length];
  const card = game.deck.pop();
  const baseRule = BIG_SISTER_RULES[card.rank];

  game.currentCard = card;
  game.currentPlayer = currentPlayer;
  game.currentRule = {
    title: baseRule.title,
    detail: baseRule.detail,
    persistent: baseRule.persistent,
    effectText: baseRule.effectText,
    suitHint: BIG_SISTER_SUIT_HINTS[card.suit],
  };
  game.turnIndex += 1;
  game.history = [
    {
      id: generateId("big-sister-history"),
      player: currentPlayer,
      card,
      title: baseRule.title,
    },
    ...game.history,
  ].slice(0, 5);

  if (baseRule.persistent) {
    if (card.rank === "K") {
      game.activeEffects = game.activeEffects.filter((effect) => effect.rank !== "K");
    }
    game.activeEffects = [
      {
        id: generateId("big-sister-effect"),
        rank: card.rank,
        owner: currentPlayer,
        text: `${currentPlayer}：${baseRule.effectText || baseRule.title}`,
      },
      ...game.activeEffects,
    ].slice(0, 5);
  }

  playUiTone("soft");
  if (render) {
    renderApp();
  }
}

function resetBigSisterDeck() {
  state.cards.bigSister = {
    ...createBigSisterGame(),
    showRules: state.cards.bigSister.showRules,
  };
  drawBigSisterCard();
}

function clearBigSisterEffects() {
  state.cards.bigSister.activeEffects = [];
  renderApp();
}

function getRandomBonusResult() {
  const isReward = Math.random() > 0.5;
  return {
    kind: isReward ? "奖励" : "惩罚",
    text: pickRandom(isReward ? REWARD_BANK : PENALTY_BANK),
  };
}

function nextTip() {
  let nextIndex = Math.floor(Math.random() * ATMOSPHERE_TIPS.length);
  if (nextIndex === state.tipIndex) {
    nextIndex = (nextIndex + 1) % ATMOSPHERE_TIPS.length;
  }
  state.tipIndex = nextIndex;
  renderApp();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  saveStorage(STORAGE_KEYS.soundEnabled, state.soundEnabled);
  if (state.soundEnabled) {
    playUiTone("soft");
  }
  renderApp();
}

function copyRoomLink() {
  const url = buildRoomLink();

  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      state.roomNotice = "房间链接已复制。";
    } catch (error) {
      state.roomNotice = `请手动复制房间链接：${url}`;
    }
    document.body.removeChild(textarea);
    renderApp();
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        state.roomNotice = "房间链接已复制。";
        renderApp();
      })
      .catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

function buildRoomLink() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("room", state.room.code);
    return url.toString();
  } catch (error) {
    return `${window.location.origin}${window.location.pathname}?room=${state.room.code}`;
  }
}

function playUiTone(type = "soft") {
  if (!state.soundEnabled) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  const presets = {
    soft: [523.25, 659.25, 0.05],
    success: [659.25, 783.99, 0.07],
    alert: [392.0, 329.63, 0.08],
  };
  const [firstFrequency, secondFrequency, duration] = presets[type] || presets.soft;
  const now = audioContext.currentTime;

  [firstFrequency, secondFrequency].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0.0001, now + index * duration);
    gainNode.gain.linearRampToValueAtTime(0.03, now + index * duration + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * duration + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now + index * duration);
    oscillator.stop(now + index * duration + duration);
  });
}

function handleClick(event) {
  const routeTrigger = event.target.closest("[data-route]");
  if (routeTrigger) {
    event.preventDefault();
    setView(routeTrigger.dataset.route);
    return;
  }

  const actionTrigger = event.target.closest("[data-action]");
  if (!actionTrigger) {
    return;
  }

  event.preventDefault();
  const { action, game, level, guess, tab, index, choice } = actionTrigger.dataset;

  switch (action) {
    case "go-home":
      setView("home");
      break;
    case "toggle-sound":
      toggleSound();
      break;
    case "create-room":
      attachToRoom(state.roomDraft.nickname, generateRoomCode(), { restoreShared: false });
      renderApp();
      break;
    case "join-room":
      attachToRoom(state.roomDraft.nickname, state.roomDraft.roomCode, { restoreShared: true });
      renderApp();
      break;
    case "leave-room":
      leaveRoom();
      break;
    case "copy-room-link":
      copyRoomLink();
      break;
    case "fill-room-code":
      state.roomDraft.roomCode = generateRoomCode();
      renderApp();
      break;
    case "random-player-preview":
      state.spotlightPlayer = getRandomPlayer(state.spotlightPlayer);
      playUiTone("soft");
      renderApp();
      break;
    case "clear-players":
      state.players = [];
      state.spotlightPlayer = "";
      state.playerDraft = "";
      saveStorage(STORAGE_KEYS.players, state.players);
      normalizeGamePlayers();
      renderApp();
      break;
    case "remove-player":
      removePlayer(Number(index));
      break;
    case "toggle-bonus":
      state.showBonus = !state.showBonus;
      saveStorage(STORAGE_KEYS.showBonus, state.showBonus);
      renderApp();
      break;
    case "draw-bonus":
      state.bonusResult = getRandomBonusResult();
      playUiTone("soft");
      renderApp();
      break;
    case "next-tip":
      nextTip();
      break;
    case "set-level":
      setPromptLevel(game, level);
      break;
    case "change-prompt-player":
      changePromptPlayer(game);
      break;
    case "next-prompt":
      drawPrompt(game);
      break;
    case "restart-prompt":
      restartPromptModule(game);
      break;
    case "combo-choice":
      drawComboItem(choice);
      break;
    case "combo-random":
      randomizeComboChoice();
      break;
    case "combo-next":
      if (state.combo.choice) {
        drawComboItem(state.combo.choice);
      }
      break;
    case "combo-reset-choice":
      resetComboChoice();
      break;
    case "combo-reroll-player":
      rerollComboPlayer();
      break;
    case "restart-combo":
      restartComboModule();
      break;
    case "set-card-tab":
      state.cards.activeTab = tab;
      renderApp();
      break;
    case "draw-lucky-card":
      drawLuckyCard();
      break;
    case "reset-lucky-deck":
      resetLuckyDeck();
      break;
    case "highlow-guess":
      makeHighLowGuess(guess);
      break;
    case "reset-highlow":
      resetHighLowGame();
      break;
    case "draw-roulette-card":
      drawRouletteCard();
      break;
    case "reset-roulette":
      resetRouletteDeck();
      break;
    case "draw-king-card":
      drawKingCard();
      break;
    case "toggle-king-rules":
      state.cards.king.showRules = !state.cards.king.showRules;
      renderApp();
      break;
    case "reset-king-deck":
      resetKingDeck();
      break;
    case "holdem-start":
      startHoldemHand();
      break;
    case "holdem-next":
      advanceHoldemStage();
      break;
    case "holdem-toggle-reveal":
      toggleHoldemReveal(Number(index));
      break;
    case "holdem-reveal-all":
      revealAllHoldemCards();
      break;
    case "holdem-reset":
      resetHoldemGame();
      break;
    case "draw-big-sister":
      drawBigSisterCard();
      break;
    case "reset-big-sister":
      resetBigSisterDeck();
      break;
    case "clear-big-sister-effects":
      clearBigSisterEffects();
      break;
    case "toggle-big-sister-rules":
      state.cards.bigSister.showRules = !state.cards.bigSister.showRules;
      renderApp();
      break;
    default:
      break;
  }
}

function handleSubmit(event) {
  if (event.target.id === "player-form") {
    event.preventDefault();
    addPlayersFromDraft();
    return;
  }

  if (event.target.id === "room-form") {
    event.preventDefault();
    const submitAction = event.submitter?.dataset.roomSubmit || "join";
    if (submitAction === "create") {
      attachToRoom(state.roomDraft.nickname, generateRoomCode(), { restoreShared: false });
    } else {
      attachToRoom(state.roomDraft.nickname, state.roomDraft.roomCode, { restoreShared: true });
    }
    renderApp();
  }
}

function handleInput(event) {
  if (event.target.id === "player-names-input") {
    state.playerDraft = event.target.value;
    return;
  }

  if (event.target.id === "room-nickname-input") {
    state.roomDraft.nickname = event.target.value.slice(0, 14);
    return;
  }

  if (event.target.id === "room-code-input") {
    state.roomDraft.roomCode = normalizeRoomCode(event.target.value);
    return;
  }
}

function addPlayersFromDraft() {
  const nextNames = parsePlayerNames(state.playerDraft);
  if (!nextNames.length) {
    return;
  }

  const existingNames = new Set(state.players);
  nextNames.forEach((name) => {
    if (!existingNames.has(name)) {
      state.players.push(name);
      existingNames.add(name);
    }
  });

  state.playerDraft = "";
  if (!state.spotlightPlayer) {
    state.spotlightPlayer = state.players[0];
  }

  saveStorage(STORAGE_KEYS.players, state.players);
  normalizeGamePlayers();
  playUiTone("success");
  renderApp();
}

function parsePlayerNames(rawText) {
  return Array.from(
    new Set(
      rawText
        .split(/[\n,，、;；]+/)
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => name.slice(0, 14)),
    ),
  );
}

function removePlayer(index) {
  state.players.splice(index, 1);
  saveStorage(STORAGE_KEYS.players, state.players);
  normalizeGamePlayers();
  renderApp();
}

function normalizeGamePlayers(options = {}) {
  const { resetHoldem = true } = options;
  const effectivePlayers = getEffectivePlayers();
  ["truth", "dare"].forEach((gameKey) => {
    const session = getPromptSession(gameKey);
    if (session.currentPlayer && !effectivePlayers.includes(session.currentPlayer)) {
      session.currentPlayer = getRandomPlayer();
    }
  });

  if (state.combo.currentPlayer && !effectivePlayers.includes(state.combo.currentPlayer)) {
    state.combo.currentPlayer = getRandomPlayer();
  }

  if (state.spotlightPlayer && !effectivePlayers.includes(state.spotlightPlayer)) {
    state.spotlightPlayer = "";
  }

  if (resetHoldem) {
    state.cards.holdem = createHoldemGame({
      handNumber: state.cards.holdem.handNumber,
      dealerIndex: state.cards.holdem.dealerIndex,
    });
  }
}

function setView(nextView) {
  if (!state.session.joined) {
    state.view = "home";
    renderApp();
    return;
  }

  state.view = nextView;

  if (nextView === "truth") {
    ensurePromptModuleReady("truth");
  } else if (nextView === "dare") {
    ensurePromptModuleReady("dare");
  } else if (nextView === "tod") {
    ensureComboReady();
  } else if (nextView === "cards") {
    primeCardGames();
  }

  renderApp();
}

function renderApp() {
  const currentView = state.session.joined ? state.view : "lobby";
  document.title =
    currentView === "lobby" ? "聚会小游戏酒馆 - 进入房间" : `聚会小游戏酒馆 - ${VIEW_TITLES[currentView] || "游戏"}`;

  appRoot.innerHTML = `
    <main class="app-shell">
      ${renderTopbar(currentView)}
      <section class="screen">
        ${renderCurrentView(currentView)}
      </section>
    </main>
  `;

  if (state.session.joined) {
    queueRoomSync();
  }
}

function renderTopbar(currentView) {
  const roomMembers = pruneRoomMembers(state.room.members);
  return `
    <header class="topbar glass-card">
      <div>
        <p class="eyebrow">${state.session.joined ? "昵称登录 · 房间模式已启用" : "朋友聚会现场可直接开玩"}</p>
        <h1>聚会小游戏酒馆</h1>
        <p class="subtitle">
          ${escapeHtml(getJoinedRoomSubtitle())}
        </p>
      </div>
      <div class="topbar-actions">
        ${
          state.session.joined
            ? `
              <span class="metric-pill">房间号 <strong>${escapeHtml(state.room.code)}</strong></span>
              <span class="metric-pill">昵称 <strong>${escapeHtml(state.session.nickname)}</strong></span>
              <span class="metric-pill"><strong>${roomMembers.length}</strong> 人在线</span>
            `
            : ""
        }
        ${state.session.joined && currentView !== "home" ? '<button type="button" class="ghost-btn" data-action="go-home">返回主页</button>' : ""}
        ${state.session.joined ? '<button type="button" class="ghost-btn" data-action="copy-room-link">复制房间链接</button>' : ""}
        ${state.session.joined ? '<button type="button" class="ghost-btn" data-action="leave-room">退出房间</button>' : ""}
        <button type="button" class="sound-btn ${state.soundEnabled ? "active" : ""}" data-action="toggle-sound">
          ${state.soundEnabled ? "音效已开" : "音效默认关闭"}
        </button>
      </div>
    </header>
  `;
}

function renderCurrentView(currentView) {
  switch (currentView) {
    case "lobby":
      return renderLobbyView();
    case "truth":
      return renderPromptView("truth");
    case "dare":
      return renderPromptView("dare");
    case "tod":
      return renderTruthOrDareView();
    case "cards":
      return renderCardsView();
    case "players":
      return renderPlayersView();
    default:
      return renderHomeView();
  }
}

function renderLobbyView() {
  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="hero-card glass-card">
          <div class="hero-copy">
            <div>
              <h2>先进入一个房间，再把今晚的游戏局开起来。</h2>
              <p class="section-subtitle">
                ${getLobbyModeDescription()}
              </p>
            </div>
            <div class="hero-metrics">
              <span class="metric-pill"><strong>${TRUTH_BANK.length}</strong> 条真心话</span>
              <span class="metric-pill"><strong>${DARE_BANK.length}</strong> 条大冒险</span>
              <span class="metric-pill"><strong>6</strong> 种纸牌玩法</span>
              <span class="metric-pill"><strong>${hasFirebaseConfig() ? "实时" : "本地"}</strong> 房间模式</span>
            </div>
          </div>
        </article>

        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">昵称登录进入房间</h2>
              <p>创建房间会自动生成 6 位房间号；加入房间时输入房间号即可。若已配置 Firebase，将自动启用跨设备同步。</p>
            </div>
          </div>
          <form id="room-form" class="room-form-grid">
            <div class="form-card">
              <h4>你的昵称</h4>
              <p>建议 2 到 8 个字，方便现场点名。</p>
              <input id="room-nickname-input" placeholder="例如：小林" value="${escapeHtml(state.roomDraft.nickname)}" />
            </div>
            <div class="form-card">
              <h4>房间号</h4>
              <p>加入时填写，创建时可以留空自动生成。</p>
              <input id="room-code-input" placeholder="例如：A7K9P2" value="${escapeHtml(state.roomDraft.roomCode)}" />
              <div class="button-row">
                <button type="button" class="ghost-btn" data-action="fill-room-code">随机一个房间号</button>
              </div>
            </div>
            <div class="button-row">
              <button type="submit" class="primary-btn" data-room-submit="create">创建房间</button>
              <button type="submit" class="secondary-btn" data-room-submit="join">加入房间</button>
            </div>
          </form>
          ${
            state.roomNotice
              ? `<p class="footer-note" style="margin-top: 14px;">${escapeHtml(state.roomNotice)}</p>`
              : '<p class="footer-note" style="margin-top: 14px;">提示：如果你已经从别人那里拿到了链接，打开后房间号会自动带入输入框。</p>'
          }
        </article>
      </div>

      <aside class="aside-stack">
        <article class="side-card glass-card">
          <div class="panel-header">
            <div>
              <h3 class="section-title">当前版本怎么理解</h3>
              <p>${hasFirebaseConfig() ? "这版已经接好了 Firebase 实时房间入口，题库和玩法仍然保持纯前端结构。" : "这版先把房间感和玩法搭起来，再通过配置文件升级成真同步。"}</p>
            </div>
          </div>
          <div class="status-grid">
            <article>
              <h4>题库与规则</h4>
              <p>全部写在前端文件里，部署到 GitHub Pages 就能用。</p>
            </article>
            <article>
              <h4>房间层</h4>
              <p>已经有昵称、房间号、房间链接、房间成员展示和共享状态结构。</p>
            </article>
            <article>
              <h4>真跨设备同步</h4>
              <p>${hasFirebaseConfig() ? "当前版本已经会尝试连接 Firebase；只要配置正确，就能跨手机和电脑同步。"
                : "项目里已预留 Firebase 接口；把配置填进 firebase-config.js 后，就能跨手机和电脑同步。"}</p>
            </article>
            <article>
              <h4>数据库状态</h4>
              <p>${getDatabaseStatusText()}</p>
            </article>
          </div>
        </article>
        ${renderTipCard()}
      </aside>
    </section>
  `;
}

function renderHomeView() {
  const effectivePlayers = getEffectivePlayers();
  const roomMembers = pruneRoomMembers(state.room.members);

  return `
    <section class="hero-card glass-card">
      <div class="hero-copy">
        <div>
          <h2>今晚想玩什么？首页直接开一局。</h2>
          <p class="section-subtitle">真心话、大冒险、二选一和六种纸牌玩法都已经就位，适合聚会现场快速切换。</p>
        </div>
        <div class="hero-metrics">
          <span class="metric-pill"><strong>${effectivePlayers.length}</strong> 位当前可参与玩家</span>
          <span class="metric-pill"><strong>${TRUTH_BANK.length}</strong> 条真心话</span>
          <span class="metric-pill"><strong>${DARE_BANK.length}</strong> 条大冒险</span>
          <span class="metric-pill"><strong>6</strong> 种纸牌玩法</span>
        </div>
      </div>
    </section>

    <section class="game-grid">
      ${HOME_MODULES.map(renderHomeModuleCard).join("")}
    </section>

    <section class="module-layout" style="margin-top: 16px;">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h3 class="section-title">房间玩家一览</h3>
              <p>房间成员会自动加入可随机点名名单，自定义玩家也会并入同一桌。</p>
            </div>
            <button type="button" class="secondary-btn" data-route="players">去设置玩家</button>
          </div>
          <div class="chip-row">
            ${effectivePlayers.map((name) => `<span class="small-chip">${escapeHtml(name)}</span>`).join("")}
          </div>
          <p class="footer-note">
            当前房间在线 ${roomMembers.length} 人；${state.players.length ? "你另外手动补充了自定义玩家列表。" : "如果房间里有人还没到场，也可以先去玩家设置页补录名字。"}
          </p>
        </article>

        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h3 class="section-title">房间状态</h3>
              <p>${getRoomSyncEngineText()}</p>
            </div>
          </div>
          <div class="status-grid">
            <article>
              <h4>房间号</h4>
              <p>${escapeHtml(state.room.code)}</p>
            </article>
            <article>
              <h4>你的昵称</h4>
              <p>${escapeHtml(state.session.nickname)}</p>
            </article>
            <article>
              <h4>同步方式</h4>
              <p>${escapeHtml(state.room.syncMode)}</p>
            </article>
            <article>
              <h4>数据库</h4>
              <p>${escapeHtml(getDatabaseStatusText())}</p>
            </article>
          </div>
          ${
            state.room.remoteError
              ? `<p class="footer-note">云同步提示：${escapeHtml(state.room.remoteError)}</p>`
              : '<p class="footer-note">如果你准备开启真跨设备房间，请按项目里的 FIREBASE_SETUP.md 填写 Firebase 配置。</p>'
          }
        </article>
      </div>
      <aside class="aside-stack">
        ${renderRoomMembersCard()}
        ${renderBonusCard()}
        ${renderTipCard()}
      </aside>
    </section>
  `;
}

function renderHomeModuleCard(module) {
  return `
    <article class="game-card glass-card">
      <div class="game-card-head">
        <div class="game-badge">${module.badge}</div>
        <div>
          <h3>${module.title}</h3>
          <p>${module.description}</p>
        </div>
      </div>
      <button type="button" class="primary-btn" data-route="${module.route}">
        ${module.buttonText}
      </button>
    </article>
  `;
}

function renderRoomMembersCard() {
  const roomMembers = pruneRoomMembers(state.room.members);
  return `
    <article class="side-card glass-card">
      <div class="panel-header">
        <div>
          <h3 class="section-title">房间成员</h3>
          <p>这部分来自房间登录信息，和手动玩家名单会自动合并使用。</p>
        </div>
      </div>
      ${
        roomMembers.length
          ? `
            <div class="player-list compact-list">
              ${roomMembers
                .map(
                  (member) => `
                    <div class="player-row">
                      <div>
                        <strong>${escapeHtml(member.nickname)}</strong>
                        <span>${member.id === state.session.memberId ? "你" : "房间成员"}</span>
                      </div>
                    </div>
                  `,
                )
                .join("")}
            </div>
          `
          : `<div class="empty-state">当前还只有你自己在这个房间里。</div>`
      }
    </article>
  `;
}

function renderPlayersView() {
  const effectivePlayers = getEffectivePlayers();
  const roomMembers = pruneRoomMembers(state.room.members);
  const customOnlyPlayers = state.players.filter((name) => !roomMembers.some((member) => member.nickname === name));

  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">自定义玩家设置</h2>
              <p>支持逗号、顿号、分号或换行批量添加。房间成员会自动入桌，你也可以额外补充不在线的朋友。</p>
            </div>
          </div>

          <div class="form-card">
            <h4>批量录入玩家</h4>
            <p>例：小林，小周，小雨</p>
            <form id="player-form">
              <textarea id="player-names-input" placeholder="输入玩家名字，支持逗号、空格或换行分隔">${escapeHtml(state.playerDraft)}</textarea>
              <div class="button-row">
                <button type="submit" class="primary-btn">添加玩家</button>
                <button type="button" class="secondary-btn" data-action="random-player-preview">随机选择当前玩家</button>
                <button type="button" class="danger-btn" data-action="clear-players">清空自定义</button>
              </div>
            </form>
          </div>

          <div class="panel-header" style="margin-top: 18px;">
            <div>
              <h3 class="section-title">当前实际会参与点名的名单</h3>
              <p>房间成员与自定义玩家会自动合并，所有游戏都从这份名单里随机点名。</p>
            </div>
          </div>
          <div class="chip-row">
            ${effectivePlayers.map((name) => `<span class="small-chip">${escapeHtml(name)}</span>`).join("")}
          </div>

          <div class="two-column" style="margin-top: 18px;">
            <div class="form-card">
              <h4>房间成员</h4>
              <p>${roomMembers.length ? `当前在线 ${roomMembers.length} 人。` : "当前只有你自己在房间中。"}</p>
              <div class="player-list compact-list">
                ${
                  roomMembers.length
                    ? roomMembers
                        .map(
                          (member) => `
                            <div class="player-row">
                              <div>
                                <strong>${escapeHtml(member.nickname)}</strong>
                                <span>${member.id === state.session.memberId ? "你" : "房间成员"}</span>
                              </div>
                            </div>
                          `,
                        )
                        .join("")
                    : '<div class="empty-state">房间成员会在这里出现。</div>'
                }
              </div>
            </div>

            <div class="form-card">
              <h4>额外补充玩家</h4>
              <p>${customOnlyPlayers.length ? `你手动补充了 ${customOnlyPlayers.length} 位未在线玩家。` : "目前没有额外补充玩家。"}</p>
              <div class="player-list compact-list">
                ${
                  customOnlyPlayers.length
                    ? customOnlyPlayers
                        .map((name) => {
                          const index = state.players.indexOf(name);
                          return `
                            <div class="player-row">
                              <div>
                                <strong>${escapeHtml(name)}</strong>
                                <span>自定义补充</span>
                              </div>
                              <button type="button" class="ghost-btn" data-action="remove-player" data-index="${index}">删除</button>
                            </div>
                          `;
                        })
                        .join("")
                    : '<div class="empty-state">如果有人没进房，但你想把他也算进游戏里，可以在上面补录名字。</div>'
                }
              </div>
            </div>
          </div>
        </article>
      </div>

      <aside class="aside-stack">
        <article class="side-card glass-card">
          <div class="panel-header">
            <div>
              <h3 class="section-title">随机点名预览</h3>
              <p>现场临时决定谁先开始，可以先在这里试试手气。</p>
            </div>
          </div>
          <div class="player-showcase">
            <small>当前抽中的玩家</small>
            <h3>${escapeHtml(state.spotlightPlayer || "点击按钮随机选择一位")}</h3>
            <p>${state.spotlightPlayer ? "这位玩家会在其他模块里正常参与随机点名。" : "如果名单暂时为空，系统会自动补默认玩家。"}</p>
          </div>
          <div class="button-row">
            <button type="button" class="primary-btn" data-action="random-player-preview">随机选择当前玩家</button>
            <button type="button" class="ghost-btn" data-route="home">返回主页</button>
          </div>
        </article>
        ${renderRoomMembersCard()}
        ${renderBonusCard()}
      </aside>
    </section>
  `;
}

function renderPromptView(gameKey) {
  const isTruth = gameKey === "truth";
  const title = isTruth ? "真心话" : "大冒险";
  const subtitle = isTruth
    ? "抽一位玩家，再从不同强度的真心话题库中随机发题。"
    : "抽一位玩家，给出可以现场马上执行的轻量任务。";
  const session = getPromptSession(gameKey);
  const bank = getPromptBank(gameKey);
  const summary = getBankSummary(bank, session.level, session.usedIds);

  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">${title}</h2>
              <p>${subtitle}</p>
            </div>
          </div>

          <div class="filter-row">
            ${renderLevelButtons(session.level, gameKey)}
          </div>

          ${
            session.currentItem
              ? `
                <div class="prompt-card" style="margin-top: 16px;">
                  <div class="chip-row">
                    <span class="spotlight-name">当前玩家：${escapeHtml(session.currentPlayer)}</span>
                    <span class="level-pill ${getLevelClassName(session.currentItem.level)}">${session.currentItem.level}</span>
                  </div>
                  <p class="prompt-text">${escapeHtml(session.currentItem.text)}</p>
                </div>
              `
              : `
                <div class="empty-state" style="margin-top: 16px;">
                  ${
                    session.exhausted
                      ? `当前筛选的${title}题库已经抽完了，点“重新开始”即可重置并继续。`
                      : `准备好了就点“下一题”，系统会随机点名并抽出一题。`
                  }
                </div>
              `
          }

          <div class="button-row">
            <button type="button" class="secondary-btn" data-action="change-prompt-player" data-game="${gameKey}">换人</button>
            <button type="button" class="primary-btn" data-action="next-prompt" data-game="${gameKey}">下一题</button>
            <button type="button" class="ghost-btn" data-action="restart-prompt" data-game="${gameKey}">重新开始</button>
            <button type="button" class="ghost-btn" data-route="home">返回主页</button>
          </div>
        </article>

        <article class="section-card glass-card">
          <div class="status-grid">
            <article>
              <h4>当前强度</h4>
              <p>${session.level}</p>
            </article>
            <article>
              <h4>剩余题目</h4>
              <p>${summary.remaining} / ${summary.total}</p>
            </article>
            <article>
              <h4>已抽数量</h4>
              <p>${summary.used}</p>
            </article>
            <article>
              <h4>玩家来源</h4>
              <p>${state.room.members.length ? "房间成员 + 自定义玩家" : "默认玩家或自定义玩家"}</p>
            </article>
          </div>
        </article>
      </div>

      <aside class="aside-stack">
        ${renderSwitchGameCard(gameKey)}
        ${renderBonusCard()}
        ${renderTipCard()}
      </aside>
    </section>
  `;
}

function renderTruthOrDareView() {
  const truthSummary = getBankSummary(TRUTH_BANK, state.combo.level, state.combo.truthUsedIds);
  const dareSummary = getBankSummary(DARE_BANK, state.combo.level, state.combo.dareUsedIds);

  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">真心话大冒险</h2>
              <p>先随机点名，再让这位朋友二选一；如果想省事，直接交给命运随机也行。</p>
            </div>
          </div>

          <div class="filter-row">
            ${renderLevelButtons(state.combo.level, "combo")}
          </div>

          <div class="highlight-box" style="margin-top: 16px;">
            <small>当前玩家</small>
            <div style="margin-top: 10px;">
              <span class="spotlight-name">${escapeHtml(state.combo.currentPlayer || "等待点名")}</span>
            </div>
            <p class="footer-note">${escapeHtml(state.combo.feedback)}</p>
          </div>

          ${
            state.combo.currentItem
              ? `
                <div class="prompt-card" style="margin-top: 16px;">
                  <div class="chip-row">
                    <span class="level-pill ${state.combo.choice === "truth" ? "level-fun" : "level-spicy"}">
                      ${state.combo.choice === "truth" ? "真心话" : "大冒险"}
                    </span>
                    <span class="level-pill ${getLevelClassName(state.combo.currentItem.level)}">${state.combo.currentItem.level}</span>
                  </div>
                  <p class="prompt-text">${escapeHtml(state.combo.currentItem.text)}</p>
                </div>
              `
              : `
                <div class="result-card" style="margin-top: 16px;">
                  <small>选择方式</small>
                  <h3>由玩家自己选，或者让命运替你决定。</h3>
                  <div class="button-row">
                    <button type="button" class="secondary-btn" data-action="combo-choice" data-choice="truth">选真心话</button>
                    <button type="button" class="secondary-btn" data-action="combo-choice" data-choice="dare">选大冒险</button>
                    <button type="button" class="primary-btn" data-action="combo-random">命运随机</button>
                  </div>
                </div>
              `
          }

          <div class="button-row">
            <button type="button" class="secondary-btn" data-action="combo-reroll-player">重新抽人</button>
            <button type="button" class="secondary-btn" data-action="combo-reset-choice">重新选择</button>
            <button type="button" class="primary-btn" data-action="combo-next">下一题</button>
            <button type="button" class="ghost-btn" data-action="restart-combo">重新开始</button>
            <button type="button" class="ghost-btn" data-route="home">返回主页</button>
          </div>
        </article>

        <article class="section-card glass-card">
          <div class="status-grid">
            <article>
              <h4>真心话剩余</h4>
              <p>${truthSummary.remaining} / ${truthSummary.total}</p>
            </article>
            <article>
              <h4>大冒险剩余</h4>
              <p>${dareSummary.remaining} / ${dareSummary.total}</p>
            </article>
            <article>
              <h4>当前强度</h4>
              <p>${state.combo.level}</p>
            </article>
            <article>
              <h4>玩家来源</h4>
              <p>${state.room.members.length ? "房间成员 + 自定义玩家" : "默认玩家或自定义玩家"}</p>
            </article>
          </div>
        </article>
      </div>

      <aside class="aside-stack">
        ${renderSwitchGameCard("tod")}
        ${renderBonusCard()}
        ${renderTipCard()}
      </aside>
    </section>
  `;
}

function renderCardsView() {
  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">纸牌小游戏中心</h2>
              <p>一副虚拟扑克牌，六种现场可直接执行的聚会玩法。切换标签就能马上换游戏。</p>
            </div>
          </div>

          <div class="cards-tabs">
            ${renderCardTabs()}
          </div>

          <div class="cards-stage" style="margin-top: 16px;">
            ${renderActiveCardGame()}
          </div>
        </article>
      </div>

      <aside class="aside-stack">
        <article class="side-card glass-card">
          <div class="panel-header">
            <div>
              <h3 class="section-title">现场使用建议</h3>
              <p>纸牌玩法节奏更快，适合在聊天间隙穿插来几轮。</p>
            </div>
          </div>
          <div class="tip-note">
            <strong>小提示</strong>
            <p>如果一桌人较多，可以每轮只执行最核心的规则，保持流畅比规则更重要。</p>
          </div>
          <div class="button-row">
            <button type="button" class="ghost-btn" data-route="home">返回主页</button>
          </div>
        </article>
        ${renderSwitchGameCard("cards")}
        ${renderBonusCard()}
        ${renderTipCard()}
      </aside>
    </section>
  `;
}

function renderCardTabs() {
  const tabs = [
    { key: "lucky", label: "抽鬼牌 / 幸运牌" },
    { key: "highlow", label: "高低牌猜猜" },
    { key: "roulette", label: "轮盘指令牌" },
    { key: "king", label: "国王指令简化版" },
    { key: "holdem", label: "聚会德州扑克" },
    { key: "bigsister", label: "大姐牌（聚会版）" },
  ];

  return tabs
    .map(
      (tab) => `
        <button
          type="button"
          class="tab-btn ${state.cards.activeTab === tab.key ? "active" : ""}"
          data-action="set-card-tab"
          data-tab="${tab.key}"
        >
          ${tab.label}
        </button>
      `,
    )
    .join("");
}

function renderActiveCardGame() {
  switch (state.cards.activeTab) {
    case "highlow":
      return renderHighLowGame();
    case "roulette":
      return renderRouletteGame();
    case "king":
      return renderKingGame();
    case "holdem":
      return renderHoldemGame();
    case "bigsister":
      return renderBigSisterGame();
    default:
      return renderLuckyGame();
  }
}

function renderLuckyGame() {
  const { currentCard, currentRule, deck } = state.cards.lucky;
  return `
    <div class="two-column">
      <div class="card-showcase">
        ${renderPlayingCard(currentCard)}
        <div class="card-meta">
          <span class="deck-chip">牌堆剩余 ${deck.length} 张</span>
          <div class="button-row">
            <button type="button" class="primary-btn" data-action="draw-lucky-card">再抽一张</button>
            <button type="button" class="ghost-btn" data-action="reset-lucky-deck">重新洗牌</button>
          </div>
        </div>
      </div>
      <div class="main-stack">
        <div class="command-card">
          <small>当前规则</small>
          <h3>${escapeHtml(currentRule.title)}</h3>
          <p>${escapeHtml(currentRule.detail)}</p>
          <p class="footer-note">${escapeHtml(currentRule.suitHint)}</p>
        </div>
        <div class="rules-card">
          <h4>快速理解</h4>
          <div class="rules-list">
            ${["A", "K", "Q", "J"].map((rank) => renderMiniRule(rank, LUCKY_RULES[rank].title, LUCKY_RULES[rank].detail)).join("")}
          </div>
          <p class="footer-note">数字牌会给出更轻快的现场任务，适合快速过几轮暖场。</p>
        </div>
      </div>
    </div>
  `;
}

function renderHighLowGame() {
  const game = state.cards.highLow;
  return `
    <div class="highlow-board">
      <div class="score-panel">
        <div class="score-box">
          <span>当前得分</span>
          <strong>${game.score}</strong>
        </div>
        <div class="score-box">
          <span>连续命中</span>
          <strong>${game.streak}</strong>
        </div>
      </div>

      <div class="highlow-cards">
        <div class="card-slot">
          <span class="card-slot-label">上一张</span>
          ${game.previousCard ? renderPlayingCard(game.previousCard) : '<div class="placeholder-card">等待下一次揭牌</div>'}
        </div>
        <div class="card-slot">
          <span class="card-slot-label">当前牌</span>
          ${renderPlayingCard(game.currentCard)}
        </div>
      </div>

      <div class="button-row">
        <button type="button" class="secondary-btn" data-action="highlow-guess" data-guess="higher">猜更大</button>
        <button type="button" class="secondary-btn" data-action="highlow-guess" data-guess="lower">猜更小</button>
        <button type="button" class="secondary-btn" data-action="highlow-guess" data-guess="equal">猜相等</button>
        <button type="button" class="ghost-btn" data-action="reset-highlow">重新开始</button>
      </div>

      <div class="result-card" data-tone="${game.tone}">
        <small>本轮提示</small>
        <h3>${escapeHtml(game.feedback)}</h3>
        <p>已进行 ${game.rounds} 轮。相等最难猜，猜中会额外加 2 分。</p>
      </div>
    </div>
  `;
}

function renderRouletteGame() {
  const { currentRule, deck } = state.cards.roulette;
  return `
    <div class="main-stack">
      <div class="command-card">
        <small>当前指令牌 · ${escapeHtml(currentRule.tag)}</small>
        <h3>${escapeHtml(currentRule.title)}</h3>
        <p>${escapeHtml(currentRule.detail)}</p>
      </div>
      <div class="toggle-row">
        <span class="deck-chip">规则牌剩余 ${deck.length} 张</span>
        <div class="button-row">
          <button type="button" class="primary-btn" data-action="draw-roulette-card">抽新规则</button>
          <button type="button" class="ghost-btn" data-action="reset-roulette">重置牌堆</button>
        </div>
      </div>
      <div class="rules-card">
        <h4>玩法说明</h4>
        <p>每轮抽一张，把这张规则临时生效到下一轮或下一次被点到。规则尽量口头执行，不需要额外道具。</p>
      </div>
    </div>
  `;
}

function renderKingGame() {
  const { currentCard, currentRule, deck, showRules } = state.cards.king;
  return `
    <div class="two-column">
      <div class="card-showcase">
        ${renderPlayingCard(currentCard)}
        <div class="card-meta">
          <span class="deck-chip">牌堆剩余 ${deck.length} 张</span>
          <div class="button-row">
            <button type="button" class="primary-btn" data-action="draw-king-card">抽一张</button>
            <button type="button" class="ghost-btn" data-action="toggle-king-rules">${showRules ? "收起完整规则" : "查看完整规则"}</button>
            <button type="button" class="ghost-btn" data-action="reset-king-deck">重新洗牌</button>
          </div>
        </div>
      </div>
      <div class="main-stack">
        <div class="command-card">
          <small>当前任务</small>
          <h3>${escapeHtml(currentRule.title)}</h3>
          <p>${escapeHtml(currentRule.detail)}</p>
        </div>
        <div class="rules-card">
          <h4>简化说明</h4>
          <p>K、Q、J、A 和数字牌分别映射一条聚会规则。每次翻到一张就立即执行，适合多人快速轮转。</p>
        </div>
        ${
          showRules
            ? `
              <div class="rules-card">
                <h4>完整规则</h4>
                <div class="rules-list">
                  ${KING_RULE_ORDER.map((rank) => renderMiniRule(rank, KING_RULES[rank].title, KING_RULES[rank].detail)).join("")}
                </div>
              </div>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function renderHoldemGame() {
  const game = state.cards.holdem;
  const playerNames = getTablePlayers(2, HOLD_EM_MAX_PLAYERS);
  return `
    <div class="main-stack">
      <div class="toggle-row">
        <div>
          <h3 class="section-title">聚会德州扑克</h3>
          <p class="section-subtitle">聚会版不做真钱下注，重点是发牌、翻牌、摊牌和自动判牌型，适合围着屏幕一起猜谁会赢。</p>
        </div>
        <span class="deck-chip">当前桌上 ${playerNames.length} 人参与</span>
      </div>

      <div class="community-wrap">
        <div class="community-row">
          ${renderCommunityCards(game.communityCards)}
        </div>
        <div class="score-panel">
          <div class="score-box">
            <span>当前阶段</span>
            <strong>${getHoldemStageLabel(game.stage)}</strong>
          </div>
          <div class="score-box">
            <span>手数</span>
            <strong>${game.handNumber}</strong>
          </div>
        </div>
      </div>

      <div class="button-row">
        <button type="button" class="primary-btn" data-action="holdem-start">${game.stage === "idle" ? "发新一局" : "重新发一局"}</button>
        <button type="button" class="secondary-btn" data-action="holdem-next">${game.stage === "river" ? "摊牌" : game.stage === "showdown" ? "下一局" : "下一阶段"}</button>
        <button type="button" class="ghost-btn" data-action="holdem-reveal-all">全部亮牌</button>
        <button type="button" class="ghost-btn" data-action="holdem-reset">清空桌面</button>
      </div>

      <div class="result-card">
        <small>主持提示</small>
        <h3>${escapeHtml(game.feedback)}</h3>
        <p>${game.players.length ? `庄位目前是 ${escapeHtml(game.players[game.dealerIndex]?.name || "-")}。` : "一局开始后会自动按当前房间玩家发牌。"}</p>
      </div>

      ${
        game.showdown
          ? `
            <div class="command-card">
              <small>摊牌结果</small>
              <h3>${escapeHtml(game.feedback)}</h3>
              <div class="rules-list">
                ${game.showdown.summaries
                  .map(
                    (entry) => `
                      <div class="rule-item">
                        <div class="rule-rank">${escapeHtml(entry.result.shortName)}</div>
                        <div>
                          <strong>${escapeHtml(entry.name)}</strong>
                          <p style="margin: 6px 0 0; color: var(--text-muted);">${escapeHtml(entry.result.name)}</p>
                        </div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          `
          : ""
      }

      <div class="holdem-player-grid">
        ${
          game.players.length
            ? game.players
                .map(
                  (player, index) => `
                    <article class="player-hand-card">
                      <div class="toggle-row">
                        <div>
                          <strong>${escapeHtml(player.name)}</strong>
                          <p class="footer-note">${index === game.dealerIndex ? "本局庄位" : "参与玩家"}</p>
                        </div>
                        <button type="button" class="ghost-btn" data-action="holdem-toggle-reveal" data-index="${index}">
                          ${player.revealed ? "藏回底牌" : "看底牌"}
                        </button>
                      </div>
                      <div class="mini-card-row">
                        ${player.revealed ? player.holeCards.map((card) => renderMiniCard(card)).join("") : renderHiddenMiniCards()}
                      </div>
                      ${
                        player.bestHand
                          ? `<p class="footer-note">最佳牌型：${escapeHtml(player.bestHand.name)}</p>`
                          : '<p class="footer-note">摊牌后会自动计算这位玩家的最佳五张牌型。</p>'
                      }
                    </article>
                  `,
                )
                .join("")
            : `
                <div class="empty-state">
                  当前会自动使用房间成员和自定义玩家开桌。点击“发新一局”后，每位玩家都会得到 2 张底牌。
                </div>
              `
        }
      </div>

      <div class="rules-card">
        <h4>玩法说明</h4>
        <p>流程是底牌 2 张、翻牌圈 3 张、转牌 1 张、河牌 1 张。系统会自动比较每位玩家的最佳五张牌并给出赢家，不做真钱下注，只保留最有意思的看牌与比牌节奏。</p>
      </div>
    </div>
  `;
}

function renderBigSisterGame() {
  const game = state.cards.bigSister;
  return `
    <div class="two-column">
      <div class="card-showcase">
        ${renderPlayingCard(game.currentCard)}
        <div class="card-meta">
          <span class="deck-chip">牌堆剩余 ${game.deck.length} 张</span>
          <div class="button-row">
            <button type="button" class="primary-btn" data-action="draw-big-sister">抽下一张</button>
            <button type="button" class="ghost-btn" data-action="reset-big-sister">重新洗牌</button>
            <button type="button" class="ghost-btn" data-action="toggle-big-sister-rules">${game.showRules ? "收起完整规则" : "查看完整规则"}</button>
          </div>
        </div>
      </div>

      <div class="main-stack">
        <div class="command-card">
          <small>当前轮到</small>
          <h3>${escapeHtml(game.currentPlayer || "等待抽牌")}</h3>
          <p>${game.currentRule ? escapeHtml(game.currentRule.title) : "点击抽牌后生成大姐牌任务。"}${game.currentRule ? ` ${escapeHtml(game.currentRule.detail)}` : ""}</p>
          ${game.currentRule ? `<p class="footer-note">${escapeHtml(game.currentRule.suitHint)}</p>` : ""}
        </div>

        <div class="rules-card">
          <div class="toggle-row">
            <h4>当前持续效果</h4>
            <button type="button" class="ghost-btn" data-action="clear-big-sister-effects">清空持续效果</button>
          </div>
          ${
            game.activeEffects.length
              ? `
                <div class="rules-list">
                  ${game.activeEffects
                    .map(
                      (effect) => `
                        <div class="rule-item">
                          <div class="rule-rank">${escapeHtml(effect.rank)}</div>
                          <div>
                            <strong>${escapeHtml(effect.owner)}</strong>
                            <p style="margin: 6px 0 0; color: var(--text-muted);">${escapeHtml(effect.text)}</p>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
              `
              : `<p>当前没有持续生效的大姐牌规则，抽到 K、Q、A、7、3 这类牌时会产生更强的连锁效果。</p>`
          }
        </div>

        <div class="rules-card">
          <h4>最近抽牌记录</h4>
          ${
            game.history.length
              ? `
                <div class="rules-list">
                  ${game.history
                    .map(
                      (entry) => `
                        <div class="rule-item">
                          <div class="rule-rank">${escapeHtml(entry.card.rank)}</div>
                          <div>
                            <strong>${escapeHtml(entry.player)}</strong>
                            <p style="margin: 6px 0 0; color: var(--text-muted);">${escapeHtml(entry.title)} · ${escapeHtml(entry.card.suitName)}</p>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
              `
              : `<p>抽牌后这里会记录最近几轮的大姐牌历史。</p>`
          }
        </div>

        ${
          game.showRules
            ? `
              <div class="rules-card">
                <h4>完整规则</h4>
                <p>这是一版偏“小姐牌进阶”感觉的聚会 house rules：更强调持续效果、搭子关系和全桌口头规则。</p>
                <div class="rules-list">
                  ${BIG_SISTER_RULE_ORDER.map((rank) => renderMiniRule(rank, BIG_SISTER_RULES[rank].title, BIG_SISTER_RULES[rank].detail)).join("")}
                </div>
              </div>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function renderMiniRule(rank, title, detail) {
  return `
    <div class="rule-item">
      <div class="rule-rank">${escapeHtml(rank)}</div>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p style="margin: 6px 0 0; color: var(--text-muted);">${escapeHtml(detail)}</p>
      </div>
    </div>
  `;
}

function renderPlayingCard(card) {
  if (!card) {
    return '<div class="placeholder-card">等待翻牌</div>';
  }

  return `
    <div class="playing-card ${card.color}">
      <div class="card-corner top">
        <span class="card-rank">${escapeHtml(card.rank)}</span>
        <span class="card-suit">${escapeHtml(card.suit)}</span>
      </div>
      <div class="card-corner bottom">
        <span class="card-rank">${escapeHtml(card.rank)}</span>
        <span class="card-suit">${escapeHtml(card.suit)}</span>
      </div>
      <div class="card-center">
        <div class="card-center-inner">
          <span class="center-rank">${escapeHtml(card.rank)}</span>
          <span class="center-suit">${escapeHtml(card.suit)}</span>
          <span class="center-name">${escapeHtml(card.suitName)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderMiniCard(card) {
  return `
    <div class="mini-card ${card.color}">
      <span>${escapeHtml(card.rank)}</span>
      <span>${escapeHtml(card.suit)}</span>
    </div>
  `;
}

function renderHiddenMiniCards() {
  return `
    <div class="mini-card mini-card-back"><span>?</span><span>♠</span></div>
    <div class="mini-card mini-card-back"><span>?</span><span>♥</span></div>
  `;
}

function renderCommunityCards(cards) {
  const slots = Array.from({ length: 5 }, (_, index) => cards[index] || null);
  return slots
    .map((card) => (card ? renderMiniCard(card) : '<div class="mini-card mini-card-placeholder">待翻</div>'))
    .join("");
}

function getHoldemStageLabel(stage) {
  const labels = {
    idle: "未开始",
    preflop: "底牌",
    flop: "翻牌圈",
    turn: "转牌",
    river: "河牌",
    showdown: "摊牌",
  };
  return labels[stage] || "未开始";
}

function renderSwitchGameCard(currentView) {
  return `
    <article class="side-card glass-card">
      <div class="panel-header">
        <div>
          <h3 class="section-title">切换游戏</h3>
          <p>不想回首页也可以直接跳到其他模块。</p>
        </div>
      </div>
      <div class="button-row">
        ${HOME_MODULES.filter((module) => module.route !== currentView)
          .map(
            (module) => `
              <button type="button" class="ghost-btn" data-route="${module.route}">
                ${module.title}
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderBonusCard() {
  if (!state.showBonus) {
    return `
      <article class="side-card glass-card">
        <div class="toggle-row">
          <div>
            <h3 class="section-title">随机惩罚 / 奖励</h3>
            <p class="helper-text">当前已隐藏，想加点趣味时再展开。</p>
          </div>
          <button type="button" class="secondary-btn" data-action="toggle-bonus">展开</button>
        </div>
      </article>
    `;
  }

  return `
    <article class="side-card glass-card">
      <div class="toggle-row">
        <div>
          <h3 class="section-title">随机惩罚 / 奖励</h3>
          <p class="helper-text">临场想加点变化时抽一下，轻松就好。</p>
        </div>
        <button type="button" class="ghost-btn" data-action="toggle-bonus">收起</button>
      </div>
      <div class="bonus-result" data-kind="${escapeHtml(state.bonusResult.kind)}" style="margin-top: 14px;">
        <strong>${escapeHtml(state.bonusResult.kind)}</strong>
        <p style="margin: 10px 0 0;">${escapeHtml(state.bonusResult.text)}</p>
      </div>
      <div class="button-row">
        <button type="button" class="primary-btn" data-action="draw-bonus">再来一个</button>
      </div>
    </article>
  `;
}

function renderTipCard() {
  return `
    <article class="side-card glass-card">
      <div class="panel-header">
        <div>
          <h3 class="section-title">聚会气氛小提示</h3>
          <p>现场舒服、节奏顺，游戏才会越来越好玩。</p>
        </div>
      </div>
      <div class="tip-note">
        <strong>提示</strong>
        <p style="margin: 10px 0 0;">${escapeHtml(ATMOSPHERE_TIPS[state.tipIndex])}</p>
      </div>
      <div class="button-row">
        <button type="button" class="secondary-btn" data-action="next-tip">换一条</button>
      </div>
    </article>
  `;
}

function renderLevelButtons(activeLevel, gameKey) {
  return LEVELS.map(
    (level) => `
      <button
        type="button"
        class="filter-btn ${activeLevel === level ? "active" : ""}"
        data-action="set-level"
        data-game="${gameKey}"
        data-level="${level}"
      >
        ${level}
      </button>
    `,
  ).join("");
}

function getLevelClassName(level) {
  if (level === "轻松") {
    return "level-soft";
  }
  if (level === "搞笑") {
    return "level-fun";
  }
  return "level-spicy";
}

function compareEvaluatedHands(left, right) {
  if (left.rankClass !== right.rankClass) {
    return left.rankClass - right.rankClass;
  }

  for (let index = 0; index < Math.max(left.tieBreak.length, right.tieBreak.length); index += 1) {
    const leftValue = left.tieBreak[index] || 0;
    const rightValue = right.tieBreak[index] || 0;
    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }

  return 0;
}

function evaluateBestHoldemHand(cards) {
  const combinations = chooseCardCombinations(cards, 5);
  let best = null;

  combinations.forEach((combo) => {
    const evaluated = evaluateFiveCardHand(combo);
    if (!best || compareEvaluatedHands(evaluated, best) > 0) {
      best = evaluated;
    }
  });

  return best;
}

function chooseCardCombinations(cards, pickCount, startIndex = 0, prefix = [], output = []) {
  if (prefix.length === pickCount) {
    output.push(prefix);
    return output;
  }

  for (let index = startIndex; index <= cards.length - (pickCount - prefix.length); index += 1) {
    chooseCardCombinations(cards, pickCount, index + 1, [...prefix, cards[index]], output);
  }

  return output;
}

function evaluateFiveCardHand(cards) {
  const values = cards.map((card) => card.value).sort((left, right) => right - left);
  const valueCounts = new Map();
  values.forEach((value) => {
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  });

  const groups = [...valueCounts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count || right.value - left.value);

  const flush = new Set(cards.map((card) => card.suit)).size === 1;
  const straightHigh = getStraightHigh(values);

  if (flush && straightHigh) {
    const isRoyal = straightHigh === 14 && values.includes(10);
    return {
      rankClass: 8,
      tieBreak: [straightHigh],
      name: isRoyal ? "皇家同花顺" : "同花顺",
      shortName: isRoyal ? "皇家" : "同花顺",
    };
  }

  if (groups[0].count === 4) {
    return {
      rankClass: 7,
      tieBreak: [groups[0].value, groups[1].value],
      name: "四条",
      shortName: "四条",
    };
  }

  if (groups[0].count === 3 && groups[1].count === 2) {
    return {
      rankClass: 6,
      tieBreak: [groups[0].value, groups[1].value],
      name: "葫芦",
      shortName: "葫芦",
    };
  }

  if (flush) {
    return {
      rankClass: 5,
      tieBreak: values,
      name: "同花",
      shortName: "同花",
    };
  }

  if (straightHigh) {
    return {
      rankClass: 4,
      tieBreak: [straightHigh],
      name: "顺子",
      shortName: "顺子",
    };
  }

  if (groups[0].count === 3) {
    const kickers = groups.slice(1).map((group) => group.value).sort((left, right) => right - left);
    return {
      rankClass: 3,
      tieBreak: [groups[0].value, ...kickers],
      name: "三条",
      shortName: "三条",
    };
  }

  if (groups[0].count === 2 && groups[1].count === 2) {
    const pairValues = groups
      .filter((group) => group.count === 2)
      .map((group) => group.value)
      .sort((left, right) => right - left);
    const kicker = groups.find((group) => group.count === 1)?.value || 0;
    return {
      rankClass: 2,
      tieBreak: [...pairValues, kicker],
      name: "两对",
      shortName: "两对",
    };
  }

  if (groups[0].count === 2) {
    const kickers = groups.slice(1).map((group) => group.value).sort((left, right) => right - left);
    return {
      rankClass: 1,
      tieBreak: [groups[0].value, ...kickers],
      name: "一对",
      shortName: "一对",
    };
  }

  return {
    rankClass: 0,
    tieBreak: values,
    name: "高牌",
    shortName: "高牌",
  };
}

function getStraightHigh(values) {
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.includes(14)) {
    uniqueValues.push(1);
  }

  let streak = 1;
  for (let index = 0; index < uniqueValues.length - 1; index += 1) {
    if (uniqueValues[index] - 1 === uniqueValues[index + 1]) {
      streak += 1;
      if (streak >= 5) {
        return uniqueValues[index - 3];
      }
    } else {
      streak = 1;
    }
  }

  return 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
