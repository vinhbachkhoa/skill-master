'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Level = mongoose.model('Level'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Level
 */
exports.create = function(req, res) {
  var level = new Level(req.body);
  level.user = req.user;

  level.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(level);
    }
  });
};

/**
 * Show the current Level
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var level = req.level ? req.level.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  level.isCurrentUserOwner = req.user && level.user && level.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(level);
};

/**
 * Update a Level
 */
exports.update = function(req, res) {
  var level = req.level ;

  level = _.extend(level , req.body);

  level.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(level);
    }
  });
};

/**
 * Delete an Level
 */
exports.delete = function(req, res) {
  var level = req.level ;

  level.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(level);
    }
  });
};

/**
 * List of Levels
 */
exports.list = function(req, res) { 
  Level.find().sort('-created').populate('user', 'displayName').exec(function(err, levels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(levels);
    }
  });
};

/**
 * Level middleware
 */
exports.levelByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Level is invalid'
    });
  }

  Level.findById(id).populate('user', 'displayName').exec(function (err, level) {
    if (err) {
      return next(err);
    } else if (!level) {
      return res.status(404).send({
        message: 'No Level with that identifier has been found'
      });
    }
    req.level = level;
    next();
  });
};
