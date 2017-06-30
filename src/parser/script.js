const scriptExpr = /<script\b[^>]*(?:lang="(\S+)"){0,1}\b[^>]*>([\s\S]*?)<\/script>/m;
const replaceLineBreaks = /([,;{}])\r?\n\s*/g;
const importExpr = /(?:^|\s)(import\s[\s\S]+?;)(?:$|\s)/gm;

export default function parseScript(source) {
  scriptExpr.lastIndex = 0;
  importExpr.lastIndex = 0;
  const m = scriptExpr.exec(source);
  if (m) {
    const lang = m[1];
    let m2;
    let imports = "import * as raven from '@ykey/raven';";
    while ((m2 = importExpr.exec(m[2]))) {
      imports += '\n' + m2[1];
    }
    const code = m[2]
      .replace(importExpr, '')
      .trim()
      .replace(replaceLineBreaks, '$1 ');
    return {imports, code, lang};
  }
  return {imports: '', code: '', lang: ''};
}
