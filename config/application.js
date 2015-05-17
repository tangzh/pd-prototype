/**
 * Applicaiton configurations
 */
(function() {
  var _ = require('underscore');

  var DEV_CONFIG = {
    db: 'mongodb://localhost/quanzi_dev'
  };

  var PRODUCTION_CONFIG = {
    db: 'mongodb://localhost/quanzi_production' // Change it in production
  };

  var CONFIG = {

  };

  switch (process.env.NODE_ENV) {
    case 'production':
      _.extend(CONFIG, PRODUCTION_CONFIG);
      break;
    default:
      _.extend(CONFIG, DEV_CONFIG);
      break;
  }

  module.exports = CONFIG;
})();
