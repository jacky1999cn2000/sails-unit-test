'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    request = require('supertest');;

chai.use(chaiAsPromised);

var sinon = require('sinon');
    should = chai.should();

describe('ChallengeController', function() {

    describe('#create', function() {

      after(function(){
        Challenge.destroy({}).exec(function destroyCB(err, destroyed){
          //console.log('destroyed ' + destroyed);
        });
      });

      var body;
      beforeEach(function(){
        body = require("../../json3/request.data.sales.challenge.json");
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.login.admin.json");});
        sinon.stub(ChallengeService, 'getTagId', function(){return require("../../json3/challenge.service.get.tag.id.json");});
        sinon.stub(ChallengeService, 'getPointCategoryId', function(){return require("../../json3/challenge.service.get.point.category.id.json");});
        sinon.stub(ChallengeService, 'getFolderId', function(){return require("../../json3/challenge.service.get.folder.id.json");});
        sinon.stub(ChallengeService, 'createFolder', function(){return require("../../json3/challenge.service.create.folder.json");});
        sinon.stub(ChallengeService, 'createChallengeWithRulesAndMetadata', function(){return require("../../json3/challenge.service.create.challenge.with.rules.and.metadata.json");});
      });

      afterEach(function(){
        ChallengeService.loginAdmin.restore();
        ChallengeService.getTagId.restore();
        ChallengeService.getPointCategoryId.restore();
        ChallengeService.getFolderId.restore();
        ChallengeService.createFolder.restore();
        ChallengeService.createChallengeWithRulesAndMetadata.restore();
      });

      it('should return error if loginAdmin() returns error', function(done){
        ChallengeService.loginAdmin.restore();
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if getTagId() returns error', function(done){
        ChallengeService.getTagId.restore();
        sinon.stub(ChallengeService, 'getTagId', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if getPointCategoryId() returns error', function(done){
        ChallengeService.getPointCategoryId.restore();
        sinon.stub(ChallengeService, 'getPointCategoryId', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if getFolderId() returns error', function(done){
        ChallengeService.getFolderId.restore();
        sinon.stub(ChallengeService, 'getFolderId', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if createFolder() returns error', function(done){
        ChallengeService.createFolder.restore();
        sinon.stub(ChallengeService, 'createFolder', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if createChallengeWithRulesAndMetadata() returns error', function(done){
        ChallengeService.createChallengeWithRulesAndMetadata.restore();
        sinon.stub(ChallengeService, 'createChallengeWithRulesAndMetadata', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return ok if everything goes well', function(done){
        request(sails.hooks.http.app)
            .post('/challenge')
            .send(body)
            .expect(200, done);
      });

    });

    describe('#update', function(){
      var body, updatebody, options, entry, id;
      before(function(){
        body = require("../../json3/request.data.sales.challenge.json");
        options = ChallengeService.getOptions(body);

        entry = _.clone(options.data);
        entry.nitroId = [10001,10002];
        entry.startDate = Number(entry.startDate);
        entry.endDate = Number(entry.endDate);
        entry.folderId = 20001;
        entry.pointCategoryId = 30001;
        entry.ruleId = [4001,4002,4003];

        Challenge.create(entry).exec(function createCB(err, created){
          //console.log('Created challenge with id ' + created.id);
          id = created.id;
        });

        updatebody = _.clone(body)
        updatebody.channel = 'Channel X';
      });

      after(function(){
        Challenge.destroy({}).exec(function destroyCB(err, destroyed){
          //console.log('destroyed ' + destroyed);
        });
      });

      beforeEach(function(){
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.login.admin.json");});
        sinon.stub(ChallengeService, 'deleteRule', function(){return require("../../json3/challenge.service.delete.rule.json");});
        sinon.stub(ChallengeService, 'updateChallenge', function(){return require("../../json3/challenge.service.update.challenge.json");});
        sinon.stub(ChallengeService, 'createChallengeWithRulesAndMetadata', function(){return require("../../json3/challenge.service.create.challenge.with.rules.and.metadata.json");});
      });

      afterEach(function(){
        ChallengeService.loginAdmin.restore();
        ChallengeService.deleteRule.restore();
        ChallengeService.updateChallenge.restore();
        ChallengeService.createChallengeWithRulesAndMetadata.restore();
      });

      it('should return error if loginAdmin() returns error', function(done){
        ChallengeService.loginAdmin.restore();
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .put('/challenge/'+id)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if can\'t find specified record in database', function(done){
        request(sails.hooks.http.app)
            .put('/challenge/dummyid')
            .expect(200, {
                status: 'error',
                statusMessage: 'Can\'t find challenge in database.'
              }, done);
      });

      it('should return ok with correct updated value if everything goes well', function(done){
        request(sails.hooks.http.app)
            .put('/challenge/'+id)
            .send(updatebody)
            .expect(function(res) {
              //console.log('res: ', res.body);
              res.body.db[0].should.have.property('channel', 'Channel X');
            })
            .expect(200, done);
      });

    });

    describe('#destroy', function(){
      var body, options, entry, id;
      before(function(){
        body = require("../../json3/request.data.sales.challenge.json");
        options = ChallengeService.getOptions(body);

        entry = _.clone(options.data);
        entry.nitroId = [10001,10002];
        entry.startDate = Number(entry.startDate);
        entry.endDate = Number(entry.endDate);
        entry.folderId = 20001;
        entry.pointCategoryId = 30001;
        entry.ruleId = [4001,4002,4003];

        Challenge.create(entry).exec(function createCB(err, created){
          //console.log('Created challenge with id ' + created.id);
          id = created.id;
        });
      });

      after(function(){
        Challenge.destroy({}).exec(function destroyCB(err, destroyed){
          //console.log('destroyed ' + destroyed);
        });
      });

      beforeEach(function(){
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.login.admin.json");});
        sinon.stub(ChallengeService, 'deleteChallenge', function(){return require("../../json3/challenge.service.delete.challenge.json");});
      });

      afterEach(function(){
        ChallengeService.loginAdmin.restore();
        ChallengeService.deleteChallenge.restore();
      });

      it('should return error if loginAdmin() returns error', function(done){
        ChallengeService.loginAdmin.restore();
        sinon.stub(ChallengeService, 'loginAdmin', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .delete('/challenge/'+id)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if deleteChallenge() returns error', function(done){
        ChallengeService.deleteChallenge.restore();
        sinon.stub(ChallengeService, 'deleteChallenge', function(){return require("../../json3/challenge.service.error.json");});
        request(sails.hooks.http.app)
            .delete('/challenge/'+id)
            .expect(200, {
                status: 'error',
                statusMessage: 'something wrong'
              }, done);
      });

      it('should return error if can\'t find specified record in database', function(done){
        request(sails.hooks.http.app)
            .delete('/challenge/dummyid')
            .expect(200, {
                status: 'error',
                statusMessage: 'Can\'t find challenge in database.'
              }, done);
      });

      it('should return ok with specified record deleted in database if everything goes well', function(done){
        request(sails.hooks.http.app)
            .delete('/challenge/'+id)
            .expect(function(res) {
              //console.log('res: ', res.body);
              User.find({}).exec(function findCB(err, found){
                found.should.have.length(0);
              });
            })
            .expect(200, done);
      });
    });

    describe('#find', function(){

      var body, options, entry1, entry2, entry3;
      before(function(){
        body = require("../../json3/request.data.sales.challenge.json");
        options = ChallengeService.getOptions(_.clone(body));

        entry1 = _.clone(options.data);
        entry1.nitroId = [10001,10002];
        entry1.startDate = Number(entry1.startDate);
        entry1.endDate = Number(entry1.endDate);
        entry1.folderId = 20001;
        entry1.pointCategoryId = 30001;
        entry1.ruleId = [4001,4002,4003];
        Challenge.create(entry1).exec(function createCB(err, created){
          //console.log('Created challenge with id ' + created.id);
        });

        options.data.startDate = '1648928000';
        options.data.endDate = '1648928000';
        entry2 = _.clone(options.data);
        entry2.nitroId = [10003,10004];
        entry2.startDate = Number(entry2.startDate);
        entry2.endDate = Number(entry2.endDate);
        entry2.folderId = 20002;
        entry2.pointCategoryId = 30002;
        entry2.ruleId = [4003,4004,4005];
        Challenge.create(entry2).exec(function createCB(err, created){
          //console.log('Created challenge with id ' + created.id);
        });

        options.data.channel= 'Channel2';
        entry3 = _.clone(options.data);
        entry3.nitroId = [10003,10004];
        entry3.startDate = Number(entry3.startDate);
        entry3.endDate = Number(entry3.endDate);
        entry3.folderId = 20002;
        entry3.pointCategoryId = 30002;
        entry3.ruleId = [4003,4004,4005];
        Challenge.create(entry3).exec(function createCB(err, created){
          //console.log('Created challenge with id ' + created.id);
        });
      });

      it('should return all 3 records if no query parameters provided', function(done){
        request(sails.hooks.http.app)
            .get('/challenge')
            .expect(function(res) {
              res.body.should.have.length(3);
            })
            .expect(200, done);
      });

      it('should return 2 records if query parameter is startDate > 1600000000', function(done){
        request(sails.hooks.http.app)
            .get('/challenge?startDate=1600000000')
            .expect(function(res) {
              res.body.should.have.length(2);
            })
            .expect(200, done);
      });

      it('should return 1 record if query parameters are startDate > 1600000000 and channel = Channel2', function(done){
        request(sails.hooks.http.app)
            .get('/challenge?startDate=1600000000&channel=Channel2')
            .expect(function(res) {
              res.body.should.have.length(1);
            })
            .expect(200, done);
      });

      it('should sort all 3 records based on startDate desc', function(done){
        request(sails.hooks.http.app)
            .get('/challenge?sort=startDate DESC')
            .expect(function(res) {
              res.body[2].should.have.property('startDate', 1548928000);
            })
            .expect(200, done);
      });

      it('should sort all 3 records based on startDate desc and channel asc', function(done){
        let sortdata = encodeURIComponent(JSON.stringify({'startDate':0, 'channel':1}));
        request(sails.hooks.http.app)
            .get('/challenge?sort='+sortdata)
            .expect(function(res) {
              res.body[1].should.have.property('channel', 'Channel2');
            })
            .expect(200, done);
      });

    });

});
