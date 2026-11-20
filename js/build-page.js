/* =========================================================
   Tạo file HTML tự chứa từ dữ liệu người dùng
   ========================================================= */
(function () {
  "use strict";

  var FONT_LINKS =
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">';

  function buildPortfolioHtml(data) {
    var R = window.PortfolioRender;
    var d = R.normalize(data);

    var css = window.PORTFOLIO_CSS || "";
    var runtime = window.PORTFOLIO_RUNTIME || "";
    var body = R.renderBody(d);
    var vars = R.renderStyleVars(d);
    var title = R.pageTitle(d);
    var description = d.profile.subtitle || d.profile.role || "";

    var head = [
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="description" content="' + R.escapeHtml(description) + '">',
      '<meta name="theme-color" content="#f7fbfa">',
      "<title>" + R.escapeHtml(title) + "</title>",
      FONT_LINKS,
      "<style>" + css + "</style>"
    ].join("\n");

    return (
      "<!DOCTYPE html>\n" +
      '<html lang="vi" style="' + vars + '">\n' +
      "<head>\n" + head + "\n</head>\n" +
      "<body>\n" + body + "\n" +
      "<script>" + runtime + "<" + "/script>\n" +
      "</body>\n</html>\n"
    );
  }

  function exportFileName(data) {
    var R = window.PortfolioRender;
    var d = R.normalize(data);
    var slug = String(d.profile.name || "portfolio")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return "portfolio-" + (slug || "moi") + ".html";
  }

  window.PortfolioBuild = {
    html: buildPortfolioHtml,
    fileName: exportFileName
  };
})();
