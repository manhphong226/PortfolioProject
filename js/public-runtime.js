/* =========================================================
   Mã JS tương tác của trang công khai.
   Được lưu dưới dạng chuỗi để có thể nhúng thẳng vào file
   HTML xuất bản (file tự chứa, không cần file JS rời).
   ========================================================= */
window.PORTFOLIO_RUNTIME = String.raw`
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.getElementById("siteHeader");
  var lastScroll = -1;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (header && y !== lastScroll) {
      header.classList.toggle("is-scrolled", y > 12);
      lastScroll = y;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }
  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 780) setNav(false);
  });

  var reveals = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduced) {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    Array.prototype.forEach.call(reveals, function (el, index) {
      el.style.transitionDelay = Math.min(index % 6, 5) * 60 + "ms";
      observer.observe(el);
    });

    // Lớp an toàn: nếu trình duyệt không đẩy frame (trang ẩn, tab nền…)
    // thì nội dung trong màn hình đầu vẫn phải hiện ra.
    window.setTimeout(function () {
      var vh = window.innerHeight || 0;
      Array.prototype.forEach.call(reveals, function (el) {
        if (el.classList.contains("is-visible")) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) el.classList.add("is-visible");
      });
    }, 1200);
  }

  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email") || "";
      var label = copyBtn.textContent;

      function done() {
        copyBtn.textContent = "Đã sao chép ✓";
        copyBtn.disabled = true;
        window.setTimeout(function () {
          copyBtn.textContent = label;
          copyBtn.disabled = false;
        }, 1800);
      }

      function fallback() {
        try {
          var input = document.createElement("textarea");
          input.value = email;
          input.setAttribute("readonly", "");
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          done();
        } catch (err) { /* bỏ qua */ }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, fallback);
      } else {
        fallback();
      }
    });
  }
})();
`;
