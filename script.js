const appRoot = document.getElementById("app");

const STORAGE_KEYS = {
  players: "party-tavern-players",
  soundEnabled: "party-tavern-sound-enabled",
  showBonus: "party-tavern-show-bonus",
};

const VIEW_TITLES = {
  home: "主页",
  truth: "真心话",
  dare: "大冒险",
  tod: "真心话大冒险",
  cards: "纸牌小游戏",
  players: "自定义玩家设置",
};

const LEVELS = ["全部", "轻松", "搞笑", "微刺激"];
const DEFAULT_PLAYER_COUNT = 4;

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
    description: "四种扑克牌玩法集中在一页，适合多人围着屏幕快速玩。",
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

const TRUTH_BANK = buildBank(TRUTH_SOURCE, "truth");
const DARE_BANK = buildBank(DARE_SOURCE, "dare");

const state = createInitialState();

let audioContext = null;

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("input", handleInput);

initializeApp();

function initializeApp() {
  state.bonusResult = getRandomBonusResult();
  primeCardGames();
  renderApp();
}

function createInitialState() {
  return {
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
  };
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
    // 本地不可写时保持静默降级
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

function getEffectivePlayers(minCount = DEFAULT_PLAYER_COUNT) {
  if (state.players.length) {
    return [...state.players];
  }
  return Array.from({ length: minCount }, (_, index) => `玩家${index + 1}`);
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
    default:
      break;
  }
}

function handleSubmit(event) {
  if (event.target.id !== "player-form") {
    return;
  }

  event.preventDefault();
  addPlayersFromDraft();
}

function handleInput(event) {
  if (event.target.id === "player-names-input") {
    state.playerDraft = event.target.value;
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

function normalizeGamePlayers() {
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
}

function setView(nextView) {
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
  document.title = state.view === "home" ? "聚会小游戏酒馆" : `聚会小游戏酒馆 - ${VIEW_TITLES[state.view] || "游戏"}`;
  appRoot.innerHTML = `
    <main class="app-shell">
      ${renderTopbar()}
      <section class="screen">
        ${renderCurrentView()}
      </section>
    </main>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar glass-card">
      <div>
        <p class="eyebrow">朋友聚会现场可直接开玩</p>
        <h1>聚会小游戏酒馆</h1>
        <p class="subtitle">轻松开场、快速点名、规则清楚，打开页面就能立刻玩起来。</p>
      </div>
      <div class="topbar-actions">
        ${state.view !== "home" ? '<button type="button" class="ghost-btn" data-action="go-home">返回主页</button>' : ""}
        <button type="button" class="sound-btn ${state.soundEnabled ? "active" : ""}" data-action="toggle-sound">
          ${state.soundEnabled ? "音效已开" : "音效默认关闭"}
        </button>
      </div>
    </header>
  `;
}

function renderCurrentView() {
  switch (state.view) {
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

function renderHomeView() {
  const effectivePlayers = getEffectivePlayers();
  return `
    <section class="hero-card glass-card">
      <div class="hero-copy">
        <div>
          <h2>今晚想玩什么？首页直接开一局。</h2>
          <p class="section-subtitle">真心话、大冒险、二选一和四种纸牌玩法都已经内置好，适合聚会现场快速切换。</p>
        </div>
        <div class="hero-metrics">
          <span class="metric-pill"><strong>${effectivePlayers.length}</strong> 位当前可参与玩家</span>
          <span class="metric-pill"><strong>${TRUTH_BANK.length}</strong> 条真心话</span>
          <span class="metric-pill"><strong>${DARE_BANK.length}</strong> 条大冒险</span>
          <span class="metric-pill"><strong>4</strong> 种纸牌玩法</span>
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
              <h3 class="section-title">今晚玩家一览</h3>
              <p>如果你还没手动添加名字，系统会自动使用默认玩家，随时都能直接开始。</p>
            </div>
            <button type="button" class="secondary-btn" data-route="players">去设置玩家</button>
          </div>
          <div class="chip-row">
            ${effectivePlayers.map((name) => `<span class="small-chip">${escapeHtml(name)}</span>`).join("")}
          </div>
          <p class="footer-note">当前${state.players.length ? "使用的是你自定义的玩家列表，并已自动保存在本地浏览器。" : "还没有自定义玩家，游戏会以默认玩家 1 至玩家 4 运行。"}
          </p>
        </article>
      </div>
      <aside class="aside-stack">
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

function renderPlayersView() {
  const effectivePlayers = getEffectivePlayers();
  return `
    <section class="module-layout">
      <div class="main-stack">
        <article class="section-card glass-card">
          <div class="panel-header">
            <div>
              <h2 class="section-title">自定义玩家设置</h2>
              <p>支持逗号、顿号、分号或换行批量添加。当前页修改后，其他游戏会立刻读取同一份玩家列表。</p>
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
              <h3 class="section-title">玩家列表</h3>
              <p>${state.players.length ? `已设置 ${state.players.length} 位自定义玩家。` : "目前还没有自定义玩家，游戏会自动使用默认玩家。"}</p>
            </div>
          </div>

          <div class="player-list">
            ${
              state.players.length
                ? state.players
                    .map(
                      (name, index) => `
                      <div class="player-row">
                        <div>
                          <strong>${escapeHtml(name)}</strong>
                          <span>自定义玩家</span>
                        </div>
                        <button type="button" class="ghost-btn" data-action="remove-player" data-index="${index}">删除</button>
                      </div>
                    `,
                    )
                    .join("")
                : `
                    <div class="empty-state">
                      你还没有录入自定义玩家。下面这组默认玩家会在所有游戏里自动生效：
                      <div class="chip-row" style="margin-top: 12px;">
                        ${effectivePlayers.map((name) => `<span class="small-chip">${escapeHtml(name)}</span>`).join("")}
                      </div>
                    </div>
                  `
            }
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
            <p>${state.spotlightPlayer ? "这位玩家会在其他模块里正常参与随机点名。" : "如果没有自定义玩家，系统会从默认玩家中抽取。"}</p>
          </div>
          <div class="button-row">
            <button type="button" class="primary-btn" data-action="random-player-preview">随机选择当前玩家</button>
            <button type="button" class="ghost-btn" data-route="home">返回主页</button>
          </div>
        </article>
        ${renderBonusCard()}
        ${renderTipCard()}
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
              <p>${state.players.length ? "自定义玩家列表" : "默认玩家列表"}</p>
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
                <div class="result-card" data-tone="neutral" style="margin-top: 16px;">
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
              <p>${state.players.length ? "自定义玩家列表" : "默认玩家列表"}</p>
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
              <p>一副虚拟扑克牌，四种现场可直接执行的聚会玩法。切换标签就能马上换游戏。</p>
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
