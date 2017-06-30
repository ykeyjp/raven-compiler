const scriptExpr = /<style\b[^>]*(?:lang="(\S+)"){0,1}\b[^>]*>([\s\S]*?)<\/style>/m;
const replaceLineBreaks = /([,;{}])\r?\n\s*/g;

export default function parseStyle(source) {
  scriptExpr.lastIndex = 0;
  const m = scriptExpr.exec(source);
  if (m) {
    const lang = m[1];
    const code = m[2].trim().replace(replaceLineBreaks, '$1 ');
    return {code, lang};
  }
  return {code: '', lang: ''};
}
