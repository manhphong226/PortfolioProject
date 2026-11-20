/* =========================================================
   Trang quản trị: nhập liệu, xem trước, lưu nháp, xuất bản
   ========================================================= */
(function () {
  "use strict";

  var DB_NAME = "portfolio-editor";
  var DB_STORE = "drafts";
  var DB_KEY = "current";
  var LS_KEY = "portfolio.editor.draft";

  var MAX_AVATAR_SIZE = 5 * 1024 * 1024;
  var MAX_BG_SIZE = 8 * 1024 * 1024;

  var form = document.getElementById("editorForm");
  var preview = document.getElementById("preview");
  var previewPane = document.querySelector(".ed-preview");
  var layout = document.querySelector(".ed-layout");
  var saveState = document.getElementById("saveState");
  var avatarPreview = document.getElementById("avatarPreview");
  var bgThumbs = document.getElementById("bgThumbs");
  var bgUploadInfo = document.getElementById("bgUploadInfo");
  var overlayRange = document.getElementById("overlayRange");
  var blurRange = document.getElementById("blurRange");
  var overlayValue = document.getElementById("overlayValue");
  var blurValue = document.getElementById("blurValue");
  var toastEl = document.getElementById("toast");

  var BLANKS = {
    "about.paragraphs": "",
    "about.stats": { value: "", label: "" },
    projects: { tag: "", title: "", desc: "", link: "" },
    timeline: { year: "", title: "", org: "", desc: "" },
    socials: { label: "", url: "" }
  };

  var data = null;
  var previewTimer = null;
  var saveTimer = null;
  var saveSeq = 0;

  /* ---------- Tiện ích ---------- */
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? undefined : acc[key];
    }, obj);
  }

  function setPath(obj, path, value) {
    var keys = path.split(".");
    var last = keys.pop();
    var target = keys.reduce(function (acc, key) {
      if (acc[key] == null || typeof acc[key] !== "object") acc[key] = {};
      return acc[key];
    }, obj);
    target[last] = value;
  }

  function debouncePreview() {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(renderPreview, 260);
  }

  function schedule() {
    setSaveState("Đang lưu…");
    debouncePreview();
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveDraft, 700);
  }

  function setSaveState(text, isError) {
    if (!saveState) return;
    saveState.textContent = text;
    saveState.style.color = isError ? "#c9705f" : "";
  }

  function nowLabel() {
    try {
      return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  }

  var toastTimer = null;
  function toast(message, isError) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.toggle("is-error", !!isError);
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 3200);
  }

  /* ---------- IndexedDB ---------- */
  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB không khả dụng"));
        return;
      }
      var req = window.indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function dbPut(value) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(value, DB_KEY);
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  function dbGet() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(DB_STORE, "readonly");
        var req = tx.objectStore(DB_STORE).get(DB_KEY);
        req.onsuccess = function () { db.close(); resolve(req.result || null); };
        req.onerror = function () { db.close(); reject(req.error); };
      });
    });
  }

  function loadDraft() {
    return dbGet()
      .catch(function () { return null; })
      .then(function (value) {
        if (value) return safeParse(value);
        try {
          return safeParse(window.localStorage.getItem(LS_KEY));
        } catch (e) {
          return null;
        }
      });
  }

  function safeParse(text) {
    if (!text) return null;
    try {
      var parsed = JSON.parse(text);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveDraft() {
    var seq = ++saveSeq;
    var payload = JSON.stringify(data);

    function done(fromLocal) {
      if (seq !== saveSeq) return;
      setSaveState("Đã lưu nháp • " + nowLabel());
      if (fromLocal) setSaveState("Đã lưu nháp (bộ nhớ trình duyệt) • " + nowLabel());
    }

    dbPut(payload)
      .then(function () { done(false); })
      .catch(function () {
        try {
          window.localStorage.setItem(LS_KEY, payload);
          done(true);
        } catch (e) {
          if (seq === saveSeq) {
            setSaveState("Không lưu được nháp — ảnh quá lớn", true);
          }
        }
      });
  }

  /* ---------- Đọc và nén ảnh ---------- */
  function readImage(file, maxDim, maxBytes, quality) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error("empty")); return; }
      if (!/^image\//.test(file.type)) {
        reject(new Error("Định dạng không phải ảnh."));
        return;
      }
      if (file.size > maxBytes) {
        reject(new Error("Ảnh vượt quá " + Math.round(maxBytes / 1024 / 1024) + "MB."));
        return;
      }

      var objectUrl = URL.createObjectURL(file);
      var img = new Image();

      img.onload = function () {
        try {
          var w = img.naturalWidth || img.width;
          var h = img.naturalHeight || img.height;

          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));

          var canvas = document.createElement("canvas");
          canvas.width = cw;
          canvas.height = ch;
          var ctx = canvas.getContext("2d");
          if ("imageSmoothingQuality" in ctx) ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, cw, ch);

          URL.revokeObjectURL(objectUrl);

          var out = "";
          try {
            out = canvas.toDataURL("image/webp", quality || 0.86);
            if (out.indexOf("data:image/webp") !== 0) throw new Error("no-webp");
          } catch (e) {
            out = canvas.toDataURL("image/jpeg", quality || 0.86);
          }
          resolve(out);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      img.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Không đọc được ảnh này."));
      };

      img.src = objectUrl;
    });
  }

  /* ---------- Gắn dữ liệu vào form ---------- */
  function fillBindings() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-bind]"), function (el) {
      var value = getPath(data, el.dataset.bind);
      if (el.dataset.type === "csv") {
        value = Array.isArray(value) ? value.join(", ") : (value || "");
      }
      el.value = value == null ? "" : value;
    });
  }

  function renderRepeaters() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-list]"), function (listEl) {
      var path = listEl.dataset.list;
      var tpl = document.getElementById(listEl.dataset.template);
      if (!tpl) return;

      var items = getPath(data, path) || [];
      listEl.innerHTML = "";

      items.forEach(function (item, index) {
        var node = tpl.content.firstElementChild.cloneNode(true);
        node.dataset.index = String(index);

        var badge = node.querySelector(".rep__index");
        if (badge) badge.textContent = badge.textContent.replace(/\s*\d+$/, "") + " " + (index + 1);

        Array.prototype.forEach.call(node.querySelectorAll("[data-field]"), function (input) {
          var field = input.dataset.field;
          input.value =
            field === "__self"
              ? (item == null ? "" : item)
              : (item && item[field] != null ? item[field] : "");
        });

        listEl.appendChild(node);
      });
    });
  }

  function updateAvatar() {
    if (!avatarPreview) return;
    var R = window.PortfolioRender;
    avatarPreview.src = R.avatarUrl(R.normalize(data));
  }

  function renderBgThumbs() {
    if (!bgThumbs) return;
    var presets = window.PORTFOLIO_PRESETS || [];
    var bg = data.background;
    var usingUpload = !!bg.image;
    bgThumbs.innerHTML = "";

    presets.forEach(function (preset) {
      var active = !usingUpload && preset.id === bg.preset;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = active ? "bg-thumb is-active" : "bg-thumb";
      btn.style.backgroundImage = 'url("' + preset.url + '")';
      btn.setAttribute("aria-label", "Dùng nền " + preset.label);
      btn.setAttribute("title", preset.label);
      btn.setAttribute("aria-pressed", String(!!active));
      btn.addEventListener("click", function () {
        data.background.preset = preset.id;
        data.background.image = "";
        updateBgControls();
        schedule();
      });
      bgThumbs.appendChild(btn);
    });

    /* Ảnh do người dùng tải lên — luôn hiển thị để thấy rõ đang dùng gì */
    if (usingUpload) {
      var custom = document.createElement("button");
      custom.type = "button";
      custom.className = "bg-thumb is-active is-custom";
      custom.style.backgroundImage = 'url("' + bg.image + '")';
      custom.setAttribute("aria-label", "Đang dùng ảnh nền bạn tải lên");
      custom.setAttribute("title", "Ảnh của bạn");
      custom.setAttribute("aria-pressed", "true");
      custom.addEventListener("click", function () {
        toast("Đang dùng ảnh nền bạn tải lên");
      });
      bgThumbs.appendChild(custom);
    }
  }

  function updateBgControls() {
    var bg = data.background;
    var usingUpload = !!bg.image;

    renderBgThumbs();

    if (overlayRange) {
      overlayRange.value = String(bg.overlay);
      if (overlayValue) overlayValue.textContent = bg.overlay + "%";
    }
    if (blurRange) {
      blurRange.value = String(bg.blur);
      if (blurValue) blurValue.textContent = bg.blur + "px";
    }
    if (bgUploadInfo) {
      bgUploadInfo.textContent = usingUpload
        ? "Đang dùng ảnh nền bạn tải lên."
        : "Đang dùng ảnh nền có sẵn.";
      bgUploadInfo.classList.remove("is-error");
    }
  }

  function hydrate() {
    fillBindings();
    renderRepeaters();
    updateAvatar();
    updateBgControls();
  }

  /* ---------- Xem trước ---------- */
  function renderPreview() {
    if (!preview || !window.PortfolioBuild) return;

    var scrollTop = 0;
    try { scrollTop = preview.contentWindow.scrollY || 0; } catch (e) { scrollTop = 0; }

    preview.srcdoc = window.PortfolioBuild.html(data);

    preview.onload = function () {
      try { preview.contentWindow.scrollTo(0, scrollTop); } catch (e) { /* bỏ qua */ }
    };
  }

  /* ---------- Sự kiện nhập liệu ---------- */
  function handleInput(el) {
    if (el.dataset.bind) {
      var path = el.dataset.bind;
      if (el.dataset.type === "csv") {
        setPath(data, path, el.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean));
      } else {
        setPath(data, path, el.value);
      }

      if (path === "profile.initials" || path === "profile.name" || path === "profile.avatar") {
        updateAvatar();
      }
      schedule();
      return;
    }

    if (el.dataset.field) {
      var listEl = el.closest("[data-list]");
      var rep = el.closest("[data-index]");
      if (!listEl || !rep) return;

      var list = getPath(data, listEl.dataset.list);
      var index = Number(rep.dataset.index);
      var field = el.dataset.field;

      if (!list || !list[index] && list[index] !== "") {
        if (!list) return;
      }
      if (field === "__self") {
        list[index] = el.value;
      } else if (list[index] && typeof list[index] === "object") {
        list[index][field] = el.value;
      }
      schedule();
    }
  }

  /* ---------- Danh sách động ---------- */
  function findListElement(path) {
    return document.querySelector('[data-list="' + path + '"]');
  }

  function addItem(path) {
    var list = getPath(data, path);
    if (!Array.isArray(list)) {
      list = [];
      setPath(data, path, list);
    }
    var blank = BLANKS[path];
    list.push(typeof blank === "object" && blank !== null ? clone(blank) : "");
    renderRepeaters();
    schedule();

    var el = findListElement(path);
    if (el && el.lastElementChild) {
      var input = el.lastElementChild.querySelector("input, textarea");
      if (input) input.focus();
    }
  }

  function moveItem(path, index, direction) {
    var list = getPath(data, path);
    if (!Array.isArray(list)) return;
    var target = index + direction;
    if (target < 0 || target >= list.length) return;
    var tmp = list[index];
    list[index] = list[target];
    list[target] = tmp;
    renderRepeaters();
    schedule();
  }

  function removeItem(path, index) {
    var list = getPath(data, path);
    if (!Array.isArray(list)) return;
    list.splice(index, 1);
    renderRepeaters();
    schedule();
  }

  /* ---------- Ảnh ---------- */
  function bindAvatar() {
    var input = document.getElementById("avatarFile");
    var btn = document.getElementById("btnAvatarUpload");
    var reset = document.getElementById("btnAvatarReset");

    if (btn && input) {
      btn.addEventListener("click", function () { input.click(); });
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        input.value = "";
        if (!file) return;
        readImage(file, 600, MAX_AVATAR_SIZE, 0.9)
          .then(function (url) {
            data.profile.avatar = url;
            updateAvatar();
            schedule();
            toast("Đã cập nhật ảnh đại diện");
          })
          .catch(function (err) { toast(err.message, true); });
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        data.profile.avatar = "";
        updateAvatar();
        schedule();
        toast("Đã chuyển về ảnh chữ viết tắt");
      });
    }
  }

  function bindBackground() {
    var input = document.getElementById("bgFile");
    var btn = document.getElementById("btnBgUpload");
    var reset = document.getElementById("btnBgReset");

    if (btn && input) {
      btn.addEventListener("click", function () { input.click(); });
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        input.value = "";
        if (!file) return;
        if (bgUploadInfo) bgUploadInfo.textContent = "Đang xử lý ảnh…";
        readImage(file, 1920, MAX_BG_SIZE, 0.85)
          .then(function (url) {
            data.background.image = url;
            updateBgControls();
            schedule();
            toast("Đã cập nhật ảnh nền");
          })
          .catch(function (err) {
            if (bgUploadInfo) {
              bgUploadInfo.textContent = err.message;
              bgUploadInfo.classList.add("is-error");
            }
            toast(err.message, true);
          });
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        data.background.image = "";
        updateBgControls();
        schedule();
        toast("Đã bỏ ảnh nền tự tải");
      });
    }

    if (overlayRange) {
      overlayRange.addEventListener("input", function () {
        data.background.overlay = Number(overlayRange.value);
        if (overlayValue) overlayValue.textContent = data.background.overlay + "%";
        debouncePreview();
        window.clearTimeout(saveTimer);
        setSaveState("Đang lưu…");
        saveTimer = window.setTimeout(saveDraft, 700);
      });
    }

    if (blurRange) {
      blurRange.addEventListener("input", function () {
        data.background.blur = Number(blurRange.value);
        if (blurValue) blurValue.textContent = data.background.blur + "px";
        debouncePreview();
        window.clearTimeout(saveTimer);
        setSaveState("Đang lưu…");
        saveTimer = window.setTimeout(saveDraft, 700);
      });
    }
  }

  /* ---------- Xuất bản / sao lưu ---------- */
  function downloadBlob(content, filename, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function exportHtml() {
    var html = window.PortfolioBuild.html(data);
    var name = window.PortfolioBuild.fileName(data);
    downloadBlob(html, name, "text/html;charset=utf-8");
    toast("Đã xuất " + name + " — gửi file này cho mọi người xem");
  }

  function backupJson() {
    downloadBlob(JSON.stringify(data, null, 2), "portfolio-data.json", "application/json;charset=utf-8");
    toast("Đã sao lưu dữ liệu");
  }

  function restoreJson(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var parsed = safeParse(String(reader.result || ""));
      if (!parsed) {
        toast("File không hợp lệ", true);
        return;
      }
      data = window.PortfolioRender.normalize(parsed);
      hydrate();
      renderPreview();
      saveDraft();
      toast("Đã khôi phục dữ liệu");
    };
    reader.onerror = function () { toast("Không đọc được file", true); };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!window.confirm("Đặt lại toàn bộ về nội dung mẫu? Thay đổi hiện tại sẽ mất.")) return;
    data = clone(window.PORTFOLIO_DEFAULT_DATA);
    hydrate();
    renderPreview();
    saveDraft();
    toast("Đã đặt lại nội dung mẫu");
  }

  /* ---------- Gắn sự kiện ---------- */
  function bindUi() {
    form.addEventListener("input", function (event) { handleInput(event.target); });
    form.addEventListener("change", function (event) { handleInput(event.target); });

    form.addEventListener("click", function (event) {
      var addBtn = event.target.closest("[data-add]");
      if (addBtn) {
        addItem(addBtn.dataset.add);
        return;
      }

      var actBtn = event.target.closest("[data-act]");
      if (!actBtn) return;

      var rep = actBtn.closest("[data-index]");
      var listEl = actBtn.closest("[data-list]");
      if (!rep || !listEl) return;

      var index = Number(rep.dataset.index);
      var action = actBtn.dataset.act;

      if (action === "remove") removeItem(listEl.dataset.list, index);
      else if (action === "up") moveItem(listEl.dataset.list, index, -1);
      else if (action === "down") moveItem(listEl.dataset.list, index, 1);
    });

    var exportBtn = document.getElementById("btnExport");
    if (exportBtn) exportBtn.addEventListener("click", exportHtml);

    var menuBtn = document.getElementById("btnMenu");
    var menu = document.getElementById("moreMenu");
    if (menuBtn && menu) {
      menuBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        var open = menu.hidden;
        menu.hidden = !open;
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (event) {
        if (menu.hidden) return;
        if (menu.contains(event.target) || menuBtn.contains(event.target)) return;
        menu.hidden = true;
        menuBtn.setAttribute("aria-expanded", "false");
      });
    }

    if (menu) {
      menu.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-action]");
        if (!btn) return;
        menu.hidden = true;
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

        var action = btn.dataset.action;
        if (action === "open") window.open("index.html", "_blank", "noopener");
        else if (action === "backup") backupJson();
        else if (action === "restore") document.getElementById("importJson").click();
        else if (action === "reset") resetAll();
      });
    }

    var importInput = document.getElementById("importJson");
    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        importInput.value = "";
        if (file) restoreJson(file);
      });
    }

    // Đổi kích thước xem trước
    Array.prototype.forEach.call(document.querySelectorAll(".seg [data-view]"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".seg [data-view]"), function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        previewPane.dataset.view = btn.dataset.view;
      });
    });

    // Mở/đóng khung xem trước
    var collapse = document.getElementById("btnCollapse");
    var fab = document.getElementById("btnPreviewFab");
    var isNarrow = function () { return window.innerWidth <= 1080; };

    function updateFab() {
      if (!fab) return;
      var visible = isNarrow()
        ? previewPane.classList.contains("is-open")
        : !layout.classList.contains("is-collapsed");
      fab.hidden = visible;
    }

    function setPreviewOpen(open) {
      if (isNarrow()) {
        previewPane.classList.toggle("is-open", open);
      } else {
        layout.classList.toggle("is-collapsed", !open);
      }
      updateFab();
    }

    if (collapse) collapse.addEventListener("click", function () { setPreviewOpen(false); });
    if (fab) fab.addEventListener("click", function () { setPreviewOpen(true); });

    window.addEventListener("resize", function () {
      if (isNarrow()) layout.classList.remove("is-collapsed");
      else previewPane.classList.remove("is-open");
      updateFab();
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && previewPane.classList.contains("is-open")) {
        setPreviewOpen(false);
      }
    });

    updateFab();
  }

  /* ---------- Khởi tạo ---------- */
  function init() {
    loadDraft().then(function (draft) {
      data = window.PortfolioRender.normalize(draft || window.PORTFOLIO_DEFAULT_DATA);
      hydrate();
      bindUi();
      bindAvatar();
      bindBackground();
      renderPreview();
      setSaveState("Sẵn sàng");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
