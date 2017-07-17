'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Skillset = mongoose.model('Skillset'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, skillset;

/**
 * Skillset routes tests
 */
describe('Skillset CRUD tests', function () {

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

    // Save a user to the test db and create new Skillset
    user.save(function () {
      skillset = {
        name: 'Skillset name'
      };

      done();
    });
  });

  it('should be able to save a Skillset if logged in', function (done) {
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

        // Save a new Skillset
        agent.post('/api/skillsets')
          .send(skillset)
          .expect(200)
          .end(function (skillsetSaveErr, skillsetSaveRes) {
            // Handle Skillset save error
            if (skillsetSaveErr) {
              return done(skillsetSaveErr);
            }

            // Get a list of Skillsets
            agent.get('/api/skillsets')
              .end(function (skillsetsGetErr, skillsetsGetRes) {
                // Handle Skillset save error
                if (skillsetsGetErr) {
                  return done(skillsetsGetErr);
                }

                // Get Skillsets list
                var skillsets = skillsetsGetRes.body;

                // Set assertions
                (skillsets[0].user._id).should.equal(userId);
                (skillsets[0].name).should.match('Skillset name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Skillset if not logged in', function (done) {
    agent.post('/api/skillsets')
      .send(skillset)
      .expect(403)
      .end(function (skillsetSaveErr, skillsetSaveRes) {
        // Call the assertion callback
        done(skillsetSaveErr);
      });
  });

  it('should not be able to save an Skillset if no name is provided', function (done) {
    // Invalidate name field
    skillset.name = '';

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

        // Save a new Skillset
        agent.post('/api/skillsets')
          .send(skillset)
          .expect(400)
          .end(function (skillsetSaveErr, skillsetSaveRes) {
            // Set message assertion
            (skillsetSaveRes.body.message).should.match('Please fill Skillset name');

            // Handle Skillset save error
            done(skillsetSaveErr);
          });
      });
  });

  it('should be able to update an Skillset if signed in', function (done) {
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

        // Save a new Skillset
        agent.post('/api/skillsets')
          .send(skillset)
          .expect(200)
          .end(function (skillsetSaveErr, skillsetSaveRes) {
            // Handle Skillset save error
            if (skillsetSaveErr) {
              return done(skillsetSaveErr);
            }

            // Update Skillset name
            skillset.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Skillset
            agent.put('/api/skillsets/' + skillsetSaveRes.body._id)
              .send(skillset)
              .expect(200)
              .end(function (skillsetUpdateErr, skillsetUpdateRes) {
                // Handle Skillset update error
                if (skillsetUpdateErr) {
                  return done(skillsetUpdateErr);
                }

                // Set assertions
                (skillsetUpdateRes.body._id).should.equal(skillsetSaveRes.body._id);
                (skillsetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Skillsets if not signed in', function (done) {
    // Create new Skillset model instance
    var skillsetObj = new Skillset(skillset);

    // Save the skillset
    skillsetObj.save(function () {
      // Request Skillsets
      request(app).get('/api/skillsets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Skillset if not signed in', function (done) {
    // Create new Skillset model instance
    var skillsetObj = new Skillset(skillset);

    // Save the Skillset
    skillsetObj.save(function () {
      request(app).get('/api/skillsets/' + skillsetObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', skillset.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Skillset with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/skillsets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Skillset is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Skillset which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Skillset
    request(app).get('/api/skillsets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Skillset with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Skillset if signed in', function (done) {
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

        // Save a new Skillset
        agent.post('/api/skillsets')
          .send(skillset)
          .expect(200)
          .end(function (skillsetSaveErr, skillsetSaveRes) {
            // Handle Skillset save error
            if (skillsetSaveErr) {
              return done(skillsetSaveErr);
            }

            // Delete an existing Skillset
            agent.delete('/api/skillsets/' + skillsetSaveRes.body._id)
              .send(skillset)
              .expect(200)
              .end(function (skillsetDeleteErr, skillsetDeleteRes) {
                // Handle skillset error error
                if (skillsetDeleteErr) {
                  return done(skillsetDeleteErr);
                }

                // Set assertions
                (skillsetDeleteRes.body._id).should.equal(skillsetSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Skillset if not signed in', function (done) {
    // Set Skillset user
    skillset.user = user;

    // Create new Skillset model instance
    var skillsetObj = new Skillset(skillset);

    // Save the Skillset
    skillsetObj.save(function () {
      // Try deleting Skillset
      request(app).delete('/api/skillsets/' + skillsetObj._id)
        .expect(403)
        .end(function (skillsetDeleteErr, skillsetDeleteRes) {
          // Set message assertion
          (skillsetDeleteRes.body.message).should.match('User is not authorized');

          // Handle Skillset error error
          done(skillsetDeleteErr);
        });

    });
  });

  it('should be able to get a single Skillset that has an orphaned user reference', function (done) {
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

          // Save a new Skillset
          agent.post('/api/skillsets')
            .send(skillset)
            .expect(200)
            .end(function (skillsetSaveErr, skillsetSaveRes) {
              // Handle Skillset save error
              if (skillsetSaveErr) {
                return done(skillsetSaveErr);
              }

              // Set assertions on new Skillset
              (skillsetSaveRes.body.name).should.equal(skillset.name);
              should.exist(skillsetSaveRes.body.user);
              should.equal(skillsetSaveRes.body.user._id, orphanId);

              // force the Skillset to have an orphaned user reference
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

                    // Get the Skillset
                    agent.get('/api/skillsets/' + skillsetSaveRes.body._id)
                      .expect(200)
                      .end(function (skillsetInfoErr, skillsetInfoRes) {
                        // Handle Skillset error
                        if (skillsetInfoErr) {
                          return done(skillsetInfoErr);
                        }

                        // Set assertions
                        (skillsetInfoRes.body._id).should.equal(skillsetSaveRes.body._id);
                        (skillsetInfoRes.body.name).should.equal(skillset.name);
                        should.equal(skillsetInfoRes.body.user, undefined);

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
      Skillset.remove().exec(done);
    });
  });
});
