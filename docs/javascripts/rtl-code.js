// Auto-detect direction for code blocks:
// - Code with a recognized language class → always LTR
// - Code/text that is English-only or has no Hebrew → LTR (default from CSS)
// - Hebrew prompts (contains Hebrew, no language class) → RTL
document.addEventListener('DOMContentLoaded', function () {
  var hebrewRegex = /[\u0590-\u05FF]/;
  // Language classes that indicate native code — always keep LTR
  var codeLangs = /language-(python|javascript|typescript|js|ts|bash|sh|json|yaml|yml|html|css|sql|go|rust|java|c|cpp|csharp|ruby|php|swift|kotlin|xml|toml|diff|ini|dockerfile|makefile|mermaid|text|plaintext|txt|console|shell|powershell|bat|r|scala|perl|lua|hcl|terraform|proto|graphql|markdown|md)/;

  document.querySelectorAll('pre > code').forEach(function (codeEl) {
    // If it has a recognized code language class, force LTR (native code)
    if (codeLangs.test(codeEl.className)) {
      codeEl.style.direction = 'ltr';
      codeEl.style.textAlign = 'left';
      codeEl.parentElement.style.direction = 'ltr';
      codeEl.parentElement.style.textAlign = 'left';
      return;
    }

    var text = codeEl.textContent || '';

    // If contains Hebrew characters → RTL (it's a Hebrew prompt)
    if (hebrewRegex.test(text)) {
      var pre = codeEl.parentElement;
      pre.style.direction = 'rtl';
      pre.style.textAlign = 'right';
      codeEl.style.direction = 'rtl';
      codeEl.style.textAlign = 'right';
    }
    // Otherwise: stays LTR from CSS defaults (English text or code without lang tag)
  });
});
