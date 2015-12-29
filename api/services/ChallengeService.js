/**
 * ChallengeService
 */
'use strict';

var co = require('co'),
 	  request = require("co-request");

//redefine console.log in order to mute logging
var console = {
  log: function(){}
};

var ChallengeService = {

/////////////////////////////////
/******** HELPER METHOD ********/
/////////////////////////////////
  createChallengeWithRulesAndMetadata: function(options, challenge){
    return co(function* (){
      console.log(' ** createChallengeWithRulesAndMetadata() ** \n');
      var result = {};
      result.ruleIdList = [];

      if(!challenge){
        result.status = 'ok';
        result.challengeId = '';
        return result;
      }

      //create challenge
      if(challenge.id){
        console.log('    challenge already exists\n');
        result.challengeId = challenge.id;
      }else{
        console.log('    create challenge\n');
        let challenge_result = yield ChallengeService.createChallenge(options, challenge);
        if(challenge_result.status == 'error'){
          result.status = 'error';
          result.statusMessage = 'Error occurred during creating challenge in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + challenge_result.statusMessage;
          return result;
        }
        result.challengeId = challenge_result.challengeId;
      }

      //create action rules
      console.log('    create action rules\n');
      var ruleList = ChallengeService.getRulelistForOptions(options, result.challengeId);
      let actionRule_result1 = yield ChallengeService.createRule(options, ruleList[0]);
      if(actionRule_result1.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating 1st action rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + actionRule_result1.statusMessage;
        return result;
      }
      if(actionRule_result1.ruleId != ''){
        result.actionRuleId1 = actionRule_result1.ruleId;
        result.ruleIdList.push(actionRule_result1.ruleId);
      }

      let actionRule_result2 = yield ChallengeService.createRule(options, ruleList[1]);
      if(actionRule_result2.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating 2nd action rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + actionRule_result2.statusMessage;
        return result;
      }
      if(actionRule_result2.ruleId != ''){
        result.actionRuleId2 = actionRule_result2.ruleId;
        result.ruleIdList.push(actionRule_result2.ruleId);
      }

      let actionRule_result3 = yield ChallengeService.createRule(options, ruleList[2]);
      if(actionRule_result3.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating 3rd action rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + actionRule_result3.statusMessage;
        return result;
      }
      if(actionRule_result3.ruleId != ''){
        result.actionRuleId3 = actionRule_result3.ruleId;
        result.ruleIdList.push(actionRule_result3.ruleId);
      }

      //create operator rule
      console.log('    create operator rule\n');
      let prereqRuleIds = '';
      result.ruleIdList.forEach(function(ruleId){
        prereqRuleIds += ((prereqRuleIds == '') ? ruleId : ',' + ruleId);
      });
      console.log('    prereqRuleIds: ' + prereqRuleIds + '\n');
      let operatorRule = {
        challengeId: result.challengeId,
        type: 'operator',
        prereqRuleIds: prereqRuleIds,
        preReqOperator: (!options.data.ruleOperator) ? 'and' : options.data.ruleOperator
      };
      let operatorRule_result = yield ChallengeService.createRule(options, operatorRule);
      if(operatorRule_result.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating operator rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + operatorRule_result.statusMessage;
        return result;
      }
      if(operatorRule_result.ruleId != ''){
        result.ruleIdList.push(operatorRule_result.ruleId);
      }

      //create preference rules
      console.log('    create preference rule\n');
      let prefRule1 = {
        challengeId: result.challengeId,
        type: 'preferencePrereq',
        custom: 'Dist Number|' + options.data.distNumber
      };

      let prefRule2 = {
        challengeId: result.challengeId,
        type: 'preferencePrereq',
        custom: options.data.distType + '|True'
      };

      let prefRule_result1 = yield ChallengeService.createRule(options, prefRule1);
      if(prefRule_result1.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating 1st pref rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + prefRule_result1.statusMessage;
        return result;
      }
      if(prefRule_result1.ruleId != ''){
        result.ruleIdList.push(prefRule_result1.ruleId);
      }

      let prefRule_result2 = yield ChallengeService.createRule(options, prefRule2);
      if(prefRule_result2.status == 'error'){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating 2nd pref rule in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + prefRule_result2.statusMessage;
        return result;
      }
      if(prefRule_result2.ruleId != ''){
        result.ruleIdList.push(prefRule_result2.ruleId);
      }

      //create metadata for each action rule
      console.log('    create metadata\n');
      var metadataList = ChallengeService.getMetadataList(options, result);
      let metadatum_result1 = ChallengeService.createMetaDatum(options, metadataList[0]);
      let metadatum_result2 = ChallengeService.createMetaDatum(options, metadataList[1]);
      let metadatum_result3 = ChallengeService.createMetaDatum(options, metadataList[2]);
      let metadatum_result4 = ChallengeService.createMetaDatum(options, metadataList[3]);
      let metadatum_result5 = ChallengeService.createMetaDatum(options, metadataList[4]);
      let metadatum_result6 = ChallengeService.createMetaDatum(options, metadataList[5]);
      let metadatum_result7 = ChallengeService.createMetaDatum(options, metadataList[6]);
      let metadatum_result8 = ChallengeService.createMetaDatum(options, metadataList[7]);
      let metadatum_result9 = ChallengeService.createMetaDatum(options, metadataList[8]);
      let metadata_response = yield [metadatum_result1,metadatum_result2,metadatum_result3,metadatum_result4,metadatum_result5,metadatum_result6,metadatum_result7,metadatum_result8,metadatum_result9];

      var isError = false;
      var errorMessage = '';
      metadata_response.forEach(function(metadatum_result){
        if(metadatum_result.status == 'error'){
          isError = true;
          errorMessage = metadatum_result.statusMessage;
        }
      });

      if(isError){
        result.status = 'error';
        result.statusMessage = 'Error occurred during creating metadatum in ChallengeService.createChallengeWithRulesAndMetadata(). Error message: ' + errorMessage;
        return result;
      }

      result.status = 'ok';
      return result;
    });
  },

  getMetadataList: function(options, result){
    var metadataList = [];

    if(options.data.challengeType == 'sales'){
      if(result.actionRuleId1){
        var metadatum1_1 = {
          name: 'brandId',
          value: options.data.brandId,
          ruleId: result.actionRuleId1
        };
        var metadatum1_2 = {
          name: 'flavor',
          value: options.data.flavor,
          ruleId: result.actionRuleId1
        };
        var metadatum1_3 = {
          name: 'upc',
          value: options.data.upc,
          ruleId: result.actionRuleId1
        };
        metadataList.push(metadatum1_1);
        metadataList.push(metadatum1_2);
        metadataList.push(metadatum1_3);
      }

      if(result.actionRuleId2){
        var metadatum2_1 = {
          name: 'brandId',
          value: options.data.brandId,
          ruleId: result.actionRuleId2
        };
        var metadatum2_2 = {
          name: 'flavor',
          value: options.data.flavor,
          ruleId: result.actionRuleId2
        };
        var metadatum2_3 = {
          name: 'upc',
          value: options.data.upc,
          ruleId: result.actionRuleId2
        };
        metadataList.push(metadatum2_1);
        metadataList.push(metadatum2_2);
        metadataList.push(metadatum2_3);
      }

      if(result.actionRuleId3){
        var metadatum3_1 = {
          name: 'brandId',
          value: options.data.brandId,
          ruleId: result.actionRuleId3
        };
        var metadatum3_2 = {
          name: 'flavor',
          value: options.data.flavor,
          ruleId: result.actionRuleId3
        };
        var metadatum3_3 = {
          name: 'upc',
          value: options.data.upc,
          ruleId: result.actionRuleId3
        };
        metadataList.push(metadatum3_1);
        metadataList.push(metadatum3_2);
        metadataList.push(metadatum3_3);
      }
    }else if(options.data.challengeType == 'premium'){
      if(result.actionRuleId1){
        var metadatum1_1 = {
          name: 'brandId',
          value: options.data.rule[0].brandId,
          ruleId: result.actionRuleId1
        };
        metadataList.push(metadatum1_1);

        if(options.data.rule[0].product){
          var metadatum1_2 = {
            name: 'upcDesc',
            value: options.data.rule[0].product,
            ruleId: result.actionRuleId1
          };
          metadataList.push(metadatum1_2);
        }
      }

      if(result.actionRuleId2){
        var metadatum2_1 = {
          name: 'brandId',
          value: options.data.rule[1].brandId,
          ruleId: result.actionRuleId2
        };
        metadataList.push(metadatum2_1);

        if(options.data.rule[1].product){
          var metadatum2_2 = {
              name: 'upcDesc',
              value: options.data.rule[1].product,
              ruleId: result.actionRuleId2
          };
          metadataList.push(metadatum2_2);
        }
      }

      if(result.actionRuleId3){
        var metadatum3_1 = {
          name: 'brandId',
          value: options.data.rule[2].brandId,
          ruleId: result.actionRuleId3
        };
        metadataList.push(metadatum3_1);

        if(options.data.rule[2].product){
          var metadatum3_2 = {
              name: 'upcDesc',
              value: options.data.rule[2].product,
              ruleId: result.actionRuleId3
          };
          metadataList.push(metadatum3_2);
        }
      }
    }else if (options.data.challengeType == 'gateway') {
      if(options.data.tagName == 'FAVORITE_CONTENT'){
        var metadatum_brand = {
          name: 'brandId',
          value: options.data.brandId,
          ruleId: result.actionRuleId1
        };
        metadataList.push(metadatum_brand);
      }else{
        if(result.actionRuleId1){
          var metadatum1 = {
            name: 'contentId',
            value: options.data.content[0],
            ruleId: result.actionRuleId1
          };
          metadataList.push(metadatum1);
        }

        if(result.actionRuleId2){
          var metadatum2 = {
            name: 'contentId',
            value: options.data.content[1],
            ruleId: result.actionRuleId2
          };
          metadataList.push(metadatum2);
        }

        if(result.actionRuleId3){
          var metadatum3 = {
            name: 'contentId',
            value: options.data.content[2],
            ruleId: result.actionRuleId3
          };
          metadataList.push(metadatum3);
        }
      }
    }else if (options.data.challengeType == 'quiz') {
      var metadatum = {
        name: 'id',
        value: options.data.selectedQuiz,
        ruleId: result.actionRuleId1
      };
      metadataList.push(metadatum);
    }

    console.log('    metadataList: \n' + metadataList + '\n');
    return metadataList;
  },

/////////////////////////////////
/********** NITRO APIs *********/
/////////////////////////////////

  /*
  * Retrieve admin sessionKey
  */
  loginAdmin: function(options){
    return co(function* (){
      console.log(' ** loginAdmin() ** \n');
      let result = {};

      // userId and password are currently retrieved from process env
      let nitroParams = {
          method: 'admin.loginAdmin',
          userId: process.env.NITRO_USERID,
          password: process.env.NITRO_PASSWORD
      };

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.loginAdmin(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.sessionKey = resObj.response.login.sessionKey;
      return result;
		});
  },

  /*
  * Retrieve Id for specified tag
  */
  getTagId: function(options){
    return co(function* (){
      console.log(' ** getTagId() ** \n');
      let result = {};

      var nitroParams = {
        method: 'admin.getActionTags'
      };

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getTagId(). Error message: ' + resObj.response.error.message;
        return result;
      }

      if(!resObj.response.tags.tag){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getTagId(). Error message: No actions in the site.';
        return result;
      }

      var tagId = '';
      // iterate tag array and try to find specified tag
      resObj.response.tags.tag.forEach(function(obj){
        if(obj.name == options.tagName){
          tagId = obj.id;
        }
      });

      if(tagId == ''){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getTagId(). Error message: Can\'t find specified action \'' + options.tagName + '\'.';
        return result;
      }

      result.status = 'ok';
      result.tagId = tagId;
      return result;
    });
  },

  /*
  * Retrieve Point Category Id (currently only get the default one)
  */
  getPointCategoryId: function(options){
    return co(function* (){
      console.log(' ** getPointCategoryId() ** \n');
      let result = {};

      var nitroParams = {
        method: 'admin.getSitePointCategories'
      };

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getPointCategoryId(). Error message: ' + resObj.response.error.message;
        return result;
      }

      if(!resObj.response.pointCategories.pointCategory){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getPointCategoryId(). Error message: No point categories in the site.';
        return result;
      }

      var pointCategoryId = '';
      // iterate pointCategory array and try to find default pointCategory
      resObj.response.pointCategories.pointCategory.forEach(function(obj){
        if(obj.isDefault == true){
          pointCategoryId = obj.id;
        }
      });

      if(pointCategoryId == ''){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getPointCategoryId(). Error message: Can\'t find default point category Id.';
        return result;
      }

      result.status = 'ok';
      result.pointCategoryId = pointCategoryId;
      return result;
    });
  },

  /*
  * Retrieve Folder Id (based on {Distributor} / {Channel} / {Year} / {Month})
  */
  getFolderId: function(options){
    return co(function* (){
      console.log(' ** getFolderId() ** \n');
      let result = {};

      var nitroParams = {
        method: 'admin.getFolders',
        type: 'challenge'
      };

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.getFolderId(). Error message: ' + resObj.response.error.message;
        return result;
      }

      if(!resObj.response.folders.folder){
        result.status = 'ok';
        result.folderId = '';
        return result;
      }

      var allFolders = resObj.response.folders.folder;

      //check if distributor folder exists
      var distributorFolderId = '';
      allFolders.forEach(function(obj){
        if(obj.name == options.folders.distributor.name){
          distributorFolderId = obj.id;
          options.folders.distributor.created = true;
          options.folders.channel.parentId = obj.id;
        }
      });

      if(distributorFolderId == ''){
        result.status = 'ok';
        result.folderId = '';
        return result;
      }

      //check if channel folder exists
      var channelFolderId = '';
      allFolders.forEach(function(obj){
        if(obj.name == options.folders.channel.name && obj.parentId == options.folders.channel.parentId){
          channelFolderId = obj.id;
          options.folders.channel.created = true;
          options.folders.year.parentId = obj.id;
        }
      });

      if(channelFolderId == ''){
        result.status = 'ok';
        result.folderId = '';
        return result;
      }

      //check if year folder exists
      var yearFolderId = '';
      allFolders.forEach(function(obj){
        if(obj.name == options.folders.year.name && obj.parentId == options.folders.year.parentId){
          yearFolderId = obj.id;
          options.folders.year.created = true;
          options.folders.month.parentId = obj.id;
        }
      });

      if(yearFolderId == ''){
        result.status = 'ok';
        result.folderId = '';
        return result;
      }

      //check if month folder exists
      var monthFolderId = '';
      allFolders.forEach(function(obj){
        if(obj.name == options.folders.month.name && obj.parentId == options.folders.month.parentId){
          monthFolderId = obj.id;
          options.folders.month.created = true;
        }
      });

      if(monthFolderId == ''){
        result.status = 'ok';
        result.folderId = '';
        return result;
      }else{
        result.status = 'ok';
        result.folderId = monthFolderId;
        return result;
      }
    });
  },

  /*
  * Create Folder If Necessary (based on information stored in options.folder)
  */
  createFolder: function(options){
    return co(function* (){
      console.log(' ** createFolder() ** \n');

      console.log('    option folders: ', JSON.stringify(options.folders) + '\n');
      console.log('    option folderId: ', options.folderId + '\n');

      // will add attributes "name" and "parentId" later if necessary
      var nitroParams = {
        method: 'admin.createFolder',
        type: 'challenge'
      };

      var result = {};

      // if already have folderId, then simply return it
      if(options.folderId != ''){
        console.log('  * folderId already exists * \n');
        result.status = 'ok';
        result.folderId = options.folderId;
        return result;
      }

      console.log('  * step 1: distributor folder * \n');

      //if distributor folder doesn't exist, then create it
      if(!options.folders.distributor.created){
          console.log('    create distributor folder \n');
          nitroParams.name = options.folders.distributor.name;

          let resObj = yield ChallengeService.makeRequest(nitroParams, options);

          if(resObj.response.error){
            result.status = 'error';
            result.statusMessage = 'Error occurred in ChallengeService.createFolder() when trying to create distributor folder. Error message: ' + resObj.response.error.message;
            return result;
          }

          //update options
          options.folders.distributor.created = true;
          options.folders.channel.parentId = resObj.response.folders.folder[0].id;
      }

      console.log('  * step 2: channel folder * \n');

      //if channel folder doesn't exist, then create it
      if(!options.folders.channel.created){
        console.log('    create channel folder \n');
        nitroParams.name = options.folders.channel.name;
        nitroParams.parentId = options.folders.channel.parentId;

        let resObj = yield ChallengeService.makeRequest(nitroParams, options);

        if(resObj.response.error){
          result.status = 'error';
          result.statusMessage = 'Error occurred in ChallengeService.createFolder() when trying to create channel folder. Error message: ' + resObj.response.error.message;
          return result;
        }

        //update options
        options.folders.channel.created = true;
        options.folders.year.parentId = resObj.response.folders.folder[0].id;
      }

      console.log('  * step 3: year folder * \n');

      //if year folder doesn't exist, then create it
      if(!options.folders.year.created){
        console.log('    create year folder \n');
        nitroParams.name = options.folders.year.name;
        nitroParams.parentId = options.folders.year.parentId;

        let resObj = yield ChallengeService.makeRequest(nitroParams, options);

        if(resObj.response.error){
          result.status = 'error';
          result.statusMessage = 'Error occurred in ChallengeService.createFolder() when trying to create year folder. Error message: ' + resObj.response.error.message;
          return result;
        }

        //update options
        options.folders.year.created = true;
        options.folders.month.parentId = resObj.response.folders.folder[0].id;
      }

      console.log('  * step 4: month folder * \n');

      //if month folder doesn't exist, then create it
      if(!options.folders.month.created){
        console.log('    create month folder \n');
        nitroParams.name = options.folders.month.name;
        nitroParams.parentId = options.folders.month.parentId;

        let resObj = yield ChallengeService.makeRequest(nitroParams, options);

        if(resObj.response.error){
          result.status = 'error';
          result.statusMessage = 'Error occurred in ChallengeService.createFolder() when trying to create month folder. Error message: ' + resObj.response.error.message;
          return result;
        }

        //update options
        options.folders.month.created = true;
        options.folderId = resObj.response.folders.folder[0].id;
      }

      result.status = 'ok';
      result.folderId = options.folderId;
      return result;
    });
  },

  /*
  * Create Challenge
  */
  createChallenge: function(options, challenge){
    return co(function* (){
      console.log(' ** createChallenge() ** \n');
      var result = {};

      if(!challenge){
        result.status = 'ok';
        result.challengeId = '';
        return result;
      }

      var nitroParams = {
        method: 'admin.createChallenge'
      };
      _.extend(nitroParams, challenge);

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.createChallenge(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.challengeId = resObj.response.challenges.challenge[0].id;
      return result;
    });
  },

  /*
  * Update Challenge
  */
  updateChallenge: function(options, challenge){
    return co(function* (){
      console.log(' ** updateChallenge() ** \n');
      var result = {};

      if(!challenge){
          result.status = 'ok';
          result.updatedChallengeId = '';
          return result;
      }

      var nitroParams = {
        method: 'admin.updateChallenge',
        challengeId: challenge.id,
        name: challenge.name,
        description: challenge.description,
        rewards: challenge.rewards,
        activeFlag: challenge.activeFlag
      };

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.updateChallenge(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.updatedChallengeId = challenge.id;
      return result;

    });
  },

  /*
  * Create Rule
  */
  createRule: function(options, rule){
    return co(function* (){
      console.log(' ** createRule() ** \n');
      var result = {};

      if(!rule){
        result.status = 'ok';
        result.ruleId = '';
        return result;
      }

      var nitroParams = {
        method: 'admin.createRule'
      };
      _.extend(nitroParams, rule);

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.createRule(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.ruleId = resObj.response.rule.id;
      return result;
    });
  },

  /*
  * Create Metadata
  */
  createMetaDatum: function(options, metadatum){
    return co(function* (){
      console.log(' ** createMetaDatum() ** \n');
      var result = {};

      if(!metadatum){
        result.status = 'ok';
        result.metadatumId = '';
        return result;
      }

      var nitroParams = {
        method: 'admin.createMetadatum'
      };
      _.extend(nitroParams, metadatum);

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.createMetaDatum(). Error message: ' + resObj.response.error.message;
        return Promise.resolve(result);
      }

      result.status = 'ok';
      return result;
    });
  },

  /*
  * Delete Challenge
  */
  deleteChallenge: function(options, challengeId){
    return co(function* (){
      console.log(' ** deleteChallenge() ** \n');
      var result = {};

      if(!challengeId){
        result.status = 'ok';
        result.deletedChallengeId = '';
        return result;
      }

      var nitroParams = {
        method: 'admin.deleteChallenge',
        challengeId: challengeId
      }

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.deleteChallenge(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.deletedChallengeId = challengeId;
      return result;
    });
  },

  /*
  * Delete Rule
  */
  deleteRule: function(options, ruleId){
    return co(function* (){
      console.log(' ** deleteRule() ** \n');
      var result = {};

      if(!ruleId){
        result.status = 'ok';
        result.deletedRuleId = '';
        return result;
      }

      var nitroParams = {
        method: 'admin.deleteRule',
        ruleId: ruleId
      }

      let resObj = yield ChallengeService.makeRequest(nitroParams, options);

      if(resObj.response.error){
        result.status = 'error';
        result.statusMessage = 'Error occurred in ChallengeService.deletedRule(). Error message: ' + resObj.response.error.message;
        return result;
      }

      result.status = 'ok';
      result.deletedRuleId = ruleId;
      return result;
    });
  },

/////////////////////////////////
/****** UTILITY FUNCITONS ******/
/////////////////////////////////

  /*
  * Build basic options
  */
  getOptions: function(data){
    console.log('** getOptions **\n');
    var options = {
        data: data,
        sessionKey: '',
        tagName: data.tagName,
        folders: ChallengeService.getFolderOptions(data)
    };
    return options;
  },

  /*
  * Build Folder Options for options
  */
  getFolderOptions: function(data){
    console.log('** getFolderOptions **\n');
    var folderOptions = {
     distributor: {
       name: data.distributor,
       parentId: '',
       created: false
     },
     channel: {
       name: data.channel + '-' + data.distributor,
       parentId: '',
       created: false
     },
     year: {
       name: data.year + '-' + data.channel + '-' + data.distributor,
       parentId: '',
       created: false
     },
     month: {
       name: data.month + '-' + data.year + '-' + data.channel + '-' + data.distributor,
       parentId: '',
       created: false
     }
   }
   return folderOptions;
 },

 /*
  * Build challenge list
  */
  getChallengeListForOptions: function(options){
    console.log('** getChallengeListForOptions **\n');

    var data = options.data;

    var challengeList = [];

    var challenge = {
      name: data.challengeName + ' - ' + data.month + ' ' + data.year +
      ' #{ ' + data.distributor + ' : ' + data.channel + ' : ' +
      data.year + ' : ' + data.month,
      description: data.description,
      activeFlag: (data.active) ? "1" : "0",
      applyMultiplier: (data.pointsPerCase) ? "1" : "0",
      repeatable: (data.repeatable) ? "1" : "0",
      start: data.startDate,
      end: data.endDate,
      folderId: options.folderId,
      rewards: 'point|' + options.pointCategoryId + '|' + data.points
    }

    // modify name if blitz is true
    if(data.blitz){
      challenge.name += ' : Blitz';
    }

    // create the 2nd challenge and modify corresponding attributes if earlyStart is true
    if(data.earlyStart){
      var challenge2 = _.clone(challenge);

      var start = Number(data.startDate);
      var end = Number(data.endDate);
      var half = (end - start)/2;

      challenge.end = start+half;
      challenge.rewards = 'point|' + options.pointCategoryId + '|' + Number(data.points)*2;

      if(challenge.name.indexOf('Blitz') > -1) {
        challenge.name += ' Early 1';
      }
      else{
        challenge.name += ' : Early 1';
      }

      challenge2.start = start+half+1;
      if(challenge2.name.indexOf('Blitz') > -1) {
        challenge2.name += ' Early 2 }';
      }
      else{
        challenge2.name += ' : Early 2 }';
      }

      challengeList.push(challenge2);
    }

    challenge.name += ' }';
    challengeList.push(challenge);

    console.log('    challengeList:\n ', JSON.stringify(challengeList) + '\n');

    return challengeList;
  },

  /*
  * Build rule list
  */
  getRulelistForOptions: function(options, challengeId){
    console.log('** getChallengeListForOptions **\n');

    var data = options.data;

    var ruleList = [];

    // if challengeId is undefined, then return empty ruleList
    if(!challengeId){
      return ruleList;
    }

    if(data.rule) {
      data.rule.forEach(function(obj){
        obj.challengeId = challengeId;
        obj.tagId = options.tagId;
        obj.operator = "GE";
        ruleList.push(obj);
      });
    }

    console.log('    ruleList:\n ', ruleList + '\n');
    return ruleList;
  },

  /*
  * Build Request Params for co-request
  */
  getRequestParams: function(qs, options){
    // extend query parameters
    _.extend(qs, {
        newApi: true
    });

    // setup request parameters
    var requestParams = {
      headers:{
          "ApiKey": process.env.NITRO_ENV + '-' + process.env.NITRO_API_KEY,
          "SessionKey": options.sessionKey
      },
      url: process.env.NITRO_SERVER,
      qs: qs,
      useQuerystring: true
    };

    // need to set strictSSL and rejectUnauthorized attributes to false
    // when testing with localhost, otherwise will cause certification errors
    if(process.env.ENVIRONMENT == 'localhost'){
      requestParams.strictSSL = false;
      requestParams.rejectUnauthorized = false;
    }

    // console.log('requestParams: ', requestParams);
    return requestParams;
  },


  /*
  * Make Request and Parse Response
  */
  makeRequest: function(nitroParams, options){
    return co(function* (){
      let requestParams = ChallengeService.getRequestParams(nitroParams, options);
      let response = yield request(requestParams);
      let resObj = JSON.parse(response.body);
      return resObj;
    });
  }

}//end ChallengeService


module.exports = ChallengeService;
