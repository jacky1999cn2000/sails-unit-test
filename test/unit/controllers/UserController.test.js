var request = require('supertest');

var chai = require('chai'),
    spies = require('chai-spies');

chai.use(spies);

var expect = chai.expect;

describe('UserController', function() {

    describe('#import', function() {
        it('should import users', function() {

            request(sails.hooks.http.app)
                .post('/adminimport')
                .set('BBPS-signature', '72e368be580ab4c8d6aa4ed22881ab7a0af62b08')
                .set('BBPS-timestamp', '1234567890')
                .send([
                    { "role":"editor","name": "Ed","id":1}, 
                    { "role":"editor","name": "Andrew","id":2}, 
                    { "role":"editor","name": "Boz","id":3}
                ])
                .expect(200)
                .end(function(err, res){
                    if (err) {
                        throw err;
                    } else {
                        console.log(res);
                    }

                });
        })

    });

});
