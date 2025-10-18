"use strict";

// シーン定義（最小構成のダミー物語）
(function(global){
  const scenes = {
    start: {
      id: "start",
      text: `
        <p>友人から突然メッセージが届く。「<span class="fx-emphasis">猫を探して欲しいんだ。3日以内に</span>」。
        双子の<strong>イチ</strong>と<strong>ナナ</strong>は顔を見合わせる。窓の外は、潮の匂いを含んだ夕暮れの風。</p>
        <p>イチは慎重に状況を整理し、ナナはすぐに動ける手順を口にする。<span class="fx-quiet">“イレブン”——額に11の印。
        手がかりは少ないが、ここから物語は始まる。</span></p>
        <p class="fx-quiet">舞台は千葉県浦安市の住宅街。最初の一歩はどこから？</p>
      `,
      choices(){
        return Choices.withChainedChoices([
          { text: "友人に詳しく話を聞く", next: "ask_friend" },
          { text: "家を出て近所を探す", next: "search_neighborhood" },
          { text: "掲示板で情報収集する", next: "bbs" },
        ]);
      }
    },

    ask_friend: {
      id: "ask_friend",
      text: `
        <p>玄関先で友人は早口に事情を語る。「イレブンは額に“11”の模様がある。最近は窓辺で外ばかり見ていた」
        置き餌は減り、夜になると短く鳴く癖がついたという。</p>
        <p>イチは首輪や生活圏の変化を確認。ナナはスマホで地図を開き、逃走経路と潜伏しそうなスポットをリストアップする。</p>
        <p class="fx-quiet">手がかりが集まり始めた。次の行動は？</p>
      `,
      choices: () => ([
        { text: "首輪のタグ情報を確認する", next: "tag" },
        { text: "近所のカメラ映像を確認", next: "cctv" },
        { text: "とにかく外へ出る", next: "search_neighborhood" },
        { text: "友人の言動を疑ってみる", next: "doubt_friend" },
      ])
    },

    tag: {
      id: "tag",
      text: `
        <p>タグには「ELEVEN」。金属の裏面には擦れたQRらしきパターンと、解像度の低い英数字列。
        かすれて読めない住所は、<span class="fx-quiet">研究施設の略称</span>にも見える。</p>
        <p>イチは紙に転写し、ナナはスキャンアプリを起動。<span class="fx-quiet">データの断片</span>が少しずつつながっていく。</p>
      `,
      onEnter(){ StorageAPI.setFlag("saw_tag"); },
      choices: () => ([
        { text: "研究所へ向かう", next: "lab_gate" },
        { text: "一旦、近所を探す", next: "search_neighborhood" },
        { text: "端末でタグをスキャンする", next: "scan_tag" },
      ])
    },

    cctv: {
      id: "cctv",
      text: `
        <p>商店街の店主が防犯カメラを見せてくれた。夜の画面に、<span class="fx-info">“11”の白い模様</span>が一瞬光る。
        影は看板の裏を抜け、東側の細い路地へ。</p>
        <p>イチは足音の間隔から移動速度を概算し、ナナは路地の地図を重ね合わせる。<span class="fx-quiet">逃げ道は二本に絞れそうだ。</span></p>
      `,
      onEnter(){ StorageAPI.setFlag("saw_cctv"); },
      choices: () => ([
        { text: "路地に入る", next: "alley" },
        { text: "商店街を広く探す", next: "shopping" },
      ])
    },

    search_neighborhood: {
      id: "search_neighborhood",
      text: `
        <p>住宅街は静か。風で転がるペットボトルが塀に当たり、小さな音を立てた。
        ベンチの下、駐輪場、塀の上——猫が通りそうな隙間を順に当たっていく。</p>
        <p>イチは足跡や毛の付着を探し、ナナは聞き込みを担当。<span class="fx-quiet">少しずつ、地図に印が増える。</span></p>
      `,
      choices: () => ([
        { text: "公園へ向かう", next: "park" },
        { text: "コンビニのあたり", next: "convenience" },
        { text: "急いで自転車で移動", next: "time_accident" },
      ])
    },

    bbs: {
      id: "bbs",
      text: `
        <p>掲示板には「迷い猫」の投稿がいくつか。写真の撮影日時、影の向き、床材の質感——
        イチは写り込んだ情報から場所の手掛かりを抽出し、ナナは投稿者へ並行して連絡を取る。</p>
        <p class="fx-quiet">“海外で保護された猫が似ている”という情報も。真偽は未確定だが、網は広げておこう。</p>
      `,
      choices: () => ([
        { text: "投稿者に連絡する", next: "contact_poster" },
        { text: "別の手段を試す", next: "search_neighborhood" },
      ])
    },

    contact_poster: {
      id: "contact_poster",
      text: `
        <p>返信にはいくつかの情報の断片。位置を示すような記号や、見覚えのない施設名らしき単語が混じっている。</p>
        <p class="fx-quiet">確度は不明だが、遠くに目を向ける選択肢も見えてきた。</p>
      `,
      choices: () => ([
        { text: "遠方の手掛かりを追う", next: "end:happy4" },
        { text: "現実的に近所を探す", next: "search_neighborhood" },
      ])
    },

    park: {
      id: "park",
      text: `
        <p>砂場に小さな足跡。肉球の跡はマンホールへ向かって並び、途中で一度だけ戻っている。
        イチは指で測り、ナナはスマホで拡大して撮影。<span class="fx-quiet">何かを確かめた形跡だ。</span></p>
      `,
      choices: () => ([
        { text: "マンホールの中を調べる", next: "maze" },
        { text: "足跡を別方向に辿る", next: "alley" },
        { text: "茂みの鳴き声を待つ", next: "kittens_den" },
      ])
    },

    convenience: {
      id: "convenience",
      text: `<p>コンビニの自動ドアが開くたび、涼しい風が路上へ吹き出す。ゴミ箱の陰には猫の毛が数本。
      レジ横のおでん鍋から漂う匂いに、誰かが引き寄せられても不思議ではない。</p>`,
      choices: () => ([
        { text: "この場で粘る", next: "end:bad1" },
        { text: "別の場所へ移動", next: "search_neighborhood" },
        { text: "餌を置いて様子を見る", next: "bait" },
      ])
    },

    alley: {
      id: "alley",
      text: `<p>細い路地。生乾きの洗濯物から柔軟剤の匂いがした。先で黒い影が一瞬動き、塀の上で止まる。
      こちらの呼吸が伝わらないよう、イチは歩幅を短く、ナナは足先で小石を押し出す。</p>`,
      choices: () => ([
        { text: "勢いで距離を詰める", next: "end:bad3" },
        { text: "静かに近づく", next: "catch" },
      ])
    },

    catch: {
      id: "catch",
      text: `<p>すぐそばに気配。焦らず動けば、いずれ保護できそうだ。</p>
      <p class="fx-quiet">次の一手で、流れが決まる。</p>`,
      choices: () => ([
        { text: "まずは依頼人の元へ", next: "end:happy1" },
        { text: "痩せた体を気遣いエサを買う", next: "convenience" },
        { text: "病院へ連れていく", next: "hospital" },
      ])
    },

    maze: {
      id: "maze",
      text: `<p>地下の通路に降りると、冷えた空気が漂っていた。壁面のマーキングは古く、
      数字にも矢印にも見える記号が重なっている。</p>
      <p class="fx-quiet">足音が少し遅れて返ってくる。進むべきか、戻るべきか。</p>`,
      choices: () => ([
        { text: "さらに奥へ進む", next: "end:weird5", requiresWeird: "weird5", lockedText: "（今は決断できない）" },
        { text: "引き返す", next: "park" },
      ])
    },

    lab: {
      id: "lab",
      text: `<p>警備は緩いが、入口には電子錠。入退室の形跡がところどころ残っている。</p>
      <p class="fx-quiet">焦らず、やるべき手順をひとつずつ。</p>`,
      choices: () => ([
        { text: "落ち着いて手順を踏む", next: "end:true" },
        { text: "勢いで押し切る", next: "end:weird4", requiresWeird: "weird4", lockedText: "（今は決断できない）" },
        { text: "謎の部品を発見し解析", next: "scan_tag" },
      ])
    },

    shopping: {
      id: "shopping",
      text: `<p>商店街を広く探すうち、よく似た猫を見かけた。近づくと、記憶の印象とどこかが合わない気がする。</p>
      <p class="fx-quiet">ここで判断するか、いったん合流して確かめるか。</p>`,
      choices: () => ([
        { text: "違和感を優先する", next: "end:bad2" },
        { text: "一度合流して確かめる", next: "end:happy1" },
      ])
    },

    weird_portal: {
      id: "weird_portal",
      text: `<p>細い横道は想像よりも奥行きがあり、空気の温度が少し違って感じられた。</p>
      <p class="fx-quiet">行き止まりかと思いきや、何かの気配がする。</p>`,
      choices: () => ([
        { text: "流れに身を任せる", next: "end:weird1", requiresWeird: "weird1", lockedText: "（今は決断できない）" },
        { text: "逃げる", next: "start" },
      ])
    },

    // 追加シーン：エンディング到達ルート拡張
    scan_tag: {
      id: "scan_tag",
      text: `<p>タグから微弱な信号が拾える。意味のわからない数列や断片的な記録が混じっている。</p>
      <p class="fx-quiet">扱い方ひとつで、状況は大きく変わりそうだ。</p>`,
      onEnter(){ StorageAPI.setFlag("scanned_tag"); },
      choices: () => ([
        { text: "ここで手を離す", next: "end:weird2", requiresWeird: "weird2", lockedText: "（今は決断できない）" },
        { text: "更に深掘りし研究所を調査", next: "lab_gate" },
      ])
    },

    doubt_friend: {
      id: "doubt_friend",
      text: `<p>友人の証言の中に、小さな齟齬がいくつか見つかる。</p>
      <p class="fx-quiet">今は追及すべきか、それとも別の角度から探るべきか。</p>`,
      choices: () => ([
        { text: "友人を問い詰める", next: "trap" },
        { text: "泳がせて別ルートで探る", next: "bbs" },
      ])
    },

    trap: {
      id: "trap",
      text: `<p>空気が変わる。足音、鍵のかかる音——胸の奥に違和感が走った。</p>
      <p class="fx-quiet">ここで踏み込むか、距離を取るか。</p>`,
      choices: () => ([
        { text: "深入りをやめる", next: "end:weird3", requiresWeird: "weird3", lockedText: "（今は決断できない）" },
        { text: "黒幕を追う", next: "cctv" },
      ])
    },

    time_accident: {
      id: "time_accident",
      text: `<p>焦って踏み出した瞬間、視界が白く弾けた。音が遠くなる。</p>
      <p class="fx-quiet">この感覚をどう受け止める？</p>`,
      choices: () => ([
        { text: "嫌な既視感を受け入れる", next: "end:weird6", requiresWeird: "weird6", lockedText: "（今は決断できない）" },
        { text: "デジャヴを感じつつ続行", next: "start" },
      ])
    },

    hospital: {
      id: "hospital",
      text: `<p>検査の説明は専門的で、判断を迫られる場面も多い。</p>
      <p class="fx-quiet">どこまで踏み込むのか、気持ちを整える必要がある。</p>`,
      choices: () => ([
        { text: "腹を括って挑む", next: "end:weird7", requiresWeird: "weird7", lockedText: "（今は決断できない）" },
        { text: "現実に戻る", next: "start" },
      ])
    },

    bait: {
      id: "bait",
      text: `<p>店の人も協力してくれるという。餌を置いて、状況を見守ることにした。</p>
      <p class="fx-quiet">結果はすぐには出ない。連絡を待とう。</p>`,
      choices: () => ([
        { text: "連絡を待つ", next: "end:happy2" },
        { text: "別ルートも追う", next: "search_neighborhood" },
      ])
    },

    kittens_den: {
      id: "kittens_den",
      text: `<p>茂みの奥で、小さく短い鳴き声が続いている。風が止むと、影が増えたようにも見えた。</p>
      <p class="fx-quiet">ここで動くべきか、少し間を置くべきか。</p>`,
      choices: () => ([
        { text: "成り行きを見守る", next: "end:happy3" },
        { text: "保護の段取りをする", next: "catch" },
      ])
    },

    // 研究所の入口：手がかりを揃えて突破する小パズル
    lab_gate: {
      id: "lab_gate",
      text: `
        <p>研究施設の裏手。電子錠は4桁コードとNFCの二段階。周囲にはカメラとセンサー。</p>
        <p>イチは配線の癖と入退室ログの痕跡を読み、ナナは収集済みの手掛かりを照らし合わせる。</p>
        <p class="fx-quiet">正面突破は危険。だが、<em>鍵</em>は既にどこかで見ているはず——。</p>
      `,
      choices: () => {
        const hint = StorageAPI.getFail("lab_access") >= 1 ? [
          { text: "ヒント：タグのスキャンで何かがわかる", next: "scan_tag" },
          { text: "ヒント：カメラ映像の路地方向", next: "cctv" },
        ] : [];
        return [
          { text: "正面ドア（要：タグ解析と映像確認）", next: "lab", requires: ["scanned_tag","saw_cctv"], lockedText: "正面ドア（鍵の情報が足りない）", failKey: "lab_access" },
          { text: "サービス通路（要：タグ解析）", next: "lab", requires: ["scanned_tag"], lockedText: "サービス通路（合鍵がない）", failKey: "lab_access" },
          { text: "無理やりこじ開ける", next: "end:weird4", requiresWeird: "weird4", lockedText: "（今は決断できない）" },
          ...hint,
          { text: "一旦引き返す", next: "search_neighborhood" },
        ];
      }
    },
  };

  function getScene(id){ return scenes[id]; }

  global.Story = { getScene };
})(window);
