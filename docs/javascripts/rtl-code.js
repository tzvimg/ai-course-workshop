// Auto-detect direction for code blocks:
// - Code with a recognized language class (on code, pre, or parent div) → always LTR
// - Code/text that is English-only or has no Hebrew → LTR (default from CSS)
// - Untagged code blocks with Hebrew and no code patterns → RTL
document.addEventListener('DOMContentLoaded', function () {
  var hebrewRegex = /[\u0590-\u05FF]/;
  // Language classes that indicate native code — always keep LTR
  var codeLangs = /language-(python|javascript|typescript|js|ts|bash|sh|json|yaml|yml|html|css|sql|go|rust|java|c|cpp|csharp|ruby|php|swift|kotlin|xml|toml|diff|ini|dockerfile|makefile|mermaid|text|plaintext|txt|console|shell|powershell|bat|r|scala|perl|lua|hcl|terraform|proto|graphql|markdown|md)/;
  // Patterns that indicate the content is code (not just Hebrew text)
  var codePatterns = /(?:function\s|const\s|let\s|var\s|import\s|export\s|class\s|interface\s|async\s|await\s|return\s|if\s*\(|for\s*\(|while\s*\(|=>\s*\{|\{\s*$|^\s*\}|console\.|require\(|from\s+['"])/m;

  function hasLangClass(el) {
    if (!el) return false;
    if (codeLangs.test(el.className)) return true;
    // Check parent elements (pymdownx.highlight wraps in div.highlight)
    var parent = el.parentElement;
    while (parent && parent !== document.body) {
      if (codeLangs.test(parent.className)) return true;
      // Also check for 'highlight' class which pymdownx adds
      if (/\bhighlight\b/.test(parent.className)) return true;
      parent = parent.parentElement;
    }
    return false;
  }

  function forceLtr(el) {
    el.style.direction = 'ltr';
    el.style.textAlign = 'left';
    if (el.parentElement && el.parentElement.tagName === 'PRE') {
      el.parentElement.style.direction = 'ltr';
      el.parentElement.style.textAlign = 'left';
    }
  }

  document.querySelectorAll('pre > code').forEach(function (codeEl) {
    var text = codeEl.textContent || '';

    // If it has a recognized code language class (on any ancestor), force LTR
    if (hasLangClass(codeEl)) {
      forceLtr(codeEl);
      return;
    }

    // If it looks like code (has code patterns), force LTR
    if (codePatterns.test(text)) {
      forceLtr(codeEl);
      return;
    }

    // If contains Hebrew characters and no code patterns → RTL (it's a Hebrew prompt/text)
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
