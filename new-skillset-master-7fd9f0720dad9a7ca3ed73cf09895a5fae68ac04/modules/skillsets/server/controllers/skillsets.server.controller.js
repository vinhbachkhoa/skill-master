'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Skillset = mongoose.model('Skillset'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Skillset
 */
exports.create = function(req, res) {
  var skillset = new Skillset(req.body);
  skillset.user = req.user;

  skillset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skillset);
    }
  });
};

/**
 * Show the current Skillset
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var skillset = req.skillset ? req.skillset.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  skillset.isCurrentUserOwner = req.user && skillset.user && skillset.user._id && skillset.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(skillset);
};

/**
 * Update a Skillset
 */
exports.update = function(req, res) {
  var skillset = req.skillset ;

  skillset = _.extend(skillset , req.body);

  skillset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skillset);
    }
  });
};

/**
 * Delete an Skillset
 */
exports.delete = function(req, res) {
  var skillset = req.skillset ;

  skillset.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skillset);
    }
  });
};

/**
 * List of Skillsets
 */
exports.list = function(req, res) { 
  Skillset.find().sort('-created').exec(function(err, skillsets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skillsets);
    }
  });
};

/**
 * Skillset middleware
 */
exports.skillsetByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Skillset is invalid'
    });
  }

  Skillset.findById(id).exec(function (err, skillset) {
    if (err) {
      return next(err);
    } else if (!skillset) {
      return res.status(404).send({
        message: 'No Skillset with that identifier has been found'
      });
    }
    req.skillset = skillset;
    next();
  });
};
