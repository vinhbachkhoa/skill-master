'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Skillset Schema
 */
var SkillsetSchema = new Schema({
    period: {
        name: {
            type: String
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        description: {
            type: String
        }
    },
    user: {
        _id: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        displayName: {
            type: String
        }
    },
    leader: {
        displayName: {
            type: String
        }
    },
    skillTable: [
        {
            category: {
                type: String
            },
            skill: {
                type: String
            },
            monthOfExp: {
                type: String
            },
            level: {
                name: {
                    type: String
                },
                value: {
                    type: Number
                }
            },
            levelReview: {
                name: {
                    type: String
                },
                value: {
                    type: Number
                }
            },
            noteReview: {
                type: String
            }
        }
    ],
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Approved', 'Wait for Review', 'Draft', 'In Approve']
    },
    approved: {
        type: Date
    }
});

mongoose.model('Skillset', SkillsetSchema);
