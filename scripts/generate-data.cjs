// データ生成スクリプト
const fs = require('fs');
const path = require('path');

// ランダム選択
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickWeighted = (items) => {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let r = Math.random() * total;
  for (const [item, weight] of items) {
    r -= weight;
    if (r <= 0) return item;
  }
  return items[0][0];
};

// 日付生成
const randomDate = (start, end) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const d = new Date(s + Math.random() * (e - s));
  return d.toISOString().replace('T', ' ').slice(0, 19);
};

// マスターデータ
const adSources = [
  ['meta', 35],
  ['google', 30],
  ['twitter', 10],
  ['tiktok', 10],
  ['organic', 15],
];

const campaigns = {
  meta: ['meta_brand_awareness', 'meta_conversion', 'meta_retargeting'],
  google: ['google_search', 'google_display', 'google_shopping'],
  twitter: ['twitter_engagement', 'twitter_awareness'],
  tiktok: ['tiktok_viral', 'tiktok_creator'],
  organic: ['organic_direct', 'organic_referral', 'organic_seo'],
};

const devices = [['ios', 55], ['android', 45]];
const ageGroups = [['18-24', 25], ['25-34', 35], ['35-44', 25], ['45+', 15]];
const regions = [['関東', 40], ['関西', 25], ['中部', 15], ['九州', 10], ['その他', 10]];
const eventTypes = ['app_open', 'view_content', 'add_to_cart', 'purchase', 'share'];
const amounts = [100, 300, 500, 980, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 9800];

// ===== USERS (500行) =====
const users = [];
for (let i = 1; i <= 500; i++) {
  const adSource = pickWeighted(adSources);
  const campaign = pick(campaigns[adSource]);
  users.push({
    user_id: `U${String(i).padStart(5, '0')}`,
    ad_source: adSource,
    campaign: campaign,
    device: pickWeighted(devices),
    age_group: pickWeighted(ageGroups),
    region: pickWeighted(regions),
    registered_at: randomDate('2024-01-01', '2024-12-15'),
  });
}
// 日付順にソート
users.sort((a, b) => a.registered_at.localeCompare(b.registered_at));
// user_idを振り直し
users.forEach((u, i) => u.user_id = `U${String(i + 1).padStart(5, '0')}`);

// ===== PAYMENTS (500行) =====
// 課金するユーザーは約30%、複数回課金するユーザーもいる
const payingUserIds = users
  .filter(() => Math.random() < 0.3)
  .map(u => ({ userId: u.user_id, regDate: u.registered_at }));

const payments = [];
let paymentId = 1;
while (payments.length < 500 && paymentId < 10000) {
  const payer = pick(payingUserIds);
  if (!payer) break;

  const paymentDate = randomDate(payer.regDate, '2024-12-20');
  if (paymentDate < payer.regDate) continue;

  payments.push({
    payment_id: `P${String(paymentId).padStart(6, '0')}`,
    user_id: payer.userId,
    amount: pick(amounts),
    payment_date: paymentDate,
  });
  paymentId++;
}
payments.sort((a, b) => a.payment_date.localeCompare(b.payment_date));
payments.forEach((p, i) => p.payment_id = `P${String(i + 1).padStart(6, '0')}`);

// ===== EVENTS (2000行 - ユーザーあたり複数イベント) =====
const events = [];
let eventId = 1;
for (const user of users) {
  // 各ユーザー2-8個のイベント
  const numEvents = 2 + Math.floor(Math.random() * 7);
  for (let j = 0; j < numEvents && events.length < 2000; j++) {
    events.push({
      event_id: `E${String(eventId).padStart(7, '0')}`,
      user_id: user.user_id,
      event_type: pick(eventTypes),
      event_date: randomDate(user.registered_at, '2024-12-20'),
    });
    eventId++;
  }
}
events.sort((a, b) => a.event_date.localeCompare(b.event_date));
events.forEach((e, i) => e.event_id = `E${String(i + 1).padStart(7, '0')}`);

