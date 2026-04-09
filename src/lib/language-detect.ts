const patterns: Record<string, RegExp[]> = {
  TypeScript: [/:\s*(string|number|boolean|any)\b/, /interface\s+\w+/, /type\s+\w+\s*=/, /<\w+>/,  /import.*from\s+['"]/, /\.tsx?$/],
  JavaScript: [/const\s+\w+\s*=\s*require/, /module\.exports/, /=>\s*{/, /function\s+\w+/, /import\s+.*from/],
  Python: [/def\s+\w+\(/, /class\s+\w+[:(]/, /import\s+\w+/, /from\s+\w+\s+import/, /self\./, /__init__/],
  Java: [/public\s+class/, /private\s+\w+/, /System\.out/, /void\s+main/, /import\s+java\./],
  Go: [/func\s+\w+/, /package\s+\w+/, /import\s+"/, /fmt\./, /:=\s*/],
  Rust: [/fn\s+\w+/, /let\s+mut/, /impl\s+/, /pub\s+fn/, /use\s+std::/],
  Ruby: [/def\s+\w+/, /class\s+\w+\s*</, /require\s+'/, /end\s*$/, /attr_/],
  PHP: [/<\?php/, /function\s+\w+/, /\$\w+/, /echo\s+/, /namespace\s+/],
  "C++": [/#include\s*</, /std::/, /int\s+main/, /cout\s*<</, /class\s+\w+\s*{/],
  Swift: [/func\s+\w+/, /var\s+\w+:/, /let\s+\w+:/, /import\s+Foundation/, /struct\s+\w+/],
};

export function detectLanguage(code: string): string {
  const scores: Record<string, number> = {};
  for (const [lang, regs] of Object.entries(patterns)) {
    scores[lang] = regs.reduce((s, r) => s + (r.test(code) ? 1 : 0), 0);
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "Unknown";
}
