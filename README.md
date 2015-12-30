# sails-unit-test

repo中的code是sailsjs项目中的部分截取，目的是为了下面学习sailsjs unit tests时写一些笔记做参照

sailsjs基本上自带了unit test的工具，详情见[这里](http://sailsjs.org/documentation/concepts/testing)

## 配置文件
/test 目录下的bootstrap.test.js是用来为unit test做配置，是每次运行unit test时最先运行的文件。在此处sails进行lift，第一个参数是一个configuration object，在此可以传入environment使用的参数，本例中是unitTest。

这个unitTest文件保存在config/env/目录下，里面定义了使用哪一个port，log的level是什么，数据库连接(unit test时一般使用sails-disk adapter)

## 测试工具

sails默认的测试framework是mocha，安装mocha即可以使用

本案例中使用的测试工具包括sinon,chai-as-promised,以及supertest；code coverage工具使用istanbul和grunt-mocha-istanbul

*sinon* 主要是使用sinon.stub - 用来模拟某个函数的输出。API使用看[这里](http://sinonjs.org/)
```
var sinon = require('sinon');

beforeEach(function(){
  sinon.stub(ChallengeService, 'makeRequest', function(){return require("../../json3/error.json");});
});

afterEach(function(){
  ChallengeService.makeRequest.restore();
});
```

*chai-as-promised* 主要是用来做assersion，注意eventually的使用 - 如果被测试的函数返回值是promise，则加eventually，反之不加，具体看[这里](https://github.com/domenic/chai-as-promised/)。
chai API使用看[这里](http://chaijs.com/)
```
var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var should = chai.should();

it('should return ok if response contains the specified tag name', function() {
  return ChallengeService.getTagId(options).should.eventually.have.property('status', 'ok');
});

it('should return correct option object', function() {
  let body = require("../../json3/request.data.sales.challenge.json");
  return ChallengeService.getOptions(body).should.have.all.keys(['data', 'sessionKey', 'tagName', 'folders']);
});
```

*supertest* 主要是用来测试controller，最上面sailsjs官方链接中有example。API使用看[这里](https://github.com/visionmedia/supertest)
```
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
```
补充一句，由于我们数据库的connection使用的是sails-disk，所有测试时候的数据库读写都会在硬盘中进行。每一个涉及到数据库测试的describe要自己准备数据库测试数据，也要自己清理数据库测试数据.

本案例在before()和after()方法中操作，具体看ChallengeController.test.js。另外注意区分before()与beforeEach(),after()与afterEach()的区别。

_注意: javascript都是值引用，所以下面代码中当修改json file里数据的时候，要用 _.clone()，否则原json file中的值会被改变._
```
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

  ...
}；
```

*code coverage* 使用了istanbul和grunt-mocha-istanbul(见package.json)，添加了 tasks/register/test.js 和
tasks/config/mocha_istanbul.js 两个文件，然后在命令行中run: grunt test

不是太熟悉grunt，但看起来先是register了一个名为'test'的task，然后这个task的dependency是名为'mocha_istanbul'的task，冒号后面姑且认为是参数。
```
module.exports = function (grunt) {
    grunt.registerTask('test', [
        'mocha_istanbul:coverage'
    ]);
};
```
mocha_istanbul这个task中设定了coverage参数的具体内容 - src表示查看哪个folder找**.test.js，新生成的coverageFolder叫什么，root folder是哪个... 具体看[这里](https://gotwarlost.github.io/istanbul/)
```
module.exports = function(grunt) {
  grunt.config.set('mocha_istanbul', {
    coverage: {
        src: 'test', // the folder, not the files
        options: {
            coverageFolder: 'coverage',
            mask: '**/*.test.js',
            root: 'api/'
        }
    }
  });
  grunt.loadNpmTasks('grunt-mocha-istanbul');
};
```

## mute logging

一个mute logging的小trick，具体见ChallengeController.js

```
//redefine console.log in order to mute logging
var console = {
  log: function(){}
};
```
