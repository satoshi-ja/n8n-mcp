// フォームデータの取得
const formData = $('Form Trigger').item.json;
const imageAnalysis = $('画像解析 (Claude Vision)').item.json.content[0].text;
const catchphrase = $('キャッチフレーズ生成').item.json.content[0].text;
const description = $('説明文生成').item.json.content[0].text;

// カテゴリに応じた装飾の選択
let decoration = {};
switch(formData.カテゴリ) {
  case 'コーヒー ☕':
    decoration = {
      mainEmoji: '☕',
      subEmojis: ['✨', '⭐'],
      borderStyle: '━━━━━━━━━━━━━━━━━━━━'
    };
    break;
  case 'ティー 🍵':
    decoration = {
      mainEmoji: '🍵',
      subEmojis: ['🌸', '🍃'],
      borderStyle: '～～～～～～～～～～～～～～～'
    };
    break;
  case 'スイーツ 🧁':
    decoration = {
      mainEmoji: '🧁',
      subEmojis: ['🎉', '💕'],
      borderStyle: '🌈 ═══════════════ 🌈'
    };
    break;
  case '軽食 🥪':
    decoration = {
      mainEmoji: '🥪',
      subEmojis: ['🌿', '🥗'],
      borderStyle: '◆◇◆◇◆◇◆◇◆◇◆◇◆◇◆'
    };
    break;
}

// 現在時刻の取得
const now = new Date();
const hours = now.getHours();
let timeGreeting = '';
if (hours < 12) {
  timeGreeting = 'おはようございます！朝の';
} else if (hours < 17) {
  timeGreeting = 'こんにちは！午後の';
} else {
  timeGreeting = 'お疲れ様です！夕方の';
}

// Slack投稿メッセージの組み立て (Slackのマークアップ形式)
const slackMessage = `
┌─────────────────────┐
│  ${decoration.mainEmoji} 本日のSpecial ${decoration.mainEmoji}  │
└─────────────────────┘

${decoration.subEmojis[0]} *${catchphrase}* ${decoration.subEmojis[0]}

${description}

${decoration.borderStyle}
📍 場所: 3F カフェコーナー
💰 価格: ${formData.価格}円
⏰ 提供時間: ${hours < 15 ? '14:00-17:00' : '15:00-18:00'}
${decoration.borderStyle}

🎯 ${timeGreeting}ひととき、
${decoration.mainEmoji} でほっと一息つきませんか？

#社内カフェ #今日のオススメ #${formData.カテゴリ.replace(' ', '')}
`;

// 重要: Form Triggerからのバイナリデータを確実に渡す
// Form Triggerのバイナリデータの構造を正しく参照
const binaryData = $('Form Trigger').item.binary;

// 結果を返す（バイナリデータを含む完全なitemを返す）
return {
  json: {
    slackMessage: slackMessage,
    menuName: formData.メニュー名,
    price: formData.価格,
    category: formData.カテゴリ,
    decoration: decoration
  },
  binary: binaryData
};