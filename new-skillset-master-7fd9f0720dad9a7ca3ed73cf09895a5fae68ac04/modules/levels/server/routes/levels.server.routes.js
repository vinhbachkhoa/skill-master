'use strict';

/**
 * Module dependencies
 */
var levelsPolicy = require('../policies/levels.server.policy'),
  levels = require('../controllers/levels.server.controller');

module.exports = function(app) {
  // Levels Routes
  app.route('/api/levels').all(levelsPolicy.isAllowed)
    .get(levels.list)
    .post(levels.create);

  app.route('/api/levels/:levelId').all(levelsPolicy.isAllowed)
    .get(levels.read)
    .put(levels.update)
    .delete(levels.delete);

  // Finish by binding the Level middleware
  app.param('levelId', levels.levelByID);
};
