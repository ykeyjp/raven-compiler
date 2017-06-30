export default function transform(options) {
  return new Promise((resolve, reject) => {
    const sass = require('node-sass');
    sass.render(options, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          css: result.css.toString().trim(),
          map: result.map ? result.map.toString().trim() : '',
        });
      }
    });
  });
}
