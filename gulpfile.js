const { src, dest } = require('gulp');

function buildIcons() {
  return src('nodes/**/*.svg').pipe(dest('dist/nodes'));
}

function copyPackageJson() {
  return src('package.json').pipe(dest('dist'));
}

exports['build:icons'] = buildIcons;
exports['build:package'] = copyPackageJson;
exports.default = buildIcons;
