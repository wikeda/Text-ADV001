"use strict";

// エンディング定義と表示
(function(global){
  const endings = [
    {
      id: "true", name: "真実の結末", kind: "トゥルー",
      text: `
        <p>イチとナナは研究所の記録から、<strong>帰巣本能を埋め込まれたクローン猫「イレブン」</strong>の真実に辿り着く。
        仕組まれた誘導信号、隠された実験ログ。二人は証拠を押さえ、友人と共に公にした。</p>
        <p>夕暮れの住宅街で、イレブンは小さく喉を鳴らす。<em>「戻る場所は、もうここでいい」</em>——
        風が優しく頬を撫で、長い一日が静かに終わった。</p>
      `
    },
    {
      id: "happy1", name: "普通の発見", kind: "ハッピー",
      text: `
        <p>慎重な聞き込みと地道な探索の末、物置の影で怯えるイレブンを発見。
        無事に友人へ引き渡すことができた。</p>
        <p>ただ、<span class="fx-quiet">なぜ逃げたのか</span>は謎のまま。
        二人はいつか真相に届くと信じて、静かに手を振った。</p>
      `
    },
    {
      id: "happy2", name: "太った猫の帰還", kind: "ハッピー",
      text: `
        <p>翌朝、近所の人から連絡。<strong>ものすごく太ったイレブン</strong>がドヤ顔で帰還！
        コンビニ裏で皆に可愛がられていたらしい。</p>
        <p>原因はわからないけれど、幸せそうならそれでいい——
        ふっくらボディを撫でながら、みんなで大笑いした。</p>
      `
    },
    {
      id: "happy3", name: "子猫連れ", kind: "ハッピー",
      text: `
        <p>茂みの奥から現れたのは、<strong>子猫を五匹連れたイレブン</strong>。
        守るべきものができたから戻れなかった——そう語るように。</p>
        <p>段ボールの寝床、ミルクの香り、かすかな寝息。ここに新しい家族が生まれた。</p>
      `
    },
    {
      id: "happy4", name: "海外発見", kind: "ハッピー",
      text: `
        <p>ネットの投稿を辿ると、海の向こうの保護施設で“11”模様の猫が見つかったという。
        長い旅路を経て再会を果たす。</p>
        <p>空港で撮った一枚の写真。<span class="fx-quiet">どうしてそこへ行ったのか</span>は謎のまま——でも笑顔は同じだった。</p>
      `
    },
    {
      id: "bad1", name: "見つからない", kind: "バッド",
      text: `
        <p>ポスターは雨に濡れて色褪せ、張り直しても風に剝がれる。
        足取りは途切れ、空白だけが日々を埋めた。</p>
        <p>それでも二人は諦めない。<em>「また明日、探そう」</em>——同じ言葉を何度も交わしながら。</p>
      `
    },
    {
      id: "bad2", name: "変質した猫", kind: "バッド",
      text: `
        <p>見つけた猫は確かに“11”模様。けれど瞳の奥は冷たく、寄り添えば牙が覗いた。
        友人の腕の中でも落ち着かない。</p>
        <p><span class="fx-warn">——この子は本当にイレブンなのか。</span> 背筋を撫でるざわめきだけが、答えの代わりに残った。</p>
      `
    },
    {
      id: "bad3", name: "再び逃げる", kind: "バッド",
      text: `
        <p>やっと手が届いた、その瞬間。首輪が指から滑り、闇に溶けた影。
        追い風は遠ざかる足音をさらに加速させた。</p>
        <p>残ったのは、夜更けの白い吐息と悔しさだけ。</p>
      `
    },
    {
      id: "weird1", name: "そして大阪へ", kind: "不思議",
      text: `
        <p>路地の先は小劇場。気づけばイチとナナは舞台に立ち、<strong>漫才ユニット「イチナナ」</strong>として拍手喝采。</p>
        <p>猫の話？ それはまた別のステージで。鳴り止まない笑い声がカーテンコールを包む。</p>
      `
    },
    {
      id: "weird2", name: "機械の猫", kind: "不思議",
      text: `
        <p>タグの信号は機械仕掛けの心臓へと続く。イレブンは<strong>監視用機械猫</strong>、
        追っていたのは敵国のスパイ猫だった。</p>
        <p>ハックと機転でスパイを退けると、機械猫は静かに去った。<em>「ありがとう。自由は自分で選ぶ」</em></p>
      `
    },
    {
      id: "weird3", name: "友人の罠", kind: "不思議",
      text: `
        <p>事件は最初から仕掛けられていた。猫は囮、真の狙いは双子。
        罠が閉じる瞬間、互いの背中を預け合い突破する。</p>
        <p>黒幕は闇に溶けたが、もう惑わされない。<span class="fx-quiet">道は自分たちで選ぶ。</span></p>
      `
    },
    {
      id: "weird4", name: "強敵を求めて", kind: "不思議",
      text: `
        <p>現れた強敵。走り込み、受け身、スパーリング——<strong>モンタージュの先</strong>で勝利の拳を突き上げる。</p>
        <p>エンドロールが始まる。猫のことは……まあ、いったん置いておこう。</p>
      `
    },
    {
      id: "weird5", name: "地下迷宮", kind: "不思議",
      text: `
        <p>地下の通路は分かれ、戻るほどに深くなる。足音は自分のものか、それとも。</p>
        <p>時は薄片となって剝がれ落ち、方角は意味を失う。<em>出口は、まだ見つからない。</em></p>
      `
    },
    {
      id: "weird6", name: "タイムリープ", kind: "不思議",
      text: `
        <p>閃光ののち、最初の依頼に戻る。文面も声色も同じなのに、
        机の上の傷だけが少し違って見えた。</p>
        <p>二人は頷く。<span class="fx-info">必ずループを断ち切る</span>——そう決めた目の前で、また通知音が鳴る。</p>
      `
    },
    {
      id: "weird7", name: "派閥争い", kind: "不思議",
      text: `
        <p>病を知り、助けたいと願った。道は遠く、白衣は重い。
        それでも幾年ののち、手術灯の下に命を繋げた。</p>
        <p>病棟の駆け引きも、派閥のしがらみも越えて。<em>君が生きている</em>——それだけで十分だった。</p>
      `
    },
  ];

  function getEndingMeta(id){
    return endings.find(e => e.id === id) || { id, name: id, kind: "" };
  }

  function showEnding(endingId){
    const storyEl = document.getElementById("story");
    const choicesEl = document.getElementById("choices");
    const meta = getEndingMeta(endingId);

    // 記録（エンディング連鎖用）
    const data = StorageAPI.addEnding(endingId);

    // エンディング演出モード + 種別クラス付与
    const typeMap = { "トゥルー": "true", "ハッピー": "happy", "バッド": "bad", "不思議": "weird" };
    const typeKey = typeMap[meta.kind] || (endingId.startsWith("weird") ? "weird" : "");
    document.body.classList.add("ending-mode");
    ["ending-type-true","ending-type-happy","ending-type-bad","ending-type-weird"].forEach(c => document.body.classList.remove(c));
    if(typeKey){ document.body.classList.add(`ending-type-${typeKey}`); }
    storyEl.classList.add("fade-in");
    storyEl.innerHTML = `
      <div class="ending">
        <div class="ending-badge">Ending：<span class="fx-mono">${meta.id}</span></div>
        <h2 class="fx-big">${meta.name}</h2>
        <div class="ending-body">${meta.text || ""}</div>
      </div>
    `;

    choicesEl.innerHTML = "";
    const btn = document.createElement("button");
    btn.textContent = "タイトルへ（最初から）";
    btn.addEventListener("click", () => {
      Game.startNew();
    });
    choicesEl.appendChild(btn);

    Game.updateStatus();
  }

  global.Endings = { list: endings, showEnding, getEndingMeta };
})(window);
