/**
 * ChallengeController
 *
 * @description :: Server-side logic for managing challenges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var co = require('co');

//redefine console.log in order to mute logging
var console = {
  log: function(){}
};

module.exports = {

  _config: {
      rest: true,
  },

  find: function(req, res){
    co(function* () {
      console.log('*** create challenge *** \n');
      var query = req.query;
      var sort = false;
      if(query.startDate){
        query.startDate = { '>': query.startDate };
      }
      if(query.endDate){
        query.endDate = {'<': query.endDate};
      }

      console.log('query: ', query);

      if(query.sort){
        //is this json? (for multiple sort params)
        try{
            sort = JSON.parse(query.sort);
        }
        catch(e) {
            sort = query.sort;
        }
        delete query.sort;
      }

      if(sort){
        var queryObj = {
            "where": query,
            "sort": sort
        };
      }
      else {
        var queryObj = { where: query };
      }

      let result = yield Challenge.find(queryObj);
      return result;
    })
    .then(function(result){
      res.send(result);
    })
    .catch(function(err) {
      console.log('*** catch ***');
      console.log(err);
      var error = {};
      error.status = 'error';
      error.statusMessage = err;
      res.send(500, error);
    });
  },

  create: function(req, res){
    co(function* () {
      console.log('*** createChallenge *** \n');

      //get a basic challenges option object back, constructed with our data
      var options = ChallengeService.getOptions(req.body);
      console.log('options:\n ', options + '\n');

      //get admin session key
      let sessionKey_result = yield ChallengeService.loginAdmin(options)
      if(sessionKey_result.status == 'error') return sessionKey_result;
      options.sessionKey = sessionKey_result.sessionKey;

      //get tagId
      let tagId_result = yield ChallengeService.getTagId(options);
      if(tagId_result.status == 'error') return tagId_result;
      options.tagId = tagId_result.tagId;

      //get pointCategoryId
      let pointCategoryId_result = yield ChallengeService.getPointCategoryId(options);
      if(pointCategoryId_result.status == 'error') return pointCategoryId_result;
      options.pointCategoryId = pointCategoryId_result.pointCategoryId;

      //get folderId
      let folderId_result = yield ChallengeService.getFolderId(options);
      if(folderId_result.status == 'error') return folderId_result;
      options.folderId = folderId_result.folderId;

      //create folder
      let createFolder_result = yield ChallengeService.createFolder(options);
      if(createFolder_result.status == 'error') return createFolder_result;
      options.folderId = createFolder_result.folderId;

      //create challenges in nitro (also action rules, operator rule, preference rules, and metadata)
      options.challengeList = ChallengeService.getChallengeListForOptions(options);

      let createChallenge_result1 = yield ChallengeService.createChallengeWithRulesAndMetadata(options, options.challengeList[0]);
      if(createChallenge_result1.status == 'error') return createChallenge_result1;

      let createChallenge_result2 = yield ChallengeService.createChallengeWithRulesAndMetadata(options, options.challengeList[1]);
      if(createChallenge_result2.status == 'error') return createChallenge_result2;

      //save to db
      let entry = _.clone(options.data);
      entry.nitroId = [];
      if(entry.earlyStart){
        entry.nitroId.push(createChallenge_result1.challengeId);
        entry.nitroId.push(createChallenge_result2.challengeId);
      }else{
        entry.nitroId.push(createChallenge_result1.challengeId);
      }
      entry.startDate = Number(entry.startDate);
      entry.endDate = Number(entry.endDate);
      entry.folderId = options.folderId;
      entry.pointCategoryId = options.pointCategoryId;
      entry.ruleId = createChallenge_result1.ruleIdList.concat(createChallenge_result2.ruleIdList);
      let db_result = yield Challenge.create(entry);

      //prepare return data
      delete createChallenge_result1.actionRuleId1;
      delete createChallenge_result1.actionRuleId2;
      delete createChallenge_result1.actionRuleId3;
      delete createChallenge_result1.ruleIdList;

      delete createChallenge_result2.actionRuleId1;
      delete createChallenge_result2.actionRuleId2;
      delete createChallenge_result2.actionRuleId3;
      delete createChallenge_result2.ruleIdList;

      var result = {};
      result.status = 'ok';
      result.nitro = [createChallenge_result1, createChallenge_result2];
      result.db = db_result;
      return result;
    })
    .then(function(result){
      res.send(result);
    })
    .catch(function(err) {
      console.log('*** catch ***');
      console.log(err);
      var error = {};
      error.status = 'error';
      error.statusMessage = err;
      res.send(500, error);
    });
  },

  update: function(req, res){
    co(function* () {
      console.log('*** update challenge *** \n');
      var options = ChallengeService.getOptions(req.body);
      delete options.tagName;
      delete options.folders;
      options.update = true;
      var result = {};

      //get admin session key
      let sessionKey_result = yield ChallengeService.loginAdmin(options)
      if(sessionKey_result.status == 'error') return sessionKey_result;
      options.sessionKey = sessionKey_result.sessionKey;

      //get record from db
      let record = yield Challenge.findOne({id:req.params.id});
      if(typeof record === 'undefined'){
        result.status = 'error';
        result.statusMessage = 'Can\'t find challenge in database.';
        return result;
      }

      options.challengeIdList = record.nitroId;
      options.ruleIdList = record.ruleId;
      options.folderId = record.folderId;
      options.pointCategoryId = record.pointCategoryId;

      console.log('    challengeIdList:\n ',options.challengeIdList + '\n');
      console.log('    ruleIdList:\n ',options.ruleIdList);
      console.log('    pointCategoryId: ',options.pointCategoryId + '\n');

      //delete all the rules
      let delete_result1 = yield ChallengeService.deleteRule(options, options.ruleIdList[0]);
      let delete_result2 = yield ChallengeService.deleteRule(options, options.ruleIdList[1]);
      let delete_result3 = yield ChallengeService.deleteRule(options, options.ruleIdList[2]);
      let delete_result4 = yield ChallengeService.deleteRule(options, options.ruleIdList[3]);
      let delete_result5 = yield ChallengeService.deleteRule(options, options.ruleIdList[4]);
      let delete_result6 = yield ChallengeService.deleteRule(options, options.ruleIdList[5]);
      let delete_result7 = yield ChallengeService.deleteRule(options, options.ruleIdList[6]);
      let delete_result8 = yield ChallengeService.deleteRule(options, options.ruleIdList[7]);
      let delete_result9 = yield ChallengeService.deleteRule(options, options.ruleIdList[8]);
      let delete_result10 = yield ChallengeService.deleteRule(options, options.ruleIdList[9]);
      let delete_result11 = yield ChallengeService.deleteRule(options, options.ruleIdList[10]);
      let delete_result12 = yield ChallengeService.deleteRule(options, options.ruleIdList[11]);

      //update challenge related info in nitro (name, description, rewards, activeFlag)
      options.challengeList = ChallengeService.getChallengeListForOptions(options);
      options.challengeList[0].id = options.challengeIdList[0];
      if(options.data.earlyStart){
        options.challengeList[1].id = options.challengeIdList[1];
      }

      let update_result1 = yield ChallengeService.updateChallenge(options, options.challengeList[0]);
      if(update_result1.status == 'error') return update_result1;

      let update_result2 = yield ChallengeService.updateChallenge(options, options.challengeList[1]);
      if(update_result2.status == 'error') return update_result2;

      //recreate all rules
      let createChallenge_result1 = yield ChallengeService.createChallengeWithRulesAndMetadata(options, options.challengeList[0]);
      if(createChallenge_result1.status == 'error') return createChallenge_result1;

      let createChallenge_result2 = yield ChallengeService.createChallengeWithRulesAndMetadata(options, options.challengeList[1]);
      if(createChallenge_result2.status == 'error') return createChallenge_result2;

      //update record in db
      let entry = _.clone(options.data);
      entry.nitroId = [];
      if(entry.earlyStart){
        entry.nitroId.push(createChallenge_result1.challengeId);
        entry.nitroId.push(createChallenge_result2.challengeId);
      }else{
        entry.nitroId.push(createChallenge_result1.challengeId);
      }
      entry.startDate = Number(entry.startDate);
      entry.endDate = Number(entry.endDate);
      entry.folderId = options.folderId;
      entry.pointCategoryId = options.pointCategoryId;
      entry.ruleId = createChallenge_result1.ruleIdList.concat(createChallenge_result2.ruleIdList);
      let db_result = yield Challenge.update({id:req.params.id}, entry);

      //prepare return data
      delete createChallenge_result1.actionRuleId1;
      delete createChallenge_result1.actionRuleId2;
      delete createChallenge_result1.actionRuleId3;
      delete createChallenge_result1.ruleIdList;

      delete createChallenge_result2.actionRuleId1;
      delete createChallenge_result2.actionRuleId2;
      delete createChallenge_result2.actionRuleId3;
      delete createChallenge_result2.ruleIdList;

      result.status = 'ok';
      result.nitro = [createChallenge_result1, createChallenge_result2];
      result.db = db_result;
      return result;
    })
    .then(function(result){
      res.send(result);
    })
    .catch(function(err) {
      console.log('*** catch ***');
      console.log(err);
      var error = {};
      error.status = 'error';
      error.statusMessage = err;
      res.send(500, error);
    });
  },

  destroy: function(req, res){
    co(function* () {
      console.log('*** destroy challenge *** \n');
      var options = {};
      var result = {};

      //get admin session key
      let sessionKey_result = yield ChallengeService.loginAdmin(options)
      if(sessionKey_result.status == 'error') return sessionKey_result;
      options.sessionKey = sessionKey_result.sessionKey;

      //get record from db
      let record = yield Challenge.findOne({id:req.params.id});
      if(typeof record === 'undefined'){
        result.status = 'error';
        result.statusMessage = 'Can\'t find challenge in database.';
        return result;
      }

      //delete challenges from nitro
      let delete_result1 = yield ChallengeService.deleteChallenge(options, record.nitroId[0]);
      if(delete_result1.status == 'error') return delete_result1;

      let delete_result2 = yield ChallengeService.deleteChallenge(options, record.nitroId[1]);
      if(delete_result2.status == 'error') return delete_result2;

      //delete record from db
      let delete_db_result = yield Challenge.destroy({id:req.params.id});

      //prepare return data
      result.status = 'ok';
      result.deletedChallengeId = [];
      if(delete_result1.deletedChallengeId != ''){
        result.deletedChallengeId.push(delete_result1.deletedChallengeId);
      }
      if(delete_result2.deletedChallengeId != ''){
        result.deletedChallengeId.push(delete_result2.deletedChallengeId);
      }

      return result;
    })
    .then(function(result){
      res.send(result);
    })
    .catch(function(err) {
      console.log('*** catch ***');
      console.log(err);
      var error = {};
      error.status = 'error';
      error.statusMessage = err;
      res.send(500, error);
    });
  }

};
