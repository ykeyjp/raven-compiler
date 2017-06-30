import * as path from 'path';
import parseTemplate from './parser/template';
import parseScript from './parser/script';
import parseStyle from './parser/style';

const defaultOptions = {
  extension: '.tag',
  sass: {},
};
let globalOptions = {};

/**
 * @param {object} options
 */
export function options(options) {
  if (options instanceof Object) {
    globalOptions = options;
  } else {
    throw new TypeError('options is not object');
  }
}

export function transform(source, file, options) {
  options = Object.assign({}, defaultOptions, globalOptions, options);
  const tagName = path.basename(file, options.extension);
  const template = parseTemplate(source);
  const script = parseScript(source);
  const style = parseStyle(source);
  const data = {
    imports: script.imports,
    html: template.tmpl,
    attrs: template.attrs,
    init: script.code,
  };
  return Promise.resolve(data).then(data => {
    const sass = require('./transform/sass');
    return sass(
      Object.assign({}, options.sass, {
        data: style.code,
        includePaths: [path.dirname(file)],
        outputStyle: 'compressed',
      })
    )
      .then(result => {
        data.css = result.css;
        return data;
      })
      .then(data => {
        return `${data.imports}\nraven.tag('${tagName}',{html:'${data.html}',attrs:'${data.attrs}',css:'${data.css}',init:function(){${data.init}}});`;
      });
  });
}
