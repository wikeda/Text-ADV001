"use strict";

// ゲーム進行（描画・状態管理）
(function(global){
  const storyEl = () => document.getElementById("story");
  const choicesEl = () => document.getElementById("choices");
  const statusEl = () => document.getElementById("status");
  const seenModal = () => document.getElementById("seenModal");
  const seenListEl = () => document.getElementById("seenList");
  const completionBannerEl = () => document.getElementById("completionBanner");
  const shareXBtn = () => document.getElementById("shareXBtn");

  function renderScene(sceneId){
    const scene = Story.getScene(sceneId);
    if(!scene){
      storyEl().innerHTML = `<p class="fx-warn">不明なシーン: ${sceneId}</p>`;
      choicesEl().innerHTML = "";
      return;
    }

    // 保存（戻る機能はなし。現在位置のみ保存）
    StorageAPI.setScene(scene.id);
    // 通常シーンではエンディング演出を解除
    document.body.classList.remove("ending-mode","ending-type-true","ending-type-happy","ending-type-bad","ending-type-weird");

    // onEnterフック（フラグ付与など）
    try{ if(typeof scene.onEnter === "function"){ scene.onEnter(); } }catch(e){ console.warn(e); }

    storyEl().classList.remove("fade-in");
    // 次フレームで付与してアニメ再生
    requestAnimationFrame(() => storyEl().classList.add("fade-in"));
    storyEl().innerHTML = scene.text;
    Choices.renderChoices(scene.choices());
    updateStatus();
  }

  function goToScene(sceneId){ renderScene(sceneId); }

  function startNew(){
    // 進行は初期化、エンディング履歴は保持（連鎖機能のため）
    const saved = StorageAPI.load();
    StorageAPI.save({ currentSceneId: "start", endingsSeen: saved.endingsSeen || [] });
    renderScene("start");
  }

  function resume(){
    const data = StorageAPI.load();
    renderScene(data.currentSceneId || "start");
  }

  function updateStatus(){
    const d = StorageAPI.load();
    const seen = d.endingsSeen.length;
    const el = statusEl();
    el.textContent = `見たエンディング: ${seen} / 15`;
    if(seen >= 5){
      el.classList.add("clickable");
    }else{
      el.classList.remove("clickable");
    }
  }

  function bindUI(){
    const restartBtn = document.getElementById("restartBtn");
    restartBtn.addEventListener("click", () => startNew());

    const clearBtn = document.getElementById("clearSaveBtn");
    if(clearBtn){
      clearBtn.addEventListener("click", () => {
        const ok = confirm("セーブデータを削除します。よろしいですか？");
        if(!ok) return;
        StorageAPI.clearAll();
        startNew();
        updateStatus();
      });
    }

    // Status click -> open modal when >=5 seen
    statusEl().addEventListener("click", () => {
      const seen = StorageAPI.load().endingsSeen.length;
      if(seen >= 5){ showSeenModal(); }
    });

    // Modal close behaviors
    const closeBtn = document.getElementById("modalCloseBtn");
    if(closeBtn){ closeBtn.addEventListener("click", hideSeenModal); }
    seenModal().addEventListener("click", (e) => {
      if(e.target === seenModal()) hideSeenModal();
    });
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && !seenModal().hidden){ hideSeenModal(); }
    });

    // Share to X: use Web Share if available, otherwise open intent URL
    if(shareXBtn()){
      shareXBtn().addEventListener('click', async () => {
        const d = StorageAPI.load();
        const seen = d.endingsSeen.length;
        const all = seen === 15 || StorageAPI.hasFlag('allCleared');
        const title = document.getElementById('game-title')?.textContent || '失踪猫イレブンの謎';
        const text = `${title} 既読エンディング ${seen}/15${all ? ' コンプリート！' : ''}`;
        const url = 'https://wikeda.github.io/Text-ADV001/';
        if(navigator.share){
          try{ await navigator.share({ text, url }); return; }catch(err){ /* fallback */ }
        }
        const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(intent, '_blank', 'noopener');
      });
    }
  }

  function renderSeenList(){
    const data = StorageAPI.load();
    const seenSet = new Set(data.endingsSeen || []);
    const order = [
      "true",
      "happy1","happy2","happy3","happy4",
      "bad1","bad2","bad3",
      "weird1","weird2","weird3","weird4","weird5","weird6","weird7",
    ];
    const label = (id) => {
      if(id === "true") return "True1";
      return id; // happy1/bad1/weird1...
    };

    const list = seenListEl();
    list.innerHTML = "";

    order.forEach(id => {
      const meta = (window.Endings && Endings.getEndingMeta) ? Endings.getEndingMeta(id) : { id, name: id, kind: "" };
      const li = document.createElement("li");
      const name = seenSet.has(id) ? meta.name : "-------";
      li.innerHTML = `
        <div class="seen-id">${label(id)}:</div>
        <div class="seen-name ${seenSet.has(id) ? "" : "placeholder"}">${name}</div>
      `;
      list.appendChild(li);
    });
  }

  function showSeenModal(){
    renderSeenList();
    // Toggle completion banner strictly by current count (avoid stale flag)
    try{
      const seen = (StorageAPI.load().endingsSeen || []).length;
      if(completionBannerEl()) completionBannerEl().hidden = (seen !== 15);
    }catch(e){ /* noop */ }
    // Update share intent URL attribute for progressive enhancement
    try{
      const d = StorageAPI.load();
      const seen = d.endingsSeen.length;
      const all = seen === 15; // 表示は現在数で判断
      const title = document.getElementById('game-title')?.textContent || '失踪猫イレブンの謎';
      const text = `${title} 既読エンディング ${seen}/15${all ? ' コンプリート！' : ''}`;
      const url = 'https://wikeda.github.io/Text-ADV001/';
      const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      if(shareXBtn()) shareXBtn().setAttribute('data-share-url', intent);
    }catch(e){ /* noop */ }
    seenModal().hidden = false;
  }
  function hideSeenModal(){ seenModal().hidden = true; }

  // Confetti animation (lightweight)
  function runConfetti(durationMs = 3000){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce) return;
    const c = document.createElement('canvas');
    c.id = 'confettiCanvas';
    Object.assign(c.style, { position:'fixed', inset:'0', width:'100%', height:'100%', pointerEvents:'none', zIndex: 60 });
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    function resize(){ c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
    resize();
    const colors = ['#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6'];
    const N = Math.min(180, Math.floor((innerWidth*innerHeight)/12000));
    const parts = Array.from({length:N}).map(()=>({
      x: Math.random()*c.width,
      y: -Math.random()*c.height,
      vx: (Math.random()-0.5)*0.6*dpr,
      vy: (Math.random()*1.5+0.8)*dpr,
      size: (Math.random()*3+2)*dpr,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-0.5)*0.2
    }));
    let start = performance.now();
    function tick(t){
      const dt = Math.min(33, t-(start||t)); start = t;
      ctx.clearRect(0,0,c.width,c.height);
      parts.forEach(p=>{
        p.x += p.vx*dt*0.06; p.y += p.vy*dt*0.06; p.rot += p.vr*dt*0.06;
        if(p.y > c.height) { p.y = -10; p.x = Math.random()*c.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        ctx.restore();
      });
      if(t - parts[0].t0 < durationMs){
        raf = requestAnimationFrame(tick);
      }
    }
    let raf = requestAnimationFrame(tick);
    setTimeout(()=>{ cancelAnimationFrame(raf); c.remove(); }, durationMs+400);
    window.addEventListener('resize', resize, { once: true });
  }

  function showCompletion(){
    // show banner in modal and confetti
    if(completionBannerEl()){ completionBannerEl().hidden = false; }
    runConfetti(3000);
    showSeenModal();
  }

  function init(){
    bindUI();
    // 既存の進行があれば再開、なければ新規開始
    const hasSave = (StorageAPI.load()?.currentSceneId) !== undefined;
    if(hasSave){
      resume();
    }else{
      startNew();
    }
  }

  function registerFail(key){
    StorageAPI.incFail(key);
    const current = StorageAPI.load().currentSceneId || "start";
    renderScene(current);
  }

  global.Game = { init, goToScene, startNew, updateStatus, registerFail, showCompletion };
  window.addEventListener("DOMContentLoaded", init);
})(window);
