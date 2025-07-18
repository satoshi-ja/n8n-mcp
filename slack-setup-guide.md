# Slack Access Token設定ガイド

## 1. Slack Appの権限設定

Slack APIダッシュボード（https://api.slack.com/apps）で以下の権限を設定：

### Bot Token Scopes（必須）:
- `chat:write` - メッセージの投稿
- `channels:read` - チャンネル一覧の取得
- `chat:write.public` - パブリックチャンネルへの投稿（任意）

## 2. Bot Tokenの取得

1. 「OAuth & Permissions」ページへ移動
2. 「Bot User OAuth Token」をコピー（xoxb-で始まる）

## 3. n8nでの設定

1. Slackノードで「Create New Credential」
2. 「Access Token」タイプを選択
3. Bot Tokenを貼り付けて保存

## トラブルシューティング

- トークンが無効な場合は、Slackアプリを再インストール
- チャンネルが表示されない場合は、Botをチャンネルに招待
  - Slackで: `/invite @your-bot-name`

# Slackカフェメニュー自動投稿ワークフロー - 写真アップロード問題の修正ガイド

## 問題の概要
写真がSlackにアップロードされない問題が発生しています。原因は以下の2点です：

1. **Slack投稿構築ノード**: バイナリデータが正しく次のノードに渡されていない
2. **写真アップロードノード**: 設定が不完全（チャンネルIDがない、binaryPropertyNameが間違っている）

## 修正手順

### 1. Slack投稿構築ノードのコード修正

現在のコードの最後の部分：
```javascript
// 結果を返す（バイナリデータも含める）
return {
  slackMessage: slackMessage,
  menuName: formData.メニュー名,
  price: formData.価格,
  category: formData.カテゴリ,
  decoration: decoration,
  // Form Triggerからのバイナリデータを保持
  binary: $('Form Trigger').item.binary
};
```

修正後のコード：
```javascript
// 重要: Form Triggerからのバイナリデータを確実に渡す
// バイナリデータは前のノードから引き継ぐ
const binaryData = $input.item.binary;

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
```

### 2. 写真アップロードノードの設定修正

現在の設定：
- Resource: `file`
- Binary Property Name: `写真`
- Channel ID: なし

修正後の設定：
- Resource: `file`
- Binary Property Name: `data`
- Channel ID: `C096CHYL9U2` (tam-and-co)

## n8nでの修正方法

1. ワークフローエディタを開く
2. **Slack投稿構築**ノードをダブルクリック
3. コードエディタ内の最後の部分を上記の修正後のコードに置き換える
4. 保存して閉じる
5. **写真アップロード**ノードをダブルクリック
6. 以下の設定を行う：
   - Binary Property Name を `data` に変更
   - Select a channel でtam-and-coチャンネルを選択
7. 保存してワークフローを保存

## テスト方法

1. テストモードでフォームを開く（Form TriggerのTest URLを使用）
2. すべてのフィールドを入力し、写真をアップロード
3. フォームを送信
4. Slackのtam-and-coチャンネルで以下を確認：
   - テキストメッセージが投稿されている
   - 同じチャンネルに写真が投稿されている

## トラブルシューティング

### エラー：「No binary data found」
- Slack投稿構築ノードでバイナリデータが正しく渡されているか確認
- `$input.item.binary` を使用しているか確認

### エラー：「Invalid channel」
- 写真アップロードノードのChannel IDが設定されているか確認
- チャンネルIDが正しいか確認（C096CHYL9U2）

### 写真が別のチャンネルに投稿される
- 両方のSlackノード（Slack投稿と写真アップロード）が同じチャンネルIDを使用しているか確認

## n8nのバイナリデータについて

n8nでは、ファイルアップロードのバイナリデータは通常`data`というプロパティ名で格納されます。Form Triggerで受け取った写真は：
- JSONデータ: フォームフィールドの値
- バイナリデータ: `data`プロパティに格納された写真ファイル

各ノードでバイナリデータを渡す際は、`binary`オブジェクトごと渡す必要があります。