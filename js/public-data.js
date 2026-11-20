/* =========================================================
   Dữ liệu mặc định của trang công khai
   -------------------------------------
   Ảnh (avatar, nền) được nhúng dạng data URL để file xuất bản
   luôn tự chứa, không phụ thuộc thư mục assets/.
   ========================================================= */
(function () {
  "use strict";

  function svgUrl(svg) {
    /* encodeURIComponent giữ nguyên !'()* nên phải mã hoá nốt
       nếu không CSS url(...) sẽ bị hỏng. */
    return (
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svg.replace(/\s+/g, " ").trim()).replace(
        /[!'()*]/g,
        function (c) {
          return "%" + c.charCodeAt(0).toString(16).toUpperCase();
        }
      )
    );
  }

  /* ---------- 4 nền mặc định ---------- */
  var PRESET_SVG = {
    "mint-1":
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">' +
      '<defs><radialGradient id="a" cx="22%" cy="18%" r="62%"><stop offset="0%" stop-color="#d9f0e8"/><stop offset="100%" stop-color="#f7fbfa" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="b" cx="82%" cy="76%" r="58%"><stop offset="0%" stop-color="#c3e6da"/><stop offset="100%" stop-color="#f7fbfa" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="c" cx="58%" cy="42%" r="38%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1600" height="1000" fill="#f7fbfa"/><rect width="1600" height="1000" fill="url(#a)"/>' +
      '<rect width="1600" height="1000" fill="url(#b)"/><rect width="1600" height="1000" fill="url(#c)"/></svg>',

    "mint-2":
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="52%" stop-color="#eef7f4"/><stop offset="100%" stop-color="#d5ece4"/></linearGradient>' +
      '<linearGradient id="r" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#b9e2d6" stop-opacity=".55"/><stop offset="100%" stop-color="#ffffff" stop-opacity=".1"/></linearGradient></defs>' +
      '<rect width="1600" height="1000" fill="url(#g)"/><circle cx="1240" cy="230" r="300" fill="none" stroke="url(#r)" stroke-width="70"/>' +
      '<circle cx="360" cy="820" r="420" fill="none" stroke="url(#r)" stroke-width="90"/><circle cx="820" cy="470" r="180" fill="#ffffff" opacity=".45"/></svg>',

    "mint-3":
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="s" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fafdfc"/><stop offset="60%" stop-color="#f0f9f6"/><stop offset="100%" stop-color="#e2f2ec"/></linearGradient>' +
      '<linearGradient id="w1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#cfeadf" stop-opacity=".85"/><stop offset="100%" stop-color="#eaf7f2" stop-opacity=".35"/></linearGradient>' +
      '<linearGradient id="w2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#b8ded1" stop-opacity=".7"/><stop offset="100%" stop-color="#dff1ea" stop-opacity=".25"/></linearGradient></defs>' +
      '<rect width="1600" height="1000" fill="url(#s)"/><circle cx="1300" cy="220" r="150" fill="#ffffff" opacity=".55"/>' +
      '<path d="M0 660 C 260 590 420 760 700 700 C 980 640 1180 540 1600 640 L1600 1000 L0 1000 Z" fill="url(#w1)"/>' +
      '<path d="M0 800 C 300 730 520 880 860 830 C 1180 782 1360 700 1600 770 L1600 1000 L0 1000 Z" fill="url(#w2)"/></svg>',

    "mint-4":
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f8fcfb"/><stop offset="100%" stop-color="#e9f5f1"/></linearGradient>' +
      '<radialGradient id="gl" cx="70%" cy="30%" r="55%"><stop offset="0%" stop-color="#cfeae0" stop-opacity=".75"/><stop offset="100%" stop-color="#f8fcfb" stop-opacity="0"/></radialGradient>' +
      '<pattern id="d" width="42" height="42" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.2" fill="#a9d6c8" opacity=".35"/></pattern></defs>' +
      '<rect width="1600" height="1000" fill="url(#b)"/><rect width="1600" height="1000" fill="url(#gl)"/>' +
      '<rect width="1600" height="1000" fill="url(#d)"/><rect x="140" y="140" width="420" height="420" rx="90" fill="#ffffff" opacity=".35"/></svg>'
  };

  window.PORTFOLIO_PRESETS = [
    { id: "mint-1", label: "Mint sương", url: svgUrl(PRESET_SVG["mint-1"]) },
    { id: "mint-2", label: "Gió nhẹ", url: svgUrl(PRESET_SVG["mint-2"]) },
    { id: "mint-3", label: "Sóng bạc hà", url: svgUrl(PRESET_SVG["mint-3"]) },
    { id: "mint-4", label: "Chấm sương", url: svgUrl(PRESET_SVG["mint-4"]) }
  ];

  /* ---------- Dữ liệu mẫu ---------- */
  window.PORTFOLIO_DEFAULT_DATA = {
    profile: {
      name: "Nguyễn Minh Anh",
      initials: "MA",
      role: "UI/UX Designer & Front-end Developer",
      greeting: "Xin chào, mình là Minh Anh 👋",
      heroTitle: "Thiết kế trải nghiệm",
      heroAccent: "nhẹ nhàng",
      heroTitle2: "và tinh tế.",
      subtitle:
        "UI/UX Designer & Front-end Developer — mình yêu những giao diện tối giản, màu sắc dịu mắt và những chi tiết nhỏ khiến người dùng mỉm cười.",
      avatar: "",
      email: "hello@minhanh.design"
    },

    about: {
      paragraphs: [
        "Mình là designer và front-end developer với hơn 5 năm kinh nghiệm, làm việc giữa ranh giới của thẩm mỹ và kỹ thuật. Mình tin rằng một sản phẩm tốt không cần phải ồn ào — chỉ cần đúng chỗ, đúng lúc và dễ chịu khi sử dụng.",
        "Ngoài giờ làm việc, mình thích chụp ảnh, pha cà phê và đọc sách về tâm lý học nhận thức. Những điều đó ảnh hưởng khá nhiều đến cách mình thiết kế giao diện."
      ],
      stats: [
        { value: "5+", label: "Năm kinh nghiệm" },
        { value: "38", label: "Dự án hoàn thành" },
        { value: "21", label: "Khách hàng" }
      ],
      skills: ["Figma", "Design System", "HTML & CSS", "JavaScript", "React", "Motion", "Accessibility", "Prototyping"]
    },

    projects: [
      {
        tag: "Mobile app · 2025",
        title: "Ứng dụng thiền Tĩnh",
        desc: "Thiết kế lại toàn bộ luồng onboarding và thư viện âm thanh cho ứng dụng thiền.",
        link: "#contact"
      },
      {
        tag: "Website · 2024",
        title: "Thời trang Lụa",
        desc: "Website thương mại điện tử với trải nghiệm mua sắm nhẹ nhàng, tải nhanh trên 3G.",
        link: "#contact"
      },
      {
        tag: "Dashboard · 2024",
        title: "Bảng điều khiển Tài chính",
        desc: "Hệ thống design token và dashboard theo dõi dòng tiền cho đội ngũ 200 người.",
        link: "#contact"
      }
    ],

    timeline: [
      {
        year: "2025 — nay",
        title: "Senior Product Designer",
        org: "Studio Mây · TP.HCM",
        desc: "Dẫn dắt đội ngũ 4 designer, xây dựng design system dùng chung cho 6 sản phẩm."
      },
      {
        year: "2023 — 2025",
        title: "UI/UX Designer",
        org: "Fintech Nắng · Remote",
        desc: "Thiết kế ứng dụng tài chính cá nhân với hơn 120.000 người dùng hoạt động."
      },
      {
        year: "2021 — 2023",
        title: "Front-end Developer",
        org: "Agency Gió · Hà Nội",
        desc: "Hiện thực hoá thiết kế thành giao diện responsive, tối ưu hiệu năng và SEO."
      },
      {
        year: "2017 — 2021",
        title: "Cử nhân Thiết kế Đồ hoạ",
        org: "Đại học Mỹ thuật Công nghiệp",
        desc: "Tốt nghiệp loại Giỏi, luận văn về thiết kế giao diện cho người cao tuổi."
      }
    ],

    socials: [
      { label: "GitHub", url: "#contact" },
      { label: "LinkedIn", url: "#contact" },
      { label: "Dribbble", url: "#contact" },
      { label: "Instagram", url: "#contact" }
    ],

    contact: {
      title: "Cùng tạo ra điều gì đó thật dễ chịu nhé.",
      lead: "Mình luôn sẵn sàng cho những dự án mới, một cuộc trò chuyện về thiết kế, hoặc đơn giản là một lời chào."
    },

    background: {
      preset: "mint-1",
      image: "",
      overlay: 35,
      blur: 0
    },

    footer: {
      note: "Làm bằng sự chậm rãi."
    },

    /* Nội dung menu điều hướng (có thể sửa trong file này) */
    nav: [
      { label: "Giới thiệu", href: "#about" },
      { label: "Dự án", href: "#projects" },
      { label: "Kinh nghiệm", href: "#timeline" },
      { label: "Liên hệ", href: "#contact" }
    ],

    sectionTitles: {
      about: { eyebrow: "01 — Giới thiệu", title: "Một chút về mình" },
      projects: {
        eyebrow: "02 — Dự án",
        title: "Những thứ mình đã làm",
        lead: "Một vài dự án tiêu biểu, từ ý tưởng đến sản phẩm hoàn chỉnh."
      },
      timeline: { eyebrow: "03 — Kinh nghiệm", title: "Hành trình của mình" },
      contact: { eyebrow: "04 — Liên hệ" }
    }
  };
})();
