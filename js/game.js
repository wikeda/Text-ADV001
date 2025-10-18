"use strict";

// ゲーム進行（描画・状態管理）
(function(global){
  const storyEl = () => document.getElementById("story");
  const choicesEl = () => document.getElementById("choices");
  const statusEl = () => document.getElementById("status");
  const seenModal = () => document.getElementById("seenModal");
  const seenListEl = () => document.getElementById("seenList");

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
    seenModal().hidden = false;
  }
  function hideSeenModal(){ seenModal().hidden = true; }

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

  global.Game = { init, goToScene, startNew, updateStatus, registerFail };
  window.addEventListener("DOMContentLoaded", init);
})(window);
