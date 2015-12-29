var request = require('supertest');

var chai = require('chai'),
    spies = require('chai-spies');

chai.use(spies);

var expect = chai.expect;

describe('GalloApiService', function() {

    describe('getResponse', function() {
        it('should return an ok response when the \'/:path\' route is requested', function() {
            var req = {
                allParams: function() {
                    return {
                        'path': 'brandbydistributor'
                    }
                },
                param: function(name) {
                    if (name === 'path') {
                        return 'brandbydistributor'
                    }
                },
            }

            var res = {
                badRequest: function() {},
            }

            chai.spy.on(res, 'badRequest');

            GalloApiService.getResponse(req, res);
            expect(res.badRequest).to.not.have.been.called();
        })

        it('should return an ok response when the \'/:path/:qualifier\' route is requested', function() {
            var req = {
                allParams: function() {
                    return {
                        'path': 'brandbydistributor',
                        'qualifier': '1379'
                    }
                },
                param: function(name) {
                    if (name === 'path') {
                        return 'brandbydistributor'
                    } else if (name === 'qualifier') {
                        return '1379'
                    }
                },
            }

            var res = {
                badRequest: function() {},
            }

            chai.spy.on(res, 'badRequest');

            GalloApiService.getResponse(req, res);
            expect(res.badRequest).to.not.have.been.called();
        })

        it('should return an ok response when the \'/survey/gallo\' route is requested', function() {
            var req = {
                allParams: function() {},
                param: function() {},
                path: '/gallo/survey'
            }

            var res = {
                badRequest: function() {},
            }

            chai.spy.on(res, 'badRequest');

            GalloApiService.getResponse(req, res);
            expect(res.badRequest).to.not.have.been.called();
        })

        it('should return a bad response when an incorrect path is requested', function() {
            var req = {
                allParams: function() {},
                param: function() {},
                path: ''
            }

            var res = {
                badRequest: function() {}
            }

            chai.spy.on(res, 'badRequest');

            GalloApiService.getResponse(req, res);
            expect(res.badRequest).to.have.been.called();
        });

    });

});
