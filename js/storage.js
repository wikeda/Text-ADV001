"use strict";

// ローカルストレージ管理
(function(global){
  const STORAGE_KEY = "text-adv001";

  function defaultData(){
    return {
      currentSceneId: "start",
      endingsSeen: [], // e.g. ["true", "happy1", ...]
      flags: {},       // e.g. { tag_scanned: true }
      fails: {}        // e.g. { lab_access: 1 }
    };
  }

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw){ return defaultData(); }
      const data = JSON.parse(raw);
      // merge defaults
      return Object.assign(defaultData(), data);
    }catch(e){
      console.warn("storage.load error", e);
      return defaultData();
    }
  }

  function save(data){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }catch(e){
      console.warn("storage.save error", e);
    }
  }

  function clearAll(){
    try{ localStorage.removeItem(STORAGE_KEY); }
    catch(e){ console.warn("storage.clear error", e); }
  }

  function addEnding(endingId){
    const data = load();
    if(!data.endingsSeen.includes(endingId)){
      data.endingsSeen.push(endingId);
      save(data);
    }
    return data;
  }

  function setScene(sceneId){
    const data = load();
    data.currentSceneId = sceneId;
    save(data);
    return data;
  }

  function setFlag(name, value=true){
    const data = load();
    data.flags = data.flags || {};
    data.flags[name] = value;
    save(data);
    return data;
  }

  function hasFlag(name){
    const data = load();
    return !!(data.flags && data.flags[name]);
  }

  function incFail(key){
    const data = load();
    data.fails = data.fails || {};
    data.fails[key] = (data.fails[key]||0) + 1;
    save(data);
    return data.fails[key];
  }

  function getFail(key){
    const data = load();
    return (data.fails && data.fails[key]) || 0;
  }

  global.StorageAPI = {
    load,
    save,
    clearAll,
    addEnding,
    setScene,
    setFlag,
    hasFlag,
    incFail,
    getFail,
    STORAGE_KEY
  };
})(window);
