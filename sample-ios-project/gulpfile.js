"use strict";

var gulp = require('gulp'),
    _ = require('lodash'),
    boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp),
    DEFAULTS = require('appium-gulp-plugins').boilerplate.DEFAULTS;

var argv = require('yargs').argv;

boilerplate({
  build: 'sample-android-project',
  jscs: false,
  e2eTest: _.defaults({
    xCode: true,
    xCodeVersion: argv.xcodeVersion || '6.1.1'
  }, DEFAULTS.e2eTest)
});