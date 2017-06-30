const templateExpr = /^<template(\b[^>]*)>([\s\S]*?)^<\/template>/m;
const trimTagSpacesExpr = /(\/[\S]+)>[\s]+(<)/g;
const replaceLineBreaks = /\r?\n/g;
const replaceAttributeSpace = /\s+/;

export default function parseTemplate(source) {
  templateExpr.lastIndex = 0;
  const m = templateExpr.exec(source);
  if (m) {
    const attrs = m[1].trim().replace(replaceAttributeSpace, ' ');
    const tmpl = m[2]
      .trim()
      .replace(trimTagSpacesExpr, '$1$2')
      .replace(replaceLineBreaks, '\\n');
    return {tmpl, attrs};
  }
  return {tmpl: '', attrs: ''};
}
