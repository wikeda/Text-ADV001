# 失踪猫イレブンの謎

テキストアドベンチャーゲーム。千葉県浦安市を舞台に、双子のイチとナナが“イレブン”を探す分岐型ストーリー。

- GitHub Pages: https://wikeda.github.io/Text-ADV001/
- 対応: Chrome 推奨（PC/モバイル）
- 形式: 静的 HTML / CSS / JavaScript（ビルド不要）

## プレイのポイント
- 15種類のエンディング（トゥルー/ハッピー/バッド/不思議）
- 既読数に応じて不思議ルートを段階開放（0→0、1→3、3→5、5→7）
- エンディング画面は種別ごとにカラー演出、本文つき
- 見たエンディングが5個以上で、ヘッダーの「見たエンディング」をクリックすると既読一覧モーダルが開きます

## ローカルでの起動
ビルド不要です。クローン後、`index.html` をブラウザで開くだけで遊べます。

```
# 例（macOS/Linux）
open index.html
# 例（Windows）
start index.html
```

## ディレクトリ構成
```
/
├── index.html          # エントリ
├── css/
│   ├── style.css       # 基本スタイル
│   └── effects.css     # 演出用スタイル
├── js/
│   ├── game.js         # 描画・遷移・UI
│   ├── story.js        # シーン定義
│   ├── choices.js      # 選択肢描画・開放制御
│   ├── endings.js      # エンディング定義・表示
│   └── storage.js      # localStorage 管理
└── assets/
    └── fonts/          # フォント格納（ダミー .gitkeep）
```

## 開発メモ
- 物語進行は `js/story.js` の `scenes` で管理
- エンディング一覧は `js/endings.js`（`id`, `name`, `kind`, `text`）
- 不思議ルート開放は `js/choices.js` の `allowedWeirdIds()`
- 既読モーダルは `index.html` 内の `#seenModal` と `js/game.js` の `renderSeenList()`

## デプロイ（GitHub Pages）
- Settings > Pages > Source: `Deploy from a branch`、Branch: `main` / `/ (root)`
- 数分後、公開 URL でアクセス可能

## ライセンス
このリポジトリの内容は著作権者の許可なく再配布しないでください。
