# n8n ワークフロー修正ガイド - バイナリデータの受け渡し

## 問題
写真がSlackにアップロードされない原因は、Codeノードがバイナリデータを次のノードに渡していないためです。

## 修正が必要なノード（3つ）

### 1. 画像解析 (Claude Vision) ノード

**現在のreturn文（最後の部分）:**
```javascript
return {
  content: [
    {
      text: analysis,
      type: 'text'
    }
  ],
  id: 'msg_' + Math.random().toString(36).substr(2, 9),
  model: 'claude-3-sonnet-20240229',
  role: 'assistant',
  stop_reason: 'end_turn',
  stop_sequence: null,
  type: 'message',
  usage: {
    input_tokens: 100,
    output_tokens: 50
  }
};
```

**修正後:**
```javascript
return {
  json: {
    content: [
      {
        text: analysis,
        type: 'text'
      }
    ],
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    model: 'claude-3-sonnet-20240229',
    role: 'assistant',
    stop_reason: 'end_turn',
    stop_sequence: null,
    type: 'message',
    usage: {
      input_tokens: 100,
      output_tokens: 50
    }
  },
  // バイナリデータを次のノードに渡す
  binary: $input.item.binary
};
```

### 2. キャッチフレーズ生成 ノード

**現在のreturn文:**
```javascript
return {
  content: [
    {
      text: catchphrase,
      type: 'text'
    }
  ]
};
```

**修正後:**
```javascript
return {
  json: {
    content: [
      {
        text: catchphrase,
        type: 'text'
      }
    ]
  },
  // バイナリデータを次のノードに渡す
  binary: $input.item.binary
};
```

### 3. 説明文生成 ノード

**現在のreturn文:**
```javascript
return {
  content: [
    {
      text: description,
      type: 'text'
    }
  ]
};
```

**修正後:**
```javascript
return {
  json: {
    content: [
      {
        text: description,
        type: 'text'
      }
    ]
  },
  // バイナリデータを次のノードに渡す
  binary: $input.item.binary
};
```

## 重要なポイント

1. **データ構造**: n8nでは `{json: {...}, binary: {...}}` という構造でデータを渡す必要があります
2. **$input.item.binary**: 前のノードから受け取ったバイナリデータを参照します
3. **すべてのCodeノード**: フローの中のすべてのCodeノードで同じ修正が必要です

## 修正手順

1. n8nのワークフローエディタを開く
2. 各Codeノード（紫色）をダブルクリック
3. コードの最後の`return`文を上記の修正後のコードに置き換える
4. 3つのノードすべてで同じ修正を行う
5. ワークフローを保存
6. テスト実行して写真がアップロードされることを確認

これで写真が正しくSlackにアップロードされるようになります！ 📸 