var Sails = require('sails'),
sails;

before(function (done) {

  this.timeout(40000);

  Sails.lift({
    // configuration for testing purposes
    environment: 'unitTest'
  }, function (err, server) {
    sails = server;
    if (err) return done(err);

    process.env.NITRO_SECRET_KEY = "Unit";
    process.env.NITRO_API_KEY = "Test";

    // here you can load fixtures, etc.
    done(err, sails);
  });

});

after(function (done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
