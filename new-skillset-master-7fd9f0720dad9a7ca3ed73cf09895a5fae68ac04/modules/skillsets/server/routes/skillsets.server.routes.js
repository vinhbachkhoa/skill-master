'use strict';

/**
 * Module dependencies
 */
var skillsetsPolicy = require('../policies/skillsets.server.policy'),
  skillsets = require('../controllers/skillsets.server.controller');

module.exports = function(app) {
  // Skillsets Routes
  app.route('/api/skillsets').all(skillsetsPolicy.isAllowed)
    .get(skillsets.list)
    .post(skillsets.create);

  app.route('/api/skillsets/:skillsetId').all(skillsetsPolicy.isAllowed)
    .get(skillsets.read)
    .put(skillsets.update)
    .delete(skillsets.delete);

  // Finish by binding the Skillset middleware
  app.param('skillsetId', skillsets.skillsetByID);
};