// ===== AD_COSTS (144行 - 12ヶ月 x 広告ソース x キャンペーン) =====
const adCosts = [];
let costId = 1;
const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];

for (const month of months) {
  for (const [adSource] of adSources.filter(([s]) => s !== 'organic')) {
    for (const campaign of campaigns[adSource]) {
      // 月によって変動する広告費
      const baseCost = 50000 + Math.floor(Math.random() * 200000);
      const seasonalMultiplier = month.endsWith('-12') ? 1.5 :
                                  month.endsWith('-03') ? 1.3 : 1.0;
      adCosts.push({
        id: costId++,
        month: month,
        ad_source: adSource,
        campaign: campaign,
        cost: Math.floor(baseCost * seasonalMultiplier),
      });
    }
  }
}

// スキーマを構築
const schema = {
  tables: [
    {
      name: "users",
      description: "ユーザー情報（流入元、デバイス等）",
      columns: [
        { name: "user_id", type: "STRING", description: "ユーザーID（例: U00001）", isPrimaryKey: true },
        { name: "ad_source", type: "STRING", description: "広告流入元（meta, google, twitter, tiktok, organic）" },
        { name: "campaign", type: "STRING", description: "キャンペーン名" },
        { name: "device", type: "STRING", description: "デバイス（ios, android）" },
        { name: "age_group", type: "STRING", description: "年齢層（18-24, 25-34, 35-44, 45+）" },
        { name: "region", type: "STRING", description: "地域（関東, 関西, 中部, 九州, その他）" },
        { name: "registered_at", type: "DATETIME", description: "登録日時" }
      ],
      relations: [],
      sampleData: users
    },
    {
      name: "payments",
      description: "課金履歴",
      columns: [
        { name: "payment_id", type: "STRING", description: "課金ID（例: P000001）", isPrimaryKey: true },
        { name: "user_id", type: "STRING", description: "ユーザーID", isForeignKey: true },
        { name: "amount", type: "INTEGER", description: "課金額（円）" },
        { name: "payment_date", type: "DATETIME", description: "課金日時" }
      ],
      relations: [
        { fromColumn: "user_id", toTable: "users", toColumn: "user_id", type: "many-to-one" }
      ],
      sampleData: payments
    },
    {
      name: "events",
      description: "アプリ内行動ログ",
      columns: [
        { name: "event_id", type: "STRING", description: "イベントID（例: E0000001）", isPrimaryKey: true },
        { name: "user_id", type: "STRING", description: "ユーザーID", isForeignKey: true },
        { name: "event_type", type: "STRING", description: "イベント種別（app_open, view_content, add_to_cart, purchase, share）" },
        { name: "event_date", type: "DATETIME", description: "イベント発生日時" }
      ],
      relations: [
        { fromColumn: "user_id", toTable: "users", toColumn: "user_id", type: "many-to-one" }
      ],
      sampleData: events
    },
    {
      name: "ad_costs",
      description: "月別広告費用",
      columns: [
        { name: "id", type: "INTEGER", description: "レコードID", isPrimaryKey: true },
        { name: "month", type: "STRING", description: "月（YYYY-MM形式）" },
        { name: "ad_source", type: "STRING", description: "広告ソース" },
        { name: "campaign", type: "STRING", description: "キャンペーン名" },
        { name: "cost", type: "INTEGER", description: "広告費用（円）" }
      ],
      relations: [],
      sampleData: adCosts
    }
  ]
};

// 出力
const outputPath = path.join(__dirname, '../src/data/schema.json');
fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

console.log('Generated data:');
console.log(`  users: ${users.length} rows`);
console.log(`  payments: ${payments.length} rows`);
console.log(`  events: ${events.length} rows`);
console.log(`  ad_costs: ${adCosts.length} rows`);
console.log(`\nSaved to: ${outputPath}`);
