/* =========================================================
   Bộ render dùng chung cho trang công khai và file xuất bản
   ========================================================= */
(function () {
  "use strict";

  var PRESETS = window.PORTFOLIO_PRESETS || [];

  /* ---------- Tiện ích ---------- */
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /* Ghép dữ liệu người dùng với dữ liệu mặc định để tránh thiếu trường */
  function normalize(data) {
    var base = clone(window.PORTFOLIO_DEFAULT_DATA || {});
    var input = data || {};

    function merge(target, source) {
      if (!source || typeof source !== "object") return target;
      Object.keys(source).forEach(function (key) {
        var v = source[key];
        if (Array.isArray(v)) {
          target[key] = v;
        } else if (v && typeof v === "object") {
          if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
            target[key] = {};
          }
          merge(target[key], v);
        } else if (v !== undefined) {
          target[key] = v;
        }
      });
      return target;
    }

    return merge(base, input);
  }

  function getPreset(id) {
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].id === id) return PRESETS[i];
    }
    return PRESETS[0];
  }

  function backgroundUrl(data) {
    if (data.background && data.background.image) return data.background.image;
    return getPreset(data.background && data.background.preset).url;
  }

  function avatarUrl(data) {
    if (data.profile && data.profile.avatar) return data.profile.avatar;

    var initials = (data.profile && data.profile.initials) || "?";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#c9ebe1"/><stop offset="100%" stop-color="#8fc9b9"/>' +
      "</linearGradient></defs>" +
      '<rect width="240" height="240" fill="url(#g)"/>' +
      '<circle cx="80" cy="86" r="46" fill="#ffffff" opacity="0.28"/>' +
      '<circle cx="170" cy="170" r="66" fill="#ffffff" opacity="0.18"/>' +
      '<text x="120" y="140" text-anchor="middle" font-family="Poppins, Inter, sans-serif" ' +
      'font-size="72" font-weight="600" fill="#ffffff" letter-spacing="2">' +
      escapeHtml(initials) +
      "</text></svg>";

    return (
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svg).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      })
    );
  }

  /* ---------- Các khối HTML ---------- */
  function renderBackground(data) {
    var style = 'background-image:url("' + backgroundUrl(data) + '")';
    return (
      '<div class="bg-stack" aria-hidden="true">' +
      '<div class="bg-layer" style="' + escapeHtml(style) + '"></div>' +
      "</div>" +
      '<div class="bg-overlay" aria-hidden="true"></div>'
    );
  }

  function renderHeader(data) {
    var nav = (data.nav || [])
      .map(function (item) {
        return (
          '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + "</a>"
        );
      })
      .join("");

    return (
      '<header class="site-header" id="siteHeader">' +
      '<div class="site-header__inner container">' +
      '<a class="brand" href="#hero">' +
      '<span class="brand__mark">' + escapeHtml(data.profile.initials) + "</span>" +
      '<span class="brand__text">' + escapeHtml(data.profile.name) + "</span>" +
      "</a>" +
      '<nav class="nav" id="nav" aria-label="Điều hướng chính">' + nav + "</nav>" +
      '<button class="nav-toggle" id="navToggle" type="button" aria-label="Mở menu" ' +
      'aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>' +
      "</div></header>"
    );
  }

  function renderHero(data) {
    var p = data.profile;
    return (
      '<section class="hero" id="hero">' +
      '<div class="hero__inner container">' +
      '<div class="hero__avatar reveal">' +
      '<img src="' + escapeHtml(avatarUrl(data)) + '" alt="Ảnh đại diện của ' + escapeHtml(p.name) + '" width="126" height="126">' +
      "</div>" +
      (p.greeting ? '<p class="hero__eyebrow reveal">' + escapeHtml(p.greeting) + "</p>" : "") +
      '<h1 class="hero__title reveal">' +
      escapeHtml(p.heroTitle) + " " +
      (p.heroAccent ? '<span class="accent">' + escapeHtml(p.heroAccent) + "</span>" : "") +
      (p.heroTitle2 ? "<br>" + escapeHtml(p.heroTitle2) : "") +
      "</h1>" +
      (p.subtitle ? '<p class="hero__subtitle reveal">' + escapeHtml(p.subtitle) + "</p>" : "") +
      '<div class="hero__actions reveal">' +
      '<a class="btn btn--primary" href="#projects">Xem dự án</a>' +
      '<a class="btn btn--ghost" href="#contact">Liên hệ</a>' +
      "</div>" +
      '<a class="hero__scroll reveal" href="#about" aria-label="Cuộn xuống phần giới thiệu"><span></span></a>' +
      "</div></section>"
    );
  }

  function renderAbout(data) {
    var t = data.sectionTitles.about;
    var paragraphs = (data.about.paragraphs || [])
      .filter(function (text) { return String(text || "").trim(); })
      .map(function (text) { return "<p>" + escapeHtml(text) + "</p>"; })
      .join("");

    var stats = (data.about.stats || [])
      .filter(function (s) { return s && (s.value || s.label); })
      .map(function (s) {
        return (
          '<div class="stats__item"><dt>' + escapeHtml(s.label) + "</dt>" +
          "<dd>" + escapeHtml(s.value) + "</dd></div>"
        );
      })
      .join("");

    var chips = (data.about.skills || [])
      .filter(function (s) { return String(s || "").trim(); })
      .map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; })
      .join("");

    return (
      '<section class="section" id="about"><div class="container">' +
      '<header class="section__head reveal">' +
      '<p class="section__eyebrow">' + escapeHtml(t.eyebrow) + "</p>" +
      '<h2 class="section__title">' + escapeHtml(t.title) + "</h2>" +
      "</header>" +
      '<div class="about">' +
      '<div class="about__text reveal">' + paragraphs +
      (stats ? '<dl class="stats">' + stats + "</dl>" : "") +
      "</div>" +
      (chips
        ? '<aside class="about__skills reveal"><h3>Kỹ năng</h3><ul class="chips">' + chips + "</ul></aside>"
        : "") +
      "</div></div></section>"
    );
  }

  function renderProjects(data) {
    var t = data.sectionTitles.projects;
    var thumbs = ["a", "b", "c"];

    var items = (data.projects || [])
      .filter(function (p) { return p && (p.title || p.desc); })
      .map(function (p, i) {
        var index = String(i + 1).padStart(2, "0");
        return (
          '<article class="project reveal">' +
          '<div class="project__thumb project__thumb--' + thumbs[i % 3] + '" aria-hidden="true">' +
          "<span>" + index + "</span></div>" +
          '<div class="project__body">' +
          (p.tag ? '<p class="project__tag">' + escapeHtml(p.tag) + "</p>" : "") +
          "<h3>" + escapeHtml(p.title) + "</h3>" +
          (p.desc ? '<p class="project__desc">' + escapeHtml(p.desc) + "</p>" : "") +
          (p.link
            ? '<a class="project__link" href="' + escapeHtml(p.link) + '">Xem chi tiết →</a>'
            : "") +
          "</div></article>"
        );
      })
      .join("");

    if (!items) return "";

    return (
      '<section class="section" id="projects"><div class="container">' +
      '<header class="section__head reveal">' +
      '<p class="section__eyebrow">' + escapeHtml(t.eyebrow) + "</p>" +
      '<h2 class="section__title">' + escapeHtml(t.title) + "</h2>" +
      (t.lead ? '<p class="section__lead">' + escapeHtml(t.lead) + "</p>" : "") +
      "</header>" +
      '<div class="projects">' + items + "</div>" +
      "</div></section>"
    );
  }

  function renderTimeline(data) {
    var t = data.sectionTitles.timeline;

    var items = (data.timeline || [])
      .filter(function (item) { return item && (item.title || item.year); })
      .map(function (item) {
        return (
          '<li class="timeline__item reveal"><div class="timeline__card">' +
          (item.year ? '<span class="timeline__year">' + escapeHtml(item.year) + "</span>" : "") +
          "<h3>" + escapeHtml(item.title) + "</h3>" +
          (item.org ? '<p class="timeline__org">' + escapeHtml(item.org) + "</p>" : "") +
          (item.desc ? '<p class="timeline__desc">' + escapeHtml(item.desc) + "</p>" : "") +
          "</div></li>"
        );
      })
      .join("");

    if (!items) return "";

    return (
      '<section class="section" id="timeline"><div class="container">' +
      '<header class="section__head reveal">' +
      '<p class="section__eyebrow">' + escapeHtml(t.eyebrow) + "</p>" +
      '<h2 class="section__title">' + escapeHtml(t.title) + "</h2>" +
      "</header>" +
      '<ol class="timeline">' + items + "</ol>" +
      "</div></section>"
    );
  }

  function renderContact(data) {
    var t = data.sectionTitles.contact;
    var p = data.profile;

    var socials = (data.socials || [])
      .filter(function (s) { return s && s.label; })
      .map(function (s) {
        return '<li><a href="' + escapeHtml(s.url || "#") + '">' + escapeHtml(s.label) + "</a></li>";
      })
      .join("");

    return (
      '<section class="section section--contact" id="contact"><div class="container">' +
      '<div class="contact reveal">' +
      '<p class="section__eyebrow">' + escapeHtml(t.eyebrow) + "</p>" +
      '<h2 class="contact__title">' + escapeHtml(data.contact.title) + "</h2>" +
      '<p class="contact__lead">' + escapeHtml(data.contact.lead) + "</p>" +
      '<div class="contact__actions">' +
      '<a class="btn btn--primary" href="mailto:' + escapeHtml(p.email) + '">' + escapeHtml(p.email) + "</a>" +
      '<button class="btn btn--ghost" id="copyEmail" type="button" data-email="' + escapeHtml(p.email) + '">Sao chép email</button>' +
      "</div>" +
      (socials ? '<ul class="socials">' + socials + "</ul>" : "") +
      "</div></div></section>"
    );
  }

  function renderFooter(data) {
    return (
      '<footer class="site-footer"><div class="container site-footer__inner">' +
      "<p>© <span id=\"year\">" + new Date().getFullYear() + "</span> " +
      escapeHtml(data.profile.name) +
      (data.footer.note ? ". " + escapeHtml(data.footer.note) : "") +
      "</p>" +
      '<p>Được tạo bằng trang quản trị portfolio.</p>' +
      "</div></footer>"
    );
  }

  /* ---------- API ---------- */
  function renderPortfolioBody(data) {
    var d = normalize(data);
    return [
      renderBackground(d),
      renderHeader(d),
      "<main>",
      renderHero(d),
      renderAbout(d),
      renderProjects(d),
      renderTimeline(d),
      renderContact(d),
      "</main>",
      renderFooter(d)
    ].join("");
  }

  function renderStyleVars(data) {
    var d = normalize(data);
    var overlay = Math.min(80, Math.max(0, Number(d.background.overlay) || 0)) / 100;
    var blur = Math.min(10, Math.max(0, Number(d.background.blur) || 0));
    return "--bg-overlay-opacity:" + overlay + ";--bg-blur:" + blur + "px";
  }

  function pageTitle(data) {
    var d = normalize(data);
    return d.profile.name + (d.profile.role ? " — " + d.profile.role : "");
  }

  /* Gắn vào trang hiện tại (dùng cho index.html) */
  function mount(data) {
    var app = document.getElementById("app");
    if (!app) return;
    var d = normalize(data);

    document.documentElement.setAttribute("style", renderStyleVars(d));
    app.innerHTML = renderPortfolioBody(d);
    document.title = pageTitle(d);

    var desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", d.profile.subtitle || d.profile.role || "");
  }

  window.PortfolioRender = {
    normalize: normalize,
    escapeHtml: escapeHtml,
    renderBody: renderPortfolioBody,
    renderStyleVars: renderStyleVars,
    pageTitle: pageTitle,
    avatarUrl: avatarUrl,
    backgroundUrl: backgroundUrl,
    mount: mount
  };
})();
