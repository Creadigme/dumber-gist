const del = require('del');

module.exports = function() {
  return del(['worker-bundle*']);
}
