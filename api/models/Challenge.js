/**
 * Challenge.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },

        challengeName: {
            type: 'string',
            required: true
        },

        challengeType: {
            type: 'string'
        },

        distributor: {
            type: 'string'
        },

        channel: {
            type: 'string'
        },

        startDate: {
            type: 'integer'
        },

        endDate: {
            type: 'integer'
        },

        description: {
            type: 'string'
        },

        points: {
            type: 'integer'
        },

        brandId: {
            type: 'string'
        },

        sizeId: {
            type: 'string'
        },

        flavor: {
            type: 'string'
        },

        upc: {
            type: 'string'
        },

        active: {
            type: 'boolean'
        },

        earlyStart: {
            type: 'boolean'
        },

        repeatable: {
            type: 'boolean'
        },

        year: {
            type: 'integer'
        },

        month: {
            type: 'string'
        },

        blitz: {
            type: 'boolean'
        },

        distNumber: {
            type: 'integer'
        },

        distType: {
            type: 'string'
        },

        pointsPerCase: {
            type: 'boolean'
        },

        authorId: {
            type: 'integer'
        },

        rule: {
            type: 'json'
        },

        tagName: {
            type: 'string'
        },

        ruleOperator: {
            type: 'string'
        },

        nitroId: {
            type: 'array'
        },

        ruleId: {
            type: 'array'
        },

        content: {
            type: 'array'
        },

        folderId: {
            type: 'string'
        },

        pointCategoryId: {
            type: 'string'
        },

        selectedQuiz: {
            type: 'string'
        }
    }

};
