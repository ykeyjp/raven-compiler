import * as path from 'path';
import parseTemplate from './parser/template';
import parseScript from './parser/script';
import parseStyle from './parser/style';

const defaultOptions = {
  extension: '.tag',
  transform: {},
  transformOptions: {},
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
  const scriptProcess = new Promise(resolve => {
    if (options.transform[script.lang]) {
      resolve(
        options.transform[script.lang](
          script.code,
          file,
          options.transformOptions[script.lang]
        )
      );
    } else {
      resolve(script.code);
    }
  });
  const styleProcess = new Promise(resolve => {
    if (options.transform[style.lang]) {
      resolve(
        options.transform[style.lang](
          style.code,
          file,
          options.transformOptions[style.lang]
        )
      );
    } else {
      resolve(style.code);
    }
  });
  return Promise.all([
    {
      imports: script.imports,
      tmpl: template.tmpl,
    },
    scriptProcess.then(code => {
      return {init: code};
    }),
    styleProcess.then(code => {
      return {css: code};
    }),
  ])
    .then(results => {
      return Object.assign.apply({}, results);
    })
    .then(data => {
      return `${data.imports}\nraven.tag('${tagName}',{tmpl:'${data.tmpl}',css:'${data.css}',init:function(){${data.init}}});`;
    });
}
