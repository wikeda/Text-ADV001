"use strict";

// 選択肢の描画と分岐
(function(global){
  function allowedWeirdIds(){
    const seen = StorageAPI.load().endingsSeen.length;
    let count = 0;
    if(seen >= 5) count = 7; else if(seen >= 3) count = 5; else if(seen >= 1) count = 3; else count = 0;
    const order = ["weird1","weird2","weird3","weird4","weird5","weird6","weird7"];
    return new Set(order.slice(0, count));
  }

  function basicRequirementsMet(requires){
    return (!requires || requires.length === 0) || requires.every(r => StorageAPI.hasFlag(r));
  }

  function renderChoices(choices){
    const el = document.getElementById("choices");
    el.innerHTML = "";

    const allowedWeirds = allowedWeirdIds();
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = choice.text;
      const basicOk = basicRequirementsMet(choice.requires);
      // if basic requirements not met -> show disabled (ヒントや失敗誘導のため)
      if(!basicOk){
        if(choice.lockedText){ btn.textContent = choice.lockedText; }
        btn.setAttribute("aria-disabled", "true");
        btn.addEventListener("click", () => {
          if(choice.failKey){ Game.registerFail(choice.failKey); }
        });
        el.appendChild(btn);
        return;
      }

      // weird route gating: if not allowed, hide entirely (do not append)
      if(choice.requiresWeird && !allowedWeirds.has(choice.requiresWeird)){
        return; // 非表示
      }

      {
        btn.addEventListener("click", () => handleChoice(choice));
        el.appendChild(btn);
      }
    });
  }

  function handleChoice(choice){
    if(choice.next.startsWith("end:")){
      const endingId = choice.next.slice(4);
      Endings.showEnding(endingId);
      return;
    }
    Game.goToScene(choice.next);
  }

  // エンディング連鎖：開放条件で選択肢を動的追加
  function withChainedChoices(baseChoices){
    const data = StorageAPI.load();
    const extra = [];

    // 不思議ルートの段階開放：1,3,5見たら 3,5,7解放
    const allowed = allowedWeirdIds();
    if(allowed.has("weird1")){
      extra.push({ text: "見慣れない横道へ入る", next: "weird_portal" });
    }

    return baseChoices.concat(extra);
  }

  global.Choices = { renderChoices, withChainedChoices };
})(window);
