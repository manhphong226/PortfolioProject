/* =========================================================
   CSS của TRANG CÔNG KHAI (không có phần chỉnh sửa)
   Đây là nguồn duy nhất: index.html, khung xem trước và file
   xuất bản đều dùng chung chuỗi CSS này.
   ========================================================= */
window.PORTFOLIO_CSS = String.raw`
/* ===== Reset ===== */
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body,h1,h2,h3,p,dl,dd,ol,ul,figure{margin:0}
ol,ul{padding:0;list-style:none}
img,svg{display:block;max-width:100%}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit;text-decoration:none}
h1,h2,h3{font-weight:600;line-height:1.2;text-wrap:balance}
p{text-wrap:pretty}
:focus-visible{outline:2px solid #7fbfae;outline-offset:3px;border-radius:4px}

/* ===== Biến màu ===== */
:root{
  --bg-base:#f7fbfa;
  --surface:rgba(255,255,255,.72);
  --surface-solid:#fff;
  --border:rgba(127,191,174,.22);
  --text:#2f3b39;
  --text-muted:#6f8280;
  --accent:#7fbfae;
  --accent-strong:#5aa695;
  --accent-soft:#d8ece6;
  --mint-light:#eef7f4;
  --shadow-sm:0 4px 16px rgba(64,110,100,.07);
  --shadow:0 12px 34px rgba(64,110,100,.10);
  --shadow-lg:0 22px 60px rgba(64,110,100,.16);
  --radius-sm:12px;
  --radius:20px;
  --radius-lg:28px;
  --nav-h:68px;
  --container:1080px;
  --bg-overlay-opacity:.35;
  --bg-blur:0px;
}

body{
  font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background-color:var(--bg-base);
  color:var(--text);
  line-height:1.65;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}
h1,h2,h3{font-family:"Poppins","Inter",system-ui,sans-serif;letter-spacing:-.015em}
.container{width:100%;max-width:var(--container);margin-inline:auto;padding-inline:24px}
.accent{color:var(--accent-strong)}

/* ===== Nền ===== */
.bg-stack{position:fixed;inset:0;z-index:-2;overflow:hidden;background:var(--bg-base)}
.bg-layer{
  position:absolute;inset:-24px;
  background-position:center;background-size:cover;background-repeat:no-repeat;
  filter:blur(var(--bg-blur));
}
.bg-overlay{
  position:fixed;inset:0;z-index:-1;background:var(--bg-base);
  opacity:var(--bg-overlay-opacity);pointer-events:none;
}

/* ===== Header ===== */
.site-header{
  position:sticky;top:0;z-index:60;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  background:rgba(255,255,255,.42);
  border-bottom:1px solid transparent;
  transition:background .3s ease,border-color .3s ease,box-shadow .3s ease;
}
.site-header.is-scrolled{
  background:rgba(255,255,255,.78);
  border-bottom-color:var(--border);
  box-shadow:0 6px 24px rgba(64,110,100,.06);
}
.site-header__inner{height:var(--nav-h);display:flex;align-items:center;justify-content:space-between;gap:16px}
.brand{display:inline-flex;align-items:center;gap:10px;font-weight:600}
.brand__mark{
  display:grid;place-items:center;width:36px;height:36px;border-radius:11px;
  background:linear-gradient(135deg,var(--accent) 0%,#a8d8cb 100%);
  color:#fff;font-size:.8rem;font-weight:600;letter-spacing:.02em;
  box-shadow:0 4px 12px rgba(127,191,174,.35);
}
.brand__text{font-family:"Poppins",sans-serif}

.nav{display:flex;align-items:center;gap:28px;font-size:.92rem;color:var(--text-muted)}
.nav a{position:relative;padding:6px 0;transition:color .2s ease}
.nav a::after{
  content:"";position:absolute;left:0;bottom:0;width:100%;height:2px;border-radius:2px;
  background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .26s ease;
}
.nav a:hover,.nav a:focus-visible{color:var(--text)}
.nav a:hover::after,.nav a:focus-visible::after{transform:scaleX(1)}

.nav-toggle{
  display:none;width:42px;height:42px;border-radius:12px;border:1px solid var(--border);
  background:var(--surface);padding:11px 10px;flex-direction:column;justify-content:space-between;
}
.nav-toggle span{display:block;height:2px;border-radius:2px;background:var(--text);transition:transform .26s ease,opacity .2s ease}
.nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
.nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* ===== Nút ===== */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:13px 26px;border-radius:999px;font-size:.94rem;font-weight:500;
  border:1px solid transparent;white-space:nowrap;
  transition:transform .22s ease,box-shadow .22s ease,background .22s ease,border-color .22s ease,color .22s ease;
}
.btn--primary{
  background:linear-gradient(135deg,var(--accent) 0%,#9ad3c4 100%);
  color:#fff;box-shadow:0 8px 22px rgba(127,191,174,.34);
}
.btn--primary:hover,.btn--primary:focus-visible{transform:translateY(-2px);box-shadow:0 14px 30px rgba(127,191,174,.42)}
.btn--ghost{
  background:var(--surface);border-color:var(--border);color:var(--text);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
}
.btn--ghost:hover,.btn--ghost:focus-visible{
  transform:translateY(-2px);border-color:var(--accent);color:var(--accent-strong);box-shadow:var(--shadow-sm);
}

/* ===== Hero ===== */
.hero{
  min-height:calc(100vh - var(--nav-h));
  min-height:calc(100svh - var(--nav-h));
  display:grid;place-items:center;
  padding-block:clamp(48px,10vh,120px);
  scroll-margin-top:calc(var(--nav-h) + 16px);
}
.hero__inner{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:780px}
.hero__avatar{
  margin-bottom:26px;padding:6px;border-radius:50%;
  background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.9);
  box-shadow:0 14px 36px rgba(64,110,100,.18);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
}
.hero__avatar img{width:126px;height:126px;border-radius:50%;object-fit:cover}
.hero__eyebrow{
  font-size:.88rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent-strong);font-weight:500;margin-bottom:18px;
}
.hero__title{font-size:clamp(2.15rem,6vw,3.9rem);line-height:1.14;margin-bottom:22px;font-weight:600}
.hero__subtitle{max-width:560px;color:var(--text-muted);font-size:clamp(.98rem,1.6vw,1.08rem);margin-bottom:34px}
.hero__actions{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.hero__scroll{
  margin-top:56px;width:26px;height:42px;border-radius:999px;
  border:1.5px solid rgba(127,191,174,.55);
  display:grid;place-items:start center;padding-top:8px;
}
.hero__scroll span{width:4px;height:8px;border-radius:4px;background:var(--accent);animation:scrollDot 1.9s ease-in-out infinite}
@keyframes scrollDot{
  0%,100%{transform:translateY(0);opacity:1}
  50%{transform:translateY(12px);opacity:.25}
}

/* ===== Section ===== */
.section{padding-block:clamp(72px,11vh,128px);scroll-margin-top:calc(var(--nav-h) + 16px)}
.section__head{max-width:620px;margin-bottom:clamp(38px,5vw,60px)}
.section__eyebrow{
  font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;
  color:var(--accent-strong);font-weight:500;margin-bottom:12px;
}
.section__title{font-size:clamp(1.75rem,3.6vw,2.5rem);margin-bottom:14px}
.section__lead{color:var(--text-muted);font-size:1rem}

/* ===== About ===== */
.about{display:grid;grid-template-columns:1.35fr 1fr;gap:40px;align-items:start}
.about__text p{color:var(--text-muted);margin-bottom:18px;font-size:1rem}
.about__text p:first-child{color:var(--text);font-size:1.06rem}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}
.stats__item{padding:18px 16px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.stats dt{font-size:.76rem;color:var(--text-muted);margin-bottom:4px}
.stats dd{font-family:"Poppins",sans-serif;font-size:1.5rem;font-weight:600;color:var(--accent-strong);line-height:1.2}
.about__skills{padding:28px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow-sm);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.about__skills h3{font-size:1rem;margin-bottom:16px}
.chips{display:flex;flex-wrap:wrap;gap:9px}
.chips li{padding:7px 14px;border-radius:999px;background:var(--mint-light);border:1px solid var(--border);font-size:.84rem;transition:background .2s ease,transform .2s ease}
.chips li:hover{background:var(--accent-soft);transform:translateY(-2px)}

/* ===== Projects ===== */
.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.project{
  display:flex;flex-direction:column;border-radius:var(--radius);overflow:hidden;
  background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow-sm);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  transition:transform .3s ease,box-shadow .3s ease;
}
.project:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg)}
.project__thumb{position:relative;aspect-ratio:16/10;display:grid;place-items:center;overflow:hidden}
.project__thumb span{font-family:"Poppins",sans-serif;font-size:3.2rem;font-weight:300;color:rgba(255,255,255,.85);letter-spacing:.06em}
.project__thumb--a{background:linear-gradient(135deg,#bfe3d9 0%,#8ecab9 55%,#6fb7a5 100%)}
.project__thumb--b{background:linear-gradient(135deg,#e3f1ec 0%,#b3dcd0 50%,#7fc4b2 100%)}
.project__thumb--c{background:linear-gradient(135deg,#d3ebe4 0%,#9fd2c5 45%,#5fa592 100%)}
.project__thumb::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.5),transparent 60%)}
.project__body{padding:24px 24px 26px;display:flex;flex-direction:column;gap:8px;flex:1}
.project__tag{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent-strong);font-weight:500}
.project__body h3{font-size:1.16rem}
.project__desc{color:var(--text-muted);font-size:.92rem}
.project__link{margin-top:auto;padding-top:12px;font-size:.88rem;font-weight:500;color:var(--accent-strong);transition:transform .2s ease}
.project__link:hover{transform:translateX(4px)}

/* ===== Timeline ===== */
.timeline{position:relative;max-width:880px}
.timeline::before{
  content:"";position:absolute;left:10px;top:6px;bottom:6px;width:2px;border-radius:2px;
  background:linear-gradient(180deg,var(--accent) 0%,var(--accent-soft) 60%,transparent 100%);
}
.timeline__item{position:relative;padding-left:42px;padding-bottom:26px}
.timeline__item:last-child{padding-bottom:0}
.timeline__item::before{
  content:"";position:absolute;left:4px;top:22px;width:14px;height:14px;border-radius:50%;
  background:var(--surface-solid);border:3px solid var(--accent);box-shadow:0 0 0 5px rgba(127,191,174,.14);
}
.timeline__card{
  padding:22px 24px;border-radius:var(--radius);background:var(--surface);
  border:1px solid var(--border);box-shadow:var(--shadow-sm);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  transition:transform .28s ease,box-shadow .28s ease;
}
.timeline__card:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.timeline__year{
  display:inline-block;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--accent-strong);background:var(--mint-light);border:1px solid var(--border);
  border-radius:999px;padding:4px 12px;margin-bottom:12px;
}
.timeline__card h3{font-size:1.1rem;margin-bottom:4px}
.timeline__org{font-size:.86rem;color:var(--accent-strong);margin-bottom:10px}
.timeline__desc{font-size:.92rem;color:var(--text-muted)}

/* ===== Contact ===== */
.section--contact{padding-bottom:clamp(64px,9vh,110px)}
.contact{
  padding:clamp(36px,6vw,64px);border-radius:var(--radius-lg);background:var(--surface);
  border:1px solid var(--border);box-shadow:var(--shadow);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);text-align:center;
}
.contact__title{font-size:clamp(1.7rem,4vw,2.6rem);margin-bottom:18px}
.contact__lead{max-width:480px;margin:0 auto 30px;color:var(--text-muted)}
.contact__actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.socials{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;margin-top:34px;font-size:.88rem;color:var(--text-muted)}
.socials a{transition:color .2s ease}
.socials a:hover,.socials a:focus-visible{color:var(--accent-strong)}

/* ===== Footer ===== */
.site-footer{
  padding-block:30px 40px;border-top:1px solid var(--border);
  background:rgba(255,255,255,.35);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
}
.site-footer__inner{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;font-size:.84rem;color:var(--text-muted)}

/* ===== Reveal ===== */
.reveal{
  opacity:0;transform:translateY(22px);
  transition:opacity .7s cubic-bezier(.22,.61,.36,1),transform .7s cubic-bezier(.22,.61,.36,1);
  will-change:opacity,transform;
}
.reveal.is-visible{opacity:1;transform:none}

/* ===== Responsive ===== */
@media (max-width:860px){
  .about{grid-template-columns:1fr;gap:28px}
  .about__skills{padding:22px}
}
@media (max-width:780px){
  .nav{
    position:fixed;inset:var(--nav-h) 0 auto 0;flex-direction:column;align-items:stretch;gap:4px;
    padding:14px 24px 22px;background:rgba(255,255,255,.96);border-bottom:1px solid var(--border);
    box-shadow:var(--shadow);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    transform:translateY(-12px);opacity:0;visibility:hidden;
    transition:opacity .24s ease,transform .24s ease,visibility .24s;
  }
  .nav.is-open{transform:none;opacity:1;visibility:visible}
  .nav a{padding:12px 4px;font-size:1rem;color:var(--text);border-bottom:1px solid rgba(127,191,174,.12)}
  .nav a:last-child{border-bottom:0}
  .nav a::after{display:none}
  .nav-toggle{display:flex}
  .hero__scroll{margin-top:40px}
}
@media (max-width:560px){
  .container{padding-inline:18px}
  .brand__text{display:none}
  .section{padding-block:64px}
  .projects{grid-template-columns:1fr}
  .contact{padding:30px 20px}
  .contact__actions .btn{width:100%}
  .site-footer__inner{flex-direction:column}
}
@media (max-width:380px){
  .hero__actions .btn{width:100%}
  .stats{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{
    animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.01ms!important;scroll-behavior:auto!important;
  }
}
`;

/* Ghi chú: trang index.html sẽ tự chèn CSS này vào <head>.
   File xuất bản nhúng thẳng CSS vào <head> nên không cần bước này. */
