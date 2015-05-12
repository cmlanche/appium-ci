"use strict";

var gulp = require('gulp'),
    utils = require('../lib/utils'),
    path = require('path');
    // uploadToS3 = require("../lib/s3-fast-upload");
    // _ = require('underscore');

var appiumRoot = global.appiumRoot;
var uploadServer = process.env.BUILD_UPLOAD_SERVER;

gulp.task('run-ios-build',
    ['prepare-dirs'],function () {
  return utils.smartSpawn(
    path.resolve(global.sideSims, 'configure.sh'),
    ['6.1.1'],
    {
      print: 'Configuring xCode 6.1.1',
      cwd: global.sideSims,
    }
  ).promise.then(function() {
    return utils.executeShellCommands([
      'rm -rf node_modules',
      'npm cache clean']);
  }).then(function() {
    return utils.smartSpawn(
      path.resolve(appiumRoot, 'reset.sh'),
      ['--ios', '--dev', '--hardcore', '--verbose', '--no-npmlink'],
      {
        print: 'Running reset.sh',
        cwd: appiumRoot,
      }
    ).promise;
  }).then(function () {
    // Dirty workaround
    //console.log('Replacing ApiDemo symlink by real directory');
    //return utils.executeShellCommands([
      //'rm -rf ' + utils.wrapPath(path.resolve(appiumRoot, 'sample-code/apps/ApiDemos')),
      //'mv ' + utils.wrapPath(path.resolve(appiumRoot, 'submodules/ApiDemos')) +
        //' ' + utils.wrapPath(path.resolve(appiumRoot, 'sample-code/apps/'))
    //]);
  }).then(function () {
    return utils.smartSpawn(
      'tar',
      [
        'cfjp',
        path.resolve(global.artifactsDir, 'appium-build.bz2'),
        '--exclude=.git',
        '--exclude=artifacts',
        '--exclude=submodules',
        '.'
      ],
      {
        print: 'Archiving build',
        cwd: appiumRoot,
      }
    ).promise;
  }).then(function() {
    var dir = path.join('builds', process.env.JOB_NAME, process.env.BUILD_NUMBER);
    return utils.smartSpawn(
      'ssh',
      [
        '-o',
        "UserKnownHostsFile=/dev/null",
        '-o',
        'StrictHostKeyChecking=no',
        'appium@' + uploadServer,
        'mkdir -p ' + utils.escapePath(dir)
      ],
      {
        print: 'Creating dir: ' + dir,
        cwd: appiumRoot,
      }
    ).promise;
  }).then(function() {
    return utils.smartSpawn(
      'scp',
      [
        '-o',
        "UserKnownHostsFile=/dev/null",
        '-o',
        'StrictHostKeyChecking=no',
        path.resolve(global.artifactsDir, 'appium-build.bz2'),
        'appium@' + uploadServer + ':' + utils.escapePath(path.join('builds', process.env.JOB_NAME, process.env.BUILD_NUMBER, 'appium-build.bz2'))
      ],
      {
        print: 'Uploading build to: ' + uploadServer,
        cwd: appiumRoot,
      }
    ).promise;
   });
});
