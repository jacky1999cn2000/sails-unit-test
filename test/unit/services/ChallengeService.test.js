'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var sinon = require('sinon'),
    should = chai.should();

    process.env.NITRO_ENV = 'nitro';
    process.env.NITRO_API_KEY = 'ApiKey';
    process.env.NITRO_SERVER = 'server';
    process.env.ENVIRONMENT = 'localhost';

describe('ChallengeService', function(){

  describe('#error handling', function(){

    beforeEach(function(){
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/error.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('loginAdmin() should return error if nitro returns error', function(){
      return ChallengeService.loginAdmin().should.eventually.have.property('status', 'error');
    });

    it('getTagId() should return error if nitro returns error', function() {
      return ChallengeService.getTagId().should.eventually.have.property('status', 'error');
    });

    it('getPointCategoryId() should return error if nitro returns error', function() {
      return ChallengeService.getPointCategoryId().should.eventually.have.property('status', 'error');
    });

    it('getFolderId() should return error if nitro returns error', function() {
      return ChallengeService.getFolderId().should.eventually.have.property('status', 'error');
    });

    it('createFolder() should return error if nitro returns error (when month folder doesn\'t exist)', function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      let options = ChallengeService.getOptions(body);
      options.folderId = '';
      options.folders.distributor.created = true;
      options.folders.channel.created = true;
      options.folders.year.created = true;
      return ChallengeService.createFolder(options).should.eventually.have.property('status', 'error');
    });

    it('createFolder() should return error if nitro returns error (when year folder doesn\'t exist)', function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      let options = ChallengeService.getOptions(body);
      options.folderId = '';
      options.folders.distributor.created = true;
      options.folders.channel.created = true;
      return ChallengeService.createFolder(options).should.eventually.have.property('status', 'error');
    });

    it('createFolder() should return error if nitro returns error (when channel folder doesn\'t exist)', function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      let options = ChallengeService.getOptions(body);
      options.folderId = '';
      options.folders.distributor.created = true;
      return ChallengeService.createFolder(options).should.eventually.have.property('status', 'error');
    });

    it('createFolder() should return error if nitro returns error (when distributor folder doesn\'t exist)', function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      let options = ChallengeService.getOptions(body);
      options.folderId = '';
      options.folders.distributor.created = true;
      return ChallengeService.createFolder(options).should.eventually.have.property('status', 'error');
    });

    it('createChallenge() should return error if nitro returns error', function(){
      let options = {};
      let challenge = {};
      return ChallengeService.createChallenge(options, challenge).should.eventually.have.property('status', 'error');
    });

    it('updateChallenge() should return error if nitro returns error', function(){
      let options = {};
      let challenge = {};
      challenge.id = 6241537;
      challenge.name = 'name';
      challenge.description = 'description';
      challenge.rewards = 'point|111111|200';
      challenge.activeFlag = '1';
      return ChallengeService.updateChallenge(options, challenge).should.eventually.have.property('status', 'error');
    });

    it('createRule() should return error if nitro returns error', function(){
      let options = {};
      let rule = {};
      return ChallengeService.createRule(options, rule).should.eventually.have.property('status', 'error');
    });

    it('createMetaDatum() should return error if nitro returns error', function(){
      let options = {};
      let metadatum = {};
      return ChallengeService.createMetaDatum(options, metadatum).should.eventually.have.property('status', 'error');
    });

    it('deleteChallenge() should return error if nitro returns error', function() {
      let options = {};
      let challengeId = 6241537;
      return ChallengeService.deleteChallenge(options, challengeId).should.eventually.have.property('status', 'error');
    });

    it('deleteRule() should return error if nitro returns error', function() {
      let options = {};
      let ruleId = 6241537;
      return ChallengeService.deleteRule(options, ruleId).should.eventually.have.property('status', 'error');
    });

  });

  describe('#loginAdmin', function(){

    beforeEach(function(){
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.loginAdmin.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return ok if response contains sessionKey', function() {
      return ChallengeService.loginAdmin().should.eventually.have.property('status', 'ok');
    });

  });

  describe('#getTagId', function(){

    var options;

    beforeEach(function(){
      options = {};
      options.tagName = 'SELL_VOLUME';
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.getActionTags.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return ok if response contains the specified tag name', function() {
      return ChallengeService.getTagId(options).should.eventually.have.property('status', 'ok');
    });

    it('should return error if response doesn\'t contain the specified tag name', function() {
      options.tagName = 'TEST';
      return ChallengeService.getTagId(options).should.eventually.have.property('status', 'error');
    });

    it('should return error if response doesn\'t contain tag', function() {
      ChallengeService.makeRequest.restore();
      let data = require("../../json3/admin.getActionTags.json");
      delete data.response.tags.tag;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});
      return ChallengeService.getTagId().should.eventually.have.property('status', 'error');
    });

  });

  describe('#getPointCategoryId', function(){

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });



    it('should return ok if response contains default pointCategory', function() {
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.getSitePointCategories.json");});
      return ChallengeService.getPointCategoryId().should.eventually.have.property('status', 'ok');
    });

    it('should return error if response doesn\'t contain default pointCategory', function() {
      let data = require("../../json3/admin.getSitePointCategories.json");
      data.response.pointCategories.pointCategory[0].isDefault = false;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});
      return ChallengeService.getPointCategoryId().should.eventually.have.property('status', 'error');
    });

    it('should return error if response doesn\'t contain pointCategory', function() {
      let data = require("../../json3/admin.getSitePointCategories.json");
      delete data.response.pointCategories.pointCategory;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});
      return ChallengeService.getPointCategoryId().should.eventually.have.property('status', 'error');
    });

  });

  describe('#getFolderId', function(){

    var options;

    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return folderId if found it', function() {
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.getFolders.json");});
      return ChallengeService.getFolderId(options).should.eventually.have.property('folderId', 3939713);
    });

    it('should return emptry string if monthFolderId not found', function() {
      let data = require("../../json3/admin.getFolders.json");
      data.response.folders.folder[0].parentId = 111111;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});

      return Promise.all([
        ChallengeService.getFolderId(options).should.eventually.have.property('folderId', ''),
        ChallengeService.getFolderId(options).should.eventually.have.property('status', 'ok')
      ]);
    });

    it('should return emptry string if yearFolderId not found', function() {
      let data = require("../../json3/admin.getFolders.json");
      data.response.folders.folder[1].parentId = 111111;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});

      return Promise.all([
        ChallengeService.getFolderId(options).should.eventually.have.property('folderId', ''),
        ChallengeService.getFolderId(options).should.eventually.have.property('status', 'ok')
      ]);
    });

    it('should return emptry string if channelFolderId not found', function() {
      let data = require("../../json3/admin.getFolders.json");
      data.response.folders.folder[2].parentId = 111111;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});

      return Promise.all([
        ChallengeService.getFolderId(options).should.eventually.have.property('folderId', ''),
        ChallengeService.getFolderId(options).should.eventually.have.property('status', 'ok')
      ]);
    });

    it('should return emptry string if distributorFolderId not found', function() {
      let data = require("../../json3/admin.getFolders.json");
      data.response.folders.folder[3].name = 'Distributor1';
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});

      return Promise.all([
        ChallengeService.getFolderId(options).should.eventually.have.property('folderId', ''),
        ChallengeService.getFolderId(options).should.eventually.have.property('status', 'ok')
      ]);
    });

    it('should return emptry string if response doesn\'t contain folder', function() {
      let data = require("../../json3/admin.getFolders.json");
      delete data.response.folders.folder;
      sinon.stub(ChallengeService, 'makeRequest', function(){return data;});

      return Promise.all([
        ChallengeService.getFolderId(options).should.eventually.have.property('folderId', ''),
        ChallengeService.getFolderId(options).should.eventually.have.property('status', 'ok')
      ]);
    });

  });

  describe('#createFolder', function(){

    var options;

    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
      options.folderId = '';

      let data = require("../../json3/admin.createFolder.json");
      let data1 = _.clone(data);
      data1.response.folders.folder[0].id = 1;
      data1.response.folders.folder[0].name = 'Distributor1';

      let data2 = _.clone(data);
      data2.response.folders.folder[0].id = 2;
      data2.response.folders.folder[0].parentId = 1;
      data2.response.folders.folder[0].name = 'Channel1-Distributor1';

      let data3 = _.clone(data);
      data3.response.folders.folder[0].id = 3;
      data3.response.folders.folder[0].parentId = 2;
      data3.response.folders.folder[0].name = '2015-Channel1-Distributor1';

      let data4 = _.clone(data);
      data4.response.folders.folder[0].id = 4;
      data4.response.folders.folder[0].parentId = 3;
      data4.response.folders.folder[0].name = 'December-2015-Channel1-Distributor1';

      sinon.stub(ChallengeService, 'makeRequest')
          .onCall(0).returns(data1)
          .onCall(1).returns(data2)
          .onCall(2).returns(data3)
          .onCall(3).returns(data4);
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return correct folderId if all steps go well', function() {
      return ChallengeService.createFolder(options).should.eventually.have.property('folderId', 4);
    });

    it('should return correct folderId if folderId already exists in options', function() {
      options.folderId = 1;
      return ChallengeService.createFolder(options).should.eventually.have.property('folderId', 1);
    });

  });

  describe('#createChallenge', function(){

    var options, challenge;
    beforeEach(function(){
      options = {};
      challenge = {};
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.createChallenge.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return challenge id if challenge was created successully', function() {
      return ChallengeService.createChallenge(options, challenge).should.eventually.have.property('challengeId', 6241537);
    });

    it('should return empty string if challenge not defined', function() {
      return ChallengeService.createChallenge(options, null).should.eventually.have.property('challengeId', '');
    });

  });

  describe('#updateChallenge', function(){

    var options, challenge;
    beforeEach(function(){
      options = {};
      challenge = {};
      challenge.id = 6241537;
      challenge.name = 'name';
      challenge.description = 'description';
      challenge.rewards = 'point|111111|200';
      challenge.activeFlag = '1';
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.createChallenge.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return challenge id if challenge was updated successully', function() {
      return ChallengeService.updateChallenge(options, challenge).should.eventually.have.property('updatedChallengeId', 6241537);
    });

    it('should return empty string if challenge not defined', function() {
      return ChallengeService.updateChallenge(options, null).should.eventually.have.property('updatedChallengeId', '');
    });

  });

  describe('#createRule', function(){

    var options, rule;
    beforeEach(function(){
      options = {};
      rule = {};
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.createRule.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return rule id if rule was created successully', function() {
      return ChallengeService.createRule(options, rule).should.eventually.have.property('ruleId', 8301569);
    });

    it('should return empty string if rule not defined', function() {
      return ChallengeService.createRule(options, null).should.eventually.have.property('ruleId', '');
    });

  });

  describe('#createMetaDatum', function(){

    var options, metadatum;
    beforeEach(function(){
      options = {};
      metadatum = {};
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.createMetaDatum.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return ok if metadatum was created successully', function() {
      return ChallengeService.createMetaDatum(options, metadatum).should.eventually.have.property('status', 'ok');
    });

    it('should return empty string if metadatum not defined', function() {
      return ChallengeService.createMetaDatum(options, null).should.eventually.have.property('metadatumId', '');
    });

  });

  describe('#deleteChallenge', function(){

    var options, challengeId;
    beforeEach(function(){
      options = {};
      challengeId = 6241537;
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.deleteChallenge.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return deleted challenge id if challenge was deleted successully', function() {
      return ChallengeService.deleteChallenge(options, challengeId).should.eventually.have.property('deletedChallengeId', 6241537);
    });

    it('should return empty string if challengeId not defined', function() {
      return ChallengeService.deleteChallenge(options, null).should.eventually.have.property('deletedChallengeId', '');
    });

  });

  describe('#deleteRule', function(){

    var options, ruleId;
    beforeEach(function(){
      options = {};
      ruleId = 6241537;
      sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/admin.deleteChallenge.json");});
    });

    afterEach(function(){
      ChallengeService.makeRequest.restore();
    });

    it('should return deleted rule id if rule was deleted successully', function() {
      return ChallengeService.deleteRule(options, ruleId).should.eventually.have.property('deletedRuleId', 6241537);
    });

    it('should return empty string if challengeId not defined', function() {
      return ChallengeService.deleteRule(options, null).should.eventually.have.property('deletedRuleId', '');
    });

  });

  describe('#getMetadataList', function(){

    var options, result;

    beforeEach(function(){
      options = {};
      options.data = {};
      result = {};
      result.actionRuleId1 = true;
      result.actionRuleId2 = true;
      result.actionRuleId3 = true;
    });

    it('sales type challenge with all 3 action rules available should have 9 metadata in list', function() {
      options.data.challengeType = 'sales';
      return ChallengeService.getMetadataList(options, result).should.have.length(9);
    });

    it('premium type challenge with all 3 action rules available should have 6 metadata in list', function() {
      options.data.challengeType = 'premium';
      options.data.rule = [{'product':'product', 'brandId':'brandId'},{'product':'product', 'brandId':'brandId'},{'product':'product', 'brandId':'brandId'}];
      return ChallengeService.getMetadataList(options, result).should.have.length(6);
    });

    it('gateway type challenge should have 1 metadatum in list if tagName is FAVORITE_CONTENT', function() {
      options.data.challengeType = 'gateway';
      options.data.tagName = 'FAVORITE_CONTENT';
      return ChallengeService.getMetadataList(options, result).should.have.length(1);
    });

    it('gateway type challenge should have 3 metadata in list if tagName is not FAVORITE_CONTENT and 3 action rules are all available', function() {
      options.data.challengeType = 'gateway';
      options.data.content = ['content0', 'content1', 'content2'];
      options.data.tagName = 'CONTENT_VIEW';
      return ChallengeService.getMetadataList(options, result).should.have.length(3);
    });

  });

  describe('#createChallengeWithRulesAndMetadata', function(){

    var options, challenge;
    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
      challenge = {};
      sinon.stub(ChallengeService, 'createChallenge', function(){return require("../../json3/challenge.service.create.challenge.json");});
      sinon.stub(ChallengeService, 'createRule', function(){return require("../../json3/challenge.service.create.challenge.json");});
      sinon.stub(ChallengeService, 'createMetaDatum', function(){return require("../../json3/challenge.service.create.metadatum.json");});
    });

    afterEach(function(){
      ChallengeService.createChallenge.restore();
      ChallengeService.createRule.restore();
      ChallengeService.createMetaDatum.restore();
    });

    it('should return empty string as challenge id challenge is not defined', function() {
      return ChallengeService.createChallengeWithRulesAndMetadata(options, null).should.eventually.have.property('challengeId', '');
    });

    it('should return same challenge id if challenge already existed', function() {
      challenge.id = 111111;
      return ChallengeService.createChallengeWithRulesAndMetadata(options, challenge).should.eventually.have.property('challengeId', 111111);
    });

    it('should return ok if everything goes well', function() {
      return ChallengeService.createChallengeWithRulesAndMetadata(options, challenge).should.eventually.have.property('status', 'ok');
    });

    it('should return error if createChallenge() returns error', function() {
      ChallengeService.createChallenge.restore();
      sinon.stub(ChallengeService, 'createChallenge', function(){return require("../../json3/challenge.service.error.json");});
      return ChallengeService.createChallengeWithRulesAndMetadata(options, challenge).should.eventually.have.property('status', 'error');
    });

    it('should return error if createRule() returns error', function() {
      ChallengeService.createRule.restore();
      sinon.stub(ChallengeService, 'createRule', function(){return require("../../json3/challenge.service.error.json");});
      return ChallengeService.createChallengeWithRulesAndMetadata(options, challenge).should.eventually.have.property('status', 'error');
    });

    it('should return error if createMetaDatum() returns error', function() {
      ChallengeService.createMetaDatum.restore();
      sinon.stub(ChallengeService, 'createMetaDatum', function(){return require("../../json3/challenge.service.error.json");});
      return ChallengeService.createChallengeWithRulesAndMetadata(options, challenge).should.eventually.have.property('status', 'error');
    });

  });

  describe('#getOptions', function(){

    it('should return correct option object', function() {
      let body = require("../../json3/request.data.sales.challenge.json");
      return ChallengeService.getOptions(body).should.have.all.keys(['data', 'sessionKey', 'tagName', 'folders']);
    });

  });

  describe('#getFolderOptions', function(){

    it('should return correct folder option object', function() {
      let body = require("../../json3/request.data.sales.challenge.json");
      return ChallengeService.getFolderOptions(body).should.have.all.keys(['distributor', 'channel', 'year', 'month']);
    });

  });

  describe('#getChallengeListForOptions', function(){

    var options;
    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
    });

    it('should return 2 challenge in list if earlyStart is set to true', function() {
      return ChallengeService.getChallengeListForOptions(options).should.have.length(2);
    });

    it('should return 1 challenge in list if earlyStart is set to false', function() {
      options.data.earlyStart = false;
      return ChallengeService.getChallengeListForOptions(options).should.have.length(1);
    });

  });

  describe('#getRulelistForOptions', function(){

    var options;
    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
    });

    it('should return empty list if challengeId is not defined', function() {
      return ChallengeService.getRulelistForOptions(options).should.have.length(0);
    });

    it('should return 3 rules in list if provided with 3 rules in body data', function() {
      return ChallengeService.getRulelistForOptions(options, 111111).should.have.length(3);
    });

  });

  describe('#getRequestParams', function(){

    var options, qs;
    beforeEach(function(){
      let body = require("../../json3/request.data.sales.challenge.json");
      options = ChallengeService.getOptions(body);
      qs = {};
    });

    it('should return correct request parameters', function() {
      let value =  { headers: { ApiKey: 'nitro-Test', SessionKey: '' },
                    url: 'server',
                    qs: { newApi: true },
                    useQuerystring: true,
                    strictSSL: false,
                    rejectUnauthorized: false };
      return ChallengeService.getRequestParams(qs, options).should.eql(value);
    });

  });

});
