"use strict";

var gulp = require('gulp'),
    utils = require('../lib/utils'),
    path = require('path');
    // uploadToS3 = require("../lib/s3-fast-upload");
    // _ = require('underscore');

gulp.task('run-ios-build',
    ['prepare-dirs'],function () {
  return utils.smartSpawn(
    path.resolve(global.sideSims, 'configure.sh'),
    ['6.1.1'],
    {
      print: 'Configuring xCode 6.1.1',
      cwd: global.sideSims,
    }
  ).promise.then(function () {
    return utils.executeShellCommands([
      'rm -rf node_modules',
      'npm cache clean']);
  }).then(function () {
    return utils.smartSpawn(
      path.resolve(global.appiumRoot, 'reset.sh'),
      ['--ios', '--dev', '--hardcore', '--verbose', '--no-npmlink'],
      {
        print: 'Running reset.sh',
        cwd: global.appiumRoot,
      }
    ).promise;
  }).then(function () {
    return utils.smartSpawn(
      'tar',
      [
        'cfzp',
        path.resolve(global.artifactsDir, 'appium-build.tgz'),
        '--exclude=.git',
        '--exclude=artifacts',
        '--exclude=submodules',
        '.'
      ],
      {
        print: 'Archiving build',
        cwd: global.appiumRoot,
      }
    ).promise;
  }).then(function () {
    return utils.uploadBuild();
  });
});
