var files = require('../../files');
var commonConfig = require('./common.conf');

module.exports = function(config) {
  commonConfig(config);

  config.set({
    files: files.mergeFilesFor('karma-min')
  });
};
