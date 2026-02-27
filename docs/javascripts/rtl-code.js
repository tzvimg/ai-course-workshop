// Auto-detect Hebrew text in code blocks and set them to RTL.
// Code blocks with actual code (identified by language class or lack of Hebrew) stay LTR.
document.addEventListener('DOMContentLoaded', function () {
  var hebrewRegex = /[\u0590-\u05FF]/;
  // Language classes that indicate real code — always keep LTR
  var codeLangs = /language-(python|javascript|typescript|js|ts|bash|sh|json|yaml|yml|html|css|sql|go|rust|java|c|cpp|ruby|php|swift|kotlin|xml|toml|diff|ini|dockerfile|makefile|mermaid)/;

  document.querySelectorAll('pre > code').forEach(function (codeEl) {
    // Skip if it has a recognized code language class
    if (codeLangs.test(codeEl.className)) return;

    var text = codeEl.textContent || '';
    if (hebrewRegex.test(text)) {
      var pre = codeEl.parentElement;
      pre.style.direction = 'rtl';
      pre.style.textAlign = 'right';
      codeEl.style.direction = 'rtl';
      codeEl.style.textAlign = 'right';
    }
  });
});
