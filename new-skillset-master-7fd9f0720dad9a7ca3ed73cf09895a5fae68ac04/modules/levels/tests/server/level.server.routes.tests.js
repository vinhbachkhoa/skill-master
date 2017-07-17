'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Level = mongoose.model('Level'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, level;

/**
 * Level routes tests
 */
describe('Level CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Level
    user.save(function () {
      level = {
        name: 'Level name'
      };

      done();
    });
  });

  it('should be able to save a Level if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Level
        agent.post('/api/levels')
          .send(level)
          .expect(200)
          .end(function (levelSaveErr, levelSaveRes) {
            // Handle Level save error
            if (levelSaveErr) {
              return done(levelSaveErr);
            }

            // Get a list of Levels
            agent.get('/api/levels')
              .end(function (levelsGetErr, levelsGetRes) {
                // Handle Level save error
                if (levelsGetErr) {
                  return done(levelsGetErr);
                }

                // Get Levels list
                var levels = levelsGetRes.body;

                // Set assertions
                (levels[0].user._id).should.equal(userId);
                (levels[0].name).should.match('Level name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Level if not logged in', function (done) {
    agent.post('/api/levels')
      .send(level)
      .expect(403)
      .end(function (levelSaveErr, levelSaveRes) {
        // Call the assertion callback
        done(levelSaveErr);
      });
  });

  it('should not be able to save an Level if no name is provided', function (done) {
    // Invalidate name field
    level.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Level
        agent.post('/api/levels')
          .send(level)
          .expect(400)
          .end(function (levelSaveErr, levelSaveRes) {
            // Set message assertion
            (levelSaveRes.body.message).should.match('Please fill Level name');

            // Handle Level save error
            done(levelSaveErr);
          });
      });
  });

  it('should be able to update an Level if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Level
        agent.post('/api/levels')
          .send(level)
          .expect(200)
          .end(function (levelSaveErr, levelSaveRes) {
            // Handle Level save error
            if (levelSaveErr) {
              return done(levelSaveErr);
            }

            // Update Level name
            level.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Level
            agent.put('/api/levels/' + levelSaveRes.body._id)
              .send(level)
              .expect(200)
              .end(function (levelUpdateErr, levelUpdateRes) {
                // Handle Level update error
                if (levelUpdateErr) {
                  return done(levelUpdateErr);
                }

                // Set assertions
                (levelUpdateRes.body._id).should.equal(levelSaveRes.body._id);
                (levelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Levels if not signed in', function (done) {
    // Create new Level model instance
    var levelObj = new Level(level);

    // Save the level
    levelObj.save(function () {
      // Request Levels
      request(app).get('/api/levels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Level if not signed in', function (done) {
    // Create new Level model instance
    var levelObj = new Level(level);

    // Save the Level
    levelObj.save(function () {
      request(app).get('/api/levels/' + levelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', level.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Level with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/levels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Level is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Level which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Level
    request(app).get('/api/levels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Level with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Level if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Level
        agent.post('/api/levels')
          .send(level)
          .expect(200)
          .end(function (levelSaveErr, levelSaveRes) {
            // Handle Level save error
            if (levelSaveErr) {
              return done(levelSaveErr);
            }

            // Delete an existing Level
            agent.delete('/api/levels/' + levelSaveRes.body._id)
              .send(level)
              .expect(200)
              .end(function (levelDeleteErr, levelDeleteRes) {
                // Handle level error error
                if (levelDeleteErr) {
                  return done(levelDeleteErr);
                }

                // Set assertions
                (levelDeleteRes.body._id).should.equal(levelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Level if not signed in', function (done) {
    // Set Level user
    level.user = user;

    // Create new Level model instance
    var levelObj = new Level(level);

    // Save the Level
    levelObj.save(function () {
      // Try deleting Level
      request(app).delete('/api/levels/' + levelObj._id)
        .expect(403)
        .end(function (levelDeleteErr, levelDeleteRes) {
          // Set message assertion
          (levelDeleteRes.body.message).should.match('User is not authorized');

          // Handle Level error error
          done(levelDeleteErr);
        });

    });
  });

  it('should be able to get a single Level that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Level
          agent.post('/api/levels')
            .send(level)
            .expect(200)
            .end(function (levelSaveErr, levelSaveRes) {
              // Handle Level save error
              if (levelSaveErr) {
                return done(levelSaveErr);
              }

              // Set assertions on new Level
              (levelSaveRes.body.name).should.equal(level.name);
              should.exist(levelSaveRes.body.user);
              should.equal(levelSaveRes.body.user._id, orphanId);

              // force the Level to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Level
                    agent.get('/api/levels/' + levelSaveRes.body._id)
                      .expect(200)
                      .end(function (levelInfoErr, levelInfoRes) {
                        // Handle Level error
                        if (levelInfoErr) {
                          return done(levelInfoErr);
                        }

                        // Set assertions
                        (levelInfoRes.body._id).should.equal(levelSaveRes.body._id);
                        (levelInfoRes.body.name).should.equal(level.name);
                        should.equal(levelInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Level.remove().exec(done);
    });
  });
});
