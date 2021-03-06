import path from 'path';
import _ from 'lodash';

const EXTS = ['.scss', '.sass'];

function cleanSource(s) {
  const idx = s.indexOf('/sass/');
  if (idx === -1) return s;
  return s.slice(idx + 6);
}

export class SassTranspiler {
  match(file) {
    const ext = path.extname(file.filename);
    return EXTS.indexOf(ext) !== -1;
  }

  _lazyLoad() {
    if (!this._promise) {
      // The offical dart-sass doesn't have browser support
      // https://github.com/sass/dart-sass/issues/25
      // So I have to use sass.js (emscripted libsass) as it
      // provided a fake fs layer.
      this._promise = import('sass.js/dist/sass.sync');
    }

    return this._promise;
  }

  async transpile(file, files) {
    const {filename} = file;
    if (!this.match(file)) throw new Error('Cannot use SassTranspiler for file: ' + filename);
    if (path.basename(filename).startsWith('_')) {
      // ignore sass partial
      return;
    }

    const Sass = await this._lazyLoad();

    const ext = path.extname(filename);

    const cssFiles = {};
    _.each(files, f => {
      const ext = path.extname(f.filename);
      if (EXTS.indexOf(ext) !== -1 || ext === '.css') {
        cssFiles[f.filename] = f.content;
      }
    });

    const newFilename = filename.slice(0, -ext.length) + '.css';
    if (file.content.match(/^\s*$/)) {
      return {filename: newFilename, content: ''};
    }

    return new Promise((resolve, reject) => {
      Sass.writeFile(cssFiles, () => {
        Sass.compileFile(
          filename,
          result => {
            Sass.removeFile(Object.keys(cssFiles), () => {
              if (result.status === 0) {
                const {text, map} = result;
                map.file = newFilename;
                map.sources = _.map(map.sources, cleanSource);
                map.sourceRoot = '';
                resolve({
                  filename: newFilename,
                  content: text,
                  sourceMap: map
                });
              } else {
                reject(new Error(result.formatted));
              }
            });
          }
        );

      });
    });
  }
}
