'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Period Schema
 */
var PeriodSchema = new Schema({
  name: {
    type: String,
  },
  startDate:{
    type:Date
  },
  endDate:{
    type:Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Period', PeriodSchema);
