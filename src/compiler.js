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
  //return `raven.tag('${tagName}', {html:'${template}',attrs:'${attributes}',css:'${style}',init:function(){${script}}});`;
}
